<?php

namespace App\Providers;

use App\Models\ZoomMeeting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'meetingCounts' => function () {
                if (! Auth::check()) {
                    return ['upcoming' => 0, 'ongoing' => 0];
                }

                $user = Auth::user();
                $now = now();

                if ($user->roles()->where('name', 'admin')->exists()) {
                    $upcomingCount = ZoomMeeting::where('start_time', '>', $now)
                        ->whereNull('ended_at')
                        ->count();

                    $ongoingCount = ZoomMeeting::where('start_time', '<=', $now)
                        ->whereNull('ended_at')
                        ->whereRaw('DATE_ADD(start_time, INTERVAL duration MINUTE) >= ?', [$now])
                        ->count();
                } else {
                    $enrolledCourseIds = $user->enrollments()->pluck('course_id');

                    $upcomingCount = ZoomMeeting::whereIn('course_id', $enrolledCourseIds)
                        ->where('start_time', '>', $now)
                        ->whereNull('ended_at')
                        ->count();

                    $ongoingCount = ZoomMeeting::whereIn('course_id', $enrolledCourseIds)
                        ->where('start_time', '<=', $now)
                        ->whereNull('ended_at')
                        ->whereRaw('DATE_ADD(start_time, INTERVAL duration MINUTE) >= ?', [$now])
                        ->count();
                }

                return [
                    'upcoming' => $upcomingCount,
                    'ongoing' => $ongoingCount,
                ];
            },
        ]);
    }
}
