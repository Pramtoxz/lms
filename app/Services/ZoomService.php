<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ZoomService
{
    private Client $client;
    private string $accountId;
    private string $clientId;
    private string $clientSecret;

    public function __construct()
    {
        $this->client = new Client();
        $this->accountId = config('services.zoom.account_id');
        $this->clientId = config('services.zoom.client_id');
        $this->clientSecret = config('services.zoom.client_secret');
    }

    /**
     * Get access token using Server-to-Server OAuth
     * Token is cached for 55 minutes (expires in 60 minutes)
     */
    public function getAccessToken(): string
    {
        return Cache::remember('zoom_access_token', 55 * 60, function () {
            try {
                $response = $this->client->post('https://zoom.us/oauth/token', [
                    'headers' => [
                        'Authorization' => 'Basic ' . base64_encode($this->clientId . ':' . $this->clientSecret),
                        'Content-Type' => 'application/x-www-form-urlencoded',
                    ],
                    'form_params' => [
                        'grant_type' => 'account_credentials',
                        'account_id' => $this->accountId,
                    ],
                ]);

                $data = json_decode($response->getBody()->getContents(), true);
                
                return $data['access_token'];
            } catch (\Exception $e) {
                Log::error('Zoom OAuth Error: ' . $e->getMessage());
                throw new \Exception('Failed to get Zoom access token: ' . $e->getMessage());
            }
        });
    }

    /**
     * Create a meeting
     */
    public function createMeeting(string $topic, string $startTime, int $duration): array
    {
        try {
            $accessToken = $this->getAccessToken();

            $response = $this->client->post('https://api.zoom.us/v2/users/me/meetings', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'topic' => $topic,
                    'type' => 2, // Scheduled meeting
                    'start_time' => $startTime, // Format: 2026-04-05T14:00:00Z
                    'duration' => $duration, // In minutes
                    'timezone' => 'Asia/Kuala_Lumpur',
                    'settings' => [
                        'host_video' => true,
                        'participant_video' => true,
                        'join_before_host' => false,
                        'mute_upon_entry' => true,
                        'watermark' => false,
                        'audio' => 'both',
                        'auto_recording' => 'none',
                    ],
                ],
            ]);

            return json_decode($response->getBody()->getContents(), true);
        } catch (\Exception $e) {
            Log::error('Zoom Create Meeting Error: ' . $e->getMessage());
            throw new \Exception('Failed to create Zoom meeting: ' . $e->getMessage());
        }
    }

    /**
     * Delete a meeting
     */
    public function deleteMeeting(string $meetingId): bool
    {
        try {
            $accessToken = $this->getAccessToken();

            $this->client->delete("https://api.zoom.us/v2/meetings/{$meetingId}", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $accessToken,
                ],
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Zoom Delete Meeting Error: ' . $e->getMessage());
            throw new \Exception('Failed to delete Zoom meeting: ' . $e->getMessage());
        }
    }
}
