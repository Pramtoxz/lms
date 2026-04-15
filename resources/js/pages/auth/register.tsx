import { Head, router } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'sonner';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterProps {
    recaptchaSiteKey: string;
}

export default function Register({ recaptchaSiteKey }: RegisterProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [email, setEmail] = useState('');
    const [sendingOtp, setSendingOtp] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const sendOtp: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email address.');
            return;
        }

        const token = recaptchaRef.current?.getValue();
        if (!token) {
            toast.error('Please complete the reCAPTCHA verification.');
            return;
        }

        setSendingOtp(true);

        router.post(
            route('register.send-otp'),
            { email },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('OTP has been sent to your email.');
                    setStep(2);
                },
                onError: (errors) => {
                    toast.error(errors.email || 'Failed to send OTP.');
                    recaptchaRef.current?.reset();
                },
                onFinish: () => {
                    setSendingOtp(false);
                },
            },
        );
    };

    if (step === 2) {
        return <VerifyOtpStep email={email} onVerified={() => setStep(3)} />;
    }

    if (step === 3) {
        return <CompleteRegistrationStep email={email} />;
    }

    return (
        <AuthLayout title="Create an account" description="Enter your email to get started">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={sendOtp}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={sendingOtp}
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="flex justify-center">
                        <ReCAPTCHA ref={recaptchaRef} sitekey={recaptchaSiteKey} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={2} disabled={sendingOtp}>
                        {sendingOtp && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Send OTP
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={3}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}

interface VerifyOtpStepProps {
    email: string;
    onVerified: () => void;
}

function VerifyOtpStep({ email, onVerified }: VerifyOtpStepProps) {
    const [otp, setOtp] = useState('');
    const [verifying, setVerifying] = useState(false);

    const verifyOtp: FormEventHandler = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP.');
            return;
        }

        setVerifying(true);

        router.post(
            route('register.verify-otp'),
            { email, otp },
            {
                onSuccess: () => {
                    toast.success('OTP verified successfully!');
                    onVerified();
                },
                onError: (errors) => {
                    const errorMessage = errors.otp || errors.email || 'Invalid or expired OTP code.';
                    toast.error(errorMessage);
                    setVerifying(false);
                },
                onFinish: () => {
                    setVerifying(false);
                },
            },
        );
    };

    return (
        <AuthLayout title="Verify OTP" description="Enter the 6-digit code sent to your email">
            <Head title="Register - Verify OTP" />
            <form className="flex flex-col gap-6" onSubmit={verifyOtp}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" type="email" value={email} disabled className="bg-muted" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="otp">OTP Code</Label>
                        <Input
                            id="otp"
                            type="text"
                            required
                            maxLength={6}
                            autoFocus
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            disabled={verifying}
                            placeholder="Enter 6-digit OTP"
                            className="text-center text-2xl tracking-widest"
                        />
                        <p className="text-muted-foreground text-sm">Check your email for the OTP code.</p>
                    </div>

                    <Button type="submit" className="mt-2 w-full" disabled={verifying || otp.length !== 6}>
                        {verifying && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Verify OTP
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account? <TextLink href={route('login')}>Log in</TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}

interface CompleteRegistrationStepProps {
    email: string;
}

function CompleteRegistrationStep({ email }: CompleteRegistrationStepProps) {
    const [formData, setFormData] = useState({
        nirc: '',
        name: '',
        password: '',
        password_confirmation: '',
    });
    const [processing, setProcessing] = useState(false);
    const [searchingNirc, setSearchingNirc] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const searchNirc = async () => {
        if (!formData.nirc || formData.nirc.length < 3) {
            toast.error('Please enter a valid NIRC.');
            return;
        }

        setSearchingNirc(true);
        setErrors({});

        try {
            const response = await fetch(route('register.fetch-nirc'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ nirc: formData.nirc }),
                credentials: 'same-origin',
            });

            const result = await response.json();

            if (response.ok) {
                setFormData((prev) => ({ ...prev, name: result.name }));
                toast.success('Name found and auto-filled!');
            } else {
                toast.error(result.message || 'NIRC not found.');
                setErrors({ nirc: result.message || 'NIRC not found in Capstar database.' });
            }
        } catch {
            toast.error('Failed to fetch NIRC data. Please try again.');
        } finally {
            setSearchingNirc(false);
        }
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            route('register.store'),
            {
                email,
                ...formData,
            },
            {
                onSuccess: () => {
                    router.visit(route('dashboard'));
                },
                onError: (errors) => {
                    setErrors(errors);
                    const firstError = Object.values(errors)[0];
                    if (firstError) {
                        toast.error(firstError as string);
                    }
                },
                onFinish: () => {
                    setProcessing(false);
                },
            },
        );
    };

    return (
        <AuthLayout title="Complete registration" description="Enter your NIRC and password">
            <Head title="Register - Complete" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" type="email" value={email} disabled className="bg-muted" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="nirc">NIRC (ID Karyawan Capstar)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="nirc"
                                type="text"
                                required
                                autoFocus
                                value={formData.nirc}
                                onChange={(e) => setFormData({ ...formData, nirc: e.target.value })}
                                disabled={processing || searchingNirc}
                                placeholder="Enter your NIRC"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={searchNirc}
                                disabled={searchingNirc || !formData.nirc}
                                className="shrink-0"
                            >
                                {searchingNirc && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Search
                            </Button>
                        </div>
                        <InputError message={errors.nirc} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoComplete="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={processing || searchingNirc}
                            placeholder={searchingNirc ? 'Searching...' : 'Full name'}
                            className={searchingNirc ? 'bg-muted' : ''}
                        />
                        <InputError message={errors.name} />
                        <p className="text-muted-foreground text-sm">Click "Search" to auto-fill name from NIRC</p>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            autoComplete="new-password"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" disabled={processing || searchingNirc}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account? <TextLink href={route('login')}>Log in</TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
