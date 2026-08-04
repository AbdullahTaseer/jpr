import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth-guard";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    api_key: process.env.CLOUDINARY_API_KEY ?? "",
    api_secret: process.env.CLOUDINARY_API_SECRET ?? "",
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let formData: FormData;
    try {
        formData = await req.formData();
    } catch {
        return NextResponse.json({ error: "Failed to parse upload — file may be too large" }, { status: 413 });
    }

    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "Only JPEG, PNG, WEBP, and GIF images are allowed" }, { status: 400 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return NextResponse.json({ error: "Cloudinary env vars not configured on this server" }, { status: 500 });
    }

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "jpr-uploads" },
                (error, result) => {
                    if (error || !result) {
                        const msg = error?.message ?? error?.http_code ?? JSON.stringify(error) ?? "Upload failed";
                        return reject(new Error(String(msg)));
                    }
                    resolve(result as { secure_url: string });
                }
            );
            stream.end(buffer);
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (err) {
        const message =
            err instanceof Error ? err.message :
            (err && typeof err === "object" && "message" in err) ? String((err as { message: unknown }).message) :
            JSON.stringify(err);
        console.error("[upload] cloudinary error:", message);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
