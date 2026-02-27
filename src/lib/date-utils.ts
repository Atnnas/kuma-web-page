/**
 * Returns a Date object representing the UTC midnight of the given date in the target timezone.
 * This is used to normalize "days" regardless of the absolute UTC time, allowing us to
 * compare if two events happened on the same calendar day in a specific region.
 */
export function getMidnightInTimezone(date: Date, timezone: string = "America/Costa_Rica"): Date {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone || "America/Costa_Rica",
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
        const parts = formatter.formatToParts(date);
        const year = parseInt(parts.find(p => p.type === 'year')!.value);
        const month = parseInt(parts.find(p => p.type === 'month')!.value);
        const day = parseInt(parts.find(p => p.type === 'day')!.value);

        // Return UTC midnight of that local calendar date
        return new Date(Date.UTC(year, month - 1, day));
    } catch (error) {
        console.error(`Error calculating midnight for timezone ${timezone}:`, error);
        // Fallback to Costa Rica if timezone is invalid
        if (timezone !== "America/Costa_Rica") {
            return getMidnightInTimezone(date, "America/Costa_Rica");
        }
        // Absolute fallback to UTC date
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
}
