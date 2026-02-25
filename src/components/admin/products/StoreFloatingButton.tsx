"use client";

import { AdminFloatingButton } from "@/components/admin/AdminFloatingButton";
import { useRouter } from "next/navigation";

export function StoreFloatingButton() {
    const router = useRouter();

    return (
        <AdminFloatingButton
            onClick={() => router.push("/admin/shop/new")}
            label="Nuevo Producto"
        />
    );
}
