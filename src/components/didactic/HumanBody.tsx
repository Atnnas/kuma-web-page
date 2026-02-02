"use client";
import React from "react";
import Image from "next/image";

export function HumanBody() {
    return (
        <div className="w-full min-h-[85vh] bg-zinc-950 flex flex-col items-center justify-center p-4 md:p-8">

            {/* Title (Optional but good for context) */}


            {/* Image Container */}
            <div className="relative w-full max-w-lg md:max-w-2xl lg:max-w-4xl shadow-2xl rounded-lg overflow-hidden border border-zinc-800 bg-black md:mt-20">
                <Image
                    src="/images/kuma-partes-cuerpo.jpg"
                    alt="Partes del Cuerpo - Kuma Dojo"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-contain"
                    priority
                />
            </div>


        </div>
    );
}
