export interface BodyPart {
    id: string;
    spanish: string;
    romaji: string;
    kanji: string;
    category: "head" | "torso" | "upper_limbs" | "lower_limbs" | "vital";
    description: string;
}

export const ANATOMY_DATA: BodyPart[] = [
    // HEAD
    {
        id: "head",
        spanish: "Cabeza",
        romaji: "Atama",
        kanji: "頭",
        category: "head",
        description: "Centro de control. Contiene puntos vitales como Jinchu (filtro) y Tento (cima).",
    },
    {
        id: "neck",
        spanish: "Cuello",
        romaji: "Kubi",
        kanji: "首",
        category: "head",
        description: "Vulnerable a Shuto Uchi. Conecta cuerpo y mente.",
    },
    // TORSO
    {
        id: "chest",
        spanish: "Pecho",
        romaji: "Mune",
        kanji: "胸",
        category: "torso",
        description: "Protegido por pectorales. Objetivo de Chudan Tsuki.",
    },
    {
        id: "abs",
        spanish: "Abdomen",
        romaji: "Hara",
        kanji: "腹",
        category: "torso",
        description: "Centro del Espíritu y Energía (Ki). Tanden.",
    },
    // ARMS
    {
        id: "shoulder_l",
        spanish: "Hombro Izq",
        romaji: "Hidari Kata",
        kanji: "左肩",
        category: "upper_limbs",
        description: "Articulación clave para la potencia de golpeo.",
    },
    {
        id: "shoulder_r",
        spanish: "Hombro Der",
        romaji: "Migi Kata",
        kanji: "右肩",
        category: "upper_limbs",
        description: "Articulación clave para la potencia de golpeo.",
    },
    {
        id: "arm_l",
        spanish: "Brazo Izq",
        romaji: "Hidari Ude",
        kanji: "左腕",
        category: "upper_limbs",
        description: "Extremidad superior para bloqueo (Uke) y ataque.",
    },
    {
        id: "arm_r",
        spanish: "Brazo Der",
        romaji: "Migi Ude",
        kanji: "右腕",
        category: "upper_limbs",
        description: "Extremidad superior para bloqueo (Uke) y ataque.",
    },
    {
        id: "hand_l",
        spanish: "Mano Izq",
        romaji: "Hidari Te",
        kanji: "左手",
        category: "upper_limbs",
        description: "Arma principal: Seiken, Shuto, Nukite.",
    },
    {
        id: "hand_r",
        spanish: "Mano Der",
        romaji: "Migi Te",
        kanji: "右手",
        category: "upper_limbs",
        description: "Arma principal: Seiken, Shuto, Nukite.",
    },
    // LEGS
    {
        id: "thigh_l",
        spanish: "Muslo Izq",
        romaji: "Hidari Momo",
        kanji: "左腿",
        category: "lower_limbs",
        description: "Base de la postura. Potencia para patadas.",
    },
    {
        id: "thigh_r",
        spanish: "Muslo Der",
        romaji: "Migi Momo",
        kanji: "右腿",
        category: "lower_limbs",
        description: "Base de la postura. Potencia para patadas.",
    },
    {
        id: "leg_l",
        spanish: "Pierna Izq",
        romaji: "Hidari Ashi",
        kanji: "左足",
        category: "lower_limbs",
        description: "Incluye la canilla (Sune), usada para bloqueos duros.",
    },
    {
        id: "leg_r",
        spanish: "Pierna Der",
        romaji: "Migi Ashi",
        kanji: "右足",
        category: "lower_limbs",
        description: "Incluye la canilla (Sune), usada para bloqueos duros.",
    },
    {
        id: "foot_l",
        spanish: "Pie Izq",
        romaji: "Hidari Ashi", // "Ashi" means leg/foot contextually, specifically foot is Ashikubi (ankle) down
        kanji: "左足",
        category: "lower_limbs",
        description: "Puntos de impacto: Koshi (bola), Sokuto (borde).",
    },
    {
        id: "foot_r",
        spanish: "Pie Der",
        romaji: "Migi Ashi",
        kanji: "右足",
        category: "lower_limbs",
        description: "Puntos de impacto: Koshi (bola), Sokuto (borde).",
    }
];
