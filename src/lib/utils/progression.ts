export interface IStats {
    vel: number;
    pot: number;
    tec: number;
    res: number;
    esp: number;
    ovr: number;
}

export type SessionType = "Fuerza" | "Explosión" | "Técnica" | "Kata" | "Kumite";
export type PerformanceType = "Standard" | "Destacado" | "Elite" | "1" | "2" | "3" | "4" | "5";

/**
 * Calculates the stat increments for a single attendance record.
 */
export function calculateStatIncrements(
    sessions: SessionType[],
    performance: PerformanceType = "Standard",
    isMVP: boolean = false
): Partial<Record<keyof Omit<IStats, "ovr">, number>> {
    const increments: Partial<Record<keyof Omit<IStats, "ovr">, number>> = {};

    // Base growth definitions
    // Fuerza -> +0.05 POT
    // Explosión -> +0.05 VEL
    // Técnica -> +0.05 TEC
    // Kata -> +0.03 TEC, +0.02 ESP
    // Kumite -> +0.03 RES, +0.02 VEL
    const baseGrowth: Record<SessionType, Partial<Record<keyof Omit<IStats, "ovr">, number>>> = {
        Fuerza: { pot: 0.05 },
        Explosión: { vel: 0.05 },
        Técnica: { tec: 0.05 },
        Kata: { tec: 0.03, esp: 0.02 },
        Kumite: { res: 0.03, vel: 0.02 },
    };

    // Performance multipliers
    const multipliers: Record<PerformanceType, number> = {
        Standard: 1.0,
        Destacado: 1.5,
        Elite: 2.0,
        "1": 0.4,
        "2": 0.7,
        "3": 1.0,
        "4": 1.5,
        "5": 2.0,
    };

    const multiplier = multipliers[performance] || 1.0;

    // Aggregate increments
    for (const session of sessions) {
        const sessionGrowths = baseGrowth[session];
        if (!sessionGrowths) continue;

        for (const [statKey, baseVal] of Object.entries(sessionGrowths)) {
            const key = statKey as keyof Omit<IStats, "ovr">;
            const currentIncrement = increments[key] || 0;
            increments[key] = currentIncrement + (baseVal * multiplier);
        }
    }

    // Apply MVP bonuses if applicable
    if (isMVP) {
        // ESP gets +0.10 flat
        increments.esp = (increments.esp || 0) + 0.10;

        // Other active training stats of the session get +0.02 flat
        const keys: (keyof Omit<IStats, "ovr">)[] = ["vel", "pot", "tec", "res"];
        for (const key of keys) {
            if (increments[key] && increments[key]! > 0) {
                increments[key] = increments[key]! + 0.02;
            }
        }
    }

    return increments;
}

/**
 * Applies an increment to a current stat value with diminishing returns (soft cap).
 */
export function applyGrowthWithDiminishingReturns(currentValue: number, increment: number): number {
    let growth = increment;

    // Diminishing returns formula:
    // Stat >= 90: growth is reduced to 15%
    // Stat >= 80: growth is reduced to 40%
    if (currentValue >= 90) {
        growth = increment * 0.15;
    } else if (currentValue >= 80) {
        growth = increment * 0.40;
    }

    const newValue = currentValue + growth;
    // Cap at 99
    return Math.min(99, Math.max(10, newValue));
}

/**
 * Helper to update a stats object with new increments.
 */
export function updateStatsObject(currentStats: IStats, increments: Partial<Record<keyof Omit<IStats, "ovr">, number>>, isSubtract = false): IStats {
    const nextStats = { ...currentStats };
    const factor = isSubtract ? -1 : 1;

    // Apply incremental growth to each stat
    const keys: (keyof Omit<IStats, "ovr">)[] = ["vel", "pot", "tec", "res", "esp"];
    for (const key of keys) {
        const increment = increments[key] || 0;
        if (increment === 0) continue;

        if (isSubtract) {
            // Simply subtract the raw amount when deleting/undoing attendance
            nextStats[key] = Math.max(10, nextStats[key] - increment);
        } else {
            // Apply growth with soft cap
            nextStats[key] = applyGrowthWithDiminishingReturns(nextStats[key], increment);
        }
    }

    // Recalculate OVR (Average of the 5 stats, rounded)
    const sum = nextStats.vel + nextStats.pot + nextStats.tec + nextStats.res + nextStats.esp;
    nextStats.ovr = Math.round(sum / 5);

    return nextStats;
}
