<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\ExamResult;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ExamController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();

        $enrollments = Enrollment::with('course')
            ->where('user_id', $userId)
            ->get();

        $examStatuses = $enrollments->map(function ($enrollment) use ($userId) {
            $lastAttempt = ExamResult::where('user_id', $userId)
                ->where('course_id', $enrollment->course_id)
                ->latest()
                ->first();

            $attemptCount = ExamResult::where('user_id', $userId)
                ->where('course_id', $enrollment->course_id)
                ->count();

            return [
                'enrollment' => $enrollment,
                'exam_taken' => $lastAttempt !== null,
                'last_attempt' => $lastAttempt,
                'attempts_remaining' => 3 - $attemptCount,
            ];
        });

        return Inertia::render('user/exams/index', [
            'examStatuses' => $examStatuses,
        ]);
    }

    public function show(Course $course): Response
    {
        $userId = auth()->id();

        $enrollment = Enrollment::where('user_id', $userId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        // Development Mode: Skip progress check
        $devMode = config('app.dev_mode', false);

        if (! $devMode && $enrollment->progress_percentage < 100) {
            return Inertia::render('user/courses/exam-locked', [
                'course' => $course,
                'enrollment' => $enrollment,
            ]);
        }

        $attemptCount = ExamResult::where('user_id', $userId)
            ->where('course_id', $course->id)
            ->count();

        if ($attemptCount >= 3) {
            $lastResult = ExamResult::where('user_id', $userId)
                ->where('course_id', $course->id)
                ->latest()
                ->first();

            return Inertia::render('user/courses/exam-max-attempts', [
                'course' => $course,
                'lastResult' => $lastResult,
            ]);
        }

        $questions = $course->questions()
            ->get()
            ->shuffle(crc32($userId . $course->id . $attemptCount))
            ->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'option_a' => $question->option_a,
                    'option_b' => $question->option_b,
                    'option_c' => $question->option_c,
                    'option_d' => $question->option_d,
                ];
            });

        if ($questions->count() < 5) {
            abort(403, 'This course needs at least 5 questions to start the exam.');
        }

        return Inertia::render('user/courses/exam', [
            'course' => $course,
            'questions' => $questions,
            'attemptCount' => $attemptCount,
            'duration' => $course->exam_duration ?? 30,
        ]);
    }

    public function submit(Request $request, Course $course)
    {
        $userId = auth()->id();

        $enrollment = Enrollment::where('user_id', $userId)
            ->where('course_id', $course->id)
            ->firstOrFail();

        if ($enrollment->progress_percentage < 100) {
            return back()->withErrors(['error' => 'You must complete all lessons first.']);
        }

        $attemptCount = ExamResult::where('user_id', $userId)
            ->where('course_id', $course->id)
            ->count();

        if ($attemptCount >= 3) {
            return back()->withErrors(['error' => 'Maximum attempts reached.']);
        }

        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*' => 'required|in:a,b,c,d',
        ]);

        $questions = $course->questions()->get();
        $correctAnswers = 0;
        $totalQuestions = $questions->count();

        foreach ($questions as $question) {
            if (isset($validated['answers'][$question->id])) {
                if ($validated['answers'][$question->id] === $question->correct_answer) {
                    $correctAnswers++;
                }
            }
        }

        $score = ($correctAnswers / $totalQuestions) * 100;
        $isPassed = $score >= 80;

        $certificatePath = null;
        if ($isPassed) {
            $user = auth()->user();
            $certificatePath = $this->generateCertificate($course, $user, $score);
        }

        $examResult = ExamResult::create([
            'user_id' => $userId,
            'course_id' => $course->id,
            'score' => round($score),
            'is_passed' => $isPassed,
            'certificate_path' => $certificatePath,
            'attempt' => $attemptCount + 1,
        ]);

        return redirect()->route('courses.exam.result', [$course->id, $examResult->id])
            ->with('success', $isPassed ? 'Congratulations! You passed the exam.' : 'You did not pass. Please try again.');
    }

    public function result(Course $course, ExamResult $examResult): Response
    {
        $userId = auth()->id();

        if ($examResult->user_id !== $userId) {
            abort(403);
        }

        return Inertia::render('user/courses/exam-result', [
            'course' => $course,
            'result' => $examResult,
        ]);
    }

    public function downloadCertificate(Course $course, ExamResult $examResult)
    {
        $userId = auth()->id();

        if ($examResult->user_id !== $userId || ! $examResult->is_passed) {
            abort(403);
        }

        if (! $examResult->certificate_path || ! Storage::disk('public')->exists($examResult->certificate_path)) {
            $user = auth()->user();
            $examResult->certificate_path = $this->generateCertificate($course, $user, $examResult->score);
            $examResult->save();
        }

        $extension = pathinfo($examResult->certificate_path, PATHINFO_EXTENSION);
        $storagePath = Storage::disk('public')->path($examResult->certificate_path);

        return response()->download($storagePath, 'sertifikat-'.$course->id.'.'.$extension);
    }

    private function generateCertificate(Course $course, $user, $score): string
    {
        // Jika course punya custom template, gunakan image overlay
        if ($course->certificate_template && Storage::disk('public')->exists($course->certificate_template)) {
            return $this->generateCertificateWithTemplate($course, $user, $score);
        }

        // Fallback ke PDF template
        $data = [
            'user' => $user,
            'course' => $course,
            'score' => $score,
            'date' => now()->locale('id')->translatedFormat('d F Y'),
        ];

        $pdf = Pdf::loadView('certificates.template', $data)
            ->setPaper('a4', 'landscape');

        $filename = 'certificates/'.$user->id.'-'.$course->id.'-'.time().'.pdf';
        Storage::disk('public')->put($filename, $pdf->output());

        return $filename;
    }

    /**
     * Generate certificate with custom template
     *
     * @param  User  $user
     * @param  float  $score
     */
    private function generateCertificateWithTemplate(Course $course, $user, $score): string
    {
        $templatePath = Storage::disk('public')->path($course->certificate_template);
        $coords = config('certificate.coordinates');

        // Get font path dari course atau gunakan default
        $availableFonts = config('certificate.available_fonts');
        $defaultFont = config('certificate.default_font');
        $fontKey = $course->certificate_font ?? $defaultFont;
        $fontPath = $availableFonts[$fontKey]['path'] ?? config('certificate.font_path');

        // Load template image menggunakan GD driver
        $manager = new ImageManager(new Driver);
        $image = $manager->read($templatePath);

        // Overlay text dengan koordinat fixed
        $image->text($user->name, $coords['name']['x'], $coords['name']['y'], function ($font) use ($coords, $fontPath) {
            $font->file($fontPath);
            $font->size($coords['name']['font_size']);
            $font->color($coords['name']['color']);
            $font->align($coords['name']['align']);
            $font->valign('middle');
        });

        $image->text($course->title, $coords['course']['x'], $coords['course']['y'], function ($font) use ($coords, $fontPath) {
            $font->file($fontPath);
            $font->size($coords['course']['font_size']);
            $font->color($coords['course']['color']);
            $font->align($coords['course']['align']);
            $font->valign('middle');
        });

        $image->text(now()->locale('id')->translatedFormat('d F Y'), $coords['date']['x'], $coords['date']['y'], function ($font) use ($coords, $fontPath) {
            $font->file($fontPath);
            $font->size($coords['date']['font_size']);
            $font->color($coords['date']['color']);
            $font->align($coords['date']['align']);
            $font->valign('middle');
        });

        // Save as PNG
        $filename = 'certificates/'.$user->id.'-'.$course->id.'-'.time().'.png';
        Storage::disk('public')->put($filename, $image->toPng());

        return $filename;
    }
}
