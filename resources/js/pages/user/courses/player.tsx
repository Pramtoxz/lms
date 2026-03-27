import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Circle, Clock, FileCheck, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Course {
    id: number;
    title: string;
    description: string;
}

interface Lesson {
    id: number;
    title: string;
    video_type: string;
    video_url: string;
    duration: number;
    order: number;
}

interface Enrollment {
    id: number;
    progress_percentage: number;
    status: string;
}

export default function Player({
    course,
    lesson,
    lessons,
    enrollment,
}: {
    course: Course;
    lesson: Lesson;
    lessons: Lesson[];
    enrollment: Enrollment;
}) {
    const [lessonsOpen, setLessonsOpen] = useState(false);
    const [canMarkComplete, setCanMarkComplete] = useState(false);
    const [watchTime, setWatchTime] = useState(0);
    const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
    const currentLessonIndex = lessons.findIndex((l) => l.id === lesson.id);
    const nextLesson = lessons[currentLessonIndex + 1];

    const minWatchTime = Math.min(30, lesson.duration * 60 * 0.8);

    // Development Mode: Skip watch time requirement
    const devMode = import.meta.env.VITE_DEV_SKIP_VIDEO_WATCH === 'true';

    useEffect(() => {
        setCanMarkComplete(devMode);
        setWatchTime(0);
        setVideoElement(null);
    }, [lesson.id, devMode]);

    const handleMarkComplete = () => {
        if (!canMarkComplete) return;

        router.post(
            route('courses.complete', [course.id, lesson.id]),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (nextLesson) {
                        router.visit(route('courses.player', [course.id, nextLesson.id]));
                    }
                },
            },
        );
    };

    const handleVideoTimeUpdate = (e: Event) => {
        const video = e.target as HTMLVideoElement;
        const currentTime = video.currentTime;

        if (currentTime >= minWatchTime && !canMarkComplete) {
            setCanMarkComplete(true);
        }

        setWatchTime(currentTime);
    };

    const handleVideoPlay = () => {
        if (watchTime === 0) {
            setWatchTime(0.1);
        }
    };

    const getVideoEmbed = () => {
        if (lesson.video_type === 'youtube') {
            const videoId = lesson.video_url.split('v=')[1] || lesson.video_url.split('/').pop();
            return (
                <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={() => {
                        setTimeout(() => setCanMarkComplete(true), minWatchTime * 1000);
                    }}
                />
            );
        }

        if (lesson.video_type === 'gdrive') {
            const fileId = lesson.video_url.split('/d/')[1]?.split('/')[0];
            return (
                <iframe
                    className="h-full w-full"
                    src={`https://drive.google.com/file/d/${fileId}/preview`}
                    title={lesson.title}
                    allow="autoplay"
                    allowFullScreen
                    onLoad={() => {
                        setTimeout(() => setCanMarkComplete(true), minWatchTime * 1000);
                    }}
                />
            );
        }

        return (
            <video
                className="h-full w-full"
                controls
                ref={(el) => {
                    if (el && !videoElement) {
                        setVideoElement(el);
                        el.addEventListener('timeupdate', handleVideoTimeUpdate);
                        el.addEventListener('play', handleVideoPlay);
                    }
                }}
            >
                <source src={lesson.video_url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        );
    };

    return (
        <AppLayout>
            <Head title={`${lesson.title} - ${course.title}`} />

            {/* Mobile First Layout */}
            <div className="flex flex-col lg:flex-row lg:gap-6 lg:p-6">
                {/* Main Content - Desktop: Max Width */}
                <div className="flex-1 lg:max-w-4xl">
                    {/* Header - Mobile First */}
                    <div className="bg-background sticky top-0 z-10 border-b p-3 lg:relative lg:border-0 lg:p-0 lg:pb-4">
                        <div className="flex items-center gap-3">
                            <Link href={route('courses.index')}>
                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div className="min-w-0 flex-1">
                                <h1 className="truncate text-sm font-semibold sm:text-base lg:text-lg">{course.title}</h1>
                                <p className="text-muted-foreground truncate text-xs sm:text-sm">{lesson.title}</p>
                            </div>
                        </div>
                    </div>

                    {/* Video Player - Mobile First (Full Width) */}
                    <div className="relative w-full bg-black lg:overflow-hidden lg:rounded-lg" style={{ aspectRatio: '16/9' }}>
                        {getVideoEmbed()}
                    </div>

                    {/* Content - Mobile First */}
                    <div className="space-y-4 p-4 sm:p-6 lg:p-0 lg:pt-6">
                        {/* Lesson Info */}
                        <div>
                            <h2 className="mb-2 text-lg font-bold sm:text-xl lg:text-2xl">{lesson.title}</h2>
                            <div className="text-muted-foreground flex items-center gap-3 text-sm">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {lesson.duration} min
                                </span>
                                <span className="capitalize">{lesson.video_type}</span>
                            </div>
                        </div>

                        {/* Progress Card - Mobile First */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Course Progress</CardTitle>
                                <CardDescription className="text-sm">{enrollment.progress_percentage}% completed</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Progress value={enrollment.progress_percentage} className="h-2" />

                                {!canMarkComplete && !devMode && (
                                    <p className="text-muted-foreground text-xs">
                                        Watch at least {Math.ceil(minWatchTime)} seconds to mark as complete
                                    </p>
                                )}

                                {devMode && <p className="text-xs text-yellow-600">DEV MODE: Watch time requirement disabled</p>}

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    {enrollment.progress_percentage >= 100 ? (
                                        <Link href={route('courses.exam', course.id)} className="w-full sm:flex-1">
                                            <Button className="w-full">
                                                <FileCheck className="mr-2 h-4 w-4" />
                                                Take Exam
                                            </Button>
                                        </Link>
                                    ) : (
                                        <>
                                            <Button onClick={handleMarkComplete} disabled={!canMarkComplete} className="w-full sm:flex-1">
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                {canMarkComplete ? 'Mark as Complete' : 'Watch to unlock'}
                                            </Button>
                                            {nextLesson && (
                                                <Link href={route('courses.player', [course.id, nextLesson.id])} className="w-full sm:flex-1">
                                                    <Button variant="outline" className="w-full">
                                                        Next Lesson
                                                        <Play className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* About Course - Mobile First */}
                        <Card className="lg:hidden">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">About this course</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">{course.description}</p>
                            </CardContent>
                        </Card>

                        {/* Course Content - Mobile Only (Collapsible) */}
                        <div className="lg:hidden">
                            <Collapsible open={lessonsOpen} onOpenChange={setLessonsOpen}>
                                <Card>
                                    <CollapsibleTrigger className="w-full">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="text-left">
                                                    <CardTitle className="text-base">Course Content</CardTitle>
                                                    <CardDescription className="text-sm">{lessons.length} lessons</CardDescription>
                                                </div>
                                                {lessonsOpen ? (
                                                    <ChevronUp className="text-muted-foreground h-5 w-5" />
                                                ) : (
                                                    <ChevronDown className="text-muted-foreground h-5 w-5" />
                                                )}
                                            </div>
                                        </CardHeader>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <CardContent className="space-y-1 pt-0">
                                            {lessons.map((l, index) => (
                                                <Link
                                                    key={l.id}
                                                    href={route('courses.player', [course.id, l.id])}
                                                    className={cn(
                                                        'hover:bg-muted flex items-start gap-3 rounded-lg p-3 transition-colors',
                                                        l.id === lesson.id && 'bg-muted',
                                                    )}
                                                >
                                                    <div className="bg-background ring-border flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1">
                                                        {l.id === lesson.id ? (
                                                            <Play className="text-primary h-4 w-4" />
                                                        ) : enrollment.progress_percentage >= ((index + 1) / lessons.length) * 100 ? (
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Circle className="text-muted-foreground h-4 w-4" />
                                                        )}
                                                    </div>
                                                    <div className="min-w-0 flex-1 space-y-1">
                                                        <p className={cn('text-sm leading-tight font-medium', l.id === lesson.id && 'text-primary')}>
                                                            {l.title}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">
                                                            {l.duration} min • {l.video_type}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </CardContent>
                                    </CollapsibleContent>
                                </Card>
                            </Collapsible>
                        </div>
                    </div>
                </div>

                {/* Desktop Sidebar - Course Content & About */}
                <div className="hidden lg:block lg:w-96 lg:shrink-0">
                    <div className="sticky top-6 space-y-4">
                        {/* Course Content - Desktop */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Course Content</CardTitle>
                                <CardDescription className="text-sm">{lessons.length} lessons</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-[400px] overflow-y-auto">
                                    <div className="space-y-1 p-2">
                                        {lessons.map((l, index) => (
                                            <Link
                                                key={l.id}
                                                href={route('courses.player', [course.id, l.id])}
                                                className={cn(
                                                    'hover:bg-muted flex items-start gap-3 rounded-lg p-3 transition-colors',
                                                    l.id === lesson.id && 'bg-muted',
                                                )}
                                            >
                                                <div className="bg-background ring-border flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1">
                                                    {l.id === lesson.id ? (
                                                        <Play className="text-primary h-4 w-4" />
                                                    ) : enrollment.progress_percentage >= ((index + 1) / lessons.length) * 100 ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <Circle className="text-muted-foreground h-4 w-4" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <p className={cn('text-sm leading-tight font-medium', l.id === lesson.id && 'text-primary')}>
                                                        {l.title}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {l.duration} min • {l.video_type}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* About Course - Desktop */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">About this course</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-sm">{course.description}</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
