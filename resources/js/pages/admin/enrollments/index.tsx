import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Trash2, UserPlus } from 'lucide-react';
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
    user: User;
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

export default function Index({
    enrollments,
    filters,
    courses,
}: {
    enrollments: PaginatedEnrollments;
    filters: { search?: string; status?: string; course_id?: string };
    courses: Course[];
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [courseId, setCourseId] = useState(filters.course_id || 'all');

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            route('admin.enrollments.index'),
            { search: value, status: status !== 'all' ? status : undefined, course_id: courseId !== 'all' ? courseId : undefined },
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
            route('admin.enrollments.index'),
            { search, status: value !== 'all' ? value : undefined, course_id: courseId !== 'all' ? courseId : undefined },
            { preserveState: true, replace: true },
        );
    };

    const handleCourseChange = (value: string) => {
        setCourseId(value);
        router.get(
            route('admin.enrollments.index'),
            { search, status: status !== 'all' ? status : undefined, course_id: value !== 'all' ? value : undefined },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this enrollment?')) {
            router.delete(route('admin.enrollments.destroy', id));
        }
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
            <Head title="Manage Enrollments" />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Manage Enrollments</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Assign courses to users</p>
                    </div>
                    <Link href={route('admin.enrollments.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Enrollment
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="relative sm:col-span-2">
                        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                        <Input type="text" placeholder="Search user or course..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                    <Select value={courseId} onValueChange={handleCourseChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by course" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Courses</SelectItem>
                            {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id.toString()}>
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Mobile: Cards */}
                <div className="space-y-4 lg:hidden">
                    {enrollments.data.map((enrollment) => (
                        <Card key={enrollment.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-base">{enrollment.user.name}</CardTitle>
                                        <CardDescription className="text-sm">{enrollment.user.email}</CardDescription>
                                    </div>
                                    <span className={cn('rounded-full px-2 py-1 text-xs font-medium', getStatusBadge(enrollment.status))}>
                                        {enrollment.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div>
                                    <p className="text-muted-foreground text-xs">Course</p>
                                    <p className="text-sm font-medium">{enrollment.course.title}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Progress</p>
                                    <p className="text-sm font-medium">{enrollment.progress_percentage}%</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs">Enrolled</p>
                                    <p className="text-sm">{new Date(enrollment.enrolled_at).toLocaleDateString()}</p>
                                </div>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(enrollment.id)} className="w-full">
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
                                <TableHead>User</TableHead>
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
                                    <TableCell>
                                        <div>
                                            <p className="font-medium">{enrollment.user.name}</p>
                                            <p className="text-muted-foreground text-sm">{enrollment.user.email}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>{enrollment.course.title}</TableCell>
                                    <TableCell>{enrollment.progress_percentage}%</TableCell>
                                    <TableCell>
                                        <span className={cn('rounded-full px-2 py-1 text-xs font-medium', getStatusBadge(enrollment.status))}>
                                            {enrollment.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(enrollment.enrolled_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(enrollment.id)}>
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
                            <UserPlus className="text-muted-foreground mb-4 h-12 w-12" />
                            <p className="text-muted-foreground mb-4 text-center">No enrollments found</p>
                            <Link href={route('admin.enrollments.create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Enrollment
                                </Button>
                            </Link>
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
                                    router.get(route('admin.enrollments.index'), {
                                        search,
                                        status: status !== 'all' ? status : undefined,
                                        course_id: courseId !== 'all' ? courseId : undefined,
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
        </AppLayout>
    );
}
