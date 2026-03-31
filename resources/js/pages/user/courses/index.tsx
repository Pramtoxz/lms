import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { CheckCircle2, Clock, FileCheck, Filter, Play, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string | null;
    price: string;
    is_free: boolean;
}

interface Enrollment {
    id: number;
    progress_percentage: number;
    status: string;
    enrolled_at: string;
    course: Course;
    first_lesson_id: number | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedEnrollments {
    data: Enrollment[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Filters {
    search?: string;
    status?: string;
}

export default function Index({ enrollments, filters }: { enrollments: PaginatedEnrollments; filters: Filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(route('courses.index'), { search: value, status: status !== 'all' ? status : undefined }, { preserveState: true, replace: true });
    }, 500);

    useEffect(() => {
        debouncedSearch(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleStatusChange = (value: string) => {
        setStatus(value);
        router.get(route('courses.index'), { search, status: value !== 'all' ? value : undefined }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout>
            <Head title="My Courses" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-3xl font-bold">My Courses</h1>
                    <p className="text-muted-foreground">
                        {enrollments.total} {enrollments.total === 1 ? 'course' : 'courses'} enrolled
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        id="search"
                                        placeholder="Search courses..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={status} onValueChange={handleStatusChange}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="All Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="ongoing">Ongoing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {enrollments.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {enrollments.data.map((enrollment) => (
                            <Card key={enrollment.id} className="group overflow-hidden transition-shadow hover:shadow-lg">
                                <div className="bg-muted relative aspect-video overflow-hidden">
                                    {enrollment.course.thumbnail ? (
                                        <img
                                            src={`/storage/${enrollment.course.thumbnail}`}
                                            alt={enrollment.course.title}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-500 to-purple-700">
                                            <Play className="h-16 w-16 text-white opacity-50" />
                                        </div>
                                    )}
                                    {enrollment.status === 'completed' && (
                                        <div className="absolute top-2 right-2 rounded-full bg-green-500 p-1.5">
                                            <CheckCircle2 className="h-4 w-4 text-white" />
                                        </div>
                                    )}
                                    {/* Price Badge */}
                                    <div className="absolute top-2 left-2">
                                        {enrollment.course.is_free ? (
                                            <Badge variant="secondary" className="bg-green-500 text-white hover:bg-green-600">
                                                FREE
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
                                                RM {parseFloat(enrollment.course.price).toFixed(2)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <CardHeader>
                                    <CardTitle className="line-clamp-2 text-lg">{enrollment.course.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">{enrollment.course.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-medium">{enrollment.progress_percentage}%</span>
                                        </div>
                                        <Progress value={enrollment.progress_percentage} className="h-2" />
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4" />
                                        <span>Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                                    </div>

                                    {enrollment.progress_percentage >= 100 ? (
                                        <div className="flex gap-2">
                                            <Link href={route('courses.exam', enrollment.course.id)} className="flex-1">
                                                <Button className="w-full" variant="default">
                                                    <FileCheck className="mr-2 h-4 w-4" />
                                                    Take Exam
                                                </Button>
                                            </Link>
                                            {enrollment.first_lesson_id && (
                                                <Link href={route('courses.player', [enrollment.course.id, enrollment.first_lesson_id])}>
                                                    <Button variant="outline" size="icon">
                                                        <Play className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    ) : enrollment.first_lesson_id ? (
                                        <Link href={route('courses.player', [enrollment.course.id, enrollment.first_lesson_id])}>
                                            <Button className="w-full">
                                                <Play className="mr-2 h-4 w-4" />
                                                {enrollment.progress_percentage > 0 ? 'Continue Learning' : 'Start Course'}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button className="w-full" disabled>
                                            No lessons available
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="bg-muted mb-4 rounded-full p-6">
                                <Play className="text-muted-foreground h-12 w-12" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">No courses found</h3>
                            <p className="text-muted-foreground text-center">
                                {search || status !== 'all' ? 'Try adjusting your filters' : "You haven't enrolled in any courses yet"}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {enrollments.last_page > 1 && (
                    <Pagination>
                        <PaginationContent>
                            {enrollments.links.map((link, index) => {
                                if (index === 0) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationPrevious
                                                href={link.url || '#'}
                                                className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>
                                    );
                                }
                                if (index === enrollments.links.length - 1) {
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationNext href={link.url || '#'} className={!link.url ? 'pointer-events-none opacity-50' : ''} />
                                        </PaginationItem>
                                    );
                                }
                                return (
                                    <PaginationItem key={index} className="hidden sm:inline-block">
                                        <PaginationLink href={link.url || '#'} isActive={link.active}>
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </AppLayout>
    );
}
