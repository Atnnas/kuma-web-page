/**
 * WKF (World Karate Federation) Categories and Weight Divisions
 * Standard official competition brackets by Age and Weight (Kata & Kumite)
 */

export interface WkfDivision {
    minAge: number;
    maxAge: number;
    name: string;
    maleWeights: { max: number; label: string }[];
    femaleWeights: { max: number; label: string }[];
}

export const WKF_AGE_DIVISIONS: WkfDivision[] = [
    {
        name: "U12 / Infantil",
        minAge: 0,
        maxAge: 11,
        maleWeights: [
            { max: 30, label: "-30 kg" },
            { max: 35, label: "-35 kg" },
            { max: 40, label: "-40 kg" },
            { max: 45, label: "-45 kg" },
            { max: Infinity, label: "+45 kg" }
        ],
        femaleWeights: [
            { max: 30, label: "-30 kg" },
            { max: 35, label: "-35 kg" },
            { max: 40, label: "-40 kg" },
            { max: 45, label: "-45 kg" },
            { max: Infinity, label: "+45 kg" }
        ]
    },
    {
        name: "U14",
        minAge: 12,
        maxAge: 13,
        maleWeights: [
            { max: 40, label: "-40 kg" },
            { max: 45, label: "-45 kg" },
            { max: 50, label: "-50 kg" },
            { max: 55, label: "-55 kg" },
            { max: Infinity, label: "+55 kg" }
        ],
        femaleWeights: [
            { max: 42, label: "-42 kg" },
            { max: 47, label: "-47 kg" },
            { max: 52, label: "-52 kg" },
            { max: Infinity, label: "+52 kg" }
        ]
    },
    {
        name: "Cadete",
        minAge: 14,
        maxAge: 15,
        maleWeights: [
            { max: 52, label: "-52 kg" },
            { max: 57, label: "-57 kg" },
            { max: 63, label: "-63 kg" },
            { max: 70, label: "-70 kg" },
            { max: Infinity, label: "+70 kg" }
        ],
        femaleWeights: [
            { max: 47, label: "-47 kg" },
            { max: 54, label: "-54 kg" },
            { max: 61, label: "-61 kg" },
            { max: Infinity, label: "+61 kg" }
        ]
    },
    {
        name: "Junior",
        minAge: 16,
        maxAge: 17,
        maleWeights: [
            { max: 55, label: "-55 kg" },
            { max: 61, label: "-61 kg" },
            { max: 68, label: "-68 kg" },
            { max: 76, label: "-76 kg" },
            { max: Infinity, label: "+76 kg" }
        ],
        femaleWeights: [
            { max: 48, label: "-48 kg" },
            { max: 53, label: "-53 kg" },
            { max: 59, label: "-59 kg" },
            { max: 66, label: "-66 kg" },
            { max: Infinity, label: "+66 kg" }
        ]
    },
    {
        name: "Sub-21",
        minAge: 18,
        maxAge: 20,
        maleWeights: [
            { max: 60, label: "-60 kg" },
            { max: 67, label: "-67 kg" },
            { max: 75, label: "-75 kg" },
            { max: 84, label: "-84 kg" },
            { max: Infinity, label: "+84 kg" }
        ],
        femaleWeights: [
            { max: 50, label: "-50 kg" },
            { max: 55, label: "-55 kg" },
            { max: 61, label: "-61 kg" },
            { max: 68, label: "-68 kg" },
            { max: Infinity, label: "+68 kg" }
        ]
    },
    {
        name: "Senior",
        minAge: 21,
        maxAge: 34,
        maleWeights: [
            { max: 60, label: "-60 kg" },
            { max: 67, label: "-67 kg" },
            { max: 75, label: "-75 kg" },
            { max: 84, label: "-84 kg" },
            { max: Infinity, label: "+84 kg" }
        ],
        femaleWeights: [
            { max: 50, label: "-50 kg" },
            { max: 55, label: "-55 kg" },
            { max: 61, label: "-61 kg" },
            { max: 68, label: "-68 kg" },
            { max: Infinity, label: "+68 kg" }
        ]
    },
    {
        name: "Master",
        minAge: 35,
        maxAge: 120,
        maleWeights: [
            { max: 67, label: "-67 kg" },
            { max: 75, label: "-75 kg" },
            { max: 84, label: "-84 kg" },
            { max: Infinity, label: "+84 kg" }
        ],
        femaleWeights: [
            { max: 55, label: "-55 kg" },
            { max: 61, label: "-61 kg" },
            { max: 68, label: "-68 kg" },
            { max: Infinity, label: "+68 kg" }
        ]
    }
];

