"use server";

import connectDB from "@/lib/db";
import User from "@/models/User";
import Dojo from "@/models/Dojo";
import AttendanceLog from "@/models/AttendanceLog";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin, getCurrentUser } from "@/lib/auth-utils";
import { evaluateWkfCategory } from "@/lib/wkf-categories";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

/**
 * Fetch all users that are enrolled as athletes
 */
export async function getEnrolledAthletes() {
    try {
        await connectDB();
        const currentUser = await getCurrentUser();
        const isAdmin = currentUser?.role === "super_admin" || currentUser?.role === "admin";

        const athletes = await User.find({ "athleteProfile.isEnrolled": true })
            .sort({ "athleteProfile.beltRank": -1 })
            .populate("athleteProfile.dojo")
            .lean();
        
        // Fetch and map MVP counts
        const mvpLogs = await AttendanceLog.find({ isMVP: true }).lean();
        const mvpCountsMap: Record<string, number> = {};
        for (const log of mvpLogs) {
            const uid = log.user.toString();
            mvpCountsMap[uid] = (mvpCountsMap[uid] || 0) + 1;
        }

        const serialized = athletes.map((user: any) => serializeAthlete(user, mvpCountsMap, isAdmin));

        return { success: true, data: serialized };
    } catch (error: any) {
        console.error("Error fetching athletes:", error);
        return { success: false, error: error?.message || String(error) };
    }
}

/**
 * Fetch all users to allow enrolling them (optimized field projection)
 */
export async function getAllPotentialAthletes() {
    try {
        await requireSuperAdmin();
        await connectDB();
        const users = await User.find({})
            .select("name email image role athleteProfile dojo createdAt")
            .sort({ name: 1 })
            .populate("athleteProfile.dojo")
            .lean();
        return serializeAthletes(users, true);
    } catch (error) {
        console.error("Error fetching potential athletes:", error);
        return [];
    }
}

/**
 * Update or Create an athlete profile for a user with strict field sanitization
 */
