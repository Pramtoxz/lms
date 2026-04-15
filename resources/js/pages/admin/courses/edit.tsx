import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string | null;
    price: number;
    is_free: boolean;
    certificate_template: string | null;
    certificate_font: string | null;
    exam_duration: number;
    is_published: boolean;
    capstar_course_number: number | null;
}

export default function Edit({ course, availableFonts }: { course: Course; availableFonts: Record<string, { name: string; path: string }> }) {
    const { data, setData, post, processing, errors } = useForm({
        title: course.title || '',
        description: course.description || '',
        thumbnail: null as File | null,
        price: String(course.price || 0),
        is_free: course.is_free ?? true,
        certificate_template: null as File | null,
        certificate_font: course.certificate_font || 'dejavu',
        exam_duration: course.exam_duration || 30,
        is_published: course.is_published || false,
        sync_to_capstar: !!course.capstar_course_number,
        capstar_course_number: course.capstar_course_number ? String(course.capstar_course_number) : '',
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.courses.update', course.id));
    };

    return (
        <AppLayout>
            <Head title="Edit Course" />

            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.courses.index')}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Course</h1>
                        <p className="text-muted-foreground text-sm">Update course information</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Course Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter course title"
                                />
                                {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Enter course description"
                                    rows={5}
                                />
                                {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Thumbnail</Label>
                                {course.thumbnail && (
                                    <div className="mb-2">
                                        <img
                                            src={`/storage/${course.thumbnail}`}
                                            alt="Current thumbnail"
                                            className="h-32 w-auto rounded-md object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('thumbnail', e.target.files?.[0] || null)}
                                />
                                {errors.thumbnail && <p className="text-destructive text-sm">{errors.thumbnail}</p>}
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (MYR)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="0.00"
                                        disabled={data.is_free}
                                    />
                                    <p className="text-muted-foreground text-xs">Current: RM{course.price}</p>
                                    {errors.price && <p className="text-destructive text-sm">{errors.price}</p>}
                                </div>

                                <div className="flex items-center space-x-2 pt-8">
                                    <Checkbox
                                        id="is_free"
                                        checked={data.is_free}
                                        onCheckedChange={(checked) => {
                                            const isChecked: boolean = checked === true;
                                            setData('is_free', isChecked);
                                            if (isChecked) {
                                                setData('price', '0');
                                            }
                                        }}
                                    />
                                    <Label htmlFor="is_free" className="cursor-pointer">
                                        Free Course
                                    </Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="certificate_template">Certificate Template</Label>
                                {course.certificate_template && (
                                    <div className="mb-2">
                                        <img
                                            src={`/storage/${course.certificate_template}`}
                                            alt="Current certificate template"
                                            className="h-32 w-auto rounded-md object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="certificate_template"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('certificate_template', e.target.files?.[0] || null)}
                                />
                                <p className="text-muted-foreground text-xs">
                                    Upload certificate background (2970x2100px, max 5MB). Text akan otomatis ditambahkan di koordinat fixed.
                                </p>
                                {errors.certificate_template && <p className="text-destructive text-sm">{errors.certificate_template}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="certificate_font">Certificate Font</Label>
                                <Select value={data.certificate_font} onValueChange={(value) => setData('certificate_font', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih font untuk sertifikat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(availableFonts).map(([key, font]) => (
                                            <SelectItem key={key} value={key}>
                                                {font.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-muted-foreground text-xs">
                                    Pilih font untuk text di sertifikat. Current: {availableFonts[data.certificate_font]?.name || 'DejaVu Sans'}
                                </p>
                                {errors.certificate_font && <p className="text-destructive text-sm">{errors.certificate_font}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="exam_duration">Exam Duration (minutes)</Label>
                                <Input
                                    id="exam_duration"
                                    type="number"
                                    min="5"
                                    max="180"
                                    value={data.exam_duration}
                                    onChange={(e) => setData('exam_duration', parseInt(e.target.value))}
                                    placeholder="30"
                                />
                                <p className="text-muted-foreground text-xs">Set exam duration (5-180 minutes). Default: 30 minutes</p>
                                {errors.exam_duration && <p className="text-destructive text-sm">{errors.exam_duration}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_published"
                                    checked={data.is_published}
                                    onCheckedChange={(checked) => setData('is_published', checked === true)}
                                />
                                <Label htmlFor="is_published" className="cursor-pointer">
                                    Publish this course
                                </Label>
                            </div>

                            <div className="space-y-4 rounded-lg border p-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="sync_to_capstar"
                                        checked={data.sync_to_capstar}
                                        onCheckedChange={(checked) => {
                                            const isChecked: boolean = checked === true;
                                            setData('sync_to_capstar', isChecked);
                                            if (!isChecked) {
                                                setData('capstar_course_number', '');
                                            }
                                        }}
                                    />
                                    <Label htmlFor="sync_to_capstar" className="cursor-pointer">
                                        Sync to Capstar
                                    </Label>
                                </div>

                                {data.sync_to_capstar && (
                                    <div className="space-y-2">
                                        <Label htmlFor="capstar_course_number">Capstar Course Number</Label>
                                        <Select
                                            value={data.capstar_course_number}
                                            onValueChange={(value) => setData('capstar_course_number', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select course number (1-5)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Course 1</SelectItem>
                                                <SelectItem value="2">Course 2</SelectItem>
                                                <SelectItem value="3">Course 3</SelectItem>
                                                <SelectItem value="4">Course 4</SelectItem>
                                                <SelectItem value="5">Course 5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-muted-foreground text-xs">
                                            Current: {course.capstar_course_number ? `Course ${course.capstar_course_number}` : 'Not set'}
                                        </p>
                                        {errors.capstar_course_number && (
                                            <p className="text-destructive text-sm">{errors.capstar_course_number}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                                <Link href={route('admin.courses.index')} className="w-full sm:w-auto">
                                    <Button type="button" variant="outline" className="w-full">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                                    {processing ? 'Updating...' : 'Update Course'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
