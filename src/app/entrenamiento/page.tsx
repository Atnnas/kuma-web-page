import { Training } from "@/components/sections/Training";

export const metadata = {
    title: "Programas de Entrenamiento | Kuma Dojo",
    description: "Descubre nuestros programas de entrenamiento: Karate Kids, Adultos, Defensa Personal y Competición.",
};

export default function TrainingPage() {
    return (
        <main className="min-h-screen pt-24 bg-zinc-950">
            <Training />
        </main>
    );
}
