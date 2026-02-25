import { getNews, seedNews } from "@/lib/actions/news";
import { NewsFeed } from "@/components/news/NewsFeed";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function NewsPage() {
    // Check Authentication & Role
    const session = await auth();
    // const role = session?.user?.role;

    // Removed restriction as per request: Accessible to all users
    // if (role !== "super_admin") {
    //    redirect("/");
    // }

    // Try to seed if empty (Auto-seed for convenience)
    // Try to seed if empty (Auto-seed for convenience)
    // await seedNews(); // DISABLED: User wants only manual content

    // Fetch data on the server
    const newsItems = await getNews();

    // Pass data to Client Component
    return <NewsFeed newsItems={newsItems} />;
}
