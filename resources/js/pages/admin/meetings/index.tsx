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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, Plus, Search, Trash2, Video } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Course {
    id: number;
    title: string;
}

interface Meeting {
    id: number;
    course: Course;
    start_time: string;
    duration: number;
    zoom_meeting_id: string;
    join_url: string;
    start_url: string;
    ended_at: string | null;
}

interface Props {
    meetings: {
        data: Meeting[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    courses: Course[];
    filters: {
        search?: string;
        course_id?: string;
    };
}

export default function Index({ meetings, courses, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [courseId, setCourseId] = useState(filters.course_id || 'all');
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; meeting: Meeting | null }>({
        open: false,
        meeting: null,
    });

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            route('admin.meetings.index'),
            { search: value, course_id: courseId !== 'all' ? courseId : undefined },
            { preserveState: true, replace: true },
        );
    }, 500);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        debouncedSearch(value);
    };

    const handleCourseFilter = (value: string) => {
        setCourseId(value);
        router.get(route('admin.meetings.index'), { search, course_id: value !== 'all' ? value : undefined }, { preserveState: true, replace: true });
    };

    const handleDelete = (meeting: Meeting) => {
        setDeleteDialog({ open: true, meeting });
    };

    const confirmDelete = () => {
        if (deleteDialog.meeting) {
            router.delete(route('admin.meetings.destroy', deleteDialog.meeting.id));
            setDeleteDialog({ open: false, meeting: null });
        }
    };

    const getStatus = (startTime: string, duration: number, endedAt: string | null) => {
        if (endedAt) return { label: 'Past', variant: 'outline' as const };

        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(start.getTime() + duration * 60000);

        if (now < start) return { label: 'Upcoming', variant: 'default' as const };
        if (now >= start && now <= end) return { label: 'Ongoing', variant: 'secondary' as const };
        return { label: 'Past', variant: 'outline' as const };
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('en-MY', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <>
            <Head title="Meetings" />

            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">Zoom Meetings</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">Manage live class meetings</p>
                    </div>
                    <Button asChild size="sm" className="w-full sm:w-auto">
                        <Link href={route('admin.meetings.create')}>
                            <Plus className="h-4 w-4" />
                            Create Meeting
                        </Link>
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search by course name..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={courseId} onValueChange={handleCourseFilter}>
                                <SelectTrigger className="w-full sm:w-[200px]">
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
                    </CardContent>
                </Card>

                {/* Desktop Table */}
                <Card className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Meeting ID</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {meetings.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-muted-foreground text-center">
                                        No meetings found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                meetings.data.map((meeting) => {
                                    const status = getStatus(meeting.start_time, meeting.duration, meeting.ended_at);
                                    return (
                                        <TableRow key={meeting.id}>
                                            <TableCell className="font-medium">{meeting.course.title}</TableCell>
                                            <TableCell>{formatDateTime(meeting.start_time)}</TableCell>
                                            <TableCell>{meeting.duration} min</TableCell>
                                            <TableCell>
                                                <Badge variant={status.variant}>{status.label}</Badge>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs">{meeting.zoom_meeting_id}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {status.label !== 'Past' && (
                                                        <Button variant="outline" size="sm" asChild>
                                                            <a href={meeting.start_url} target="_blank" rel="noopener noreferrer">
                                                                <Video className="h-4 w-4" />
                                                                Start
                                                            </a>
                                                        </Button>
                                                    )}
                                                    <Button variant="destructive" size="sm" onClick={() => handleDelete(meeting)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* Mobile Cards */}
                <div className="space-y-3 md:hidden">
                    {meetings.data.length === 0 ? (
                        <Card>
                            <CardContent className="text-muted-foreground py-8 text-center">No meetings found</CardContent>
                        </Card>
                    ) : (
                        meetings.data.map((meeting) => {
                            const status = getStatus(meeting.start_time, meeting.duration, meeting.ended_at);
                            return (
                                <Card key={meeting.id}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-base">{meeting.course.title}</CardTitle>
                                            <Badge variant={status.variant} className="shrink-0">
                                                {status.label}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="space-y-2 text-sm">
                                            <div className="text-muted-foreground flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {formatDateTime(meeting.start_time)}
                                            </div>
                                            <div className="text-muted-foreground flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {meeting.duration} minutes
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {status.label !== 'Past' && (
                                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                                    <a href={meeting.start_url} target="_blank" rel="noopener noreferrer">
                                                        <Video className="h-4 w-4" />
                                                        Start Meeting
                                                    </a>
                                                </Button>
                                            )}
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(meeting)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {meetings.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm">
                            Showing {meetings.data.length} of {meetings.total} meetings
                        </p>
                        <div className="flex gap-2">
                            {meetings.links.map((link, index) => {
                                if (!link.url) return null;

                                const isActive = link.active;
                                const label = link.label.replace('&laquo;', '').replace('&raquo;', '').trim();

                                if (label === 'Previous' || label === 'Next') {
                                    return (
                                        <Button key={index} variant="outline" size="sm" onClick={() => router.get(link.url!)} disabled={!link.url}>
                                            {label}
                                        </Button>
                                    );
                                }

                                return (
                                    <Button
                                        key={index}
                                        variant={isActive ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => router.get(link.url!)}
                                        className="hidden sm:inline-flex"
                                    >
                                        {label}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, meeting: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete the meeting for "{deleteDialog.meeting?.course.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />;
