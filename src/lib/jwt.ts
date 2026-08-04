import { SignJWT, jwtVerify } from "jose";

export type JWTPayload = {
    userId: string;
    email: string;
    role: "USER" | "VENDOR" | "ADMIN";
};

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "changeme-set-JWT_SECRET-in-env"
);

const EXPIRY = "7d";
export const COOKIE_NAME = "token";

export async function signToken(payload: JWTPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(EXPIRY)
        .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
}
