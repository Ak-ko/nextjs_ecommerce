import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
    if (!(await isAuthenticated(req))) {
        return new NextResponse("Unauthorized", {
            status: 401,
            headers: {
                "WWW-Authenticate": "Basic",
            },
        });
    }
}

async function isAuthenticated(req: NextRequest) {
    const authHeader =
        req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader) return false;
    // decoding the username and password
    const [username, password] = decodeAuthHeader(authHeader);

    return await Promise.resolve(
        username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
    );
}
const decodeAuthHeader = (
    authHeader: string,
    encoder: BufferEncoding = "base64"
) => {
    return Buffer.from(authHeader.split(" ")[1], "base64")
        .toString()
        .split(":");
};

export const config = {
    matcher: "/admin/:path*",
};
