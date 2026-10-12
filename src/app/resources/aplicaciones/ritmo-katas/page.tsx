"use client";
import React from "react";
import { RitmoKatas } from "@/components/sections/RitmoKatas";
import { useRouter } from "next/navigation";

export default function RitmoKatasPage() {
    const router = useRouter();

    const handleBack = () => {
        router.push("/resources/aplicaciones");
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden pt-16 sm:pt-20 pb-16">
            <RitmoKatas onBack={handleBack} />
        </main>
    );
}
