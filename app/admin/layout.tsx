import { Nav, NavLink } from "@/components/Nav";
import React from "react";

// don't cache everything ( force dynamic ), in admin route, it is oke.
export const dynamic = "force-dynamic";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Nav>
                <NavLink href="/admin">Dashboard</NavLink>
                <NavLink href="/admin/products">Products</NavLink>
                <NavLink href="/admin/users">Customers</NavLink>
                <NavLink href="/admin/orders">Orders</NavLink>
            </Nav>
            <main className="container my-6">{children}</main>
        </>
    );
}
