"use client";

import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <Link href="/" title="Regresar al Inicio">
                <Image
                    src="/images/404-kuma.webp"
                    alt="404 - Haz clic para volver"
                    width={800}
                    height={800}
                    className="w-auto h-auto max-w-[600px] max-h-[80vh] object-contain mx-auto hover:scale-105 transition-transform duration-300"
                    priority
                    unoptimized
                />
            </Link>
        </div>
    );
}
