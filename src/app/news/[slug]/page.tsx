import { getNewsBySlug } from "@/lib/actions/news";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { NewsDetailView } from "@/components/news/NewsDetailView";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const slug = (await params).slug;
    const newsItem = await getNewsBySlug(slug);

    if (!newsItem) {
        return {
            title: "Noticia no encontrada",
        };
    }

    return {
        title: newsItem.title,
        description: newsItem.description.substring(0, 160),
        openGraph: {
            images: [newsItem.image],
        },
    };
}

export default async function NewsDetailPage({ params }: Props) {
    const slug = (await params).slug;
    const newsItem = await getNewsBySlug(slug);

    if (!newsItem) {
        notFound();
    }

    // Pass data to the Client Component
    return <NewsDetailView newsItem={newsItem} />;
}
