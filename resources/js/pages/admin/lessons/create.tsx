import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Course {
    id: number;
    title: string;
}

export default function Create({ course }: { course: Course }) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        video_type: string;
        video_url: string;
        duration: number;
        order: number;
    }>({
        title: '',
        video_type: 'youtube',
        video_url: '',
        duration: 10,
        order: 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.courses.lessons.store', course.id));
    };

    return (
        <AppLayout>
            <Head title={`Create Lesson - ${course.title}`} />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.courses.lessons.index', course.id)}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Create Lesson</h1>
                        <p className="text-muted-foreground text-sm">{course.title}</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lesson Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter lesson title"
                                />
                                {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="video_type">Video Type</Label>
                                    <Select value={data.video_type} onValueChange={(value) => setData('video_type', value)}>
                                        <SelectTrigger id="video_type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="internal">Internal</SelectItem>
                                            <SelectItem value="youtube">YouTube</SelectItem>
                                            <SelectItem value="gdrive">Google Drive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.video_type && <p className="text-destructive text-sm">{errors.video_type}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration (minutes)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        min="1"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', parseInt(e.target.value))}
                                    />
                                    {errors.duration && <p className="text-destructive text-sm">{errors.duration}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="video_url">Video URL</Label>
                                <Input
                                    id="video_url"
                                    value={data.video_url}
                                    onChange={(e) => setData('video_url', e.target.value)}
                                    placeholder="https://..."
                                />
                                {errors.video_url && <p className="text-destructive text-sm">{errors.video_url}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Order</Label>
                                <Input
                                    id="order"
                                    type="number"
                                    min="0"
                                    value={data.order}
                                    onChange={(e) => setData('order', parseInt(e.target.value))}
                                />
                                {errors.order && <p className="text-destructive text-sm">{errors.order}</p>}
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Link href={route('admin.courses.lessons.index', course.id)} className="w-full sm:w-auto">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    {processing ? 'Creating...' : 'Create Lesson'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
