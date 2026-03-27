import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Lock } from 'lucide-react';

interface Course {
    id: number;
    title: string;
}

interface Enrollment {
    progress_percentage: number;
}

export default function ExamLocked({ course, enrollment }: { course: Course; enrollment: Enrollment }) {
    return (
        <AppLayout>
            <Head title={`Exam Locked - ${course.title}`} />

            <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                            <Lock className="h-12 w-12 text-yellow-600" />
                        </div>
                        <CardTitle className="text-2xl">Exam Locked</CardTitle>
                        <p className="text-muted-foreground">Complete all lessons to unlock the exam</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Course Progress</span>
                                <span className="text-lg font-bold">{enrollment.progress_percentage}%</span>
                            </div>
                            <Progress value={enrollment.progress_percentage} className="h-3" />
                            <p className="text-muted-foreground text-center text-sm">
                                {100 - enrollment.progress_percentage}% remaining to unlock exam
                            </p>
                        </div>

                        <div className="bg-muted rounded-lg p-4">
                            <h3 className="mb-2 font-semibold">Requirements</h3>
                            <ul className="text-muted-foreground space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <span className="text-primary">•</span>
                                    Complete all video lessons
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary">•</span>
                                    Mark each lesson as complete
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-primary">•</span>
                                    Reach 100% course progress
                                </li>
                            </ul>
                        </div>

                        <Link href={route('courses.index')}>
                            <Button variant="outline" className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Courses
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
