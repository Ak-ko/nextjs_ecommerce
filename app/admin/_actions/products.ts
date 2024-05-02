"use server";

import db from "@/app/db/db";
import { z } from "zod";
import fs from "fs/promises";
import crypto from "crypto";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema;
const addSchema = z.object({
    name: z.string().min(1),
    priceInCents: z.coerce.number().int().min(1),
    description: z.string().min(1),
    file: fileSchema.refine((file) => file.size > 0, "Required"),
    image: imageSchema.refine(
        (file) => file.size > 0 || file.type.startsWith("image/"),
        "Required"
    ),
});

const editSchema = addSchema.extend({
    file: fileSchema.optional(),
    image: imageSchema.optional(),
});

export const addProduct = async (prevState: unknown, formData: FormData) => {
    const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!result.success) {
        return result.error.formErrors.fieldErrors;
    }

    const data = result.data;

    await fs.mkdir("products", { recursive: true });
    const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
    await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

    await fs.mkdir("public/images", { recursive: true });
    const imagePath = `/images/${crypto.randomUUID()}-${data.image.name}`;
    await fs.writeFile(
        `public${imagePath}`,
        Buffer.from(await data.image.arrayBuffer())
    );

    await db.product.create({
        data: {
            name: data.name,
            priceInCents: data.priceInCents,
            description: data.description,
            filePath,
            imagePath,
        },
    });
    revalidatingClientRoutes();
    redirect("/admin/products");
};

export const updateProduct = async (
    id: string,
    prevState: unknown,
    formData: FormData
) => {
    const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!result.success) {
        return result.error.formErrors.fieldErrors;
    }

    const data = result.data;
    const oldData = await db.product.findUnique({
        where: {
            id,
        },
    });
    if (!oldData) return notFound();

    let filePath = oldData?.filePath;
    if (data?.file && data?.file?.size > 0 && filePath) {
        await fs.unlink(filePath);
        filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
        await fs.writeFile(
            filePath,
            Buffer.from(await data.file.arrayBuffer())
        );
    }

    let imagePath = oldData?.imagePath;
    if (imagePath && data.image && data?.image?.size > 0) {
        await fs.unlink(`public${imagePath}`);
        imagePath = `/images/${crypto.randomUUID()}-${data.image.name}`;
        await fs.writeFile(
            `public${imagePath}`,
            Buffer.from(await data.image.arrayBuffer())
        );
    }

    await db.product.update({
        where: {
            id,
        },
        data: {
            name: data.name,
            priceInCents: data.priceInCents,
            description: data.description,
            filePath,
            imagePath,
        },
    });
    revalidatingClientRoutes();
    redirect("/admin/products");
};

export const toggleActiveStatus = async (
    id: string,
    isAvailableForPurchase: boolean
) => {
    await db.product.update({
        where: { id },
        data: {
            isAvailableForPurchase,
        },
    });
    revalidatingClientRoutes();
};

export const deleteProduct = async (id: string) => {
    let product = await db.product.delete({ where: { id } });
    revalidatingClientRoutes();
    if (!product) return notFound();
    await fs.unlink(product.filePath);
    await fs.unlink(`public${product.imagePath}`);
};

function revalidatingClientRoutes() {
    revalidatePath("/");
    revalidatePath("/products");
}
