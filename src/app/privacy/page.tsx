import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-white uppercase tracking-wider">
                        Política de <span className="text-red-600">Privacidad</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        En Kuma Dojo valoramos la transparencia. Aquí explicamos cómo protegemos tus datos y cómo funciona nuestra plataforma.
                    </p>
                </div>

                {/* Last Update */}
                <div className="text-center">
                    <span className="bg-zinc-900 text-zinc-500 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border border-zinc-800">
                        Última actualización: Febrero 2026
                    </span>
                </div>

                <div className="grid gap-8">
                    {/* Section 1 */}
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-900/20 rounded-lg text-red-500">
                                <Database className="w-6 h-6" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white">1. Datos que Recopilamos</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Solo almacenamos la información estrictamente necesaria para el funcionamiento de la escuela:
                                </p>
                                <ul className="list-disc list-inside text-zinc-400 space-y-2 marker:text-red-600">
                                    <li><strong className="text-zinc-300">Registro:</strong> Nombre y correo electrónico para autenticación.</li>
                                    <li><strong className="text-zinc-300">Seguridad:</strong> Hash de contraseña (nunca se guarda el texto original) y logs de acceso.</li>
                                    <li><strong className="text-zinc-300">Navegación:</strong> Dirección IP anónima para estadísticas de visita y prevención de ataques.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-900/20 rounded-lg text-blue-500">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white">2. Uso de Cookies</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    No utilizamos cookies publicitarias ni vendemos tus datos. Nuestras cookies son "técnicas" y esenciales:
                                </p>
                                <ul className="list-disc list-inside text-zinc-400 space-y-2 marker:text-blue-600">
                                    <li><strong className="text-zinc-300">Sesión:</strong> Para mantener tu cuenta abierta de forma segura.</li>
                                    <li><strong className="text-zinc-300">Seguridad:</strong> Cloudflare Turnstile (para evitar bots).</li>
                                    <li><strong className="text-zinc-300">Preferencias:</strong> Recordar si ya leíste este aviso.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-900/20 rounded-lg text-amber-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white">3. Terceros y Seguridad</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Tus datos están protegidos en nuestra base de datos (MongoDB) y utilizamos proveedores de confianza:
                                </p>
                                <ul className="list-disc list-inside text-zinc-400 space-y-2 marker:text-amber-600">
                                    <li><strong className="text-zinc-300">Cloudflare:</strong> Para protección contra ataques DDoS y bots.</li>
                                    <li><strong className="text-zinc-300">Resend:</strong> Para envío seguro de correos transaccionales.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="text-center pt-10 border-t border-zinc-900">
                    <p className="text-zinc-500 text-sm">
                        ¿Tienes dudas? Contáctanos directamente en el Dojo o vía email.
                    </p>
                </div>
            </div>
        </div>
    );
}
