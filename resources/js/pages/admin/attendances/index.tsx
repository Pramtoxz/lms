import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Search, User } from 'lucide-react';
import { useState } from 'react';
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

interface ZoomMeeting {
    id: number;
    course: Course;
    start_time: string;
}

interface Attendance {
    id: number;
    user: User | null;
    user_name: string | null;
    zoom_user_id: string | null;
    zoom_meeting: ZoomMeeting;
    check_in_time: string;
    check_out_time: string | null;
}

interface Meeting {
    id: number;
    course: Course;
    start_time: string;
}

interface Props {
    attendances: {
        data: Attendance[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    meetings: Meeting[];
    filters: {
        meeting_id?: string;
        search?: string;
    };
}

export default function Index({ attendances, meetings, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [meetingId, setMeetingId] = useState(filters.meeting_id || 'all');

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            route('admin.attendances.index'),
            { search: value, meeting_id: meetingId !== 'all' ? meetingId : undefined },
            { preserveState: true, replace: true },
        );
    }, 500);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        debouncedSearch(value);
    };

    const handleMeetingFilter = (value: string) => {
        setMeetingId(value);
        router.get(
            route('admin.attendances.index'),
            { search, meeting_id: value !== 'all' ? value : undefined },
            { preserveState: true, replace: true },
        );
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('en-MY', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const calculateDuration = (checkIn: string, checkOut: string | null) => {
        if (!checkOut) return 'Ongoing';

        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diff = Math.floor((end.getTime() - start.getTime()) / 60000);

        if (diff < 60) return `${diff} min`;
        const hours = Math.floor(diff / 60);
        const minutes = diff % 60;
        return `${hours}h ${minutes}m`;
    };

    return (
        <>
            <Head title="Attendances" />

            <div className="space-y-4 sm:space-y-6">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Meeting Attendances</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">Track student attendance in Zoom meetings</p>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={meetingId} onValueChange={handleMeetingFilter}>
                                <SelectTrigger className="w-full sm:w-[250px]">
                                    <SelectValue placeholder="Filter by meeting" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Meetings</SelectItem>
                                    {meetings.map((meeting) => (
                                        <SelectItem key={meeting.id} value={meeting.id.toString()}>
                                            {meeting.course.title} - {formatDateTime(meeting.start_time)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <Card className="hidden md:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                <TableHead>Meeting</TableHead>
                                <TableHead>Check In</TableHead>
                                <TableHead>Check Out</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendances.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-muted-foreground text-center">
                                        No attendance records found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                attendances.data.map((attendance) => (
                                    <TableRow key={attendance.id}>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {attendance.user ? attendance.user.name : attendance.user_name || 'Guest'}
                                                </div>
                                                {attendance.user && <div className="text-muted-foreground text-xs">{attendance.user.email}</div>}
                                                {!attendance.user && attendance.zoom_user_id && (
                                                    <div className="text-muted-foreground text-xs">ID: {attendance.zoom_user_id}</div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{attendance.zoom_meeting.course.title}</div>
                                                <div className="text-muted-foreground text-xs">
                                                    {formatDateTime(attendance.zoom_meeting.start_time)}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatDateTime(attendance.check_in_time)}</TableCell>
                                        <TableCell>{attendance.check_out_time ? formatDateTime(attendance.check_out_time) : '-'}</TableCell>
                                        <TableCell>{calculateDuration(attendance.check_in_time, attendance.check_out_time)}</TableCell>
                                        <TableCell>
                                            <Badge variant={attendance.check_out_time ? 'outline' : 'secondary'}>
                                                {attendance.check_out_time ? 'Completed' : 'In Progress'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>

                <div className="space-y-3 md:hidden">
                    {attendances.data.length === 0 ? (
                        <Card>
                            <CardContent className="text-muted-foreground py-8 text-center">No attendance records found</CardContent>
                        </Card>
                    ) : (
                        attendances.data.map((attendance) => (
                            <Card key={attendance.id}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <User className="text-muted-foreground h-4 w-4" />
                                            <div>
                                                <div className="font-medium">
                                                    {attendance.user ? attendance.user.name : attendance.user_name || 'Guest'}
                                                </div>
                                                {attendance.user && <div className="text-muted-foreground text-xs">{attendance.user.email}</div>}
                                            </div>
                                        </div>
                                        <Badge variant={attendance.check_out_time ? 'outline' : 'secondary'} className="shrink-0">
                                            {attendance.check_out_time ? 'Completed' : 'In Progress'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <div className="font-medium">{attendance.zoom_meeting.course.title}</div>
                                            <div className="text-muted-foreground text-xs">{formatDateTime(attendance.zoom_meeting.start_time)}</div>
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            Check In: {formatDateTime(attendance.check_in_time)}
                                        </div>
                                        {attendance.check_out_time && (
                                            <div className="text-muted-foreground flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Check Out: {formatDateTime(attendance.check_out_time)}
                                            </div>
                                        )}
                                        <div className="text-muted-foreground flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            Duration: {calculateDuration(attendance.check_in_time, attendance.check_out_time)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {attendances.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm">
                            Showing {attendances.data.length} of {attendances.total} records
                        </p>
                        <div className="flex gap-2">
                            {attendances.links.map((link, index) => {
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
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />;
