import { KanjiCharDef } from "@/types/didactica";

export interface NumberKanjiDef extends KanjiCharDef {
    number: number;
    hiragana: string;
    pronunciationGuide: string;
}

export const NUMBERS_1_TO_10_KANJIS: NumberKanjiDef[] = [
    {
        number: 1,
        kanji: "一",
        romaji: "ICHI",
        hiragana: "いち",
        pronunciationGuide: "I-chi",
        meaning: "Uno",
        description: "Un solo trazo horizontal de izquierda a derecha. Representa el inicio de toda técnica y la unidad.",
        strokes: [
            { id: 1, name: "Trazo horizontal", path: "M 18,50 C 35,48 65,48 82,50", start: [18, 50], end: [82, 50] },
        ],
    },
    {
        number: 2,
        kanji: "二",
        romaji: "NI",
        hiragana: "に",
        pronunciationGuide: "Ni",
        meaning: "Dos",
        description: "Dos líneas horizontales: la superior es corta y la inferior más larga y sólida.",
        strokes: [
            { id: 1, name: "Trazo superior corto", path: "M 30,36 C 45,34 55,34 70,36", start: [30, 36], end: [70, 36] },
            { id: 2, name: "Trazo inferior largo", path: "M 16,68 C 40,66 60,66 84,68", start: [16, 68], end: [84, 68] },
        ],
    },
    {
        number: 3,
        kanji: "三",
        romaji: "SAN",
        hiragana: "さん",
        pronunciationGuide: "San",
        meaning: "Tres",
        description: "Tres líneas: media, corta y larga. Representa el cielo, el hombre y la tierra en la filosofía marcial.",
        strokes: [
            { id: 1, name: "Trazo superior", path: "M 26,28 C 42,26 58,26 74,28", start: [26, 28], end: [74, 28] },
            { id: 2, name: "Trazo medio corto", path: "M 34,49 C 45,47 55,47 66,49", start: [34, 49], end: [66, 49] },
            { id: 3, name: "Trazo inferior largo", path: "M 16,72 C 40,70 60,70 84,72", start: [16, 72], end: [84, 72] },
        ],
    },
    {
        number: 4,
        kanji: "四",
        romaji: "SHI / YON",
        hiragana: "よん / し",
        pronunciationGuide: "Yon / Shi",
        meaning: "Cuatro",
        description: "Una caja que protege dos extremidades interiores. Al contar en el dojo se suele pronunciar 'Shi'.",
        strokes: [
            { id: 1, name: "Vertical izquierda", path: "M 25,24 C 25,42 25,60 25,80", start: [25, 24], end: [25, 80] },
            { id: 2, name: "Marco superior y derecho", path: "M 25,24 C 45,23 60,23 75,23 C 75,42 75,60 75,80", start: [25, 24], end: [75, 80] },
            { id: 3, name: "Curva interior izquierda", path: "M 40,36 C 38,48 35,58 31,68", start: [40, 36], end: [31, 68] },
            { id: 4, name: "Ángulo interior derecho", path: "M 56,36 C 56,48 56,58 56,66 C 60,66 64,66 68,66", start: [56, 36], end: [68, 66] },
            { id: 5, name: "Cierre inferior", path: "M 24,80 C 42,80 58,80 76,80", start: [24, 80], end: [76, 80] },
        ],
    },
    {
        number: 5,
        kanji: "五",
        romaji: "GO",
        hiragana: "ご",
        pronunciationGuide: "Go",
        meaning: "Cinco",
        description: "La mitad del camino hacia la decena. Equilibrio central en las técnicas del Karate.",
        strokes: [
            { id: 1, name: "Horizontal superior", path: "M 24,24 C 42,23 58,23 76,24", start: [24, 24], end: [76, 24] },
            { id: 2, name: "Vertical inclinada", path: "M 49,24 C 46,40 43,58 41,76", start: [49, 24], end: [41, 76] },
            { id: 3, name: "Quiebre medio", path: "M 32,49 C 48,48 60,48 66,48 C 66,57 65,67 64,76", start: [32, 49], end: [64, 76] },
            { id: 4, name: "Horizontal base", path: "M 16,77 C 40,76 60,76 84,77", start: [16, 77], end: [84, 77] },
        ],
    },
    {
        number: 6,
        kanji: "六",
        romaji: "ROKU",
        hiragana: "ろく",
        pronunciationGuide: "Ro-ku",
        meaning: "Seis",
        description: "Punto superior, viga horizontal y dos patas estables en posición de combate.",
        strokes: [
            { id: 1, name: "Punto superior", path: "M 50,16 C 50,22 50,27 50,32", start: [50, 16], end: [50, 32] },
            { id: 2, name: "Horizontal central", path: "M 16,42 C 40,40 60,40 84,42", start: [16, 42], end: [84, 42] },
            { id: 3, name: "Diagonal izquierda", path: "M 42,54 C 36,63 29,71 20,78", start: [42, 54], end: [20, 78] },
            { id: 4, name: "Barrido derecho", path: "M 60,54 C 66,63 72,71 80,78", start: [60, 54], end: [80, 78] },
        ],
    },
    {
        number: 7,
        kanji: "七",
        romaji: "SHICHI / NANA",
        hiragana: "しち / なな",
        pronunciationGuide: "Shi-chi / Na-na",
        meaning: "Siete",
        description: "Línea ascendente cruzada por una vertical con gancho firme y decidido.",
        strokes: [
            { id: 1, name: "Horizontal ascendente", path: "M 18,52 C 38,48 62,44 82,40", start: [18, 52], end: [82, 40] },
            { id: 2, name: "Vertical con curva y gancho", path: "M 47,20 C 47,45 47,66 47,72 C 47,78 52,78 64,78 C 72,78 77,75 80,70", start: [47, 20], end: [80, 70] },
        ],
    },
    {
        number: 8,
        kanji: "八",
        romaji: "HACHI",
        hiragana: "はち",
        pronunciationGuide: "Ha-chi",
        meaning: "Ocho",
        description: "Dos trazos que se abren como la cima del Monte Fuji, símbolo de prosperidad y balance.",
        strokes: [
            { id: 1, name: "Barrido izquierdo corto", path: "M 42,32 C 37,48 30,64 20,78", start: [42, 32], end: [20, 78] },
            { id: 2, name: "Barrido derecho largo", path: "M 56,22 C 61,44 68,62 82,78", start: [56, 22], end: [82, 78] },
        ],
    },
    {
        number: 9,
        kanji: "九",
        romaji: "KYŪ",
        hiragana: "きゅう",
        pronunciationGuide: "Kyuu",
        meaning: "Nueve",
        description: "Paso final antes de la decena. Curva izquierda y gancho dinámico con Kime.",
        strokes: [
            { id: 1, name: "Curva vertical izquierda", path: "M 46,20 C 42,42 35,62 24,78", start: [46, 20], end: [24, 78] },
            { id: 2, name: "Horizontal con quiebre y gancho", path: "M 33,36 C 45,36 57,36 67,36 C 67,48 64,62 64,70 C 64,78 70,78 78,78 C 82,78 85,74 86,68", start: [33, 36], end: [86, 68] },
        ],
    },
    {
        number: 10,
        kanji: "十",
        romaji: "JŪ",
        hiragana: "じゅう",
        pronunciationGuide: "Juu",
        meaning: "Diez",
        description: "La cruz marcial perfecta. Representa la totalidad y la maestría del conteo del dojo.",
        strokes: [
            { id: 1, name: "Barra horizontal", path: "M 18,50 C 40,48 60,48 82,50", start: [18, 50], end: [82, 50] },
            { id: 2, name: "Barra vertical central", path: "M 50,18 C 50,40 50,62 50,84", start: [50, 18], end: [50, 84] },
        ],
    },
];
