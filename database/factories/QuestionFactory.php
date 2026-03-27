<?php

namespace Database\Factories;

use App\Models\Course;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'course_id' => Course::factory(),
            'question_text' => fake()->sentence().'?',
            'option_a' => fake()->word(),
            'option_b' => fake()->word(),
            'option_c' => fake()->word(),
            'option_d' => fake()->word(),
            'correct_answer' => fake()->randomElement(['a', 'b', 'c', 'd']),
        ];
    }
}
