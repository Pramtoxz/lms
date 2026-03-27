<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\User;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'user@lms.test')->first();

        // HTML Dasar - 90% (9 dari 10 lessons completed) untuk test auto-redirect
        $htmlCourse = Course::where('title', 'HTML Dasar')->first();
        if ($htmlCourse) {
            Enrollment::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'course_id' => $htmlCourse->id,
                ],
                [
                    'progress_percentage' => 90,
                    'status' => 'ongoing',
                    'enrolled_at' => now()->subDays(5),
                ]
            );
        }

        // CSS Dasar - 100% (completed) untuk test tombol Take Exam
        $cssCourse = Course::where('title', 'CSS Dasar')->first();
        if ($cssCourse) {
            Enrollment::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'course_id' => $cssCourse->id,
                ],
                [
                    'progress_percentage' => 100,
                    'status' => 'completed',
                    'enrolled_at' => now()->subDays(10),
                ]
            );
        }

        // JavaScript Dasar - 50% (in progress)
        $jsCourse = Course::where('title', 'JavaScript Dasar')->first();
        if ($jsCourse) {
            Enrollment::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'course_id' => $jsCourse->id,
                ],
                [
                    'progress_percentage' => 50,
                    'status' => 'ongoing',
                    'enrolled_at' => now()->subDays(3),
                ]
            );
        }
    }
}
