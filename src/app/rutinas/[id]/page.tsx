import { RoutinePlayer } from "@/components/rutinas/RoutinePlayer";
import connectDB from "@/lib/db";
import Routine from "@/models/Routine";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Force dynamic since we fetch data
export const dynamic = "force-dynamic";

export default async function RoutinePlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();
    const user = session?.user;

    // Redirigir si no está activo (Respaldo del middleware)
    // @ts-ignore
    if (!user || user.isActive === false) {
        redirect("/?error=inactive");
    }

    await connectDB();

    // Validate params
    if (!params) return notFound();

    const { id } = await params;
    let routine;

    try {
        const doc = await Routine.findById(id).lean();
        if (!doc) notFound();

        // Serialize ObjectId and Dates
        routine = {
            ...doc,
            _id: doc._id.toString(),
            createdAt: doc.createdAt?.toISOString(),
            updatedAt: doc.updatedAt?.toISOString(),
            blocks: doc.blocks?.map((block: any) => ({
                ...block,
                _id: block._id?.toString(),
            })) || [],
        };
    } catch (error) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-white selection:bg-kuma-gold/30 pb-32 relative overflow-hidden">
            {/* Global Background Depth */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black" />
                <div className="absolute inset-0 bg-[url('/images/noise.svg')] opacity-[0.03]" />
            </div>

            <RoutinePlayer routine={routine as any} />
        </main>
    );
}
