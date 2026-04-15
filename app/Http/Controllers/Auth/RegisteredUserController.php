<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\CapstarService;
use App\Services\OtpService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function __construct(
        private OtpService $otpService,
        private CapstarService $capstarService
    ) {}

    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'recaptchaSiteKey' => config('services.recaptcha.site_key'),
        ]);
    }

    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
        ]);

        try {
            $this->otpService->generate($request->email, 'register');
            
            return back()->with('success', 'OTP has been sent to your email.');
        } catch (\Exception $e) {
            return back()->withErrors(['email' => 'Failed to send OTP: ' . $e->getMessage()]);
        }
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        if (!$this->otpService->verify($request->email, $request->otp, 'register')) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP code.']);
        }

        return back()->with('success', 'OTP verified successfully.');
    }

    public function fetchNirc(Request $request)
    {
        $request->validate([
            'nirc' => 'required|string',
        ]);

        $userData = $this->capstarService->getUserByNirc($request->nirc);

        if (!$userData) {
            return response()->json([
                'message' => 'NIRC not found in Capstar database.',
            ], 404);
        }

        return response()->json([
            'name' => $userData['nama_user'] ?? '',
            'nirc' => $userData['nirc'] ?? '',
            'phone' => $userData['nohp'] ?? '',
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'nirc' => 'required|string|max:255',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nirc' => $request->nirc,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
