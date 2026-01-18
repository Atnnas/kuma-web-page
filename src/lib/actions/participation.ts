"use server";

import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { revalidatePath } from "next/cache";

export async function toggleParticipation(eventId: string, shouldParticipate: boolean) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return { success: false, error: "Must be logged in" };
        }

        /* 
           Using email as ID if user ID is not stable, but typically session.user.id is best.
           Standard NextAuth session usually has .user with properties.
           If using MongoDB adapter, `id` should be present.
           Let's assume session.user.id exists from the auth config.
        */
        const userId = session.user.id || session.user.email;

        await connectDB();

        if (shouldParticipate) {
            await Event.findByIdAndUpdate(eventId, {
                $addToSet: { participants: userId }
            });
        } else {
            await Event.findByIdAndUpdate(eventId, {
                $pull: { participants: userId }
            });
        }

        revalidatePath("/calendario");
        return { success: true };
    } catch (error) {
        console.error("Error toggling participation:", error);
        return { success: false, error: "Failed to update participation" };
    }
}
