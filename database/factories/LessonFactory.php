<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class LessonFactory extends Factory
{
    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'title' => fake()->sentence(4),
            'video_type' => fake()->randomElement(['youtube', 'gdrive']),
            'video_url' => fake()->url(),
            'duration' => fake()->numberBetween(5, 60),
            'order' => 0,
        ];
    }
}
