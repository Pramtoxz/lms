<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\ZoomMeeting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimetableController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $enrolledCourseIds = $user->enrollments()->pluck('course_id');
        $now = now();

        $baseQuery = ZoomMeeting::whereIn('course_id', $enrolledCourseIds);

        $upcomingCount = (clone $baseQuery)
            ->where('start_time', '>', $now)
            ->whereNull('ended_at')
            ->count();

        $ongoingCount = (clone $baseQuery)
            ->where('start_time', '<=', $now)
            ->whereNull('ended_at')
            ->whereRaw('DATE_ADD(start_time, INTERVAL duration MINUTE) >= ?', [$now])
            ->count();

        $query = ZoomMeeting::with(['course', 'attendances' => function ($q) use ($user) {
            $q->where('user_id', $user->id);
        }])
            ->whereIn('course_id', $enrolledCourseIds);

        if ($request->filled('status')) {
            if ($request->status === 'upcoming') {
                $query->where('start_time', '>', $now)
                    ->whereNull('ended_at');
            } elseif ($request->status === 'ongoing') {
                $query->where('start_time', '<=', $now)
                    ->whereNull('ended_at')
                    ->whereRaw('DATE_ADD(start_time, INTERVAL duration MINUTE) >= ?', [$now]);
            } elseif ($request->status === 'past') {
                $query->where(function ($q) use ($now) {
                    $q->whereNotNull('ended_at')
                        ->orWhereRaw('DATE_ADD(start_time, INTERVAL duration MINUTE) < ?', [$now]);
                });
            }
        }

        $meetings = $query->orderBy('start_time', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('user/timetable', [
            'meetings' => $meetings,
            'counts' => [
                'upcoming' => $upcomingCount,
                'ongoing' => $ongoingCount,
            ],
            'filters' => $request->only(['status']),
        ]);
    }

    public function join(Request $request, ZoomMeeting $meeting)
    {
        $user = $request->user();

        // Check if user is enrolled in the course
        $isEnrolled = $user->enrollments()->where('course_id', $meeting->course_id)->exists();

        if (! $isEnrolled) {
            return back()->withErrors(['error' => 'You are not enrolled in this course.']);
        }

        // Record check-in time
        Attendance::updateOrCreate(
            [
                'user_id' => $user->id,
                'zoom_meeting_id' => $meeting->id,
            ],
            [
                'check_in_time' => now(),
            ]
        );

        // Redirect to Zoom join URL
        return Inertia::location($meeting->join_url);
    }
}
