import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Head, Link } from '@inertiajs/react';
import { 
    BookOpen, 
    Calendar, 
    TrendingUp, 
    Clock,
    CheckCircle2,
    Video,
    Award,
    ArrowRight
} from 'lucide-react';

interface Stats {
    enrolled_courses: number;
    completed_courses: number;
    passed_exams: number;
    upcoming_meetings: number;
}

interface Course {
    id: number;
    title: string;
    thumbnail: string | null;
    progress: number;
    total_lessons: number;
}

interface Meeting {
    id: number;
    course: {
        id: number;
        title: string;
    };
    start_time: string;
    duration: number;
    ended_at: string | null;
    attendances: Array<{
        id: number;
        check_in_time: string | null;
    }>;
}

interface ExamResult {
    id: number;
    course: {
        id: number;
        title: string;
    };
    score: number;
    is_passed: boolean;
    created_at: string;
}

interface Props {
    stats: Stats;
    inProgressCourses: Course[];
    upcomingMeetings: Meeting[];
    recentExams: ExamResult[];
}

export default function Dashboard({ stats, inProgressCourses, upcomingMeetings, recentExams }: Props) {
    const formatDate = (dateTime: string) => {
        return new Date(dateTime).toLocaleDateString('en-MY', {
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleTimeString('en-MY', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title="Dashboard" />
            
            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">
                            Track your learning progress
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/browse">
                            <BookOpen className="h-4 w-4" />
                            Browse Courses
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="overflow-hidden">
                        <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10" />
                        <CardHeader className="relative pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                    <BookOpen className="h-5 w-5 text-blue-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">{stats.enrolled_courses}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium">Enrolled Courses</p>
                            <p className="text-xs text-muted-foreground">Active learning</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-green-500/10" />
                        <CardHeader className="relative pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">{stats.completed_courses}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium">Completed</p>
                            <p className="text-xs text-muted-foreground">Courses finished</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-purple-500/10" />
                        <CardHeader className="relative pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                                    <Award className="h-5 w-5 text-purple-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">{stats.passed_exams}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium">Passed Exams</p>
                            <p className="text-xs text-muted-foreground">Certificates earned</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                        <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-orange-500/10" />
                        <CardHeader className="relative pb-2">
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                                    <Calendar className="h-5 w-5 text-orange-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">{stats.upcoming_meetings}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm font-medium">Upcoming Meetings</p>
                            <p className="text-xs text-muted-foreground">Live classes</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
                    {/* Continue Learning - Takes 2 columns on large screens */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <TrendingUp className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base sm:text-lg">Continue Learning</CardTitle>
                                        <CardDescription className="text-xs">Pick up where you left off</CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/courses" className="text-xs sm:text-sm">
                                        View All
                                        <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {inProgressCourses && inProgressCourses.length > 0 ? (
                                inProgressCourses.map((course) => (
                                    <Link
                                        key={course.id}
                                        href={`/courses/${course.id}/lessons/${course.id}`}
                                        className="group block"
                                    >
                                        <div className="flex gap-3 rounded-lg border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-md sm:gap-4">
                                            {course.thumbnail ? (
                                                <img
                                                    src={`/storage/${course.thumbnail}`}
                                                    alt={course.title}
                                                    className="h-14 w-14 rounded-lg object-cover sm:h-16 sm:w-16"
                                                />
                                            ) : (
                                                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted sm:h-16 sm:w-16">
                                                    <BookOpen className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6" />
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-2">
                                                <div>
                                                    <h4 className="font-medium leading-tight group-hover:text-primary sm:text-base">
                                                        {course.title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {course.total_lessons} lessons
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">Progress</span>
                                                        <span className="font-semibold text-primary">{course.progress}%</span>
                                                    </div>
                                                    <Progress value={course.progress} className="h-1.5" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                        <BookOpen className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="mt-3 text-sm font-medium">No courses in progress</p>
                                    <p className="mt-1 text-xs text-muted-foreground">Start learning something new today</p>
                                    <Button variant="outline" size="sm" asChild className="mt-4">
                                        <Link href="/browse">Browse Courses</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Meetings - Takes 1 column */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                                    <Video className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-base sm:text-lg">Live Classes</CardTitle>
                                    <CardDescription className="text-xs">Upcoming sessions</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {upcomingMeetings && upcomingMeetings.length > 0 ? (
                                <>
                                    {upcomingMeetings.map((meeting) => (
                                        <div
                                            key={meeting.id}
                                            className="group rounded-lg border bg-card p-3 transition-all hover:border-orange-500/50 hover:shadow-md"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-11 w-11 flex-col items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                                                    <span className="text-[10px] font-medium uppercase">
                                                        {formatDate(meeting.start_time).split(' ')[0]}
                                                    </span>
                                                    <span className="text-base font-bold leading-none">
                                                        {formatDate(meeting.start_time).split(' ')[1]}
                                                    </span>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <h4 className="text-sm font-medium leading-tight group-hover:text-orange-600">
                                                        {meeting.course.title}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        {formatTime(meeting.start_time)} · {meeting.duration} min
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <Button variant="outline" size="sm" className="w-full" asChild>
                                        <Link href="/timetable">
                                            View All Meetings
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground">No upcoming meetings</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Exam Results */}
                {recentExams && recentExams.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                                        <Award className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base sm:text-lg">Recent Exam Results</CardTitle>
                                        <CardDescription className="text-xs">Your latest achievements</CardDescription>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/exams" className="text-xs sm:text-sm">
                                        View All
                                        <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {recentExams.map((exam) => (
                                    <div
                                        key={exam.id}
                                        className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-all hover:shadow-md"
                                    >
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-full ${
                                                exam.is_passed
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-red-100 text-red-600'
                                            }`}
                                        >
                                            <span className="text-base font-bold">{exam.score}</span>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h4 className="text-sm font-medium leading-tight">{exam.course.title}</h4>
                                            <div className="flex items-center gap-2">
                                                <Badge 
                                                    variant={exam.is_passed ? 'default' : 'destructive'}
                                                    className="text-xs"
                                                >
                                                    {exam.is_passed ? 'Passed' : 'Failed'}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(exam.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

Dashboard.layout = (page: React.ReactNode) => <AppLayout children={page} />;
