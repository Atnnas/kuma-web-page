"use server";

import connectDB from "@/lib/db";
import News, { INews } from "@/models/News";
import { feedItems } from "@/lib/mock-data";
import { requireSuperAdmin } from "@/lib/auth-utils";

// Helper to parse Spanish date string "12 Ene, 2025" to Date object
const parseSpanishDate = (dateStr: string): Date => {
    const months: { [key: string]: number } = {
        Ene: 0, Feb: 1, Mar: 2, Abr: 3, May: 4, Jun: 5,
        Jul: 6, Ago: 7, Sep: 8, Oct: 9, Nov: 10, Dic: 11
    };

    const parts = dateStr.replace(',', '').split(' ');
    if (parts.length < 3) return new Date();

    const day = parseInt(parts[0]);
    const monthStr = parts[1];
    const year = parseInt(parts[2]);

    const month = months[monthStr] || 0;

    return new Date(year, month, day);
};

export async function getNews() {
    try {
        await connectDB();
        // Sort by date descending
        const news = await News.find({}).sort({ date: -1 }).lean();

        // Convert _id to string and date to string if needed, or return as is and handle in UI
        // We'll return it serialized simple types
        return news.map((item: any) => ({
            ...item,
            id: item._id.toString(),
            _id: item._id.toString(),
            // We can return the date as ISO string or original format?
            // Let's return ISO for better handling, UI component should format it
            date: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching news:", error);
        return [];
    }
}

export async function getNewsBySlug(slug: string) {
    try {
        await connectDB();
        const item = await News.findOne({ slug }).lean();

        if (!item) return null;

        return {
            ...item,
            id: item._id.toString(),
            _id: item._id.toString(),
            date: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        };
    } catch (error) {
        console.error("Error fetching news by slug:", error);
        return null;
    }
}

export async function seedNews() {
    try {
        await connectDB();

        const count = await News.countDocuments();
        if (count > 0) {
            console.log("News already seeded");
            return { success: true, message: "Already seeded" };
        }


        const newsDocs = feedItems.map(item => ({
            title: item.title,
            description: item.description,
            image: item.image,
            category: item.category,
            isPremium: item.isPremium,
            date: parseSpanishDate(item.date),
            slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        }));

        await News.insertMany(newsDocs);
        console.log("News seeded successfully");
        return { success: true, message: "Seeded successfully" };
    } catch (error) {
        console.error("Error seeding news:", error);
        return { success: false, error: "Failed to seed" };
    }
}

export async function createNewsItem(data: Partial<INews>) {
    try {
        await requireSuperAdmin();
        await connectDB();

        // Simple validation
        if (!data.title || !data.description || !data.category) {
            return { success: false, error: "Missing required fields" };
        }

        const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

        const newItem = await News.create({
            ...data,
            slug,
            date: data.date || new Date(),
        });

        // Convert to simple object to avoid serializing issues if needed, but for server actions usually fine to return simple status
        // revalidatePath('/noticias') // If we were using revalidatePath, importing { revalidatePath } from 'next/cache'

        return { success: true, id: newItem._id.toString() };
    } catch (error) {
        console.error("Error creating news:", error);
        return { success: false, error: "Failed to create news item" };
    }
}

export async function updateNewsItem(id: string, data: Partial<INews>) {
    try {
        await requireSuperAdmin();
        await connectDB();

        await News.findByIdAndUpdate(id, data, { new: true });

        return { success: true };
    } catch (error) {
        console.error("Error updating news:", error);
        return { success: false, error: "Failed to update news item" };
    }
}

export async function deleteNewsItem(id: string) {
    try {
        await requireSuperAdmin();
        await connectDB();

        await News.findByIdAndDelete(id);

        return { success: true };
    } catch (error) {
        console.error("Error deleting news:", error);
        return { success: false, error: "Failed to delete news item" };
    }
}

export async function getEvents() {
    try {
        await connectDB();
        console.warn("getEvents: this function fetches all events with images. Consider using getUpcomingEvents or getPastEvents for better performance.");
        console.log("getEvents: querying News for category 'event'");
        // Sort by date ascending (upcoming first)
        const events = await News.find({ category: "event" }).sort({ date: 1 }).lean();

        return events.map((item: any) => ({
            ...item,
            id: item._id.toString(),
            _id: item._id.toString(),
            date: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

export async function getUpcomingEvents() {
    try {
        await connectDB();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        console.log("getUpcomingEvents: querying News for category 'event' >= " + now.toISOString());
        // Sort by date ascending
        const events = await News.find({
            category: "event",
            date: { $gte: now }
        }).sort({ date: 1 }).lean();

        return events.map((item: any) => ({
            ...item,
            id: item._id.toString(),
            _id: item._id.toString(),
            date: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        return [];
    }
}

export async function getPastEvents() {
    try {
        await connectDB();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        console.log("getPastEvents: querying News for category 'event' < " + now.toISOString());
        // Sort by date descending (most recent past first)
        // Exclude image field to reduce size
        const events = await News.find({
            category: "event",
            date: { $lt: now }
        })
            .select("-image")
            .sort({ date: -1 })
            .lean();

        return events.map((item: any) => ({
            ...item,
            id: item._id.toString(),
            _id: item._id.toString(),
            date: item.date ? new Date(item.date).toISOString() : new Date().toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching past events:", error);
        return [];
    }
}
