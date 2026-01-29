async function check() {
    console.log("Checking API...");
    try {
        const res = await fetch('http://localhost:3000/api/horarios');
        const data = await res.json();
        console.log("API Response Status:", res.status);
        console.log("Data length:", Array.isArray(data) ? data.length : "Not an array");
        console.log("Data sample:", JSON.stringify(data[0] || {}, null, 2));
    } catch (e) {
        console.error("Error checking:", e);
    }
}

check();
