export type PathType = 'tradicional' | 'wkf';

export type QuestionType = 
    | 'multiple_choice' 
    | 'image_choice' 
    | 'matching' 
    | 'true_false'
    | 'kanji_draw';

export interface MatchingPair {
    id: string;
    left: string;
    right: string;
}

export interface KanjiStrokeDef {
    id: number;
    path: string;
    start: [number, number];
    end: [number, number];
    name: string;
}

export interface KanjiCharDef {
    kanji: string;
    romaji: string;
    meaning: string;
    description: string;
    strokes: KanjiStrokeDef[];
}

export interface BookReference {
    title: string;
    author: string;
    year?: string | number;
    editorial?: string;
    chapter?: string;
    note?: string;
}

export interface Question {
    id: string;
    type: QuestionType;
    prompt: string;
    description?: string;
    image?: string; // Optional image (referee, body, gi, etc.)
    options?: {
        id: string;
        text: string;
        image?: string;
        isCorrect: boolean;
    }[];
    correctAnswerId?: string; // for multiple_choice / image_choice
    pairs?: MatchingPair[]; // for matching questions
    correctBool?: boolean; // for true_false
    kanjiList?: KanjiCharDef[]; // for kanji_draw questions
    explanation: string; // Pedagogical explanation shown upon answering
    hint?: string;
    references?: (string | BookReference)[]; // Book references & documentary origins
    bibliography?: (string | BookReference)[]; // Alias for references
}

export interface TheorySection {
    title: string;
    subtitle?: string;
    quote?: string;
    content: string[]; // Paragraphs
    images?: {
        src: string;
        alt: string;
        caption?: string;
    }[];
    bulletPoints?: {
        title: string;
        desc: string;
        badge?: string;
        image?: string;
    }[];
    references?: (string | BookReference)[];
}

export interface Level {
    id: string;
    number: number;
    title: string;
    subtitle: string;
    tag: string;
    icon: string; // phosphor icon name or emoji
    color: string; // gold, red, blue, emerald
    theory: TheorySection;
    questions: Question[];
    xpReward: number;
}

export interface Unit {
    id: string;
    title: string;
    description: string;
    path: PathType;
    beltId?: BeltRankId;
    levels: Level[];
}

export type BeltRankId =
    | 'kyu-10'
    | 'kyu-9'
    | 'kyu-8'
    | 'kyu-7'
    | 'kyu-6'
    | 'kyu-5'
    | 'kyu-4'
    | 'kyu-3'
    | 'kyu-2'
    | 'kyu-1'
    | 'dan-1'
    | 'dan-2'
    | 'dan-3'
    | 'dan-4'
    | 'dan-5'
    | 'dan-6'
    | 'dan-7'
    | 'dan-8'
    | 'dan-9'
    | 'dan-10';

export interface BeltRank {
    id: BeltRankId;
    order: number; // 1 to 20
    category: 'kyu' | 'dan';
    levelNumber: number; // 10 to 1 for kyu, 1 to 10 for dan
    name: string; // e.g. "10° Kyu - Blanco"
    shortName: string; // e.g. "10° Kyu" / "1° Dan"
    japaneseName: string; // e.g. "白帯 - Shiro Obi" / "初段 - Shodan"
    kanji: string; // "白帯", "初段", etc.
    color: string; // Primary base color hex
    strokeColor: string; // Border stroke color
    textColor: string; // Contrast text color
    bgGradient: string; // Tailored CSS gradient for badges
    hasStripe?: boolean;
    stripeColor?: string; // White or Gold
    stripesCount?: number; // 1, 2, 3 or Dan number (1-10)
    theme: string; // Evocative martial title
    motto: string; // Guiding philosophical motto
    description: string; // Cultural & technical meaning
    icon: string; // Distinctive martial symbol emoji / icon
}

export interface UserDidacticProgress {
    completedLevelIds: string[];
    levelStars: Record<string, number>; // levelId -> 1 to 3 stars
    xp: number;
    streak: number;
    lastActiveDate: string; // YYYY-MM-DD
    hearts: number; // Max 5
    lastHeartRefill: number; // timestamp
    activePath: PathType;
    activeBeltId?: BeltRankId;
    lastVisitedTimestamp?: number; // timestamp de última visita al dojo
    levelLastPracticed?: Record<string, number>; // levelId -> timestamp de última práctica
}

export type MascotMood = 
    | 'idle' 
    | 'thinking' 
    | 'correct' 
    | 'wrong' 
    | 'streak' 
    | 'completed'
    | 'low_hearts'
    | 'sad'
    | 'crying';
