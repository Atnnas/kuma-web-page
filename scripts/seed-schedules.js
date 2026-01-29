const seedData = [
    {
        day: "Lunes, Miércoles y Viernes",
        order: 1,
        sessions: [
            {
                group: "Kuma Kids",
                time: "6:00 PM - 7:00 PM",
                description: "Entrenamiento especializado para niños, enfocado en disciplina y coordinación.",
                icon: "Users",
                color: "from-yellow-500 to-orange-600"
            },
            {
                group: "Kuma Seniors",
                time: "7:00 PM - 8:30 PM",
                description: "Clases intensivas de técnica, kata y kumite para todos los niveles.",
                icon: "Users",
                color: "from-blue-500 to-indigo-600"
            }
        ]
    },
    {
        day: "Martes y Jueves",
        order: 2,
        sessions: [
            {
                group: "Alto Rendimiento",
                time: "5:00 PM - 7:00 PM",
                description: "Entrenamiento específico para competidores y desarrollo atlético avanzado.",
                icon: "Trophy",
                color: "from-red-600 to-rose-700"
            }
        ]
    },
    {
        day: "Sábado",
        order: 3,
        sessions: [
            {
                group: "Alto Rendimiento (Disruptivo)",
                time: "9:00 AM - 12:00 MD",
                description: "Entrenamiento de alta intensidad y ruptura de límites diseñado SOLO para competidores.",
                icon: "Zap",
                color: "from-fuchsia-600 to-purple-700"
            },
            {
                group: "Entrenamiento Vespertino",
                time: "1:00 PM - 4:00 PM",
                description: "Entrenamiento para cinturones cafe y avanzados.",
                icon: "Clock",
                color: "from-purple-500 to-violet-600"
            }
        ]
    }
];

// Run this in browser console or via curl
async function seed() {
    console.log("Seeding...");
    try {
        const res = await fetch('http://localhost:3000/api/horarios', {
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
