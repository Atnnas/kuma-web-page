import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
    const session = await auth();
    return session?.user;
}

export async function requireSuperAdmin() {
    const user = await getCurrentUser();

    if (!user || user.role !== "super_admin") {
        throw new Error("Unauthorized: Super Admin access required");
    }

    return user;
}
