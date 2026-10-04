import { KanjiCharDef } from "@/types/didactica";

export const SHOTOKAN_KANJIS: KanjiCharDef[] = [
    {
        kanji: "松",
        romaji: "SHŌ",
        meaning: "Pino",
        description: "El pino centenario: representa la resistencia inquebrantable ante el invierno y el monte Torao en Okinawa.",
        strokes: [
            { id: 1, name: "Horizontal de madera", path: "M 14,40 C 24,39 36,38 46,37", start: [14, 40], end: [46, 37] },
            { id: 2, name: "Vertical de tronco", path: "M 32,16 C 32.5,35 32.5,60 32.5,88", start: [32, 16], end: [32.5, 88] },
            { id: 3, name: "Diagonal izquierda (rama)", path: "M 31,43 C 27,55 20,68 12,78", start: [31, 43], end: [12, 78] },
            { id: 4, name: "Punto derecho (rama)", path: "M 35,48 C 39,53 43,60 46,65", start: [35, 48], end: [46, 65] },
            { id: 5, name: "Diagonal superior izquierda", path: "M 62,20 C 58,28 52,38 48,45", start: [62, 20], end: [48, 45] },
            { id: 6, name: "Diagonal superior derecha", path: "M 74,20 C 79,28 85,38 89,46", start: [74, 20], end: [89, 46] },
            { id: 7, name: "Trazo quebrado inferior", path: "M 62,54 C 68,52 76,51 80,51 C 81,56 79,66 64,78", start: [62, 54], end: [64, 78] },
            { id: 8, name: "Diagonal descendente base", path: "M 68,56 C 73,62 80,72 88,82", start: [68, 56], end: [88, 82] },
        ]
    },
    {
        kanji: "濤",
        romaji: "TŌ",
        meaning: "Olas",
        description: "El oleaje continuo: evoca el susurro del viento entre las copas de los pinos y la fluidez del mar.",
        strokes: [
            { id: 1, name: "Gota de agua superior", path: "M 18,22 C 20,25 22,29 23,32", start: [18, 22], end: [23, 32] },
            { id: 2, name: "Gota de agua media", path: "M 15,44 C 18,47 20,51 21,54", start: [15, 44], end: [21, 54] },
            { id: 3, name: "Ascendente de agua", path: "M 14,78 C 17,73 22,65 26,58", start: [14, 78], end: [26, 58] },
            { id: 4, name: "Horizontal superior de ola", path: "M 38,24 C 54,22 70,20 84,20", start: [38, 24], end: [84, 20] },
            { id: 5, name: "Horizontal medio de cresta", path: "M 42,37 C 55,35 68,34 80,34", start: [42, 37], end: [80, 34] },
            { id: 6, name: "Horizontal largo central", path: "M 34,50 C 52,48 72,46 90,46", start: [34, 50], end: [90, 46] },
            { id: 7, name: "Vertical central superior", path: "M 60,14 C 60,26 60,38 60,50", start: [60, 14], end: [60, 50] },
            { id: 8, name: "Barrido izquierdo de ola", path: "M 52,52 C 48,60 42,70 34,78", start: [52, 52], end: [34, 78] },
            { id: 9, name: "Columna de marea con gancho", path: "M 62,50 C 63,62 63,78 63,86 C 63,92 58,91 52,86", start: [62, 50], end: [52, 86] },
            { id: 10, name: "Punto de rompiente", path: "M 74,62 C 77,66 82,72 85,76", start: [74, 62], end: [85, 76] },
        ]
    },
    {
        kanji: "館",
        romaji: "KAN",
        meaning: "Casa / Dojo",
        description: "El salón o escuela: el recinto donde los practicantes se reúnen para forjar el espíritu y el carácter.",
        strokes: [
            { id: 1, name: "Diagonal techo izquierdo", path: "M 28,16 C 24,22 19,28 14,34", start: [28, 16], end: [14, 34] },
            { id: 2, name: "Tejado superior", path: "M 27,24 C 33,22 38,21 42,21 C 43,26 38,34 32,40", start: [27, 24], end: [32, 40] },
            { id: 3, name: "Horizontal medio de recinto", path: "M 18,46 C 26,44 34,43 40,43", start: [18, 46], end: [40, 43] },
            { id: 4, name: "Pilar izquierdo de dojo", path: "M 20,53 C 21,63 21,73 21,83", start: [20, 53], end: [21, 83] },
            { id: 5, name: "Base y contrafuerte", path: "M 21,54 C 28,52 36,51 40,51 C 41,60 41,72 41,83 C 35,83 27,83 21,83", start: [21, 54], end: [21, 83] },
            { id: 6, name: "Punto cimero de dojo", path: "M 66,15 C 67,18 67,22 67,25", start: [66, 15], end: [67, 25] },
            { id: 7, name: "Alero derecho de salón", path: "M 52,28 C 64,26 78,25 86,25 C 88,25 89,28 87,32 C 85,36 83,38 81,40", start: [52, 28], end: [81, 40] },
            { id: 8, name: "Cámara interior", path: "M 57,44 C 66,42 75,41 80,41 C 81,46 80,50 79,54 C 73,54 64,55 57,55", start: [57, 44], end: [57, 55] },
            { id: 9, name: "Muro inferior", path: "M 56,62 C 57,70 57,78 57,84 C 64,84 72,83 78,83", start: [56, 62], end: [78, 83] },
            { id: 10, name: "Pilar maestro con gancho", path: "M 78,60 C 79,68 79,78 79,86 C 79,92 74,91 68,87", start: [78, 60], end: [68, 87] },
        ]
    }
];
