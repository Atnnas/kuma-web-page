"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SocialButtons } from "@/components/auth/SocialButtons";
import TurnstileWidget from "@/components/auth/Turnstile";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setLoading(false);
            return;
        }

        // Validación de Complejidad de Contraseña
        // Requisitos: 6 letras, 2 números, 1 mayúscula
        const password = formData.password;
        const numberCount = (password.match(/\d/g) || []).length;
        const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
        const hasUpperCase = /[A-Z]/.test(password);

        if (letterCount < 6) {
            setError(`La contraseña debe tener al menos 6 letras (tienes ${letterCount}).`);
            setLoading(false);
            return;
        }
        if (numberCount < 2) {
            setError(`La contraseña debe tener al menos 2 números (tienes ${numberCount}).`);
            setLoading(false);
            return;
        }
        if (!hasUpperCase) {
            setError("La contraseña debe tener al menos una letra mayúscula.");
            setLoading(false);
            return;
        }

        if (!captchaToken) {
            setError("Por favor completa el captcha de seguridad.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    captchaToken
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Error al registrarse");
            }

            // Éxito: Redirigir a una página que diga "Revisa tu correo"
            router.push("/verify/sent?email=" + encodeURIComponent(formData.email));

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Ocurrió un error desconocido");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex text-white relative overflow-hidden">
            {/* Dynamic Background Effect (Aceternity Style Placeholder) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black z-0 pointer-events-none" />

            {/* Left Interface */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 z-10 glass"
            >
                <div className="mb-6 lg:mb-8">
                    {/* Logo Usage - Dynamic Path */}
                    <Image
                        src="/images/kuma-logo.jpg" // Assumes user followed instructions
                        alt="Kuma Logo"
                        width={80}
                        height={80}
                        className="mb-6 lg:mb-8 hover:scale-110 transition-transform duration-300 mx-auto lg:mx-0 w-16 h-16 lg:w-20 lg:h-20"
                    />
                    <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-widest mb-2 text-kuma-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-center lg:text-left">
                        Únete al <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] whitespace-nowrap">Dojo Digital</span>
                    </h1>
                    <p className="text-zinc-400 text-center lg:text-left text-sm sm:text-base">
                        Crea tu cuenta para acceder a eventos exclusivos y contenido premium.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Nombre Completo"
                        placeholder="Sensei Jhon Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                    <Input
                        label="Correo Electrónico"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <Input
                        label="Contraseña"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <p className="text-xs text-zinc-500 -mt-4 mb-2">
                        Requisitos: 6+ letras, 2+ números, 1 mayúscula.
                    </p>
                    <Input
                        label="Confirmar Contraseña"
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />

                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-800 rounded-md text-red-200 text-sm">
                            🚨 {error}
                        </div>
                    )}

                    <TurnstileWidget onVerify={setCaptchaToken} />

                    <Button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700"
                        size="lg"
                        loading={loading}
                    >
                        Crear Cuenta
                    </Button>

                </form>

                <div className="space-y-4 mt-6">
                    <SocialButtons />
                    <div className="text-center text-sm text-zinc-500">
                        ¿Ya tienes cuenta?
                        <Link href="/login" className="text-white hover:underline ml-2">
                            Inicia Sesión
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* Right Visual (Desktop Only) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="hidden lg:block w-1/2 relative grayscale hover:grayscale-0 transition-all duration-1000"
            >
                <Image
                    src="/images/kuma-logo.jpg" // Placeholder until user adds a real hero image
                    alt="Martial Arts Background"
                    fill
                    className="object-cover opacity-50"
                />
                <div className="absolute bottom-12 left-12">
                    <h2 className="text-2xl font-bold">"El verdadero karate es interior."</h2>
                    <p className="text-zinc-500">- Maestro Funakoshi</p>
                </div>
            </motion.div>
        </div>
    );
}
