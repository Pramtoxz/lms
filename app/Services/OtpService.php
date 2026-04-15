<?php

namespace App\Services;

use App\Mail\OtpMail;
use App\Models\OtpVerification;
use Illuminate\Support\Facades\Mail;

class OtpService
{
    public function generate(string $email, string $type): string
    {
        OtpVerification::where('email', $email)
            ->where('type', $type)
            ->delete();

        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        OtpVerification::create([
            'email' => $email,
            'otp' => $otp,
            'type' => $type,
            'expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($email)->send(new OtpMail($otp, $type));

        return $otp;
    }

    public function verify(string $email, string $otp, string $type): bool
    {
        $otpRecord = OtpVerification::where('email', $email)
            ->where('type', $type)
            ->where('is_verified', false)
            ->latest()
            ->first();

        if (!$otpRecord || !$otpRecord->isValid($otp)) {
            return false;
        }

        $otpRecord->update(['is_verified' => true]);

        return true;
    }

    public function cleanup(): void
    {
        OtpVerification::where('expires_at', '<', now())->delete();
    }
}
