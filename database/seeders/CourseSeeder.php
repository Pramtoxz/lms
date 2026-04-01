<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Question;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            [
                'title' => 'HTML Dasar',
                'description' => 'Belajar HTML dari dasar hingga mahir. Materi lengkap untuk pemula yang ingin memulai karir sebagai web developer.',
                'is_published' => true,
                'lessons' => [
                    ['title' => '1. Intro', 'url' => 'https://www.youtube.com/watch?v=NBZ9Ro6UKV8', 'duration' => 8],
                    ['title' => '2. Persiapan', 'url' => 'https://www.youtube.com/watch?v=gJHOmlBxDCc', 'duration' => 15],
                    ['title' => '3. HTML Dasar', 'url' => 'https://www.youtube.com/watch?v=3oSy0tVV7Qo', 'duration' => 22],
                    ['title' => '4. Text Formatting', 'url' => 'https://www.youtube.com/watch?v=nbqgZFaFZ0k', 'duration' => 18],
                    ['title' => '5. Hyperlink', 'url' => 'https://www.youtube.com/watch?v=IbZ8hDYZ_Uw', 'duration' => 20],
                    ['title' => '6. List', 'url' => 'https://www.youtube.com/watch?v=nbqgZFaFZ0k', 'duration' => 16],
                    ['title' => '7. Table', 'url' => 'https://www.youtube.com/watch?v=IbZ8hDYZ_Uw', 'duration' => 25],
                    ['title' => '8. Form', 'url' => 'https://www.youtube.com/watch?v=fXTFo9d-3JE', 'duration' => 30],
                    ['title' => '9. Div & Span', 'url' => 'https://www.youtube.com/watch?v=Rz-rey4Q1bw', 'duration' => 12],
                    ['title' => '10. HTML5 Semantic', 'url' => 'https://www.youtube.com/watch?v=Rz-rey4Q1bw', 'duration' => 18],
                ],
            ],
            [
                'title' => 'CSS Dasar',
                'description' => 'Pelajari CSS dari nol hingga bisa membuat website yang menarik dan responsive. Cocok untuk pemula.',
                'is_published' => true,
                'lessons' => [
                    ['title' => '1. Intro CSS', 'url' => 'https://www.youtube.com/watch?v=CleFk3BZB3g', 'duration' => 10],
                    ['title' => '2. Anatomi CSS', 'url' => 'https://www.youtube.com/watch?v=4FEJQNoZSvg', 'duration' => 15],
                    ['title' => '3. Font Styling', 'url' => 'https://www.youtube.com/watch?v=Rz-rey4Q1bw', 'duration' => 20],
                    ['title' => '4. Text Styling', 'url' => 'https://www.youtube.com/watch?v=Rz-rey4Q1bw', 'duration' => 18],
                    ['title' => '5. Background', 'url' => 'https://www.youtube.com/watch?v=Rz-rey4Q1bw', 'duration' => 22],
                    ['title' => '6. Box Model', 'url' => 'https://www.youtube.com/watch?v=Rz-rey4Q1bw', 'duration' => 25],
                    ['title' => '7. Float & Clear', 'url' => 'https://www.youtube.com/watch?v=Rz-rey4Q1bw', 'duration' => 20],
                    ['title' => '8. Position', 'url' => 'https://www.youtube.com/watch?v=Rz-rey4Q1bw', 'duration' => 23],
                    ['title' => '9. Pseudo Class', 'url' => 'https://www.youtube.com/watch?v=Rz-rey4Q1bw', 'duration' => 17],
                    ['title' => '10. Studi Kasus', 'url' => 'https://www.youtube.com/watch?v=Rz-rey4Q1bw', 'duration' => 35],
                ],
            ],
            [
                'title' => 'JavaScript Dasar',
                'description' => 'Belajar JavaScript dari fundamental hingga DOM manipulation. Materi lengkap untuk menjadi JavaScript developer.',
                'is_published' => true,
                'lessons' => [
                    ['title' => '1. Intro JavaScript', 'url' => 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration' => 12],
                    ['title' => '2. Menulis JavaScript', 'url' => 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration' => 15],
                    ['title' => '3. Tipe Data & Variable', 'url' => 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration' => 25],
                    ['title' => '4. Operator', 'url' => 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration' => 20],
                    ['title' => '5. Kondisi & Perulangan', 'url' => 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration' => 28],
                    ['title' => '6. Function', 'url' => 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration' => 22],
                    ['title' => '7. Array', 'url' => 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration' => 24],
                    ['title' => '8. Object', 'url' => 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration' => 26],
                    ['title' => '9. DOM Selection', 'url' => 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration' => 30],
                    ['title' => '10. DOM Manipulation', 'url' => 'https://www.youtube.com/watch?v=RUTV_5m4VeI', 'duration' => 32],
                ],
            ],
            [
                'title' => 'PHP Dasar',
                'description' => 'Belajar PHP dari nol hingga bisa membuat aplikasi web dinamis. Materi lengkap dengan studi kasus.',
                'is_published' => true,
                'price' => 9,
                'is_free' => 0,
                'lessons' => [
                    ['title' => '1. Intro PHP', 'url' => 'https://www.youtube.com/watch?v=l1W2OwV5rgY', 'duration' => 10],
                    ['title' => '2. Instalasi & Persiapan', 'url' => 'https://www.youtube.com/watch?v=l1W2OwV5rgY', 'duration' => 18],
                    ['title' => '3. Sintaks PHP', 'url' => 'https://www.youtube.com/watch?v=l1W2OwV5rgY', 'duration' => 20],
                    ['title' => '4. Variable & Tipe Data', 'url' => 'https://www.youtube.com/watch?v=l1W2OwV5rgY', 'duration' => 22],
                    ['title' => '5. Operator', 'url' => 'https://www.youtube.com/watch?v=l1W2OwV5rgY', 'duration' => 18],
                    ['title' => '6. Struktur Kontrol', 'url' => 'https://www.youtube.com/watch?v=l1W2OwV5rgY', 'duration' => 25],
                    ['title' => '7. Array', 'url' => 'https://www.youtube.com/watch?v=l1W2OwV5rgY', 'duration' => 28],
                    ['title' => '8. Function', 'url' => 'https://www.youtube.com/watch?v=l1W2OwV5rgY', 'duration' => 24],
                    ['title' => '9. GET & POST', 'url' => 'https://www.youtube.com/watch?v=l1W2OwV5rgY', 'duration' => 30],
                    ['title' => '10. Koneksi Database', 'url' => 'https://www.youtube.com/watch?v=l1W2OwV5rgY', 'duration' => 35],
                ],
            ],
            [
                'title' => 'Laravel 11 untuk Pemula',
                'description' => 'Belajar framework Laravel dari dasar hingga membuat aplikasi CRUD lengkap. Cocok untuk yang sudah paham PHP.',
                'price' => 25,
                'is_free' => 0,
                'is_published' => true,
                'lessons' => [
                    ['title' => '1. Intro Laravel', 'url' => 'https://www.youtube.com/watch?v=ElZJeKxGCuI', 'duration' => 12],
                    ['title' => '2. Instalasi Laravel', 'url' => 'https://www.youtube.com/watch?v=ElZJeKxGCuI', 'duration' => 20],
                    ['title' => '3. Routing', 'url' => 'https://www.youtube.com/watch?v=ElZJeKxGCuI', 'duration' => 25],
                    ['title' => '4. View & Blade', 'url' => 'https://www.youtube.com/watch?v=ElZJeKxGCuI', 'duration' => 28],
                    ['title' => '5. Controller', 'url' => 'https://www.youtube.com/watch?v=ElZJeKxGCuI', 'duration' => 22],
                    ['title' => '6. Model & Migration', 'url' => 'https://www.youtube.com/watch?v=ElZJeKxGCuI', 'duration' => 30],
                    ['title' => '7. Eloquent ORM', 'url' => 'https://www.youtube.com/watch?v=ElZJeKxGCuI', 'duration' => 32],
                    ['title' => '8. Relationship', 'url' => 'https://www.youtube.com/watch?v=ElZJeKxGCuI', 'duration' => 35],
                    ['title' => '9. Authentication', 'url' => 'https://www.youtube.com/watch?v=ElZJeKxGCuI', 'duration' => 28],
                    ['title' => '10. CRUD Application', 'url' => 'https://www.youtube.com/watch?v=ElZJeKxGCuI', 'duration' => 40],
                ],
            ],
        ];

        foreach ($courses as $courseData) {
            $lessons = $courseData['lessons'];
            unset($courseData['lessons']);

            $course = Course::create($courseData);

            foreach ($lessons as $index => $lessonData) {
                Lesson::create([
                    'course_id' => $course->id,
                    'title' => $lessonData['title'],
                    'video_type' => 'youtube',
                    'video_url' => $lessonData['url'],
                    'duration' => $lessonData['duration'],
                    'order' => $index + 1,
                ]);
            }
            for ($i = 1; $i <= 10; $i++) {
                Question::create([
                    'course_id' => $course->id,
                    'question_text' => "Pertanyaan {$i} untuk course {$course->title}",
                    'option_a' => 'Opsi A (Jawaban Benar)',
                    'option_b' => 'Opsi B',
                    'option_c' => 'Opsi C',
                    'option_d' => 'Opsi D',
                    'correct_answer' => 'a', 
                ]);
            }
        }
    }
}
