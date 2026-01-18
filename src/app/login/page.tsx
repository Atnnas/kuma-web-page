"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authenticate } from "@/lib/actions";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { CheckCircle2 } from "lucide-react";

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full" size="lg" loading={pending}>
            Entrar al Dojo
        </Button>
    );
}

export default function LoginPage() {
    const [state, dispatch] = useActionState(authenticate, undefined);
    const router = useRouter();

    useEffect(() => {
        if (state?.success) {
            const timer = setTimeout(() => {
                router.push("/");
            }, 1500); // Esperar 1.5s para mostrar el mensaje
            return () => clearTimeout(timer);
        }
    }, [state?.success, router]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black z-0" />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-zinc-950/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-2xl z-10"
            >
                {/* Success Overlay */}
                <AnimatePresence>
                    {state?.success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-50 bg-zinc-950/90 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="bg-green-500/20 p-4 rounded-full mb-4"
                            >
                                <CheckCircle2 className="w-16 h-16 text-green-500" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-2">¡Nos alegra verte!</h2>
                            <p className="text-zinc-400">Entrando al Dojo...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex flex-col items-center mb-6">
                    <Image
                        src="/images/kuma-logo.jpg"
                        alt="Kuma Logo"
                        width={60}
                        height={60}
                        className="mb-4"
                    />
                    <h1 className="text-2xl sm:text-3xl font-serif font-black text-kuma-gold uppercase tracking-widest mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center">Bienvenido de nuevo</h1>
                    <p className="text-zinc-400 text-sm text-center">Ingresa tus credenciales para continuar</p>
                </div>

                <form action={dispatch} className="space-y-4">
                    <Input label="Email" name="email" type="email" placeholder="sensei@dojo.com" required />
                    <Input label="Password" name="password" type="password" placeholder="••••••••" required />

                    {state?.message && !state.success && (
                        <div className="p-3 bg-red-900/30 border border-red-800 rounded-md text-red-200 text-sm animate-in slide-in-from-top-2">
                            🚨 {state.message}
                        </div>
                    )}

                    <LoginButton />
                </form>

                <div className="mt-6 pt-6 border-t border-zinc-800 text-center text-sm text-zinc-500 space-y-4">
                    <SocialButtons />
                    <div>
                        ¿No tienes cuenta?
                        <Link href="/register" className="text-red-500 hover:text-red-400 font-medium ml-1">
                            Regístrate gratis
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
