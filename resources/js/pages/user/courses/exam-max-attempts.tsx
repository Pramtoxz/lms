import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface Course {
    id: number;
    title: string;
}

interface ExamResult {
    score: number;
    is_passed: boolean;
    attempt: number;
}

export default function ExamMaxAttempts({ course, lastResult }: { course: Course; lastResult: ExamResult }) {
    return (
        <AppLayout>
            <Head title={`Maximum Attempts Reached - ${course.title}`} />

            <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                            <AlertCircle className="h-12 w-12 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl">Maximum Attempts Reached</CardTitle>
                        <p className="text-muted-foreground">You have used all 3 exam attempts</p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-muted rounded-lg p-4">
                            <h3 className="mb-2 font-semibold">Last Attempt Result</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-sm">Score</span>
                                <span className="text-lg font-bold">{lastResult.score}%</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-muted-foreground text-sm">Status</span>
                                <span className={`text-sm font-semibold ${lastResult.is_passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {lastResult.is_passed ? 'Passed' : 'Not Passed'}
                                </span>
                            </div>
                        </div>

                        <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-4">
                            <p className="text-destructive text-sm">
                                You have reached the maximum number of attempts (3) for this exam. Please contact support or your instructor for
                                assistance.
                            </p>
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
