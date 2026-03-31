import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface User {
    id: number;
    name: string;
    email: string;
    enrollments_count: number;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export default function Index({
    users,
    filters,
}: {
    users: PaginatedUsers;
    filters: { search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            route('admin.enrollments.index'),
            { search: value },
            { preserveState: true, replace: true },
        );
    }, 500);

    useEffect(() => {
        debouncedSearch(search);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <AppLayout>
            <Head title="Manage Enrollments" />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Manage Enrollments</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Select a user to manage their enrollments</p>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input type="text" placeholder="Search user by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
                </div>

                {/* Mobile: Cards */}
                <div className="space-y-4 lg:hidden">
                    {users.data.map((user) => (
                        <Card key={user.id}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">{user.name}</CardTitle>
                                <CardDescription className="text-sm">{user.email}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-muted-foreground text-xs">Total Enrollments</p>
                                    <p className="text-lg font-semibold">{user.enrollments_count}</p>
                                </div>
                                <Link href={route('admin.enrollments.show', user.id)}>
                                    <Button className="w-full">
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Enrollments
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Desktop: Table */}
                <Card className="hidden lg:block">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-center">Enrollments</TableHead>
                                <TableHead className="w-32 text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user, idx) => (
                                <TableRow key={user.id}>
                                    <TableCell>{(users.current_page - 1) * users.per_page + idx + 1}</TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                            {user.enrollments_count}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Link href={route('admin.enrollments.show', user.id)}>
                                            <Button size="sm">
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>

                {/* Empty State */}
                {users.data.length === 0 && (
                    <Card>
                        <CardContent className="flex min-h-[300px] flex-col items-center justify-center py-12">
                            <Users className="text-muted-foreground mb-4 h-12 w-12" />
                            <p className="text-muted-foreground text-center">No users found</p>
                        </CardContent>
                    </Card>
                )}

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === users.current_page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() =>
                                    router.get(route('admin.enrollments.index'), {
                                        search,
                                        page,
                                    })
                                }
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
