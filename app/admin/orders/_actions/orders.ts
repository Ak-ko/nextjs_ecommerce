"use server";

import db from "@/app/db/db";

export const deleteOrder = async (id: string) => {
    await db.order.delete({
        where: {
            id,
        },
    });
};