export async function updateAthleteProfile(userId: string, profileData: any) {
    try {
        await requireSuperAdmin();

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return { success: false, error: "Identificador de usuario no válido" };
        }

        await connectDB();

        const user = await User.findById(userId);
        if (!user) {
            return { success: false, error: "Usuario no encontrado" };
        }

        const userObj = user.toObject();
        const existingProfile: any = userObj?.athleteProfile || {};

        // Sanitize and whitelist profile inputs to prevent prototype pollution or unauthorized field modifications
        const rawStats = profileData.stats || existingProfile.stats || {};
        const vel = Math.min(99, Math.max(1, Number(rawStats.vel) || 50));
        const pot = Math.min(99, Math.max(1, Number(rawStats.pot) || 50));
        const tec = Math.min(99, Math.max(1, Number(rawStats.tec) || 50));
        const res = Math.min(99, Math.max(1, Number(rawStats.res) || 50));
        const esp = Math.min(99, Math.max(1, Number(rawStats.esp) || 50));
        const ovr = Math.round((vel + pot + tec + res + esp) / 5);

        const sanitizedStats = { vel, pot, tec, res, esp, ovr };

        // Sanitize specialization enum
        const allowedSpecs = ["Kata", "Kumite", "Ambos"];
        const specialization = allowedSpecs.includes(profileData.specialization) 
            ? profileData.specialization 
            : (existingProfile.specialization || "Ambos");

        // Validate Dojo ObjectId if provided
        let dojoId = profileData.dojo || existingProfile.dojo || "6a10ba00936f06f14847fd05";
        if (typeof dojoId === "object" && dojoId?._id) {
            dojoId = dojoId._id.toString();
        }
        if (!mongoose.isValidObjectId(dojoId)) {
            dojoId = "6a10ba00936f06f14847fd05";
        }

        // Validate image if provided (limit max 2.5MB payload & avoid dangerous schemes)
        let imageToSave: string | undefined = undefined;
        if (profileData.image !== undefined) {
            if (typeof profileData.image === "string") {
                const trimmed = profileData.image.trim();
                if (trimmed.length > 2.5 * 1024 * 1024) {
                    return { success: false, error: "La imagen excede el límite de 2.5MB. Por favor sube una imagen optimizada." };
                }
                if (trimmed.startsWith("javascript:") || trimmed.includes("<script>")) {
                    return { success: false, error: "Formato de imagen no permitido" };
                }
                imageToSave = trimmed;
            } else if (profileData.image === null || profileData.image === "") {
                imageToSave = "";
            }
        }

        const weight = profileData.weight !== undefined 
            ? Math.min(250, Math.max(15, Number(profileData.weight) || 70)) 
            : existingProfile.weight;

        const height = profileData.height !== undefined 
            ? Math.min(250, Math.max(50, Number(profileData.height) || 170)) 
            : existingProfile.height;

        const beltRank = typeof profileData.beltRank === "string" 
            ? profileData.beltRank.slice(0, 50).trim() 
            : existingProfile.beltRank || "Blanco";

        const cc = typeof profileData.cc === "string" 
            ? profileData.cc.slice(0, 60).trim() 
            : existingProfile.cc || "";

        const habilidadSecreta = typeof profileData.habilidadSecreta === "string" 
            ? profileData.habilidadSecreta.slice(0, 80).trim() 
            : existingProfile.habilidadSecreta || "";

        const wkfCategory = typeof profileData.wkfCategory === "string" 
            ? profileData.wkfCategory.slice(0, 60).trim() 
            : existingProfile.wkfCategory || "";

        let categoryWeight = profileData.categoryWeight !== undefined 
            ? Number(profileData.categoryWeight) 
            : existingProfile.categoryWeight;

        let weightReviewNeeded = profileData.weightReviewNeeded !== undefined 
            ? Boolean(profileData.weightReviewNeeded) 
            : Boolean(existingProfile.weightReviewNeeded);

        // If category is assigned or changed, sync baseline weight and clear review flag
        if (wkfCategory && wkfCategory !== existingProfile.wkfCategory) {
            categoryWeight = weight ?? existingProfile.weight;
            weightReviewNeeded = false;
        }

        const isEnrolled = profileData.isEnrolled !== undefined 
            ? Boolean(profileData.isEnrolled) 
            : true;

        const phone = typeof profileData.phone === "string" 
            ? profileData.phone.slice(0, 30).trim() 
            : existingProfile.phone || "";

        const emergencyContact = {
            name: typeof profileData.emergencyContact?.name === "string" 
                ? profileData.emergencyContact.name.slice(0, 60).trim() 
                : existingProfile.emergencyContact?.name || "",
            phone: typeof profileData.emergencyContact?.phone === "string" 
                ? profileData.emergencyContact.phone.slice(0, 30).trim() 
                : existingProfile.emergencyContact?.phone || ""
        };

        const medicalConditions = typeof profileData.medicalConditions === "string" 
            ? profileData.medicalConditions.slice(0, 500).trim() 
            : existingProfile.medicalConditions || "";

        const gender = ["Masculino", "Femenino"].includes(profileData.gender) 
            ? profileData.gender 
            : existingProfile.gender;

        const birthDate = profileData.birthDate ? new Date(profileData.birthDate) : existingProfile.birthDate;

        const updateFields: any = {
            athleteProfile: {
                ...existingProfile,
                weight,
                height,
                beltRank,
                specialization,
                stats: sanitizedStats,
                isEnrolled,
                cc,
                habilidadSecreta,
                dojo: dojoId,
                gender,
                birthDate,
                wkfCategory,
                categoryWeight,
                weightReviewNeeded,
                phone,
                emergencyContact,
                medicalConditions
            }
        };

        if (imageToSave !== undefined) {
            updateFields.image = imageToSave;
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
 * Create a new user and immediately enroll them as an athlete (safe hashed temporary password)
 */
export async function createAndEnrollAthlete(userData: { name: string, email: string }) {
    try {
        await requireSuperAdmin();
        await connectDB();

        if (!userData.name || !userData.name.trim()) {
            return { success: false, error: "Por favor proporciona un nombre para el Kuma" };
        }

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

        // Security: Hash the temporary password so no plaintext is stored in the database
        const randomTempSecret = `kuma_${crypto.randomUUID()}`;
        const hashedPassword = await bcrypt.hash(randomTempSecret, 12);

        const newUser = await User.create({
            name: userData.name.trim(),
            email: email,
            password: hashedPassword,
            isActive: true,
            athleteProfile: {
                isEnrolled: true,
                beltRank: "Blanco",
                dojo: "6a10ba00936f06f14847fd05",
                specialization: "Ambos",
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

function serializeAthlete(user: any, mvpCountsMap?: Record<string, number>, isAdmin: boolean = false) {
    if (!user) return null;
    
    const serializedUser = {
        _id: user._id.toString(),
        name: user.name,
        image: user.image,
        role: user.role,
        email: isAdmin ? user.email : undefined,
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
        updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : undefined,
        dojo: user.dojo ? user.dojo.toString() : null,
        favoriteRoutines: user.favoriteRoutines?.map((id: any) => id.toString()) || [],
        lastWorkoutDate: user.lastWorkoutDate ? new Date(user.lastWorkoutDate).toISOString() : undefined,
        lastStreakShownDate: user.lastStreakShownDate ? new Date(user.lastStreakShownDate).toISOString() : undefined,
        lastStreakLossShownDate: user.lastStreakLossShownDate ? new Date(user.lastStreakLossShownDate).toISOString() : undefined,
        lastTrainingResetDate: user.lastTrainingResetDate ? new Date(user.lastTrainingResetDate).toISOString() : undefined,
        emailVerified: isAdmin && user.emailVerified ? new Date(user.emailVerified).toISOString() : undefined,
        achievements: user.achievements?.map((ach: any) => ({
            ...ach,
            _id: ach._id ? ach._id.toString() : undefined,
            earnedAt: ach.earnedAt ? new Date(ach.earnedAt).toISOString() : undefined,
        })),
        athleteProfile: undefined as any
    };

    if (user.athleteProfile) {
        const dojoPopulated = user.athleteProfile.dojo;
        const bdate = user.athleteProfile.birthDate ? new Date(user.athleteProfile.birthDate).toISOString() : undefined;

        // Dynamic WKF Category evaluation
        const wkfEvaluation = evaluateWkfCategory({
            birthDate: bdate,
            currentWeight: user.athleteProfile.weight,
            gender: user.athleteProfile.gender,
            assignedCategory: user.athleteProfile.wkfCategory,
            assignedWeight: user.athleteProfile.categoryWeight,
            forceWeightReview: user.athleteProfile.weightReviewNeeded
        });

        serializedUser.athleteProfile = {
            weight: user.athleteProfile.weight,
            height: user.athleteProfile.height,
            beltRank: user.athleteProfile.beltRank,
            specialization: user.athleteProfile.specialization,
            stats: user.athleteProfile.stats,
            isEnrolled: user.athleteProfile.isEnrolled,
            cc: user.athleteProfile.cc,
            habilidadSecreta: user.athleteProfile.habilidadSecreta,
            statsLastMonth: user.athleteProfile.statsLastMonth,
            birthDate: bdate,
            gender: user.athleteProfile.gender,
            wkfCategory: user.athleteProfile.wkfCategory,
            categoryWeight: user.athleteProfile.categoryWeight,
            weightReviewNeeded: user.athleteProfile.weightReviewNeeded,
            wkfEvaluation,
            // SENSITIVE PII: Only include if admin
            phone: isAdmin ? user.athleteProfile.phone : undefined,
            emergencyContact: isAdmin ? user.athleteProfile.emergencyContact : undefined,
            medicalConditions: isAdmin ? user.athleteProfile.medicalConditions : undefined,
            dojo: dojoPopulated ? (
                typeof dojoPopulated === "object" && "_id" in dojoPopulated
                    ? {
                        _id: dojoPopulated._id.toString(),
                        name: dojoPopulated.name,
                        logo: dojoPopulated.logo,
                        createdAt: dojoPopulated.createdAt ? new Date(dojoPopulated.createdAt).toISOString() : undefined,
                        updatedAt: dojoPopulated.updatedAt ? new Date(dojoPopulated.updatedAt).toISOString() : undefined,
                      }
                    : dojoPopulated.toString()
            ) : null,
            mvpCount: mvpCountsMap ? (mvpCountsMap[serializedUser._id] || 0) : undefined,
        };
    }

    return serializedUser;
}

function serializeAthletes(users: any[], isAdmin: boolean = false) {
    return users.map((user: any) => serializeAthlete(user, undefined, isAdmin));
}

/**
 * Allow an enrolled athlete to self-update their card image after validating their registered email
 */
export async function updateAthletePhotoSelf(athleteId: string, email: string, image: string) {
    try {
        if (!athleteId || !mongoose.isValidObjectId(athleteId)) {
            return { success: false, error: "Identificador de atleta inválido" };
        }

        if (!image || typeof image !== "string") {
            return { success: false, error: "Fotografía requerida" };
        }

        const trimmedImage = image.trim();
        if (trimmedImage.length > 2.5 * 1024 * 1024) {
            return { success: false, error: "La imagen excede el límite máximo de 2.5MB" };
        }

        if (trimmedImage.startsWith("javascript:") || trimmedImage.includes("<script>")) {
            return { success: false, error: "Formato de imagen no permitido" };
        }

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
        if (!user.email || user.email.toLowerCase().trim() !== email.toLowerCase().trim()) {
            return { success: false, error: "Verificación de correo fallida. El correo ingresado no coincide con el registrado." };
        }

        // 4. Update ONLY the image field! No stats, belt, or admin fields.
        await User.findByIdAndUpdate(athleteId, {
            $set: { image: trimmedImage }
        });

        revalidatePath("/admin/athletes");
        revalidatePath("/training");
        return { success: true };
    } catch (error) {
        console.error("Error self-updating athlete photo:", error);
        return { success: false, error: "Error al actualizar la foto" };
    }
}
