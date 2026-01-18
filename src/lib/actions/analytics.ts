"use server";

import connectDB from "@/lib/db";
import Visit from "@/models/Visit";
import { revalidatePath } from "next/cache";

import { headers } from "next/headers";

export async function trackVisit(path: string, userAgent?: string) {
    try {
        await connectDB();

        // 1. Get IP Address
        const headersList = await headers();
        const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

        // 2. Resolve Location (IP-API free tier)
        // Skip localhost to avoid errors (or mock it)
        let geoData = {};
        if (ip !== "127.0.0.1" && ip !== "::1") {
            try {
                const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`);
                const data = await response.json();
                if (data.status === "success") {
                    geoData = {
                        country: data.country,
                        region: data.regionName,
                        city: data.city,
                        ip: ip // Optional: store IP or hash it for privacy
                    };
                }
            } catch (err) {
                console.error("Geo lookup failed:", err);
            }
        }

        await Visit.create({
            path,
            userAgent,
            geo: geoData,
            timestamp: new Date(),
        });
        // No need to revalidate path here, it's a silent log
        return { success: true };
    } catch (error) {
        console.error("Error tracking visit:", error);
        return { success: false };
    }
}

export async function getAnalyticsStats() {
    try {
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
        // We want an array like: [{ date: '2025-01-15', count: 12 }, ...]
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
            { $sort: { _id: 1 } } // Sort by date ascending
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
        await connectDB();

        const query: any = {};
        if (from && to) {
            // Set end date to end of day
            const endOfDay = new Date(to);
            endOfDay.setHours(23, 59, 59, 999);
            query.timestamp = { $gte: from, $lte: endOfDay };
        } else if (from) {
            query.timestamp = { $gte: from };
        }

        const visits = await Visit.find(query).sort({ timestamp: -1 }).lean();

        // Calculate simple stats based on the filtered data
        const uniqueVisitors = new Set(visits.map((v: any) => v.geo?.ip || v.visitorId)).size;

        return {
            success: true,
            data: JSON.parse(JSON.stringify(visits)), // Serialize for client
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
