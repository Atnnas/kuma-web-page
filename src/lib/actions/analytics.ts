"use server";

import connectDB from "@/lib/db";
import Visit from "@/models/Visit";
import { revalidatePath } from "next/cache";

import { headers } from "next/headers";

import { requireSuperAdmin } from "@/lib/auth-utils";

export async function trackVisit(path: string, userAgent?: string) {
    try {
        await connectDB();

        // 1. Get IP Address
        const headersList = await headers();
        const rawIp = headersList.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

        // Anonymize IP (privacy best practice)
        const maskedIp = rawIp.includes(":") 
            ? rawIp.split(":").slice(0, 3).join(":") + "::xxx" 
            : rawIp.replace(/\.\d+$/, '.xxx');

        let geoData = {};
        if (rawIp !== "127.0.0.1" && rawIp !== "::1") {
            try {
                // IP lookup timeout to never block rendering
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 1500);

                const response = await fetch(`http://ip-api.com/json/${rawIp}?fields=status,country,regionName,city`, {
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                const data = await response.json();
                if (data.status === "success") {
                    geoData = {
                        country: data.country,
                        region: data.regionName,
                        city: data.city,
                        ip: maskedIp
                    };
                }
            } catch (err) {
                // Silent catch for geo lookup
            }
        }

        await Visit.create({
            path,
            userAgent,
            geo: geoData,
            timestamp: new Date(),
        });
        return { success: true };
    } catch (error) {
        console.error("Error tracking visit:", error);
        return { success: false };
    }
}

export async function getAnalyticsStats() {
    try {
        await requireSuperAdmin();
        await connectDB();

        // 1. Total Visits
        const totalVisits = await Visit.countDocuments();

        // 2. Visits Today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const visitsToday = await Visit.countDocuments({
            timestamp: { $gte: startOfToday }
        });

        // 3. Last 7 Days (Simple Aggregation)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const visitsLast7Days = await Visit.aggregate([
            { $match: { timestamp: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return {
            totalVisits,
            visitsToday,
            visitsLast7Days: visitsLast7Days.map(v => ({ date: v._id, count: v.count }))
        };

    } catch (error) {
        console.error("Error fetching analytics:", error);
        return {
            totalVisits: 0,
            visitsToday: 0,
            visitsLast7Days: []
        };
    }
}

export async function getDetailedAnalytics(from?: Date, to?: Date) {
    try {
        await requireSuperAdmin();
        await connectDB();

        const query: any = {};
        if (from && to) {
            const endOfDay = new Date(to);
            endOfDay.setHours(23, 59, 59, 999);
            query.timestamp = { $gte: from, $lte: endOfDay };
        } else if (from) {
            query.timestamp = { $gte: from };
        }

        const visits = await Visit.find(query).sort({ timestamp: -1 }).limit(500).lean();

        const uniqueVisitors = new Set(visits.map((v: any) => v.geo?.ip || v.visitorId)).size;

        const serializedVisits = visits.map((visit: any) => ({
            ...visit,
            _id: visit._id.toString(),
            timestamp: visit.timestamp ? new Date(visit.timestamp).toISOString() : undefined,
        }));

        return {
            success: true,
            data: serializedVisits,
            stats: {
                total: visits.length,
                unique: uniqueVisitors
            }
        };

    } catch (error) {
        console.error("Error fetching detailed analytics:", error);
        return { success: false, data: [], stats: { total: 0, unique: 0 } };
    }
}

export async function deleteAllVisits() {
    try {
        await requireSuperAdmin();
        await connectDB();
        await Visit.deleteMany({});
        revalidatePath("/admin/reports");
        revalidatePath("/admin/reports/visits");
        return { success: true };
    } catch (error) {
        console.error("Error deleting all visits:", error);
        return { success: false, error: "Failed to delete visits" };
    }
}
