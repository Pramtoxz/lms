import { Badge } from '@/components/ui/badge';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const meetingCounts = (page.props.meetingCounts as { upcoming: number; ongoing: number }) || { upcoming: 0, ongoing: 0 };
    const totalMeetings = meetingCounts.upcoming + meetingCounts.ongoing;

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const showBadge = (item.url === '/timetable' || item.url === '/admin/meetings') && totalMeetings > 0;
                    
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={item.url === page.url}>
                                <Link href={item.url} prefetch>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                    {showBadge && (
                                        <Badge variant="destructive" className="ml-auto h-5 min-w-5 px-1.5 text-xs">
                                            {totalMeetings}
                                        </Badge>
                                    )}
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
