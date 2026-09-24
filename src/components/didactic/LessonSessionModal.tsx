"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Level, Question, MascotMood, PathType, BeltRank, BookReference } from "@/types/didactica";
import { KumaMascot } from "./KumaMascot";
import { TheorySheetModal } from "./TheorySheetModal";
import { KanjiDrawCanvas } from "./KanjiDrawCanvas";
import { MapOriginDragQuestion } from "./MapOriginDragQuestion";
import { TreePillarsQuestion } from "./TreePillarsQuestion";
import { didacticSound } from "@/lib/didacticSound";
import { DIDACTIC_UNITS } from "@/data/didacticaData";
import { getBeltRank } from "@/data/beltRanks";
import {
    Heart,
    X,
    Check,
    Scroll,
    SpeakerHigh,
    SpeakerSlash,
    CheckCircle,
    XCircle,
    Fire,
    Sparkle,
    ArrowRight,
    Trophy,
    Lightning,
    ArrowCounterClockwise,
    WarningCircle,
    BookBookmark,
    Star,
} from "@phosphor-icons/react";

function QuestionBibliography({
    references,
    variant = "correct",
    mascotMood = "thinking",
    strikeTrigger,
    activePath = "tradicional",
    activeBeltRank,
}: {
    references?: (string | BookReference)[];
    variant?: "correct" | "wrong";
    mascotMood?: MascotMood;
    strikeTrigger?: string | number;
    activePath?: PathType;
    activeBeltRank?: BeltRank;
}) {
    const [isOpen, setIsOpen] = useState(false);
    if (!references || references.length === 0) return null;

    const isCorrect = variant === "correct";
    const containerBorder = isCorrect ? "border-emerald-500/30 bg-black/50" : "border-rose-500/30 bg-black/50";
    const headerColor = isCorrect ? "text-emerald-300" : "text-amber-300";
    const authorColor = isCorrect ? "text-emerald-200/90" : "text-rose-200/90";
    const dividerColor = isCorrect ? "border-emerald-500/40" : "border-rose-500/40";

    return (
        <div className="mt-2.5">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                    isCorrect
                        ? "bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/40"
                        : "bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border-rose-500/40"
                }`}
            >
                <BookBookmark className="w-3.5 h-3.5 shrink-0" weight="fill" />
                <span>{isOpen ? "Ocultar fuentes ▲" : "📖 Ver fuentes históricas (opcional) ▼"}</span>
            </button>

            {isOpen && (
                <div className={`mt-2 p-3 rounded-xl border ${containerBorder} backdrop-blur-md text-left space-y-2 max-w-xl animate-in fade-in slide-in-from-top-1 duration-200`}>
                    {/* MOBILE ONLY: SENSEI SCHOLAR COMPANION CON POSTE Y ANIMACIÓN COMPLETA */}
                    <div className="md:hidden w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-amber-950/70 via-[#1E293B] to-[#0F172A] border border-[#FFC800]/50 shadow-md overflow-visible">
                        <div className="w-56 h-44 flex items-center justify-center overflow-visible relative">
                            <KumaMascot
                                size="md"
                                mood={mascotMood}
                                strikeTrigger={strikeTrigger}
                                path={activePath}
                                beltRank={activeBeltRank}
                                showBubble={false}
                                interactive={true}
                            />
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#FFC800] block mb-1">
                                📜 Kuma Sensei Académico (¡Tócalo para partir el poste!)
                            </span>
                            <p className="text-[11px] text-amber-100/90 leading-tight font-serif italic max-w-sm mx-auto">
                                &ldquo;Un verdadero karateka forja tanto el puño como el intelecto con las fuentes de los grandes maestros.&rdquo;
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${headerColor}`}>
                        <span>Bibliografía & Tratados de Origen</span>
                    </div>
                    <div className="space-y-1.5">
                        {references.map((item, idx) => {
                            if (typeof item === "string") {
                                return (
                                    <p key={idx} className={`text-xs text-slate-300 pl-2 border-l-2 ${dividerColor} leading-relaxed`}>
                                        📖 {item}
                                    </p>
                                );
                            }
                            return (
                                <div key={idx} className={`text-xs pl-2 border-l-2 ${dividerColor} space-y-0.5 leading-relaxed`}>
                                    <div className="flex items-baseline flex-wrap gap-x-2">
                                        <span className="text-amber-200 font-serif font-bold text-xs tracking-wide">
                                            &ldquo;{item.title}&rdquo;
                                        </span>
                                        <span className={`text-[10px] font-medium ${authorColor}`}>
                                            — {item.author} {item.year ? `(${item.year})` : ""}
                                        </span>
                                    </div>
                                    {(item.editorial || item.chapter) && (
                                        <div className="text-[10px] text-slate-400">
                                            {item.editorial && <span>Editorial: <strong className="text-slate-300 font-medium">{item.editorial}</strong></span>}
                                            {item.editorial && item.chapter && <span> • </span>}
                                            {item.chapter && <span className="text-slate-300 font-medium">{item.chapter}</span>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

interface LessonSessionModalProps {
    level: Level;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (levelId: string, stars: number, earnedXp: number) => void;
    currentStars?: number;
    initialHearts?: number;
    onHeartLost?: () => void;
    beltRank?: BeltRank;
}

export function LessonSessionModal({
    level,
    isOpen,
    onClose,
    onComplete,
    currentStars = 0,
    initialHearts = 5,
    onHeartLost,
    beltRank,
}: LessonSessionModalProps) {
    const activePath: PathType = level.id.startsWith("wkf") ? "wkf" : "tradicional";
    const { data: session } = useSession();
    const isSuperAdmin = Boolean(session?.user && (session.user as any).role === "super_admin");
    const parentUnit = DIDACTIC_UNITS.find((u) => u.levels.some((lvl) => lvl.id === level.id));
    const activeBeltRank = beltRank || (parentUnit?.beltId ? getBeltRank(parentUnit.beltId) : undefined);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hearts, setHearts] = useState(initialHearts);
    const [streak, setStreak] = useState(0);
    const [mascotMood, setMascotMood] = useState<MascotMood>("idle");
    const [customSpeech, setCustomSpeech] = useState<string | undefined>(undefined);
    const [isTheoryOpen, setIsTheoryOpen] = useState(false);
    const [earnedStars, setEarnedStars] = useState<number>(currentStars);
    const [isMuted, setIsMuted] = useState(false);

    // Selected state
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [selectedBool, setSelectedBool] = useState<boolean | null>(null);

    // Matching state
    const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
    const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
    const [selectedRightId, setSelectedRightId] = useState<string | null>(null);

    // Kanji drawing state
    const [isKanjiDrawn, setIsKanjiDrawn] = useState(false);
    const [isMapDragDone, setIsMapDragDone] = useState(false);
    const [isTreePillarsDone, setIsTreePillarsDone] = useState(false);

// Fisher-Yates shuffle helper para orden aleatorio
function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

    // Validation state
    const [answerStatus, setAnswerStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [isCompleted, setIsCompleted] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

    // PREGUNTAS EN ORDEN ALEATORIO: cada vez que se abre el nivel se barajan las preguntas y sus opciones
    const sessionQuestions = useMemo(() => {
        if (!isOpen || !level.questions) return [];
        // Si hay una pregunta introductoria de mapa ('q-karate-origen-mapas'), se mantiene al inicio
        const originQuestion = level.questions.find((q) => q.id === "q-karate-origen-mapas");
        const rest = level.questions.filter((q) => q.id !== "q-karate-origen-mapas");
        const list = originQuestion ? [originQuestion, ...shuffleArray(rest)] : shuffleArray(level.questions);

        return list.map((q) => {
            if (q.options && q.options.length > 1 && (q.type === "multiple_choice" || q.type === "image_choice")) {
                return {
                    ...q,
                    options: shuffleArray(q.options),
                };
            }
            return q;
        });
    }, [level.id, isOpen]);

    const currentQuestion: Question | undefined = sessionQuestions[currentIndex];
    const totalQuestions = sessionQuestions.length;
    const progressPercent = totalQuestions > 0 ? Math.round((currentIndex / totalQuestions) * 100) : 0;

    const handleRequestCancel = () => {
        didacticSound.playClick();
        setIsCancelConfirmOpen(true);
    };

    const handleConfirmCancel = () => {
        didacticSound.playClick();
        setIsCancelConfirmOpen(false);
        onClose();
    };

    useEffect(() => {
        setIsMuted(didacticSound.getMuted());
    }, []);

    useEffect(() => {
        if (isOpen) {
            setEarnedStars(currentStars);
        }
    }, [isOpen, currentStars, level.id]);

    // Lock background body scroll while lesson session is active
    useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    // Listen for Escape key to trigger cancellation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isTheoryOpen) {
                    setIsTheoryOpen(false);
                } else if (isCancelConfirmOpen) {
                    setIsCancelConfirmOpen(false);
                } else if (!isCompleted && !isFailed) {
                    handleRequestCancel();
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isTheoryOpen, isCancelConfirmOpen, isCompleted, isFailed, onClose]);

    // Reset selection only when moving to a NEW question (NOT when answering)
    useEffect(() => {
        setSelectedOptionId(null);
        setSelectedBool(null);
        setSelectedLeftId(null);
        setSelectedRightId(null);
        setMatchedPairIds([]);
        setIsKanjiDrawn(false);
        setIsMapDragDone(false);
        setIsTreePillarsDone(false);
        setAnswerStatus("idle");
        setMascotMood(streak >= 3 ? "streak" : "idle");
        setCustomSpeech(undefined);
    }, [currentIndex]);

    if (!isOpen || !currentQuestion) return null;

    const toggleMute = () => {
        const muted = didacticSound.toggleMute();
        setIsMuted(muted);
    };

    // Retry whole level with full hearts
    const handleRetry = () => {
        didacticSound.playClick();
        setCurrentIndex(0);
        setHearts(initialHearts || 5);
        setStreak(0);
        setCorrectCount(0);
        setIsCompleted(false);
        setIsFailed(false);
        setMascotMood("idle");
        setCustomSpeech("¡Nuevo intento! Mente en calma y concentración total.");
        setSelectedOptionId(null);
        setSelectedBool(null);
        setSelectedLeftId(null);
        setSelectedRightId(null);
        setMatchedPairIds([]);
        setIsKanjiDrawn(false);
        setIsMapDragDone(false);
        setIsTreePillarsDone(false);
        setAnswerStatus("idle");
    };

    // Matching logic
    const handleSelectLeft = (id: string) => {
        if (answerStatus !== "idle" || matchedPairIds.includes(id)) return;
        didacticSound.playClick();
        setSelectedLeftId(id);
        setMascotMood("thinking");

        if (selectedRightId) {
            checkPair(id, selectedRightId);
        }
    };

    const handleSelectRight = (id: string) => {
        if (answerStatus !== "idle" || matchedPairIds.includes(id)) return;
        didacticSound.playClick();
        setSelectedRightId(id);
        setMascotMood("thinking");

        if (selectedLeftId) {
            checkPair(selectedLeftId, id);
        }
    };

    const checkPair = (leftId: string, rightId: string) => {
        if (leftId === rightId) {
            didacticSound.playClick();
            const newMatched = [...matchedPairIds, leftId];
            setMatchedPairIds(newMatched);
            setSelectedLeftId(null);
            setSelectedRightId(null);

            if (newMatched.length === (currentQuestion.pairs?.length || 0)) {
                handleValidation(true);
            }
        } else {
            didacticSound.playWrong();
            setSelectedLeftId(null);
            setSelectedRightId(null);
            setMascotMood("wrong");
            setCustomSpeech("¡Esa pareja no coincide! Intenta de nuevo.");
            setTimeout(() => {
                setMascotMood(streak >= 3 ? "streak" : "idle");
                setCustomSpeech(undefined);
            }, 1800);
        }
    };

    const canCheck =
        currentQuestion.type === "multiple_choice" || currentQuestion.type === "image_choice"
            ? selectedOptionId !== null
            : currentQuestion.type === "true_false"
            ? selectedBool !== null
            : currentQuestion.type === "matching"
            ? matchedPairIds.length === (currentQuestion.pairs?.length || 0)
            : currentQuestion.type === "kanji_draw"
            ? isKanjiDrawn
            : currentQuestion.type === "map_drag"
            ? isMapDragDone
            : currentQuestion.type === "tree_pillars"
            ? isTreePillarsDone
            : false;

    const handleDirectMapCheckAndNext = () => {
        didacticSound.playCorrect();
        setCorrectCount((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        setMascotMood("streak");
        setCustomSpeech("¡KIAI! ¡Completaste la ruta del barquito! Avanzando al siguiente desafío... 🥋🔥");
        setIsMapDragDone(false);
        setAnswerStatus("idle");

        if (currentIndex + 1 < totalQuestions) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            handleNextQuestion();
        }
    };

    const handleDirectTreeCheckAndNext = () => {
        didacticSound.playCorrect();
        setCorrectCount((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        setMascotMood("streak");
        setCustomSpeech("¡KIAI! ¡El Árbol Sagrado floreció con Kihon, Kata y Kumite! Avanzando... 🌸🥋🔥");
        setIsTreePillarsDone(false);
        setAnswerStatus("idle");

        if (currentIndex + 1 < totalQuestions) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            handleNextQuestion();
        }
    };

    const handleValidation = (isMatchingAutoCorrect: boolean = false) => {
        let isCorrect = false;

        if (isMatchingAutoCorrect) {
            isCorrect = true;
        } else if (currentQuestion.type === "map_drag") {
            if (isMapDragDone) {
                handleDirectMapCheckAndNext();
                return;
            }
        } else if (currentQuestion.type === "tree_pillars") {
            if (isTreePillarsDone) {
                handleDirectTreeCheckAndNext();
                return;
            }
        } else if (currentQuestion.type === "multiple_choice" || currentQuestion.type === "image_choice") {
            const chosen = currentQuestion.options?.find((o) => o.id === selectedOptionId);
            isCorrect = chosen?.isCorrect || false;
        } else if (currentQuestion.type === "true_false") {
            isCorrect = selectedBool === currentQuestion.correctBool;
        } else if (currentQuestion.type === "matching") {
            isCorrect = matchedPairIds.length === (currentQuestion.pairs?.length || 0);
        } else if (currentQuestion.type === "kanji_draw") {
            isCorrect = isKanjiDrawn;
        }

        if (isCorrect) {
            setAnswerStatus("correct");
            setCorrectCount((prev) => prev + 1);
            const newStreak = streak + 1;
            setStreak(newStreak);

            if (newStreak >= 3) {
                didacticSound.playStreak();
                setMascotMood("streak");
                setCustomSpeech(`¡${newStreak} SEGUIDAS! ¡Tsuki de Fuego Imparable! 🔥👊`);
                confetti({
                    particleCount: 60,
                    spread: 75,
                    origin: { y: 0.8 },
                    colors: ["#EAB308", "#EF4444", "#F59E0B"],
                });
            } else {
                didacticSound.playCorrect();
                setMascotMood("correct");
                setCustomSpeech("¡KIAI! ¡Poderoso Tsuki certero! 👊🥋💥");
                confetti({
                    particleCount: 35,
                    spread: 55,
                    origin: { y: 0.8 },
                    colors: ["#EAB308", "#10B981"],
                });
            }
        } else {
            setAnswerStatus("wrong");
            setStreak(0);
            setMascotMood("wrong");
            didacticSound.playWrong();

            const newHearts = Math.max(0, hearts - 1);
            setHearts(newHearts);
            if (newHearts === 0) {
                setCustomSpeech("¡Oh no! Te has quedado sin vidas en el dojo... 😢");
            } else {
                setCustomSpeech("¡Oh no! No te preocupes, el error forja la mente marcial. 😢🥋");
            }
            if (onHeartLost) onHeartLost();
        }
    };

    const handleNextQuestion = () => {
        didacticSound.playClick();

        // 1. If hearts are depleted, end the session with defeat
        if (hearts <= 0) {
            setIsFailed(true);
            setIsCompleted(false);
            setMascotMood("wrong");
            setCustomSpeech("¡Has agotado tus vidas! Descansa y vuelve al camino para repasar.");
            didacticSound.playWrong();
            return;
        }

        // 2. Advance to next question if available
        if (currentIndex + 1 < totalQuestions) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            // 3. Finished all questions: check pass threshold (>= 60%)
            const ratio = correctCount / totalQuestions;
            if (ratio >= 0.6) {
                setIsCompleted(true);
                setIsFailed(false);
                setMascotMood("completed");
                setCustomSpeech("¡Enhorabuena! Has superado el nivel con honor marcial. ¡Ossu!");
                didacticSound.playComplete();

                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.5 },
                    colors: ["#EAB308", "#F59E0B", "#FFFFFF", "#DC2626"],
                });

                // Maestría acumulativa: +1 estrella por cada pase exitoso hasta 3/3
                const nextStars = Math.min(3, (currentStars || 0) + 1);
                setEarnedStars(nextStars);
                onComplete(level.id, nextStars, level.xpReward);
            } else {
                // Not enough accuracy
                setIsFailed(true);
                setIsCompleted(false);
                setMascotMood("wrong");
                setCustomSpeech("No alcanzaste el puntaje mínimo (60%). ¡Vuelve al camino y consulta el pergamino!");
                didacticSound.playWrong();
            }
        }
    };

    const isWideQuestion =
        currentQuestion.type === "map_drag" ||
        currentQuestion.type === "tree_pillars" ||
        currentQuestion.type === "kanji_draw";

    return (
        <div className="fixed inset-0 z-[70] flex flex-col bg-[#0B132B] text-white select-none overflow-hidden">
            {/* THEORY SHEET MODAL */}
            <TheorySheetModal
                isOpen={isTheoryOpen}
                onClose={() => setIsTheoryOpen(false)}
                theory={level.theory}
                levelTitle={level.title}
            />

            {/* CANCEL CONFIRMATION DIALOG (DUOLINGO STYLE) */}
            <AnimatePresence>
                {isCancelConfirmOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-[#1E293B] border-2 border-[#FF4B4B] rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden"
                        >
                            {/* Close modal X button */}
                            <button
                                onClick={() => setIsCancelConfirmOpen(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-700 transition-colors cursor-pointer"
                                aria-label="Cerrar ventana"
                            >
                                <X className="w-5 h-5" weight="bold" />
                            </button>

                            {/* Alert Icon */}
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#2B1313] border-2 border-[#FF4B4B] flex items-center justify-center text-[#FF4B4B] shadow-inner">
                                <WarningCircle className="w-9 h-9" weight="fill" />
                            </div>

                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF4B4B] mb-1 block">
                                Sesión en Curso
                            </span>

                            <h3 className="text-xl sm:text-2xl font-serif font-black text-white mb-2">
                                ¿Cancelar la lección actual?
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                                Si sales ahora, se cancelará este intento y volverás al Camino Kuma. Tu progreso completado anteriormente no se verá afectado.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <button
                                    onClick={() => setIsCancelConfirmOpen(false)}
                                    className="w-full py-3.5 px-5 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer order-1 sm:order-2 shadow-md"
                                >
                                    Continuar Lección
                                </button>
                                <button
                                    onClick={handleConfirmCancel}
                                    className="w-full py-3.5 px-5 rounded-2xl bg-[#2B1313] hover:bg-[#3D1A1A] border-2 border-[#FF4B4B] text-[#FF4B4B] hover:text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer order-2 sm:order-1"
                                >
                                    Sí, Cancelar Lección
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* =========================================
                ZONE 1: SAFE PINNED TOP APP BAR
                Has generous padding (pt-6 pb-4) so it NEVER touches the browser top edge
            ========================================= */}
            <header className="w-full shrink-0 border-b-2 border-[#1E293B] bg-[#0F172A] z-30 pt-6 pb-4 px-4 md:px-8 shadow-md">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 md:gap-6">
                    {/* Prominent Cancel Lesson Button (Always visible) */}
                    <button
                        onClick={handleRequestCancel}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2B1313] hover:bg-[#3D1A1A] border-2 border-[#FF4B4B] text-[#FF4B4B] hover:text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm shrink-0 cursor-pointer group"
                        title="Cancelar la lección en curso y volver al mapa"
                        aria-label="Cancelar lección"
                    >
                        <X className="w-4 h-4 text-[#FF4B4B] group-hover:scale-110 transition-transform" weight="bold" />
                        <span className="hidden sm:inline">Cancelar Lección</span>
                        <span className="sm:hidden">Cancelar</span>
                    </button>

                    {/* Progress Bar with Pure Solid Duolingo Style */}
                    <div className="flex-1 mx-1 md:mx-4">
                        <div className="w-full h-4 bg-[#1E293B] rounded-full overflow-hidden border-2 border-[#334155] p-0.5 relative shadow-inner">
                            <motion.div
                                className="h-full bg-[#58CC02] border-b-2 border-[#46A302] rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Quick Pergamino Button (Solid Duolingo Gold) */}
                    <button
                        onClick={() => setIsTheoryOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2B230E] hover:bg-[#3D3012] text-[#FFC800] border-2 border-[#FFC800] border-b-4 border-b-[#E5A200] active:translate-y-0.5 text-xs font-black tracking-wider uppercase transition-all shadow-sm shrink-0 cursor-pointer"
                        title="Abrir Pergamino Teórico"
                    >
                        <Scroll className="w-4 h-4" weight="duotone" />
                        <span className="hidden sm:inline">Pergamino</span>
                    </button>

                    {/* Sound Toggle */}
                    <button
                        onClick={toggleMute}
                        className="p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                        title={isMuted ? "Activar audio" : "Silenciar audio"}
                    >
                        {isMuted ? <SpeakerSlash className="w-5 h-5" /> : <SpeakerHigh className="w-5 h-5 text-[#1CB0F6]" />}
                    </button>

                    {/* Hearts Counter (Solid Primary Red) */}
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#2B1313] border-2 border-[#FF4B4B] text-[#FF4B4B] text-sm font-black shadow-sm shrink-0">
                        <Heart className="w-5 h-5 fill-[#FF4B4B] text-[#FF4B4B]" weight="fill" />
                        <span className="text-white">{hearts}</span>
                    </div>
                </div>
            </header>

            {/* =========================================
                ZONE 2: MAIN LESSON BODY (OPTIMIZED COMPACT VIEWPORT)
                Strictly disables artificial height and prevents unnecessary scrolling
            ========================================= */}
            <main className="flex-1 w-full overflow-y-auto overflow-x-hidden px-3 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-12 sm:pb-16 flex flex-col justify-start">
                <div className={`${isWideQuestion ? "max-w-7xl" : "max-w-5xl"} mx-auto w-full flex flex-col justify-start`}>
                    {!isCompleted && !isFailed ? (
                        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4 md:gap-8 lg:gap-10 w-full">
                            {/* LEFT: SENSEI MASCOT (Dynamic Responsive: Horizontal companion on mobile, 3D Sensei on desktop) */}
                            <div className={`w-full md:w-60 shrink-0 flex flex-col items-center justify-center ${isWideQuestion ? "hidden md:flex" : "flex"}`}>
                                <KumaMascot
                                    mood={mascotMood}
                                    customMessage={customSpeech}
                                    size="responsive"
                                    layout="responsive"
                                    showBubble={true}
                                    path={activePath}
                                    beltRank={activeBeltRank}
                                    strikeTrigger={`${currentIndex}-${answerStatus}-${streak}`}
                                />
                                {streak >= 3 && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="mt-1.5 md:mt-2.5 inline-flex items-center gap-1.5 px-3 py-0.5 md:py-1 rounded-full bg-[#2B230E] border-2 border-[#FFC800] text-[#FFC800] text-[11px] md:text-xs font-black tracking-wider uppercase shadow-sm"
                                    >
                                        <Fire className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#FFC800] animate-bounce" weight="fill" />
                                        <span>Racha x{streak} 🔥</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* RIGHT: QUESTION & INTERACTIVE ANSWERS */}
                            <div className={`flex-1 w-full ${isWideQuestion ? "max-w-5xl" : "max-w-xl"} space-y-3.5 md:space-y-4`}>
                                {/* Question Header with Clear Padding, Cancel Option & Quick Testing Navigator */}
                                <div className="space-y-2">
                                    {/* Testing Question Switcher (ESTRICTAMENTE SOLO PARA SUPER_ADMIN EN TABLETS Y ESCRITORIO - OCULTO EN MOBILE) */}
                                    {isSuperAdmin && (
                                        <div className="hidden md:flex items-center justify-between gap-2 flex-wrap bg-[#1E293B] p-2 rounded-2xl border-2 border-[#FFC800]/40 shadow-sm">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <button
                                                    type="button"
                                                    disabled={currentIndex === 0}
                                                    onClick={() => {
                                                        didacticSound.playClick();
                                                        setCurrentIndex((prev) => Math.max(0, prev - 1));
                                                    }}
                                                    className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                                    title="Pregunta anterior"
                                                >
                                                    ◀ Ant
                                                </button>

                                                {sessionQuestions.map((_: Question, qIdx: number) => (
                                                    <button
                                                        key={qIdx}
                                                        type="button"
                                                        onClick={() => {
                                                            didacticSound.playClick();
                                                            setCurrentIndex(qIdx);
                                                        }}
                                                        className={`w-7 h-7 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                                                            qIdx === currentIndex
                                                                ? "bg-[#58CC02] border-b-2 border-[#46A302] text-white shadow-sm scale-105"
                                                                : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                                        }`}
                                                        title={`Ir a Pregunta ${qIdx + 1}`}
                                                    >
                                                        {qIdx + 1}
                                                    </button>
                                                ))}

                                                <button
                                                    type="button"
                                                    disabled={currentIndex === totalQuestions - 1}
                                                    onClick={() => {
                                                        didacticSound.playClick();
                                                        setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                                                    }}
                                                    className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                                    title="Siguiente pregunta"
                                                >
                                                    Sig ▶
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-1.5 ml-auto">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-[#FFC800] bg-[#2B230E] border border-[#FFC800]/40 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                                    <span>🛡️</span>
                                                    <span className="hidden sm:inline">Super Admin</span>
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Conteo de preguntas (Visible en Tablets y Escritorio, omitido en Mobile para maximizar pantalla) */}
                                    <div className="hidden md:flex items-center justify-between gap-3 pt-1">
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#1CB0F6] px-3 py-1 rounded-full bg-[#0E2A47] border-2 border-[#1CB0F6]/50 shadow-sm">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#1CB0F6] animate-pulse" />
                                            Pregunta {currentIndex + 1} de {totalQuestions} • {level.tag}
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-white leading-snug drop-shadow-md mt-1">
                                        {currentQuestion.prompt}
                                    </h2>
                                </div>

                                {/* QUESTION IMAGE (IF ANY - EXCLUDING CUSTOM INTERACTIVE QUESTIONS LIKE TREE AND MAP) */}
                                {currentQuestion.image &&
                                    currentQuestion.type !== "tree_pillars" &&
                                    currentQuestion.type !== "map_drag" && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative w-full h-44 sm:h-56 md:h-64 rounded-2xl overflow-hidden border-2 border-amber-400/30 bg-black/95 shadow-[0_4px_20px_rgba(0,0,0,0.8)] group"
                                    >
                                        <Image
                                            src={currentQuestion.image}
                                            alt="Referencia histórica del Dojo Kuma"
                                            fill
                                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                            priority
                                        />
                                        <div className="absolute bottom-1.5 right-2 px-2 py-0.5 rounded-full bg-black/70 border border-white/20 text-[9px] font-bold text-amber-200 backdrop-blur-sm pointer-events-none">
                                            🗺️ Mapa / Documento Histórico
                                        </div>
                                    </motion.div>
                                )}

                                {/* MULTIPLE CHOICE / IMAGE CHOICE WITH SOLID 3D DUOLINGO BUTTONS */}
                                {(currentQuestion.type === "multiple_choice" || currentQuestion.type === "image_choice") && (
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {currentQuestion.options?.map((opt, idx) => {
                                            const isSelected = selectedOptionId === opt.id;
                                            const isCorrectAnswer = isSuperAdmin && Boolean(
                                                opt.isCorrect ||
                                                currentQuestion.correctAnswerId === opt.id
                                            );
                                            const letters = ["A", "B", "C", "D"];

                                            let buttonClass = "";
                                            if (isSelected) {
                                                if (answerStatus === "wrong") {
                                                    buttonClass = "bg-[#2B1313] border-2 border-[#FF4B4B] border-b-4 border-b-[#EA2B2B] text-white shadow-sm translate-y-0.5";
                                                } else if (answerStatus === "correct") {
                                                    buttonClass = "bg-[#143818] border-2 border-[#58CC02] border-b-4 border-b-[#46A302] text-white shadow-sm translate-y-0.5";
                                                } else {
                                                    buttonClass = "bg-[#0E2A47] border-2 border-[#1CB0F6] border-b-4 border-b-[#1899D6] text-white shadow-sm translate-y-0.5";
                                                }
                                                if (isCorrectAnswer) {
                                                    buttonClass += " ring-2 ring-[#58CC02]";
                                                }
                                            } else if (isCorrectAnswer) {
                                                buttonClass = "bg-[#143818] hover:bg-[#1C4E22] border-2 border-[#58CC02] border-b-4 border-b-[#46A302] text-white shadow-sm transition-all";
                                            } else {
                                                buttonClass = "bg-[#1E293B] hover:bg-[#283548] border-2 border-[#334155] border-b-4 border-b-[#0F172A] text-slate-100 hover:border-[#475569] active:translate-y-1 active:border-b-2 shadow-sm";
                                            }

                                            return (
                                                <button
                                                    key={opt.id}
                                                    disabled={answerStatus !== "idle"}
                                                    onClick={() => {
                                                        didacticSound.playClick();
                                                        setSelectedOptionId(opt.id);
                                                        setMascotMood("thinking");
                                                    }}
                                                    className={`w-full p-3.5 md:p-4 rounded-xl md:rounded-2xl border-2 border-b-4 text-left font-medium text-sm md:text-base transition-all duration-150 flex items-center justify-between select-none cursor-pointer ${buttonClass}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span
                                                            className={`w-7 h-7 rounded-lg border-2 text-xs font-black flex items-center justify-center shrink-0 ${
                                                                isSelected
                                                                    ? answerStatus === "wrong"
                                                                        ? "bg-[#FF4B4B] border-[#EA2B2B] text-white font-black shadow-sm"
                                                                        : answerStatus === "correct"
                                                                        ? "bg-[#58CC02] border-[#46A302] text-slate-950 font-black shadow-sm"
                                                                        : "bg-[#1CB0F6] border-[#1899D6] text-slate-950 font-black shadow-sm"
                                                                    : isCorrectAnswer
                                                                    ? "bg-[#58CC02] border-[#46A302] text-slate-950 font-black"
                                                                    : "bg-slate-800 border-slate-600 text-slate-300"
                                                            }`}
                                                        >
                                                            {letters[idx]}
                                                        </span>
                                                        <span className="leading-snug">{opt.text}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 ml-3 shrink-0">
                                                        {isCorrectAnswer && (
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-[#58CC02] bg-[#143818] border border-[#58CC02]/50 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#58CC02] animate-pulse" />
                                                                Correcta
                                                            </span>
                                                        )}
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                                isSelected
                                                                    ? answerStatus === "wrong"
                                                                        ? "border-[#FF4B4B] bg-[#2B1313]"
                                                                        : answerStatus === "correct"
                                                                        ? "border-[#58CC02] bg-[#143818]"
                                                                        : "border-[#1CB0F6] bg-[#0E2A47]"
                                                                    : isCorrectAnswer
                                                                    ? "border-[#58CC02] bg-[#143818]"
                                                                    : "border-slate-600"
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                answerStatus === "wrong" ? (
                                                                    <X className="w-3.5 h-3.5 text-[#FF4B4B]" weight="bold" />
                                                                ) : answerStatus === "correct" ? (
                                                                    <Check className="w-3.5 h-3.5 text-[#58CC02]" weight="bold" />
                                                                ) : (
                                                                    <div className="w-2 h-2 rounded-full bg-[#1CB0F6]" />
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* TRUE / FALSE SOLID 3D DUOLINGO TILES */}
                                {currentQuestion.type === "true_false" && (
                                    <div className="grid grid-cols-2 gap-3.5">
                                        {[
                                            {
                                                val: true,
                                                label: "Verdadero",
                                                icon: CheckCircle,
                                                theme: "green",
                                            },
                                            {
                                                val: false,
                                                label: "Falso",
                                                icon: XCircle,
                                                theme: "red",
                                            },
                                        ].map(({ val, label, icon: Icon, theme }) => {
                                            const isSelected = selectedBool === val;
                                            const isCorrectBool = isSuperAdmin && Boolean(
                                                currentQuestion.correctBool === val
                                            );

                                            let tileClass = "";
                                            if (isSelected) {
                                                if (theme === "green") {
                                                    tileClass = "bg-[#143818] border-2 border-[#58CC02] border-b-4 border-b-[#46A302] text-white translate-y-0.5 shadow-sm";
                                                } else {
                                                    tileClass = "bg-[#2B1313] border-2 border-[#FF4B4B] border-b-4 border-b-[#EA2B2B] text-white translate-y-0.5 shadow-sm";
                                                }
                                            } else if (isCorrectBool) {
                                                tileClass = "bg-[#143818] hover:bg-[#1C4E22] border-2 border-[#58CC02] border-b-4 border-b-[#46A302] text-white shadow-sm";
                                            } else {
                                                tileClass = "bg-[#1E293B] hover:bg-[#283548] border-2 border-[#334155] border-b-4 border-b-[#0F172A] text-slate-100 active:translate-y-1 active:border-b-2 shadow-sm";
                                            }

                                            return (
                                                <button
                                                    key={String(val)}
                                                    disabled={answerStatus !== "idle"}
                                                    onClick={() => {
                                                        didacticSound.playClick();
                                                        setSelectedBool(val);
                                                        setMascotMood("thinking");
                                                    }}
                                                    className={`p-4 sm:p-5 rounded-2xl border-2 border-b-4 text-center font-serif font-black text-base md:text-lg transition-all duration-150 flex flex-col items-center gap-2 select-none cursor-pointer ${tileClass}`}
                                                >
                                                    <Icon className={`w-8 h-8 ${isSelected ? (theme === "green" ? "text-[#58CC02]" : "text-[#FF4B4B]") : isCorrectBool ? "text-[#58CC02]" : "text-slate-500"}`} weight="fill" />
                                                    <div className="flex items-center gap-1.5">
                                                        <span>{label}</span>
                                                        {isCorrectBool && (
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-[#58CC02] bg-[#143818] border border-[#58CC02]/50 px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#58CC02] animate-pulse" />
                                                                Correcta
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* MATCHING WITH SOLID CONNECTING CARDS */}
                                {currentQuestion.type === "matching" && currentQuestion.pairs && (
                                    <div className="space-y-2.5">
                                        {isSuperAdmin && (
                                            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-[#FFC800]/40 text-amber-200 text-xs flex items-center gap-2 flex-wrap mb-2 shadow-sm">
                                                <span className="font-bold text-[#FFC800]">🛡️ [Pares Correctos Super Admin]:</span>
                                                {currentQuestion.pairs.map((p) => (
                                                    <span key={p.id} className="bg-black/50 px-2 py-0.5 rounded border border-white/10 text-[11px]">
                                                        {p.left} ➔ <strong className="text-white">{p.right}</strong>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-xs text-slate-400 italic">
                                            Toca un concepto en japonés a la izquierda y su traducción a la derecha:
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                {currentQuestion.pairs.map((p) => {
                                                    const isMatched = matchedPairIds.includes(p.id);
                                                    const isSelected = selectedLeftId === p.id;
                                                    return (
                                                        <button
                                                            key={`left-${p.id}`}
                                                            disabled={isMatched || answerStatus !== "idle"}
                                                            onClick={() => handleSelectLeft(p.id)}
                                                            className={`w-full p-3 sm:p-3.5 rounded-xl border-2 border-b-4 text-xs md:text-sm font-bold text-left transition-all ${
                                                                isMatched
                                                                    ? "bg-[#143818] border-2 border-[#58CC02] border-b-4 border-b-[#46A302] text-[#85E338] opacity-75 line-through shadow-sm"
                                                                    : isSelected
                                                                    ? "bg-[#0E2A47] border-2 border-[#1CB0F6] border-b-4 border-b-[#1899D6] text-white translate-y-0.5 shadow-sm"
                                                                    : "bg-[#1E293B] hover:bg-[#283548] border-2 border-[#334155] border-b-4 border-b-[#0F172A] text-slate-100 active:translate-y-1 shadow-sm"
                                                            }`}
                                                        >
                                                            {p.left}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            <div className="space-y-2">
                                                {[...currentQuestion.pairs].reverse().map((p) => {
                                                    const isMatched = matchedPairIds.includes(p.id);
                                                    const isSelected = selectedRightId === p.id;
                                                    return (
                                                        <button
                                                            key={`right-${p.id}`}
                                                            disabled={isMatched || answerStatus !== "idle"}
                                                            onClick={() => handleSelectRight(p.id)}
                                                            className={`w-full p-3 sm:p-3.5 rounded-xl border-2 border-b-4 text-xs md:text-sm font-medium text-left transition-all ${
                                                                isMatched
                                                                    ? "bg-[#143818] border-2 border-[#58CC02] border-b-4 border-b-[#46A302] text-[#85E338] opacity-75 line-through shadow-sm"
                                                                    : isSelected
                                                                    ? "bg-[#0E2A47] border-2 border-[#1CB0F6] border-b-4 border-b-[#1899D6] text-white translate-y-0.5 shadow-sm"
                                                                    : "bg-[#1E293B] hover:bg-[#283548] border-2 border-[#334155] border-b-4 border-b-[#0F172A] text-slate-100 active:translate-y-1 shadow-sm"
                                                            }`}
                                                        >
                                                            {p.right}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* KANJI DRAW GUIDED CALIGRAPHY CANVAS */}
                                {currentQuestion.type === "kanji_draw" && (
                                    <div className="w-full flex flex-col items-center">
                                        <KanjiDrawCanvas
                                            customKanjiList={currentQuestion.kanjiList}
                                            onKanjiCompleted={(kanji, count, total) => {
                                                setMascotMood("correct");
                                                if (count < total) {
                                                    setCustomSpeech(`¡Excelente trazo de "${kanji}" (${count}/${total})! Completa los siguientes para forjar KARATE-DO. 🥋✨`);
                                                }
                                            }}
                                            onAllCompleted={() => {
                                                setIsKanjiDrawn(true);
                                                setMascotMood("streak");
                                                setCustomSpeech("¡KIAI! ¡Has forjado los 3 Kanjis sagrados de KARATE-DO (空・手・道)! ¡Comprueba tu técnica ahora! 👊🥋🔥");
                                            }}
                                        />
                                    </div>
                                )}
                                {/* MAP ORIGIN DRAG AND DROP */}
                                {currentQuestion.type === "map_drag" && (
                                    <div className="w-full">
                                        <MapOriginDragQuestion
                                            question={currentQuestion}
                                            isSuperAdmin={isSuperAdmin}
                                            onCompleted={() => {
                                                setIsMapDragDone(true);
                                                setMascotMood("streak");
                                                setCustomSpeech("¡KIAI! ¡Completaste la ruta del barquito! El Karate nació en la Isla de Okinawa y llegó a todo el mundo. 🇨🇳🏝️🇯🇵");
                                            }}
                                            onCheckAndNext={handleDirectMapCheckAndNext}
                                        />
                                    </div>
                                )}
                                {/* TREE PILLARS QUESTION (EL ÁRBOL SAGRADO: KIHON, KATA Y KUMITE) */}
                                {currentQuestion.type === "tree_pillars" && (
                                    <div className="w-full">
                                        <TreePillarsQuestion
                                            question={currentQuestion}
                                            isSuperAdmin={isSuperAdmin}
                                            onCompleted={() => {
                                                setIsTreePillarsDone(true);
                                                setMascotMood("streak");
                                                setCustomSpeech("¡KIAI! ¡Colocaste las 3 gemas sagradas: Kihon, Kata y Kumite! 🌸🥋");
                                            }}
                                            onCheckAndNext={handleDirectTreeCheckAndNext}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : isCompleted ? (
                        /* LUXURY SOLID DUOLINGO VICTORY SCREEN */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-6 text-center max-w-lg mx-auto w-full"
                        >
                            <KumaMascot mood="completed" size="responsive" showBubble={true} customMessage={customSpeech} path={activePath} beltRank={activeBeltRank} />

                            <div className="mt-4">
                                <span className="inline-block text-[#1CB0F6] font-black uppercase tracking-[0.25em] text-xs bg-[#0E2A47] px-3.5 py-1 rounded-full border-2 border-[#1CB0F6] shadow-sm">
                                    ⚡ ¡Nivel Marcial Superado!
                                </span>
                                <h2 className="text-3xl md:text-5xl font-serif font-black text-white mt-2">
                                    {level.title}
                                </h2>
                            </div>

                            {/* BARRA DE MAESTRÍA DE 3 ESTRELLAS */}
                            <div className="w-full mt-6 p-4 rounded-2xl bg-gradient-to-b from-[#1C180A]/90 to-[#0A0D18]/90 border-2 border-[#FFC800]/50 shadow-[0_0_20px_rgba(255,200,0,0.15)] flex flex-col items-center">
                                <span className="text-[11px] font-black uppercase tracking-widest text-[#FFC800]">
                                    {earnedStars === 3 ? "👑 Maestría de Nivel Consagrada" : "⭐ Forja de Maestría Marcial"}
                                </span>

                                <div className="flex items-center gap-3.5 my-3">
                                    {[1, 2, 3].map((starIndex) => {
                                        const isEarned = starIndex <= earnedStars;
                                        return (
                                            <motion.div
                                                key={starIndex}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: isEarned ? [1, 1.25, 1] : 1, opacity: 1 }}
                                                transition={{ delay: 0.2 + starIndex * 0.15, duration: 0.4 }}
                                                className={`p-2.5 rounded-full ${
                                                    isEarned
                                                        ? "bg-amber-400/20 border-2 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                                                        : "bg-slate-800/50 border border-slate-700 opacity-40"
                                                }`}
                                            >
                                                <Star
                                                    className={`w-7 h-7 ${
                                                        isEarned ? "text-yellow-400 fill-yellow-400" : "text-slate-500 fill-slate-700"
                                                    }`}
                                                    weight={isEarned ? "fill" : "bold"}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <div className="text-center">
                                    <p className="text-sm font-bold text-slate-200">
                                        Progreso: <span className="text-yellow-400 font-black">{earnedStars}/3 Estrellas</span>
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                                        {earnedStars === 3
                                            ? "¡Has alcanzado la maestría máxima de este nivel! Este conocimiento reside plenamente en tu espíritu."
                                            : `Debes superar este nivel ${3 - earnedStars} ${
                                                  3 - earnedStars === 1 ? "vez más" : "veces más"
                                              } para llenar las 3 estrellas y consagrar la maestría completa.`}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3.5 w-full mt-6">
                                <div className="p-4 rounded-2xl bg-[#2B230E] border-2 border-[#FFC800] flex flex-col items-center shadow-sm">
                                    <Trophy className="w-6 h-6 text-[#FFC800] mb-1" weight="duotone" />
                                    <span className="text-[10px] text-[#FFC800] uppercase font-bold tracking-wider">XP Ganados</span>
                                    <span className="text-2xl font-serif font-black text-white">+{level.xpReward}</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-[#0E2A47] border-2 border-[#1CB0F6] flex flex-col items-center shadow-sm">
                                    <Sparkle className="w-6 h-6 text-[#1CB0F6] mb-1" weight="fill" />
                                    <span className="text-[10px] text-[#1CB0F6] uppercase font-bold tracking-wider">Precisión</span>
                                    <span className="text-2xl font-serif font-black text-white">
                                        {Math.round((correctCount / totalQuestions) * 100)}%
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-[#2B1313] border-2 border-[#FF4B4B] flex flex-col items-center shadow-sm">
                                    <Heart className="w-6 h-6 text-[#FF4B4B] mb-1" weight="fill" />
                                    <span className="text-[10px] text-[#FF4B4B] uppercase font-bold tracking-wider">Vidas</span>
                                    <span className="text-2xl font-serif font-black text-white">{hearts}/5</span>
                                </div>
                            </div>

                            <div className="w-full space-y-3 mt-8">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] text-white font-black text-sm uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Regresar al Camino Kuma</span>
                                    <ArrowRight className="w-5 h-5" weight="bold" />
                                </button>

                                <button
                                    onClick={() => setIsTheoryOpen(true)}
                                    className="w-full py-3 rounded-2xl bg-[#1E293B] hover:bg-[#283548] border-2 border-[#334155] text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                                >
                                    <Scroll className="w-4 h-4 text-[#FFC800]" weight="duotone" />
                                    <span>Consultar Pergamino Teórico</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        /* DEFEAT / LEVEL FAILED SCREEN */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-6 text-center max-w-lg mx-auto w-full"
                        >
                            <KumaMascot
                                mood="wrong"
                                size="responsive"
                                showBubble={true}
                                path={activePath}
                                beltRank={activeBeltRank}
                                customMessage={customSpeech || "¡No te rindas! La verdadera maestría nace de levantarse tras cada caída."}
                            />

                            <div className="mt-4">
                                <span className="inline-block text-[#FF4B4B] font-bold uppercase tracking-[0.25em] text-xs bg-[#2B1313] px-3 py-0.5 rounded-full border-2 border-[#FF4B4B] shadow-sm">
                                    Lección No Superada
                                </span>
                                <h2 className="text-3xl md:text-5xl font-serif font-black text-white mt-1">
                                    {hearts <= 0 ? "¡Vidas Agotadas!" : "Práctica Incompleta"}
                                </h2>
                                <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-md leading-relaxed">
                                    En el camino del karate, caer siete veces significa levantarse ocho. Vuelve al camino para meditar la teoría y vuelve cuando estés listo.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-3.5 w-full mt-6">
                                <div className="p-4 rounded-2xl bg-[#1E293B] border-2 border-[#334155] flex flex-col items-center shadow-sm">
                                    <Trophy className="w-6 h-6 text-slate-400 mb-1" weight="duotone" />
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Aciertos</span>
                                    <span className="text-2xl font-serif font-black text-white">{correctCount}/{totalQuestions}</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-[#1E293B] border-2 border-[#334155] flex flex-col items-center shadow-sm">
                                    <Sparkle className="w-6 h-6 text-[#FFC800] mb-1" weight="fill" />
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Precisión</span>
                                    <span className="text-2xl font-serif font-black text-white">
                                        {Math.round((correctCount / totalQuestions) * 100)}%
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-[#2B1313] border-2 border-[#FF4B4B] flex flex-col items-center shadow-sm">
                                    <Heart className="w-6 h-6 text-[#FF4B4B] mb-1" weight="fill" />
                                    <span className="text-[10px] text-[#FF4B4B] uppercase font-bold tracking-wider">Vidas</span>
                                    <span className="text-2xl font-serif font-black text-[#FF4B4B]">{hearts}/5</span>
                                </div>
                            </div>

                            <div className="w-full space-y-3 mt-8">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl bg-[#1CB0F6] hover:bg-[#24BDFF] text-white font-black text-sm uppercase tracking-wider border-b-4 border-[#1899D6] active:border-b-0 active:translate-y-1 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Regresar al Camino Kuma</span>
                                    <ArrowRight className="w-5 h-5" weight="bold" />
                                </button>

                                <button
                                    onClick={handleRetry}
                                    className="w-full py-3.5 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                                >
                                    <ArrowCounterClockwise className="w-4 h-4 text-white" weight="bold" />
                                    <span>Reintentar Nivel Ahora</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* =========================================
                ZONE 3: SAFE PINNED BOTTOM VALIDATION DOCK (DUOLINGO STYLE)
                Guaranteed to stay pinned at bottom without covering any content
            ========================================= */}
            {!isCompleted && !isFailed && (
                <footer className="w-full shrink-0 border-t-2 border-[#1E293B] bg-[#0F172A] py-3.5 md:py-5 pb-[max(0.875rem,env(safe-area-inset-bottom))] px-4 md:px-8 z-30 shadow-lg">
                    <div className="max-w-5xl mx-auto">
                        {answerStatus === "idle" ? (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                {/* Explicit Cancel Button while answering questions */}
                                <button
                                    type="button"
                                    onClick={handleRequestCancel}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-[#FF4B4B]/60 bg-[#2B1313] hover:bg-[#3D1A1A] text-[#FF4B4B] hover:text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm order-2 sm:order-1"
                                    title="Cancelar la lección en curso y volver al mapa"
                                >
                                    <X className="w-4 h-4 text-[#FF4B4B]" weight="bold" />
                                    <span>Cancelar Lección</span>
                                </button>

                                <div className="w-full sm:w-auto flex items-center justify-end gap-2.5 order-1 sm:order-2 flex-wrap">
                                    {/* Botones rápidos modo prueba (ESTRICTAMENTE SOLO PARA SUPER_ADMIN) */}
                                    {isSuperAdmin && (
                                        <>
                                            <button
                                                type="button"
                                                disabled={currentIndex === 0}
                                                onClick={() => {
                                                    didacticSound.playClick();
                                                    setCurrentIndex((prev) => Math.max(0, prev - 1));
                                                }}
                                                className="px-3.5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white border border-slate-600 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                                title="Ir a pregunta anterior"
                                            >
                                                <span>◀ Ant</span>
                                            </button>

                                            <button
                                                type="button"
                                                disabled={currentIndex === totalQuestions - 1}
                                                onClick={() => {
                                                    didacticSound.playClick();
                                                    setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
                                                }}
                                                className="px-3.5 py-3.5 rounded-2xl bg-[#2B230E] hover:bg-[#3D3012] disabled:opacity-30 disabled:pointer-events-none text-[#FFC800] border-2 border-[#FFC800]/50 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                                title="Saltar a la siguiente pregunta sin responder (modo super admin)"
                                            >
                                                <span>Saltar</span>
                                                <span>Sig ▶</span>
                                            </button>
                                        </>
                                    )}

                                    <button
                                        disabled={!canCheck}
                                        onClick={() => handleValidation(false)}
                                        className={`w-full sm:w-auto px-9 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all select-none ${
                                            canCheck
                                                ? "bg-[#58CC02] hover:bg-[#61E002] text-white border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 shadow-md cursor-pointer"
                                                : "bg-[#334155] text-[#94A3B8] cursor-not-allowed border-b-4 border-[#1E293B]"
                                        }`}
                                    >
                                        Comprobar Técnica
                                    </button>
                                </div>
                            </div>
                        ) : answerStatus === "correct" ? (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-[#143818] border-2 border-[#58CC02] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-lg max-h-[65vh] overflow-y-auto"
                            >
                                <div className="flex flex-col md:flex-row items-start gap-3.5 w-full">
                                    {/* MOBILE ONLY: FULL MARTIAL STAGE WITH POST BREAKING ANIMATION (EXACTLY LIKE DESKTOP) */}
                                    <div className="md:hidden w-full flex flex-col items-center justify-center py-2 bg-gradient-to-b from-black/60 via-emerald-950/40 to-transparent rounded-2xl border border-emerald-500/30 overflow-visible mb-2">
                                        <div className="w-56 h-44 flex items-center justify-center overflow-visible relative">
                                            <KumaMascot
                                                mood={streak >= 3 ? "streak" : "correct"}
                                                strikeTrigger={`${currentIndex}-${answerStatus}-${streak}`}
                                                path={activePath}
                                                beltRank={activeBeltRank}
                                                size="md"
                                                showBubble={false}
                                                interactive={true}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-[#FFC800] mt-1 bg-black/70 px-3 py-0.5 rounded-full border border-[#FFC800]/40 shadow-sm">
                                            💥 ¡Tsuki Certero: Poste Partido en Dos!
                                        </span>
                                    </div>

                                    <CheckCircle className="hidden md:block w-8 h-8 text-[#58CC02] shrink-0 mt-0.5" weight="fill" />
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-white bg-[#58CC02] px-2.5 py-1 rounded-lg shadow-sm">
                                                🥋 ¡Poderoso Tsuki Certero de Kuma Sensei!
                                            </span>
                                        </div>
                                        <h3 className="font-serif font-black text-[#58CC02] text-base md:text-lg">
                                            ¡Excelente! Técnica Impecable
                                        </h3>
                                        <p className="text-xs md:text-sm text-emerald-100 mt-0.5 leading-relaxed">
                                            {currentQuestion.explanation}
                                        </p>
                                        <QuestionBibliography
                                            references={currentQuestion.references || currentQuestion.bibliography || level.theory?.references}
                                            variant="correct"
                                            mascotMood={streak >= 3 ? "streak" : "correct"}
                                            strikeTrigger={`${currentIndex}-${answerStatus}-${streak}`}
                                            activePath={activePath}
                                            activeBeltRank={activeBeltRank}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end self-end lg:self-center">
                                    <button
                                        type="button"
                                        onClick={handleRequestCancel}
                                        className="px-3.5 py-3 rounded-2xl text-xs font-bold text-emerald-200/80 hover:text-[#FF4B4B] transition-colors cursor-pointer"
                                        title="Cancelar lección"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-[#58CC02] hover:bg-[#61E002] text-white font-black text-xs uppercase tracking-widest border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all shrink-0 cursor-pointer shadow-md"
                                    >
                                        Continuar 🥋
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-[#2B1313] border-2 border-[#FF4B4B] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-lg max-h-[65vh] overflow-y-auto"
                            >
                                <div className="flex flex-col md:flex-row items-start gap-3.5 w-full">
                                    {/* MOBILE ONLY: FULL MARTIAL STAGE ON WRONG ANSWER */}
                                    <div className="md:hidden w-full flex flex-col items-center justify-center py-2 bg-gradient-to-b from-black/60 via-rose-950/40 to-transparent rounded-2xl border border-rose-500/30 overflow-visible mb-2">
                                        <div className="w-56 h-44 flex items-center justify-center overflow-visible relative">
                                            <KumaMascot
                                                mood="wrong"
                                                strikeTrigger={`${currentIndex}-${answerStatus}-${streak}`}
                                                path={activePath}
                                                beltRank={activeBeltRank}
                                                size="md"
                                                showBubble={false}
                                                interactive={true}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-300 mt-1 bg-black/70 px-3 py-0.5 rounded-full border border-rose-500/40 shadow-sm">
                                            🥋 Disciplina Marcial Kuma Sensei
                                        </span>
                                    </div>

                                    <XCircle className="hidden md:block w-8 h-8 text-[#FF4B4B] shrink-0 mt-0.5" weight="fill" />
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-white bg-[#FF4B4B] px-2.5 py-1 rounded-lg shadow-sm">
                                                🥋 Disciplina Marcial Kuma Sensei
                                            </span>
                                        </div>
                                        <h3 className="font-serif font-black text-[#FF4B4B] text-base md:text-lg">
                                            Técnica Incorrecta
                                        </h3>
                                        <p className="text-xs md:text-sm text-rose-100 mt-1 leading-relaxed">
                                            En el tatami no se regalan respuestas. Para descubrir la técnica correcta y avanzar con honor, debes consultar el <strong>Pergamino Teórico</strong> de este nivel.
                                        </p>
                                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsTheoryOpen(true)}
                                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2B230E] hover:bg-[#3D3012] border-2 border-[#FFC800] text-[#FFC800] text-xs font-black uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                                            >
                                                <Scroll className="w-4 h-4 text-[#FFC800]" weight="duotone" />
                                                <span>Estudiar Pergamino Teórico</span>
                                            </button>
                                        </div>
                                        {isSuperAdmin && (
                                            <div className="mt-2.5 p-2.5 rounded-xl bg-amber-950/60 border border-[#FFC800]/50 text-amber-200 text-xs">
                                                <span className="font-bold text-[#FFC800]">🛡️ [Exclusivo Super Admin] Respuesta correcta: </span>
                                                <span className="text-white font-semibold">
                                                    {currentQuestion.type === "multiple_choice" || currentQuestion.type === "image_choice" ? (
                                                        currentQuestion.options?.find((o) => o.isCorrect || o.id === currentQuestion.correctAnswerId)?.text
                                                    ) : currentQuestion.type === "true_false" ? (
                                                        currentQuestion.correctBool ? "Verdadero" : "Falso"
                                                    ) : currentQuestion.type === "matching" ? (
                                                        currentQuestion.pairs?.map((p) => `${p.left} ➔ ${p.right}`).join(" | ")
                                                    ) : null}
                                                </span>
                                            </div>
                                        )}
                                        <QuestionBibliography
                                            references={currentQuestion.references || currentQuestion.bibliography || level.theory?.references}
                                            variant="wrong"
                                            mascotMood="wrong"
                                            strikeTrigger={`${currentIndex}-${answerStatus}-${streak}`}
                                            activePath={activePath}
                                            activeBeltRank={activeBeltRank}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end self-end lg:self-center">
                                    <button
                                        type="button"
                                        onClick={handleRequestCancel}
                                        className="px-3.5 py-3 rounded-2xl text-xs font-bold text-rose-200/80 hover:text-white transition-colors cursor-pointer"
                                        title="Cancelar lección"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-[#FF4B4B] hover:bg-[#FF5C5C] text-white font-black text-xs uppercase tracking-widest border-b-4 border-[#EA2B2B] active:border-b-0 active:translate-y-1 transition-all shrink-0 cursor-pointer shadow-md"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </footer>
            )}
        </div>
    );
}
