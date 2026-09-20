import { NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import DidacticProgress from "@/models/DidacticProgress";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ authenticated: false, progress: null });
        }

        await connectDB();

        let userId = session.user.id;
        if (!userId && session.user.email) {
            const user = await User.findOne({ email: session.user.email });
            if (user) userId = user._id.toString();
        }

        if (!userId) {
            return NextResponse.json({ authenticated: false, progress: null });
        }

        let doc = await DidacticProgress.findOne({ userId });
        const today = new Date().toISOString().split("T")[0];

        if (!doc) {
            // Initialize progress for this user
            doc = await DidacticProgress.create({
                userId,
                completedLevelIds: [],
                levelStars: {},
                xp: 0,
                streak: 1,
                lastActiveDate: today,
                hearts: 5,
                lastHeartRefill: Date.now(),
                activePath: "tradicional",
            });
        } else {
            // Update daily streak and hearts if needed
            let hasChanged = false;
            if (doc.lastActiveDate !== today) {
                doc.lastActiveDate = today;
                doc.streak = (doc.streak || 0) + 1;
                hasChanged = true;
            }
            if (doc.hearts < 5) {
                doc.hearts = 5;
                hasChanged = true;
            }
            if (hasChanged) {
                await doc.save();
            }
        }

        const starsObj =
            doc.levelStars instanceof Map
                ? Object.fromEntries(doc.levelStars)
                : doc.levelStars || {};

        const practicedObj =
            doc.levelLastPracticed instanceof Map
                ? Object.fromEntries(doc.levelLastPracticed)
                : doc.levelLastPracticed || {};

        return NextResponse.json({
            authenticated: true,
            user: {
                name: session.user.name,
                email: session.user.email,
            },
            progress: {
                completedLevelIds: doc.completedLevelIds || [],
                levelStars: starsObj,
                xp: doc.xp || 0,
                streak: doc.streak || 1,
                lastActiveDate: doc.lastActiveDate || today,
                hearts: doc.hearts ?? 5,
                lastHeartRefill: doc.lastHeartRefill || Date.now(),
                activePath: doc.activePath || "tradicional",
                lastVisitedTimestamp: doc.lastVisitedTimestamp || Date.now(),
                levelLastPracticed: practicedObj,
            },
        });
    } catch (error) {
        console.error("Error fetching didactic progress:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        let userId = session.user.id;
        if (!userId && session.user.email) {
            const user = await User.findOne({ email: session.user.email });
            if (user) userId = user._id.toString();
        }

        if (!userId) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const body = await req.json();
        const { completedLevelIds, levelStars, xp, streak, hearts, activePath, lastVisitedTimestamp, levelLastPracticed } = body;

        const updateData: Record<string, any> = {
            userId,
            lastActiveDate: new Date().toISOString().split("T")[0],
        };

        if (Array.isArray(completedLevelIds)) updateData.completedLevelIds = completedLevelIds;
        if (levelStars && typeof levelStars === "object") updateData.levelStars = levelStars;
        if (typeof xp === "number") updateData.xp = xp;
        if (typeof streak === "number") updateData.streak = streak;
        if (typeof hearts === "number") updateData.hearts = hearts;
        if (activePath === "tradicional" || activePath === "wkf") updateData.activePath = activePath;
        if (typeof lastVisitedTimestamp === "number") updateData.lastVisitedTimestamp = lastVisitedTimestamp;
        if (levelLastPracticed && typeof levelLastPracticed === "object") updateData.levelLastPracticed = levelLastPracticed;

        const doc = await DidacticProgress.findOneAndUpdate(
            { userId },
            { $set: updateData },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const starsObj =
            doc.levelStars instanceof Map
                ? Object.fromEntries(doc.levelStars)
                : doc.levelStars || {};

        const practicedObj =
            doc.levelLastPracticed instanceof Map
                ? Object.fromEntries(doc.levelLastPracticed)
                : doc.levelLastPracticed || {};

        return NextResponse.json({
            success: true,
            progress: {
                completedLevelIds: doc.completedLevelIds || [],
                levelStars: starsObj,
                xp: doc.xp || 0,
                streak: doc.streak || 1,
                lastActiveDate: doc.lastActiveDate,
                hearts: doc.hearts,
                lastHeartRefill: doc.lastHeartRefill,
                activePath: doc.activePath,
                lastVisitedTimestamp: doc.lastVisitedTimestamp || Date.now(),
                levelLastPracticed: practicedObj,
            },
        });
    } catch (error) {
        console.error("Error saving didactic progress:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
