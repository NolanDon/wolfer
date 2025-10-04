// app/api/waitlist/route.ts
import { NextResponse } from "next/server";
import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App;
if (!getApps().length) {
    adminApp = initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)),
    });
} else {
    adminApp = getApps()[0]!;
}
const adb = getFirestore(adminApp);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    const { email, source = "landing" } = await req.json();
    if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 320) {
        return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    await adb.collection("waitlist").add({
        email,
        source,
        createdAt: new Date(),
    });
    return NextResponse.json({ ok: true });
}
