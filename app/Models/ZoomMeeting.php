<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        'ended_at',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'ended_at' => 'datetime',
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
