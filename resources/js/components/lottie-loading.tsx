import { router } from '@inertiajs/react';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import loadingAnimation from '@/assets/animations/loading2.json';

export function LottieLoading() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let delayTimeout: ReturnType<typeof setTimeout> | null = null;
        let minimumTimeout: ReturnType<typeof setTimeout> | null = null;
        let loadingStartTime: number | null = null;

        const handleStart = (event: { detail: { visit: { prefetch?: boolean } } }) => {
            if (event.detail.visit.prefetch) {
                return;
            }

            delayTimeout = setTimeout(() => {
                setIsLoading(true);
                loadingStartTime = Date.now();
            }, 250);
        };

        const handleFinish = (event: { detail: { visit: { prefetch?: boolean } } }) => {
            if (event.detail.visit.prefetch) {
                return;
            }

            if (delayTimeout) {
                clearTimeout(delayTimeout);
                delayTimeout = null;
            }

            if (loadingStartTime) {
                const elapsed = Date.now() - loadingStartTime;
                const remaining = Math.max(0, 500 - elapsed);

                minimumTimeout = setTimeout(() => {
                    setIsLoading(false);
                    loadingStartTime = null;
                }, remaining);
            } else {
                setIsLoading(false);
            }
        };

        const removeStartListener = router.on('start', handleStart);
        const removeFinishListener = router.on('finish', handleFinish);

        return () => {
            if (delayTimeout) clearTimeout(delayTimeout);
            if (minimumTimeout) clearTimeout(minimumTimeout);
            removeStartListener();
            removeFinishListener();
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="h-64 w-64">
                <Lottie animationData={loadingAnimation} loop={true} />
            </div>
        </div>
    );
}
