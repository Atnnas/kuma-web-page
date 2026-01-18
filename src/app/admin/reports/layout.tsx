import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ReportsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Enforce super_admin role
    if (session?.user?.role !== "super_admin") {
        redirect("/admin");
    }

    return (
        <div>
            {children}
        </div>
    );
}
