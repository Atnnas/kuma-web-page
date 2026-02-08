import { auth } from "@/auth";
import { RutinasClientPage } from "@/components/rutinas/RutinasClientPage";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Rutinas | Kuma Dojo",
    description: "Entrenamiento complementario y rutinas especializadas para Karate.",
};

export default async function RutinasPage() {
    const session = await auth();

    return (
        <RutinasClientPage user={session?.user} />
    );
}
