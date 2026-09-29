import { SignJWT, jwtVerify } from "jose";
import { createHash } from "crypto";
import { prisma } from "./prisma";

// Separate key from session tokens so a reset token can never be used as a login cookie
const secret = new TextEncoder().encode(
    (process.env.JWT_SECRET ?? "changeme-set-JWT_SECRET-in-env") + ":password-reset"
);

const EXPIRY = "1h";
const PURPOSE = "password-reset";

// Fingerprint of the current password hash. Once the password changes, the
// fingerprint no longer matches, so each link works only once.
function fingerprint(passwordHash: string) {
    return createHash("sha256").update(passwordHash).digest("hex").slice(0, 32);
}

export async function createResetToken(user: { id: string; password: string }) {
    return new SignJWT({ purpose: PURPOSE, fp: fingerprint(user.password) })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(user.id)
        .setIssuedAt()
        .setExpirationTime(EXPIRY)
        .sign(secret);
}

export function resetUrl(token: string) {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return `${base}/reset-password?token=${encodeURIComponent(token)}`;
}

/** Returns the user the token belongs to, or null if it is invalid, expired or already used. */
export async function verifyResetToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        if (payload.purpose !== PURPOSE || !payload.sub) return null;

        const user = await prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user || fingerprint(user.password) !== payload.fp) return null;
        return user;
    } catch {
        return null;
    }
}
