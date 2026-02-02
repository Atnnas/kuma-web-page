import { section } from "framer-motion/client";

export const metadata = {
    title: "Recursos | Kuma Dojo",
    description: "Recursos y material de apoyo para estudiantes de Kuma Dojo.",
};

export default function ResourcesPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden pt-32 pb-20">
            {/* Background Texture */}
            <div className="fixed inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: "url('/images/texture-noise.png')", // Fallback texture if available
                }}
            />

            <div className="relative z-10 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
                        Recursos <span className="text-kuma-gold">Kuma</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Material didáctico, guías técnicas y herramientas para potenciar tu camino en el Karate Do.
                    </p>
                </div>

                {/* Content Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Placeholder Cards */}
                    <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-kuma-gold/30 transition-all group">
                        <div className="h-12 w-12 bg-kuma-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-kuma-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold uppercase mb-2 text-white">Didáctica</h3>
                        <p className="text-zinc-500 text-sm mb-6">Guías y metodología de enseñanza.</p>
                        <a href="/recursos/didactica" className="inline-block text-xs font-bold uppercase tracking-widest text-kuma-gold hover:text-white transition-colors">
                            Ver Material &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
