import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { KumaRanking } from "@/components/sections/KumaRanking";
import { getWeeklyMVP } from "@/lib/actions/attendance";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Kuma Cards | Kuma Dojo",
    description: "Visualiza las tarjetas de honor y estadísticas de los Kumas inscritos.",
};

export default async function KumaCardsPage() {
  const session = await auth();
  const user = session?.user;

  // Development bypass for auth (already in place)
  if (!user && process.env.NODE_ENV !== "development") {
    redirect("/?error=unauthorized");
  }

  // Server‑side fetch of athletes
  let athletes: any[] | null = null;
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/athletes`, { cache: "no-store" });
    const json = await res.json();
    if (json && json.success !== false && Array.isArray(json.data)) {
      athletes = json.data;
    }
  } catch (e) {
    console.error("Failed to fetch athletes:", e);
  }

  // Fetch weekly MVP
  let weeklyMvp = null;
  try {
    weeklyMvp = await getWeeklyMVP();
  } catch (e) {
    console.error("Failed to fetch weekly MVP:", e);
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-zinc-950">
      {/* Fixed Parallax Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/images/fondoEntrenamiento.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.25)"
        }}
      >
        {/* Golden ambient gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 pt-28 pb-32 max-w-7xl mx-auto px-4">
        {/* Brand Header */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white font-serif">
            KUMA <span className="text-kuma-gold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]">CARDS</span>
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm font-black uppercase tracking-widest mt-4 max-w-lg mx-auto">
            Tarjetas de Honor Oficiales de los Atletas del Dojo
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-kuma-gold to-transparent mx-auto mt-4 rounded-full" />
        </div>



        {/* Kuma Ranking Component (Renders the Athlete Cards beautifully) */}
        <KumaRanking currentUser={user} initialAthletes={athletes || undefined} weeklyMvp={weeklyMvp || undefined} />
      </div>
    </main>
  );
}
