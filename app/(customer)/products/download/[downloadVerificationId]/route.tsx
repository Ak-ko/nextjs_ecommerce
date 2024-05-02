import db from "@/app/db/db";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export const GET = async (
    req: NextRequest,
    {
        params: { downloadVerificationId },
    }: {
        params: {
            downloadVerificationId: string;
        };
    }
) => {
    const data = await db.downloadVerification.findFirst({
        where: {
            id: downloadVerificationId,
            expiresAt: {
                gt: new Date(),
            },
        },
        select: {
            product: {
                select: {
                    id: true,
                    filePath: true,
                    name: true,
                },
            },
        },
    });
    if (!data)
        return NextResponse.redirect(
            new URL("/products/download/expired", req.url)
        );

    let { size } = await fs.stat(data.product.filePath);
    let file = await fs.readFile(data.product.filePath);
    let extension = data.product.filePath.split(".").pop();

    return new NextResponse(file, {
        headers: {
            "Content-Disposition": `attachment; filename=${data?.product?.name}.${extension}`,
            "Content-Length": `${size}`,
        },
    });
};
