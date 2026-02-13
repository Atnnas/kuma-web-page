import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RutinasClientPage } from "@/components/rutinas/RutinasClientPage";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Rutinas | Kuma Dojo",
    description: "Entrenamiento complementario y rutinas especializadas para Karate.",
};

export default async function RutinasPage() {
    const session = await auth();
    const user = session?.user;

    // Redirigir si no está activo (Respaldo del middleware)
    // @ts-ignore
    if (!user || user.isActive === false) {
        redirect("/?error=inactive");
    }

    return (
        <RutinasClientPage user={user} />
    );
}
