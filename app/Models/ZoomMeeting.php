<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $course_id
 * @property string $zoom_meeting_id
 * @property Carbon $start_time
 * @property int $duration
 * @property string $join_url
 * @property string $start_url
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Attendance> $attendances
 * @property-read int|null $attendances_count
 * @property-read Course $course
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereCourseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereJoinUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereStartUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ZoomMeeting whereZoomMeetingId($value)
 *
 * @mixin \Eloquent
 */
class ZoomMeeting extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'zoom_meeting_id',
        'start_time',
        'duration',
        'join_url',
        'start_url',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
        ];
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}
