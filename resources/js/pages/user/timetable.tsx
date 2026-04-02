import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Head, router } from '@inertiajs/react';
import { Calendar, Clock, Video, Lock } from 'lucide-react';
import { useState } from 'react';

interface Course {
    id: number;
    title: string;
}

interface Attendance {
    id: number;
    check_in_time: string | null;
    check_out_time: string | null;
}

interface Meeting {
    id: number;
    course: Course;
    start_time: string;
    duration: number;
    zoom_meeting_id: string;
    join_url: string;
    attendances: Attendance[];
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
    filters: {
        status?: string;
    };
}

export default function Timetable({ meetings, filters }: Props) {
    const [activeTab, setActiveTab] = useState(filters.status || 'upcoming');

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.get(
            route('timetable.index'),
            { status: value },
            { preserveState: true, replace: true }
        );
    };

    const handleJoin = (meeting: Meeting) => {
        router.post(route('meetings.join', meeting.id));
    };

    const getStatus = (startTime: string, duration: number) => {
        const now = new Date();
        const start = new Date(startTime);
        const end = new Date(start.getTime() + duration * 60000);

        if (now < start) return { label: 'Upcoming', variant: 'default' as const, canJoin: false };
        if (now >= start && now <= end) return { label: 'Ongoing', variant: 'secondary' as const, canJoin: true };
        return { label: 'Past', variant: 'outline' as const, canJoin: false };
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('en-MY', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const formatDate = (dateTime: string) => {
        return new Date(dateTime).toLocaleDateString('en-MY', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleTimeString('en-MY', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Head title="Timetable" />

            <div className="space-y-4 sm:space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Timetable</h1>
                    <p className="text-sm text-muted-foreground sm:text-base">
                        View and join your scheduled live class meetings
                    </p>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                        <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-4 space-y-3 sm:mt-6">
                        {meetings.data.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-semibold">No meetings found</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {activeTab === 'upcoming' && 'You have no upcoming meetings scheduled.'}
                                        {activeTab === 'ongoing' && 'There are no ongoing meetings right now.'}
                                        {activeTab === 'past' && 'You have no past meetings.'}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            meetings.data.map((meeting) => {
                                const status = getStatus(meeting.start_time, meeting.duration);
                                const hasAttended = meeting.attendances.length > 0;
                                const attendance = meeting.attendances[0];

                                return (
                                    <Card key={meeting.id} className="overflow-hidden">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <CardTitle className="text-base sm:text-lg">
                                                        {meeting.course.title}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs sm:text-sm">
                                                        Live Class Meeting
                                                    </CardDescription>
                                                </div>
                                                <Badge variant={status.variant} className="shrink-0">
                                                    {status.label}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Meeting Info */}
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-start gap-2">
                                                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">{formatDate(meeting.start_time)}</p>
                                                        <p className="text-muted-foreground">
                                                            {formatTime(meeting.start_time)} ({meeting.duration} minutes)
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Attendance Info */}
                                                {hasAttended && (
                                                    <div className="rounded-lg border bg-muted/50 p-3">
                                                        <p className="text-xs font-medium text-muted-foreground">
                                                            Attendance
                                                        </p>
                                                        <div className="mt-2 space-y-1 text-xs">
                                                            {attendance.check_in_time && (
                                                                <p>
                                                                    <span className="font-medium">Check-in:</span>{' '}
                                                                    {formatDateTime(attendance.check_in_time)}
                                                                </p>
                                                            )}
                                                            {attendance.check_out_time && (
                                                                <p>
                                                                    <span className="font-medium">Check-out:</span>{' '}
                                                                    {formatDateTime(attendance.check_out_time)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Button */}
                                            {status.canJoin ? (
                                                <Button
                                                    onClick={() => handleJoin(meeting)}
                                                    className="w-full"
                                                    size="lg"
                                                >
                                                    <Video className="h-4 w-4" />
                                                    Join Meeting
                                                </Button>
                                            ) : (
                                                <Button disabled className="w-full" size="lg" variant="outline">
                                                    <Lock className="h-4 w-4" />
                                                    {status.label === 'Upcoming' ? 'Not Started Yet' : 'Meeting Ended'}
                                                </Button>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </TabsContent>
                </Tabs>

                {/* Pagination */}
                {meetings.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {meetings.data.length} of {meetings.total} meetings
                        </p>
                        <div className="flex gap-2">
                            {meetings.links.map((link, index) => {
                                if (!link.url) return null;

                                const isActive = link.active;
                                const label = link.label.replace('&laquo;', '').replace('&raquo;', '').trim();

                                if (label === 'Previous' || label === 'Next') {
                                    return (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.get(link.url!)}
                                            disabled={!link.url}
                                        >
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

Timetable.layout = (page: React.ReactNode) => <AppLayout children={page} />;
