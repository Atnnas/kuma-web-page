import { PhilosophyDetailed } from "@/components/sections/PhilosophyDetailed";

export const metadata = {
    title: "Filosofía | Kuma Dojo",
    description: "Nuestra esencia, valores y el camino del oso.",
};

export default function PhilosophyPage() {
    return (
        <main className="min-h-screen">
            <PhilosophyDetailed />
        </main>
    );
}
