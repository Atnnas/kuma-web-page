const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function checkCollections() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/MONGODB_URI=(.*)/);

        if (!match) {
            console.error('MONGODB_URI not found');
            return;
        }

        const uri = match[1].trim();
        await mongoose.connect(uri);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in database:');
        collections.forEach(c => console.log(' - ' + c.name));

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkCollections();
