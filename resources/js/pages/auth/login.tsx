import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle, Lock, Mail } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Hero from '@/assets/images/hero-login.jpg';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    'g-recaptcha-response': string;
    [key: string]: string | boolean;
}

interface LoginProps {
    status?: string;
    recaptchaSiteKey: string;
}

export default function Login({ status, recaptchaSiteKey }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
        'g-recaptcha-response': '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        const token = recaptchaRef.current?.getValue();
        
        if (!token) {
            return;
        }
        
        setData('g-recaptcha-response', token);
        
        post(route('login'), {
            onFinish: () => {
                reset('password');
                recaptchaRef.current?.reset();
            },
        });
    };

    return (
        <>
            <Head title="Log in" />
            
            <div className="min-h-screen flex flex-col lg:flex-row">
                {/* Left Side - Hero Section with Background Image */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <img 
                            src={Hero} 
                            alt="Learning Platform"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-purple-600/85 to-blue-600/90" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                        {/* Top Section */}
                        <div>
                            <div className="flex items-center gap-3 mb-12">
                                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold">LMS Platform</span>
                            </div>
                            
                            <h1 className="text-5xl font-bold mb-6 leading-tight">
                                Welcome to<br />Learning Management<br />System
                            </h1>
                            <p className="text-xl text-white/90 max-w-md">
                                Access your courses, track your progress, and achieve your learning goals.
                            </p>
                        </div>

                        {/* Bottom Section - Features */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <span className="text-lg">Interactive Learning Experience</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <span className="text-lg">Live Classes with Zoom Integration</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <span className="text-lg">Certificates Upon Completion</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
                    <div className="w-full max-w-md space-y-6 sm:space-y-8">
                        {/* Mobile Logo */}
                        <div className="flex flex-col items-center gap-4 lg:hidden">
                            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center">
                                <img 
                                    src="https://ui-avatars.com/api/?name=LMS&background=8b5cf6&color=fff&size=64&bold=true" 
                                    alt="Logo"
                                    className="h-14 w-14 rounded-lg"
                                />
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold">Welcome Back</h2>
                                <p className="text-sm text-muted-foreground mt-1">Sign in to continue learning</p>
                            </div>
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden lg:block space-y-2">
                            <h2 className="text-3xl font-bold">Sign In</h2>
                            <p className="text-muted-foreground">Enter your credentials to access your account</p>
                        </div>

                        {status && (
                            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600 border border-green-200">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="your.email@example.com"
                                        className="pl-10"
                                    />
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter your password"
                                        className="pl-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="remember" 
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                />
                                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                                    Remember me for 30 days
                                </Label>
                            </div>

                            {/* reCAPTCHA */}
                            <div className="flex justify-center">
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={recaptchaSiteKey}
                                    onChange={(token) => setData('g-recaptcha-response', token || '')}
                                />
                            </div>
                            <InputError message={errors['g-recaptcha-response']} />

                            <Button 
                                type="submit" 
                                className="w-full h-11" 
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>

                        <div className="text-center text-xs text-muted-foreground">
                            <p>Protected by reCAPTCHA</p>
                            <p className="mt-1">
                                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    Privacy
                                </a>
                                {' · '}
                                <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    Terms
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
