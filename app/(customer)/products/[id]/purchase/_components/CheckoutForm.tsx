"use client";

import { checkOrderExists } from "../../../_actions/order";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { Product } from "@prisma/client";
import {
    Elements,
    LinkAuthenticationElement,
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
    product: Product;
    clientSecret: string;
};

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function CheckoutForm({
    product,
    clientSecret,
}: CheckoutFormProps) {
    return (
        <Elements
            options={{
                clientSecret,
            }}
            stripe={stripePromise}
        >
            <Form product={product} />
        </Elements>
    );
}

function Form({ product }: { product: Product }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");

    const onPurchase = async (e: FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !email) return;
        setIsLoading(true);
        const orderExists = await checkOrderExists(email, product.id);
        if (orderExists) {
            setIsLoading(false);
            setError(
                "You have purchased this item. Check it and download the payment information"
            );
            return;
        }
        stripe
            .confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase/success`,
                },
            })
            .then(({ error }) => {
                if (
                    error.type === "card_error" ||
                    error.type === "validation_error"
                ) {
                    setError(error.message as string);
                } else {
                    setError("Unknown error occured");
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <form className="max-w-5xl mx-auto" onSubmit={onPurchase}>
            <Card>
                <CardHeader>
                    <CardTitle>Checkout</CardTitle>
                    {error && (
                        <CardDescription className="text-destructive">
                            {error}
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <PaymentElement />
                    <div className="mt-4">
                        <LinkAuthenticationElement
                            onChange={(e) => setEmail(e.value.email)}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Purchasing..."
                            : `Purchase - ${formatCurrency(
                                  product.priceInCents / 100
                              )}`}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
