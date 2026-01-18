"use server";

import connectDB from "@/lib/db";
import Event, { IEvent } from "@/models/Event";
import { requireSuperAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";
import { searchCountryFlag } from "@/lib/flags";

export async function syncEventFlags() {
    try {
        await connectDB();
        const events = await Event.find({});
        let count = 0;

        for (const ev of events) {
            const currentCountry = ev.location.country;
            if (!currentCountry) continue;

            // Fetch new flag from API
            const newFlag = await searchCountryFlag(currentCountry);

            // Force Update check
            if (newFlag && ev.location.flag !== newFlag) {
                console.log(`Updating flag for ${currentCountry}: ${newFlag}`);
                ev.location.flag = newFlag;
                await ev.save();
                count++;

                // Be nice to the API (though static map is fast)
                await new Promise(r => setTimeout(r, 50));
            }
        }

        revalidatePath("/admin/events");
        revalidatePath("/");

        return { success: true, message: `Se actualizaron ${count} eventos con sus banderas (vía Internet).` };
    } catch (error) {
        console.error("Flag sync failed:", error);
        return { success: false, error: "Error al sincronizar banderas" };
    }
}

export async function getPublicEvents() {
    try {
        await connectDB();
        const events = await Event.find({}).sort({ startDate: 1 }).lean();
        return events.map((event: any) => ({
            ...event,
            _id: event._id.toString(),
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching public events:", error);
        return [];
    }
}

export async function getUpcomingEvents() {
    try {
        await connectDB();
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const events = await Event.find({ startDate: { $gte: now } })
            .sort({ startDate: 1 })
            .lean();

        return events.map((event: any) => ({
            ...event,
            _id: event._id.toString(),
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
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

        const events = await Event.find({ startDate: { $lt: now } })
            .sort({ startDate: -1 })
            .lean();

        return events.map((event: any) => ({
            ...event,
            _id: event._id.toString(),
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString(),
        }));
    } catch (error) {
        console.error("Error fetching past events:", error);
        return [];
    }
}

export async function createEvent(data: Partial<IEvent>) {
    try {
        await requireSuperAdmin();
        await connectDB();

        const newEvent = await Event.create(data);
        revalidatePath("/calendario");
        revalidatePath("/admin/events");
        return { success: true, id: newEvent._id.toString() };
    } catch (error) {
        console.error("Error creating event:", error);
        return { success: false, error: "Failed to create event" };
    }
}

export async function updateEvent(id: string, data: Partial<IEvent>) {
    try {
        await requireSuperAdmin();
        await connectDB();
        await Event.findByIdAndUpdate(id, data);
        revalidatePath("/calendario");
        revalidatePath("/admin/events");
        return { success: true };
    } catch (error) {
        console.error("Error updating event:", error);
        return { success: false, error: "Failed to update event" };
    }
}

export async function deleteEvent(id: string) {
    try {
        await requireSuperAdmin();
        await connectDB();
        await Event.findByIdAndDelete(id);
        revalidatePath("/calendario");
        revalidatePath("/admin/events");
        return { success: true };
    } catch (error) {
        console.error("Error deleting event:", error);
        return { success: false, error: "Failed to delete event" };
    }
}
