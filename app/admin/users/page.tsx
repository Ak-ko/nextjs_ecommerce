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
    DropdownMenuItem,
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
    const users = await db.user.findMany({
        select: {
            id: true,
            email: true,
            order: true,
        },
    });
    if (!users.length) return <div>No Users</div>;
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Orders</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-0">
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users?.map((user) => (
                    <TableRow key={user?.id}>
                        <TableCell>{user?.email}</TableCell>
                        <TableCell>{user.order.length}</TableCell>
                        <TableCell>
                            {formatCurrency(
                                user.order.reduce(
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
                                    <DeleteButton id={user.id} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
