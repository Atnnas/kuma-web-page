import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const BACKUP_DIR = path.join(process.cwd(), 'public', 'images', 'backup');

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function optimizeImages() {
    console.log('Starting image optimization...');
    const files = fs.readdirSync(IMAGES_DIR);

    for (const file of files) {
        if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

        const filePath = path.join(IMAGES_DIR, file);
        const stats = fs.statSync(filePath);

        // Only process files larger than 500KB
        if (stats.size > 500 * 1024) {
            console.log(`Optimizing: ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);

            // Backup original
            fs.copyFileSync(filePath, path.join(BACKUP_DIR, file));

            try {
                const buffer = await sharp(filePath)
                    .resize(1920, 1920, { // Max dimensions, maintain aspect ratio
                        fit: 'inside',
                        withoutEnlargement: true
                    })
                    .jpeg({ quality: 80, mozjpeg: true })
                    .toBuffer();

                fs.writeFileSync(filePath, buffer);
                console.log(`✅ Optimized: ${file} -> ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
            } catch (error) {
                console.error(`❌ Failed to optimize ${file}:`, error);
            }
        }
    }
    console.log('Optimization complete.');
}

optimizeImages();
