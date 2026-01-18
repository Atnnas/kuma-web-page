const COUNTRY_FLAGS: Record<string, string> = {
    // Static mapping to FlagCDN for reliability
    "Costa Rica": "https://flagcdn.com/w320/cr.png", "CR": "https://flagcdn.com/w320/cr.png", "San José": "https://flagcdn.com/w320/cr.png", "San Jose": "https://flagcdn.com/w320/cr.png",
    "Panamá": "https://flagcdn.com/w320/pa.png", "Panama": "https://flagcdn.com/w320/pa.png",
    "México": "https://flagcdn.com/w320/mx.png", "Mexico": "https://flagcdn.com/w320/mx.png",
    "USA": "https://flagcdn.com/w320/us.png", "Estados Unidos": "https://flagcdn.com/w320/us.png",
    "Canada": "https://flagcdn.com/w320/ca.png", "Canadá": "https://flagcdn.com/w320/ca.png",
    "España": "https://flagcdn.com/w320/es.png", "Spain": "https://flagcdn.com/w320/es.png",
    "Colombia": "https://flagcdn.com/w320/co.png",
    "Argentina": "https://flagcdn.com/w320/ar.png",
    "Chile": "https://flagcdn.com/w320/cl.png",
    "Perú": "https://flagcdn.com/w320/pe.png", "Peru": "https://flagcdn.com/w320/pe.png",
    "Brasil": "https://flagcdn.com/w320/br.png", "Brazil": "https://flagcdn.com/w320/br.png",
    "Japón": "https://flagcdn.com/w320/jp.png", "Japan": "https://flagcdn.com/w320/jp.png",
    "Guatemala": "https://flagcdn.com/w320/gt.png",
    "Honduras": "https://flagcdn.com/w320/hn.png",
    "El Salvador": "https://flagcdn.com/w320/sv.png",
    "Nicaragua": "https://flagcdn.com/w320/ni.png",
    "Venezuela": "https://flagcdn.com/w320/ve.png",
    "Italia": "https://flagcdn.com/w320/it.png",
    "Francia": "https://flagcdn.com/w320/fr.png",
    "Alemania": "https://flagcdn.com/w320/de.png"
};

export async function searchCountryFlag(query: string): Promise<string | null> {
    if (!query) return null;

    // 1. Try to clean up query (handle "City, Country")
    let cleanQuery = query;
    if (query.includes(",")) {
        const parts = query.split(",");
        cleanQuery = parts[parts.length - 1].trim(); // Take the last part (Country)
    }

    // 2. Try Static Map FIRST (Fastest & Guaranteed Image)
    const lower = cleanQuery.toLowerCase();
    for (const [key, url] of Object.entries(COUNTRY_FLAGS)) {
        if (key.toLowerCase() === lower || lower.includes(key.toLowerCase())) {
            return url;
        }
    }

    try {
        // 3. Try REST Countries API (Fallback for obscure countries)
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

    return "🏳️"; // Final fallback
}
