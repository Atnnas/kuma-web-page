"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const QUOTES = [
    { text: "La victoria está reservada para aquellos que están dispuestos a pagar su precio.", author: "Sun Tzu" },
    { text: "Conócete a ti mismo y conocerás el universo y a los dioses.", author: "Sócrates" },
    { text: "No recéis por una vida fácil, rezad por la fortaleza para afrontar una difícil.", author: "Bruce Lee" },
    { text: "El verdadero guerrero no es inmune al miedo. Lucha a pesar de él.", author: "Miyamoto Musashi" },
    { text: "Si no sabes a dónde vas, cualquier camino te llevará allí.", author: "Lewis Carroll" },
    { text: "La disciplina tarde o temprano vencerá a la inteligencia.", author: "Yokoi Kenji" },
    { text: "El dolor es inevitable, el sufrimiento es opcional.", author: "Haruki Murakami" },
    { text: "No lastimes a los demás con lo que te causa dolor a ti mismo.", author: "Buda" },
    { text: "Aquel que tiene un porqué para vivir se puede enfrentar a todos los 'cómos'.", author: "Friedrich Nietzsche" },
    { text: "La mejor victoria es vencer sin combatir.", author: "Sun Tzu" },
    { text: "Vacía tu mente, sé amorfo, moldeable, como el agua.", author: "Bruce Lee" },
    { text: "El guerrero exitoso es el hombre promedio, con un enfoque similar al láser.", author: "Bruce Lee" },
    { text: "La única verdad es la realidad.", author: "Aristóteles" },
    { text: "La felicidad de tu vida depende de la calidad de tus pensamientos.", author: "Marco Aurelio" },
    { text: "Haz cada cosa en la vida como si fuera la última.", author: "Marco Aurelio" },
    { text: "El hombre que no tiene imaginación no tiene alas.", author: "Muhammad Ali" },
    { text: "Cae siete veces y levántate ocho.", author: "Proverbio Japonés" },
    { text: "Hoy es la victoria sobre tu yo de ayer; mañana tu victoria sobre hombres inferiores.", author: "Miyamoto Musashi" },
    { text: "En medio de la dificultad reside la oportunidad.", author: "Albert Einstein" },
    { text: "Aquel que se conquista a sí mismo es el guerrero más poderoso.", author: "Confucio" },
    { text: "La vida es solo un sueño y nosotros somos la imaginación de nosotros mismos.", author: "Bill Hicks" },
    { text: "El secreto del cambio es enfocar toda tu energía, no en luchar contra lo viejo, sino en construir lo nuevo.", author: "Sócrates" },
    { text: "No es la muerte lo que un hombre debe temer, sino que nunca llegue a empezar a vivir.", author: "Marco Aurelio" },
    { text: "Domina a tu enemigo sin luchar.", author: "Gichin Funakoshi" },
    { text: "El kárate comienza y termina con respeto.", author: "Gichin Funakoshi" },
    { text: "La mente es como el agua. Cuando está agitada, es difícil ver. Si permites que se calme, la respuesta se vuelve clara.", author: "Oogway" },
    { text: "Si quieres conocer el camino, ve con quien ya lo ha recorrido.", author: "Proverbio Chino" },
    { text: "La paciencia no es simplemente la capacidad de esperar, es cómo nos comportamos mientras esperamos.", author: "Joyce Meyer" },
    { text: "El conocimiento no es suficiente, debemos aplicarlo. El deseo no es suficiente, debemos hacer.", author: "Bruce Lee" },
    { text: "La simplicidad es la clave de la brillantez.", author: "Bruce Lee" },
    { text: "No te compares con los demás. Compárate con la persona que eras ayer.", author: "Jordan Peterson" },
    { text: "La fortaleza no viene de la capacidad física. Viene de una voluntad indomable.", author: "Mahatma Gandhi" },
    { text: "Se buscan hombres para viaje peligroso. Sueldo bajo, frío extremo, largos meses de completa oscuridad, peligro constante, retorno ileso dudoso. Honor y reconocimiento en caso de éxito.", author: "Ernest Shackleton" },
    { text: "No cuentes los días, haz que los días cuenten.", author: "Muhammad Ali" },
    { text: "Lo que pensamos, nos convertimos.", author: "Buda" },
    { text: "Solo los que se arriesgan a ir demasiado lejos pueden descubrir hasta dónde se puede llegar.", author: "T.S. Eliot" },
    { text: "Un viaje de mil millas comienza con un solo paso.", author: "Lao Tsé" },
];

export function PhilosophicalQuote() {
    const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

    useEffect(() => {
        // Random Selection on Mount (Run only on client to match 'refresh' requirement)
        const randomIndex = Math.floor(Math.random() * QUOTES.length);
        setQuote(QUOTES[randomIndex]);
    }, []);

    if (!quote) return <div className="h-20" />; // Spacer

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="mt-8 md:mt-12 max-w-2xl mx-auto px-6 text-center"
        >
            <p className="text-zinc-400 font-serif text-sm md:text-lg italic leading-relaxed tracking-wide drop-shadow-lg">
                &ldquo;{quote.text}&rdquo;
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 opacity-60">
                <div className="h-[1px] w-8 bg-amber-500/50"></div>
                <span className="text-amber-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">BY {quote.author}</span>
                <div className="h-[1px] w-8 bg-amber-500/50"></div>
            </div>
        </motion.div>
    );
}
