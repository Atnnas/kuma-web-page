import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local in root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
}

// Define minimal schema for visits if not importing model to avoid dependency issues in script
const VisitSchema = new mongoose.Schema({}, { strict: false });
const Visit = mongoose.models.Visit || mongoose.model('Visit', VisitSchema);

async function clearVisits() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ Connected.');

        console.log('🗑️ Deleting all records from "visits" collection...');
        const result = await Visit.deleteMany({});

        console.log(`✨ Success! Deleted ${result.deletedCount} visits.`);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected.');
        process.exit();
    }
}

clearVisits();
