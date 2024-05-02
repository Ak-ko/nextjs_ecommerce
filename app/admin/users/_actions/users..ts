"use server";

import db from "@/app/db/db";

export const deleteUser = async (id: string) => {
    let orders = await db.order.count({
        where: {
            userId: id,
        },
    });
    if (orders) {
        await db.order.deleteMany({
            where: {
                userId: id,
            },
        });
    }

    await db.user.delete({
        where: {
            id,
        },
    });
};
