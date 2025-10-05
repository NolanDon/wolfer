// app/gtag-pageview.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function GtagPageView({ id }: { id: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '');
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'page_view', {
                page_path: url,
                page_location: window.location.href,
                send_to: id,
            });
        }
    }, [pathname, searchParams, id]);

    return null;
}
