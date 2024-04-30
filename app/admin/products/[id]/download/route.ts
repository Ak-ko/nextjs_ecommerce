import db from "@/app/db/db";
import fs from "fs/promises";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    req: NextRequest,
    { params }: { params: { id: string } }
) => {
    let product = await db.product.findUnique({
        select: {
            id: true,
            filePath: true,
            name: true,
        },
        where: {
            id: params.id,
        },
    });
    if (!product) return notFound();
    let { size } = await fs.stat(product?.filePath);
    let file = await fs.readFile(product.filePath);
    let extension = product.filePath.split(".").pop();
    return new NextResponse(file, {
        headers: {
            "Content-Disposition": `attachment; filename=${product.name}.${extension}`,
            "Content-Length": `${size}`,
        },
    });
};
