<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\OtpVerificationController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // Register with OTP
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register/send-otp', [RegisteredUserController::class, 'sendOtp'])
        ->middleware('throttle:3,1')
        ->name('register.send-otp');

    Route::post('register/verify-otp', [RegisteredUserController::class, 'verifyOtp'])
        ->name('register.verify-otp');

    Route::post('register/fetch-nirc', [RegisteredUserController::class, 'fetchNirc'])
        ->name('register.fetch-nirc');

    Route::post('register', [RegisteredUserController::class, 'store'])
        ->name('register.store');

    // Forgot password with OTP
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware('throttle:3,1')
        ->name('password.email');

    // OTP verification for password reset
    Route::get('verify-otp', [OtpVerificationController::class, 'create'])
        ->name('otp.verify');

    Route::post('verify-otp', [OtpVerificationController::class, 'verify'])
        ->name('otp.verify.post');

    // Reset password after OTP verification
    Route::get('reset-password', [OtpVerificationController::class, 'showResetForm'])
        ->name('password.reset');

    Route::post('reset-password', [OtpVerificationController::class, 'reset'])
        ->name('password.reset.store');
});

Route::middleware('auth')->group(function () {
    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
