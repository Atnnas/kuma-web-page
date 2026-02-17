
export interface Point {
    type: "hit" | "hold";
    start: number;
    duration?: number;
    name?: string;
    pulses?: number[];
    played?: boolean;
    stopped?: boolean;
    playedPulses?: number[];
    isActive?: boolean;
}

export interface Kata {
    id: number;
    name: string;
    points: Point[];
    isCustom?: boolean;
}

// Biblioteca de katas por defecto (Vaciada por solicitud para reinicio manual)
export const DEFAULT_KATAS: Kata[] = [];
