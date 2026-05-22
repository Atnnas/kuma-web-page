"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import AttendanceLog from "@/models/AttendanceLog";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth-utils";

/**
 * Fetch all users that are enrolled as athletes
 */
export async function getEnrolledAthletes() {
    try {
        await connectDB();
        const athletes = await User.find({ "athleteProfile.isEnrolled": true }).sort({ "athleteProfile.beltRank": -1 }).lean();
        
        // Fetch and map MVP counts
        const mvpLogs = await AttendanceLog.find({ isMVP: true }).lean();
        const mvpCountsMap: Record<string, number> = {};
        for (const log of mvpLogs) {
            const uid = log.user.toString();
            mvpCountsMap[uid] = (mvpCountsMap[uid] || 0) + 1;
        }

        const serialized = JSON.parse(JSON.stringify(athletes)).map((user: any) => {
            if (user.athleteProfile) {
                user.athleteProfile.mvpCount = mvpCountsMap[user._id.toString()] || 0;
            }
            return {
                ...user,
                _id: user._id.toString(),
            };
        });

        return { success: true, data: serialized };
    } catch (error: any) {
        console.error("Error fetching athletes:", error);
        return { success: false, error: error?.message || String(error) };
    }
}

/**
 * Fetch all users to allow enrolling them
 */
export async function getAllPotentialAthletes() {
    try {
        await connectDB();
        const users = await User.find({}).sort({ name: 1 }).lean();
        return serializeAthletes(users);
    } catch (error) {
        console.error("Error fetching potential athletes:", error);
        return [];
    }
}

/**
 * Update or Create an athlete profile for a user
 */
export async function updateAthleteProfile(userId: string, profileData: any) {
    try {
        await requireSuperAdmin();
        await connectDB();

        const user = await User.findById(userId);
        const existingProfile = user?.athleteProfile ? JSON.parse(JSON.stringify(user.athleteProfile)) : {};

        // Ensure OVR is calculated if not provided
        if (profileData.stats && !profileData.stats.ovr) {
            const s = profileData.stats;
            profileData.stats.ovr = Math.round((s.vel + s.pot + s.tec + s.res + s.esp) / 5);
        }

        const { image, ...profileFields } = profileData;

        const updateFields: any = {
            athleteProfile: {
                ...existingProfile,
                ...profileFields,
                isEnrolled: profileData.isEnrolled !== undefined ? profileData.isEnrolled : true
            }
        };

        if (image !== undefined) {
            updateFields.image = image;
        }

        await User.findByIdAndUpdate(userId, updateFields);

        revalidatePath("/admin/athletes");
        revalidatePath("/training");
        return { success: true };
    } catch (error) {
        console.error("Error updating athlete profile:", error);
        return { success: false, error: "Error al actualizar el perfil del atleta" };
    }
}

/**
 * Create a new user and immediately enroll them as an athlete
 */
export async function createAndEnrollAthlete(userData: { name: string, email: string }) {
    try {
        await requireSuperAdmin();
        await connectDB();

        let email = userData.email?.trim().toLowerCase();
        if (!email) {
            const tempId = Math.random().toString(36).substring(2, 9);
            email = `pendiente_${tempId}@kumadojo.com`;
        }

        // Check if user already exists
        const exists = await User.findOne({ email });
        if (exists) {
            return { success: false, error: "Ya existe un usuario con este correo electrónico" };
        }

        const newUser = await User.create({
            ...userData,
            email: email,
            password: "temp_password_kuma", // Simple placeholder, user should reset
            isActive: true,
            athleteProfile: {
                isEnrolled: true,
                beltRank: "Blanco",
                stats: { vel: 50, pot: 50, tec: 50, res: 50, esp: 50, ovr: 50 }
            }
        }) as any;

        revalidatePath("/admin/athletes");
        return { success: true, userId: newUser._id.toString() };
    } catch (error) {
        console.error("Error creating and enrolling athlete:", error);
        return { success: false, error: "Error al crear el Kuma" };
    }
}

function serializeAthletes(users: any[]) {
    return JSON.parse(JSON.stringify(users)).map((user: any) => ({
        ...user,
        _id: user._id.toString(),
    }));
}

/**
 * Allow an enrolled athlete to self-update their card image after validating their registered email
 */
export async function updateAthletePhotoSelf(athleteId: string, email: string, image: string) {
    try {
        await connectDB();

        // 1. Fetch user to verify their status and email
        const user = await User.findById(athleteId);
        if (!user) {
            return { success: false, error: "El Kuma no existe" };
        }

        // 2. Strict verification: is enrolled as an athlete
        if (!user.athleteProfile?.isEnrolled) {
            return { success: false, error: "El Kuma no está inscrito como atleta" };
        }

        // 3. Strict verification: email match (case-insensitive)
        if (user.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
            return { success: false, error: "Verificación de correo fallida. El correo ingresado no coincide con el registrado." };
        }

        // 4. Update ONLY the image field! No stats, belt, or admin fields.
        await User.findByIdAndUpdate(athleteId, {
            $set: { image: image }
        });

        revalidatePath("/admin/athletes");
        revalidatePath("/training");
        return { success: true };
    } catch (error) {
        console.error("Error self-updating athlete photo:", error);
        return { success: false, error: "Error al actualizar la foto" };
    }
}
