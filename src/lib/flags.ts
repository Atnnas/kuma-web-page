export async function searchCountryFlag(query: string): Promise<string | null> {
    if (!query || query.length < 3) return null;

    try {
        // Use REST Countries API
        const res = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fields=flags,cca2`);
        if (!res.ok) return null;

        const data = await res.json();
        // Return the first match's PNG flag
        if (data && data.length > 0 && data[0].flags?.png) {
            return data[0].flags.png;
        }
        return null;
    } catch (error) {
        console.error("Error fetching flag:", error);
        return null;
    }
}
