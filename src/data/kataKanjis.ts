import { KanjiCharDef } from "@/types/didactica";

export const KATA_KANJIS: KanjiCharDef[] = [
    {
        kanji: "型",
        romaji: "KATA",
        meaning: "La Forma / Molde",
        description: "El molde tradicional estructurado: la biblioteca técnica en la memoria del cuerpo.",
        revealImage: "/images/didactic/kuma_kata_form.jpg",
        revealTitle: "¡KATA (型): LA FORMA TRADICIONAL!",
        revealSubtitle: "Tu biblioteca técnica: cuando no existían libros ni videos, los maestros grabaron las secuencias en su memoria motriz.",
        strokes: [
            { id: 1, name: "Horizontal superior izquierda", path: "M 18,22 C 28,21 38,20 46,20", start: [18, 22], end: [46, 20] },
            { id: 2, name: "Vertical izquierda", path: "M 30,14 C 30.5,23 30.5,33 30,42", start: [30, 14], end: [30, 42] },
            { id: 3, name: "Horizontal media izquierda", path: "M 16,33 C 26,32 36,31 46,31", start: [16, 33], end: [46, 31] },
            { id: 4, name: "Diagonal descendente izquierda", path: "M 42,14 C 42.5,26 41,38 34,48", start: [42, 14], end: [34, 48] },
            { id: 5, name: "Vertical derecha corta", path: "M 62,16 C 62.5,22 62.5,28 62.5,35", start: [62, 16], end: [62.5, 35] },
            { id: 6, name: "Gancho vertical derecho", path: "M 78,13 C 78.5,24 78.5,38 78.5,46 C 78.5,50 75,49 71,46", start: [78, 13], end: [71, 46] },
            { id: 7, name: "Horizontal superior de tierra", path: "M 28,62 C 42,60 58,60 72,60", start: [28, 62], end: [72, 60] },
            { id: 8, name: "Pilar vertical central", path: "M 50,52 C 50.5,62 50.5,74 50.5,84", start: [50, 52], end: [50.5, 84] },
            { id: 9, name: "Base horizontal ancha", path: "M 16,85 C 38,84 62,84 84,84", start: [16, 85], end: [84, 84] },
        ]
    },
    {
        kanji: "解",
        romaji: "BUNKAI",
        meaning: "La Aplicación Real",
        description: "El análisis práctico: comprender cómo cada movimiento formal es una llave, derribo o defensa real.",
        revealImage: "/images/didactic/kuma_kata_bunkai.jpg",
        revealTitle: "¡BUNKAI (解): APLICACIÓN REAL!",
        revealSubtitle: "¡El Kata no es un baile! Cada bloqueo desvía un golpe real, atrapa el brazo del oponente y lo derriba.",
        strokes: [
            { id: 1, name: "Diagonal superior izquierda", path: "M 32,16 C 27,22 22,28 16,33", start: [32, 16], end: [16, 33] },
            { id: 2, name: "Vertical izquierda de caja", path: "M 22,33 C 22.5,48 22.5,64 21,80", start: [22, 33], end: [21, 80] },
            { id: 3, name: "Marco superior quebrado", path: "M 23,34 C 32,32 39,32 44,32 C 45,46 44,62 43,78", start: [23, 34], end: [43, 78] },
            { id: 4, name: "Horizontal medio izquierdo", path: "M 23,48 C 30,47 36,47 43,47", start: [23, 48], end: [43, 47] },
            { id: 5, name: "Horizontal bajo izquierdo", path: "M 22,62 C 29,61 36,61 43,61", start: [22, 62], end: [43, 61] },
            { id: 6, name: "Vertical pasante interior", path: "M 33,33 C 33.5,48 33.5,65 33,88", start: [33, 33], end: [33, 88] },
            { id: 7, name: "Trazo quebrado superior derecho", path: "M 54,20 C 64,18 74,18 80,18 C 82,18 83,21 81,25 C 78,31 75,36 70,40", start: [54, 20], end: [70, 40] },
            { id: 8, name: "Diagonal descendente derecha", path: "M 68,22 C 65,30 60,38 52,44", start: [68, 22], end: [52, 44] },
            { id: 9, name: "Horizontal medio superior", path: "M 56,54 C 66,52 76,51 84,51", start: [56, 54], end: [84, 51] },
            { id: 10, name: "Horizontal largo inferior", path: "M 50,66 C 64,64 78,63 88,63", start: [50, 66], end: [88, 63] },
            { id: 11, name: "Columna vertical con gancho", path: "M 68,46 C 69,58 69,74 69,85 C 69,90 65,90 60,86", start: [68, 46], end: [60, 86] },
        ]
    }
];
