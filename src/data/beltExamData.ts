import { Question } from "@/types/didactica";

export interface BeltExamConfig {
    beltId: string;
    targetBeltId: string;
    beltName: string;
    targetBeltName: string;
    targetBeltColor: string;
    passingScore: number; // e.g. 7 out of 10
    xpReward: number;
    title: string;
    subtitle: string;
    description: string;
    questions: Question[];
}

/**
 * EXAMEN OFICIAL DE GRADO: CINTURÓN BLANCO (10° KYU) ➔ CINTURÓN AMARILLO (9° KYU)
 * 10 preguntas magistrales que evalúan los 4 pilares: Historia, Cuerpo Humano, Kihon y Kata.
 */
export const WHITE_BELT_EXAM: BeltExamConfig = {
    beltId: "kyu-10",
    targetBeltId: "kyu-9",
    beltName: "Cinturón Blanco (10° Kyu)",
    targetBeltName: "Cinturón Amarillo (9° Kyu)",
    targetBeltColor: "#EAB308",
    passingScore: 7,
    xpReward: 200,
    title: "Examen de Ascenso a Cinturón Amarillo (9° Kyu)",
    subtitle: "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
    description: "Demuestra tu dominio ante los Tres Examinadores en Historia, Anatomía, Kihon y Kata para consagrar tu primer cinturón de color.",
    questions: [
        {
            id: "exam-w-q1",
            type: "multiple_choice",
            prompt: "1. HISTORIA: ¿En qué archipiélago nació originalmente el Karate-Do antes de expandirse por el mundo?",
            description: "Cuna marítima entre China y Japón.",
            options: [
                { id: "o1", text: "🏝️ Reino de Ryukyu (actual prefectura de Okinawa)", isCorrect: true },
                { id: "o2", text: "🏔️ En las faldas del Monte Fuji en Tokio", isCorrect: false },
                { id: "o3", text: "🏯 En Kioto por samuráis de la corte imperial", isCorrect: false },
                { id: "o4", text: "🌊 En una isla desierta del mar de Japón", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Exacto! El Karate nació en el antiguo archipiélago de Ryukyu (Okinawa) mediante el crisol del 'Te' autóctono con el boxeo de Fujian.",
            hint: "La cuna insular al sur de Japón conocida como Ryukyu.",
        },
        {
            id: "exam-w-q2",
            type: "multiple_choice",
            prompt: "2. CARTOGRAFÍA: ¿Cuáles fueron las tres ciudades matrices originarias del 'Okinawa-Te'?",
            description: "Las tres cunas geográficas del arte marcial.",
            options: [
                { id: "o1", text: "🏯 Shuri (corte), Naha (puerto comercial) y Tomari (puerto pesquero)", isCorrect: true },
                { id: "o2", text: "🏙️ Tokio, Osaka y Nagoya", isCorrect: false },
                { id: "o3", text: "⛩️ Hiroshima, Nagasaki y Kioto", isCorrect: false },
                { id: "o4", text: "🌾 Sapporo, Fukuoka y Sendai", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Correcto! Shuri-Te (nobles), Naha-Te (puerto y comerciantes) y Tomari-Te (pescadores) forjaron la matriz clásica del Karate.",
            hint: "Shuri (capital), Naha (puerto mercantil) y Tomari (pescadores).",
        },
        {
            id: "exam-w-q3",
            type: "multiple_choice",
            prompt: "3. FILOSOFÍA: ¿Qué proclama el principio universal del Budo 'Karate Ni Sente Nashi'?",
            description: "La regla de oro ética del Maestro Gichin Funakoshi.",
            options: [
                { id: "o1", text: "🕊️ 'En el Karate no existe el primer ataque': la disciplina es para preservar la vida y dominar el ego", isCorrect: true },
                { id: "o2", text: "⚡ Atacar primero siempre para intimidar al enemigo", isCorrect: false },
                { id: "o3", text: "🏆 Ganar a cualquier costo sin importar el respeto", isCorrect: false },
                { id: "o4", text: "🥋 Que solo pueden entrenar quienes tengan fuerza bruta", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Brillante! El maestro Funakoshi consagró que el karateka nunca busca la violencia ni inicia una agresión; su fuerza es para proteger y cultivar la rectitud.",
            hint: "El Karate es puramente defensivo y espiritual.",
        },
        {
            id: "exam-w-q4",
            type: "multiple_choice",
            prompt: "4. MANUSCRITO: ¿Qué tratado secreto chino se considera la 'Biblia Sagrada' preservada por los maestros de Okinawa?",
            description: "Compendio con 48 técnicas combativas y medicina herbolaria.",
            options: [
                { id: "o1", text: "📜 El Bubishi (武備志 — Tratado de Preparación Marcial)", isCorrect: true },
                { id: "o2", text: "📕 El Libro de los Cinco Anillos de Musashi", isCorrect: false },
                { id: "o3", text: "📖 El Arte de la Guerra de Sun Tzu", isCorrect: false },
                { id: "o4", text: "📜 El Código de Bushido de los samuráis de Satsuma", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Exacto! El Bubishi recopila las 48 posturas de la Grulla Blanca, meridianos vitales y remedios curativos transmitidos en estricto secreto.",
            hint: "Comienza con la letra 'B' y significa Tratado de Preparación Marcial.",
        },
        {
            id: "exam-w-q5",
            type: "multiple_choice",
            prompt: "5. CUERPO HUMANO: ¿Cuáles son las tres alturas fundamentales (pisos) del cuerpo humano en Karate?",
            description: "De la cabeza a los pies en terminología japonesa.",
            options: [
                { id: "o1", text: "📏 JODAN (cabeza), CHUDAN (pecho/abdomen) y GEDAN (caderas/piernas)", isCorrect: true },
                { id: "o2", text: "📐 Mae, Yoko y Ushiro", isCorrect: false },
                { id: "o3", text: "🥋 Migi, Hidari y Chuo", isCorrect: false },
                { id: "o4", text: "⚡ Kime, Kiai y Zanshin", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Impecable! Jodan protege la cabeza y cuello; Chudan el torso y plexo solar; Gedan la zona baja, muslos y piernas.",
            hint: "Jo (alto), Chu (medio) y Ge (bajo).",
        },
        {
            id: "exam-w-q6",
            type: "multiple_choice",
            prompt: "6. ARMAS NATURALES: ¿Qué significa 'SEIKEN' y cómo se alinean los nudillos al golpear?",
            description: "El puño frontal cerrado tradicional.",
            options: [
                { id: "o1", text: "👊 Puño fundamental cerrado, impactando con los dos primeros nudillos (índice y medio)", isCorrect: true },
                { id: "o2", text: "✋ Mano abierta con la palma hacia arriba", isCorrect: false },
                { id: "o3", text: "🦾 El impacto con el hueso del codo", isCorrect: false },
                { id: "o4", text: "🦵 El empeine del pie en rotación", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Correcto! Seiken alinea la línea de fuerza del antebrazo con los nudillos de los dedos índice y medio (kento) para transferir toda la inercia sin fracturarse.",
            hint: "El puño cerrado que impacta con los dos primeros nudillos.",
        },
        {
            id: "exam-w-q7",
            type: "multiple_choice",
            prompt: "7. BIOMECÁNICA: ¿De dónde nace la máxima potencia en un golpe o defensa de Karate?",
            description: "El secreto del Kime que no depende de la fuerza del brazo.",
            options: [
                { id: "o1", text: "🌪️ De la rotación explosiva de cadera (Koshi) y la respiración diafragmática (Tanden/Hara)", isCorrect: true },
                { id: "o2", text: "💪 Solo de la fuerza muscular aislada del bíceps", isCorrect: false },
                { id: "o3", text: "🏃 De correr hacia adelante a toda velocidad", isCorrect: false },
                { id: "o4", text: "📣 De gritar más fuerte que el adversario", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Extraordinario! En Karate la potencia nace del suelo, viaja por el enraizamiento de las piernas, se multiplica por la rotación de cadera (Koshi) y se enfoca en el centro Tanden.",
            hint: "Rotación de cadera (Koshi) y centro de gravedad.",
        },
        {
            id: "exam-w-q8",
            type: "multiple_choice",
            prompt: "8. KIHON: ¿Qué postura y qué bloqueo componen la defensa baja fundamental de cinturón blanco?",
            description: "Postura adelantada sólida con barrido descendente.",
            options: [
                { id: "o1", text: "🥋 Zenkutsu-dachi (postura frontal adelantada) + Gedan-Barai (bloqueo bajo)", isCorrect: true },
                { id: "o2", text: "🧘 Kiba-dachi + Jodan Age-Uke", isCorrect: false },
                { id: "o3", text: "🦩 Tsuruashi-dachi + Shuto-Uke", isCorrect: false },
                { id: "o4", text: "🛡️ Kokutsu-dachi + Soto-Uke", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Perfecto! Zenkutsu-dachi distribuye el peso 60% adelante y 40% atrás, complementada con el barrido angular Gedan-Barai que desvía ataques bajos.",
            hint: "Paso largo hacia adelante con barrido bajo.",
        },
        {
            id: "exam-w-q9",
            type: "multiple_choice",
            prompt: "9. KATA: ¿Cuál es el primer Kata formal que practica el estudiante y cuántos pasos tiene?",
            description: "La forma básica en forma de 'H' creada por los maestros Funakoshi.",
            options: [
                { id: "o1", text: "📜 Taikyoku Shodan (太極初段) con 20 movimientos", isCorrect: true },
                { id: "o2", text: "🥋 Kanku-Dai con 65 pasos", isCorrect: false },
                { id: "o3", text: "🐉 Unsu con 48 saltos", isCorrect: false },
                { id: "o4", text: "⚡ Bassai-Dai con 42 giros", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Correcto! Taikyoku Shodan ('La Gran Causa Primera') entrena los giros en ángulo recto y 180°, desplazándose en 20 movimientos de Zenkutsu-dachi.",
            hint: "Taikyoku Shodan (20 pasos).",
        },
        {
            id: "exam-w-q10",
            type: "multiple_choice",
            prompt: "10. BUNKAI: ¿Qué significa descifrar el 'Bunkai' de un movimiento del Kata?",
            description: "La aplicación secreta detrás de la forma geométrica.",
            options: [
                { id: "o1", text: "⚔️ Analizar y aplicar cada técnica como defensa, golpe, luxación o derribo en combate real", isCorrect: true },
                { id: "o2", text: "🎨 Pintar el kanji del kata en una cartulina blanca", isCorrect: false },
                { id: "o3", text: "⏱️ Medir cuántos segundos dura la rutina con un reloj", isCorrect: false },
                { id: "o4", text: "🧘 Contar cuántas respiraciones se hacen con los ojos cerrados", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Sublime! Bunkai significa 'descomponer o analizar'. Es el puente indispensable que transforma una coreografía en autodefensa real y efectiva.",
            hint: "La aplicación combativa real con compañero.",
        },
    ],
};
