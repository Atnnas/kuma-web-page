const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("No MONGODB_URI found. Make sure .env.local exists.");
    process.exit(1);
}

async function cleanup() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const collection = mongoose.connection.db.collection('routinelogs');

        // Define "zombie" as incomplete logs created more than 2 hours ago that don't have expiresAt
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        const filter = {
            completed: false,
            expiresAt: { $exists: false },
            createdAt: { $lt: twoHoursAgo }
        };

        const count = await collection.countDocuments(filter);
        console.log(`Found ${count} zombie logs to cleanup.`);

        if (count > 0) {
            const result = await collection.deleteMany(filter);
            console.log(`Successfully deleted ${result.deletedCount} logs.`);
        } else {
            console.log("No zombies found matching criteria.");
        }

        mongoose.disconnect();
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

cleanup();
