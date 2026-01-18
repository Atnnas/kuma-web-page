"use server";

import { requireSuperAdmin } from "@/lib/auth-utils";
import OrganizersClientPage from "@/components/admin/OrganizersClientPage";

export default async function AdminOrganizersPage() {
    await requireSuperAdmin();
    return <OrganizersClientPage />;
}
