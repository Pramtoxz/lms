<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OtpVerificationController extends Controller
{
    public function __construct(
        private OtpService $otpService
    ) {}

    public function create(Request $request): Response
    {
        return Inertia::render('auth/verify-otp', [
            'email' => $request->query('email'),
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        if (!$this->otpService->verify($request->email, $request->otp, 'reset_password')) {
            throw ValidationException::withMessages([
                'otp' => 'Invalid or expired OTP code.',
            ]);
        }

        return to_route('password.reset', ['email' => $request->email, 'verified' => true]);
    }

    public function showResetForm(Request $request): Response|RedirectResponse
    {
        if (!$request->query('verified')) {
            return to_route('password.request');
        }

        return Inertia::render('auth/reset-password', [
            'email' => $request->query('email'),
        ]);
    }

    public function reset(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            throw ValidationException::withMessages([
                'email' => 'User not found.',
            ]);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return to_route('login')->with('status', 'Password has been reset successfully.');
    }
}
