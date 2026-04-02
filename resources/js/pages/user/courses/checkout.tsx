import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen, CheckCircle2, CreditCard, Lock, Shield, Clock } from 'lucide-react';
import { useState } from 'react';

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
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agreedToTerms) {
            return;
        }
        post(route('payment.process', course.id));
    };

    return (
        <AppLayout>
            <Head title={`Checkout - ${course.title}`} />

            <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
                {/* Header - Mobile Optimized */}
                <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <Link href={route('courses.show', course.id)}>
                                    <Button variant="ghost" size="sm" className="gap-1.5 sm:gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        <span className="hidden sm:inline">Back</span>
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-lg font-bold sm:text-xl lg:text-2xl">Secure Checkout</h1>
                                    <p className="text-muted-foreground text-xs sm:text-sm">Complete your purchase</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="w-fit gap-1.5 text-xs">
                                <Lock className="h-3 w-3" />
                                Secure
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Main Content - Mobile First: Order Summary First */}
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    <div className="flex flex-col gap-4 sm:gap-6 lg:grid lg:grid-cols-3 lg:gap-8">
                        {/* Order Summary - Show First on Mobile, Right on Desktop */}
                        <div className="order-1 lg:order-2 lg:col-span-1">
                            <Card className="shadow-lg lg:sticky lg:top-8">
                                <CardHeader className="pb-3 sm:pb-6">
                                    <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Review your purchase</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 sm:space-y-4">
                                    <div className="bg-muted relative aspect-video overflow-hidden rounded-lg">
                                        {course.thumbnail ? (
                                            <img src={`/storage/${course.thumbnail}`} alt={course.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                                <BookOpen className="text-primary/40 h-12 w-12 sm:h-16 sm:w-16" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold leading-tight sm:text-base">{course.title}</h3>
                                        <p className="text-muted-foreground mt-1.5 line-clamp-2 text-xs sm:mt-2 sm:line-clamp-3 sm:text-sm">{course.description}</p>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="flex items-center justify-between text-xs sm:text-sm">
                                            <span className="text-muted-foreground">Course Price</span>
                                            <span className="font-medium">RM {parseFloat(course.price).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs sm:text-sm">
                                            <span className="text-muted-foreground">Discount</span>
                                            <span className="text-green-600">RM 0.00</span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-semibold sm:text-lg">Total</span>
                                            <span className="text-xl font-bold text-primary sm:text-2xl">RM {parseFloat(course.price).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold sm:text-sm">What's included:</p>
                                        <ul className="space-y-1.5 text-xs sm:space-y-2 sm:text-sm">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="text-primary h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                                                <span>Lifetime access</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="text-primary h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                                                <span>Certificate</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="text-primary h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                                                <span>Mobile & desktop</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle2 className="text-primary h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                                                <span>30-day guarantee</span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Payment Form - Show Second on Mobile, Left on Desktop */}
                        <div className="order-2 space-y-4 sm:space-y-6 lg:order-1 lg:col-span-2">
                            <Card>
                                <CardHeader className="pb-3 sm:pb-6">
                                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                        <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                                        Billing Information
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Your account details</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                                        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
                                            <div className="space-y-1.5 sm:space-y-2">
                                                <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
                                                <Input id="name" type="text" value={user.name} readOnly className="bg-muted text-sm" />
                                            </div>
                                            <div className="space-y-1.5 sm:space-y-2">
                                                <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                                                <Input id="email" type="email" value={user.email} readOnly className="bg-muted text-sm" />
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 sm:gap-3 sm:p-4">
                                                <Shield className="text-primary mt-0.5 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                                                <div className="space-y-0.5 sm:space-y-1">
                                                    <p className="text-xs font-medium sm:text-sm">Secure Payment Gateway</p>
                                                    <p className="text-muted-foreground text-[10px] leading-relaxed sm:text-xs">
                                                        Redirected to RazerMS (Fiuu) for secure payment. We never store your payment info.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 sm:space-y-2">
                                                <Label className="text-xs sm:text-sm">Accepted Payment Methods</Label>
                                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                    <Badge variant="outline" className="gap-1 text-[10px] sm:gap-1.5 sm:text-xs">
                                                        <CreditCard className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                        Credit Card
                                                    </Badge>
                                                    <Badge variant="outline" className="gap-1 text-[10px] sm:gap-1.5 sm:text-xs">
                                                        <CreditCard className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                        Debit Card
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="flex items-start gap-2 rounded-lg border p-3 sm:gap-3 sm:p-4">
                                                <Checkbox
                                                    id="terms"
                                                    checked={agreedToTerms}
                                                    onCheckedChange={(checked) => {
                                                        const isChecked: boolean = checked === true;
                                                        setAgreedToTerms(isChecked);
                                                    }}
                                                    className="mt-0.5 sm:mt-1"
                                                />
                                                <div className="space-y-0.5 sm:space-y-1">
                                                    <Label htmlFor="terms" className="cursor-pointer text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sm:text-sm">
                                                        I agree to the Terms and Conditions
                                                    </Label>
                                                    <p className="text-muted-foreground text-[10px] leading-relaxed sm:text-xs">
                                                        By checking this box, you agree to the{' '}
                                                        <a href="#" className="text-primary hover:underline">Terms</a> and{' '}
                                                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>. Immediate access upon payment.
                                                    </p>
                                                </div>
                                            </div>

                                            {!agreedToTerms && (
                                                <div className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 rounded-lg border p-2.5 sm:p-3">
                                                    <p className="text-amber-800 dark:text-amber-200 text-[10px] sm:text-xs">
                                                        Please agree to the Terms and Conditions to proceed.
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <Button type="submit" className="w-full gap-2 text-sm sm:text-base" size="lg" disabled={processing || !agreedToTerms}>
                                            {processing ? (
                                                <>
                                                    <Clock className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                                                    Pay RM {parseFloat(course.price).toFixed(2)}
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="border-dashed">
                                <CardContent className="pt-4 sm:pt-6">
                                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                                        <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left">
                                            <div className="bg-primary/10 rounded-full p-1.5 sm:p-2">
                                                <Shield className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-medium sm:text-sm">Secure</p>
                                                <p className="text-muted-foreground hidden text-xs sm:block">SSL encrypted</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left">
                                            <div className="bg-primary/10 rounded-full p-1.5 sm:p-2">
                                                <CheckCircle2 className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-medium sm:text-sm">Guarantee</p>
                                                <p className="text-muted-foreground hidden text-xs sm:block">30-day</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left">
                                            <div className="bg-primary/10 rounded-full p-1.5 sm:p-2">
                                                <Lock className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-medium sm:text-sm">Private</p>
                                                <p className="text-muted-foreground hidden text-xs sm:block">Data safe</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
