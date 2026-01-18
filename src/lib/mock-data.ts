export interface FeedItem {
    id: string;
    title: string;
    description: string;
    image: string;
    category: "news" | "event" | "training";
    isPremium: boolean;
    date: string;
    className?: string;
}

export const feedItems: FeedItem[] = [
    {
        id: "1",
        title: "Resultados: Torneo Nacional 2025",
        description: "Nuestros atletas consiguieron 15 medallas de oro en el último campeonato. Conoce a los ganadores.",
        image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=2072&auto=format&fit=crop", // Karate competition placeholder
        category: "news",
        isPremium: false,
        date: "12 Ene, 2025",
        className: "md:col-span-2",
    },
    {
        id: "2",
        title: "Masterclass: Secretos del Kata Unsu",
        description: "Análisis biomecánico detallado para perfeccionar tus saltos y giros en este kata avanzado.",
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop", // Training placeholder (Fixed)
        category: "training",
        isPremium: true,
        date: "10 Ene, 2025",
        className: "md:col-span-1",
    },
    {
        id: "3",
        title: "Seminario Internacional con Sensei Tanaka",
        description: "Fecha confirmada para octubre. Inscripciones abiertas exclusivamente para miembros.",
        image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop", // Seminar placeholder
        category: "event",
        isPremium: true,
        date: "05 Ene, 2025",
        className: "md:col-span-1",
    },
    {
        id: "4",
        title: "Galería: Exámenes de Grado",
        description: "Las mejores fotos de la última jornada de evaluación de cinturones negros.",
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=2069&auto=format&fit=crop", // Dojo placeholder
        category: "news",
        isPremium: false,
        date: "01 Ene, 2025",
        className: "md:col-span-2",
    },
];
