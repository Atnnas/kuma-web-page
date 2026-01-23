"use client";

import { useState } from "react";

export function DebugSessionInfo({ userId, events }: { userId: string | undefined, events: any[] }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const firstEvent = events[0];

    return (
        <div className="fixed bottom-4 left-4 z-[9999] bg-black/90 text-green-400 p-4 rounded-xl border border-green-500 font-mono text-xs max-w-sm overflow-auto shadow-2xl">
            <div className="flex justify-between items-center mb-2">
                <strong className="text-white uppercase">Debug Mode</strong>
                <button onClick={() => setIsVisible(false)} className="text-red-500 font-bold hover:text-red-400">[X]</button>
            </div>
            <div className="space-y-2">
                <div>
                    <span className="text-zinc-500">My User ID:</span><br />
                    <span className="break-all bg-green-900/20 px-1">{userId || "UNDEFINED"}</span>
                </div>
                {firstEvent && (
                    <div>
                        <span className="text-zinc-500">First Event Participants ({firstEvent.participants?.length}):</span><br />
                        <div className="max-h-20 overflow-y-auto bg-green-900/20 px-1 border border-green-900 mt-1">
                            {JSON.stringify(firstEvent.participants, null, 2)}
                        </div>
                        <div className="mt-1">
                            Is Included? {firstEvent.participants?.includes(userId) ? "YES ✅" : "NO ❌"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
