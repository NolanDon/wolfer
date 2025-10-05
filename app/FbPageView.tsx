'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

declare global {
    interface Window { fbq?: (...args: any[]) => void }
}

export default function FbPageView() {
    const pathname = usePathname();
    const prevPath = useRef<string | null>(null);

    useEffect(() => {
        if (!window.fbq) return;

        // First mount: base snippet already fired PageView, so just set the path and skip
        if (prevPath.current === null) {
            prevPath.current = pathname || '';
            return;
        }

        // Subsequent navigations: fire PageView
        if (prevPath.current !== pathname) {
            window.fbq('track', 'PageView');
            prevPath.current = pathname || '';
        }
    }, [pathname]);

    return null;
}
