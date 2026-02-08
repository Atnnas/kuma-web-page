import { auth } from "@/auth";
import { getDetailedAnalytics } from "@/lib/actions/analytics";
import ReportsClient from "./ReportsClient";
import { subDays } from "date-fns";
import Link from "next/link";
import { CaretLeft, TrendUp } from "@phosphor-icons/react/dist/ssr";

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
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/reports" className="group p-3 bg-zinc-900 border border-white/5 rounded-xl hover:bg-white hover:text-black transition-all hover:scale-105 text-zinc-400">
                        <CaretLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" weight="bold" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-red-900/10 rounded-lg text-red-500">
                                <TrendUp className="w-6 h-6" weight="duotone" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
                                Reporte de <span className="text-red-500">Visitas</span>
                            </h1>
                        </div>
                        <p className="text-zinc-500 font-medium pl-14">
                            Análisis detallado de tráfico y audiencia.
                        </p>
                    </div>
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
