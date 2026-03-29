import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Course {
    id: number;
    title: string;
}

export default function Create({ users, courses }: { users: User[]; courses: Course[] }) {
    const { data, setData, post, errors, processing } = useForm<{
        user_id: string;
        course_id: string;
    }>({
        user_id: '',
        course_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.enrollments.store'));
    };

    return (
        <AppLayout>
            <Head title="Add Enrollment" />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('admin.enrollments.index')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Add Enrollment</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Assign a course to a user</p>
                    </div>
                </div>

                {/* Form */}
                <Card className="mx-auto max-w-2xl">
                    <CardHeader>
                        <CardTitle>Enrollment Details</CardTitle>
                        <CardDescription>Select a user and course to create enrollment</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* User */}
                            <div className="space-y-2">
                                <Label htmlFor="user_id">User</Label>
                                <Select value={data.user_id} onValueChange={(value) => setData('user_id', value)}>
                                    <SelectTrigger id="user_id">
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name} ({user.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.user_id && <p className="text-sm text-red-600">{errors.user_id}</p>}
                            </div>

                            {/* Course */}
                            <div className="space-y-2">
                                <Label htmlFor="course_id">Course</Label>
                                <Select value={data.course_id} onValueChange={(value) => setData('course_id', value)}>
                                    <SelectTrigger id="course_id">
                                        <SelectValue placeholder="Select course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {courses.map((course) => (
                                            <SelectItem key={course.id} value={course.id.toString()}>
                                                {course.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.course_id && <p className="text-sm text-red-600">{errors.course_id}</p>}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Enrollment'}
                                </Button>
                                <Link href={route('admin.enrollments.index')}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
