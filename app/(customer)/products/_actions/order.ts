"use server";

import db from "@/app/db/db";

export const checkOrderExists = async (email: string, productId: string) => {
    return (
        (await db.order.findFirst({
            where: {
                user: {
                    email,
                },
                productId,
            },
            select: {
                id: true,
            },
        })) || null
    );
};
