import { HumanBody } from "@/components/didactic/HumanBody";
import { BackButton } from "@/components/ui/BackButton";

export default function HumanBodyPage() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
            {/* Return Button */}
            <BackButton href="/recursos/didactica" />

            <HumanBody />
        </main>
    );
}
