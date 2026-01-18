import connectDB from "./src/lib/db";
import PendingUser from "./src/models/PendingUser";

async function getLinks() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("ERROR: MONGODB_URI no está definido.");
            process.exit(1);
        }

        await connectDB();
        const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const pending = await PendingUser.find().sort({ createdAt: -1 }).limit(5);

        console.log("\n--- ÚLTIMOS LINKS DE VERIFICACIÓN (DB) ---");
        if (pending.length === 0) {
            console.log("No hay usuarios pendientes de verificación.");
        }

        pending.forEach(p => {
            const link = `${domain}/verify?token=${p.verificationToken}`;
            console.log(`📧 ${p.email}`);
            console.log(`🔗 ${link}`);
            console.log("---");
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

getLinks();
