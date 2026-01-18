import { Hero } from "@/components/sections/Hero";
import { Feed } from "@/components/sections/Feed";
import { Philosophy } from "@/components/sections/Philosophy";
import { Training } from "@/components/sections/Training";
import { Shop } from "@/components/sections/Shop";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Philosophy />
      <Training />
      <Feed />
      <Shop />
    </main>
  );
}
