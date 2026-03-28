import { router } from '@inertiajs/react';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import loadingAnimation from '@/assets/animations/loading2.json';

export function LottieLoading() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout> | null = null;
        let minimumDisplayTimeout: ReturnType<typeof setTimeout> | null = null;
        let startTime: number | null = null;

        const removeStartListener = router.on('start', () => {
            timeout = setTimeout(() => {
                setIsLoading(true);
                startTime = Date.now();
            }, 500); // Delay 500ms sebelum muncul
        });

        const removeFinishListener = router.on('finish', () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }

            // Jika loading sudah muncul, pastikan tampil minimal 300ms
            if (isLoading && startTime) {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 300 - elapsed);

                minimumDisplayTimeout = setTimeout(() => {
                    setIsLoading(false);
                    startTime = null;
                }, remaining);
            } else {
                setIsLoading(false);
            }
        });

        return () => {
            if (timeout) clearTimeout(timeout);
            if (minimumDisplayTimeout) clearTimeout(minimumDisplayTimeout);
            removeStartListener();
            removeFinishListener();
        };
    }, [isLoading]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-64 h-64">
                <Lottie animationData={loadingAnimation} loop={true} />
            </div>
        </div>
    );
}
