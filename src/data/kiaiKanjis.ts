import { KanjiCharDef } from "@/types/didactica";

export const KIAI_KANJIS: KanjiCharDef[] = [
    {
        kanji: "気",
        romaji: "KI",
        meaning: "Energía / Espíritu",
        description: "El soplo vital y la energía interior que se liberan con fuerza en el grito marcial.",
        revealImage: "/images/didactic/kuma_kiai_ki_energy.jpg",
        revealTitle: "¡KI (気): ENERGÍA & ESPÍRITU!",
        revealSubtitle: "El aire sale en ráfaga potente desde los pulmones unificando tu mente en el grito.",
        strokes: [
            { id: 1, name: "Diagonal superior izquierda", path: "M 56,18 C 50,23 42,28 34,31", start: [56, 18], end: [34, 31] },
            { id: 2, name: "Horizontal superior", path: "M 32,32 C 45,30 58,29 70,29", start: [32, 32], end: [70, 29] },
            { id: 3, name: "Horizontal medio", path: "M 36,44 C 47,42 58,41 68,41", start: [36, 44], end: [68, 41] },
            { id: 4, name: "Gancho curvado de energía", path: "M 32,54 C 42,53 58,52 64,52 C 67,52 68,56 67,62 C 65,72 68,82 78,85 C 82,86 85,83 87,77", start: [32, 54], end: [87, 77] },
            { id: 5, name: "Diagonal interior izquierda", path: "M 42,60 C 37,68 32,77 24,84", start: [42, 60], end: [24, 84] },
            { id: 6, name: "Punto descendente derecho", path: "M 48,64 C 52,69 56,75 60,80", start: [48, 64], end: [60, 80] },
        ]
    },
    {
        kanji: "合",
        romaji: "AI",
        meaning: "Unión / Blindaje",
        description: "La armonía y unión de la fuerza en el abdomen (Tanden) blindándolo como un escudo de hierro.",
        revealImage: "/images/didactic/kuma_kiai_ai_shield.jpg",
        revealTitle: "¡AI (合): UNIÓN & BLINDAJE!",
        revealSubtitle: "Toda la potencia se concentra en el abdomen como un escudo para protegerte y dar Kime al golpe.",
        strokes: [
            { id: 1, name: "Techo diagonal izquierdo", path: "M 50,14 C 44,22 35,32 20,40", start: [50, 14], end: [20, 40] },
            { id: 2, name: "Techo diagonal derecho", path: "M 52,16 C 60,24 70,33 82,41", start: [52, 16], end: [82, 41] },
            { id: 3, name: "Travesaño horizontal medio", path: "M 36,44 C 46,42 56,42 66,42", start: [36, 44], end: [66, 42] },
            { id: 4, name: "Pilar izquierdo de caja", path: "M 34,58 C 34.5,67 34.5,76 34.5,86", start: [34, 58], end: [34.5, 86] },
            { id: 5, name: "Marco superior y pilar derecho", path: "M 35,59 C 46,57 58,57 66,57 C 67,66 66.5,76 66,85", start: [35, 59], end: [66, 85] },
            { id: 6, name: "Base horizontal de cierre", path: "M 34.5,86 C 45,86 56,85.5 66.5,85", start: [34.5, 86], end: [66.5, 85] },
        ]
    }
];
