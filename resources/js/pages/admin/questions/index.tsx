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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Filter, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Course {
    id: number;
    title: string;
}

interface Question {
    id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
}

interface PaginatedQuestions {
    data: Question[];
    current_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

export default function Index({
    course,
    questions,
    filters,
}: {
    course: Course;
    questions: PaginatedQuestions;
    filters: { search?: string; correct_answer?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [correctAnswer, setCorrectAnswer] = useState(filters.correct_answer || '');

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get(
            route('admin.courses.questions.index', course.id),
            { search: value, correct_answer: correctAnswer },
            { preserveState: true, replace: true },
        );
    }, 500);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        debouncedSearch(value);
    };

    const handleFilterChange = (value: string) => {
        setCorrectAnswer(value);
        router.get(
            route('admin.courses.questions.index', course.id),
            { search, correct_answer: value === 'all' ? '' : value },
            { preserveState: true, replace: true },
        );
    };

    const handleDelete = (id: number) => {
        router.delete(route('admin.questions.destroy', id));
    };

    const getAnswerBadge = (answer: string) => {
        const colors = {
            a: 'bg-blue-100 text-blue-800',
            b: 'bg-green-100 text-green-800',
            c: 'bg-yellow-100 text-yellow-800',
            d: 'bg-purple-100 text-purple-800',
        };
        return colors[answer as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AppLayout>
            <Head title={`Questions - ${course.title}`} />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.courses.index')}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Questions</h1>
                            <p className="text-muted-foreground text-sm">{course.title}</p>
                        </div>
                    </div>
                    <Link href={route('admin.courses.questions.create', course.id)}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Question
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Questions ({questions.total})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search questions..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Select value={correctAnswer || 'all'} onValueChange={handleFilterChange}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filter by answer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Answers</SelectItem>
                                    <SelectItem value="a">Answer A</SelectItem>
                                    <SelectItem value="b">Answer B</SelectItem>
                                    <SelectItem value="c">Answer C</SelectItem>
                                    <SelectItem value="d">Answer D</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Mobile: Cards */}
                        <div className="space-y-3 lg:hidden">
                            {questions.data.map((question, index) => (
                                <Card key={question.id}>
                                    <CardContent className="p-4">
                                        <div className="mb-3 flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground text-sm font-medium">
                                                    #{(questions.current_page - 1) * questions.per_page + index + 1}
                                                </span>
                                                <Badge className={getAnswerBadge(question.correct_answer)}>
                                                    {question.correct_answer.toUpperCase()}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link href={route('admin.questions.edit', question.id)}>
                                                    <Button variant="ghost" size="icon">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                                                            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleDelete(question.id)}>Delete</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                        <p className="text-sm">{question.question_text}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Desktop: Table */}
                        <div className="hidden lg:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">#</TableHead>
                                        <TableHead>Question</TableHead>
                                        <TableHead className="w-32">Correct Answer</TableHead>
                                        <TableHead className="w-32 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {questions.data.map((question, index) => (
                                        <TableRow key={question.id}>
                                            <TableCell>{(questions.current_page - 1) * questions.per_page + index + 1}</TableCell>
                                            <TableCell className="max-w-md truncate">{question.question_text}</TableCell>
                                            <TableCell>
                                                <Badge className={getAnswerBadge(question.correct_answer)}>
                                                    {question.correct_answer.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('admin.questions.edit', question.id)}>
                                                        <Button variant="ghost" size="icon">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                                                                <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(question.id)}>
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {questions.data.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">No questions found.</p>
                            </div>
                        )}

                        {questions.links.length > 3 && (
                            <div className="flex flex-wrap justify-center gap-1">
                                {questions.links.map((link, index) => (
                                    <Button
                                        key={index}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
