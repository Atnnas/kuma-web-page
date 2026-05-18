import { auth } from "@/auth";

export const dynamic = "force-dynamic";
import { TrainingSchedules } from "@/components/sections/TrainingSchedules";
import { TrainingPrices } from "@/components/sections/TrainingPrices";
import { TrainingVirtual } from "@/components/sections/TrainingVirtual";

import { AnimatedTabs } from "@/components/ui/animated-tabs";


export const metadata = {
    title: "Training & Schedules | Kuma Dojo",
    description: "Check our training schedules for children, adults, and competitors.",
};

export default async function TrainingPage() {
    const session = await auth();

    const tabs = [
        {
            id: "schedules",
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


                <AnimatedTabs
                    tabs={tabs}
                    defaultTab="schedules"
                    className="w-full"
                    tabListClassName="mb-8"
                />
            </div>
        </main>
    );
}
