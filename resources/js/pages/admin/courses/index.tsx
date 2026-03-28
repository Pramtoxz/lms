import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, FileQuestion, Filter, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Course {
    id: number;
    title: string;
    description: string;
    is_published: boolean;
    lessons_count: number;
    questions_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCourses {
    data: Course[];
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

export default function Index({ courses, filters }: { courses: PaginatedCourses; filters: Filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            route('admin.courses.index'),
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
        router.get(route('admin.courses.index'), { search, status: value !== 'all' ? value : undefined }, { preserveState: true, replace: true });
    };

    const handleDelete = (id: number) => {
        router.delete(route('admin.courses.destroy', id));
    };

    return (
        <AppLayout>
            <Head title="Manage Courses" />

            <TooltipProvider delayDuration={0}>
                <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Courses</h1>
                        <p className="text-muted-foreground text-sm">{courses.total} total courses</p>
                    </div>
                    <Link href={route('admin.courses.create')}>
                        <Button className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Course
                        </Button>
                    </Link>
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
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="hidden md:block">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">No</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Lessons</TableHead>
                                        <TableHead className="text-center">Questions</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {courses.data.length > 0 ? (
                                        courses.data.map((course, index) => (
                                            <TableRow key={course.id}>
                                                <TableCell className="text-muted-foreground font-medium">
                                                    {(courses.current_page - 1) * courses.per_page + index + 1}
                                                </TableCell>
                                                <TableCell className="font-medium">{course.title}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                            course.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {course.is_published ? 'Published' : 'Draft'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">{course.lessons_count}</TableCell>
                                                <TableCell className="text-center">{course.questions_count}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Link href={route('admin.courses.lessons.index', course.id)}>
                                                                    <Button variant="outline" size="sm">
                                                                        <BookOpen className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Manage Lessons</TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Link href={route('admin.courses.questions.index', course.id)}>
                                                                    <Button variant="outline" size="sm">
                                                                        <FileQuestion className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Manage Questions</TooltipContent>
                                                        </Tooltip>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Link href={route('admin.courses.edit', course.id)}>
                                                                    <Button variant="outline" size="sm">
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Edit Course</TooltipContent>
                                                        </Tooltip>
                                                        <AlertDialog>
                                                            <Tooltip>
                                                                <AlertDialogTrigger asChild>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="outline" size="sm">
                                                                            <Trash2 className="text-destructive h-4 w-4" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                </AlertDialogTrigger>
                                                                <TooltipContent>Delete Course</TooltipContent>
                                                            </Tooltip>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure? This will permanently delete the course and all its lessons.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(course.id)}>
                                                                        Delete
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No courses found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:hidden">
                    {courses.data.length > 0 ? (
                        courses.data.map((course, index) => (
                            <Card key={course.id}>
                                <CardHeader>
                                    <div className="text-muted-foreground mb-2 text-xs font-medium">
                                        #{(courses.current_page - 1) * courses.per_page + index + 1}
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{course.title}</CardTitle>
                                            <CardDescription className="mt-1 line-clamp-2">{course.description}</CardDescription>
                                        </div>
                                        <span
                                            className={`ml-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                course.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}
                                        >
                                            {course.is_published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-muted-foreground mb-4 flex gap-4 text-sm">
                                        <span>{course.lessons_count} Lessons</span>
                                        <span>{course.questions_count} Questions</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={route('admin.courses.lessons.index', course.id)} className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                <BookOpen className="mr-2 h-4 w-4" />
                                                Lessons
                                            </Button>
                                        </Link>
                                        <Link href={route('admin.courses.edit', course.id)} className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline" className="flex-1">
                                                    <Trash2 className="text-destructive mr-2 h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure? This will permanently delete the course and all its lessons.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(course.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="text-muted-foreground py-12 text-center">No courses found.</CardContent>
                        </Card>
                    )}
                </div>

                {courses.last_page > 1 && (
                    <Pagination>
                        <PaginationContent>
                            {courses.links.map((link, index) => {
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
                                if (index === courses.links.length - 1) {
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
            </TooltipProvider>
        </AppLayout>
    );
}
