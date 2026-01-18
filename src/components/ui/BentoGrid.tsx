"use client";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto auto-rows-[25rem]",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
    isPremium,
    image,
    link,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    isPremium?: boolean;
    image?: string;
    link: string;
}) => {
    return (
        <div
            className={cn(
                "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 relative overflow-hidden",
                className
            )}
        >
            {/* Background Image */}
            {image && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={image}
                        alt="Background"
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500 group-hover/bento:scale-110 opacity-60",
                            isPremium && "blur-sm grayscale opacity-30" // Effect for locked content
                        )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                </div>
            )}

            <div className="group-hover/bento:translate-x-2 transition duration-200 relative z-20 h-full flex flex-col justify-end">

                {/* Premium Lock Icon */}
                {isPremium && (
                    <div className="absolute top-0 right-0 p-2 bg-red-600 rounded-bl-xl shadow-lg">
                        <Lock className="h-5 w-5 text-white" />
                    </div>
                )}

                <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                    {title}
                </div>
                <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
                    {description}
                </div>

                {isPremium ? (
                    <Link href="/register" className="mt-4">
                        <button className="px-4 py-2 rounded-full border border-red-500 text-red-100 bg-red-600/20 hover:bg-red-600 hover:text-white text-xs font-bold transition-colors w-full">
                            🔒 Suscríbete para leer
                        </button>
                    </Link>
                ) : (
                    <Link href={link} className="mt-4">
                        <button className="px-4 py-2 rounded-full border border-neutral-600 text-neutral-300 hover:bg-neutral-800 text-xs transition-colors w-fit">
                            Leer más &rarr;
                        </button>
                    </Link>
                )}

            </div>
        </div>
    );
};
