// Next.js App Router
export async function GET() {
    const target = process.env.SLACK_INVITE_URL;
    // fail-safe: send to a community page if the env is missing
    const fallback = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://trywolfer.com") + "/community";
    return new Response(null, {
        status: 302,
        headers: {
            Location: target || fallback,
            "Cache-Control": "no-store, no-cache, max-age=0",
            "Referrer-Policy": "no-referrer",
        },
    });
}
