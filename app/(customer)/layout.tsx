import { Nav, NavLink } from "@/components/Nav";
import React from "react";

// don't cache everything ( force dynamic ), in admin route, it is oke.
export const dynamic = "force-dynamic";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Nav>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/products">Products</NavLink>
                <NavLink href="/orders">My Orders</NavLink>
            </Nav>
            <main className="container my-6">{children}</main>
        </>
    );
}