/**
 * Calculates exact age in years from birthDate to current date
 */
export function calculateAge(birthDateInput?: Date | string | null): number | null {
    if (!birthDateInput) return null;
    const birth = new Date(birthDateInput);
    if (isNaN(birth.getTime())) return null;

    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

/**
 * Finds the WKF Age Division based on exact age
 */
export function getWkfAgeDivision(age: number | null): WkfDivision {
    if (age === null || age < 0) {
        // Fallback default: Senior / Open
        return WKF_AGE_DIVISIONS.find(d => d.name === "Senior") || WKF_AGE_DIVISIONS[0];
    }
    const division = WKF_AGE_DIVISIONS.find(d => age >= d.minAge && age <= d.maxAge);
    return division || WKF_AGE_DIVISIONS[WKF_AGE_DIVISIONS.length - 1];
}

/**
 * Finds the WKF Weight Class based on division, weight, and gender
 */
export function getWkfWeightDivision(
    division: WkfDivision,
    weight?: number | null,
    gender?: string
): string {
    if (!weight || weight <= 0) return "Open";

    const isFemale = gender && gender.toLowerCase().startsWith("f");
    const weightList = isFemale ? division.femaleWeights : division.maleWeights;

    for (const w of weightList) {
        if (weight <= w.max) {
            return w.label;
        }
    }
    return weightList[weightList.length - 1].label;
}

/**
 * Full category analysis
 */
export interface WkfCategoryResult {
    age: number | null;
    ageDivision: string;
    calculatedWeightClass: string;
    suggestedCategory: string; // e.g. "Cadete -57 kg"
    displayCategory: string;   // Either assigned category or suggested category
    hasWeightReviewAlert: boolean;
    alertMessage?: string;
    alertReason?: string;
}

export function evaluateWkfCategory({
    birthDate,
    currentWeight,
    gender,
    assignedCategory,
    assignedWeight,
    forceWeightReview
}: {
    birthDate?: Date | string | null;
    currentWeight?: number | null;
    gender?: string;
    assignedCategory?: string;
    assignedWeight?: number | null;
    forceWeightReview?: boolean;
}): WkfCategoryResult {
    const age = calculateAge(birthDate);
    const division = getWkfAgeDivision(age);
    const weightClass = getWkfWeightDivision(division, currentWeight, gender);
    const suggestedCategory = `${division.name} ${weightClass}`;

    // Display category is the assigned one if present, otherwise the suggested one
    const displayCategory = assignedCategory?.trim() ? assignedCategory.trim() : suggestedCategory;

    // Check if there is a weight mismatch requiring review
    let hasWeightReviewAlert = !!forceWeightReview;
    let alertMessage: string | undefined;

    if (assignedCategory && assignedCategory.trim()) {
        // If the athlete has an assigned category, compare with the current weight-based category
        if (assignedCategory.trim().toLowerCase() !== suggestedCategory.toLowerCase()) {
            hasWeightReviewAlert = true;
            alertMessage = `Revisión de peso: Peso registrado (${currentWeight ? currentWeight + " kg" : "N/D"}) corresponde a ${suggestedCategory}.`;
        }
    } else if (assignedWeight && currentWeight && Math.abs(currentWeight - assignedWeight) >= 2) {
        // If weight changed by 2+ kg from initial registered weight
        hasWeightReviewAlert = true;
        alertMessage = `Revisión de peso: Variación de peso de ${assignedWeight} kg a ${currentWeight} kg.`;
    }

    return {
        age,
        ageDivision: division.name,
        calculatedWeightClass: weightClass,
        suggestedCategory,
        displayCategory,
        hasWeightReviewAlert,
        alertMessage,
        alertReason: alertMessage
    };
}
