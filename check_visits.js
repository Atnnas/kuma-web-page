
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local because dotenv might not be set up for disconnected scripts
let mongoUri = '';
try {
    const envPath = path.resolve(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/MONGODB_URI=(.+)/);
        if (match && match[1]) {
            mongoUri = match[1].trim().replace(/["']/g, '');
        }
    }
} catch (e) {
    console.error("Error reading .env.local", e);
}

if (!mongoUri) {
    console.error("Could not find MONGODB_URI in .env.local");
    process.exit(1);
}

// Minimal Schema Definition for Visit
const VisitSchema = new mongoose.Schema({
    path: String,
    geo: {
        country: String,
        region: String,
        city: String,
        ip: String,
    },
    timestamp: Date,
});

const Visit = mongoose.models.Visit || mongoose.model('Visit', VisitSchema);

async function checkVisits() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(mongoUri);
        console.log("Connected.");

        // Get the last 5 visits
        const visits = await Visit.find().sort({ timestamp: -1 }).limit(5);

        console.log(`\nFound ${visits.length} recent visits:`);
        visits.forEach((v, i) => {
            console.log(`\n--- Visit #${i + 1} ---`);
            console.log(`Path: ${v.path}`);
            console.log(`Time: ${v.timestamp}`);
            console.log(`Geo Data:`, v.geo ? JSON.stringify(v.geo, null, 2) : "MISSING");
        });

        const total = await Visit.countDocuments();
        console.log(`\nTotal visits stored: ${total}`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkVisits();
