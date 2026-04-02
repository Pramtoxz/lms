<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use App\Models\ZoomMeeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ZoomWebhookController extends Controller
{
    public function handle(Request $request)
    {
        if ($request->input('event') === 'endpoint.url_validation') {
            $plainToken = $request->input('payload.plainToken');
            
            return response()->json([
                'plainToken' => $plainToken,
                'encryptedToken' => hash_hmac('sha256', $plainToken, config('services.zoom.webhook_secret_token')),
            ]);
        }

        // Verify webhook signature for security (only for actual events, not validation)
        $this->verifyWebhookSignature($request);

        $event = $request->input('event');
        $payload = $request->input('payload');

        Log::info('Zoom Webhook Received', ['event' => $event, 'payload' => $payload]);

        try {
            switch ($event) {
                case 'meeting.participant_joined':
                case 'meeting.participant_joined_meeting':
                case 'meeting.participant_host_joined_meeting':
                    $this->handleParticipantJoined($payload);
                    break;

                case 'meeting.participant_left':
                case 'meeting.participant_left_meeting':
                case 'meeting.participant_host_left_meeting':
                    $this->handleParticipantLeft($payload);
                    break;

                default:
                    Log::info('Unhandled Zoom event: ' . $event);
            }

            return response()->json(['status' => 'success'], 200);
        } catch (\Exception $e) {
            Log::error('Zoom Webhook Error: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Verify webhook signature using secret token
     */
    private function verifyWebhookSignature(Request $request)
    {
        $secretToken = config('services.zoom.webhook_secret_token');
        
        // Skip verification if secret token not configured (for initial setup)
        if (empty($secretToken)) {
            Log::warning('Zoom webhook secret token not configured');
            return;
        }

        $authHeader = $request->header('authorization');
        
        if (!$authHeader) {
            Log::error('Zoom webhook: Missing authorization header');
            abort(401, 'Unauthorized');
        }

        // Extract token from "Bearer {token}" format
        $receivedToken = str_replace('Bearer ', '', $authHeader);
        
        if ($receivedToken !== $secretToken) {
            Log::error('Zoom webhook: Invalid signature', [
                'expected' => $secretToken,
                'received' => $receivedToken,
            ]);
            abort(401, 'Unauthorized');
        }
    }

    private function handleParticipantJoined(array $payload)
    {
        $meetingId = $payload['object']['id'] ?? null;
        $participantEmail = $payload['object']['participant']['email'] ?? null;

        if (!$meetingId || !$participantEmail) {
            return;
        }

        // Find meeting in database
        $meeting = ZoomMeeting::where('zoom_meeting_id', $meetingId)->first();
        if (!$meeting) {
            Log::warning('Meeting not found in database', ['zoom_meeting_id' => $meetingId]);
            return;
        }

        // Find user by email
        $user = User::where('email', $participantEmail)->first();
        if (!$user) {
            Log::warning('User not found', ['email' => $participantEmail]);
            return;
        }

        // Record or update check-in time
        Attendance::updateOrCreate(
            [
                'user_id' => $user->id,
                'zoom_meeting_id' => $meeting->id,
            ],
            [
                'check_in_time' => now(),
            ]
        );

        Log::info('Participant joined recorded', [
            'user_id' => $user->id,
            'meeting_id' => $meeting->id,
        ]);
    }

    private function handleParticipantLeft(array $payload)
    {
        $meetingId = $payload['object']['id'] ?? null;
        $participantEmail = $payload['object']['participant']['email'] ?? null;

        if (!$meetingId || !$participantEmail) {
            return;
        }

        // Find meeting in database
        $meeting = ZoomMeeting::where('zoom_meeting_id', $meetingId)->first();
        if (!$meeting) {
            Log::warning('Meeting not found in database', ['zoom_meeting_id' => $meetingId]);
            return;
        }

        // Find user by email
        $user = User::where('email', $participantEmail)->first();
        if (!$user) {
            Log::warning('User not found', ['email' => $participantEmail]);
            return;
        }

        // Update check-out time
        $attendance = Attendance::where('user_id', $user->id)
            ->where('zoom_meeting_id', $meeting->id)
            ->first();

        if ($attendance) {
            $attendance->update(['check_out_time' => now()]);
            
            Log::info('Participant left recorded', [
                'user_id' => $user->id,
                'meeting_id' => $meeting->id,
            ]);
        }
    }
}
