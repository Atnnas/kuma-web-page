import { NextResponse } from "next/server";
import { getEnrolledAthletes } from "@/lib/actions/athletes";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const res = await getEnrolledAthletes();
        if (!res.success) {
            return NextResponse.json({ success: false, error: res.error }, { status: 500 });
        }
        return NextResponse.json(res);
    } catch (error: any) {
        console.error("Error in /api/athletes GET:", error);
        return NextResponse.json(
            { success: false, error: error.message || String(error) },
            { status: 500 }
        );
    }
}

