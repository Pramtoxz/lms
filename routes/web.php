<?php

use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\EnrollmentController;
use App\Http\Controllers\Admin\LessonController;
use App\Http\Controllers\Admin\MeetingController;
use App\Http\Controllers\Admin\QuestionController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\User\CourseController as UserCourseController;
use App\Http\Controllers\User\ExamController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\TimetableController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Payment callback - must be outside auth middleware for RazerMS callback
Route::match(['get', 'post'], 'payment/return/{order_id}', [PaymentController::class, 'handleReturn'])->name('payment.return');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Browse all published courses (catalog)
    Route::get('browse', [UserCourseController::class, 'browse'])->name('courses.browse');
    Route::get('courses/{course}/detail', [UserCourseController::class, 'show'])->name('courses.show');
    Route::post('courses/{course}/enroll', [UserCourseController::class, 'enroll'])->name('courses.enroll');

    // My enrolled courses
    Route::get('courses', [UserCourseController::class, 'index'])->name('courses.index');
    Route::get('courses/{course}/lessons/{lesson}', [UserCourseController::class, 'player'])->name('courses.player');
    Route::post('courses/{course}/lessons/{lesson}/complete', [UserCourseController::class, 'markComplete'])->name('courses.complete');

    Route::get('exams', [ExamController::class, 'index'])->name('exams.index');
    Route::get('courses/{course}/exam', [ExamController::class, 'show'])->name('courses.exam');
    Route::post('courses/{course}/exam', [ExamController::class, 'submit'])
        ->middleware('throttle:3,1')
        ->name('courses.exam.submit');
    Route::get('courses/{course}/exam/{examResult}/result', [ExamController::class, 'result'])->name('courses.exam.result');
    Route::get('courses/{course}/exam/{examResult}/certificate', [ExamController::class, 'downloadCertificate'])->name('courses.exam.certificate');

    // Payment routes (except callback which is above)
    Route::get('courses/{course}/checkout', [PaymentController::class, 'checkout'])->name('courses.checkout');
    Route::post('courses/{course}/payment/process', [PaymentController::class, 'processPayment'])->name('payment.process');
    Route::get('transactions', [PaymentController::class, 'transactions'])->name('transactions.index');

    // Timetable (Zoom meetings)
    Route::get('timetable', [TimetableController::class, 'index'])->name('timetable.index');
    Route::post('meetings/{meeting}/join', [TimetableController::class, 'join'])->name('meetings.join');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('courses', CourseController::class);
    Route::resource('courses.lessons', LessonController::class)->shallow();
    Route::resource('courses.questions', QuestionController::class)->shallow();

    // User-centric enrollment management
    Route::get('enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
    Route::get('enrollments/{user}', [EnrollmentController::class, 'show'])->name('enrollments.show');
    Route::post('enrollments/{user}', [EnrollmentController::class, 'store'])->name('enrollments.store');
    Route::delete('enrollments/{enrollment}', [EnrollmentController::class, 'destroy'])->name('enrollments.destroy');

    Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');

    // Zoom meetings management
    Route::get('meetings', [MeetingController::class, 'index'])->name('meetings.index');
    Route::get('meetings/create', [MeetingController::class, 'create'])->name('meetings.create');
    Route::post('meetings', [MeetingController::class, 'store'])->name('meetings.store');
    Route::delete('meetings/{meeting}', [MeetingController::class, 'destroy'])->name('meetings.destroy');

    Route::get('attendances', [AttendanceController::class, 'index'])->name('attendances.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
