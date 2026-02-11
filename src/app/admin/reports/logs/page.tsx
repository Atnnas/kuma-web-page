import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import RoutineLog from "@/models/RoutineLog";
import User from "@/models/User"; // Ensure User model is registered
import Routine from "@/models/Routine"; // Ensure Routine model is registered
import { redirect } from "next/navigation";
import Link from "next/link";
// import { ArrowLeft, Calendar, User as UserIcon, Clock, CheckCircle, XCircle, Timer } from "lucide-react"; // REPLACED
import {
    ArrowLeft,
    CalendarBlank,
    User as UserIcon,
    Clock,
    CheckCircle,
    Timer,
    TrendUp,
    CaretLeft
} from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import LogsClient from "./LogsClient";

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic";

export default async function RoutineLogsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth();
    if (!session?.user || session.user.role !== "super_admin") {
        redirect("/admin");
    }

    const { userId, from, to } = await searchParams;

    await dbConnect();

    // Build Query
    const query: any = {};

    if (userId) {
        query.user = userId as string;
    }

    if (from || to) {
        query.startTime = {};
        if (from) {
            // Ensure we parse the date string correctly (local YYYY-MM-DD to start of day UTC or keep local)
            // Simple approach: YYYY-MM-DDT00:00:00
            query.startTime.$gte = new Date(`${from}T00:00:00`);
        }
        if (to) {
            // End of the day for 'to' date
            query.startTime.$lte = new Date(`${to}T23:59:59`);
        }
    }

    // Fetch logs, populated with user name
    const logs = await RoutineLog.find(query)
        .populate("user", "name email image")
        .sort({ startTime: -1 }) // Sort by startTime descending
        .limit(200) // Increase limit for filtered results
        .lean();

    // Fetch all users for the filter dropdown
    const users = await User.find({ role: { $ne: "admin" } }) // Optionally filter out admins or show all
        .select("name email image")
        .sort({ name: 1 })
        .lean();

    // Serialize for Client Component (ObjectId to string if needed, mostly handled by simple JSON or .toString())
    // Mongoose .lean() returns POJOs but ObjectIds might need .toString() if passed to client 
    // tailored for Next.js serialization warnings.
    const serializedLogs = logs.map(log => ({
        ...log,
        _id: log._id.toString(),
        user: log.user ? { ...log.user, _id: log.user._id.toString() } : null,
        routine: log.routine ? log.routine.toString() : null, // If populated or not
    }));

    const serializedUsers = users.map(user => ({
        ...user,
        _id: user._id.toString(),
    }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-screen pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/reports" className="group p-3 bg-zinc-900 border border-white/5 rounded-xl hover:bg-white hover:text-black transition-all hover:scale-105 text-zinc-400">
                        <CaretLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" weight="bold" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-kuma-gold/10 rounded-lg text-kuma-gold">
                                <Clock className="w-6 h-6" weight="duotone" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
                                Registro de <span className="text-kuma-gold">Ejecuciones</span>
                            </h1>
                        </div>
                        <p className="text-zinc-500 font-medium pl-14">
                            Auditoría de rendimiento y tiempos reales.
                        </p>
                    </div>
                </div>

                <div className="px-4 py-2 bg-zinc-900 rounded-lg border border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    {logs.length} Registros Encontrados
                </div>
            </div>

            {/* Client Component with Filters and Table */}
            <LogsClient initialLogs={serializedLogs} users={serializedUsers} />
        </div>
    );
}
