import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
}

// Minimal Schema
const CountrySchema = new mongoose.Schema({
    name: String,
    flag: String,
    code: String
});
const Country = mongoose.models.Country || mongoose.model("Country", CountrySchema);

async function checkAndSeed() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to DB");

        const count = await Country.countDocuments();
        console.log(`Current Country Count: ${count}`);

        if (count < 200) {
            console.log("Seeding countries...");
            const res = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,cca2,translations");
            const data = await res.json();

            const countriesToSave = data.map((c: any) => ({
                name: c.translations?.spa?.common || c.name.common,
                flag: c.flags?.png,
                code: c.cca2
            }));

            const operations = countriesToSave.map((c: any) => ({
                updateOne: {
                    filter: { name: c.name },
                    update: { $set: c },
                    upsert: true
                }
            }));

            await Country.bulkWrite(operations);
            console.log(`Seeded ${countriesToSave.length} countries.`);
        } else {
            console.log("Countries already seeded.");
        }

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkAndSeed();
