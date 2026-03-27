import { useEffect, useState } from 'react';

export type Appearance = 'light';

const applyTheme = () => {
    document.documentElement.classList.remove('dark');
};

export function initializeTheme() {
    applyTheme();
    localStorage.setItem('appearance', 'light');
}

export function useAppearance() {
    const [appearance, setAppearance] = useState<Appearance>('light');

    const updateAppearance = (mode: Appearance) => {
        setAppearance(mode);
        localStorage.setItem('appearance', mode);
        applyTheme();
    };

    useEffect(() => {
        updateAppearance('light');
    }, []);

    return { appearance, updateAppearance };
}
