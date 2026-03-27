<?php

use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\User\CourseController as UserCourseController;
use App\Http\Controllers\User\ExamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('courses', [UserCourseController::class, 'index'])->name('courses.index');
    Route::get('courses/{course}/lessons/{lesson}', [UserCourseController::class, 'player'])->name('courses.player');
    Route::post('courses/{course}/lessons/{lesson}/complete', [UserCourseController::class, 'markComplete'])->name('courses.complete');

    Route::get('exams', [ExamController::class, 'index'])->name('exams.index');
    Route::get('courses/{course}/exam', [ExamController::class, 'show'])->name('courses.exam');
    Route::post('courses/{course}/exam', [ExamController::class, 'submit'])->name('courses.exam.submit');
    Route::get('courses/{course}/exam/{examResult}/result', [ExamController::class, 'result'])->name('courses.exam.result');
    Route::get('courses/{course}/exam/{examResult}/certificate', [ExamController::class, 'downloadCertificate'])->name('courses.exam.certificate');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('courses', CourseController::class);
    Route::resource('courses.lessons', LessonController::class)->shallow();
    Route::resource('courses.questions', QuestionController::class)->shallow();
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
