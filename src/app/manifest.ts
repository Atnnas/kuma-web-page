import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Kuma Dojo • Academia de Karate",
        short_name: "Kuma Dojo",
        description: "Academia didáctica de Karate Shotokan, dojo virtual interactivo y entrenamiento marcial.",
        start_url: "/resources/didactica",
        scope: "/",
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#EAB308",
        orientation: "portrait",
        icons: [
            {
                src: "/images/kuma-logo.jpg",
                sizes: "192x192",
                type: "image/jpeg",
                purpose: "any",
            },
            {
                src: "/images/kuma-logo.jpg",
                sizes: "512x512",
                type: "image/jpeg",
                purpose: "any",
            },
            {
                src: "/images/kuma-logo.jpg",
                sizes: "512x512",
                type: "image/jpeg",
                purpose: "maskable",
            },
        ],
    };
}
