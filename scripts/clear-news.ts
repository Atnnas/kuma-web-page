import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
}

// Define minimal schema
const NewsSchema = new mongoose.Schema({}, { strict: false });
const News = mongoose.models.News || mongoose.model('News', NewsSchema);

async function clearNews() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ Connected.');

        console.log('🗑️ Deleting all records from "news" collection...');
        const result = await News.deleteMany({});

        console.log(`✨ Success! Deleted ${result.deletedCount} news items.`);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected.');
        process.exit();
    }
}

clearNews();
