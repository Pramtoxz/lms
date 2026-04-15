// Components
import { Head, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const [email, setEmail] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        try {
            const response = await fetch(route('password.email'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                toast.success('OTP has been sent to your email.');

                // Redirect to OTP verification page
                router.visit(route('otp.verify', { email }));
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to send OTP');
            }
        } catch {
            toast.error('Failed to send OTP. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <AuthLayout title="Forgot password" description="Enter your email to receive an OTP code">
            <Head title="Forgot password" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={email}
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            disabled={processing}
                        />

                        <InputError message={error} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button className="w-full" disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Send OTP Code
                        </Button>
                    </div>
                </form>

                <div className="text-muted-foreground space-x-1 text-center text-sm">
                    <span>Or, return to</span>
                    <TextLink href={route('login')}>log in</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
