import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, FileCheck, Play } from 'lucide-react';

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string | null;
}

interface Enrollment {
    id: number;
    course_id: number;
    progress_percentage: number;
    status: string;
    course: Course;
}

interface ExamStatus {
    enrollment: Enrollment;
    exam_taken: boolean;
    last_attempt?: {
        score: number;
        is_passed: boolean;
        attempt: number;
        created_at: string;
    };
    attempts_remaining: number;
}

export default function Index({ examStatuses }: { examStatuses: ExamStatus[] }) {
    const getStatusBadge = (status: ExamStatus) => {
        if (!status.exam_taken) {
            return <Badge variant="secondary">Not Taken</Badge>;
        }
        if (status.last_attempt?.is_passed) {
            return <Badge className="bg-green-100 text-green-800">Passed</Badge>;
        }
        if (status.attempts_remaining === 0) {
            return <Badge variant="destructive">Max Attempts</Badge>;
        }
        return <Badge variant="destructive">Failed</Badge>;
    };

    const getActionButton = (status: ExamStatus) => {
        if (status.enrollment.progress_percentage < 100) {
            return (
                <Link href={route('courses.player', [status.enrollment.course_id, 1])}>
                    <Button variant="outline" size="sm" className="w-full">
                        <Play className="mr-2 h-4 w-4" />
                        Continue Course
                    </Button>
                </Link>
            );
        }

        if (status.last_attempt?.is_passed) {
            return (
                <Link href={route('courses.exam.result', [status.enrollment.course_id, status.last_attempt])}>
                    <Button variant="outline" size="sm" className="w-full">
                        View Result
                    </Button>
                </Link>
            );
        }

        if (status.attempts_remaining > 0) {
            return (
                <Link href={route('courses.exam', status.enrollment.course_id)}>
                    <Button size="sm" className="w-full">
                        <FileCheck className="mr-2 h-4 w-4" />
                        {status.exam_taken ? 'Retry Exam' : 'Take Exam'}
                    </Button>
                </Link>
            );
        }

        return (
            <Button variant="outline" size="sm" className="w-full" disabled>
                Max Attempts Reached
            </Button>
        );
    };

    const eligibleExams = examStatuses.filter((s) => s.enrollment.progress_percentage >= 100);
    const inProgressCourses = examStatuses.filter((s) => s.enrollment.progress_percentage < 100);

    return (
        <AppLayout>
            <Head title="Exams" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Exams</h1>
                    <p className="text-muted-foreground">Take exams for completed courses and earn certificates</p>
                </div>

                {eligibleExams.length > 0 ? (
                    <div>
                        <h2 className="mb-4 text-lg font-semibold">Available Exams</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {eligibleExams.map((status) => (
                                <Card key={status.enrollment.id}>
                                    <div className="bg-muted relative aspect-video overflow-hidden">
                                        {status.enrollment.course.thumbnail ? (
                                            <img
                                                src={`/storage/${status.enrollment.course.thumbnail}`}
                                                alt={status.enrollment.course.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700">
                                                <FileCheck className="h-16 w-16 text-white opacity-50" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">{getStatusBadge(status)}</div>
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2 text-base">{status.enrollment.course.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {status.last_attempt && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground">Last Score</span>
                                                    <span className="font-bold">{status.last_attempt.score}%</span>
                                                </div>
                                                <Progress value={status.last_attempt.score} className="h-2" />
                                            </div>
                                        )}

                                        <div className="text-muted-foreground flex items-center justify-between text-sm">
                                            <span>Attempts</span>
                                            <span>{status.exam_taken ? status.last_attempt?.attempt || 0 : 0} / 3</span>
                                        </div>

                                        {getActionButton(status)}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="bg-muted mb-4 rounded-full p-6">
                                <FileCheck className="text-muted-foreground h-12 w-12" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold">No Exams Available</h3>
                            <p className="text-muted-foreground mb-6 text-center text-sm">Complete your courses to unlock exams</p>
                        </CardContent>
                    </Card>
                )}

                {inProgressCourses.length > 0 && (
                    <div>
                        <h2 className="mb-4 text-lg font-semibold">In Progress</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {inProgressCourses.map((status) => (
                                <Card key={status.enrollment.id} className="opacity-75">
                                    <div className="bg-muted relative aspect-video overflow-hidden">
                                        {status.enrollment.course.thumbnail ? (
                                            <img
                                                src={`/storage/${status.enrollment.course.thumbnail}`}
                                                alt={status.enrollment.course.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-500 to-gray-700">
                                                <AlertCircle className="h-16 w-16 text-white opacity-50" />
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2 text-base">{status.enrollment.course.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">Progress</span>
                                                <span className="font-medium">{status.enrollment.progress_percentage}%</span>
                                            </div>
                                            <Progress value={status.enrollment.progress_percentage} className="h-2" />
                                        </div>

                                        <Link href={route('courses.player', [status.enrollment.course_id, 1])}>
                                            <Button variant="outline" size="sm" className="w-full">
                                                <Play className="mr-2 h-4 w-4" />
                                                Continue Course
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
