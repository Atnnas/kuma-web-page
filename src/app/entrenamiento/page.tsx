import { auth } from "@/auth";
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

            {/* Scrollable Content */}
            <div className="relative z-10 pt-20 pb-20 flex flex-col gap-6">
                <TrainingSchedules />
                <TrainingPrices user={session?.user} />
                <TrainingVirtual user={session?.user} />

                {/* Future Sections Placeholder */}
                {/* <TrainingMethodology /> */}
            </div>
        </main>
    );
}
