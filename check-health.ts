import connectDB from "./src/lib/db";
import User from "./src/models/User";
import PendingUser from "./src/models/PendingUser";

async function checkHealth() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("ERROR: MONGODB_URI no está definido.");
            process.exit(1);
        }

        await connectDB();
        console.log("Conectado a la base de datos...");

        const pendingCount = await PendingUser.countDocuments();
        const unverifiedUsers = await User.countDocuments({ emailVerified: null });
        const recentPending = await PendingUser.find().sort({ createdAt: -1 }).limit(5);

        console.log(`- PendingUsers (en espera de verificación): ${pendingCount}`);
        console.log(`- Usuarios reales sin verificar: ${unverifiedUsers}`);

        console.log("\n--- ÚLTIMOS TENTATIVAS DE REGISTRO ---");
        recentPending.forEach(p => {
            console.log(`[${p.createdAt.toISOString()}] ${p.email} - Token: ${p.verificationToken.substring(0, 8)}...`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error al leer DB:", error);
        process.exit(1);
    }
}

checkHealth();
