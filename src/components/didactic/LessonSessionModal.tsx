"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Level, Question, MascotMood, PathType, BeltRank, BookReference } from "@/types/didactica";
import { KumaMascot } from "./KumaMascot";
import { TheorySheetModal } from "./TheorySheetModal";
import { KanjiDrawCanvas } from "./KanjiDrawCanvas";
import { didacticSound } from "@/lib/didacticSound";
import { DIDACTIC_UNITS } from "@/data/didacticaData";
import { getBeltRank } from "@/data/beltRanks";
import {
    Heart,
    X,
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
} from "@phosphor-icons/react";

function QuestionBibliography({
    references,
    variant = "correct",
}: {
    references?: (string | BookReference)[];
    variant?: "correct" | "wrong";
}) {
    if (!references || references.length === 0) return null;

    const isCorrect = variant === "correct";
    const containerBorder = isCorrect ? "border-emerald-500/30 bg-black/40" : "border-red-500/30 bg-black/40";
    const headerColor = isCorrect ? "text-emerald-300" : "text-amber-300";
    const authorColor = isCorrect ? "text-emerald-200/90" : "text-red-200/90";
    const dividerColor = isCorrect ? "border-emerald-500/40" : "border-red-500/40";

    return (
        <div className={`mt-3 p-3.5 rounded-xl border ${containerBorder} backdrop-blur-md text-left space-y-2.5 max-w-2xl`}>
            <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider ${headerColor}`}>
                <BookBookmark className="w-4 h-4 shrink-0" weight="fill" />
                <span>Bibliografía de Origen & Fuentes Documentales</span>
            </div>
            <div className="space-y-2">
                {references.map((item, idx) => {
                    if (typeof item === "string") {
                        return (
                            <p key={idx} className={`text-xs text-zinc-300 pl-2.5 border-l-2 ${dividerColor} leading-relaxed`}>
                                📖 {item}
                            </p>
                        );
                    }
                    return (
                        <div key={idx} className={`text-xs pl-2.5 border-l-2 ${dividerColor} space-y-0.5 leading-relaxed`}>
                            <div className="flex items-baseline flex-wrap gap-x-2">
                                <span className="text-amber-100 font-serif font-bold text-xs md:text-sm tracking-wide">
                                    &ldquo;{item.title}&rdquo;
                                </span>
                                <span className={`text-[11px] font-medium ${authorColor}`}>
                                    — {item.author} {item.year ? `(${item.year})` : ""}
                                </span>
                            </div>
                            {(item.editorial || item.chapter) && (
                                <div className="text-[11px] text-zinc-400">
                                    {item.editorial && <span>Editorial: <strong className="text-zinc-300 font-medium">{item.editorial}</strong></span>}
                                    {item.editorial && item.chapter && <span> • </span>}
                                    {item.chapter && <span className="text-zinc-300 font-medium">{item.chapter}</span>}
                                </div>
                            )}
                            {item.note && (
                                <p className="text-[11px] text-zinc-300 italic bg-white/[0.04] p-1.5 rounded border border-white/5 mt-1">
                                    📌 {item.note}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface LessonSessionModalProps {
    level: Level;
    isOpen: boolean;
    onClose: () => void;
    onComplete: (levelId: string, stars: number, earnedXp: number) => void;
    initialHearts?: number;
    onHeartLost?: () => void;
    beltRank?: BeltRank;
}

export function LessonSessionModal({
    level,
    isOpen,
    onClose,
    onComplete,
    initialHearts = 5,
    onHeartLost,
    beltRank,
}: LessonSessionModalProps) {
    const activePath: PathType = level.id.startsWith("wkf") ? "wkf" : "tradicional";
    const { data: session } = useSession();
    const isSuperAdmin = (session?.user as any)?.role === "super_admin";
    const parentUnit = DIDACTIC_UNITS.find((u) => u.levels.some((lvl) => lvl.id === level.id));
    const activeBeltRank = beltRank || (parentUnit?.beltId ? getBeltRank(parentUnit.beltId) : undefined);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hearts, setHearts] = useState(initialHearts);
    const [streak, setStreak] = useState(0);
    const [mascotMood, setMascotMood] = useState<MascotMood>("idle");
    const [customSpeech, setCustomSpeech] = useState<string | undefined>(undefined);
    const [isTheoryOpen, setIsTheoryOpen] = useState(false);
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

    // Validation state
    const [answerStatus, setAnswerStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [isCompleted, setIsCompleted] = useState(false);
    const [isFailed, setIsFailed] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

    const currentQuestion: Question | undefined = level.questions[currentIndex];
    const totalQuestions = level.questions.length;
    const progressPercent = Math.round((currentIndex / totalQuestions) * 100);

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
            : false;

    const handleValidation = (isMatchingAutoCorrect: boolean = false) => {
        let isCorrect = false;

        if (isMatchingAutoCorrect) {
            isCorrect = true;
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

                const stars = ratio >= 0.9 ? 3 : ratio >= 0.75 ? 2 : 1;
                onComplete(level.id, stars, level.xpReward);
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

    return (
        <div className="fixed inset-0 z-[70] flex flex-col bg-zinc-950/98 backdrop-blur-3xl text-white select-none overflow-hidden">
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
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-zinc-900/95 border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(239,68,68,0.25)] text-center relative overflow-hidden backdrop-blur-xl"
                        >
                            {/* Decorative background aura */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-red-500/10 blur-3xl pointer-events-none" />

                            {/* Close modal X button */}
                            <button
                                onClick={() => setIsCancelConfirmOpen(false)}
                                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label="Cerrar ventana"
                            >
                                <X className="w-5 h-5" weight="bold" />
                            </button>

                            {/* Alert Icon */}
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shadow-inner">
                                <WarningCircle className="w-9 h-9" weight="fill" />
                            </div>

                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-400 mb-1 block">
                                Sesión en Curso
                            </span>

                            <h3 className="text-xl sm:text-2xl font-serif font-black text-white mb-2">
                                ¿Cancelar la lección actual?
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                                Si sales ahora, se cancelará este intento y volverás al Camino Kuma. Tu progreso completado anteriormente no se verá afectado.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <button
                                    onClick={() => setIsCancelConfirmOpen(false)}
                                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-kuma-gold text-zinc-950 font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-kuma-gold/20 transition-all cursor-pointer order-1 sm:order-2"
                                >
                                    Continuar Lección
                                </button>
                                <button
                                    onClick={handleConfirmCancel}
                                    className="w-full py-3.5 px-5 rounded-2xl bg-zinc-850 hover:bg-red-950/60 border border-white/10 hover:border-red-500/50 text-zinc-400 hover:text-red-300 font-black text-xs uppercase tracking-wider transition-all cursor-pointer order-2 sm:order-1"
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
            <header className="w-full shrink-0 border-b border-white/10 bg-zinc-950/95 backdrop-blur-2xl z-30 pt-6 pb-4 px-4 md:px-8 shadow-md">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 md:gap-6">
                    {/* Prominent Cancel Lesson Button (Always visible) */}
                    <button
                        onClick={handleRequestCancel}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 hover:border-red-400 text-red-300 hover:text-red-100 text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer group"
                        title="Cancelar la lección en curso y volver al mapa"
                        aria-label="Cancelar lección"
                    >
                        <X className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" weight="bold" />
                        <span className="hidden sm:inline">Cancelar Lección</span>
                        <span className="sm:hidden">Cancelar</span>
                    </button>

                    {/* Progress Bar with Liquid Shine */}
                    <div className="flex-1 mx-1 md:mx-4">
                        <div className="w-full h-4 bg-zinc-900 rounded-full overflow-hidden border border-white/10 p-0.5 relative shadow-inner">
                            <motion.div
                                className="h-full bg-gradient-to-r from-amber-500 via-kuma-gold to-yellow-300 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.7)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Quick Pergamino Button */}
                    <button
                        onClick={() => setIsTheoryOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-kuma-gold/10 hover:bg-kuma-gold/20 text-kuma-gold border border-kuma-gold/40 text-xs font-black tracking-wider uppercase transition-colors shadow-sm shrink-0"
                        title="Abrir Pergamino Teórico"
                    >
                        <Scroll className="w-4 h-4" weight="duotone" />
                        <span className="hidden sm:inline">Pergamino</span>
                    </button>

                    {/* Sound Toggle */}
                    <button
                        onClick={toggleMute}
                        className="p-2.5 text-zinc-400 hover:text-white rounded-2xl hover:bg-white/10 transition-colors shrink-0"
                        title={isMuted ? "Activar audio" : "Silenciar audio"}
                    >
                        {isMuted ? <SpeakerSlash className="w-5 h-5" /> : <SpeakerHigh className="w-5 h-5 text-kuma-gold" />}
                    </button>

                    {/* Hearts Counter */}
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 text-sm font-black shadow-inner shrink-0">
                        <Heart className="w-5 h-5 fill-red-500 text-red-500 animate-pulse" weight="fill" />
                        <span>{hearts}</span>
                    </div>
                </div>
            </header>

            {/* =========================================
                ZONE 2: MAIN LESSON BODY (OPTIMIZED COMPACT VIEWPORT)
                Strictly disables artificial height and prevents unnecessary scrolling
            ========================================= */}
            <main className="flex-1 w-full overflow-y-auto overflow-x-hidden px-4 md:px-8 py-2 md:py-4 flex flex-col justify-center">
                <div className="max-w-5xl mx-auto w-full my-auto flex flex-col justify-center py-1">
                    {!isCompleted && !isFailed ? (
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full">
                            {/* LEFT: SENSEI MASCOT (3D RENDER) */}
                            <div className="shrink-0 flex flex-col items-center justify-center md:w-60">
                                <KumaMascot
                                    mood={mascotMood}
                                    customMessage={customSpeech}
                                    size="md"
                                    showBubble={true}
                                    path={activePath}
                                    beltRank={activeBeltRank}
                                    strikeTrigger={`${currentIndex}-${answerStatus}-${streak}`}
                                />
                                {streak >= 3 && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-red-600/30 to-amber-600/30 border border-amber-500/50 text-amber-300 text-xs font-black tracking-widest uppercase shadow-lg shadow-amber-500/20"
                                    >
                                        <Fire className="w-3.5 h-3.5 text-amber-400" weight="fill" />
                                        Racha x{streak}
                                    </motion.div>
                                )}
                            </div>

                            {/* RIGHT: QUESTION & INTERACTIVE ANSWERS */}
                            <div className="flex-1 w-full max-w-xl space-y-3.5 md:space-y-4">
                                {/* Question Header with Clear Padding, Cancel Option & Quick Testing Navigator */}
                                <div className="space-y-2">
                                    {/* Testing Question Switcher (ESTRICTAMENTE SOLO PARA SUPER_ADMIN) */}
                                    {isSuperAdmin && (
                                        <div className="flex items-center justify-between gap-2 flex-wrap bg-zinc-900/90 p-2 rounded-2xl border border-amber-500/20 shadow-md">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <button
                                                    type="button"
                                                    disabled={currentIndex === 0}
                                                    onClick={() => {
                                                        didacticSound.playClick();
                                                        setCurrentIndex((prev) => Math.max(0, prev - 1));
                                                    }}
                                                    className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                                    title="Pregunta anterior"
                                                >
                                                    ◀ Ant
                                                </button>

                                                {level.questions.map((_, qIdx) => (
                                                    <button
                                                        key={qIdx}
                                                        type="button"
                                                        onClick={() => {
                                                            didacticSound.playClick();
                                                            setCurrentIndex(qIdx);
                                                        }}
                                                        className={`w-7 h-7 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                                                            qIdx === currentIndex
                                                                ? "bg-gradient-to-r from-amber-500 to-kuma-gold text-zinc-950 ring-2 ring-amber-300 shadow-md shadow-amber-500/40 scale-105"
                                                                : "bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white"
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
                                                    className="px-2.5 py-1.5 rounded-xl text-xs font-black bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                                                    title="Siguiente pregunta"
                                                >
                                                    Sig ▶
                                                </button>
                                            </div>

                                            <div className="flex items-center gap-1.5 ml-auto">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                                    <span>🛡️</span>
                                                    <span className="hidden sm:inline">Super Admin</span>
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="inline-block text-[11px] font-black uppercase tracking-[0.2em] text-kuma-gold px-2.5 py-0.5 rounded-full bg-kuma-gold/10 border border-kuma-gold/30">
                                            Pregunta {currentIndex + 1} de {totalQuestions} • {level.tag}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleRequestCancel}
                                            className="text-[11px] font-bold text-zinc-400 hover:text-red-400 uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer sm:hidden"
                                            title="Cancelar lección en curso"
                                        >
                                            <X className="w-3.5 h-3.5 text-red-400" weight="bold" />
                                            <span>Cancelar</span>
                                        </button>
                                    </div>
                                    <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-black text-white leading-snug drop-shadow-md">
                                        {currentQuestion.prompt}
                                    </h2>
                                </div>

                                {/* QUESTION IMAGE (IF ANY) */}
                                {currentQuestion.image && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.96 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="relative w-full h-36 md:h-44 rounded-2xl overflow-hidden border-2 border-white/10 bg-black/90 shadow-xl group"
                                    >
                                        <Image
                                            src={currentQuestion.image}
                                            alt="Referencia oficial de Karate Kuma"
                                            fill
                                            className="object-contain p-2.5 group-hover:scale-105 transition-transform duration-500"
                                            priority
                                        />
                                    </motion.div>
                                )}

                                {/* MULTIPLE CHOICE / IMAGE CHOICE WITH 3D TACTILE BUTTONS */}
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
                                                buttonClass = "bg-gradient-to-r from-amber-500/20 via-kuma-gold/15 to-transparent border-kuma-gold border-b-amber-600 text-white shadow-[0_0_25px_rgba(234,179,8,0.25)] translate-y-0.5";
                                                if (isCorrectAnswer) {
                                                    buttonClass += " ring-2 ring-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.45)]";
                                                }
                                            } else if (isCorrectAnswer) {
                                                // Sombra temporal verde en la respuesta correcta solicitada para pruebas
                                                buttonClass = "bg-emerald-950/35 hover:bg-emerald-950/50 border-emerald-500/60 border-b-emerald-700 text-emerald-50 shadow-[0_0_28px_rgba(16,185,129,0.45)] ring-2 ring-emerald-500/50 hover:border-emerald-400/80 transition-all";
                                            } else {
                                                buttonClass = "bg-zinc-900/90 hover:bg-zinc-850 border-white/10 border-b-zinc-950 text-zinc-200 hover:border-white/20 active:translate-y-1 active:border-b-2";
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
                                                            className={`w-6 h-6 rounded-lg border text-xs font-black flex items-center justify-center shrink-0 ${
                                                                isSelected
                                                                    ? "bg-kuma-gold border-kuma-gold text-zinc-950"
                                                                    : isCorrectAnswer
                                                                    ? "bg-emerald-900/70 border-emerald-500/70 text-emerald-300"
                                                                    : "border-white/20 text-zinc-400 bg-black/40"
                                                            }`}
                                                        >
                                                            {letters[idx]}
                                                        </span>
                                                        <span className="leading-snug">{opt.text}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 ml-3 shrink-0">
                                                        {isCorrectAnswer && (
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)] flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                                Correcta
                                                            </span>
                                                        )}
                                                        <div
                                                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                                                isSelected
                                                                    ? "border-kuma-gold bg-kuma-gold text-zinc-950 font-bold"
                                                                    : isCorrectAnswer
                                                                    ? "border-emerald-500/70 bg-emerald-950/60"
                                                                    : "border-white/20"
                                                            }`}
                                                        >
                                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* TRUE / FALSE TACTILE TILES */}
                                {currentQuestion.type === "true_false" && (
                                    <div className="grid grid-cols-2 gap-3.5">
                                        {[
                                            { val: true, label: "Verdadero", icon: CheckCircle },
                                            { val: false, label: "Falso", icon: XCircle },
                                        ].map(({ val, label, icon: Icon }) => {
                                            const isSelected = selectedBool === val;
                                            const isCorrectBool = isSuperAdmin && Boolean(
                                                currentQuestion.correctBool === val
                                            );

                                            let tileClass = "";
                                            if (isSelected) {
                                                tileClass = "bg-gradient-to-r from-amber-500/20 to-kuma-gold/20 border-kuma-gold border-b-amber-600 text-white shadow-[0_0_25px_rgba(234,179,8,0.25)] translate-y-0.5";
                                                if (isCorrectBool) {
                                                    tileClass += " ring-2 ring-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.45)]";
                                                }
                                            } else if (isCorrectBool) {
                                                // Sombra temporal verde en la respuesta correcta solicitada para pruebas
                                                tileClass = "bg-emerald-950/35 hover:bg-emerald-950/50 border-emerald-500/60 border-b-emerald-700 text-emerald-100 shadow-[0_0_28px_rgba(16,185,129,0.45)] ring-2 ring-emerald-500/50 hover:border-emerald-400/80";
                                            } else {
                                                tileClass = "bg-zinc-900/90 hover:bg-zinc-850 border-white/10 border-b-zinc-950 text-zinc-300 hover:border-white/20 active:translate-y-1 active:border-b-2";
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
                                                    <Icon className={`w-8 h-8 ${isSelected ? "text-kuma-gold" : isCorrectBool ? "text-emerald-400" : "text-zinc-500"}`} weight="fill" />
                                                    <div className="flex items-center gap-1.5">
                                                        <span>{label}</span>
                                                        {isCorrectBool && (
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.35)] flex items-center gap-1">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                                Correcta
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* MATCHING WITH CONNECTING CARDS */}
                                {currentQuestion.type === "matching" && currentQuestion.pairs && (
                                    <div className="space-y-2.5">
                                        <p className="text-xs text-zinc-400 italic">
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
                                                                    ? "bg-emerald-950/40 border-emerald-500/50 border-b-emerald-700 text-emerald-400 opacity-60 line-through"
                                                                    : isSelected
                                                                    ? "bg-amber-500/20 border-kuma-gold border-b-amber-600 text-white ring-2 ring-kuma-gold/50 translate-y-0.5"
                                                                    : "bg-zinc-900 border-white/10 border-b-zinc-950 text-zinc-200 hover:border-white/25 active:translate-y-1"
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
                                                                    ? "bg-emerald-950/40 border-emerald-500/50 border-b-emerald-700 text-emerald-400 opacity-60 line-through"
                                                                    : isSelected
                                                                    ? "bg-amber-500/20 border-kuma-gold border-b-amber-600 text-white ring-2 ring-kuma-gold/50 translate-y-0.5"
                                                                    : "bg-zinc-900 border-white/10 border-b-zinc-950 text-zinc-200 hover:border-white/25 active:translate-y-1"
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
                            </div>
                        </div>
                    ) : isCompleted ? (
                        /* LUXURY VICTORY SCREEN */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-6 text-center max-w-lg mx-auto w-full"
                        >
                            <KumaMascot mood="completed" size="lg" showBubble={true} customMessage={customSpeech} path={activePath} beltRank={activeBeltRank} />

                            <div className="mt-4">
                                <span className="text-kuma-gold font-bold uppercase tracking-[0.25em] text-xs">
                                    ¡Nivel Marcial Superado!
                                </span>
                                <h2 className="text-3xl md:text-5xl font-serif font-black text-white mt-1">
                                    {level.title}
                                </h2>
                            </div>

                            <div className="grid grid-cols-3 gap-3.5 w-full mt-6">
                                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-kuma-gold/40 flex flex-col items-center shadow-lg">
                                    <Trophy className="w-6 h-6 text-kuma-gold mb-1" weight="duotone" />
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">XP Ganados</span>
                                    <span className="text-2xl font-serif font-black text-white">+{level.xpReward}</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col items-center shadow-lg">
                                    <Sparkle className="w-6 h-6 text-amber-400 mb-1" weight="fill" />
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Precisión</span>
                                    <span className="text-2xl font-serif font-black text-white">
                                        {Math.round((correctCount / totalQuestions) * 100)}%
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-red-500/30 flex flex-col items-center shadow-lg">
                                    <Heart className="w-6 h-6 text-red-500 mb-1" weight="fill" />
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Vidas</span>
                                    <span className="text-2xl font-serif font-black text-white">{hearts}/5</span>
                                </div>
                            </div>

                            <div className="w-full space-y-3 mt-8">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-kuma-gold text-zinc-950 font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-2xl shadow-kuma-gold/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                                >
                                    <span>Regresar al Camino Kuma</span>
                                    <ArrowRight className="w-5 h-5" weight="bold" />
                                </button>

                                <button
                                    onClick={() => setIsTheoryOpen(true)}
                                    className="w-full py-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Scroll className="w-4 h-4 text-kuma-gold" weight="duotone" />
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
                                size="lg"
                                showBubble={true}
                                path={activePath}
                                beltRank={activeBeltRank}
                                customMessage={customSpeech || "¡No te rindas! La verdadera maestría nace de levantarse tras cada caída."}
                            />

                            <div className="mt-4">
                                <span className="text-red-400 font-bold uppercase tracking-[0.25em] text-xs">
                                    Lección No Superada
                                </span>
                                <h2 className="text-3xl md:text-5xl font-serif font-black text-white mt-1">
                                    {hearts <= 0 ? "¡Vidas Agotadas!" : "Práctica Incompleta"}
                                </h2>
                                <p className="text-xs md:text-sm text-zinc-300 mt-2 max-w-md leading-relaxed">
                                    En el camino del karate, caer siete veces significa levantarse ocho. Vuelve al camino para meditar la teoría y vuelve cuando estés listo.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-3.5 w-full mt-6">
                                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col items-center shadow-lg">
                                    <Trophy className="w-6 h-6 text-zinc-500 mb-1" weight="duotone" />
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Aciertos</span>
                                    <span className="text-2xl font-serif font-black text-white">{correctCount}/{totalQuestions}</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-white/10 flex flex-col items-center shadow-lg">
                                    <Sparkle className="w-6 h-6 text-amber-400 mb-1" weight="fill" />
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Precisión</span>
                                    <span className="text-2xl font-serif font-black text-white">
                                        {Math.round((correctCount / totalQuestions) * 100)}%
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-zinc-900/90 border border-red-500/40 flex flex-col items-center shadow-lg">
                                    <Heart className="w-6 h-6 text-red-500 mb-1" weight="fill" />
                                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Vidas</span>
                                    <span className="text-2xl font-serif font-black text-red-400">{hearts}/5</span>
                                </div>
                            </div>

                            <div className="w-full space-y-3 mt-8">
                                {/* PRIMARY BUTTON: RETURN TO PATH (DIRECT USER REQUIREMENT) */}
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-kuma-gold text-zinc-950 font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-2xl shadow-kuma-gold/30 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                                >
                                    <span>Regresar al Camino Kuma</span>
                                    <ArrowRight className="w-5 h-5" weight="bold" />
                                </button>

                                {/* SECONDARY BUTTON: RETRY LEVEL */}
                                <button
                                    onClick={handleRetry}
                                    className="w-full py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/20 text-zinc-200 hover:text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <ArrowCounterClockwise className="w-4 h-4 text-kuma-gold" weight="bold" />
                                    <span>Reintentar Nivel Ahora</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </main>

            {/* =========================================
                ZONE 3: SAFE PINNED BOTTOM VALIDATION DOCK
                Guaranteed to stay pinned at bottom without covering any content
            ========================================= */}
            {!isCompleted && !isFailed && (
                <footer className="w-full shrink-0 border-t border-white/10 bg-zinc-950/95 backdrop-blur-2xl py-4 md:py-5 px-4 md:px-8 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
                    <div className="max-w-5xl mx-auto">
                        {answerStatus === "idle" ? (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                {/* Explicit Cancel Button while answering questions */}
                                <button
                                    type="button"
                                    onClick={handleRequestCancel}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/10 hover:border-red-500/40 bg-zinc-900/90 hover:bg-red-950/40 text-zinc-400 hover:text-red-300 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm order-2 sm:order-1"
                                    title="Cancelar la lección en curso y volver al mapa"
                                >
                                    <X className="w-4 h-4 text-red-400" weight="bold" />
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
                                                className="px-3.5 py-3.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 hover:text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
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
                                                className="px-3.5 py-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-30 disabled:pointer-events-none text-amber-300 hover:text-amber-200 border border-amber-500/30 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
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
                                        className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all select-none ${
                                            canCheck
                                                ? "bg-gradient-to-r from-amber-500 to-kuma-gold text-zinc-950 hover:brightness-110 shadow-xl shadow-kuma-gold/25 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 cursor-pointer"
                                                : "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5"
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
                                className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-emerald-950/95 border-2 border-emerald-500/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 backdrop-blur-2xl shadow-[0_0_40px_rgba(16,185,129,0.25)] max-h-[65vh] overflow-y-auto"
                            >
                                <div className="flex items-start gap-3.5 w-full">
                                    <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" weight="fill" />
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-900/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                                                🥋 ¡Poderoso Tsuki Certero de Kuma Sensei!
                                            </span>
                                        </div>
                                        <h3 className="font-serif font-black text-emerald-300 text-base md:text-lg">
                                            ¡Excelente! Técnica Impecable
                                        </h3>
                                        <p className="text-xs md:text-sm text-emerald-100/90 mt-0.5 leading-relaxed">
                                            {currentQuestion.explanation}
                                        </p>
                                        <QuestionBibliography
                                            references={currentQuestion.references || currentQuestion.bibliography}
                                            variant="correct"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end self-end lg:self-center">
                                    <button
                                        type="button"
                                        onClick={handleRequestCancel}
                                        className="px-3.5 py-3 rounded-2xl text-xs font-bold text-emerald-200/70 hover:text-red-300 transition-colors cursor-pointer"
                                        title="Cancelar lección"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/30 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all shrink-0 cursor-pointer"
                                    >
                                        Continuar 🥋
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-red-950/95 border-2 border-red-500/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 backdrop-blur-2xl shadow-[0_0_40px_rgba(239,68,68,0.25)] max-h-[65vh] overflow-y-auto"
                            >
                                <div className="flex items-start gap-3.5 w-full">
                                    <XCircle className="w-8 h-8 text-red-400 shrink-0 mt-0.5" weight="fill" />
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-red-400 bg-red-900/60 px-2 py-0.5 rounded-md border border-red-500/30">
                                                😢 Kuma Sensei te apoya: ¡Aprende del error!
                                            </span>
                                        </div>
                                        <h3 className="font-serif font-black text-red-300 text-base md:text-lg">
                                            Respuesta Incorrecta
                                        </h3>
                                        <p className="text-xs md:text-sm text-red-100/90 mt-0.5 leading-relaxed">
                                            {currentQuestion.explanation}
                                        </p>
                                        <QuestionBibliography
                                            references={currentQuestion.references || currentQuestion.bibliography}
                                            variant="wrong"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end self-end lg:self-center">
                                    <button
                                        type="button"
                                        onClick={handleRequestCancel}
                                        className="px-3.5 py-3 rounded-2xl text-xs font-bold text-red-300/70 hover:text-red-200 transition-colors cursor-pointer"
                                        title="Cancelar lección"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/30 border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all shrink-0 cursor-pointer"
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
