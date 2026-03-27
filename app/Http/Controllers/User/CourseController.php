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

    public function player(Course $course, Lesson $lesson): Response
    {
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
        }

        return back()->with('success', 'Lesson marked as complete!');
    }
}
