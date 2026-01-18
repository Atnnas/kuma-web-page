import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendFinalTest() {
    const targetEmail = "kumadojocr@gmail.com";
    console.log(`--- ENVIANDO MENSAGE A CUENTA OFICIAL DE RESEND: ${targetEmail} ---`);

    try {
        const { data, error } = await resend.emails.send({
            from: "Kuma Dojo <onboarding@resend.dev>",
            to: targetEmail,
            subject: "Hola Maigos!",
            html: "<h1>¡Hola Maigos!</h1><p>Esta es la prueba definitiva enviada a la cuenta oficial de Resend.</p>"
        });

        if (error) {
            console.error("❌ ERROR DE RESEND:", error.message);
        } else {
            console.log("✅ MENSAJE ENVIADO EXITOSAMENTE A LA CUENTA OFICIAL!");
            console.log("ID del mensaje:", data?.id);
        }
    } catch (error: any) {
        console.error("❌ ERROR CRÍTICO:", error.message);
    }

    console.log("---------------------------------------------------");
    process.exit(0);
}

sendFinalTest();
