import { getNewsBySlug } from "@/lib/actions/news";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Share2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Metadata } from "next";

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-20">
            {/* Hero Section */}
            <div className="relative h-[60vh] md:h-[70vh] w-full">
                <Image
                    src={newsItem.image}
                    alt={newsItem.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-end container mx-auto px-4 pb-12">
                    <Link href="/noticias" className="inline-flex items-center text-zinc-300 hover:text-white transition-colors mb-6 group w-fit">
                        <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Volver a Noticias
                    </Link>

                    <div className="space-y-4 max-w-4xl">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${newsItem.category === 'news' ? 'bg-blue-600' :
                                newsItem.category === 'event' ? 'bg-red-600' :
                                    'bg-amber-600'
                                } text-white shadow-lg`}>
                                {newsItem.category === 'news' ? 'Noticia' :
                                    newsItem.category === 'event' ? 'Evento' : 'Entrenamiento'}
                            </span>
                            <span className="flex items-center gap-2 text-zinc-300 font-medium bg-black/40 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                                <Calendar className="w-4 h-4 text-kuma-gold" />
                                <span className="capitalize">{formatDate(newsItem.date)}</span>
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black font-serif uppercase leading-tight text-white drop-shadow-2xl">
                            {newsItem.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-10">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                    {/* Share & Actions */}
                    <div className="flex justify-end mb-8 border-b border-white/5 pb-6">
                        <Button className="text-zinc-400 hover:text-white hover:bg-white/10" variant="ghost" size="sm">
                            <Share2 className="w-4 h-4 mr-2" /> Compartir
                        </Button>
                    </div>

                    {/* Main Text */}
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-p:text-zinc-300 prose-p:leading-relaxed prose-strong:text-white prose-a:text-red-500 hover:prose-a:text-red-400">
                        {newsItem.description.split('\n').map((paragraph: string, i: number) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>
                </div>

                {/* Gallery Section */}
                {newsItem.images && newsItem.images.length > 0 && (
                    <div className="mt-20">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-1 w-12 bg-red-600 rounded-full" />
                            <h2 className="text-2xl font-serif font-black uppercase tracking-widest text-kuma-gold flex items-center gap-3">
                                <ImageIcon className="w-6 h-6" /> Galería de Fotos
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {newsItem.images.map((img: string, index: number) => (
                                <div key={index} className="relative aspect-video rounded-xl overflow-hidden group border border-zinc-800 hover:border-red-900/50 transition-all duration-500 shadow-lg">
                                    <Image
                                        src={img}
                                        alt={`Galería ${index + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
