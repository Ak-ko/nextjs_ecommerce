"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteOrder } from "../_actions/orders";

export const DeleteButton = ({ id }: { id: string }) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    return (
        <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onClick={() => {
                startTransition(() => {
                    deleteOrder(id);
                    router.refresh();
                });
            }}
        >
            Delete
        </DropdownMenuItem>
    );
};
