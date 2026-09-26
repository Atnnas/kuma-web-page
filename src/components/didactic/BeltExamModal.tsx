"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle,
    XCircle,
    Trophy,
    ArrowRight,
    ArrowCounterClockwise,
    Sparkle,
    X,
    Lightbulb,
    GraduationCap,
} from "@phosphor-icons/react";
import { BeltExamConfig } from "@/data/beltExamData";
import { BeltRank } from "@/types/didactica";
import { didacticSound } from "@/lib/didacticSound";

interface BeltExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    examConfig: BeltExamConfig;
    currentBelt: BeltRank;
    targetBelt?: BeltRank | null;
    onExamPassed: (earnedBeltId: string, earnedXp: number, examId?: string) => void;
}

export function BeltExamModal({
    isOpen,
    onClose,
    examConfig,
    currentBelt,
    targetBelt,
    onExamPassed,
}: BeltExamModalProps) {
    const questions = examConfig.questions;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    if (!isOpen) return null;

    const currentQuestion = questions[currentIndex];
    const isLastQuestion = currentIndex === questions.length - 1;
    const isPassing = correctAnswersCount >= examConfig.passingScore;

    const handleSelectOption = (optionId: string) => {
        if (isAnswerSubmitted) return;
        didacticSound.playClick();
        setSelectedOptionId(optionId);
    };

    const handleConfirmAnswer = () => {
        if (!selectedOptionId || isAnswerSubmitted) return;
        setIsAnswerSubmitted(true);

        const chosenOption = currentQuestion.options?.find((o) => o.id === selectedOptionId);
        const isCorrect = Boolean(chosenOption?.isCorrect);

        if (isCorrect) {
            didacticSound.playCorrect();
            setCorrectAnswersCount((prev) => prev + 1);
        } else {
            didacticSound.playWrong();
        }
    };

    const handleNextQuestion = () => {
        didacticSound.playClick();
        if (isLastQuestion) {
            setIsFinished(true);
            if (correctAnswersCount + (currentQuestion.options?.find((o) => o.id === selectedOptionId)?.isCorrect ? 0 : 0) >= examConfig.passingScore) {
                didacticSound.playBeltWon();
            }
        } else {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOptionId(null);
            setIsAnswerSubmitted(false);
        }
    };

    const handleRestartExam = () => {
        didacticSound.playClick();
        setCurrentIndex(0);
        setSelectedOptionId(null);
        setIsAnswerSubmitted(false);
        setCorrectAnswersCount(0);
        setIsFinished(false);
    };

    const handleClaimBeltPromotion = () => {
        didacticSound.playBeltWon();
        onExamPassed(examConfig.targetBeltId, examConfig.xpReward, `exam-${examConfig.beltId}`);
        onClose();
    };

    const progressPercentage = Math.round(((currentIndex + (isAnswerSubmitted ? 1 : 0)) / questions.length) * 100);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
                {/* BACKDROP CON DESENFOQUE ZEN */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-[#020617]/90 backdrop-blur-xl"
                />

                {/* MODAL WINDOW DEL TRIBUNAL DE EXAMEN */}
                <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 380, damping: 26 }}
                    className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-kuma-gold/60 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_35px_rgba(245,158,11,0.25)] text-white overflow-hidden z-10 my-auto"
                >
                    {/* BARRAS DE LUZ DECORATIVAS SUPERIOR */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-32 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

                    {/* ENCABEZADO CON LOS 3 EXAMINADORES */}
                    <div className="px-5 pt-5 pb-3 border-b border-zinc-800/80 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-400/50 flex items-center justify-center shrink-0">
                                <GraduationCap className="w-5 h-5 text-amber-300" weight="duotone" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 block">
                                    Panel de Árbitros WKF • Examen de Ascenso
                                </span>
                                <h3 className="text-sm sm:text-base font-serif font-black text-white leading-tight">
                                    {examConfig.title}
                                </h3>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            title="Cerrar examen"
                        >
                            <X className="w-4 h-4" weight="bold" />
                        </button>
                    </div>

                    {/* BARRA DE PROGRESO DE 10 PREGUNTAS */}
                    {!isFinished && (
                        <div className="px-5 py-2.5 bg-zinc-950/80 border-b border-zinc-800/60 flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center justify-between text-[10px] font-bold text-zinc-400 mb-1">
                                    <span>
                                        Pregunta <strong className="text-white">{currentIndex + 1}</strong> de {questions.length}
                                    </span>
                                    <span className="text-amber-300 font-black">{progressPercentage}%</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercentage}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>
                            <div className="px-2.5 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-[10px] font-black text-amber-300 shrink-0">
                                Aciertos: {correctAnswersCount}/{questions.length}
                            </div>
                        </div>
                    )}

                    {/* CUERPO DEL EXAMEN */}
                    <div className="p-5 sm:p-6">
                        {!isFinished ? (
                            <div>
                                {/* ENUNCIADO DE LA PREGUNTA */}
                                <div className="mb-5">
                                    <h4 className="text-base sm:text-lg font-serif font-black text-zinc-100 leading-snug">
                                        {currentQuestion.prompt}
                                    </h4>
                                    {currentQuestion.description && (
                                        <p className="text-xs text-zinc-400 mt-1 italic">
                                            {currentQuestion.description}
                                        </p>
                                    )}
                                </div>

                                {/* OPCIONES DE RESPUESTA */}
                                <div className="space-y-2.5 mb-5">
                                    {currentQuestion.options?.map((option, idx) => {
                                        const isSelected = selectedOptionId === option.id;
                                        const isCorrect = option.isCorrect;

                                        let optionStyle =
                                            "bg-zinc-900/80 hover:bg-zinc-800/90 border-zinc-700/80 text-zinc-200";

                                        if (isSelected && !isAnswerSubmitted) {
                                            optionStyle =
                                                "bg-amber-950/60 border-amber-400 text-yellow-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]";
                                        }

                                        if (isAnswerSubmitted) {
                                            if (isCorrect) {
                                                optionStyle =
                                                    "bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_14px_rgba(16,185,129,0.4)]";
                                            } else if (isSelected && !isCorrect) {
                                                optionStyle =
                                                    "bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_14px_rgba(239,68,68,0.4)]";
                                            } else {
                                                optionStyle = "bg-zinc-950/60 border-zinc-800/60 text-zinc-500 opacity-60";
                                            }
                                        }

                                        const letter = String.fromCharCode(65 + idx);

                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => handleSelectOption(option.id)}
                                                disabled={isAnswerSubmitted}
                                                className={`w-full p-3 sm:p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${optionStyle}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center shrink-0 border ${
                                                            isSelected
                                                                ? "bg-amber-400 text-black border-amber-300"
                                                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                                                        }`}
                                                    >
                                                        {letter}
                                                    </span>
                                                    <span>{option.text}</span>
                                                </div>

                                                {isAnswerSubmitted && isCorrect && (
                                                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" weight="fill" />
                                                )}
                                                {isAnswerSubmitted && isSelected && !isCorrect && (
                                                    <XCircle className="w-5 h-5 text-red-400 shrink-0" weight="fill" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* EXPLICACIÓN PEDAGÓGICA TRAS ENVIAR */}
                                <AnimatePresence>
                                    {isAnswerSubmitted && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 mb-5 flex items-start gap-2.5"
                                        >
                                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" weight="duotone" />
                                            <div>
                                                <strong className="text-amber-300 block mb-0.5">
                                                    Veredicto de los Árbitros WKF:
                                                </strong>
                                                <span>{currentQuestion.explanation}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* BOTÓN DE ACCIÓN: CONFIRMAR O SIGUIENTE */}
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    {!isAnswerSubmitted ? (
                                        <button
                                            type="button"
                                            onClick={handleConfirmAnswer}
                                            disabled={!selectedOptionId}
                                            className={`px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
                                                selectedOptionId
                                                    ? "bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-lg shadow-amber-500/30 cursor-pointer active:scale-95"
                                                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                            }`}
                                        >
                                            <span>Presentar Respuesta</span>
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleNextQuestion}
                                            className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 cursor-pointer active:scale-95 flex items-center gap-2"
                                        >
                                            <span>{isLastQuestion ? "Ver Calificación Final" : "Siguiente Pregunta"}</span>
                                            <ArrowRight className="w-4 h-4" weight="bold" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* PANTALLA FINAL DE VEREDICTO DE ASCENSO */
                            <div className="text-center py-4">
                                {isPassing ? (
                                    <motion.div
                                        initial={{ scale: 0.85, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                    >
                                        {/* ICONO DE CONSAGRACIÓN */}
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-4 border-white mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(250,204,21,0.7)] mb-4">
                                            <Trophy className="w-10 h-10 text-black" weight="fill" />
                                        </div>

                                        <span className="text-xs font-black uppercase tracking-[0.3em] text-yellow-300 block mb-1">
                                            ¡Veredicto de los Tres Árbitros WKF!
                                        </span>
                                        <h3 className="text-2xl sm:text-3xl font-serif font-black text-white mb-2">
                                            ¡Examen Oficial Aprobado!
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto mb-6">
                                            Has superado con honor las 10 preguntas marciales con{" "}
                                            <strong className="text-amber-300 font-black">
                                                 {correctAnswersCount}/10 aciertos
                                            </strong>
                                            . El panel de árbitros te otorga la consagración formal a tu nuevo rango.
                                        </p>

                                        {/* CINTURÓN AMARILLO CONSAGRADO */}
                                        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border-2 border-yellow-400 max-w-sm mx-auto shadow-[0_0_25px_rgba(250,204,21,0.3)] mb-6 text-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                                                Grado Alcanzado
                                            </span>
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-yellow-400 border border-black shadow-[0_0_10px_#facc15]" />
                                                <h4 className="text-xl font-serif font-black text-yellow-300">
                                                    Cinturón Amarillo (9° Kyu)
                                                </h4>
                                            </div>
                                            <p className="text-[11px] text-zinc-300 mt-1">
                                                "Los Primeros Rayos del Sol: Dominio de las Posiciones Fundamentales (Dachi)."
                                            </p>
                                        </div>

                                        {/* BOTÓN RECLAMAR GRADO */}
                                        <button
                                            type="button"
                                            onClick={handleClaimBeltPromotion}
                                            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(250,204,21,0.6)] cursor-pointer active:scale-95 transition-all inline-flex items-center gap-2"
                                        >
                                            <Sparkle className="w-4 h-4 text-black" weight="fill" />
                                            <span>Consagrar Cinturón Amarillo (+200 XP)</span>
                                            <Sparkle className="w-4 h-4 text-black" weight="fill" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    /* EXAMEN NO SUPERADO (MENOS DE 7/10) */
                                    <div>
                                        <div className="w-16 h-16 rounded-full bg-zinc-800 border-2 border-zinc-700 mx-auto flex items-center justify-center text-amber-400 mb-3">
                                            <GraduationCap className="w-8 h-8" weight="duotone" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-serif font-black text-white mb-2">
                                            Buen Intento Marcial
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto mb-6">
                                            Obtuviste <strong className="text-amber-400">{correctAnswersCount}/10</strong> aciertos. Se requiere un mínimo de <strong>{examConfig.passingScore}/10</strong> para consagrar el grado. Los árbitros te invitan a repasar los 4 módulos y volver a presentarte cuando desees.
                                        </p>

                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={handleRestartExam}
                                                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase tracking-wider shadow-md cursor-pointer hover:scale-105 transition-all flex items-center gap-2"
                                            >
                                                <ArrowCounterClockwise className="w-4 h-4" weight="bold" />
                                                <span>Intentar Nuevamente</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="px-5 py-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
                                            >
                                                Volver al Tatami
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
