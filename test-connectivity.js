const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load env manullay since we are running with node directly
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

// Remove query params to avoid "option cannot be specified" errors with some drivers
const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI.split('?')[0] : null;

console.log("Testing connection to:", uri ? uri.replace(/:([^:@]+)@/, ':****@') : "UNDEFINED");

if (!uri) {
    console.error("MONGODB_URI not found in .env.local");
    process.exit(1);
}

async function testConnection() {
    try {
        console.log("Attempting to connect...");
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000,
            family: 4
        });
        console.log("SUCCESS: Connected to MongoDB!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("CONNECTION FAILED:");
        console.error(error);

        if (error.reason && error.reason.servers) {
            console.log("Server details:", JSON.stringify(error.reason, null, 2));
        }
    }
}

testConnection();
