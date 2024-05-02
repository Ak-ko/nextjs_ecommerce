import db from "@/app/db/db";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

const resend = new Resend(process.env.RESEND_API_KEY as string);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export const POST = async (req: NextRequest) => {
    const event = await stripe.webhooks.constructEvent(
        await req.text(),
        req.headers.get("stripe-signature") as string,
        process.env.STRIPE_WEBHOOK_KEY as string
    );
    if (event.type === "charge.succeeded") {
        const charge = event.data.object;
        const productId = charge.metadata.productId;
        const email = charge.billing_details.email;
        const pricePaidInCents = charge.amount;

        console.log("Product_id", productId);

        const product = await db.product.findUnique({
            where: {
                id: productId,
            },
        });

        console.log("product", product);

        if (!product || !email) {
            return new NextResponse("Bad request", {
                status: 400,
            });
        }

        const userFields = {
            email,
            order: {
                create: {
                    productId,
                    pricePaidInCents,
                },
            },
        };

        const {
            order: [order],
        } = await db.user.upsert({
            where: {
                email,
            },
            create: userFields,
            update: userFields,
            select: {
                order: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1,
                },
            },
        });

        const downloadVerfication = await db.downloadVerification.create({
            data: {
                productId,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
            },
        });

        console.log("Email Before Sending", email);
        console.log("Admin Email", process.env.ADMIN_EMAIL);

        await resend.emails.send({
            from: `Support <${process.env.ADMIN_EMAIL}>`,
            to: email,
            subject: "Order Confirmation",
            react: <h1>You have succes in payment</h1>,
        });
        console.log("Email Sent");
    }
    return new NextResponse();
};
