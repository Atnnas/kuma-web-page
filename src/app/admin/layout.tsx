import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AnimatedBackground } from "@/components/admin/AnimatedBackground";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen relative flex">
            {/* Dynamic Background */}
            <AnimatedBackground />

            <div className="relative z-10 flex w-full">
                <AdminSidebar />
                <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen">
                    <div className="p-6 md:p-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
