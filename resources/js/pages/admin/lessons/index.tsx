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
import { ArrowLeft, Filter, Pencil, Plus, Search, Trash2, Video } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Course {
    id: number;
    title: string;
}

interface Lesson {
    id: number;
    title: string;
    video_type: string;
    video_url: string;
    duration: number;
    order: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedLessons {
    data: Lesson[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Filters {
    search?: string;
    video_type?: string;
}

export default function Index({ course, lessons, filters }: { course: Course; lessons: PaginatedLessons; filters: Filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [videoType, setVideoType] = useState(filters.video_type || 'all');

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            route('admin.courses.lessons.index', course.id),
            { search: value, video_type: videoType !== 'all' ? videoType : undefined },
            { preserveState: true, replace: true },
        );
    }, 500);

    useEffect(() => {
        debouncedSearch(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleVideoTypeChange = (value: string) => {
        setVideoType(value);
        router.get(
            route('admin.courses.lessons.index', course.id),
            { search, video_type: value !== 'all' ? value : undefined },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (lessonId: number) => {
        router.delete(route('admin.lessons.destroy', lessonId));
    };

    const getVideoTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            internal: 'Internal',
            youtube: 'YouTube',
            gdrive: 'Google Drive',
        };
        return labels[type] || type;
    };

    return (
        <AppLayout>
            <Head title={`Lessons - ${course.title}`} />

            <TooltipProvider delayDuration={0}>
                <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.courses.index')}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">{course.title}</h1>
                        <p className="text-muted-foreground text-sm">{lessons.total} total lessons</p>
                    </div>
                    <Link href={route('admin.courses.lessons.create', course.id)}>
                        <Button className="w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Lesson
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
                                        placeholder="Search lessons..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="video_type">Video Type</Label>
                                <Select value={videoType} onValueChange={handleVideoTypeChange}>
                                    <SelectTrigger id="video_type">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="internal">Internal</SelectItem>
                                        <SelectItem value="youtube">YouTube</SelectItem>
                                        <SelectItem value="gdrive">Google Drive</SelectItem>
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
                                        <TableHead className="w-16">Order</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead className="text-center">Duration</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {lessons.data.length > 0 ? (
                                        lessons.data.map((lesson, index) => (
                                            <TableRow key={lesson.id}>
                                                <TableCell className="text-muted-foreground font-medium">
                                                    {(lessons.current_page - 1) * lessons.per_page + index + 1}
                                                </TableCell>
                                                <TableCell className="font-medium">{lesson.order}</TableCell>
                                                <TableCell className="font-medium">{lesson.title}</TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                                                        <Video className="h-3 w-3" />
                                                        {getVideoTypeLabel(lesson.video_type)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-center">{lesson.duration} min</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Link href={route('admin.lessons.edit', lesson.id)}>
                                                                    <Button variant="outline" size="sm">
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Edit Lesson</TooltipContent>
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
                                                                <TooltipContent>Delete Lesson</TooltipContent>
                                                            </Tooltip>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Are you sure? This will permanently delete this lesson.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(lesson.id)}>
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
                                                No lessons found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:hidden">
                    {lessons.data.length > 0 ? (
                        lessons.data.map((lesson, index) => (
                            <Card key={lesson.id}>
                                <CardHeader>
                                    <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs font-medium">
                                        <span>#{(lessons.current_page - 1) * lessons.per_page + index + 1}</span>
                                        <span>Order: {lesson.order}</span>
                                    </div>
                                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                                            <Video className="h-3 w-3" />
                                            {getVideoTypeLabel(lesson.video_type)}
                                        </span>
                                        <span>{lesson.duration} min</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Link href={route('admin.lessons.edit', lesson.id)} className="flex-1">
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
                                                    <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure? This will permanently delete this lesson.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(lesson.id)}>Delete</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="text-muted-foreground py-12 text-center">No lessons found.</CardContent>
                        </Card>
                    )}
                </div>

                {lessons.last_page > 1 && (
                    <Pagination>
                        <PaginationContent>
                            {lessons.links.map((link, index) => {
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
                                if (index === lessons.links.length - 1) {
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
