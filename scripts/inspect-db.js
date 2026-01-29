const mongoose = require('mongoose');

// Need to read .env.local manually since this is a standalone script
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

async function inspect() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections found:");
        collections.forEach(c => console.log(" - " + c.name));

        const lowercaseCount = await mongoose.connection.db.collection('horarios').countDocuments();
        console.log(`Documents in 'horarios': ${lowercaseCount}`);

        const uppercaseCount = await mongoose.connection.db.collection('Horarios').countDocuments();
        console.log(`Documents in 'Horarios': ${uppercaseCount}`);

        mongoose.disconnect();
    } catch (e) {
        console.error("Error:", e);
    }
}

inspect();
