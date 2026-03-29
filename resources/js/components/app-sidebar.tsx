import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, FileText, Folder, GraduationCap, LayoutGrid, Search, UserPlus } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const page = usePage();
    const auth = page.props.auth as { user: { roles: Array<{ name: string }> } };
    const isAdmin = auth?.user?.roles?.some((role) => role.name === 'admin');

    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Courses',
            url: '/admin/courses',
            icon: GraduationCap,
        },
        {
            title: 'Enrollments',
            url: '/admin/enrollments',
            icon: UserPlus,
        },
        {
            title: 'Meetings',
            url: '/admin/meetings',
            icon: Calendar,
        },
    ];

    const userNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Browse Courses',
            url: '/browse',
            icon: Search,
        },
        {
            title: 'My Courses',
            url: '/courses',
            icon: GraduationCap,
        },
        {
            title: 'Timetable',
            url: '/timetable',
            icon: Calendar,
        },
        {
            title: 'Exams',
            url: '/exams',
            icon: FileText,
        },
    ];

    const mainNavItems = isAdmin ? adminNavItems : userNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
