<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\ExamResult;
use App\Models\ZoomMeeting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $enrolledCourseIds = $user->enrollments()->pluck('course_id');
        $now = now();

        $stats = [
            'enrolled_courses' => $user->enrollments()->count(),
            'completed_courses' => $user->enrollments()->where('progress_percentage', 100)->count(),
            'passed_exams' => $user->examResults()->where('is_passed', true)->count(),
            'upcoming_meetings' => ZoomMeeting::whereIn('course_id', $enrolledCourseIds)
                ->where('start_time', '>', $now)
                ->whereNull('ended_at')
                ->count(),
        ];

        $inProgressCourses = Enrollment::with(['course.lessons'])
            ->where('user_id', $user->id)
            ->where('progress_percentage', '<', 100)
            ->latest('updated_at')
            ->take(3)
            ->get()
            ->map(function ($enrollment) {
                return [
                    'id' => $enrollment->course->id,
                    'title' => $enrollment->course->title,
                    'thumbnail' => $enrollment->course->thumbnail,
                    'progress' => $enrollment->progress_percentage,
                    'total_lessons' => $enrollment->course->lessons->count(),
                ];
            });

        $upcomingMeetings = ZoomMeeting::with(['course', 'attendances' => function ($q) use ($user) {
            $q->where('user_id', $user->id);
        }])
            ->whereIn('course_id', $enrolledCourseIds)
            ->where('start_time', '>', $now)
            ->whereNull('ended_at')
            ->orderBy('start_time', 'asc')
            ->take(3)
            ->get();

        $recentExams = ExamResult::with('course')
            ->where('user_id', $user->id)
            ->latest('created_at')
            ->take(3)
            ->get();

        return Inertia::render('user/dashboard', [
            'stats' => $stats,
            'inProgressCourses' => $inProgressCourses,
            'upcomingMeetings' => $upcomingMeetings,
            'recentExams' => $recentExams,
        ]);
    }
}
