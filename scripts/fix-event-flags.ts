import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    process.exit(1);
}

const CountrySchema = new mongoose.Schema({ name: String, flag: String });
const Country = mongoose.models.Country || mongoose.model("Country", CountrySchema);

const EventSchema = new mongoose.Schema({
    location: {
        country: String,
        address: String,
        flag: String,
        mapLink: String,
        image: String
    }
}, { strict: false }); // strict false to allow other fields

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

async function fixFlags() {
    try {
        await mongoose.connect(MONGODB_URI!);
        console.log("Connected to DB");

        const events = await Event.find({});
        console.log(`Found ${events.length} events.`);

        for (const ev of events) {
            if (ev.location && ev.location.country) {
                // Find matching country (case insensitive)
                const country = await Country.findOne({
                    name: { $regex: new RegExp(`^${ev.location.country}$`, 'i') }
                });

                if (country && country.flag) {
                    // Update flag
                    console.log(`Updating ${ev.location.country} -> ${country.flag}`);
                    ev.location.flag = country.flag;
                    await Event.updateOne({ _id: ev._id }, { $set: { "location.flag": country.flag } });
                } else {
                    console.log(`Country not found/no flag: ${ev.location.country}. Trying partial match...`);
                    // Try partial match
                    const partial = await Country.findOne({
                        name: { $regex: new RegExp(ev.location.country, 'i') }
                    });
                    if (partial && partial.flag) {
                        console.log(`Partial match found: ${partial.name} -> ${partial.flag}`);
                        ev.location.flag = partial.flag;
                        await Event.updateOne({ _id: ev._id }, { $set: { "location.flag": partial.flag } });
                    }
                }
            }
        }

        console.log("Done updating event flags.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

fixFlags();
