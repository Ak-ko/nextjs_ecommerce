import db from "@/app/db/db";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import ProductSkeleton from "@/components/ProductSkeleton";
import { cache } from "@/lib/cache";
import { Suspense } from "react";

const getProducts = cache(() => {
    return db.product.findMany({
        where: {
            isAvailableForPurchase: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}, ["/products", "getProducts"]);

export default function CustomerProduct() {
    return (
        <ProductGrid>
            <Suspense
                fallback={
                    <>
                        <ProductSkeleton />
                        <ProductSkeleton />
                        <ProductSkeleton />
                        <ProductSkeleton />
                        <ProductSkeleton />
                        <ProductSkeleton />
                    </>
                }
            >
                <ProductSuspense />
            </Suspense>
        </ProductGrid>
    );
}

async function ProductSuspense() {
    const products = await getProducts();
    return products.map((product) => (
        <ProductCard key={product.id} {...product} />
    ));
}
