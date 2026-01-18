export const COUNTRY_FLAGS: Record<string, string> = {
    "Costa Rica": "🇨🇷",
    "Panamá": "🇵🇦",
    "Panama": "🇵🇦",
    "México": "🇲🇽",
    "Mexico": "🇲🇽",
    "San José": "🇨🇷", // Implicit
    "Estados Unidos": "🇺🇸",
    "USA": "🇺🇸",
    "Canadá": "🇨🇦",
    "Canada": "🇨🇦",
    "Colombia": "🇨🇴",
    "Argentina": "🇦🇷",
    "Chile": "🇨🇱",
    "Perú": "🇵🇪",
    "Peru": "🇵🇪",
    "España": "🇪🇸",
    "Spain": "🇪🇸",
    "Brasil": "🇧🇷",
    "Brazil": "🇧🇷",
    "Japón": "🇯🇵",
    "Japan": "🇯🇵",
    "Guatemala": "🇬🇹",
    "Honduras": "🇭🇳",
    "El Salvador": "🇸🇻",
    "Nicaragua": "🇳🇮",
    "Venezuela": "🇻🇪",
    "Italia": "🇮🇹",
    "Francia": "🇫🇷",
    "Alemania": "🇩🇪",
    // Add more as needed
};

export const getFlagForCountry = (country: string): string => {
    if (!country) return "🏳️"; // Default white flag

    // Exact match
    if (COUNTRY_FLAGS[country]) return COUNTRY_FLAGS[country];

    // Case insensitive/Partial match
    const lower = country.toLowerCase();
    for (const [key, flag] of Object.entries(COUNTRY_FLAGS)) {
        if (key.toLowerCase() === lower || lower.includes(key.toLowerCase())) {
            return flag;
        }
    }

    return "🏳️";
};
