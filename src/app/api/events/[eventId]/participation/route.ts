import { auth } from "@/auth";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const session = await auth();
        // Await the params object before accessing properties
        const { eventId } = await params;

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id || session.user.email;
        await connectDB();

        const event = await Event.findById(eventId).select("participants");

        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        const isParticipating = event.participants?.includes(userId) || false;

        return NextResponse.json({
            isParticipating,
            count: event.participants?.length || 0
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ eventId: string }> }
) {
    try {
        const session = await auth();
        // Await the params object before accessing properties
        const { eventId } = await params;

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id || session.user.email;
        const { participate } = await request.json();

        await connectDB();

        let updatedEvent;
        if (participate) {
            updatedEvent = await Event.findByIdAndUpdate(
                eventId,
                { $addToSet: { participants: userId } },
                { new: true }
            );
        } else {
            updatedEvent = await Event.findByIdAndUpdate(
                eventId,
                { $pull: { participants: userId } },
                { new: true }
            );
        }

        if (!updatedEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            isParticipating: updatedEvent.participants.includes(userId)
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
