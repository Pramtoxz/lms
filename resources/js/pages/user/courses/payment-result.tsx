import paymentFailedAnimation from '@/assets/animations/not_passed.json';
import paymentSuccessAnimation from '@/assets/animations/payment-success.json';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';
import Lottie, { type LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef } from 'react';

interface Course {
    id: number;
    title: string;
    price: string;
}

interface Transaction {
    id: number;
    order_id: string;
    amount: string;
    status: string;
    created_at: string;
}

export default function PaymentResult({ success, course }: { success: boolean; course: Course; transaction: Transaction; message?: string }) {
    const lottieRef = useRef<LottieRefCurrentProps>(null);

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(success ? 0.7 : 0.8);
        }
    }, [success]);

    return (
        <>
            <Head title={`Payment ${success ? 'Successful' : 'Failed'} - ${course.title}`} />

            <div className="flex min-h-screen flex-col items-center justify-center bg-white">
                <div className="flex w-full flex-1 items-center justify-center">
                    {success ? (
                        <Lottie lottieRef={lottieRef} animationData={paymentSuccessAnimation} loop={false} className="h-full w-full" />
                    ) : (
                        <Lottie lottieRef={lottieRef} animationData={paymentFailedAnimation} loop={true} className="h-full w-full" />
                    )}
                </div>

                <div className="w-full space-y-3 px-4 pb-8 sm:max-w-md">
                    {success ? (
                        <Link href={route('courses.index')} className="block">
                            <Button className="w-full" size="lg">
                                Go to My Courses
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href={route('courses.checkout', course.id)} className="block">
                                <Button className="w-full" size="lg">
                                    Try Again
                                </Button>
                            </Link>
                            <Link href={route('courses.browse')} className="block">
                                <Button variant="outline" className="w-full" size="lg">
                                    Browse Courses
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
