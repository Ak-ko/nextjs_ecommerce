"use client";

import { addProduct, updateProduct } from "@/app/admin/_actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function ProductForm({ product }: { product?: Product | null }) {
    const [error, action] = useFormState(
        !product ? addProduct : updateProduct.bind(null, product.id),
        {}
    );
    const [priceInCents, setPriceInCents] = useState<number>(
        product?.priceInCents || 0
    );
    return (
        <form action={action} className="space-y-8">
            <div className="space-y-3">
                <Label htmlFor="name">Name</Label>
                <Input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={product?.name}
                />
                {error?.name && (
                    <div className="text-xs text-destructive">
                        {error?.name}
                    </div>
                )}
            </div>
            <div className="space-y-3">
                <Label htmlFor="priceInCents">Price In Cents</Label>
                <Input
                    type="number"
                    name="priceInCents"
                    id="priceInCents"
                    onChange={(e) => setPriceInCents(+e.target.value)}
                    defaultValue={product?.priceInCents}
                />
                <div className="mt-2 text-secondary-foreground">
                    {formatCurrency(priceInCents / 100)}
                </div>
                {error?.priceInCents && (
                    <div className="text-xs text-destructive">
                        {error?.priceInCents}
                    </div>
                )}
            </div>
            <div className="space-y-3">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    name="description"
                    id="description"
                    defaultValue={product?.description}
                />
                {error?.description && (
                    <div className="text-xs text-destructive">
                        {error?.description}
                    </div>
                )}
            </div>
            <div className="space-y-3">
                <Label htmlFor="file">File</Label>
                <Input type="file" name="file" id="file" />
                {product?.filePath && (
                    <div className="text-secondary-foreground">
                        {product?.filePath}
                    </div>
                )}
                {error?.file && (
                    <div className="text-xs text-destructive">
                        {error?.file}
                    </div>
                )}
            </div>
            <div className="space-y-3">
                <Label htmlFor="image">Image</Label>
                <Input
                    type="file"
                    name="image"
                    id="image"
                    accept={"image/png, image/jpeg"}
                />
                {product?.imagePath && (
                    <Image
                        src={product?.imagePath}
                        width={400}
                        height={400}
                        alt="image"
                    />
                )}
                {error?.image && (
                    <div className="text-xs text-destructive">
                        {error?.image}
                    </div>
                )}
            </div>
            <SubmitButton />
        </form>
    );
}

const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? "Saving..." : "Save"}
        </Button>
    );
};
