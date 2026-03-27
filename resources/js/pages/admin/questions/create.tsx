import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Course {
    id: number;
    title: string;
}

export default function Create({ course }: { course: Course }) {
    const { data, setData, post, processing, errors } = useForm<{
        question_text: string;
        option_a: string;
        option_b: string;
        option_c: string;
        option_d: string;
        correct_answer: string;
    }>({
        question_text: '',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct_answer: 'a',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.courses.questions.store', course.id));
    };

    return (
        <AppLayout>
            <Head title={`Add Question - ${course.title}`} />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.courses.questions.index', course.id)}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Add Question</h1>
                        <p className="text-muted-foreground text-sm">{course.title}</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Question Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="question_text">Question</Label>
                                <Textarea
                                    id="question_text"
                                    value={data.question_text}
                                    onChange={(e) => setData('question_text', e.target.value)}
                                    placeholder="Enter your question here..."
                                    rows={3}
                                />
                                {errors.question_text && <p className="text-destructive text-sm">{errors.question_text}</p>}
                            </div>

                            <div className="space-y-4">
                                <Label>Answer Options</Label>

                                <div className="space-y-2">
                                    <Label htmlFor="option_a" className="text-sm font-normal">
                                        Option A
                                    </Label>
                                    <Input
                                        id="option_a"
                                        value={data.option_a}
                                        onChange={(e) => setData('option_a', e.target.value)}
                                        placeholder="Enter option A"
                                    />
                                    {errors.option_a && <p className="text-destructive text-sm">{errors.option_a}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="option_b" className="text-sm font-normal">
                                        Option B
                                    </Label>
                                    <Input
                                        id="option_b"
                                        value={data.option_b}
                                        onChange={(e) => setData('option_b', e.target.value)}
                                        placeholder="Enter option B"
                                    />
                                    {errors.option_b && <p className="text-destructive text-sm">{errors.option_b}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="option_c" className="text-sm font-normal">
                                        Option C
                                    </Label>
                                    <Input
                                        id="option_c"
                                        value={data.option_c}
                                        onChange={(e) => setData('option_c', e.target.value)}
                                        placeholder="Enter option C"
                                    />
                                    {errors.option_c && <p className="text-destructive text-sm">{errors.option_c}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="option_d" className="text-sm font-normal">
                                        Option D
                                    </Label>
                                    <Input
                                        id="option_d"
                                        value={data.option_d}
                                        onChange={(e) => setData('option_d', e.target.value)}
                                        placeholder="Enter option D"
                                    />
                                    {errors.option_d && <p className="text-destructive text-sm">{errors.option_d}</p>}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>Correct Answer</Label>
                                <RadioGroup value={data.correct_answer} onValueChange={(value) => setData('correct_answer', value)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="a" id="answer_a" />
                                        <Label htmlFor="answer_a" className="font-normal">
                                            Option A
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="b" id="answer_b" />
                                        <Label htmlFor="answer_b" className="font-normal">
                                            Option B
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="c" id="answer_c" />
                                        <Label htmlFor="answer_c" className="font-normal">
                                            Option C
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="d" id="answer_d" />
                                        <Label htmlFor="answer_d" className="font-normal">
                                            Option D
                                        </Label>
                                    </div>
                                </RadioGroup>
                                {errors.correct_answer && <p className="text-destructive text-sm">{errors.correct_answer}</p>}
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Link href={route('admin.courses.questions.index', course.id)} className="w-full sm:w-auto">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    {processing ? 'Creating...' : 'Create Question'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
