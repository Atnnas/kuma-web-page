import { Question, BeltRank, Unit } from "@/types/didactica";

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
 * EXAMEN 10° KYU (BLANCO ➔ AMARILLO)
 */
export const WHITE_BELT_EXAM: BeltExamConfig = {
    beltId: "kyu-10",
    targetBeltId: "kyu-9",
    beltName: "Cinturón Blanco (10° Kyu)",
    targetBeltName: "Cinturón Amarillo (9° Kyu)",
    targetBeltColor: "#FACC15",
    passingScore: 7,
    xpReward: 200,
    title: "Examen de Ascenso a Cinturón Amarillo (9° Kyu)",
    subtitle: "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
    description: "Demuestra tu dominio ante los Tres Examinadores en Historia, Anatomía, Kihon y Kata para consagrar tu primer cinturón de color.",
    questions: [
        {
            id: "exam-k10-q1",
            type: "multiple_choice",
            prompt: "1. HISTORIA: ¿En qué archipiélago nació originalmente el Karate-Do antes de expandirse por el mundo?",
            description: "Cuna marítima entre China y Japón.",
            options: [
                { id: "o1", text: "Reino de Ryukyu (actual prefectura de Okinawa)", isCorrect: true },
                { id: "o2", text: "En las faldas del Monte Fuji en Tokio", isCorrect: false },
                { id: "o3", text: "En Kioto por samuráis de la corte imperial", isCorrect: false },
                { id: "o4", text: "En una isla desierta del mar de Japón", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Exacto! El Karate nació en el antiguo archipiélago de Ryukyu (Okinawa) mediante el crisol del 'Te' autóctono con el boxeo de Fujian.",
            hint: "La cuna insular al sur de Japón conocida como Ryukyu.",
        },
        {
            id: "exam-k10-q2",
            type: "multiple_choice",
            prompt: "2. CARTOGRAFÍA: ¿Cuáles fueron las tres ciudades matrices originarias del 'Okinawa-Te'?",
            description: "Las tres cunas geográficas del arte marcial.",
            options: [
                { id: "o1", text: "Shuri (corte), Naha (puerto comercial) y Tomari (puerto pesquero)", isCorrect: true },
                { id: "o2", text: "Tokio, Osaka y Nagoya", isCorrect: false },
                { id: "o3", text: "Hiroshima, Nagasaki y Kioto", isCorrect: false },
                { id: "o4", text: "Sapporo, Fukuoka y Sendai", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Correcto! Shuri-Te (nobles), Naha-Te (puerto y comerciantes) y Tomari-Te (pescadores) forjaron la matriz clásica del Karate.",
            hint: "Shuri (capital), Naha (puerto mercantil) y Tomari (pescadores).",
        },
        {
            id: "exam-k10-q3",
            type: "multiple_choice",
            prompt: "3. FILOSOFÍA: ¿Qué proclama el principio universal del Budo 'Karate Ni Sente Nashi'?",
            description: "La regla de oro ética del Maestro Gichin Funakoshi.",
            options: [
                { id: "o1", text: "'En el Karate no existe el primer ataque': la disciplina es para preservar la vida y dominar el ego", isCorrect: true },
                { id: "o2", text: "Atacar primero siempre para intimidar al enemigo", isCorrect: false },
                { id: "o3", text: "Ganar a cualquier costo sin importar el respeto", isCorrect: false },
                { id: "o4", text: "Que solo pueden entrenar quienes tengan fuerza bruta", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Brillante! El maestro Funakoshi consagró que el karateka nunca busca la violencia ni inicia una agresión; su fuerza es para proteger y cultivar la rectitud.",
            hint: "El Karate es puramente defensivo y espiritual.",
        },
        {
            id: "exam-k10-q4",
            type: "multiple_choice",
            prompt: "4. MANUSCRITO: ¿Qué tratado secreto chino se considera la 'Biblia Sagrada' preservada por los maestros de Okinawa?",
            description: "Compendio con 48 técnicas combativas y medicina herbolaria.",
            options: [
                { id: "o1", text: "El Bubishi (武備志 — Tratado de Preparación Marcial)", isCorrect: true },
                { id: "o2", text: "El Libro de los Cinco Anillos de Musashi", isCorrect: false },
                { id: "o3", text: "El Arte de la Guerra de Sun Tzu", isCorrect: false },
                { id: "o4", text: "El Código de Bushido de los samuráis de Satsuma", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Exacto! El Bubishi recopila las 48 posturas de la Grulla Blanca, meridianos vitales y remedios curativos transmitidos en estricto secreto.",
            hint: "Comienza con la letra 'B' y significa Tratado de Preparación Marcial.",
        },
        {
            id: "exam-k10-q5",
            type: "multiple_choice",
            prompt: "5. CUERPO HUMANO: ¿Cuáles son las tres alturas fundamentales (pisos) del cuerpo humano en Karate?",
            description: "De la cabeza a los pies en terminología japonesa.",
            options: [
                { id: "o1", text: "JODAN (cabeza), CHUDAN (pecho/abdomen) y GEDAN (caderas/piernas)", isCorrect: true },
                { id: "o2", text: "Mae, Yoko y Ushiro", isCorrect: false },
                { id: "o3", text: "Migi, Hidari y Chuo", isCorrect: false },
                { id: "o4", text: "Kime, Kiai y Zanshin", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Impecable! Jodan protege la cabeza y cuello; Chudan el torso y plexo solar; Gedan la zona baja, muslos y piernas.",
            hint: "Jo (alto), Chu (medio) y Ge (bajo).",
        },
        {
            id: "exam-k10-q6",
            type: "multiple_choice",
            prompt: "6. ARMAS NATURALES: ¿Qué significa 'SEIKEN' y cómo se alinean los nudillos al golpear?",
            description: "El puño frontal cerrado tradicional.",
            options: [
                { id: "o1", text: "Puño fundamental cerrado, impactando con los dos primeros nudillos (índice y medio)", isCorrect: true },
                { id: "o2", text: "Mano abierta con la palma hacia arriba", isCorrect: false },
                { id: "o3", text: "El impacto con el hueso del codo", isCorrect: false },
                { id: "o4", text: "El empeine del pie en rotación", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Correcto! Seiken alinea la línea de fuerza del antebrazo con los nudillos de los dedos índice y medio (kento) para transferir toda la inercia sin fracturarse.",
            hint: "El puño cerrado que impacta con los dos primeros nudillos.",
        },
        {
            id: "exam-k10-q7",
            type: "multiple_choice",
            prompt: "7. BIOMECÁNICA: ¿De dónde nace la máxima potencia en un golpe o defensa de Karate?",
            description: "El secreto del Kime que no depende de la fuerza del brazo.",
            options: [
                { id: "o1", text: "De la rotación explosiva de cadera (Koshi) y la respiración diafragmática (Tanden/Hara)", isCorrect: true },
                { id: "o2", text: "Solo de la fuerza muscular aislada del bíceps", isCorrect: false },
                { id: "o3", text: "De correr hacia adelante a toda velocidad", isCorrect: false },
                { id: "o4", text: "De gritar más fuerte que el adversario", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Extraordinario! En Karate la potencia nace del suelo, viaja por el enraizamiento de las piernas, se multiplica por la rotación de cadera (Koshi) y se enfoca en el centro Tanden.",
            hint: "Rotación de cadera (Koshi) y centro de gravedad.",
        },
        {
            id: "exam-k10-q8",
            type: "multiple_choice",
            prompt: "8. KIHON: ¿Qué postura y qué bloqueo componen la defensa baja fundamental de cinturón blanco?",
            description: "Postura adelantada sólida con barrido descendente.",
            options: [
                { id: "o1", text: "Zenkutsu-dachi (postura frontal adelantada) + Gedan-Barai (bloqueo bajo)", isCorrect: true },
                { id: "o2", text: "Kiba-dachi + Jodan Age-Uke", isCorrect: false },
                { id: "o3", text: "Tsuruashi-dachi + Shuto-Uke", isCorrect: false },
                { id: "o4", text: "Kokutsu-dachi + Soto-Uke", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Perfecto! Zenkutsu-dachi distribuye el peso 60% adelante y 40% atrás, complementada con el barrido angular Gedan-Barai que desvía ataques bajos.",
            hint: "Paso largo hacia adelante con barrido bajo.",
        },
        {
            id: "exam-k10-q9",
            type: "multiple_choice",
            prompt: "9. KATA: ¿Cuál es el primer Kata formal que practica el estudiante y cuántos pasos tiene?",
            description: "La forma básica en forma de 'H' creada por los maestros Funakoshi.",
            options: [
                { id: "o1", text: "Taikyoku Shodan (太極初段) con 20 movimientos", isCorrect: true },
                { id: "o2", text: "Kanku-Dai con 65 pasos", isCorrect: false },
                { id: "o3", text: "Unsu con 48 saltos", isCorrect: false },
                { id: "o4", text: "Bassai-Dai con 42 giros", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Correcto! Taikyoku Shodan ('La Gran Causa Primera') entrena los giros en ángulo recto y 180°, desplazándose en 20 movimientos de Zenkutsu-dachi.",
            hint: "Taikyoku Shodan (20 pasos).",
        },
        {
            id: "exam-k10-q10",
            type: "multiple_choice",
            prompt: "10. BUNKAI: ¿Qué significa descifrar el 'Bunkai' de un movimiento del Kata?",
            description: "La aplicación secreta detrás de la forma geométrica.",
            options: [
                { id: "o1", text: "Analizar y aplicar cada técnica como defensa, golpe, luxación o derribo en combate real", isCorrect: true },
                { id: "o2", text: "Pintar el kanji del kata en una cartulina blanca", isCorrect: false },
                { id: "o3", text: "Medir cuántos segundos dura la rutina con un reloj", isCorrect: false },
                { id: "o4", text: "Contar cuántas respiraciones se hacen con los ojos cerrados", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "¡Sublime! Bunkai significa 'descomponer o analizar'. Es el puente indispensable que transforma una coreografía en autodefensa real y efectiva.",
            hint: "La aplicación combativa real con compañero.",
        },
    ],
};

/**
 * DICCIONARIO COMPLETO DE EXÁMENES DE ASCENSO PARA CADA CINTURÓN
 */
export const BELT_EXAMS: Record<string, BeltExamConfig> = {
    "kyu-10": WHITE_BELT_EXAM,

    // ── 9° KYU ➔ 8° KYU (AMARILLO ➔ NARANJA) ──
    "kyu-9": {
        beltId: "kyu-9",
        targetBeltId: "kyu-8",
        beltName: "Cinturón Amarillo (9° Kyu)",
        targetBeltName: "Cinturón Naranja (8° Kyu)",
        targetBeltColor: "#FB923C",
        passingScore: 7,
        xpReward: 220,
        title: "Examen de Ascenso a Cinturón Naranja (8° Kyu)",
        subtitle: "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
        description: "Evalúa tu dominio en la etiqueta tradicional, alineación postural, bloqueo ascendente y Heian Shodan.",
        questions: [
            {
                id: "exam-k9-q1",
                type: "multiple_choice",
                prompt: "1. HISTORIA: ¿Quién fue el pionero maestro okinawense apodado 'Tode Sakugawa' que introdujo el Dojo Kun?",
                options: [
                    { id: "o1", text: "Kanga Sakugawa (1733–1815), maestro del Castillo de Shuri", isCorrect: true },
                    { id: "o2", text: "Miyamoto Musashi, espadachín de Kioto", isCorrect: false },
                    { id: "o3", text: "Jigoro Kano, fundador del Judo en Tokio", isCorrect: false },
                    { id: "o4", text: "Chojun Miyagi en Naha", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Kanga Sakugawa viajó a China a estudiar Quan-Fa y formuló las bases del código ético de cortesía para el karate de Shuri.",
            },
            {
                id: "exam-k9-q2",
                type: "multiple_choice",
                prompt: "2. FILOSOFÍA: ¿Qué significado encierra la reverencia tradicional 'Rei' al ingresar al Dojo?",
                options: [
                    { id: "o1", text: "Humildad, respeto reverencial hacia el espacio sagrado, maestros y compañeros", isCorrect: true },
                    { id: "o2", text: "Una obligación militar sin significado interno", isCorrect: false },
                    { id: "o3", text: "Pedir permiso para no hacer flexiones", isCorrect: false },
                    { id: "o4", text: "Comprobar que el suelo esté limpio", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Funakoshi sentenció: 'El Karate comienza con cortesía y concluye con cortesía' (Karate wa rei ni hajimari, rei ni owaru).",
            },
            {
                id: "exam-k9-q3",
                type: "multiple_choice",
                prompt: "3. CUERPO HUMANO: ¿Dónde se localiza el centro de gravedad vital 'Tanden' o 'Hara'?",
                options: [
                    { id: "o1", text: "Aproximadamente 3 dedos por debajo del ombligo, en el centro profundo del abdomen", isCorrect: true },
                    { id: "o2", text: "En la punta de la barbilla", isCorrect: false },
                    { id: "o3", text: "Detrás de la rodilla derecha", isCorrect: false },
                    { id: "o4", text: "En el esternón junto a la clavícula", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "El Tanden es el centro de masa y acumulación del Ki; el ancla postural que garantiza el equilibrio dinámico.",
            },
            {
                id: "exam-k9-q4",
                type: "multiple_choice",
                prompt: "4. BIOMECÁNICA: En Zenkutsu-dachi, ¿cuál es la distribución de peso corporal correcta entre piernas?",
                options: [
                    { id: "o1", text: "Aproximadamente 60% en la pierna adelantada flexionada y 40% en la pierna posterior estirada", isCorrect: true },
                    { id: "o2", text: "90% atrás y 10% adelante", isCorrect: false },
                    { id: "o3", text: "50% en los talones y espalda arqueada", isCorrect: false },
                    { id: "o4", text: "Todo el peso apoyado en la rodilla del suelo", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "La rodilla delantera cae perpendicular al dedo gordo del pie y la pierna trasera empuja con el talón pegado al suelo.",
            },
            {
                id: "exam-k9-q5",
                type: "multiple_choice",
                prompt: "5. ANATOMÍA: ¿Por qué la respiración diafragmática baja protege los órganos internos en combate?",
                options: [
                    { id: "o1", text: "Aumenta la presión intraabdominal estabilizando la columna y el núcleo muscular (Core)", isCorrect: true },
                    { id: "o2", text: "Hace que los pulmones se llenen solo de aire frío", isCorrect: false },
                    { id: "o3", text: "Desactiva los latidos cardíacos", isCorrect: false },
                    { id: "o4", text: "Permite hablar mientras se recibe un golpe", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "El diafragma desciende comprimiendo el suelo pélvico y la faja abdominal, convirtiendo el torso en una armadura compacta.",
            },
            {
                id: "exam-k9-q6",
                type: "multiple_choice",
                prompt: "6. KIHON: ¿Qué bloqueo asciende en ángulo de 45° para desviar un impacto a la cabeza?",
                options: [
                    { id: "o1", text: "Jodan Age-Uke (bloqueo ascendente)", isCorrect: true },
                    { id: "o2", text: "Gedan-Barai (barrido descendente)", isCorrect: false },
                    { id: "o3", text: "Mae-Geri (patada frontal)", isCorrect: false },
                    { id: "o4", text: "Kizami-Tsuki (golpe adelantado)", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Age-Uke utiliza el radio del antebrazo girando a 45° a un puño de distancia de la frente para deflexionar la fuerza invasora.",
            },
            {
                id: "exam-k9-q7",
                type: "multiple_choice",
                prompt: "7. KIHON: ¿Cuál es la diferencia biomecánica entre 'Oi-Tsuki' y 'Gyaku-Tsuki'?",
                options: [
                    { id: "o1", text: "Oi-Tsuki golpea con el mismo brazo de la pierna adelantada; Gyaku-Tsuki con el brazo inverso rotando cadera", isCorrect: true },
                    { id: "o2", text: "Oi-Tsuki se hace con la mano abierta y Gyaku-Tsuki con el codo", isCorrect: false },
                    { id: "o3", text: "Gyaku-Tsuki se realiza dando un salto hacia atrás", isCorrect: false },
                    { id: "o4", text: "No existe diferencia, son sinónimos", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Gyaku-Tsuki (puño contrario) aprovecha la máxima torsión de la cadera (Koshi no Kaiten) pasando de Hanmi a Shomen.",
            },
            {
                id: "exam-k9-q8",
                type: "multiple_choice",
                prompt: "8. KIHON: ¿En qué posición fundamental los talones se tocan en ángulo de 45° para saludar?",
                options: [
                    { id: "o1", text: "Musubi-dachi (postura de atención y respeto)", isCorrect: true },
                    { id: "o2", text: "Kiba-dachi (jinete)", isCorrect: false },
                    { id: "o3", text: "Zenkutsu-dachi", isCorrect: false },
                    { id: "o4", text: "Kokutsu-dachi", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Musubi-dachi es la postura ceremonial donde los talones permanecen unidos y las puntas abiertas a 45°, previa al saludo formal.",
            },
            {
                id: "exam-k9-q9",
                type: "multiple_choice",
                prompt: "9. KATA: ¿Qué significa el nombre de la serie de katas 'HEIAN' (平安)?",
                options: [
                    { id: "o1", text: "'Paz y Calma / Mente Serena': dominarlos otorga seguridad y compostura ante cualquier peligro", isCorrect: true },
                    { id: "o2", text: "'Guerra y Destrucción'", isCorrect: false },
                    { id: "o3", text: "'Velocidad de Relámpago'", isCorrect: false },
                    { id: "o4", text: "'Corte del Samurái'", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Heian (conocidos como Pinan en Okinawa) significa 'Paz y sosiego mental'. Quien los domina no teme ninguna agresión física.",
            },
            {
                id: "exam-k9-q10",
                type: "multiple_choice",
                prompt: "10. BUNKAI: En el primer movimiento de Heian Shodan (giro a la izquierda en Gedan-Barai), ¿cuál es la aplicación defensiva?",
                options: [
                    { id: "o1", text: "Zafarse de un agarre de muñeca o desviar una patada baja mientras se esquiva el eje central del agresor", isCorrect: true },
                    { id: "o2", text: "Saludar a los espectadores de la grada", isCorrect: false },
                    { id: "o3", text: "Hacer una finta para salir corriendo", isCorrect: false },
                    { id: "o4", text: "Avisar al árbitro de que comience el tiempo", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "El giro inicial combina Tai-Sabaki (desplazamiento evasivo) con una palanca articular de zafada o barrido de pierna atacante.",
            },
        ],
    },

    // ── 8° KYU ➔ 7° KYU (NARANJA ➔ VERDE) ──
    "kyu-8": {
        beltId: "kyu-8",
        targetBeltId: "kyu-7",
        beltName: "Cinturón Naranja (8° Kyu)",
        targetBeltName: "Cinturón Verde (7° Kyu)",
        targetBeltColor: "#22C55E",
        passingScore: 7,
        xpReward: 240,
        title: "Examen de Ascenso a Cinturón Verde (7° Kyu)",
        subtitle: "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
        description: "Demuestra la física del Hikite, la postura atrasada Kokutsu-dachi, patada Mae-geri y Heian Nidan.",
        questions: [
            {
                id: "exam-k8-q1",
                type: "multiple_choice",
                prompt: "1. HISTORIA: ¿Quién fue 'Bushi' Matsumura (1809–1899) y qué cargo de honor ostentó?",
                options: [
                    { id: "o1", text: "Comandante de la guardia real del Palacio de Shuri y maestro del estilo Shuri-Te", isCorrect: true },
                    { id: "o2", text: "Un comerciante de seda del puerto de Kobe", isCorrect: false },
                    { id: "o3", text: "El primer presidente de los Juegos Olímpicos", isCorrect: false },
                    { id: "o4", text: "Un monje ermitaño del Monte Hiei", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Sokon 'Bushi' Matsumura sirvió a tres reyes de Ryukyu y sintetizó el combate lineal fulminante que dio origen al karate de Shuri.",
            },
            {
                id: "exam-k8-q2",
                type: "multiple_choice",
                prompt: "2. FILOSOFÍA: ¿Qué nos enseña el concepto 'Kizukenai' (atención alerta sin tensión)?",
                options: [
                    { id: "o1", text: "Mantener una vigilancia relajada y abierta hacia todo el entorno sin obsesionarse con un solo punto", isCorrect: true },
                    { id: "o2", text: "Cerrar los ojos durante el combate", isCorrect: false },
                    { id: "o3", text: "Tensionar todos los músculos del cuerpo todo el tiempo", isCorrect: false },
                    { id: "o4", text: "Gritar constantemente para asustar", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "La tensión excesiva vuelve lentos los reflejos; la atención vigilante y relajada permite reaccionar al instante.",
            },
            {
                id: "exam-k8-q3",
                type: "multiple_choice",
                prompt: "3. BIOMECÁNICA: ¿Cuál es el rol biomecánico crucial del 'HIKITE' (mano que recoge a la costilla)?",
                options: [
                    { id: "o1", text: "Aplica la 3ª Ley de Newton (acción-reacción), acelera la rotación de torso y jala al oponente", isCorrect: true },
                    { id: "o2", text: "Es solo para descansar el brazo que no golpea", isCorrect: false },
                    { id: "o3", text: "Sirve para secarse el sudor del karategi", isCorrect: false },
                    { id: "o4", text: "Indica que se ha terminado la técnica", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "El retroceso veloz del puño a la cresta ilíaca equilibra el par de fuerzas torácico y multiplica la velocidad del puño que impacta.",
            },
            {
                id: "exam-k8-q4",
                type: "multiple_choice",
                prompt: "4. CUERPO HUMANO: ¿Qué articulación actúa como eje de bisagra fundamental en la patada Mae-Geri?",
                options: [
                    { id: "o1", text: "La rodilla, que debe elevarse primero plegada al pecho antes del latigazo de percusión", isCorrect: true },
                    { id: "o2", text: "El tobillo exclusivamente", isCorrect: false },
                    { id: "o3", text: "La articulación de los hombros", isCorrect: false },
                    { id: "o4", text: "La columna cervical", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Sin elevación previa de la rodilla ('chambrear'), la patada pierde su palanca cinemática y trayectoria directa.",
            },
            {
                id: "exam-k8-q5",
                type: "multiple_choice",
                prompt: "5. ANATOMÍA: ¿Con qué superficie anatómica del pie se impacta limpiamente en Mae-Geri Keage?",
                options: [
                    { id: "o1", text: "KOSHI (el metatarso o 'bola del pie', con los dedos flexionados hacia atrás)", isCorrect: true },
                    { id: "o2", text: "Con la punta de las uñas de los dedos", isCorrect: false },
                    { id: "o3", text: "Con la planta plana entera", isCorrect: false },
                    { id: "o4", text: "Con la tibia lateral", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Los dedos deben replegarse firmemente hacia arriba para concentrar toda la fuerza de impacto en la almohadilla del metatarso.",
            },
            {
                id: "exam-k8-q6",
                type: "multiple_choice",
                prompt: "6. KIHON: En Kokutsu-dachi (postura atrasada de defensa), ¿cómo se distribuye el peso corporal?",
                options: [
                    { id: "o1", text: "70% en la pierna trasera flexionada y 30% en la pierna adelantada", isCorrect: true },
                    { id: "o2", text: "50% y 50% exactamente", isCorrect: false },
                    { id: "o3", text: "90% en la pierna delantera", isCorrect: false },
                    { id: "o4", text: "100% sobre los talones en el aire", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Kokutsu-dachi sitúa el centro de masa retrasado para absorber embestidas frontales y permitir contraatacar con la pierna adelantada.",
            },
            {
                id: "exam-k8-q7",
                type: "multiple_choice",
                prompt: "7. KIHON: ¿Qué bloqueo se ejecuta desde el interior hacia el exterior desviando un golpe al torso?",
                options: [
                    { id: "o1", text: "Chudan Uchi-Uke (bloqueo medio de adentro hacia afuera)", isCorrect: true },
                    { id: "o2", text: "Jodan Age-Uke", isCorrect: false },
                    { id: "o3", text: "Gedan-Barai", isCorrect: false },
                    { id: "o4", text: "Oi-Tsuki", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Uchi-Uke nace bajo la axila del brazo contrario y viaja en arco ascendente-rotatorio para barrer el ataque rival fuera de la línea media.",
            },
            {
                id: "exam-k8-q8",
                type: "multiple_choice",
                prompt: "8. KIHON: ¿Qué tipo de impacto distingue a 'Mae-Geri Keage' de 'Mae-Geri Kekomi'?",
                options: [
                    { id: "o1", text: "Keage es percutante/ascendente de rápido rebote; Kekomi es penetrante/empujante con extensión profunda", isCorrect: true },
                    { id: "o2", text: "Keage se tira al suelo y Kekomi es con la rodilla", isCorrect: false },
                    { id: "o3", text: "Kekomi no existe en Karate", isCorrect: false },
                    { id: "o4", text: "Keage se ejecuta con salto de 360 grados", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Keage (latigazo) busca golpear con velocidad de retorno instantáneo; Kekomi (penetración) busca desplazar o atravesar la guardia del rival.",
            },
            {
                id: "exam-k8-q9",
                type: "multiple_choice",
                prompt: "9. KATA: ¿Qué secuencia técnica inicial caracteriza a Heian Nidan?",
                options: [
                    { id: "o1", text: "Doble defensa de mano abierta en Kokutsu-dachi seguida de patada Mae-Geri y contraataque Nukite", isCorrect: true },
                    { id: "o2", text: "Tres saltos acrobáticos hacia adelante", isCorrect: false },
                    { id: "o3", text: "Permanecer sentado en Seiza durante 1 minuto", isCorrect: false },
                    { id: "o4", text: "Una serie de 10 patadas giratorias Ushiro-Geri", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Heian Nidan introduce la coordinación de brazos simultáneos, defensas Shuto-Uke y la primera patada frontal formal en un kata.",
            },
            {
                id: "exam-k8-q10",
                type: "multiple_choice",
                prompt: "10. BUNKAI: En Heian Nidan, ¿cuál es el propósito combativo de la técnica 'Nukite' (mano en lanza)?",
                options: [
                    { id: "o1", text: "Ataque punzante a zonas blandas vulnerables como el plexo solar o garganta tras inmovilizar el brazo rival", isCorrect: true },
                    { id: "o2", text: "Empujar una pared para guardar equilibrio", isCorrect: false },
                    { id: "o3", text: "Señalar la dirección hacia donde huir", isCorrect: false },
                    { id: "o4", text: "Hacer sombra con los dedos de la mano", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Nukite (punta de dedos reforzada) ataca los puntos blandos donde los huesos no protegen los órganos, guiada por el control de la mano de apoyo.",
            },
        ],
    },

    // ── 7° KYU ➔ 6° KYU (VERDE ➔ AZUL) ──
    "kyu-7": {
        beltId: "kyu-7",
        targetBeltId: "kyu-6",
        beltName: "Cinturón Verde (7° Kyu)",
        targetBeltName: "Cinturón Azul (6° Kyu)",
        targetBeltColor: "#3B82F6",
        passingScore: 7,
        xpReward: 260,
        title: "Examen de Ascenso a Cinturón Azul (6° Kyu)",
        subtitle: "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
        description: "Evalúa la reforma escolar de Itosu, la rotación pélvica Koshi, Kiba-dachi y Heian Sandan.",
        questions: [
            {
                id: "exam-k7-q1",
                type: "multiple_choice",
                prompt: "1. HISTORIA: ¿Por qué el maestro Anko Itosu (1831–1915) es llamado el 'Padre de la Educación Física del Karate'?",
                options: [
                    { id: "o1", text: "Introdujo el Karate en las escuelas públicas de Okinawa en 1901 y creó la serie de 5 Katas Pinan/Heian", isCorrect: true },
                    { id: "o2", text: "Prohibió la práctica del Karate a los jóvenes", isCorrect: false },
                    { id: "o3", text: "Escribió el primer reglamento de kumite con guantes de boxeo", isCorrect: false },
                    { id: "o4", text: "Fundó el estilo Taekwondo en Corea", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Itosu despojó al arte de su secreto mortal para convertirlo en un método de salud física, disciplina cívica y forja del carácter escolar.",
            },
            {
                id: "exam-k7-q2",
                type: "multiple_choice",
                prompt: "2. FILOSOFÍA: ¿Qué estipula la 'Carta de los Diez Preceptos' (Tode Jukun) de Itosu enviada en 1908?",
                options: [
                    { id: "o1", text: "Que el Karate no debe usarse para peleas callejeras, sino para fortalecer la salud pública y proteger la nación", isCorrect: true },
                    { id: "o2", text: "Que los estudiantes debían combatir a muerte en cada sesión", isCorrect: false },
                    { id: "o3", text: "Que el Karate no debía enseñarse fuera de China", isCorrect: false },
                    { id: "o4", text: "Que se debían eliminar todas las posturas de defensa", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Itosu redactó los 10 preceptos para convencer al Ministerio de Educación japonés del inmenso valor pedagógico y formativo del Karate.",
            },
            {
                id: "exam-k7-q3",
                type: "multiple_choice",
                prompt: "3. BIOMECÁNICA: ¿Qué diferencia dinámica existe entre las posiciones de cadera 'SHOMEN' y 'HANMI'?",
                options: [
                    { id: "o1", text: "Shomen encara la cadera frontalmente al objetivo (ataque); Hanmi la gira a 45° perfilando el cuerpo (defensa)", isCorrect: true },
                    { id: "o2", text: "Shomen es sentado y Hanmi es de rodillas", isCorrect: false },
                    { id: "o3", text: "Hanmi es cuando se saltan obstáculos", isCorrect: false },
                    { id: "o4", text: "Ambas significan estar completamente de espaldas", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "El paso fulminante de Hanmi (defensa) a Shomen (golpe) desata el torque de cadera multiplicando la aceleración del puño.",
            },
            {
                id: "exam-k7-q4",
                type: "multiple_choice",
                prompt: "4. CUERPO HUMANO: En Kiba-dachi (postura del jinete), ¿cómo deben posicionarse los pies y rodillas?",
                options: [
                    { id: "o1", text: "Pies perfectamente paralelos mirando al frente, rodillas empujando hacia afuera y pelvis en retroversión", isCorrect: true },
                    { id: "o2", text: "Pies con las puntas hacia afuera a 90 grados y rodillas colapsadas al centro", isCorrect: false },
                    { id: "o3", text: "Un pie delante del otro cruzado", isCorrect: false },
                    { id: "o4", text: "De puntillas para correr hacia los lados", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Las rodillas forzadas hacia afuera activan los abductores y glúteos, enraizando el centro de gravedad con estabilidad inamovible.",
            },
            {
                id: "exam-k7-q5",
                type: "multiple_choice",
                prompt: "5. ANATOMÍA: ¿Qué zona ósea del antebrazo recibe el contacto en 'Chudan Soto-Uke'?",
                options: [
                    { id: "o1", text: "El cúbito (borde lateral externo del antebrazo), rotando de afuera hacia adentro", isCorrect: true },
                    { id: "o2", text: "La palma de la mano únicamente", isCorrect: false },
                    { id: "o3", text: "La articulación expuesta del codo", isCorrect: false },
                    { id: "o4", text: "La clavícula", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Soto-Uke utiliza la masa ósea del cúbito con un giro en tirabuzón que quiebra la trayectoria del ataque frontal.",
            },
            {
                id: "exam-k7-q6",
                type: "multiple_choice",
                prompt: "6. KIHON: ¿Qué superficie del pie se utiliza como arma de filo cortante en 'Yoko-Geri Kekomi'?",
                options: [
                    { id: "o1", text: "SOKUTO (el borde externo del pie y el talón endurecido)", isCorrect: true },
                    { id: "o2", text: "El empeine blando (Haisoku)", isCorrect: false },
                    { id: "o3", text: "Los dedos gordos estirados hacia abajo", isCorrect: false },
                    { id: "o4", text: "La pantorrilla interna", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Sokuto concentra la fuerza del impacto en la estructura ósea más densa del borde exterior del pie y calcáneo.",
            },
            {
                id: "exam-k7-q7",
                type: "multiple_choice",
                prompt: "7. KIHON: ¿En qué consiste la técnica de defensa 'Morote-Uke'?",
                options: [
                    { id: "o1", text: "Un bloqueo reforzado donde el puño de apoyo presiona cerca del codo del brazo que defiende", isCorrect: true },
                    { id: "o2", text: "Girar los dos brazos en círculos como aspas", isCorrect: false },
                    { id: "o3", text: "Agacharse tapándose la cabeza con ambas manos", isCorrect: false },
                    { id: "o4", text: "Un golpe de cabeza hacia adelante", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Morote-Uke duplica la resistencia estructural contra ataques muy pesados o de armas cortas gracias al soporte del segundo brazo.",
            },
            {
                id: "exam-k7-q8",
                type: "multiple_choice",
                prompt: "8. BIOMECÁNICA: ¿Qué es el 'Tai-Sabaki' y por qué es superior al bloqueo directo de fuerza bruta?",
                options: [
                    { id: "o1", text: "La esquiva y desplazamiento circular que desvía la trayectoria del ataque sin chocar contra él", isCorrect: true },
                    { id: "o2", text: "Recibir el golpe en el pecho para demostrar resistencia", isCorrect: false },
                    { id: "o3", text: "Empujar al adversario con los dos hombros", isCorrect: false },
                    { id: "o4", text: "Tirarse al tatami esperando que pase el peligro", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Tai-Sabaki (gestión del cuerpo) evita la colisión masa contra masa, dejando al adversario en el vacío y desequilibrado.",
            },
            {
                id: "exam-k7-q9",
                type: "multiple_choice",
                prompt: "9. KATA: ¿Qué técnicas singulares introduce el Kata Heian Sandan en Kiba-dachi?",
                options: [
                    { id: "o1", text: "Bloqueos dobles, giros sobre el eje con golpes de codo (Empi) y Uraken-Uchi por encima del hombro", isCorrect: true },
                    { id: "o2", text: "Tres saltos mortales hacia atrás", isCorrect: false },
                    { id: "o3", text: "Una secuencia con palos largos", isCorrect: false },
                    { id: "o4", text: "Un combate en el suelo con luxación de dedos", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Heian Sandan entrena el combate cerrado en la distancia de cuerpo a cuerpo utilizando la solidez de Kiba-dachi.",
            },
            {
                id: "exam-k7-q10",
                type: "multiple_choice",
                prompt: "10. BUNKAI: En Heian Sandan, tras zafarse de un agarre trasero, ¿qué técnica liquida la agresión?",
                options: [
                    { id: "o1", text: "Ushiro-Empi (golpe de codo hacia atrás a las costillas) o Uraken a la nariz con paso en Kiba-dachi", isCorrect: true },
                    { id: "o2", text: "Pedir al atacante que suelte suavemente", isCorrect: false },
                    { id: "o3", text: "Dar palmadas en el aire", isCorrect: false },
                    { id: "o4", text: "Un barrido de pie hacia los propios talones", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "El bunkai desarticula el abrazo o aprisionamiento del agresor mediante el impacto óseo demoledor del codo a sus costillas flotantes.",
            },
        ],
    },

    // ── 6° KYU ➔ 5° KYU (AZUL ➔ MORADO) ──
    "kyu-6": {
        beltId: "kyu-6",
        targetBeltId: "kyu-5",
        beltName: "Cinturón Azul (6° Kyu)",
        targetBeltName: "Cinturón Morado (5° Kyu)",
        targetBeltColor: "#A855F7",
        passingScore: 7,
        xpReward: 280,
        title: "Examen de Ascenso a Cinturón Morado (5° Kyu)",
        subtitle: "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
        description: "Demuestra la escuela Naha-Te, defensas de mano abierta Shuto-Uke, patada circular Mawashi-geri y Heian Yondan.",
        questions: [
            {
                id: "exam-k6-q1",
                type: "multiple_choice",
                prompt: "1. HISTORIA: ¿Quién fue el maestro Kanryo Higaonna (1853–1915) y qué trajo de su viaje a Fuzhou (China)?",
                options: [
                    { id: "o1", text: "El padre del Naha-Te; entrenó años en China con Ryu Ryu Ko aprendiendo el boxeo de la Grulla Blanca", isCorrect: true },
                    { id: "o2", text: "Un pirata que robaba pergaminos en alta mar", isCorrect: false },
                    { id: "o3", text: "El creador del Karate Shotokan en Tokio", isCorrect: false },
                    { id: "o4", text: "El primer árbitro de torneos deportivos", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Higaonna introdujo la respiración profunda Sanchin, la dureza corporal y las raíces chinas que originaron el Goju-Ryu y Shito-Ryu.",
            },
            {
                id: "exam-k6-q2",
                type: "multiple_choice",
                prompt: "2. FILOSOFÍA: ¿Qué simboliza la dualidad 'GO' (duro) y 'JU' (suave) en el Karate tradicional?",
                options: [
                    { id: "o1", text: "Saber alternar la firmeza del acero para bloquear con la flexibilidad del sauce para ceder y redireccionar la fuerza", isCorrect: true },
                    { id: "o2", text: "Pelear duro los lunes y suave los viernes", isCorrect: false },
                    { id: "o3", text: "Que las mujeres solo hacen Ju y los hombres solo Go", isCorrect: false },
                    { id: "o4", text: "Que los cinturones oscuros son siempre duros", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "El Bubishi establece: 'Todo en el universo inhala y exhala, es duro y es suave'. La rigidez absoluta se quiebra; la flexibilidad sobrevive.",
            },
            {
                id: "exam-k6-q3",
                type: "multiple_choice",
                prompt: "3. CUERPO HUMANO: En 'Shuto-Uke' (bloqueo con la mano espada), ¿qué parte anatómica deflecta el ataque?",
                options: [
                    { id: "o1", text: "El canto cubital de la palma abierta y tensa, desde la base del meñique hasta la muñeca", isCorrect: true },
                    { id: "o2", text: "La punta de los dedos índices", isCorrect: false },
                    { id: "o3", text: "El dorso de la mano relajada", isCorrect: false },
                    { id: "o4", text: "La uña del pulgar", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "El pulgar se pliega hacia adentro con fuerza tensando el músculo abductor, transformando el borde de la mano en una cuchilla defensiva.",
            },
            {
                id: "exam-k6-q4",
                type: "multiple_choice",
                prompt: "4. BIOMECÁNICA: En Mawashi-Geri (patada circular), ¿cuál es el movimiento articular indispensable de la pierna de apoyo?",
                options: [
                    { id: "o1", text: "Pivotar sobre la bola del pie girando el talón hacia el objetivo al menos 90° a 180° para abrir la cadera", isCorrect: true },
                    { id: "o2", text: "Dejar el pie clavado hacia adelante sin moverlo", isCorrect: false },
                    { id: "o3", text: "Doblar la espalda hacia atrás hasta tocar el suelo", isCorrect: false },
                    { id: "o4", text: "Saltar con ambos pies hacia arriba", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Si el pie de apoyo no pivota, la cabeza del fémur choca contra la pelvis, frenando la patada y lesionando la rodilla.",
            },
            {
                id: "exam-k6-q5",
                type: "multiple_choice",
                prompt: "5. ANATOMÍA: ¿Qué dianas anatómicas son blanco prioritario de Mawashi-Geri a nivel Chudan?",
                options: [
                    { id: "o1", text: "Las costillas flotantes y la zona hepática (hígado a la derecha, bazo a la izquierda)", isCorrect: true },
                    { id: "o2", text: "El hueso de la rótula frontal", isCorrect: false },
                    { id: "o3", text: "La coronilla de la cabeza", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Las costillas flotantes carecen de anclaje esternal rígido, por lo que un impacto circular penetrante incapacita de inmediato.",
            },
            {
                id: "exam-k6-q6",
                type: "multiple_choice",
                prompt: "6. KIHON: ¿Qué bloqueo utiliza ambas muñecas cruzadas para atrapar patadas bajas o ataques descendentes?",
                options: [
                    { id: "o1", text: "Juji-Uke (bloqueo en 'X')", isCorrect: true },
                    { id: "o2", text: "Age-Uke", isCorrect: false },
                    { id: "o3", text: "Gyaku-Tsuki", isCorrect: false },
                    { id: "o4", text: "Kizami-Tsuki", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Juji-Uke (kanji diez: 十) cruza los antebrazos para encajonar la extremidad enemiga impidiendo que continúe su avance.",
            },
            {
                id: "exam-k6-q7",
                type: "multiple_choice",
                prompt: "7. KIHON: ¿Qué golpe devastador de corta distancia se efectúa con la punta del codo?",
                options: [
                    { id: "o1", text: "Empi-Uchi (o Hiji-Ate)", isCorrect: true },
                    { id: "o2", text: "Oi-Tsuki", isCorrect: false },
                    { id: "o3", text: "Mae-Geri", isCorrect: false },
                    { id: "o4", text: "Shuto-Uke", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "El olécranon del codo es uno de los huesos más compactos del cuerpo humano, capaz de generar un impacto demoledor a distancia corta.",
            },
            {
                id: "exam-k6-q8",
                type: "multiple_choice",
                prompt: "8. BIOMECÁNICA: ¿Por qué en Kokutsu-dachi la rodilla delantera debe apuntar directamente al frente?",
                options: [
                    { id: "o1", text: "Para proteger la ingle y permitir transiciones explosivas hacia Zenkutsu-dachi sin perder el equilibrio", isCorrect: true },
                    { id: "o2", text: "Para tocar el suelo con la rodilla", isCorrect: false },
                    { id: "o3", text: "Para que no se vea el pie contrario", isCorrect: false },
                    { id: "o4", text: "No importa hacia dónde apunte", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Una rodilla delantera colapsada hacia adentro destruye la estabilidad anteroposterior y expone los ligamentos cruzados a lesiones graves.",
            },
            {
                id: "exam-k6-q9",
                type: "multiple_choice",
                prompt: "9. KATA: ¿Qué secuencia rítmica destaca al inicio de Heian Yondan?",
                options: [
                    { id: "o1", text: "Movimientos lentos y majestuosos de respiración profunda en Kokutsu-dachi seguidos de explosiones dinámicas", isCorrect: true },
                    { id: "o2", text: "Correr en línea recta dando golpes de puño", isCorrect: false },
                    { id: "o3", text: "Permanecer inmóvil durante 3 minutos", isCorrect: false },
                    { id: "o4", text: "Saltar con ambos puños en el suelo", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "Heian Yondan enseña la alternancia entre la calma majestuosa (tensión interna) y el rayo fulminante del Kime explosivo.",
            },
            {
                id: "exam-k6-q10",
                type: "multiple_choice",
                prompt: "10. BUNKAI: En Heian Yondan, tras atrapar la cabeza del oponente con ambas manos, ¿qué golpe se descarga?",
                options: [
                    { id: "o1", text: "Hiza-Geri (golpe penetrante con la rodilla al rostro o plexo) seguido de doble descenso de brazos", isCorrect: true },
                    { id: "o2", text: "Un empujón suave con los hombros", isCorrect: false },
                    { id: "o3", text: "Soltar al oponente y disculparse", isCorrect: false },
                    { id: "o4", text: "Una palmada en la espalda", isCorrect: false },
                ],
                correctAnswerId: "o1",
                explanation: "El Bunkai jala la cabeza del oponente hacia abajo al mismo tiempo que la rodilla asciende, sumando ambas velocidades en un impacto letal.",
            },
        ],
    },
};

/**
 * Retorna la configuración oficial del examen para cualquier grado.
 * Si un cinturón avanzado no posee aún un set manual dedicado en BELT_EXAMS,
 * sintetiza dinámicamente un examen oficial de 10 preguntas a partir de los 4 módulos de la unidad.
 */
export function getBeltExamConfig(
    beltId: string,
    currentBelt?: BeltRank,
    targetBelt?: BeltRank | null,
    unit?: Unit
): BeltExamConfig {
    if (BELT_EXAMS[beltId]) {
        return BELT_EXAMS[beltId];
    }

    // Constructor dinámico de alta fidelidad si el cinturón no tiene archivo estático
    const currentName = currentBelt?.name || `Cinturón (${beltId})`;
    const targetName = targetBelt?.name || "Siguiente Grado";
    const targetColor = targetBelt?.color || "#F59E0B";

    // Recolectar preguntas de los 4 niveles de la unidad
    const allUnitQuestions: Question[] = [];
    if (unit && unit.levels) {
        unit.levels.forEach((lvl) => {
            if (lvl.questions && lvl.questions.length > 0) {
                allUnitQuestions.push(...lvl.questions);
            }
        });
    }

    // Seleccionar hasta 10 preguntas (o completar con preguntas maestras si faltan)
    const examQuestions: Question[] = [];
    const usedIds = new Set<string>();

    allUnitQuestions.forEach((q) => {
        if (examQuestions.length < 10 && !usedIds.has(q.id)) {
            usedIds.add(q.id);
            examQuestions.push(q);
        }
    });

    // Preguntas suplementarias si la unidad tiene menos de 10
    const fallbackBank: Question[] = [
        {
            id: `dyn-${beltId}-q1`,
            type: "multiple_choice",
            prompt: `HISTORIA & BUDO: ¿Cuál es el compromiso supremo que asume el practicante de Karate-Do en el grado ${currentName}?`,
            options: [
                { id: "o1", text: "Superar el ego, perseverar con humildad y aplicar el autocontrol marcial en la vida diaria", isCorrect: true },
                { id: "o2", text: "Buscar combates callejeros para demostrar superioridad", isCorrect: false },
                { id: "o3", text: "Abandonar el entrenamiento al aprender las técnicas básicas", isCorrect: false },
                { id: "o4", text: "Competir sin importar la salud ni el respeto hacia el compañero", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "El verdadero espíritu del Budo reside en la transformación interior del carácter humano y la rectitud inquebrantable.",
        },
        {
            id: `dyn-${beltId}-q2`,
            type: "multiple_choice",
            prompt: `BIOMECÁNICA: ¿De dónde se origina la máxima potencia explosiva en una técnica marcial avanzada?`,
            options: [
                { id: "o1", text: "Del enraizamiento con la tierra, rotación pélvica de cadera (Koshi) y foco en el Tanden", isCorrect: true },
                { id: "o2", text: "Únicamente de la fuerza aislada de los músculos del brazo", isCorrect: false },
                { id: "o3", text: "De inclinarse bruscamente hacia adelante perdiendo el equilibrio", isCorrect: false },
                { id: "o4", text: "De golpear con los músculos tensos durante todo el recorrido", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "La cadena cinética transmite la energía desde los pies en el suelo a través de la cadera hasta el foco Kime instantáneo.",
        },
        {
            id: `dyn-${beltId}-q3`,
            type: "multiple_choice",
            prompt: `KATA & TRADICIÓN: ¿Por qué los maestros antiguos preservaron el conocimiento del Karate en los Katas?`,
            options: [
                { id: "o1", text: "Como bibliotecas vivientes en movimiento que guardan las tácticas de supervivencia y defensa personal (Bunkai)", isCorrect: true },
                { id: "o2", text: "Como simples bailes folclóricos sin aplicación real", isCorrect: false },
                { id: "o3", text: "Para evitar que la gente hiciera ejercicio físico", isCorrect: false },
                { id: "o4", text: "Porque no sabían cómo hablar entre ellos", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "Cada Kata es un compendio de técnicas de autodefensa frente a múltiples agresores transmitido sin necesidad de escritura secreta.",
        },
        {
            id: `dyn-${beltId}-q4`,
            type: "multiple_choice",
            prompt: `KIHON: ¿Qué actitud mental debe mantenerse antes, durante y después de ejecutar cualquier técnica marcial?`,
            options: [
                { id: "o1", text: "ZANSHIN (alerta serena y vigilancia continua sin descuidar el entorno)", isCorrect: true },
                { id: "o2", text: "Distracción y festejo inmediato", isCorrect: false },
                { id: "o3", text: "Bajar la guardia y cerrar los ojos", isCorrect: false },
                { id: "o4", text: "Gritar al público celebrando", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "Zanshin es el estado de presencia ininterrumpida que no decae aun cuando el oponente parece haber sido neutralizado.",
        },
    ];

    while (examQuestions.length < 10) {
        const nextFallback = fallbackBank[examQuestions.length % fallbackBank.length];
        examQuestions.push({
            ...nextFallback,
            id: `${nextFallback.id}-${examQuestions.length}`,
        });
    }

    return {
        beltId,
        targetBeltId: targetBelt?.id || "next-belt",
        beltName: currentName,
        targetBeltName: targetName,
        targetBeltColor: targetColor,
        passingScore: 7,
        xpReward: 300,
        title: `Examen Oficial de Ascenso a ${targetName}`,
        subtitle: "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
        description: `Demuestra ante los Tres Maestros Examinadores tu dominio en Historia, Cuerpo Humano, Kihon y Kata para ascender a ${targetName}.`,
        questions: examQuestions,
    };
}
