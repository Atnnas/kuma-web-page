"use server";

import connectDB from "@/lib/db";
import Country from "@/models/Country";
import { revalidatePath } from "next/cache";

export async function getCountries() {
    try {
        await connectDB();
        const countries = await Country.find({}).sort({ name: 1 }).lean();
        return countries.map((c: any) => ({
            id: c._id.toString(),
            name: c.name,
            flag: c.flag,
            code: c.code
        }));
    } catch (error) {
        console.error("Error fetching countries:", error);
        return [];
    }
}

export async function seedCountries() {
    try {
        await connectDB();

        // Check if we already have countries
        const count = await Country.countDocuments();
        if (count > 200) {
            return { success: true, message: `Ya existen ${count} países en la base de datos.` };
        }

        console.log("Fetching countries from API...");
        const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2,translations");
        if (!res.ok) throw new Error("Failed to fetch from RestCountries");

        const data = await res.json();

        const countriesToSave = data.map((c: any) => ({
            name: c.translations?.spa?.common || c.name.common,
            flag: c.flags?.png,
            code: c.cca2
        }));

        console.log(`Seeding ${countriesToSave.length} countries...`);

        // Bulk upsert
        const operations = countriesToSave.map((c: any) => ({
            updateOne: {
                filter: { name: c.name },
                update: { $set: c },
                upsert: true
            }
        }));

        await Country.bulkWrite(operations);

        revalidatePath("/");
        return { success: true, message: `Se han sembrado/actualizado ${countriesToSave.length} países correctamente.` };
    } catch (error) {
        console.error("Seed countries failed:", error);
        return { success: false, error: "Error al sembrar países." };
    }
}
