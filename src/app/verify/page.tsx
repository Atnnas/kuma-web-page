import Link from "next/link";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import { CheckCircle2, XCircle } from "lucide-react";

interface VerifyPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function VerifyPage({ searchParams }: VerifyPageProps) {
    const params = await searchParams;
    const token = params.token as string;

    if (!token) {
        return <ErrorState message="Token no proporcionado." />;
    }

    try {
        await connectDB();

        // Buscar en la colección TEMPORAL
        const pendingUser = await PendingUser.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() },
        });

        if (!pendingUser) {
            return <ErrorState message="Token inválido, expirado o el usuario ya fue verificado." />;
        }

        // Crear el usuario REAL en la colección permanente
        const newUser = await User.create({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.passwordHash, // Ya estaba hasheada
            role: "user",
            emailVerified: new Date(),
        });

        // Borrar de la colección temporal
        await PendingUser.deleteOne({ _id: pendingUser._id });

        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center glass">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-900/20 p-4 rounded-full">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-2">¡Cuenta Activada!</h1>
                    <p className="text-zinc-400 mb-6">
                        Bienvenido <span className="text-white font-medium">{newUser.name}</span>.
                        Tu cuenta ha sido creada exitosamente.
                    </p>

                    <Link
                        href="/login"
                        className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition-colors"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </div>
        );

    } catch (error) {
        console.error("Verification Error:", error);
        return <ErrorState message="Ocurrió un error al verificar el token." />;
    }
}

function ErrorState({ message }: { message: string }) {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center glass">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-900/20 p-4 rounded-full">
                        <XCircle className="w-12 h-12 text-red-500" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2">Error de Verificación</h1>
                <p className="text-zinc-400 mb-6">{message}</p>

                <Link
                    href="/register"
                    className="block w-full bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-md transition-colors"
                >
                    Volver al Registro
                </Link>
            </div>
        </div>
    );
}
