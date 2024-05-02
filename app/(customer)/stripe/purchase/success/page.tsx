import db from "@/app/db/db";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function Success({
    searchParams,
}: {
    searchParams: {
        redirect_status: string;
        payment_intent: string;
    };
}) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
        searchParams.payment_intent
    );
    if (!paymentIntent.metadata.productId) return notFound();
    const product = await db.product.findFirst({
        where: {
            id: paymentIntent.metadata.productId,
        },
    });

    const isSucceeded = paymentIntent.status;

    if (!product) return notFound();
    return (
        <div>
            <h1 className="text-3xl font-bold my-5">
                {searchParams.redirect_status === "succeeded"
                    ? "Success"
                    : "Fail"}
            </h1>

            <div className="flex gap-5 items-center">
                <Image
                    src={product.imagePath}
                    width={400}
                    height={400}
                    alt="image"
                    className="object-cover"
                />
                <div>
                    <div className="mb-2">
                        <span className="text-xl text-secondary-foreground">
                            {formatCurrency(product.priceInCents / 100)}
                        </span>
                        <h1 className="font-semibold text-lg">
                            {product.name}
                        </h1>
                    </div>
                    <p className="leading-[2] text-secondary-foreground">
                        {product.description}
                    </p>
                </div>
            </div>
            <Button asChild size={"lg"} className="mt-5">
                {isSucceeded === "succeeded" ? (
                    <a
                        href={`/products/download/${await createVerficiation(
                            product.id
                        )}`}
                    >
                        Download
                    </a>
                ) : (
                    <Link href={`/products/${product.id}/purchase`}>
                        Try Again
                    </Link>
                )}
            </Button>
        </div>
    );
}

async function createVerficiation(productId: string) {
    return (
        await db.downloadVerification.create({
            data: {
                productId,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
        })
    ).id;
}

function aDay() {
    return 1000 * 60 * 60 * 24;
}
