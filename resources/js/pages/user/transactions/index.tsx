import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Clock, Receipt } from 'lucide-react';

interface Course {
    id: number;
    title: string;
}

interface Transaction {
    id: number;
    order_id: string;
    transaction_id: string | null;
    amount: string;
    currency: string;
    status: 'pending' | 'paid' | 'failed' | 'expired';
    payment_method: string;
    payment_date: string | null;
    created_at: string;
    course: Course;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTransactions {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export default function Index({ transactions }: { transactions: PaginatedTransactions }) {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className?: string }> = {
            paid: { variant: 'default', className: 'bg-green-500 hover:bg-green-600' },
            pending: { variant: 'secondary', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
            failed: { variant: 'destructive' },
            expired: { variant: 'outline' },
        };

        const config = variants[status] || { variant: 'default' };
        return (
            <Badge variant={config.variant} className={config.className}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const isExpired = (transaction: Transaction) => {
        if (transaction.status !== 'pending') return false;
        const createdAt = new Date(transaction.created_at);
        const now = new Date();
        const diffMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
        return diffMinutes > 30;
    };

    return (
        <AppLayout>
            <Head title="Transaction History" />

            <div className="space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Transaction History</h1>
                    <p className="text-muted-foreground mt-1 text-sm">{transactions.total} total transactions</p>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Payment Date</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.data.length > 0 ? (
                                        transactions.data.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="font-mono text-sm">{transaction.order_id}</TableCell>
                                                <TableCell className="font-medium">{transaction.course.title}</TableCell>
                                                <TableCell>
                                                    {transaction.currency} {parseFloat(transaction.amount).toFixed(2)}
                                                </TableCell>
                                                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                                                <TableCell>
                                                    {transaction.payment_date
                                                        ? new Date(transaction.payment_date).toLocaleDateString('en-MY', {
                                                              year: 'numeric',
                                                              month: 'short',
                                                              day: 'numeric',
                                                          })
                                                        : '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.status === 'pending' && !isExpired(transaction) ? (
                                                        <Link href={route('courses.checkout', transaction.course.id)}>
                                                            <Button size="sm" variant="outline">
                                                                <Clock className="mr-2 h-4 w-4" />
                                                                Continue Payment
                                                            </Button>
                                                        </Link>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No transactions found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* Mobile Cards */}
                <div className="grid gap-4 md:hidden">
                    {transactions.data.length > 0 ? (
                        transactions.data.map((transaction) => (
                            <Card key={transaction.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-base">{transaction.course.title}</CardTitle>
                                            <CardDescription className="font-mono text-xs">{transaction.order_id}</CardDescription>
                                        </div>
                                        {getStatusBadge(transaction.status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Amount</span>
                                        <span className="font-semibold">
                                            {transaction.currency} {parseFloat(transaction.amount).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Payment Date</span>
                                        <span>
                                            {transaction.payment_date
                                                ? new Date(transaction.payment_date).toLocaleDateString('en-MY', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : '-'}
                                        </span>
                                    </div>
                                    {transaction.status === 'pending' && !isExpired(transaction) && (
                                        <Link href={route('courses.checkout', transaction.course.id)} className="mt-3 block">
                                            <Button size="sm" variant="outline" className="w-full">
                                                <Clock className="mr-2 h-4 w-4" />
                                                Continue Payment
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="bg-muted mb-4 rounded-full p-6">
                                    <Receipt className="text-muted-foreground h-12 w-12" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">No transactions yet</h3>
                                <p className="text-muted-foreground text-center">Your transaction history will appear here</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Pagination */}
                {transactions.last_page > 1 && (
                    <Pagination>
                        <PaginationContent>
                            {transactions.links.map((link, index) => {
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
                                if (index === transactions.links.length - 1) {
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
        </AppLayout>
    );
}
