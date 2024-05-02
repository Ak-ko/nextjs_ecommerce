import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import PageHeader from "../_components/PageHeader";
import db from "@/app/db/db";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteButton } from "./_components/DropDownToggleButton";
import { MoreVertical } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export default function AdminCustomers() {
    return (
        <>
            <div className="flex justify-between items-center my-3">
                <PageHeader>Customers</PageHeader>
            </div>
            <CustomerTable />
        </>
    );
}

async function CustomerTable() {
    const orders = await db.order.findMany({
        select: {
            id: true,
            pricePaidInCents: true,
            product: true,
            user: true,
        },
    });
    if (!orders.length) return <div>No Orders</div>;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Price Paid</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders?.map((order) => (
                    <TableRow key={order?.id}>
                        <TableCell>{order?.product.name}</TableCell>
                        <TableCell>{order.user.email}</TableCell>
                        <TableCell>
                            {formatCurrency(
                                orders.reduce(
                                    (price, o) =>
                                        (price + o.pricePaidInCents) / 100,
                                    0
                                )
                            )}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical />
                                    <span className="sr-only">Actions</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DeleteButton id={order.id} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
