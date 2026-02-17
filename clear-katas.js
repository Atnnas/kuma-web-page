const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function clearKatas() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/MONGODB_URI=(.*)/);

        if (!match) {
            console.error('MONGODB_URI not found in .env.local');
            return;
        }

        const uri = match[1].trim();
        console.log('Connecting to MongoDB...');
        await mongoose.connect(uri);

        console.log('Clearing UserKata collection...');
        // We can just drop the collection or delete many
        // To be safe and reuse our schema if needed, we could define it, but deleteMany works on the connection directly
        const result = await mongoose.connection.collection('userkatas').deleteMany({});

        console.log(`Successfully deleted ${result.deletedCount} kata records.`);
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

clearKatas();
