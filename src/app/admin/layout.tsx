import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AnimatedBackground } from "@/components/admin/AnimatedBackground";

import { auth } from "@/auth";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="min-h-screen relative flex">
            {/* Dynamic Background */}
            <AnimatedBackground />

            <div className="relative z-10 flex w-full min-w-0">
                <AdminSidebar user={session?.user} />
                <main className="flex-1 w-full min-w-0 overflow-x-hidden lg:pl-64 pt-16 md:pt-20 lg:pt-0 min-h-screen">
                    <div className="px-3.5 py-4 sm:px-6 sm:py-8 md:p-10 max-w-7xl mx-auto min-w-0">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
