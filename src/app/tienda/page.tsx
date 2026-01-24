import { Shop } from "@/components/sections/Shop";

export const metadata = {
    title: "Kuma Store | Equipamiento Oficial",
    description: "Adquiere el equipamiento oficial del Kuma Dojo: Karategis, protecciones y mercancía exclusiva.",
};

export default function ShopPage() {
    return (
        <main className="min-h-screen pt-24 bg-zinc-950">
            <Shop />
        </main>
    );
}
