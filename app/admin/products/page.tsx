import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PageHeader from "../_components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import db from "@/app/db/db";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    ActiveStatusToggleButton,
    DeleteButton,
} from "./_components/DropDownActionButtons";

export default function AdminProducts() {
    return (
        <>
            <div className="flex justify-between items-center my-3">
                <PageHeader>Products</PageHeader>
                <Button asChild>
                    <Link href="/admin/products/new">Add Product</Link>
                </Button>
            </div>
            <ProductTable />
        </>
    );
}

async function ProductTable() {
    const products = await db.product.findMany({
        select: {
            id: true,
            name: true,
            priceInCents: true,
            isAvailableForPurchase: true,
            _count: {
                select: {
                    order: true,
                },
            },
        },
        orderBy: { name: "asc" },
    });
    if (!products.length) return <div>No Products</div>;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-0">
                        <span className="sr-only">Available to purchase</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {products?.map((product) => (
                    <TableRow key={product?.id}>
                        <TableCell>
                            {product.isAvailableForPurchase ? (
                                <>
                                    <CheckCircle2 />
                                    <span className="sr-only">
                                        Available to purchase
                                    </span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="stroke-destructive" />
                                    <span className="sr-only">
                                        Unavailable to purchase
                                    </span>
                                </>
                            )}
                        </TableCell>
                        <TableCell>{product?.name}</TableCell>
                        <TableCell>
                            {formatCurrency(+product?.priceInCents / 100)}
                        </TableCell>
                        <TableCell>
                            {formatNumber(product?._count?.order + "")}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical />
                                    <span className="sr-only">Actions</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <a
                                            download
                                            href={`/admin/products/${product.id}/download`}
                                        >
                                            Download
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                        >
                                            Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <ActiveStatusToggleButton
                                        id={product.id}
                                        isAvailableForPurchase={
                                            product.isAvailableForPurchase
                                        }
                                    />
                                    <DropdownMenuSeparator />
                                    <DeleteButton
                                        id={product.id}
                                        disabled={+product._count.order > 0}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
