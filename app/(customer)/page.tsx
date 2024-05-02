import { Product } from "@prisma/client";
import db from "../db/db";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductSkeleton from "@/components/ProductSkeleton";
import { Suspense } from "react";
import { wait } from "@/helpers";
import ProductGrid from "@/components/ProductGrid";
import { cache } from "@/lib/cache";

const getMostPopularProducts = cache(
    () => {
        return db.product.findMany({
            where: { isAvailableForPurchase: true },
            orderBy: { order: { _count: "desc" } },
            take: 6,
        });
    },
    ["/", "getMostPopularProducts"],
    {
        revalidate: 60 * 60 * 24,
    }
);

const getLatestProducts = cache(() => {
    return db.product.findMany({
        where: { isAvailableForPurchase: true },
        orderBy: { createdAt: "desc" },
        take: 6,
    });
}, ["/", "getLatestProducts"]);

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
function ProductGridSection({
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
            <ProductGrid>
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
            </ProductGrid>
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
