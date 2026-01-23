import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found');
    process.exit(1);
}

const NewsSchema = new mongoose.Schema({}, { strict: false });
const News = mongoose.models.News || mongoose.model('News', NewsSchema);

async function checkNews() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        const news = await News.find({});
        console.log('--- Current News Items ---');
        news.forEach(n => {
            console.log(`ID: ${n._id}`);
            console.log(`Title: ${n.title}`);
            console.log(`Image: ${n.image}`);
            if (n.images && n.images.length) {
                console.log(`Gallery: ${n.images.length} images`);
                n.images.forEach((img: string, i: number) => console.log(`  [${i}] ${img.substring(0, 50)}...`));
            }
            console.log('---');
        });
    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

checkNews();
