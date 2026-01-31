import { auth } from "@/auth";

export const dynamic = "force-dynamic";
import { TrainingSchedules } from "@/components/sections/TrainingSchedules";
import { TrainingPrices } from "@/components/sections/TrainingPrices";
import { TrainingVirtual } from "@/components/sections/TrainingVirtual";

export const metadata = {
    title: "Horarios y Entrenamiento | Kuma Dojo",
    description: "Consulta nuestros horarios de entrenamiento para niños, adultos y competidores.",
};

export default async function TrainingPage() {
    const session = await auth();

    return (
        <main className="min-h-screen relative overflow-hidden bg-zinc-950">
            {/* Fixed Parallax Background */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: "url('/images/fondoEntrenamiento.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "brightness(1.0)"
                }}
            >
                {/* Optional Texture Overlay */}
                <div className="absolute inset-0 bg-transparent" />
            </div>

            {/* MAIN CONTENT - EPIC VERTICAL STACK */}
            <div className="relative z-10 pt-24 pb-32 flex flex-col gap-24 md:gap-32 max-w-[1920px] mx-auto">

                {/* 1. HORARIOS (Full Width Epicness) */}
                <div className="w-full">
                    <TrainingSchedules />
                </div>

                {/* 2. PLANES (Full Grid) */}
                <div className="w-full">
                    <TrainingPrices user={session?.user} />
                </div>

                {/* 3. VIRTUAL (Grand Finale) */}
                <div className="w-full">
                    <TrainingVirtual user={session?.user} />
                </div>

            </div>
        </main>
    );
}
