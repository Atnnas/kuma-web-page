import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ShieldAlert, Construction } from "lucide-react";

export default async function SettingsPage() {
    const session = await auth();

    // 1. Security Check: Must be logged in
    if (!session || !session.user) {
        redirect("/login");
    }

    // 2. Role Check: Must be super_admin
    // Assuming session.user.role is populated correctly (we saw auth.ts doing it)
    if (session.user.role !== "super_admin") {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
                <div className="bg-red-900/20 p-6 rounded-full border border-red-900/50">
                    <ShieldAlert className="w-16 h-16 text-red-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-black text-white mb-2">ACCESO DENEGADO</h1>
                    <p className="text-zinc-400 max-w-md mx-auto">
                        Esta sección es exclusiva para el <strong>Super Administrador</strong>.
                        Si crees que esto es un error, contacta al Sensei.
                    </p>
                </div>
            </div>
        );
    }

    // 3. Render Settings (Placeholder for now)
    return (
        <div className="space-y-8">
            <header className="border-b border-white/10 pb-6">
                <h1 className="text-3xl font-serif font-black text-kuma-gold uppercase tracking-widest drop-shadow-md">
                    Configuración del Sistema
                </h1>
                <p className="text-zinc-400 mt-2">
                    Administra las variables globales y permisos del Dojo.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {/* Construction Placeholder */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-4">
                    <Construction className="w-12 h-12 text-kuma-gold opacity-50" />
                    <h2 className="text-xl font-bold text-white">En Construcción</h2>
                    <p className="text-zinc-500 max-w-lg">
                        Próximamente podrás gestionar copias de seguridad, logs de auditoría
                        y configuraciones avanzadas desde aquí.
                    </p>
                </div>
            </div>
        </div>
    );
}
