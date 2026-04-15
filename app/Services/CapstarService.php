<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CapstarService
{
    private string $apiUrl;
    private string $secretKey;

    public function __construct()
    {
        $this->apiUrl = config('services.capstar.api_url');
        $this->secretKey = config('services.capstar.secret_key');
    }

    public function getUserByNirc(string $nirc): ?array
    {
        try {
            $response = Http::withHeaders([
                'x-secret-key' => $this->secretKey,
                'Accept' => 'application/json',
            ])->post("{$this->apiUrl}/tes-user", [
                'nirc' => $nirc,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::warning('Capstar API failed', [
                'nirc' => $nirc,
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Capstar API error', [
                'nirc' => $nirc,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    public function syncCourseCompletion(string $nirc, int $courseNumber): bool
    {
        try {
            $response = Http::withHeaders([
                'x-secret-key' => $this->secretKey,
                'Accept' => 'application/json',
            ])->post("{$this->apiUrl}/update-course", [
                'nirc' => $nirc,
                'course_number' => $courseNumber,
                'completed_at' => now()->toDateTimeString(),
            ]);

            if ($response->successful()) {
                Log::info('Capstar course completion synced', [
                    'nirc' => $nirc,
                    'course_number' => $courseNumber,
                ]);
                return true;
            }

            Log::warning('Capstar sync failed', [
                'nirc' => $nirc,
                'course_number' => $courseNumber,
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            return false;
        } catch (\Exception $e) {
            Log::error('Capstar sync error', [
                'nirc' => $nirc,
                'course_number' => $courseNumber,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}
