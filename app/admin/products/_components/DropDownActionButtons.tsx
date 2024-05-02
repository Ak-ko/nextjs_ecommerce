"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { deleteProduct, toggleActiveStatus } from "../../_actions/products";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export const ActiveStatusToggleButton = ({
    id,
    isAvailableForPurchase,
}: {
    id: string;
    isAvailableForPurchase: boolean;
}) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    return (
        <DropdownMenuItem
            disabled={isPending}
            onClick={() => {
                startTransition(() => {
                    toggleActiveStatus(id, !isAvailableForPurchase);
                    router.refresh();
                });
            }}
        >
            {isAvailableForPurchase ? "Deactive" : "Active"}
        </DropdownMenuItem>
    );
};

export const DeleteButton = ({
    id,
    disabled,
}: {
    id: string;
    disabled?: boolean;
}) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    return (
        <DropdownMenuItem
            variant="destructive"
            disabled={isPending || disabled}
            onClick={() => {
                startTransition(() => {
                    deleteProduct(id);
                    router.refresh();
                });
            }}
        >
            Delete
        </DropdownMenuItem>
    );
};
