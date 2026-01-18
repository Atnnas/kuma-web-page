const COUNTRY_EMOJIS: Record<string, string> = {
    "Costa Rica": "🇨🇷", "CR": "🇨🇷", "San José": "🇨🇷", "San Jose": "🇨🇷",
    "Panamá": "🇵🇦", "Panama": "🇵🇦",
    "México": "🇲🇽", "Mexico": "🇲🇽",
    "USA": "🇺🇸", "Estados Unidos": "🇺🇸", "US": "🇺🇸",
    "Canada": "🇨🇦", "Canadá": "🇨🇦",
    "España": "🇪🇸", "Spain": "🇪🇸",
    "Colombia": "🇨🇴", "Argentina": "🇦🇷", "Chile": "🇨🇱", "Perú": "🇵🇪", "Peru": "🇵🇪",
    "Brasil": "🇧🇷", "Brazil": "🇧🇷", "Japón": "🇯🇵", "Japan": "🇯🇵",
    "Guatemala": "🇬🇹", "Honduras": "🇭🇳", "El Salvador": "🇸🇻", "Nicaragua": "🇳🇮",
    "Venezuela": "🇻🇪", "Italia": "🇮🇹", "Francia": "🇫🇷", "Alemania": "🇩🇪"
};

export async function searchCountryFlag(query: string): Promise<string | null> {
    if (!query) return null;

    // 1. Try to clean up query (handle "City, Country")
    let cleanQuery = query;
    if (query.includes(",")) {
        const parts = query.split(",");
        cleanQuery = parts[parts.length - 1].trim(); // Take the last part (Country)
    }

    try {
        // 2. Try REST Countries API
        const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(cleanQuery)}?fields=flags,cca2`);
        if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0 && data[0].flags?.png) {
                return data[0].flags.png;
            }
        }
    } catch (error) {
        // Silent fail
    }

    // 3. Fallback to Emoji Map
    const lower = cleanQuery.toLowerCase();
    for (const [key, emoji] of Object.entries(COUNTRY_EMOJIS)) {
        if (key.toLowerCase() === lower || lower.includes(key.toLowerCase())) {
            return emoji;
        }
    }

    return "🏳️"; // Final fallback
}
