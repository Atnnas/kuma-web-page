import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ReportsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Enforce admin or super_admin role
    if (session?.user?.role !== "super_admin" && session?.user?.role !== "admin") {
        redirect("/admin");
    }

    return (
        <div className="w-full min-w-0">
            {children}
        </div>
    );
}
