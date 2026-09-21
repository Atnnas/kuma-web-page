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
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
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
        <div className="fixed inset-0 z-[70] flex flex-col bg-[#080C18]/98 backdrop-blur-3xl text-white select-none overflow-hidden">
            {/* Ambient Arcade Neon Glows (Emerald, Cyan, Fuchsia) */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-1/3 -right-20 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

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
                            className="w-full max-w-md bg-slate-900/95 border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(244,63,94,0.3)] text-center relative overflow-hidden backdrop-blur-xl"
                        >
                            {/* Decorative background aura */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-rose-500/15 blur-3xl pointer-events-none" />

                            {/* Close modal X button */}
                            <button
                                onClick={() => setIsCancelConfirmOpen(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label="Cerrar ventana"
                            >
                                <X className="w-5 h-5" weight="bold" />
                            </button>

                            {/* Alert Icon */}
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-inner">
                                <WarningCircle className="w-9 h-9" weight="fill" />
                            </div>

                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-400 mb-1 block">
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
                                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer order-1 sm:order-2"
                                >
                                    Continuar Lección
                                </button>
                                <button
                                    onClick={handleConfirmCancel}
                                    className="w-full py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-rose-950/60 border border-white/10 hover:border-rose-500/50 text-slate-400 hover:text-rose-300 font-black text-xs uppercase tracking-wider transition-all cursor-pointer order-2 sm:order-1"
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
            <header className="w-full shrink-0 border-b border-white/10 bg-[#080C18]/95 backdrop-blur-2xl z-30 pt-6 pb-4 px-4 md:px-8 shadow-md">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 md:gap-6">
                    {/* Prominent Cancel Lesson Button (Always visible) */}
                    <button
                        onClick={handleRequestCancel}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 hover:border-rose-400 text-rose-300 hover:text-rose-100 text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer group"
                        title="Cancelar la lección en curso y volver al mapa"
                        aria-label="Cancelar lección"
                    >
                        <X className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" weight="bold" />
                        <span className="hidden sm:inline">Cancelar Lección</span>
                        <span className="sm:hidden">Cancelar</span>
                    </button>

                    {/* Progress Bar with Arcade Liquid Shine */}
                    <div className="flex-1 mx-1 md:mx-4">
                        <div className="w-full h-4 bg-slate-900/90 rounded-full overflow-hidden border border-slate-700/60 p-0.5 relative shadow-inner">
                            <motion.div
                                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>

                    {/* Quick Pergamino Button */}
                    <button
                        onClick={() => setIsTheoryOpen(true)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-400/50 text-xs font-black tracking-wider uppercase transition-colors shadow-[0_0_12px_rgba(245,158,11,0.25)] shrink-0 cursor-pointer"
                        title="Abrir Pergamino Teórico"
                    >
                        <Scroll className="w-4 h-4" weight="duotone" />
                        <span className="hidden sm:inline">Pergamino</span>
                    </button>

                    {/* Sound Toggle */}
                    <button
                        onClick={toggleMute}
                        className="p-2.5 text-slate-400 hover:text-cyan-300 rounded-2xl hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                        title={isMuted ? "Activar audio" : "Silenciar audio"}
                    >
                        {isMuted ? <SpeakerSlash className="w-5 h-5" /> : <SpeakerHigh className="w-5 h-5 text-cyan-400" />}
                    </button>

                    {/* Hearts Counter (Fucsia Punch Neon) */}
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-950/60 border-2 border-rose-500/50 text-rose-300 text-sm font-black shadow-[0_0_18px_rgba(244,63,94,0.35)] shrink-0">
                        <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" weight="fill" />
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
                                        className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 border border-amber-400/60 text-amber-100 text-xs font-black tracking-widest uppercase shadow-lg shadow-orange-500/30"
                                    >
                                        <Fire className="w-4 h-4 text-amber-300 animate-bounce" weight="fill" />
                                        <span>Racha x{streak} 🔥</span>
                                    </motion.div>
                                )}
                            </div>

                            {/* RIGHT: QUESTION & INTERACTIVE ANSWERS */}
                            <div className="flex-1 w-full max-w-xl space-y-3.5 md:space-y-4">
                                {/* Question Header with Clear Padding, Cancel Option & Quick Testing Navigator */}
                                <div className="space-y-2">
                                    {/* Testing Question Switcher (ESTRICTAMENTE SOLO PARA SUPER_ADMIN) */}
                                    {isSuperAdmin && (
                                        <div className="flex items-center justify-between gap-2 flex-wrap bg-slate-900/90 p-2 rounded-2xl border border-amber-500/30 shadow-md">
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
                                                                ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 ring-2 ring-cyan-300 shadow-md shadow-cyan-500/40 scale-105"
                                                                : "bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white"
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
                                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1">
                                                    <span>🛡️</span>
                                                    <span className="hidden sm:inline">Super Admin</span>
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-300 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                            Pregunta {currentIndex + 1} de {totalQuestions} • {level.tag}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleRequestCancel}
                                            className="text-[11px] font-bold text-slate-400 hover:text-rose-400 uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer sm:hidden"
                                            title="Cancelar lección en curso"
                                        >
                                            <X className="w-3.5 h-3.5 text-rose-400" weight="bold" />
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

                                {/* MULTIPLE CHOICE / IMAGE CHOICE WITH 3D TACTILE ARCADE BUTTONS */}
                                {(currentQuestion.type === "multiple_choice" || currentQuestion.type === "image_choice") && (
                                    <div className="grid grid-cols-1 gap-2.5">
                                        {currentQuestion.options?.map((opt, idx) => {
                                            const isSelected = selectedOptionId === opt.id;
                                            const isCorrectAnswer = isSuperAdmin && Boolean(
                                                opt.isCorrect ||
                                                currentQuestion.correctAnswerId === opt.id
                                            );
                                            const letters = ["A", "B", "C", "D"];
                                            const letterColors = [
                                                "bg-cyan-500/20 border-cyan-400/50 text-cyan-300",
                                                "bg-fuchsia-500/20 border-fuchsia-400/50 text-fuchsia-300",
                                                "bg-amber-500/20 border-amber-400/50 text-amber-300",
                                                "bg-emerald-500/20 border-emerald-400/50 text-emerald-300",
                                            ];

                                            let buttonClass = "";
                                            if (isSelected) {
                                                buttonClass = "bg-gradient-to-r from-cyan-950/80 via-sky-950/50 to-slate-900 border-cyan-400 border-b-cyan-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.45)] ring-2 ring-cyan-400/50 translate-y-0.5";
                                                if (isCorrectAnswer) {
                                                    buttonClass += " ring-4 ring-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.55)]";
                                                }
                                            } else if (isCorrectAnswer) {
                                                buttonClass = "bg-emerald-950/40 hover:bg-emerald-950/60 border-emerald-400/70 border-b-emerald-600 text-emerald-50 shadow-[0_0_28px_rgba(16,185,129,0.45)] ring-2 ring-emerald-500/50 hover:border-emerald-300 transition-all";
                                            } else {
                                                buttonClass = "bg-slate-900/90 hover:bg-slate-850 border-slate-700/70 border-b-slate-950 text-slate-100 hover:border-cyan-400/40 active:translate-y-1 active:border-b-2 shadow-md";
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
                                                                    ? "bg-cyan-400 border-cyan-300 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                                                                    : isCorrectAnswer
                                                                    ? "bg-emerald-900/80 border-emerald-400 text-emerald-200"
                                                                    : letterColors[idx % 4]
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
                                                                    ? "border-cyan-400 bg-cyan-950 text-cyan-300 shadow-[0_0_8px_#00F0FF]"
                                                                    : isCorrectAnswer
                                                                    ? "border-emerald-500/70 bg-emerald-950/60"
                                                                    : "border-white/20"
                                                            }`}
                                                        >
                                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00F0FF]" />}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* TRUE / FALSE TACTILE TILES (DUOLINGO NEON) */}
                                {currentQuestion.type === "true_false" && (
                                    <div className="grid grid-cols-2 gap-3.5">
                                        {[
                                            {
                                                val: true,
                                                label: "Verdadero",
                                                icon: CheckCircle,
                                                theme: "emerald",
                                            },
                                            {
                                                val: false,
                                                label: "Falso",
                                                icon: XCircle,
                                                theme: "rose",
                                            },
                                        ].map(({ val, label, icon: Icon, theme }) => {
                                            const isSelected = selectedBool === val;
                                            const isCorrectBool = isSuperAdmin && Boolean(
                                                currentQuestion.correctBool === val
                                            );

                                            let tileClass = "";
                                            if (isSelected) {
                                                if (theme === "emerald") {
                                                    tileClass = "bg-emerald-900/70 border-emerald-400 border-b-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.45)] ring-2 ring-emerald-300 translate-y-0.5";
                                                } else {
                                                    tileClass = "bg-rose-900/70 border-rose-400 border-b-rose-600 text-white shadow-[0_0_30px_rgba(244,63,94,0.45)] ring-2 ring-rose-300 translate-y-0.5";
                                                }
                                            } else if (isCorrectBool) {
                                                tileClass = "bg-emerald-950/40 hover:bg-emerald-950/60 border-emerald-400/80 border-b-emerald-600 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.4)] ring-2 ring-emerald-400/50";
                                            } else {
                                                if (theme === "emerald") {
                                                    tileClass = "bg-slate-900/90 hover:bg-emerald-950/30 border-slate-700/80 hover:border-emerald-500/50 border-b-slate-950 text-slate-200 active:translate-y-1 active:border-b-2 shadow-md";
                                                } else {
                                                    tileClass = "bg-slate-900/90 hover:bg-rose-950/30 border-slate-700/80 hover:border-rose-500/50 border-b-slate-950 text-slate-200 active:translate-y-1 active:border-b-2 shadow-md";
                                                }
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
                                                                    ? "bg-emerald-950/60 border-emerald-400/60 border-b-emerald-700 text-emerald-300 opacity-70 line-through shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                                                    : isSelected
                                                                    ? "bg-cyan-950/80 border-cyan-400 border-b-cyan-600 text-white ring-2 ring-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] translate-y-0.5"
                                                                    : "bg-slate-900 border-slate-700/80 border-b-slate-950 text-slate-100 hover:border-cyan-400/40 active:translate-y-1 shadow-sm"
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
                                                                    ? "bg-emerald-950/60 border-emerald-400/60 border-b-emerald-700 text-emerald-300 opacity-70 line-through shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                                                    : isSelected
                                                                    ? "bg-cyan-950/80 border-cyan-400 border-b-cyan-600 text-white ring-2 ring-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] translate-y-0.5"
                                                                    : "bg-slate-900 border-slate-700/80 border-b-slate-950 text-slate-100 hover:border-cyan-400/40 active:translate-y-1 shadow-sm"
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
                        /* LUXURY ARCADE VICTORY SCREEN */
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-6 text-center max-w-lg mx-auto w-full"
                        >
                            <KumaMascot mood="completed" size="lg" showBubble={true} customMessage={customSpeech} path={activePath} beltRank={activeBeltRank} />

                            <div className="mt-4">
                                <span className="inline-block text-cyan-300 font-black uppercase tracking-[0.25em] text-xs bg-cyan-950/70 px-3.5 py-1 rounded-full border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                    ⚡ ¡Nivel Marcial Superado!
                                </span>
                                <h2 className="text-3xl md:text-5xl font-serif font-black text-white mt-2">
                                    {level.title}
                                </h2>
                            </div>

                            <div className="grid grid-cols-3 gap-3.5 w-full mt-6">
                                <div className="p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-400/50 flex flex-col items-center shadow-[0_0_20px_rgba(251,191,36,0.25)]">
                                    <Trophy className="w-6 h-6 text-amber-300 mb-1" weight="duotone" />
                                    <span className="text-[10px] text-amber-300/80 uppercase font-bold tracking-wider">XP Ganados</span>
                                    <span className="text-2xl font-serif font-black text-white">+{level.xpReward}</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-cyan-950/40 border-2 border-cyan-400/50 flex flex-col items-center shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                                    <Sparkle className="w-6 h-6 text-cyan-300 mb-1" weight="fill" />
                                    <span className="text-[10px] text-cyan-300/80 uppercase font-bold tracking-wider">Precisión</span>
                                    <span className="text-2xl font-serif font-black text-white">
                                        {Math.round((correctCount / totalQuestions) * 100)}%
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-rose-950/40 border-2 border-rose-500/50 flex flex-col items-center shadow-[0_0_20px_rgba(244,63,94,0.25)]">
                                    <Heart className="w-6 h-6 text-rose-400 mb-1" weight="fill" />
                                    <span className="text-[10px] text-rose-300/80 uppercase font-bold tracking-wider">Vidas</span>
                                    <span className="text-2xl font-serif font-black text-white">{hearts}/5</span>
                                </div>
                            </div>

                            <div className="w-full space-y-3 mt-8">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-2xl shadow-cyan-500/35 border-b-4 border-emerald-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Regresar al Camino Kuma</span>
                                    <ArrowRight className="w-5 h-5" weight="bold" />
                                </button>

                                <button
                                    onClick={() => setIsTheoryOpen(true)}
                                    className="w-full py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Scroll className="w-4 h-4 text-amber-400" weight="duotone" />
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
                                <span className="inline-block text-rose-400 font-bold uppercase tracking-[0.25em] text-xs bg-rose-950/60 px-3 py-0.5 rounded-full border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
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
                                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 flex flex-col items-center shadow-lg">
                                    <Trophy className="w-6 h-6 text-slate-500 mb-1" weight="duotone" />
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Aciertos</span>
                                    <span className="text-2xl font-serif font-black text-white">{correctCount}/{totalQuestions}</span>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700 flex flex-col items-center shadow-lg">
                                    <Sparkle className="w-6 h-6 text-amber-400 mb-1" weight="fill" />
                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Precisión</span>
                                    <span className="text-2xl font-serif font-black text-white">
                                        {Math.round((correctCount / totalQuestions) * 100)}%
                                    </span>
                                </div>

                                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex flex-col items-center shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                                    <Heart className="w-6 h-6 text-rose-500 mb-1" weight="fill" />
                                    <span className="text-[10px] text-rose-300 uppercase font-bold tracking-wider">Vidas</span>
                                    <span className="text-2xl font-serif font-black text-rose-400">{hearts}/5</span>
                                </div>
                            </div>

                            <div className="w-full space-y-3 mt-8">
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-2xl shadow-cyan-500/35 border-b-4 border-emerald-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <span>Regresar al Camino Kuma</span>
                                    <ArrowRight className="w-5 h-5" weight="bold" />
                                </button>

                                <button
                                    onClick={handleRetry}
                                    className="w-full py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <ArrowCounterClockwise className="w-4 h-4 text-cyan-400" weight="bold" />
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
                <footer className="w-full shrink-0 border-t border-white/10 bg-[#080C18]/95 backdrop-blur-2xl py-4 md:py-5 px-4 md:px-8 z-30 shadow-[0_-10px_35px_rgba(0,0,0,0.85)]">
                    <div className="max-w-5xl mx-auto">
                        {answerStatus === "idle" ? (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                {/* Explicit Cancel Button while answering questions */}
                                <button
                                    type="button"
                                    onClick={handleRequestCancel}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-slate-700 hover:border-rose-500/50 bg-slate-900/90 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm order-2 sm:order-1"
                                    title="Cancelar la lección en curso y volver al mapa"
                                >
                                    <X className="w-4 h-4 text-rose-400" weight="bold" />
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
                                                className="px-3.5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-slate-300 hover:text-white border border-slate-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-sm"
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
                                        className={`w-full sm:w-auto px-9 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all select-none ${
                                            canCheck
                                                ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 hover:brightness-110 shadow-xl shadow-emerald-400/30 border-b-4 border-emerald-600 active:border-b-0 active:translate-y-1 cursor-pointer"
                                                : "bg-slate-900 text-slate-600 cursor-not-allowed border border-white/5"
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
                                className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-[#06291C]/98 border-2 border-emerald-400 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,230,118,0.35)] max-h-[65vh] overflow-y-auto"
                            >
                                <div className="flex items-start gap-3.5 w-full">
                                    <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0 mt-0.5" weight="fill" />
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-400/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
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
                                        className="px-3.5 py-3 rounded-2xl text-xs font-bold text-emerald-200/70 hover:text-rose-300 transition-colors cursor-pointer"
                                        title="Cancelar lección"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-400/40 border-b-4 border-emerald-600 active:border-b-0 active:translate-y-1 transition-all shrink-0 cursor-pointer"
                                    >
                                        Continuar 🥋
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 md:p-5 rounded-2xl md:rounded-3xl bg-[#2D0D17]/98 border-2 border-rose-500 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 backdrop-blur-2xl shadow-[0_0_50px_rgba(244,63,94,0.35)] max-h-[65vh] overflow-y-auto"
                            >
                                <div className="flex items-start gap-3.5 w-full">
                                    <XCircle className="w-8 h-8 text-rose-400 shrink-0 mt-0.5" weight="fill" />
                                    <div className="w-full">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-rose-300 bg-rose-900/80 px-2.5 py-1 rounded-lg border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                                                😢 Kuma Sensei te apoya: ¡Aprende del error!
                                            </span>
                                        </div>
                                        <h3 className="font-serif font-black text-rose-300 text-base md:text-lg">
                                            Respuesta Incorrecta
                                        </h3>
                                        <p className="text-xs md:text-sm text-rose-100/90 mt-0.5 leading-relaxed">
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
                                        className="px-3.5 py-3 rounded-2xl text-xs font-bold text-rose-300/70 hover:text-rose-200 transition-colors cursor-pointer"
                                        title="Cancelar lección"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleNextQuestion}
                                        className="w-full sm:w-auto px-9 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/40 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 transition-all shrink-0 cursor-pointer"
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
