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
                case 'meeting.started':
                    $this->handleMeetingStarted($payload);
                    break;

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

                case 'meeting.ended':
                    $this->handleMeetingEnded($payload);
                    break;

                default:
                    Log::info('Unhandled Zoom event: '.$event);
            }

            return response()->json(['status' => 'success'], 200);
        } catch (\Exception $e) {
            Log::error('Zoom Webhook Error: '.$e->getMessage());

            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    private function handleMeetingStarted(array $payload)
    {
        $meetingId = $payload['object']['id'] ?? null;

        if (! $meetingId) {
            return;
        }

        $meeting = ZoomMeeting::where('zoom_meeting_id', $meetingId)->first();
        if (! $meeting) {
            Log::warning('Meeting not found in database', ['zoom_meeting_id' => $meetingId]);

            return;
        }

        $meeting->update(['ended_at' => null]);

        Log::info('Meeting started', [
            'meeting_id' => $meeting->id,
        ]);
    }

    /**
     * Verify webhook signature using secret token
     */
    private function verifyWebhookSignature(Request $request)
    {
        $secretToken = config('services.zoom.webhook_secret_token');

        if (empty($secretToken)) {
            Log::warning('Zoom webhook secret token not configured');

            return;
        }

        $signature = $request->header('x-zm-signature');
        $timestamp = $request->header('x-zm-request-timestamp');

        if (! $signature || ! $timestamp) {
            Log::error('Zoom webhook: Missing signature headers');
            abort(401, 'Unauthorized');
        }

        $message = "v0:{$timestamp}:".$request->getContent();
        $hashForVerify = hash_hmac('sha256', $message, $secretToken);
        $expectedSignature = "v0={$hashForVerify}";

        if ($signature !== $expectedSignature) {
            Log::error('Zoom webhook: Invalid signature', [
                'expected' => $expectedSignature,
                'received' => $signature,
            ]);
            abort(401, 'Unauthorized');
        }
    }

    private function handleParticipantJoined(array $payload)
    {
        $meetingId = $payload['object']['id'] ?? null;
        $participantEmail = $payload['object']['participant']['email'] ?? null;
        $participantUserId = $payload['object']['participant']['user_id'] ?? null;
        $participantUserName = $payload['object']['participant']['user_name'] ?? null;

        if (! $meetingId) {
            return;
        }

        $meeting = ZoomMeeting::where('zoom_meeting_id', $meetingId)->first();
        if (! $meeting) {
            Log::warning('Meeting not found in database', ['zoom_meeting_id' => $meetingId]);

            return;
        }

        $user = null;
        if ($participantEmail) {
            $user = User::where('email', $participantEmail)->first();
        }

        if ($user) {
            Attendance::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'zoom_meeting_id' => $meeting->id,
                ],
                [
                    'user_name' => $participantUserName,
                    'zoom_user_id' => $participantUserId,
                    'check_in_time' => now(),
                ]
            );

            Log::info('Participant joined recorded', [
                'user_id' => $user->id,
                'meeting_id' => $meeting->id,
            ]);
        } else {
            Attendance::create([
                'zoom_meeting_id' => $meeting->id,
                'user_name' => $participantUserName,
                'zoom_user_id' => $participantUserId,
                'check_in_time' => now(),
            ]);

            Log::info('Guest participant joined recorded', [
                'user_name' => $participantUserName,
                'zoom_user_id' => $participantUserId,
                'meeting_id' => $meeting->id,
            ]);
        }
    }

    private function handleParticipantLeft(array $payload)
    {
        $meetingId = $payload['object']['id'] ?? null;
        $participantEmail = $payload['object']['participant']['email'] ?? null;
        $participantUserId = $payload['object']['participant']['user_id'] ?? null;
        $participantUserName = $payload['object']['participant']['user_name'] ?? null;

        if (! $meetingId) {
            return;
        }

        $meeting = ZoomMeeting::where('zoom_meeting_id', $meetingId)->first();
        if (! $meeting) {
            Log::warning('Meeting not found in database', ['zoom_meeting_id' => $meetingId]);

            return;
        }

        $attendance = null;

        if ($participantEmail) {
            $user = User::where('email', $participantEmail)->first();
            if ($user) {
                $attendance = Attendance::where('user_id', $user->id)
                    ->where('zoom_meeting_id', $meeting->id)
                    ->first();
            }
        }

        if (! $attendance && $participantUserId) {
            $attendance = Attendance::where('zoom_user_id', $participantUserId)
                ->where('zoom_meeting_id', $meeting->id)
                ->first();
        }

        if ($attendance) {
            $attendance->update(['check_out_time' => now()]);

            Log::info('Participant left recorded', [
                'attendance_id' => $attendance->id,
                'user_name' => $participantUserName,
                'meeting_id' => $meeting->id,
            ]);
        } else {
            Log::warning('Attendance not found for participant left', [
                'email' => $participantEmail,
                'zoom_user_id' => $participantUserId,
                'user_name' => $participantUserName,
            ]);
        }
    }

    private function handleMeetingEnded(array $payload)
    {
        $meetingId = $payload['object']['id'] ?? null;

        if (! $meetingId) {
            return;
        }

        $meeting = ZoomMeeting::where('zoom_meeting_id', $meetingId)->first();
        if (! $meeting) {
            Log::warning('Meeting not found in database', ['zoom_meeting_id' => $meetingId]);

            return;
        }

        $endTime = now();

        $meeting->update(['ended_at' => $endTime]);

        $updatedCount = Attendance::where('zoom_meeting_id', $meeting->id)
            ->whereNull('check_out_time')
            ->update(['check_out_time' => $endTime]);

        Log::info('Meeting ended, auto-checkout attendees', [
            'meeting_id' => $meeting->id,
            'attendees_updated' => $updatedCount,
        ]);
    }
}
