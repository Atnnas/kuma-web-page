"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Hook para gestionar el bloqueo de suspensión de pantalla (Screen Wake Lock API).
 * Evita que dispositivos móviles o portátiles apaguen la pantalla mientras
 * el usuario está entrenando kata, kihon o rutinas de ejercicio.
 */
export function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<any>(null);

  const requestWakeLock = useCallback(async () => {
    if (typeof window === "undefined" || !("wakeLock" in navigator)) return;
    try {
      if (!wakeLockRef.current) {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        wakeLockRef.current.addEventListener("release", () => {
          wakeLockRef.current = null;
        });
      }
    } catch (err: any) {
      // Ignorar errores comunes como batería baja o permisos denegados en background
      console.warn("Screen Wake Lock no pudo ser adquirido:", err?.message || err);
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLockRef.current) {
      try {
        wakeLockRef.current.release().catch(() => {});
      } finally {
        wakeLockRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && enabled) {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      releaseWakeLock();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled, requestWakeLock, releaseWakeLock]);

  return { requestWakeLock, releaseWakeLock };
}
