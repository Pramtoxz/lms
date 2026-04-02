import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, CheckCircle2, Search, ShoppingCart, Filter, X, GraduationCap, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '@/lib/utils';

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
    const [isSearching, setIsSearching] = useState(false);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        setIsSearching(true);
        router.get(
            route('courses.browse'),
            { search: value, type: type !== 'all' ? type : undefined },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setIsSearching(false),
            }
        );
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

    const clearSearch = () => {
        setSearch('');
        setType('all');
        router.get(route('courses.browse'), {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout>
            <Head title="Browse Courses" />

            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                {/* Hero Section with Search */}
                <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
                    <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
                    <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                                <Sparkles className="h-4 w-4" />
                                <span>Discover Your Next Skill</span>
                            </div>
                            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                Browse <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Courses</span>
                            </h1>
                            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
                                Explore our collection of courses and start your learning journey today
                            </p>

                            {/* Search Bar */}
                            <div className="mx-auto max-w-3xl">
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
                                    <Input
                                        type="text"
                                        placeholder="Search for courses, topics, or skills..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="h-14 rounded-full border-2 pl-12 pr-12 text-lg shadow-lg transition-all focus:border-primary focus:shadow-xl"
                                    />
                                    {search && (
                                        <button
                                            onClick={clearSearch}
                                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    )}
                                </div>

                                {/* Quick Stats */}
                                <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="text-primary h-5 w-5" />
                                        <span className="text-muted-foreground">
                                            <span className="font-semibold text-foreground">{courses.total}</span> Courses Available
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="text-primary h-5 w-5" />
                                        <span className="text-muted-foreground">
                                            <span className="font-semibold text-foreground">{enrolledCourseIds.length}</span> Enrolled
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                    {/* Filters Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <Filter className="text-muted-foreground h-5 w-5" />
                            <span className="text-muted-foreground text-sm font-medium">Filter by:</span>
                            <div className="flex flex-wrap gap-2">
                                <Badge
                                    variant={type === 'all' ? 'default' : 'outline'}
                                    className="cursor-pointer px-4 py-1.5 transition-all hover:scale-105"
                                    onClick={() => handleTypeChange('all')}
                                >
                                    All Courses
                                </Badge>
                                <Badge
                                    variant={type === 'free' ? 'default' : 'outline'}
                                    className="cursor-pointer px-4 py-1.5 transition-all hover:scale-105"
                                    onClick={() => handleTypeChange('free')}
                                >
                                    Free
                                </Badge>
                                <Badge
                                    variant={type === 'paid' ? 'default' : 'outline'}
                                    className="cursor-pointer px-4 py-1.5 transition-all hover:scale-105"
                                    onClick={() => handleTypeChange('paid')}
                                >
                                    Paid
                                </Badge>
                            </div>
                        </div>

                        <Link href={route('courses.index')}>
                            <Button variant="outline" className="gap-2">
                                <BookOpen className="h-4 w-4" />
                                My Courses
                            </Button>
                        </Link>
                    </div>

                    {/* Results Info */}
                    {(search || type !== 'all') && (
                        <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                            <p className="text-sm">
                                Found <span className="font-semibold">{courses.total}</span> course{courses.total !== 1 ? 's' : ''}
                                {search && (
                                    <>
                                        {' '}
                                        for "<span className="font-semibold">{search}</span>"
                                    </>
                                )}
                            </p>
                            <Button variant="ghost" size="sm" onClick={clearSearch} className="gap-2">
                                <X className="h-4 w-4" />
                                Clear filters
                            </Button>
                        </div>
                    )}

                    {/* Course Grid */}
                    {isSearching ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {[...Array(8)].map((_, i) => (
                                <Card key={i} className="overflow-hidden">
                                    <div className="bg-muted aspect-video animate-pulse" />
                                    <CardHeader>
                                        <div className="bg-muted mb-2 h-6 w-3/4 animate-pulse rounded" />
                                        <div className="bg-muted h-4 w-full animate-pulse rounded" />
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    ) : courses.data.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="flex min-h-[400px] flex-col items-center justify-center py-12">
                                <div className="bg-muted/50 mb-4 rounded-full p-6">
                                    <BookOpen className="text-muted-foreground h-12 w-12" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">No courses found</h3>
                                <p className="text-muted-foreground mb-6 text-center">
                                    {search ? `We couldn't find any courses matching "${search}"` : 'No courses available at the moment'}
                                </p>
                                {(search || type !== 'all') && (
                                    <Button onClick={clearSearch} variant="outline">
                                        Clear filters
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {courses.data.map((course) => (
                                <Card
                                    key={course.id}
                                    className={cn(
                                        'group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                                        isEnrolled(course.id) && 'ring-2 ring-primary/20'
                                    )}
                                >
                                    {/* Thumbnail - Clickable */}
                                    <Link href={route('courses.show', course.id)}>
                                        <div className="bg-muted relative aspect-video cursor-pointer overflow-hidden">
                                            {course.thumbnail ? (
                                                <img
                                                    src={`/storage/${course.thumbnail}`}
                                                    alt={course.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                                    <BookOpen className="text-primary/40 h-16 w-16" />
                                                </div>
                                            )}
                                            {/* Overlay on hover */}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                                                <div className="translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                    <div className="rounded-full bg-white p-3 shadow-lg">
                                                        <Search className="h-6 w-6 text-primary" />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Price Badge */}
                                            <div className="absolute top-3 right-3">
                                                {course.is_free ? (
                                                    <Badge className="bg-green-500 text-white shadow-lg hover:bg-green-600">FREE</Badge>
                                                ) : (
                                                    <Badge className="bg-blue-500 text-white shadow-lg hover:bg-blue-600">
                                                        RM {parseFloat(course.price).toFixed(2)}
                                                    </Badge>
                                                )}
                                            </div>
                                            {/* Enrolled Badge */}
                                            {isEnrolled(course.id) && (
                                                <div className="absolute top-3 left-3">
                                                    <Badge className="bg-primary text-primary-foreground shadow-lg">
                                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                                        Enrolled
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                    </Link>

                                    <CardHeader className="flex-1">
                                        <Link href={route('courses.show', course.id)}>
                                            <CardTitle className="line-clamp-2 cursor-pointer text-lg transition-colors group-hover:text-primary">
                                                {course.title}
                                            </CardTitle>
                                        </Link>
                                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                                    </CardHeader>

                                    <CardContent className="pb-4">
                                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                            <BookOpen className="h-4 w-4" />
                                            <span>
                                                {course.lessons_count} lesson{course.lessons_count !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="flex-col gap-2 pt-0">
                                        <Link href={route('courses.show', course.id)} className="w-full">
                                            <Button variant="outline" className="w-full gap-2">
                                                <Search className="h-4 w-4" />
                                                View Details
                                            </Button>
                                        </Link>
                                        {isEnrolled(course.id) ? (
                                            <Link href={route('courses.index')} className="w-full">
                                                <Button className="w-full">Continue Learning</Button>
                                            </Link>
                                        ) : course.is_free ? (
                                            <Button onClick={() => handleEnroll(course.id)} className="w-full">
                                                Enroll Now
                                            </Button>
                                        ) : (
                                            <Button onClick={() => handleEnroll(course.id)} className="w-full gap-2">
                                                <ShoppingCart className="h-4 w-4" />
                                                Buy - RM {parseFloat(course.price).toFixed(2)}
                                            </Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {courses.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={courses.current_page === 1}
                                onClick={() =>
                                    router.get(
                                        route('courses.browse'),
                                        { search, type: type !== 'all' ? type : undefined, page: courses.current_page - 1 },
                                        { preserveState: true }
                                    )
                                }
                            >
                                Previous
                            </Button>
                            {Array.from({ length: courses.last_page }, (_, i) => i + 1).map((page) => {
                                // Show first, last, current, and adjacent pages
                                if (
                                    page === 1 ||
                                    page === courses.last_page ||
                                    (page >= courses.current_page - 1 && page <= courses.current_page + 1)
                                ) {
                                    return (
                                        <Button
                                            key={page}
                                            variant={page === courses.current_page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() =>
                                                router.get(
                                                    route('courses.browse'),
                                                    { search, type: type !== 'all' ? type : undefined, page },
                                                    { preserveState: true }
                                                )
                                            }
                                        >
                                            {page}
                                        </Button>
                                    );
                                } else if (page === courses.current_page - 2 || page === courses.current_page + 2) {
                                    return <span key={page}>...</span>;
                                }
                                return null;
                            })}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={courses.current_page === courses.last_page}
                                onClick={() =>
                                    router.get(
                                        route('courses.browse'),
                                        { search, type: type !== 'all' ? type : undefined, page: courses.current_page + 1 },
                                        { preserveState: true }
                                    )
                                }
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
