import { ReactNode } from "react";

export default function PageHeader({ children }: { children: ReactNode }) {
    return <h1 className="text-3xl my-3">{children}</h1>;
}
