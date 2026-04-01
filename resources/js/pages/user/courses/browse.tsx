import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Search, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string | null;
    lessons_count: number;
    price: string;
    is_free: boolean;
}

interface PaginatedCourses {
    data: Course[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function Browse({
    courses,
    enrolledCourseIds,
    filters,
}: {
    courses: PaginatedCourses;
    enrolledCourseIds: number[];
    filters: { search?: string; type?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || 'all');

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(route('courses.browse'), { search: value, type: type !== 'all' ? type : undefined }, { preserveState: true, replace: true });
    }, 500);

    useEffect(() => {
        debouncedSearch(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleTypeChange = (value: string) => {
        setType(value);
        router.get(route('courses.browse'), { search, type: value !== 'all' ? value : undefined }, { preserveState: true, replace: true });
    };

    const handleEnroll = (courseId: number) => {
        router.post(route('courses.enroll', courseId));
    };

    const isEnrolled = (courseId: number) => enrolledCourseIds.includes(courseId);

    return (
        <AppLayout>
            <Head title="Browse Courses" />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Browse Courses</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Discover and enroll in available courses</p>
                    </div>
                    <Link href={route('courses.index')}>
                        <Button variant="outline">My Courses</Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="search">Search</Label>
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        id="search"
                                        type="text"
                                        placeholder="Search courses..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Course Type</Label>
                                <Select value={type} onValueChange={handleTypeChange}>
                                    <SelectTrigger id="type">
                                        <SelectValue placeholder="All Courses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Courses</SelectItem>
                                        <SelectItem value="free">Free Courses</SelectItem>
                                        <SelectItem value="paid">Paid Courses</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Course Grid */}
                {courses.data.length === 0 ? (
                    <Card>
                        <CardContent className="flex min-h-[300px] flex-col items-center justify-center py-12">
                            <BookOpen className="text-muted-foreground mb-4 h-12 w-12" />
                            <p className="text-muted-foreground text-center">No courses available</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {courses.data.map((course) => (
                            <Card key={course.id} className="flex flex-col">
                                {/* Thumbnail */}
                                <div className="bg-muted relative aspect-video overflow-hidden rounded-t-lg">
                                    {course.thumbnail ? (
                                        <img src={`/storage/${course.thumbnail}`} alt={course.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <BookOpen className="text-muted-foreground h-12 w-12" />
                                        </div>
                                    )}
                                    {/* Price Badge */}
                                    <div className="absolute top-2 right-2">
                                        {course.is_free ? (
                                            <Badge variant="secondary" className="bg-green-500 text-white hover:bg-green-600">
                                                FREE
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
                                                RM {parseFloat(course.price).toFixed(2)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <CardHeader className="flex-1 pb-3">
                                    <CardTitle className="line-clamp-2 text-base">{course.title}</CardTitle>
                                    <CardDescription className="line-clamp-2 text-sm">{course.description}</CardDescription>
                                </CardHeader>

                                <CardContent className="pb-3">
                                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                        <BookOpen className="h-4 w-4" />
                                        <span>{course.lessons_count} lessons</span>
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    {isEnrolled(course.id) ? (
                                        <Link href={route('courses.index')} className="w-full">
                                            <Button variant="outline" className="w-full" disabled>
                                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                                Enrolled
                                            </Button>
                                        </Link>
                                    ) : course.is_free ? (
                                        <Button onClick={() => handleEnroll(course.id)} className="w-full">
                                            Enroll Now
                                        </Button>
                                    ) : (
                                        <Button onClick={() => handleEnroll(course.id)} className="w-full">
                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                            Buy Now - RM {parseFloat(course.price).toFixed(2)}
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {courses.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {Array.from({ length: courses.last_page }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === courses.current_page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => router.get(route('courses.browse'), { search, type: type !== 'all' ? type : undefined, page })}
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
