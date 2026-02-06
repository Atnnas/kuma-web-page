const seed = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/exercises/seed', {
            method: "POST"
        });
        const data = await response.json();
        console.log("Seed result:", data);
    } catch (error) {
        console.error("Error seeding:", error);
    }
};

seed();
