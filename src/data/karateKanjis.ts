import { KanjiCharDef } from "@/types/didactica";

export const KARATE_DO_KANJIS: KanjiCharDef[] = [
    {
        kanji: "空",
        romaji: "KARA",
        meaning: "Vacío / Pureza",
        description: "El ideograma de 'Vacío' (mente libre de ego y manos desarmadas). Consta de 8 trazos ordenados de arriba a abajo.",
        strokes: [
            { id: 1, name: "Ten (Punto superior)", path: "M 50,11 C 51,15 52,18 52,22", start: [50, 11], end: [52, 22] },
            { id: 2, name: "Tejado izquierdo", path: "M 25,23 C 25.5,27 26.5,33 27,38", start: [25, 23], end: [27, 38] },
            { id: 3, name: "Tejado superior y gancho", path: "M 27,26 C 45,23 65,21 77,21 C 81,21 82,24 80,28 C 77,32 74,35 73,37", start: [27, 26], end: [73, 37] },
            { id: 4, name: "Harai (Diagonal izquierda)", path: "M 42,32 C 40,38 34,48 23,55", start: [42, 32], end: [23, 55] },
            { id: 5, name: "Magari (Gancho derecho)", path: "M 60,30 C 60,38 60,43 60,45 C 60,48 64,48 72,48 C 76,48 78,47 78,43", start: [60, 30], end: [78, 43] },
            { id: 6, name: "Horizontal medio", path: "M 32,64 C 44,62 58,61 70,61", start: [32, 64], end: [70, 61] },
            { id: 7, name: "Tate (Vertical central)", path: "M 51,64 C 51,72 51,80 51,88", start: [51, 64], end: [51, 88] },
            { id: 8, name: "Horizontal base", path: "M 18,90 C 38,88 64,87 84,87", start: [18, 90], end: [84, 87] },
        ]
    },
    {
        kanji: "手",
        romaji: "TE",
        meaning: "Mano",
        description: "El ideograma de 'Mano' (representa una mano abierta y alerta). Consta de 4 trazos.",
        strokes: [
            { id: 1, name: "Harai superior", path: "M 68,16 C 56,20 44,24 28,28", start: [68, 16], end: [28, 28] },
            { id: 2, name: "Horizontal corto", path: "M 28,42 C 44,39 60,37 74,36", start: [28, 42], end: [74, 36] },
            { id: 3, name: "Horizontal largo", path: "M 15,62 C 40,58 66,56 86,55", start: [15, 62], end: [86, 55] },
            { id: 4, name: "Kagi (Vertical con gancho)", path: "M 52,32 C 53,52 53,74 53,86 C 53,95 48,93 42,88", start: [52, 32], end: [42, 88] },
        ]
    },
    {
        kanji: "道",
        romaji: "DŌ",
        meaning: "Camino / Disciplina",
        description: "El ideograma de 'Camino' o sendero espiritual del guerrero (Budō). Consta de 12 trazos tradicionales.",
        strokes: [
            { id: 1, name: "Punto superior izquierdo", path: "M 48,15 C 51,18 54,22 55,25", start: [48, 15], end: [55, 25] },
            { id: 2, name: "Punto superior derecho", path: "M 74,13 C 71,17 68,22 66,25", start: [74, 13], end: [66, 25] },
            { id: 3, name: "Horizontal cabeza", path: "M 42,28 C 55,27 68,25 80,24", start: [42, 28], end: [80, 24] },
            { id: 4, name: "Vertical ojo izquierdo", path: "M 46,38 C 47,48 48,58 48,68", start: [46, 38], end: [48, 68] },
            { id: 5, name: "Esquina y vertical ojo", path: "M 48,39 C 60,37 72,36 78,35 C 79,45 79,56 79,66", start: [48, 39], end: [79, 66] },
            { id: 6, name: "Línea interior 1", path: "M 48,48 C 58,47 68,46 78,45", start: [48, 48], end: [78, 45] },
            { id: 7, name: "Línea interior 2", path: "M 48,57 C 58,56 68,55 78,54", start: [48, 57], end: [78, 54] },
            { id: 8, name: "Base de la cabeza", path: "M 48,67 C 58,66 68,65 79,65", start: [48, 67], end: [79, 65] },
            { id: 9, name: "Shinnyo punto inicial", path: "M 20,20 C 23,23 26,27 27,31", start: [20, 20], end: [27, 31] },
            { id: 10, name: "Shinnyo quiebre 1", path: "M 16,40 C 20,41 24,39 27,38 C 28,44 26,48 23,52", start: [16, 40], end: [23, 52] },
            { id: 11, name: "Shinnyo quiebre 2", path: "M 20,53 C 25,54 26,58 24,62 C 22,66 18,72 15,75", start: [20, 53], end: [15, 75] },
            { id: 12, name: "Shinnyo ola deslizante", path: "M 14,75 C 22,76 34,80 48,83 C 62,86 78,88 92,89", start: [14, 75], end: [92, 89] },
        ]
    }
];
