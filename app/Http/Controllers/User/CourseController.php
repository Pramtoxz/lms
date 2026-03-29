<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Enrollment::with('course')
            ->where('user_id', auth()->id());

        if ($request->filled('search')) {
            $query->whereHas('course', function ($q) use ($request) {
                $q->whereLike('title', "%{$request->search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $enrollments = $query->latest()->paginate(10)->withQueryString();

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

        $courses = $query->latest()->paginate(12)->withQueryString();

        // Get user's enrolled course IDs
        $enrolledCourseIds = Enrollment::where('user_id', auth()->id())
            ->pluck('course_id')
            ->toArray();

        return Inertia::render('user/courses/browse', [
            'courses' => $courses,
            'enrolledCourseIds' => $enrolledCourseIds,
            'filters' => $request->only(['search']),
        ]);
    }

    public function enroll(Course $course)
    {
        // Check if already enrolled
        $existing = Enrollment::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return redirect()->route('courses.index')
                ->with('error', 'You are already enrolled in this course.');
        }

        // Check if course is published
        if (!$course->is_published) {
            return redirect()->route('courses.browse')
                ->with('error', 'This course is not available for enrollment.');
        }

        // Create enrollment
        Enrollment::create([
            'user_id' => auth()->id(),
            'course_id' => $course->id,
            'progress_percentage' => 0,
            'status' => 'ongoing',
            'enrolled_at' => now(),
        ]);

        return redirect()->route('courses.index')
            ->with('success', 'Successfully enrolled in ' . $course->title);
    }

    public function player(Course $course, Lesson $lesson): Response
    {
        if ($lesson->course_id !== $course->id) {
            abort(404);
        }

        $enrollment = Enrollment::where('user_id', auth()->id())
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
        $enrollment = Enrollment::where('user_id', auth()->id())
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

            // Auto-redirect to exam if course completed
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
