<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

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
        \Inertia\Inertia::share([
            'meetingCounts' => function () {
                if (!\Illuminate\Support\Facades\Auth::check()) {
                    return ['upcoming' => 0, 'ongoing' => 0];
                }

                $user = \Illuminate\Support\Facades\Auth::user();
                $now = now();

                if ($user->roles()->where('name', 'admin')->exists()) {
                    $upcomingCount = \App\Models\ZoomMeeting::where('start_time', '>', $now)
                        ->whereNull('ended_at')
                        ->count();

                    $ongoingCount = \App\Models\ZoomMeeting::where('start_time', '<=', $now)
                        ->whereNull('ended_at')
                        ->whereRaw('DATE_ADD(start_time, INTERVAL duration MINUTE) >= ?', [$now])
                        ->count();
                } else {
                    $enrolledCourseIds = $user->enrollments()->pluck('course_id');

                    $upcomingCount = \App\Models\ZoomMeeting::whereIn('course_id', $enrolledCourseIds)
                        ->where('start_time', '>', $now)
                        ->whereNull('ended_at')
                        ->count();

                    $ongoingCount = \App\Models\ZoomMeeting::whereIn('course_id', $enrolledCourseIds)
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
