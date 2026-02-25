import { StoreClientView } from "@/components/store/StoreClientView";
import { getProducts } from "@/lib/actions/products";
import { Navbar } from "@/components/layout/Navbar";

export const dynamic = "force-dynamic";

export default async function StorePage() {
    const products = await getProducts("active");

    return (
        <main className="min-h-screen bg-zinc-950 text-white pb-32">
            {/* HERO SECTION */}
            <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-zinc-900">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-900/10 blur-[100px] rounded-full" />
                </div>

                <div className="relative z-10 text-center px-4">
                    <span className="block text-xs md:text-sm font-bold tracking-[0.5em] text-kuma-gold uppercase mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Equipamiento Oficial
                    </span>
                    <h1 className="text-5xl md:text-8xl font-serif font-black uppercase tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        <span className="text-kuma-gold">KUMA</span>{" "}
                        <span className="text-red-600 drop-shadow-[0_0_25px_rgba(220,38,38,0.6)]">STORE</span>
                    </h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto opacity-80" />
                </div>
            </div>

            {/* CATALOG SECTION */}
            <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
                <StoreClientView initialProducts={products} />
            </div>
        </main>
    );
}
