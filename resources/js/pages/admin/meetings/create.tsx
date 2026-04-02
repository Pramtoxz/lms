import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar } from 'lucide-react';

interface Course {
    id: number;
    title: string;
}

interface Props {
    courses: Course[];
}

export default function Create({ courses }: Props) {
    const { data, setData, post, errors, processing } = useForm<{
        course_id: string;
        start_time: string;
        duration: string;
    }>({
        course_id: '',
        start_time: '',
        duration: '60',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.meetings.store'));
    };

    // Get minimum datetime (now + 5 minutes)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 5);
        return now.toISOString().slice(0, 16);
    };

    return (
        <>
            <Head title="Create Meeting" />

            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild className="shrink-0">
                        <Link href={route('admin.meetings.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Create Meeting</h1>
                        <p className="text-sm text-muted-foreground sm:text-base">Schedule a new Zoom meeting</p>
                    </div>
                </div>

                {/* Form */}
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Meeting Details
                        </CardTitle>
                        <CardDescription>
                            Fill in the details to create a new Zoom meeting. The meeting will be created automatically via Zoom API.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Course Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="course_id">
                                    Course <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.course_id}
                                    onValueChange={(value) => setData('course_id', value)}
                                >
                                    <SelectTrigger id="course_id">
                                        <SelectValue placeholder="Select a course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map((course) => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.course_id && (
                                    <p className="text-sm text-destructive">{errors.course_id}</p>
                                )}
                            </div>

                            {/* Start Time */}
                            <div className="space-y-2">
                                <Label htmlFor="start_time">
                                    Start Time <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="start_time"
                                    type="datetime-local"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    min={getMinDateTime()}
                                />
                                {errors.start_time && (
                                    <p className="text-sm text-destructive">{errors.start_time}</p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Meeting must be scheduled at least 5 minutes from now
                                </p>
                            </div>

                            {/* Duration */}
                            <div className="space-y-2">
                                <Label htmlFor="duration">
                                    Duration (minutes) <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={data.duration}
                                    onValueChange={(value) => setData('duration', value)}
                                >
                                    <SelectTrigger id="duration">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="15">15 minutes</SelectItem>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="45">45 minutes</SelectItem>
                                        <SelectItem value="60">1 hour</SelectItem>
                                        <SelectItem value="90">1.5 hours</SelectItem>
                                        <SelectItem value="120">2 hours</SelectItem>
                                        <SelectItem value="180">3 hours</SelectItem>
                                        <SelectItem value="240">4 hours</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.duration && (
                                    <p className="text-sm text-destructive">{errors.duration}</p>
                                )}
                            </div>

                            {/* Error Message */}
                            {'error' in errors && typeof errors.error === 'string' && (
                                <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
                                    <p className="text-sm text-destructive">{errors.error}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                    disabled={processing}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full sm:w-auto"
                                >
                                    {processing ? 'Creating...' : 'Create Meeting'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Create.layout = (page: React.ReactNode) => <AppLayout children={page} />;
