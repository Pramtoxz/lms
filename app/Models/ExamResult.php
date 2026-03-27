<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $course_id
 * @property int $score
 * @property bool $is_passed
 * @property string|null $certificate_path
 * @property int $attempt
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Course $course
 * @property-read User $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult whereAttempt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult whereCertificatePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult whereCourseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult whereIsPassed($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult whereScore($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ExamResult whereUserId($value)
 *
 * @mixin \Eloquent
 */
class ExamResult extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'course_id',
        'score',
        'is_passed',
        'certificate_path',
        'attempt',
    ];

    protected function casts(): array
    {
        return [
            'is_passed' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
