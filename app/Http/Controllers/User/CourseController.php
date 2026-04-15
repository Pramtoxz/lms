<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Enrollment::with(['course.lessons' => function ($q) {
            $q->orderBy('order')->limit(1);
        }])
            ->where('user_id', Auth::id());

        if ($request->filled('search')) {
            $query->whereHas('course', function ($q) use ($request) {
                $q->whereLike('title', "%{$request->search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $enrollments = $query->latest()->paginate(10)->withQueryString();

        $enrollments->getCollection()->transform(function ($enrollment) {
            $enrollment->first_lesson_id = $enrollment->course->lessons->first()?->id;
            $enrollment->passed_exam = \App\Models\ExamResult::where('user_id', Auth::id())
                ->where('course_id', $enrollment->course_id)
                ->where('is_passed', true)
                ->exists();

            return $enrollment;
        });

        return Inertia::render('user/courses/index', [
            'enrollments' => $enrollments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function browse(Request $request): Response
    {
        $query = Course::where('is_published', true)
            ->withCount('lessons');

        if ($request->filled('search')) {
            $query->whereLike('title', "%{$request->search}%");
        }

        if ($request->filled('type')) {
            if ($request->type === 'free') {
                $query->where('is_free', true);
            } elseif ($request->type === 'paid') {
                $query->where('is_free', false);
            }
        }

        $courses = $query->latest()->paginate(12)->withQueryString();
        $enrolledCourseIds = Enrollment::where('user_id', Auth::id())
            ->pluck('course_id')
            ->toArray();

        return Inertia::render('user/courses/browse', [
            'courses' => $courses,
            'enrolledCourseIds' => $enrolledCourseIds,
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function show(Course $course): Response
    {
        if (! $course->is_published) {
            abort(404, 'Course not found');
        }

        $course->loadCount('lessons', 'questions');
        $course->load(['lessons' => function ($q) {
            $q->orderBy('order');
        }]);

        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();

        return Inertia::render('user/courses/show', [
            'course' => $course,
            'isEnrolled' => $enrollment !== null,
            'enrollment' => $enrollment,
        ]);
    }

    public function enroll(Course $course)
    {
        $existing = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return redirect()->route('courses.index')
                ->with('error', 'You are already enrolled in this course.');
        }
        if (! $course->is_published) {
            return redirect()->route('courses.browse')
                ->with('error', 'This course is not available for enrollment.');
        }
        if (! $course->is_free) {
            return redirect()->route('courses.checkout', $course->id)
                ->with('info', 'This is a paid course. Please complete payment to enroll.');
        }
        Enrollment::create([
            'user_id' => Auth::id(),
            'course_id' => $course->id,
            'progress_percentage' => 0,
            'status' => 'ongoing',
            'enrolled_at' => now(),
        ]);

        return redirect()->route('courses.index')
            ->with('success', 'Successfully enrolled in '.$course->title);
    }

    public function player(Course $course, Lesson $lesson): Response
    {
        if ($lesson->course_id !== $course->id) {
            abort(404);
        }

        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->firstOrFail();

        $lessons = $course->lessons()->orderBy('order')->get();

        return Inertia::render('user/courses/player', [
            'course' => $course,
            'lesson' => $lesson,
            'lessons' => $lessons,
            'enrollment' => $enrollment,
        ]);
    }

    public function markComplete(Course $course, Lesson $lesson)
    {
        $enrollment = Enrollment::where('user_id', Auth::id())
            ->where('course_id', $course->id)
            ->firstOrFail();

        $totalLessons = $course->lessons()->count();
        $completedLessons = $enrollment->progress_percentage / 100 * $totalLessons;

        if ($completedLessons < $totalLessons) {
            $completedLessons++;
            $newProgress = ($completedLessons / $totalLessons) * 100;

            $enrollment->update([
                'progress_percentage' => $newProgress,
                'status' => $newProgress >= 100 ? 'completed' : 'ongoing',
            ]);

            if ($newProgress >= 100) {
                return redirect()->route('courses.exam', $course->id)
                    ->with('success', 'Course completed! Ready to take the exam.');
            }

            // Redirect to next lesson if available
            $nextLesson = $course->lessons()
                ->where('order', '>', $lesson->order)
                ->orderBy('order')
                ->first();

            if ($nextLesson) {
                return redirect()->route('courses.player', [$course->id, $nextLesson->id])
                    ->with('success', 'Lesson marked as complete!');
            }
        }

        return back()->with('success', 'Lesson marked as complete!');
    }
}
