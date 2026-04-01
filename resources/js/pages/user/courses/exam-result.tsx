import certificateAnimation from '@/assets/animations/certificate.json';
import notPassedAnimation from '@/assets/animations/not_passed.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import Lottie from 'lottie-react';
import { ArrowLeft, Download, RotateCcw } from 'lucide-react';

interface Course {
    id: number;
    title: string;
}

interface ExamResult {
    id: number;
    score: number;
    is_passed: boolean;
    attempt: number;
    created_at: string;
}

export default function ExamResult({ course, result }: { course: Course; result: ExamResult }) {
    return (
        <AppLayout>
            <Head title={`Exam Result - ${course.title}`} />

            <div className="bg-muted/30 flex min-h-screen items-center justify-center p-4">
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center">
                            {result.is_passed ? (
                                <Lottie animationData={certificateAnimation} loop={false} />
                            ) : (
                                <Lottie animationData={notPassedAnimation} loop={true} />
                            )}
                        </div>
                        <CardTitle className="text-2xl sm:text-3xl">{result.is_passed ? 'Congratulations!' : 'Not Passed'}</CardTitle>
                        <p className="text-muted-foreground">
                            {result.is_passed ? 'You have successfully passed the exam' : 'You did not meet the passing score'}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Your Score</span>
                                <span className="text-2xl font-bold">{result.score}%</span>
                            </div>
                            <Progress value={result.score} className="h-3" />
                            <div className="text-muted-foreground flex justify-between text-sm">
                                <span>Passing Score: 80%</span>
                                <span>Attempt {result.attempt} of 3</span>
                            </div>
                        </div>

                        <div className="bg-muted rounded-lg p-4">
                            <h3 className="mb-2 font-semibold">Course Details</h3>
                            <p className="text-muted-foreground text-sm">{course.title}</p>
                            <p className="text-muted-foreground mt-2 text-xs">
                                Completed on{' '}
                                {new Date(result.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link href={route('courses.index')} className="flex-1">
                                <Button variant="outline" className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Courses
                                </Button>
                            </Link>

                            {result.is_passed ? (
                                <a href={route('courses.exam.certificate', [course.id, result.id])} className="flex-1">
                                    <Button className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Certificate
                                    </Button>
                                </a>
                            ) : result.attempt < 3 ? (
                                <Link href={route('courses.exam', course.id)} className="flex-1">
                                    <Button className="w-full">
                                        <RotateCcw className="mr-2 h-4 w-4" />
                                        Retry Exam
                                    </Button>
                                </Link>
                            ) : null}
                        </div>

                        {!result.is_passed && result.attempt >= 3 && (
                            <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-4 text-center">
                                <p className="text-destructive text-sm">
                                    You have reached the maximum number of attempts (3). Please contact support for assistance.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
