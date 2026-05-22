"use client";

import React, { useEffect, useState } from "react";
import { getLatestMvp } from "@/lib/actions/attendance";
import { KumaCelebrationModal } from "@/components/sections/KumaRanking";

interface MvpCelebrationTriggerProps {
    currentUser?: any;
}

export default function MvpCelebrationTrigger({ currentUser }: MvpCelebrationTriggerProps) {
    const [selectedMvp, setSelectedMvp] = useState<any | null>(null);
    const [mvpDate, setMvpDate] = useState<string>("");

    useEffect(() => {
        const currentUserId = currentUser?.id;
        if (!currentUserId) return;

        async function checkMvp() {
            try {
                const data = await getLatestMvp();
                if (!data || !data.athletes || data.athletes.length === 0) return;

                // Check localStorage to see if the user already saw the celebration for this date
                const storageKey = `kuma_mvp_seen_${data.date}_by_${currentUserId}`;
                const hasSeen = localStorage.getItem(storageKey);
                if (!hasSeen) {
                    // If multiple MVPs exist, prioritize showing the logged-in user if they are one of them
                    const athleteToShow = data.athletes.find((a: any) => a && a._id === currentUserId) || data.athletes[0];

                    setMvpDate(data.date);
                    setSelectedMvp(athleteToShow);
                }
            } catch (err) {
                console.error("Failed to check daily MVP celebration:", err);
            }
        }

        checkMvp();
    }, [currentUser?.id]);

    if (!selectedMvp) return null;

    const handleClose = () => {
        const currentUserId = currentUser?.id;
        if (currentUserId && mvpDate) {
            // Mark as seen in localStorage
            const storageKey = `kuma_mvp_seen_${mvpDate}_by_${currentUserId}`;
            localStorage.setItem(storageKey, "true");
        }
        setSelectedMvp(null);
    };

    const isUserMvp = currentUser?.id === selectedMvp._id;
    const customTitle = isUserMvp ? (
        <>¡Fuiste el <span className="text-kuma-gold">MVP</span> del último entrenamiento! 👑</>
    ) : (
        <>¡MVP del último entrenamiento: <span className="text-kuma-gold">{selectedMvp.name}</span>! 👑</>
    );
    const customSubtitle = isUserMvp 
        ? "¡Excelente trabajo en la clase anterior!" 
        : "Reconozcamos el gran desempeño de nuestro compañero";

    return (
        <KumaCelebrationModal
            isOpen={!!selectedMvp}
            onClose={handleClose}
            athlete={selectedMvp}
            customTitle={customTitle}
            customSubtitle={customSubtitle}
        />
    );
}
