import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Clock, FileText, GraduationCap, PlayCircle, ShoppingCart, ArrowLeft, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lesson {
    id: number;
    title: string;
    video_type: string;
    duration: number;
    order: number;
}

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string | null;
    price: string;
    is_free: boolean;
    exam_duration: number;
    lessons_count: number;
    questions_count: number;
    lessons: Lesson[];
}

interface Enrollment {
    id: number;
    progress_percentage: number;
    status: string;
}

export default function Show({ course, isEnrolled, enrollment }: { course: Course; isEnrolled: boolean; enrollment: Enrollment | null }) {
    const handleEnroll = () => {
        router.post(route('courses.enroll', course.id));
    };

    const handleBuyNow = () => {
        router.get(route('courses.checkout', course.id));
    };

    const totalDuration = course.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
    const hours = Math.floor(totalDuration / 60);
    const minutes = totalDuration % 60;

    return (
        <AppLayout>
            <Head title={course.title} />

            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                {/* Hero Section */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
                    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {/* Back Button */}
                        <Link href={route('courses.browse')}>
                            <Button variant="ghost" className="mb-6 gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Browse
                            </Button>
                        </Link>

                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Left: Course Info */}
                            <div className="lg:col-span-2">
                                {/* Badges */}
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {course.is_free ? (
                                        <Badge className="bg-green-500 text-white hover:bg-green-600">FREE COURSE</Badge>
                                    ) : (
                                        <Badge className="bg-blue-500 text-white hover:bg-blue-600">PREMIUM</Badge>
                                    )}
                                    {isEnrolled && (
                                        <Badge className="bg-primary text-primary-foreground">
                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                            Enrolled
                                        </Badge>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{course.title}</h1>

                                {/* Description */}
                                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{course.description}</p>

                                {/* Stats */}
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 rounded-full p-2">
                                            <BookOpen className="text-primary h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{course.lessons_count} Lessons</p>
                                            <p className="text-muted-foreground text-xs">Complete curriculum</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 rounded-full p-2">
                                            <Clock className="text-primary h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {hours > 0 && `${hours}h `}
                                                {minutes}m
                                            </p>
                                            <p className="text-muted-foreground text-xs">Total duration</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 rounded-full p-2">
                                            <FileText className="text-primary h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{course.questions_count} Questions</p>
                                            <p className="text-muted-foreground text-xs">Final exam</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-primary/10 rounded-full p-2">
                                            <Award className="text-primary h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Certificate</p>
                                            <p className="text-muted-foreground text-xs">Upon completion</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Enrollment Card */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-8 overflow-hidden shadow-xl">
                                    {/* Thumbnail */}
                                    <div className="bg-muted relative aspect-video overflow-hidden">
                                        {course.thumbnail ? (
                                            <img src={`/storage/${course.thumbnail}`} alt={course.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                                <BookOpen className="text-primary/40 h-20 w-20" />
                                            </div>
                                        )}
                                        {!isEnrolled && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                                <PlayCircle className="h-16 w-16 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader>
                                        {!course.is_free && (
                                            <div className="mb-2">
                                                <p className="text-muted-foreground text-sm">Price</p>
                                                <p className="text-3xl font-bold">RM {parseFloat(course.price).toFixed(2)}</p>
                                            </div>
                                        )}

                                        {isEnrolled && enrollment && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Your Progress</span>
                                                    <span className="font-semibold">{enrollment.progress_percentage}%</span>
                                                </div>
                                                <div className="bg-muted h-2 overflow-hidden rounded-full">
                                                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${enrollment.progress_percentage}%` }} />
                                                </div>
                                            </div>
                                        )}
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        {isEnrolled ? (
                                            <>
                                                <Link href={route('courses.index')}>
                                                    <Button className="w-full gap-2" size="lg">
                                                        <PlayCircle className="h-5 w-5" />
                                                        Continue Learning
                                                    </Button>
                                                </Link>
                                                <p className="text-muted-foreground text-center text-xs">You're enrolled in this course</p>
                                            </>
                                        ) : course.is_free ? (
                                            <>
                                                <Button onClick={handleEnroll} className="w-full gap-2" size="lg">
                                                    <GraduationCap className="h-5 w-5" />
                                                    Enroll for Free
                                                </Button>
                                                <p className="text-muted-foreground text-center text-xs">Start learning immediately</p>
                                            </>
                                        ) : (
                                            <>
                                                <Button onClick={handleBuyNow} className="w-full gap-2" size="lg">
                                                    <ShoppingCart className="h-5 w-5" />
                                                    Buy Now
                                                </Button>
                                                <p className="text-muted-foreground text-center text-xs">30-day money-back guarantee</p>
                                            </>
                                        )}

                                        <Separator />

                                        {/* What's Included */}
                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold">This course includes:</p>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="text-primary h-4 w-4 flex-shrink-0" />
                                                    <span>{course.lessons_count} video lessons</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="text-primary h-4 w-4 flex-shrink-0" />
                                                    <span>Final exam with {course.questions_count} questions</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="text-primary h-4 w-4 flex-shrink-0" />
                                                    <span>Certificate of completion</span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="text-primary h-4 w-4 flex-shrink-0" />
                                                    <span>Lifetime access</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <Tabs defaultValue="curriculum" className="space-y-6">
                        <TabsList className="grid w-full max-w-md grid-cols-2">
                            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                            <TabsTrigger value="about">About</TabsTrigger>
                        </TabsList>

                        {/* Curriculum Tab */}
                        <TabsContent value="curriculum" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Course Curriculum</CardTitle>
                                    <CardDescription>
                                        {course.lessons_count} lessons • {hours > 0 && `${hours}h `}
                                        {minutes}m total length
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {course.lessons.length === 0 ? (
                                        <div className="text-muted-foreground py-8 text-center">
                                            <BookOpen className="mx-auto mb-2 h-12 w-12 opacity-50" />
                                            <p>No lessons available yet</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {course.lessons.map((lesson, index) => (
                                                <div
                                                    key={lesson.id}
                                                    className={cn(
                                                        'flex items-center justify-between rounded-lg border p-4 transition-colors',
                                                        isEnrolled ? 'hover:bg-muted cursor-pointer' : 'opacity-75'
                                                    )}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full font-semibold">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{lesson.title}</p>
                                                            <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                                                                <span className="flex items-center gap-1">
                                                                    <PlayCircle className="h-3.5 w-3.5" />
                                                                    {lesson.video_type}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <Clock className="h-3.5 w-3.5" />
                                                                    {lesson.duration} min
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {!isEnrolled && (
                                                        <div className="text-muted-foreground flex items-center gap-1 text-sm">
                                                            <span>Locked</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Exam Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5" />
                                        Final Exam
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="rounded-lg border p-4">
                                            <p className="text-muted-foreground mb-1 text-sm">Questions</p>
                                            <p className="text-2xl font-bold">{course.questions_count}</p>
                                        </div>
                                        <div className="rounded-lg border p-4">
                                            <p className="text-muted-foreground mb-1 text-sm">Duration</p>
                                            <p className="text-2xl font-bold">{course.exam_duration} min</p>
                                        </div>
                                        <div className="rounded-lg border p-4">
                                            <p className="text-muted-foreground mb-1 text-sm">Passing Score</p>
                                            <p className="text-2xl font-bold">80%</p>
                                        </div>
                                    </div>
                                    <div className="bg-muted/50 rounded-lg p-4">
                                        <p className="text-sm">
                                            <strong>Note:</strong> You must complete all lessons before taking the exam. You have 3 attempts to pass. Upon
                                            passing, you'll receive a certificate of completion.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* About Tab */}
                        <TabsContent value="about" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About This Course</CardTitle>
                                </CardHeader>
                                <CardContent className="prose prose-sm max-w-none">
                                    <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>What You'll Learn</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        {course.lessons.slice(0, 6).map((lesson) => (
                                            <li key={lesson.id} className="flex items-start gap-2">
                                                <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                                                <span className="text-sm">{lesson.title}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AppLayout>
    );
}
