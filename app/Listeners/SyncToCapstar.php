<?php

namespace App\Listeners;

use App\Events\CourseCompleted;
use App\Services\CapstarService;
use Illuminate\Support\Facades\Log;

class SyncToCapstar
{
    public function handle(CourseCompleted $event): void
    {
        $enrollment = $event->enrollment;
        $user = $enrollment->user;
        $course = $enrollment->course;

        if (!$course->capstar_course_number || !$user->nirc) {
            Log::info('Skipping Capstar sync', [
                'course_id' => $course->id,
                'user_id' => $user->id,
                'reason' => !$course->capstar_course_number ? 'No capstar_course_number' : 'No NIRC',
            ]);
            return;
        }

        $capstarService = app(CapstarService::class);
        $capstarService->syncCourseCompletion($user->nirc, $course->capstar_course_number);
    }
}
