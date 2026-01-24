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

            <div className="relative z-10 flex w-full">
                <AdminSidebar user={session?.user} />
                <main className="flex-1 lg:pl-64 pt-20 lg:pt-0 min-h-screen">
                    <div className="p-6 md:p-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
