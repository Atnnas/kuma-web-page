import { auth } from "@/auth";

export const dynamic = "force-dynamic";
import { TrainingSchedules } from "@/components/sections/TrainingSchedules";
import { TrainingPrices } from "@/components/sections/TrainingPrices";
import { TrainingVirtual } from "@/components/sections/TrainingVirtual";

import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { StreakLeaderboard } from "@/components/gamification/StreakLeaderboard";

export const metadata = {
    title: "Horarios y Entrenamiento | Kuma Dojo",
    description: "Consulta nuestros horarios de entrenamiento para niños, adultos y competidores.",
};

export default async function TrainingPage() {
    const session = await auth();

    const tabs = [
        {
            id: "horarios",
            label: "Horarios",
            content: <TrainingSchedules />
        },
        {
            id: "planes",
            label: "Planes Mensuales",
            content: <TrainingPrices user={session?.user} />
        },
        {
            id: "virtual",
            label: "Dojo Virtual",
            content: <TrainingVirtual user={session?.user} />
        }
    ];

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

            {/* MAIN CONTENT - ANIMATED TABS */}
            <div className="relative z-10 pt-24 pb-32 max-w-[1920px] mx-auto">
                {/* GLOBAL LEADERBOARD - Shown only to logged-in users */}
                {session?.user && (
                    <div className="mb-8 px-4">
                        <StreakLeaderboard />
                    </div>
                )}

                <AnimatedTabs
                    tabs={tabs}
                    defaultTab="horarios"
                    className="w-full"
                    tabListClassName="mb-8"
                />
            </div>
        </main>
    );
}
