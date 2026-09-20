"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { WKFScoreboard } from "@/components/didactic/WKFScoreboard";
import { HumanBody } from "@/components/didactic/HumanBody";
import {
    BookOpen,
    MagnifyingGlass,
    ArrowLeft,
    X,
    Scroll,
    User,
    Shield,
    Trophy,
    WarningOctagon,
    Target
} from "@phosphor-icons/react";

interface Article {
    id: string;
    title: string;
    category: "tradicional" | "wkf";
    tag: string;
    description: string;
    image: string;
    content: React.ReactNode;
}

interface DidacticEncyclopediaProps {
    onBackToMap: () => void;
}

export function DidacticEncyclopedia({ onBackToMap }: DidacticEncyclopediaProps) {
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState<"all" | "tradicional" | "wkf">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // ARTICLES REPOSITORY PRESERVING ALL 7 ORIGINAL SECTIONS
    const ARTICLES: Article[] = [
        {
            id: "karategi",
            title: "Historia del Karate-Do",
            category: "tradicional",
            tag: "Historia & Filosofía",
            description: "Origen, evolución y significado del uniforme blanco en el Camino del Guerrero.",
            image: "/images/kuma-karategui-partes.jpg",
            content: (
                <div className="space-y-8 text-zinc-300 leading-relaxed text-justify">
                    <div className="bg-white/5 border-l-4 border-kuma-gold p-6 rounded-r-2xl">
                        <p className="font-serif italic text-xl text-kuma-gold mb-2">
                            "El uniforme de karate, o karategi, no es originario de Okinawa..."
                        </p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-2xl mx-auto">
                        <Image
                            src="/images/kuma-karategui-partes.jpg"
                            alt="Partes del Karategui Kuma Dojo"
                            width={800}
                            height={800}
                            className="w-full h-auto object-cover"
                            priority
                        />
                        <p className="p-3 bg-black/90 text-center text-xs text-zinc-400 uppercase tracking-widest font-bold">
                            Fig 1. Estructura y Partes del Uniforme Kuma Dojo
                        </p>
                    </div>

                    <p>
                        Tradicionalmente en Okinawa, la práctica se realizaba con ropa cotidiana o el torso desnudo debido al clima tropical.
                        Su estandarización ocurrió en <strong>1922</strong>, cuando el maestro <strong>Gichin Funakoshi</strong> viajó a Tokio para demostrar su arte.
                    </p>
                    <p>
                        Siguiendo el consejo de <strong>Jigoro Kano</strong> —fundador del Judo—, adoptó la vestimenta formal del <em>Keikogi</em> para legitimar el karate ante la
                        <strong> Dai Nippon Butoku Kai</strong> y alinearlo con la etiqueta del Budo japonés moderno (Cook, 2001; Funakoshi, 1975).
                    </p>
                    <p>
                        Esta adopción pragmática del uniforme de judo, aligerado para permitir la fluidez de los golpes, transformó la identidad visual del karate al
                        <strong> eliminar las distinciones de clase social</strong> entre los practicantes.
                    </p>
                    <p>
                        El uso del color blanco se estableció no solo por razones de higiene impulsadas por Kano, sino también por su simbolismo filosófico de
                        <strong> "vacío" (Kara)</strong>, representando una mente limpia de ego y preparada para el aprendizaje (Kano, 1986; Lowry, 2006).
                    </p>

                    <div className="pt-8 mt-8 border-t border-white/10 text-xs text-zinc-500 font-mono">
                        <h4 className="font-bold text-zinc-400 uppercase tracking-widest mb-2">Bibliografía & Referencias</h4>
                        <ul className="space-y-1 list-disc pl-5">
                            <li>Cook, H. (2001). <em>Shotokan Karate: A Precise History.</em> Inglaterra: Harry Cook.</li>
                            <li>Funakoshi, G. (1975). <em>Karate-Do: My Way of Life.</em> Tokio, Japón: Kodansha International.</li>
                            <li>Kano, J. (1986). <em>Kodokan Judo.</em> Tokio, Japón: Kodansha International.</li>
                            <li>Lowry, D. (2006). <em>In the Dojo: A Guide to the Rituals and Etiquette...</em> Boston, MA: Weatherhill.</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "cuerpo-humano",
            title: "Cuerpo Humano en Japonés",
            category: "tradicional",
            tag: "Anatomía Kuma",
            description: "Estudio del cuerpo humano en japonés. Puntos vitales (Kyusho) y terminología esencial.",
            image: "/images/kuma-partes-cuerpo.jpg",
            content: (
                <div className="space-y-8 text-zinc-300 leading-relaxed">
                    <p className="text-justify">
                        En la formación marcial del Karate Kuma, comprender la anatomía y los niveles de impacto es crucial para garantizar tanto la eficacia técnica como la seguridad y el control milimétrico sobre el tatami.
                    </p>
                    <HumanBody />
                </div>
            )
        },
        {
            id: "kumite",
            title: "Kumite (WKF & Tradicional)",
            category: "tradicional",
            tag: "Combate & Estrategia",
            description: "Evolución histórica del combate: del Tegumi al Jiyu Kumite deportivo.",
            image: "/images/kuma-reglamento-kumite.jpg",
            content: (
                <div className="space-y-8 text-zinc-300 leading-relaxed text-justify">
                    <div className="bg-white/5 border-l-4 border-kuma-gold p-6 rounded-r-2xl">
                        <p className="font-serif italic text-xl text-kuma-gold mb-2">
                            "El término Kumite (組手) se traduce literalmente al español como 'entrelazar manos'..."
                        </p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-2xl mx-auto">
                        <Image
                            src="/images/kuma-reglamento-kumite.jpg"
                            alt="Kumite - Kuma Dojo"
                            width={800}
                            height={800}
                            className="w-full h-auto object-cover"
                            priority
                        />
                        <p className="p-3 bg-black/90 text-center text-xs text-zinc-400 uppercase tracking-widest font-bold">
                            Fig 2. Encuentro Dinámico y Gestión de la Distancia (Maai)
                        </p>
                    </div>

                    <p>
                        Hace referencia a su origen arcaico vinculado al <em>Tegumi</em> (lucha sumatoria de Okinawa) más que al combate de percusión a distancia.
                        En la visión más tradicional y antigua del karate okinawense, el combate libre (<em>Jiyu Kumite</em>) apenas existía; la práctica se centraba casi exclusivamente en los Katas (formas) y el endurecimiento físico.
                    </p>
                    <p>
                        Los maestros clásicos consideraban que las técnicas eran demasiado letales para probarse libremente sin reglas, por lo que el entrenamiento en parejas se limitaba al
                        <strong> Yakusoku Kumite</strong> (combate preestablecido), diseñado para analizar la aplicación práctica (Bunkai) de los movimientos del kata bajo la filosofía del
                        <em> Ikken Hissatsu</em> o "un golpe, una muerte", donde la eficiencia primaba sobre el intercambio deportivo (Cook, 2001; Nagamine, 1976).
                    </p>
                    <p>
                        La transformación hacia el combate que vemos hoy, con dos oponentes midiéndose dinámicamente, surgió tras la introducción del karate en Japón continental en la década de 1920.
                        Fue impulsada principalmente por los clubes universitarios de Tokio y por figuras innovadoras como <strong>Yoshitaka Funakoshi</strong>, quien desarrolló el combate libre para satisfacer el deseo de los jóvenes estudiantes de probar su habilidad de manera competitiva, influenciados por el Kendo y el Judo modernos.
                    </p>
                    <p>
                        Esta evolución cambió el enfoque: el kumite pasó de ser una herramienta de supervivencia civil a un método de educación física y espiritual (Budo), donde el control, la distancia (Maai) y el tiempo (Timing) se volvieron los criterios esenciales para validar una técnica, sentando las bases para la reglamentación deportiva actual de la WKF (Funakoshi, 1973; Johnson, 2012).
                    </p>

                    <div className="pt-8 mt-8 border-t border-white/10 text-xs text-zinc-500 font-mono">
                        <h4 className="font-bold text-zinc-400 uppercase tracking-widest mb-2">Bibliografía & Referencias</h4>
                        <ul className="space-y-1 list-disc pl-5">
                            <li>Cook, H. (2001). <em>Shotokan Karate: A Precise History.</em> Harry Cook.</li>
                            <li>Funakoshi, G. (1973). <em>Karate-Do Kyohan: The Master Text.</em> Kodansha International.</li>
                            <li>Johnson, N. (2012). <em>The History of Karate: Okinawan and Japanese Styles.</em> Tuttle Publishing.</li>
                            <li>Nagamine, S. (1976). <em>The Essence of Okinawan Karate-Do.</em> Tuttle Publishing.</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            id: "reglas-wkf",
            title: "Reglas del Kumite WKF & 6 Criterios",
            category: "wkf",
            tag: "Reglamento Deportivo",
            description: "Historia de la WKF, consenso internacional y los 6 Criterios Técnicos de puntuación.",
            image: "/images/kuma-intro-puntos.jpg",
            content: (
                <div className="space-y-8 text-zinc-300 leading-relaxed">
                    <div className="bg-white/5 border-l-4 border-kuma-gold p-6 rounded-r-2xl">
                        <h3 className="text-xl md:text-2xl font-serif font-black text-kuma-gold mb-2">
                            El Consenso: De Shobu Ippon al Reglamento WKF
                        </h3>
                        <p className="text-sm md:text-base text-zinc-300 leading-relaxed text-justify">
                            La evolución del reglamento de kumite representa uno de los cambios más significativos en la historia moderna del Karate. Originalmente, bajo el sistema tradicional de <em>Shobu Ippon</em> ("un punto definitivo"), los combates buscaban emular un enfrentamiento real donde un solo golpe perfecto (Kime) decidiría el resultado. Este enfoque, aunque filosóficamente profundo, presentaba desafíos para la estandarización global y la seguridad de los atletas (Abernethy, 2013).
                        </p>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl max-w-3xl mx-auto">
                        <Image
                            src="/images/kuma-intro-puntos.jpg"
                            alt="Sistema de Puntuación WKF"
                            width={1200}
                            height={800}
                            className="w-full h-auto object-cover"
                            priority
                        />
                        <p className="p-3 bg-black/90 text-center text-xs text-zinc-400 uppercase tracking-widest font-bold">
                            Sistema de Puntuación Oficial WKF
                        </p>
                    </div>

                    <div className="pt-6">
                        <h3 className="text-2xl font-serif font-black text-kuma-gold mb-8 text-center">
                            Los 6 Criterios Técnicos Oficiales
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "1. Buena Forma",
                                    desc: "Técnica con características de eficacia probable dentro de los conceptos tradicionales del Karate. Debe mostrar pureza de movimiento y mecánica corporal correcta.",
                                    img: "/images/kuma-buena-forma.jpg",
                                },
                                {
                                    title: "2. Actitud Deportiva",
                                    desc: "Refleja una actitud no maliciosa y de gran concentración durante la ejecución. El competidor debe mostrar respeto y compostura durante toda la acción.",
                                    img: "/images/kuma-actitud-deportiva.jpg",
                                },
                                {
                                    title: "3. Aplicación Vigorosa",
                                    desc: "Demuestra potencia y velocidad en la técnica con una clara voluntad de éxito. El golpe debe ser contundente pero controlado, mostrando eficacia real.",
                                    img: "/images/kuma-aplicacion-vigorosa.jpg",
                                },
                                {
                                    title: "4. Zanshin (Alerta)",
                                    desc: "Estado de compromiso mental y físico continuado tras el ataque (Awareness). Se mantiene total atención en el oponente, listo para continuar la acción.",
                                    img: "/images/kuma-zanshing-v2.jpg",
                                },
                                {
                                    title: "5. Buen Timing",
                                    desc: "Ejecución de la técnica en el momento preciso de máxima efectividad. Se busca sorprender al oponente en un instante de vulnerabilidad.",
                                    img: "/images/kuma-buen-timing.jpg",
                                },
                                {
                                    title: "6. Distancia Correcta",
                                    desc: "El golpe llega al punto de impacto con precisión (skin touch o hasta 5-10cm). Es la distancia donde la técnica alcanza su mayor potencial sin causar lesiones.",
                                    img: "/images/kuma-distancia-correcta.jpg",
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-kuma-gold/40 transition-colors flex flex-col">
                                    <div className="relative w-full aspect-[4/3] bg-black">
                                        <Image
                                            src={item.img}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-serif font-black text-white text-base mb-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-zinc-400 leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "puntos-kumite",
            title: "Sistema de Puntos (Yuko, Waza-ari, Ippon)",
            category: "wkf",
            tag: "Puntuación WKF",
            description: "Valoración técnica y señales oficiales de los jueces: IPPON (3), WAZA-ARI (2) y YUKO (1).",
            image: "/images/kuma-arbitro-puntos.jpg",
            content: (
                <div className="space-y-12 text-zinc-300 leading-relaxed">
                    {/* IPPON */}
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-red-500">3 Puntos</span>
                                <h3 className="text-3xl md:text-4xl font-serif font-black text-white">IPPON</h3>
                            </div>
                            <p className="text-sm text-zinc-400 max-w-md">
                                Patadas a la zona alta (Jodan Geri) o cualquier técnica puntuable sobre un oponente caído.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black">
                                <Image
                                    src="/images/kuma-arbitro-puntos-ippon.jpg"
                                    alt="Ippon de Pie"
                                    fill
                                    className="object-contain p-2"
                                />
                                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] text-zinc-300 font-bold uppercase">De Pie</span>
                            </div>
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black">
                                <Image
                                    src="/images/kuma-arbitro-puntos-ippon-sentado.jpg"
                                    alt="Ippon Sentado"
                                    fill
                                    className="object-contain p-2"
                                />
                                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] text-zinc-300 font-bold uppercase">Juez de Esquina</span>
                            </div>
                        </div>
                    </div>

                    {/* WAZA-ARI */}
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">2 Puntos</span>
                                <h3 className="text-3xl md:text-4xl font-serif font-black text-white">WAZA-ARI</h3>
                            </div>
                            <p className="text-sm text-zinc-400 max-w-md">
                                Patadas a la zona media (Chudan Geri) en abdomen, torso o espalda.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black">
                                <Image
                                    src="/images/kuma-arbitro-puntos-waza-ari.jpg"
                                    alt="Waza-ari de Pie"
                                    fill
                                    className="object-contain p-2"
                                />
                                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] text-zinc-300 font-bold uppercase">De Pie</span>
                            </div>
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black">
                                <Image
                                    src="/images/kuma-arbitro-puntos-waza-ari-sentado.jpg"
                                    alt="Waza-ari Sentado"
                                    fill
                                    className="object-contain p-2"
                                />
                                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] text-zinc-300 font-bold uppercase">Juez de Esquina</span>
                            </div>
                        </div>
                    </div>

                    {/* YUKO */}
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-6">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">1 Punto</span>
                                <h3 className="text-3xl md:text-4xl font-serif font-black text-white">YUKO</h3>
                            </div>
                            <p className="text-sm text-zinc-400 max-w-md">
                                Tsuki (puño directo) a zona media o alta, o Uchi (golpe circular) a la cabeza con control absoluto.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black">
                                <Image
                                    src="/images/kuma-arbitro-puntos-yuko.jpg"
                                    alt="Yuko de Pie"
                                    fill
                                    className="object-contain p-2"
                                />
                                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] text-zinc-300 font-bold uppercase">De Pie</span>
                            </div>
                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black">
                                <Image
                                    src="/images/kuma-arbitro-puntos-yuko-sentado.jpg"
                                    alt="Yuko Sentado"
                                    fill
                                    className="object-contain p-2"
                                />
                                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/80 rounded text-[10px] text-zinc-300 font-bold uppercase">Juez de Esquina</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "penalizaciones",
            title: "Penalizaciones & Marcador Arbitral",
            category: "wkf",
            tag: "Reglamento & Sanciones",
            description: "Simulador interactivo del marcador WKF con señales para Chui 1-3, Hansoku-Chui, Hansoku y Shikkaku.",
            image: "/images/kuma-arbitro.jpg",
            content: (
                <div className="space-y-8 text-zinc-300 leading-relaxed">
                    <p className="text-justify">
                        Usa el simulador oficial del marcador WKF para interactuar con las penalizaciones de AO (azul) y AKA (rojo). Podrás ver en tiempo real cómo cambia la señal fotográfica del árbitro según el nivel de sanción asignado.
                    </p>
                    <WKFScoreboard />
                </div>
            )
        }
    ];

    // Filter articles
    const filteredArticles = ARTICLES.filter((art) => {
        const matchesCat = filterCategory === "all" || art.category === filterCategory;
        const matchesQuery =
            art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            art.tag.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesQuery;
    });

    const activeArticle = ARTICLES.find((a) => a.id === selectedArticleId);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* TOP BAR WITH BACK / EXIT BUTTON */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <button
                    onClick={onBackToMap}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-red-950/40 text-zinc-200 hover:text-red-400 border border-white/20 hover:border-red-500/40 text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer group"
                    title="Salir de la enciclopedia y volver al camino de lecciones"
                >
                    <X className="w-4 h-4 text-zinc-400 group-hover:text-red-400" weight="bold" />
                    <span>Salir a Kuma Sensei Academy</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-kuma-gold">
                    <BookOpen className="w-5 h-5" weight="duotone" />
                    <span>Biblioteca & Enciclopedia Kuma</span>
                </div>
            </div>

            {/* IF VIEWING A SPECIFIC ARTICLE */}
            {activeArticle ? (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedArticleId(null)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 hover:text-white border border-white/15 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Índice de Artículos</span>
                            </button>
                            <span className="text-zinc-600">/</span>
                            <span className="text-xs text-kuma-gold uppercase font-bold tracking-widest">
                                {activeArticle.tag}
                            </span>
                        </div>

                        {/* Quick Exit Button directly to the Game Map */}
                        <button
                            onClick={onBackToMap}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/40 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                            title="Volver al mapa de lecciones"
                        >
                            <X className="w-4 h-4" weight="bold" />
                            <span>Salir al Camino</span>
                        </button>
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-5xl font-serif font-black text-white leading-tight">
                            {activeArticle.title}
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-base mt-2">
                            {activeArticle.description}
                        </p>
                    </div>

                    <div className="p-6 md:p-10 rounded-3xl bg-zinc-900/60 border border-white/10 backdrop-blur-md">
                        {activeArticle.content}
                    </div>

                    <div className="pt-8 flex flex-wrap items-center justify-center gap-4 border-t border-white/10">
                        <button
                            onClick={() => setSelectedArticleId(null)}
                            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs uppercase font-black tracking-wider transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Volver al Índice de Artículos</span>
                        </button>
                        <button
                            onClick={onBackToMap}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-kuma-gold hover:brightness-110 text-zinc-950 text-xs uppercase font-black tracking-wider transition-all shadow-xl shadow-kuma-gold/20 flex items-center gap-2 cursor-pointer"
                        >
                            <X className="w-4 h-4" weight="bold" />
                            <span>Salir a Kuma Sensei Academy</span>
                        </button>
                    </div>
                </div>
            ) : (
                /* ARTICLE INDEX LISTING */
                <div className="space-y-8">
                    {/* FILTERS & SEARCH */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                        {/* CATEGORY SWITCHER */}
                        <div className="flex items-center gap-2 bg-zinc-900/90 border border-white/10 p-1 rounded-2xl">
                            <button
                                onClick={() => setFilterCategory("all")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                    filterCategory === "all"
                                        ? "bg-kuma-gold text-zinc-950 font-black shadow-md shadow-kuma-gold/20"
                                        : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                Todos ({ARTICLES.length})
                            </button>
                            <button
                                onClick={() => setFilterCategory("tradicional")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                    filterCategory === "tradicional"
                                        ? "bg-kuma-gold text-zinc-950 font-black shadow-md shadow-kuma-gold/20"
                                        : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                🥋 Tradicional
                            </button>
                            <button
                                onClick={() => setFilterCategory("wkf")}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                                    filterCategory === "wkf"
                                        ? "bg-kuma-gold text-zinc-950 font-black shadow-md shadow-kuma-gold/20"
                                        : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                🏆 Deportivo WKF
                            </button>
                        </div>

                        {/* SEARCH INPUT */}
                        <div className="relative w-full md:w-72">
                            <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Buscar en la enciclopedia..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-500 text-xs focus:outline-none focus:border-kuma-gold/50"
                            />
                        </div>
                    </div>

                    {/* ARTICLES GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => setSelectedArticleId(article.id)}
                                className="group cursor-pointer rounded-3xl bg-zinc-900/80 border border-white/10 hover:border-kuma-gold/50 transition-all duration-300 overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:shadow-kuma-gold/5 hover:-translate-y-1"
                            >
                                <div className="relative aspect-video w-full overflow-hidden bg-black">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/80 text-kuma-gold border border-kuma-gold/30 backdrop-blur-md">
                                            {article.tag}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-xl font-serif font-black text-white group-hover:text-kuma-gold transition-colors mb-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                                            {article.description}
                                        </p>
                                    </div>

                                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-kuma-gold">
                                        <span>Leer artículo completo</span>
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
