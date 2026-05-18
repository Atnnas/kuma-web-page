"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface AnimatedTabsProps {
    tabs?: Tab[];
    defaultTab?: string;
    className?: string; // Container class
    tabListClassName?: string; // Class for the tab list container
    contentClassName?: string; // Class for the content container
}

const defaultTabs: Tab[] = [
    {
        id: "tab1",
        label: "Tab 1",
        content: <div className="p-4 text-white">Content 1</div>,
    },
];

export const AnimatedTabs = ({
    tabs = defaultTabs,
    defaultTab,
    className,
    tabListClassName,
    contentClassName,
}: AnimatedTabsProps) => {
    const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id);
    const selectedTab = tabs.find((tab) => tab.id === activeTab);

    if (!tabs?.length) return null;

    return (
        <div className={cn("w-full flex flex-col gap-y-4", className)}>
            {/* Tab List */}
            <div className="flex justify-center w-full">
                <div className={cn("flex gap-2 flex-wrap bg-zinc-900/80 backdrop-blur-md p-2 rounded-2xl border border-white/10", tabListClassName)}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative px-4 py-2 text-sm md:text-base font-bold rounded-xl text-zinc-400 outline-none transition-all duration-300 hover:text-white"
                            )}
                        >
                            {activeTab === tab.id && (
                                <div
                                    className="absolute inset-0 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)] backdrop-blur-sm rounded-xl border border-white/5 transition-all duration-300"
                                />
                            )}
                            <span className={cn("relative z-10 transition-colors", activeTab === tab.id ? "text-white" : "")}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className={cn("w-full relative", contentClassName)}>
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={cn(
                            "w-full transition-all duration-300",
                            activeTab === tab.id
                                ? "block opacity-100 translate-y-0"
                                : "hidden opacity-0 translate-y-2"
                        )}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
};
