import { auth } from "@/auth";
import { getDetailedAnalytics } from "@/lib/actions/analytics";
import ReportsClient from "./ReportsClient";
import { subDays } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth();
    const resolvedSearchParams = await searchParams; // Await searchParams as per Next.js 15+ recommendation/requirement
    const from = resolvedSearchParams.from as string | undefined;
    const to = resolvedSearchParams.to as string | undefined;

    // Default to last 30 days if no params
    const startDate = from ? new Date(from) : subDays(new Date(), 30);
    const endDate = to ? new Date(to) : new Date();

    const { data: visits, stats } = await getDetailedAnalytics(startDate, endDate);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/reports" className="p-3 hover:bg-zinc-800 rounded-xl transition-all hover:scale-105 text-zinc-400 hover:text-white group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div>
                    <h1 className="text-3xl font-serif font-black uppercase tracking-widest text-kuma-gold drop-shadow-md">
                        Reporte de <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]">Visitas</span>
                    </h1>
                    <p className="text-zinc-400 font-medium">Análisis detallado de tráfico web.</p>
                </div>
            </div>

            <ReportsClient
                initialData={visits}
                initialStats={stats}
                from={from || startDate.toISOString()} // Pass string implementations to client
                to={to || endDate.toISOString()}
            />
        </div>
    );
}
