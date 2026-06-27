// Library of Exercise GIFs for Routine Player
// Source: Open Source GitHub Repos (yuhonas/free-exercise-db)

export const EXERCISE_GIFS: Record<string, string> = {
    // Basic / Cardio
    "Jumping Jacks": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/jumping-jack.gif",
    "Burpees": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/burpee.gif",
    "Mountain Climbers": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/mountain-climber.gif",
    "High Knees": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/run-high-knees.gif",

    // Legs
    "Sentadillas": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/squat-jump.gif",
    "Squats": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/squat-jump.gif",
    "Zancadas": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/dumbbell-lunge.gif",
    "Lunges": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/dumbbell-lunge.gif",

    // Upper Body
    "Flexiones": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/push-up.gif",
    "Pushups": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/push-up.gif",
    "Dominadas": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/pull-up.gif",
    "Pullups": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/pull-up.gif",
    "Bicep Curl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/dumbbell-bicep-curl.gif",
    "Biceps": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/dumbbell-bicep-curl.gif",
    "Press Militar": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/dumbbell-shoulder-press.gif",
    "Patada de Tríceps": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/dumbbell-kickback.gif",
    "Patada de Triceps con MediaPipe": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/dumbbell-kickback.gif",
    "Tricep Kickback": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/dumbbell-kickback.gif",

    // Core
    "Plancha": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/plank.gif",
    "Plank": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/plank.gif",
    "Crunches": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/crunch.gif",
    "Abdominales": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/crunch.gif",

    // Karate Specific (Mappings to closest gym movements for now)
    "Tsuki": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/boxing-punches.gif",
    "Geri": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/high-kick.gif",
};

export const getExerciseGif = (name: string): string | null => {
    // Direct Match
    if (EXERCISE_GIFS[name]) return EXERCISE_GIFS[name];

    // Fuzzy / Partial Match
    const keys = Object.keys(EXERCISE_GIFS);
    const lowerName = name.toLowerCase();

    const match = keys.find(k => lowerName.includes(k.toLowerCase()));
    return match ? EXERCISE_GIFS[match] : null;
};
