<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $zoom_meeting_id
 * @property Carbon|null $check_in_time
 * @property Carbon|null $check_out_time
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $user
 * @property-read ZoomMeeting $zoomMeeting
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attendance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attendance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attendance query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attendance whereCheckInTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attendance whereCheckOutTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attendance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attendance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attendance whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attendance whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Attendance whereZoomMeetingId($value)
 *
 * @mixin \Eloquent
 */
class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'zoom_meeting_id',
        'user_name',
        'zoom_user_id',
        'check_in_time',
        'check_out_time',
    ];

    protected function casts(): array
    {
        return [
            'check_in_time' => 'datetime',
            'check_out_time' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function zoomMeeting(): BelongsTo
    {
        return $this->belongsTo(ZoomMeeting::class);
    }
}
