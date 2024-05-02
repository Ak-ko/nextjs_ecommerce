import db from "@/app/db/db";
import CheckoutForm from "./_components/CheckoutForm";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

async function getProduct(id: string) {
    return await db.product.findUnique({
        where: { id },
    });
}

export default async function Checkout({ params }: { params: { id: string } }) {
    const product = await getProduct(params.id);
    if (!product) return notFound();

    const paymentIntent = await stripe.paymentIntents.create({
        amount: product?.priceInCents,
        currency: process.env.STRIPE_CURRENCY as string,
        metadata: { productId: product.id },
    });

    if (!paymentIntent.client_secret) {
        throw Error("Stripe fail to create a payment intent");
    }

    return (
        <CheckoutForm
            product={product}
            clientSecret={paymentIntent.client_secret}
        />
    );
}
