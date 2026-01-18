"use client";

import { useEffect, useState } from "react";
import Turnstile from "react-turnstile";

interface TurnstileWidgetProps {
    onVerify: (token: string) => void;
}

export default function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="flex justify-center my-4">
            <Turnstile
                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA"} // Testing key
                onVerify={onVerify}
                theme="dark"
            />
        </div>
    );
}
