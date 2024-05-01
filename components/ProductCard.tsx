import Link from "next/link";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Product } from "@prisma/client";
import Image from "next/image";
import { formatCurrency } from "@/lib/format";

type ProductCardProps = Product;

export default function ProductCard({
    id,
    name,
    priceInCents,
    description,
    imagePath,
}: ProductCardProps) {
    return (
        <Card className="flex flex-col overflow-hidden">
            <div className="relative w-full h-auto aspect-video">
                <Image src={imagePath} fill alt={name} />
            </div>
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription>
                    {formatCurrency(priceInCents / 100)}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="line-clamp-4">{description}</p>
            </CardContent>
            <CardFooter>
                <Button asChild size="lg" className="w-full">
                    <Link href={`/products/${id}/purchase`}>Purchase</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
