import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { AlertCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Course {
    id: number;
    title: string;
}

interface Question {
    id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
}

export default function Exam({
    course,
    questions,
    attemptCount,
    duration,
}: {
    course: Course;
    questions: Question[];
    attemptCount: number;
    duration: number;
}) {
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [unansweredCount, setUnansweredCount] = useState(0);

    const { data, setData, post, processing } = useForm<{
        answers: Record<number, string>;
    }>({
        answers: {},
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleAutoSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAutoSubmit = () => {
        if (!isSubmitting) {
            setIsSubmitting(true);
            post(route('courses.exam.submit', course.id));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const unanswered = questions.filter((q) => !data.answers[q.id]);
        if (unanswered.length > 0) {
            setUnansweredCount(unanswered.length);
            setShowConfirmDialog(true);
            return;
        }

        submitExam();
    };

    const submitExam = () => {
        setIsSubmitting(true);
        post(route('courses.exam.submit', course.id));
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const answeredCount = Object.keys(data.answers).length;
    const progressPercentage = (answeredCount / questions.length) * 100;

    return (
        <AppLayout>
            <Head title={`Exam - ${course.title}`} />

            <div className="bg-muted/30 min-h-screen p-4 sm:p-6 lg:p-8">
                {/* Sticky Header */}
                <div className="bg-background sticky top-0 z-10 mb-6 rounded-lg p-4 shadow-md">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-bold sm:text-2xl">{course.title}</h1>
                            <p className="text-muted-foreground text-sm">
                                Attempt {attemptCount + 1} of 3 • {questions.length} Questions
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 flex items-center gap-2 rounded-lg px-4 py-2">
                                <Clock className={`h-5 w-5 ${timeLeft < 300 ? 'text-destructive' : 'text-primary'}`} />
                                <span className={`text-lg font-bold ${timeLeft < 300 ? 'text-destructive' : 'text-primary'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="mb-2 flex justify-between text-sm">
                            <span>Progress</span>
                            <span>
                                {answeredCount} / {questions.length}
                            </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                    </div>
                </div>

                {timeLeft < 300 && (
                    <Alert className="border-destructive mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Less than 5 minutes remaining! Please review your answers.</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {questions.map((question, index) => (
                        <Card key={question.id}>
                            <CardHeader>
                                <CardTitle className="flex items-start gap-3 text-base sm:text-lg">
                                    <span className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="flex-1">{question.question_text}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup
                                    value={data.answers[question.id] || ''}
                                    onValueChange={(value) => {
                                        setData('answers', {
                                            ...data.answers,
                                            [question.id]: value,
                                        });
                                    }}
                                    className="space-y-3"
                                >
                                    {['a', 'b', 'c', 'd'].map((option) => (
                                        <div
                                            key={option}
                                            className={`flex items-start space-x-3 rounded-lg border-2 p-4 transition-colors ${
                                                data.answers[question.id] === option
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                        >
                                            <RadioGroupItem value={option} id={`q${question.id}-${option}`} className="mt-1" />
                                            <Label htmlFor={`q${question.id}-${option}`} className="flex-1 cursor-pointer font-normal">
                                                <span className="mr-2 font-semibold">{option.toUpperCase()}.</span>
                                                {question[`option_${option}` as keyof Question]}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    ))}

                    <Card className="sticky bottom-4 shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-muted-foreground text-sm">
                                    {answeredCount === questions.length
                                        ? 'All questions answered!'
                                        : `${questions.length - answeredCount} questions remaining`}
                                </p>
                                <Button type="submit" disabled={processing || isSubmitting} size="lg" className="w-full sm:w-auto">
                                    {processing || isSubmitting ? 'Submitting...' : 'Submit Exam'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>

            <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}. Are you sure you want to submit
                            anyway?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Review Answers</AlertDialogCancel>
                        <AlertDialogAction onClick={submitExam}>Submit Anyway</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
