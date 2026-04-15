import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface VerifyOtpProps {
    email: string;
}

export default function VerifyOtp({ email }: VerifyOtpProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: email || '',
        otp: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('otp.verify.post'));
    };

    return (
        <AuthLayout title="Verify OTP" description="Enter the 6-digit code sent to your email">
            <Head title="Verify OTP" />

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" type="email" value={data.email} disabled className="bg-muted" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="otp">OTP Code</Label>
                            <Input
                                id="otp"
                                type="text"
                                required
                                maxLength={6}
                                autoFocus
                                value={data.otp}
                                onChange={(e) => setData('otp', e.target.value.replace(/\D/g, ''))}
                                placeholder="Enter 6-digit OTP"
                                disabled={processing}
                                className="text-center text-2xl tracking-widest"
                            />
                            <InputError message={errors.otp} />
                            <p className="text-muted-foreground text-sm">Check your email for the OTP code. It will expire in 10 minutes.</p>
                        </div>
                    </div>

                    <div className="my-6">
                        <Button className="w-full" disabled={processing || data.otp.length !== 6}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Verify OTP
                        </Button>
                    </div>
                </form>

                <div className="text-muted-foreground space-x-1 text-center text-sm">
                    <span>Didn't receive the code?</span>
                    <TextLink href={route('password.request')}>Resend</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
