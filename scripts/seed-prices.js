const seedData = [
    {
        title: "Kuma Kids (Niños)",
        price: "₡25,000",
        frequency: "mes",
        features: [
            "Matrícula: ₡10,000",
            "2 Clases semanales",
            "Disciplina y diversión",
            "Exámenes de grado"
        ],
        recommended: false,
        order: 1
    },
    {
        title: "Kuma Seniors (Adultos)",
        price: "₡25,000",
        frequency: "mes",
        features: [
            "Matrícula: ₡10,000",
            "3 Clases semanales",
            "Técnica y Combate",
            "Acondicionamiento físico"
        ],
        recommended: true,
        order: 2
    },
    {
        title: "Clases Personales",
        price: "₡8,000",
        frequency: "hora",
        features: [
            "Duración: 1 Hora",
            "Atención 1 a 1",
            "Horario a convenir",
            "Perfeccionamiento técnico",
            "Pago por sesión"
        ],
        recommended: false,
        restricted: false,
        order: 3
    }
];

async function seed() {
    console.log("Seeding Memberships...");
    try {
        const res = await fetch('http://localhost:3000/api/memberships', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(seedData)
        });
        const data = await res.json();
        console.log("Seeded:", data);
    } catch (e) {
        console.error("Error seeding:", e);
    }
}

seed();
