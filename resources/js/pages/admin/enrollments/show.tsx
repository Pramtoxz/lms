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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Search, Trash2, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Course {
    id: number;
    title: string;
}

interface Enrollment {
    id: number;
    course: Course;
    progress_percentage: number;
    status: string;
    enrolled_at: string;
}

interface PaginatedEnrollments {
    data: Enrollment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function Show({
    user,
    enrollments,
    filters,
    courses,
}: {
    user: User;
    enrollments: PaginatedEnrollments;
    filters: { search?: string; status?: string };
    courses: Course[];
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const { data, setData, post, errors, reset } = useForm<{
        course_id: string;
    }>({
        course_id: '',
    });

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            route('admin.enrollments.show', user.id),
            { search: value, status: status !== 'all' ? status : undefined },
            { preserveState: true, replace: true },
        );
    }, 500);

    useEffect(() => {
        debouncedSearch(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get(
            route('admin.enrollments.show', user.id),
            { search, status: value !== 'all' ? value : undefined },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(route('admin.enrollments.destroy', deleteId), {
                onFinish: () => setDeleteId(null),
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.enrollments.store', user.id), {
            onSuccess: () => {
                reset();
                setShowAddForm(false);
            },
        });
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            ongoing: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
    };

    return (
        <AppLayout>
            <Head title={`${user.name}'s Enrollments`} />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="space-y-4">
                    <Link href={route('admin.enrollments.index')}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Button>
                    </Link>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">{user.name}</h1>
                            <p className="text-muted-foreground mt-1 text-sm">{user.email}</p>
                            <p className="text-muted-foreground mt-1 text-sm">Total Enrollments: {enrollments.total}</p>
                        </div>
                        <Button onClick={() => setShowAddForm(!showAddForm)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Enrollment
                        </Button>
                    </div>
                </div>

                {/* Add Enrollment Form */}
                {showAddForm && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Enrollment</CardTitle>
                            <CardDescription>Enroll {user.name} in a new course</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="course_id">Course</Label>
                                    <Select value={data.course_id} onValueChange={(value) => setData('course_id', value)}>
                                        <SelectTrigger>
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
                                    {errors.course_id && <p className="text-sm text-red-500">{errors.course_id}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit">Add Enrollment</Button>
                                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Filters */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            type="text"
                            placeholder="Search course..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Mobile: Cards */}
                <div className="space-y-4 lg:hidden">
                    {enrollments.data.map((enrollment) => (
                        <Card key={enrollment.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-base">{enrollment.course.title}</CardTitle>
                                    <span className={cn('rounded-full px-2 py-1 text-xs font-medium', getStatusBadge(enrollment.status))}>
                                        {enrollment.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-muted-foreground text-xs">Progress</p>
                                    <p className="text-sm font-medium">{enrollment.progress_percentage}%</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Enrolled</p>
                                    <p className="text-sm">{new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => setDeleteId(enrollment.id)} className="w-full">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Desktop: Table */}
                <Card className="hidden lg:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Course</TableHead>
                                <TableHead>Progress</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Enrolled</TableHead>
                                <TableHead className="w-24">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {enrollments.data.map((enrollment, idx) => (
                                <TableRow key={enrollment.id}>
                                    <TableCell>{(enrollments.current_page - 1) * enrollments.per_page + idx + 1}</TableCell>
                                    <TableCell className="font-medium">{enrollment.course.title}</TableCell>
                                    <TableCell>{enrollment.progress_percentage}%</TableCell>
                                    <TableCell>
                                        <span className={cn('rounded-full px-2 py-1 text-xs font-medium', getStatusBadge(enrollment.status))}>
                                            {enrollment.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(enrollment.enrolled_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(enrollment.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Empty State */}
                {enrollments.data.length === 0 && (
                    <Card>
                        <CardContent className="flex min-h-[300px] flex-col items-center justify-center py-12">
                            <UserCheck className="text-muted-foreground mb-4 h-12 w-12" />
                            <p className="text-muted-foreground mb-4 text-center">No enrollments found for this user</p>
                            <Button onClick={() => setShowAddForm(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Enrollment
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {enrollments.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {Array.from({ length: enrollments.last_page }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === enrollments.current_page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() =>
                                    router.get(route('admin.enrollments.show', user.id), {
                                        search,
                                        status: status !== 'all' ? status : undefined,
                                        page,
                                    })
                                }
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete this enrollment. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
