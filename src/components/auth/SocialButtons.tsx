"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { FaGoogle, FaFacebook } from "react-icons/fa";

export function SocialButtons() {
    const handleSocialLogin = (provider: "google" | "facebook") => {
        signIn(provider, { callbackUrl: "/" });
    };

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-zinc-950 px-2 text-zinc-500">O continúa con</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleSocialLogin("google")}
                    className="w-full flex items-center justify-center gap-2 border-zinc-800 hover:bg-zinc-900 hover:border-[#6F4E37] hover:text-[#6F4E37] transition-colors"
                >
                    <FaGoogle className="h-4 w-4" />
                    Google
                </Button>
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleSocialLogin("facebook")}
                    className="w-full flex items-center justify-center gap-2 border-zinc-800 hover:bg-zinc-900 hover:border-[#6F4E37] hover:text-[#6F4E37] transition-colors"
                >
                    <FaFacebook className="h-4 w-4" />
                    Facebook
                </Button>
            </div>
        </div>
    );
}
