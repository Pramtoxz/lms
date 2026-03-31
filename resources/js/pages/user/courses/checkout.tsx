import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';

interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail: string | null;
    price: string;
}

interface User {
    name: string;
    email: string;
}

export default function Checkout({ course, user }: { course: Course; user: User }) {
    const { post, processing } = useForm();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('payment.process', course.id));
    };

    return (
        <AppLayout>
            <Head title={`Checkout - ${course.title}`} />

            <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Complete your purchase to enroll in this course</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Course Summary */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Thumbnail */}
                            <div className="bg-muted relative aspect-video overflow-hidden rounded-lg">
                                {course.thumbnail ? (
                                    <img src={`/storage/${course.thumbnail}`} alt={course.title} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <BookOpen className="text-muted-foreground h-12 w-12" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="font-semibold">{course.title}</h3>
                                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{course.description}</p>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm">Course Price</span>
                                    <span className="font-semibold">RM {parseFloat(course.price).toFixed(2)}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between border-t pt-2">
                                    <span className="font-semibold">Total</span>
                                    <span className="text-lg font-bold">RM {parseFloat(course.price).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Form */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Billing Information</CardTitle>
                            <CardDescription>Enter your details to proceed with payment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" type="text" value={user.name} readOnly className="bg-muted" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={user.email} readOnly className="bg-muted" />
                                </div>

                                <div className="bg-muted rounded-lg p-4">
                                    <p className="text-sm">
                                        By clicking "Proceed to Payment", you will be redirected to RazerMS payment gateway to complete your
                                        purchase securely.
                                    </p>
                                </div>

                                <Button type="submit" className="w-full" size="lg" disabled={processing}>
                                    {processing ? 'Processing...' : `Pay RM ${parseFloat(course.price).toFixed(2)}`}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
