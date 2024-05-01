import { Product } from "@prisma/client";
import db from "../db/db";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Suspense } from "react";

const wait = async (duration: number) =>
    new Promise((resolve) => setTimeout(resolve, duration));

async function getMostPopularProducts() {
    await wait(500);
    return await db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { order: { _count: "desc" } },
        take: 6,
    });
}

async function getLatestProducts() {
    await wait(1000);
    return await db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { createdAt: "desc" },
        take: 6,
    });
}

export default function CustomerHome() {
    return (
        <>
            <ProductGridSection
                productFetcher={getMostPopularProducts}
                title="Most Popular"
            />
            <ProductGridSection
                productFetcher={getLatestProducts}
                title="Latest Product"
            />
        </>
    );
}
async function ProductGridSection({
    productFetcher,
    title,
}: {
    productFetcher: () => Promise<Product[]>;
    title: string;
}) {
    return (
        <>
            <div className="flex space-x-4 items-center justify-between my-8">
                <h1 className="text-3xl">{title}</h1>
                <Button asChild variant={"outline"}>
                    <Link href="/products" className="space-x-2">
                        <span>View All</span>
                        <ArrowRight className="size-4" />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Suspense
                    fallback={
                        <>
                            <ProductSkeleton />
                            <ProductSkeleton />
                            <ProductSkeleton />
                        </>
                    }
                >
                    <ProductSuspense productFetcher={productFetcher} />
                </Suspense>
            </div>
        </>
    );
}

async function ProductSuspense({
    productFetcher,
}: {
    productFetcher: () => Promise<Product[]>;
}) {
    return (await productFetcher()).map((product) => (
        <ProductCard key={product.id} {...product} />
    ));
}
