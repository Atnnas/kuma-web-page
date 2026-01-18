import connectDB from "./src/lib/db";
import SystemLog from "./src/models/SystemLog";

async function checkFullLogs() {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("ERROR: MONGODB_URI no está definido.");
            process.exit(1);
        }

        await connectDB();
        console.log("Conectado a la base de datos...");

        const logs = await SystemLog.find()
            .sort({ createdAt: -1 })
            .limit(5);

        console.log("--- FULL SYSTEM LOGS ---");
        logs.forEach(log => {
            console.log(`[${log.createdAt.toISOString()}] [${log.level}] [${log.context}]`);
            console.log(`MESSAGE: ${log.message}`);
            if (log.stack_trace) console.log(`STACK: ${log.stack_trace}`);
            console.log("------------------------");
        });

        process.exit(0);
    } catch (error) {
        console.error("Error al leer logs:", error);
        process.exit(1);
    }
}

checkFullLogs();
