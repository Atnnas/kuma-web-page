
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
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

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkAdmins() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(mongoUri);
        console.log("Connected.");

        const admins = await User.find({ role: 'super_admin' });
        console.log(`Found ${admins.length} super_admin users.`);
        admins.forEach(admin => console.log(`- ${admin.email} (${admin.name})`));

        const allUsers = await User.find({});
        console.log(`Total users: ${allUsers.length}`);

        if (admins.length === 0 && allUsers.length > 0) {
            console.log("No super_admins found.");
            // Automatically promote the first user for convenience in this dev context?
            // Let's NOT auto-promote without asking, but let's PRINT who can be promoted.
            console.log("Potential candidates for admin:");
            allUsers.forEach(u => console.log(`- ${u.email} (current role: ${u.role})`));

            console.log("\nTo fix this easily, I can promote a user. Just let me know which email.");
        } else if (admins.length > 0) {
            console.log("Admins exist. If you are signed in as one of them, try signing out and back in.");
        }

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkAdmins();
