"use client";
import React from "react";

/**
 * Japanese National Flag (Hinomaru / 日の丸 - Nisshōki) Icon
 * Represents the Traditional Martial Path (Tradición, Budo, Kata, Origen en Okinawa y Japón)
 */
export function JapaneseFlagIcon({
    className = "w-6 h-6",
    alt = "Bandera de Japón - Karate Tradicional"
}: {
    className?: string;
    alt?: string;
}) {
    return (
        <span className={`relative inline-flex items-center justify-center shrink-0 ${className} select-none`}>
            <svg
                viewBox="0 0 30 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto max-h-full rounded-[3px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.35)] border border-white/20"
            >
                {/* Clean Pure White Flag Field (2:3 Proportion) */}
                <rect width="30" height="20" fill="#FFFFFF" />
                {/* Official Hinomaru Crimson Sun Disc (Diameter = 3/5 of height = 12) */}
                <circle cx="15" cy="10" r="6" fill="#BC002D" />
            </svg>
        </span>
    );
}

/**
 * Japanese Flag Official Emblem Badge with Rich Framing
 */
export function JapaneseFlagBadge({
    className = "w-12 h-12"
}: {
    className?: string;
}) {
    return (
        <div className={`bg-white/95 rounded-2xl border border-white/30 p-2 flex items-center justify-center shrink-0 shadow-lg ${className}`}>
            <svg
                viewBox="0 0 30 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto max-h-full rounded-[3px] overflow-hidden shadow-sm border border-zinc-200"
            >
                <rect width="30" height="20" fill="#FFFFFF" />
                <circle cx="15" cy="10" r="6" fill="#BC002D" />
            </svg>
        </div>
    );
}

/**
 * Japanese Arched Bridge (Soribashi / 反り橋) Icon
 * Represents the Traditional Martial Path (Tradición, Kata, Budo, Origen de Okinawa)
 */
export function JapaneseBridgeIcon({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="bridgeVermilion" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="45%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#991B1B" />
                </linearGradient>
                <linearGradient id="giboshiGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FEF08A" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
            </defs>

            {/* Subtle Zen Water Ripples */}
            <path
                d="M4 27.5 C8 26, 12 28.5, 16 27.5 C20 26.5, 24 28.5, 28 27.5"
                stroke="#38BDF8"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.6"
            />
            <path
                d="M8 29.8 C12 28.8, 16 30.2, 20 29.2 C22 28.8, 25 30.2, 26 29.8"
                stroke="#38BDF8"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.4"
            />

            {/* Dark Arch Shadow Under-Span */}
            <path
                d="M3 24.5 Q16 13 29 24.5 L29 22.5 Q16 11.5 3 22.5 Z"
                fill="#450A0A"
            />

            {/* Main Vermilion Red Curved Deck Arch */}
            <path
                d="M2 22.5 Q16 10.5 30 22.5 L30 19 Q16 7.5 2 19 Z"
                fill="url(#bridgeVermilion)"
                stroke="#7F1D1D"
                strokeWidth="0.8"
            />

            {/* Deck Plank Lines */}
            <line x1="7" y1="18.8" x2="7" y2="22" stroke="#7F1D1D" strokeWidth="0.8" />
            <line x1="11" y1="16.2" x2="11" y2="19.4" stroke="#7F1D1D" strokeWidth="0.8" />
            <line x1="16" y1="14.8" x2="16" y2="18" stroke="#7F1D1D" strokeWidth="0.8" />
            <line x1="21" y1="16.2" x2="21" y2="19.4" stroke="#7F1D1D" strokeWidth="0.8" />
            <line x1="25" y1="18.8" x2="25" y2="22" stroke="#7F1D1D" strokeWidth="0.8" />

            {/* Top Curved Railing */}
            <path
                d="M3 14 Q16 2.5 29 14"
                stroke="url(#bridgeVermilion)"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
            />
            {/* Lower Mid-Rail */}
            <path
                d="M3 17 Q16 6 29 17"
                stroke="#991B1B"
                strokeWidth="1"
                strokeLinecap="round"
                fill="none"
            />

            {/* Railing Vertical Posts */}
            <line x1="4" y1="13.5" x2="4" y2="21.5" stroke="#7F1D1D" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="9.5" y1="9" x2="9.5" y2="18.5" stroke="#7F1D1D" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="16" y1="7" x2="16" y2="16" stroke="#7F1D1D" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="22.5" y1="9" x2="22.5" y2="18.5" stroke="#7F1D1D" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="28" y1="13.5" x2="28" y2="21.5" stroke="#7F1D1D" strokeWidth="1.3" strokeLinecap="round" />

            {/* Golden Giboshi Orbs (Traditional Buddhist Jewel Post Finials) */}
            <circle cx="4" cy="12.5" r="1.5" fill="url(#giboshiGold)" stroke="#FEF08A" strokeWidth="0.4" />
            <circle cx="9.5" cy="8" r="1.5" fill="url(#giboshiGold)" stroke="#FEF08A" strokeWidth="0.4" />
            <circle cx="16" cy="6" r="1.6" fill="url(#giboshiGold)" stroke="#FEF08A" strokeWidth="0.4" />
            <circle cx="22.5" cy="8" r="1.5" fill="url(#giboshiGold)" stroke="#FEF08A" strokeWidth="0.4" />
            <circle cx="28" cy="12.5" r="1.5" fill="url(#giboshiGold)" stroke="#FEF08A" strokeWidth="0.4" />
        </svg>
    );
}

/**
 * World Karate Federation (WKF) Official Emblem
 * Official visual identity by Ogilvy: 5 Olympic/Federation colored petals separated by white channels
 * (Green #00B853, Yellow #FFB800, Blue #2101FF, Red #F00034, Black #1A1A1A) with the official WKF typography.
 * Represents the Sport Karate Path (Kumite Olímpico, Arbitraje WKF, Tatami, WKF World Tour)
 */
export function WkfShieldIcon({
    className = "w-6 h-6",
    alt = "Escudo Oficial WKF - World Karate Federation"
}: {
    className?: string;
    alt?: string;
}) {
    return (
        <span className={`relative inline-flex items-center justify-center shrink-0 ${className} select-none`}>
            <img
                src="/images/wkf_logo_full.webp"
                alt={alt}
                className="w-full h-full object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
                loading="eager"
            />
        </span>
    );
}

/**
 * World Karate Federation (WKF) Official Badge with Full Wordmark
 * Features the 5-petal emblem and "WORLD KARATE FEDERATION" typography.
 */
export function WkfOfficialBadge({
    className = "w-12 h-12"
}: {
    className?: string;
}) {
    return (
        <div className={`bg-white/95 rounded-2xl border border-white/30 p-1.5 flex items-center justify-center shrink-0 shadow-lg ${className}`}>
            <img
                src="/images/wkf_official_logo.webp"
                alt="Federación Mundial de Karate - WKF Oficial"
                className="w-full h-full object-contain"
                loading="eager"
            />
        </div>
    );
}

