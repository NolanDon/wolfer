// app/gtag-pageview.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GtagPageView({ id }: { id: string }) {
    const pathname = usePathname();

    useEffect(() => {
        const search = typeof window !== 'undefined' ? window.location.search : '';
        const url = `${pathname || ''}${search}`;

        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'page_view', {
                page_path: url,
                page_location: window.location.href,
                send_to: id,
            });
        }
    }, [pathname, id]);

    return null;
}
