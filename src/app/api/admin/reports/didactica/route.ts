import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import DidacticProgress from "@/models/DidacticProgress";
import { DIDACTIC_UNITS } from "@/data/didacticaData";
import { BELT_RANKS } from "@/data/beltRanks";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const session = await auth();
        const user = session?.user;

        // Security check: Only super_admin or admin
        if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
            return NextResponse.json(
                { success: false, error: "No autorizado. Se requiere rol administrativo." },
                { status: 403 }
            );
        }

        await connectDB();

        // 1. Fetch all users enrolled as athletes or registered users
        const athletes = await User.find({ "athleteProfile.isEnrolled": true })
            .select("name email image athleteProfile role createdAt")
            .populate("athleteProfile.dojo", "name logo")
            .sort({ "athleteProfile.stats.ovr": -1, name: 1 })
            .lean();

        // 2. Fetch all didactic progress records
        const allProgress = await DidacticProgress.find({}).lean();
        const progressMap = new Map<string, any>();
        for (const p of allProgress) {
            progressMap.set(p.userId.toString(), p);
        }

        // 3. Compute curriculum totals
        const tradUnits = DIDACTIC_UNITS.filter((u) => u.path === "tradicional");
        const allLevels = tradUnits.flatMap((u) => u.levels);
        const totalLevelsCount = allLevels.length;

        const now = Date.now();
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        // 4. Transform athletes with enriched didactic metrics
        const reportData = athletes.map((ath: any) => {
            const uid = ath._id.toString();
            const dp = progressMap.get(uid);

            const completedIds: string[] = dp?.completedLevelIds || [];
            const completedCount = completedIds.length;
            const progressPercent = totalLevelsCount > 0 ? Math.min(100, Math.round((completedCount / totalLevelsCount) * 100)) : 0;

            // Total stars earned
            let totalStars = 0;
            if (dp?.levelStars) {
                const starsMap = dp.levelStars instanceof Map ? Object.fromEntries(dp.levelStars) : dp.levelStars;
                totalStars = Object.values(starsMap).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
            }

            // Inactivity and Sensei mood
            let lastVisited = dp?.lastVisitedTimestamp || null;
            if (!lastVisited && dp?.lastActiveDate) {
                lastVisited = new Date(dp.lastActiveDate).getTime();
            }

            let daysInactive: number | null = null;
            let senseiMood: "happy" | "concerned" | "sad" | "crying" | "never" = "never";

            if (lastVisited) {
                daysInactive = Math.max(0, Math.floor((now - lastVisited) / ONE_DAY_MS));
                if (daysInactive <= 3) {
                    senseiMood = "happy";
                } else if (daysInactive <= 6) {
                    senseiMood = "concerned";
                } else if (daysInactive <= 13) {
                    senseiMood = "sad";
                } else {
                    senseiMood = "crying";
                }
            }

            // Current Belt being solved
            // Find the first unit that has at least one incomplete level
            let currentUnit = tradUnits.find((u) => u.levels.some((lvl) => !completedIds.includes(lvl.id)));
            if (!currentUnit && tradUnits.length > 0) {
                currentUnit = tradUnits[tradUnits.length - 1]; // Mastered all
            }
            const currentBeltRank = currentUnit?.beltId ? BELT_RANKS.find((b) => b.id === currentUnit.beltId) : null;

            return {
                id: uid,
                name: ath.name || "Atleta sin nombre",
                email: ath.email || "",
                image: ath.image || "",
                role: ath.role || "user",
                beltRank: ath.athleteProfile?.beltRank || "Blanco",
                specialization: ath.athleteProfile?.specialization || "Ambos",
                dojoName: ath.athleteProfile?.dojo?.name || "Kuma Dojo",
                ovr: Math.round(ath.athleteProfile?.stats?.ovr ?? 50),
                registeredAt: ath.createdAt,
                didactic: {
                    hasStarted: !!dp,
                    completedLevelsCount: completedCount,
                    totalLevelsCount,
                    progressPercent,
                    xp: dp?.xp || 0,
                    streak: dp?.streak || 0,
                    stars: totalStars,
                    lastVisitedTimestamp: lastVisited,
                    daysInactive,
                    senseiMood,
                    currentBeltId: currentBeltRank?.id || "kyu-10",
                    currentBeltName: currentBeltRank?.name || "10° Kyu — Cinturón Blanco",
                    currentBeltColor: currentBeltRank?.color || "#F8FAFC",
                    currentBeltShortName: currentBeltRank?.shortName || "10° Kyu",
                    activePath: dp?.activePath || "tradicional",
                },
            };
        });

        // 5. Dojo Overall Summary KPIs
        const totalEnrolled = reportData.length;
        const activeUsersCount = reportData.filter((r) => r.didactic.senseiMood === "happy").length;
        const warningUsersCount = reportData.filter((r) => r.didactic.senseiMood === "concerned" || r.didactic.senseiMood === "sad").length;
        const coldUsersCount = reportData.filter((r) => r.didactic.senseiMood === "crying").length;
        const neverStartedCount = reportData.filter((r) => r.didactic.senseiMood === "never").length;
        const totalXpEarned = reportData.reduce((acc, r) => acc + r.didactic.xp, 0);
        const totalLessonsCompleted = reportData.reduce((acc, r) => acc + r.didactic.completedLevelsCount, 0);
        const maxStreak = Math.max(0, ...reportData.map((r) => r.didactic.streak));

        return NextResponse.json({
            success: true,
            summary: {
                totalEnrolled,
                activeUsersCount,
                warningUsersCount,
                coldUsersCount,
                neverStartedCount,
                totalXpEarned,
                totalLessonsCompleted,
                maxStreak,
                totalCurriculumLevels: totalLevelsCount,
            },
            data: reportData,
        });
    } catch (error: any) {
        console.error("Error in /api/admin/reports/didactica:", error);
        return NextResponse.json(
            { success: false, error: error.message || String(error) },
            { status: 500 }
        );
    }
}
