const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function countKatas() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/MONGODB_URI=(.*)/);
        const uri = match[1].trim();
        await mongoose.connect(uri);

        const count = await mongoose.connection.collection('userkatas').countDocuments();
        console.log(`Documents in userkatas: ${count}`);

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

countKatas();
