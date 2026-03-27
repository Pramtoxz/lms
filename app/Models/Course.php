<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $title
 * @property string $description
 * @property string|null $thumbnail
 * @property bool $is_published
 * @property int $exam_duration Exam duration in minutes
 * @property string|null $certificate_template Path to certificate background template
 * @property string|null $certificate_font
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, Enrollment> $enrollments
 * @property-read int|null $enrollments_count
 * @property-read Collection<int, ExamResult> $examResults
 * @property-read int|null $exam_results_count
 * @property-read Collection<int, Lesson> $lessons
 * @property-read int|null $lessons_count
 * @property-read Collection<int, Question> $questions
 * @property-read int|null $questions_count
 * @property-read Collection<int, ZoomMeeting> $zoomMeetings
 * @property-read int|null $zoom_meetings_count
 *
 * @method static \Database\Factories\CourseFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereCertificateFont($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereCertificateTemplate($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereExamDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereIsPublished($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereThumbnail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'thumbnail',
        'certificate_template',
        'certificate_font',
        'exam_duration',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class)->orderBy('order');
    }

    public function zoomMeetings(): HasMany
    {
        return $this->hasMany(ZoomMeeting::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function examResults(): HasMany
    {
        return $this->hasMany(ExamResult::class);
    }
}
