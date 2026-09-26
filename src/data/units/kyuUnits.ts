import { Unit } from "@/types/didactica";

/**
 * UNIDADES KYU (9° KYU A 1° KYU) CON LOS 4 MÓDULOS CANÓNICOS ESTANDARIZADOS:
 * 1. Historia & Filosofía (number: 1, icon: "🥋")
 * 2. Cuerpo Humano & Biomecánica (number: 2, icon: "💪")
 * 3. Kihon & Fundamentos (number: 3, icon: "👊")
 * 4. Kata & Bunkai (number: 4, icon: "📜")
 */
export const KYU_UNITS: Unit[] = [
    // ── 9° KYU — CINTURÓN AMARILLO 🌅 ──────────────────────────────
    {
        id: "unit-kyu-9",
        title: "Los Primeros Rayos del Sol",
        description: "El despertar de la cortesía marcial, la alineación postural y el primer kata Heian.",
        path: "tradicional",
        beltId: "kyu-9",
        levels: [
            {
                id: "level-rei-etiqueta",
                number: 1,
                title: "Historia",
                subtitle: "El Maestro Sakugawa, la reverencia Rei y las leyes del Dojo",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 60,
                theory: {
                    title: "Rei (礼) y las Raíces Morales de Shuri",
                    subtitle: "Kanga Sakugawa y la forja del carácter marcial",
                    quote: "El Karate comienza con cortesía y concluye con cortesía. Sin respeto sincero, el arte marcial pierde su alma. — Maestro Gichin Funakoshi",
                    content: [
                        "A finales del siglo XVIII, el maestro Kanga Sakugawa (conocido como 'Tode Sakugawa') viajó a la provincia de Fujian en China para formarse en Quan-Fa. Al regresar a Shuri, comprendió que la fuerza combativa sin un marco moral riguroso engendra tiranía.",
                        "Sakugawa instituyó el Dojo Kun (normas del dojo) y consagró el saludo 'Rei' no como una genuflexión de sumisión, sino como un pacto de respeto mutuo donde ambos contendientes preservan la integridad del prójimo.",
                        "El saludo se realiza en dos modalidades: Ritsurei (de pie en Musubi-dachi) con inclinación de 30° manteniendo la mirada respetuosa hacia adelante, y Zarei (sentado en Seiza) sobre el tatami antes de meditar en Mokuso."
                    ],
                    references: [
                        "Funakoshi, G. (1938). Karate-Do Kyohan.",
                        "McCarthy, P. (1995). The Bible of Karate: Bubishi."
                    ]
                },
                questions: [
                    {
                        id: "q-rei-1",
                        type: "multiple_choice",
                        prompt: "¿Qué maestro de Shuri sentó las bases de la cortesía moral y el Dojo Kun en Okinawa?",
                        options: [
                            { id: "o1", text: "Kanga 'Tode' Sakugawa tras estudiar en China", isCorrect: true },
                            { id: "o2", text: "Un general del ejército feudal de Kioto", isCorrect: false },
                            { id: "o3", text: "El emperador Meiji en Tokio", isCorrect: false },
                            { id: "o4", text: "Un pirata mercante del mar del Japón", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Sakugawa sintetizó la ética del Budo chino con la dignidad del reino de Ryukyu.",
                        hint: "Conocido como 'Tode Sakugawa'."
                    },
                    {
                        id: "q-rei-2",
                        type: "true_false",
                        prompt: "¿El saludo Ritsurei en Karate se realiza con la cabeza inclinada hacia el suelo sin mirar hacia adelante?",
                        correctBool: false,
                        explanation: "¡Falso! Se mantiene la atención alerta (Zanshin) sin bajar la vista a ciegas ni arquear indebidamente el cuello.",
                        hint: "El espíritu marcial nunca se desconecta del entorno."
                    }
                ]
            },
            {
                id: "level-cuerpo-kyu-9",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "El centro de gravedad Tanden, la columna y el enraizamiento podal",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 60,
                theory: {
                    title: "El Tanden (丹田) y la Estabilidad Anatómica",
                    subtitle: "Biomecánica de la presión intraabdominal y la base podal",
                    quote: "Una técnica sin raíz en el Tanden es como un árbol sin tierra: caerá ante la primera brisa.",
                    content: [
                        "El cuerpo humano posee su centro de masa en la pelvis, 3 dedos por debajo del ombligo: el punto sagrado Tanden (o Hara).",
                        "Al descender el centro de gravedad mediante la respiración diafragmática baja, se activa el músculo transverso del abdomen y los multífidos lumbares, fijando la columna como una columna de granito.",
                        "El agarre de los dedos del pie contra el tatami (Chusokutei) crea un trípode de sustentación que transmite la fuerza del suelo a través de las piernas."
                    ],
                    references: [
                        "Nakayama, M. (1986). Dynamic Karate: Instruction Manual."
                    ]
                },
                questions: [
                    {
                        id: "q-tanden-1",
                        type: "multiple_choice",
                        prompt: "¿Dónde se ubica anatómicamente el centro de gravedad Tanden (Hara)?",
                        options: [
                            { id: "o1", text: "Aproximadamente tres dedos debajo del ombligo en la profundidad de la pelvis", isCorrect: true },
                            { id: "o2", text: "Entre las clavículas en la garganta", isCorrect: false },
                            { id: "o3", text: "En la corva de la rodilla izquierda", isCorrect: false },
                            { id: "o4", text: "En el lóbulo de la oreja", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El Tanden es el centro de masa del cuerpo y núcleo de distribución energética Ki.",
                        hint: "Zona hipogástrica profunda."
                    }
                ]
            },
            {
                id: "level-dachi-basico",
                number: 3,
                title: "Kihon",
                subtitle: "Posturas matrices (Dachi), bloqueo Age-Uke y el puño inverso Gyaku-Tsuki",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 60,
                theory: {
                    title: "Kihon Fundamental: La Raíz del Desplazamiento",
                    subtitle: "Zenkutsu-dachi, Jodan Age-Uke y el torque de cadera",
                    quote: "Primero domina la postura firme; luego añade la velocidad y finalmente enfoca la fuerza.",
                    content: [
                        "Zenkutsu-dachi (postura adelantada) soporta el 60% del peso en la pierna adelantada flexionada y 40% en la pierna posterior estirada.",
                        "Jodan Age-Uke eleva el antebrazo en ángulo de 45° a un puño de distancia de la frente para deflexionar golpes a la cabeza.",
                        "Gyaku-Tsuki (puño inverso) es la técnica reina de contraataque: la cadera rota bruscamente de Hanmi (perfil) a Shomen (frontal) impulsando el golpe desde el talón trasero."
                    ],
                    references: [
                        "Enoeda, K. (1996). Shotokan Karate: Free Fighting Techniques."
                    ]
                },
                questions: [
                    {
                        id: "q-dachi-1",
                        type: "multiple_choice",
                        prompt: "¿Cuál es la distribución de peso corporal estándar en Zenkutsu-dachi?",
                        options: [
                            { id: "o1", text: "60% adelante en pierna flexionada, 40% atrás en pierna extendida", isCorrect: true },
                            { id: "o2", text: "90% atrás y 10% adelante", isCorrect: false },
                            { id: "o3", text: "50% en los talones", isCorrect: false },
                            { id: "o4", text: "Todo el peso en la rodilla apoyada en el suelo", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Proporciona empuje hacia adelante y solidez para absorber impactos frontales.",
                        hint: "60/40."
                    },
                    {
                        id: "q-dachi-2",
                        type: "multiple_choice",
                        prompt: "¿Qué bloqueo defiende en ángulo ascendente de 45° contra ataques dirigidos al rostro?",
                        options: [
                            { id: "o1", text: "Jodan Age-Uke", isCorrect: true },
                            { id: "o2", text: "Gedan-Barai", isCorrect: false },
                            { id: "o3", text: "Mae-Geri", isCorrect: false },
                            { id: "o4", text: "Oi-Tsuki", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Age-Uke asciende deflectando el ataque fuera de la trayectoria de la cabeza.",
                        hint: "Age = Ascendente."
                    }
                ]
            },
            {
                id: "level-kata-kyu-9",
                number: 4,
                title: "Kata",
                subtitle: "Heian Shodan (平安初段): 21 movimientos, ritmo y defensas angulares",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 70,
                theory: {
                    title: "Heian Shodan: La Mente en Paz — Primer Nivel",
                    subtitle: "El embusen en 'I' mayúscula y la integración de defensas básicas",
                    quote: "Quien domina los cinco Katas Heian estará preparado para sortear cualquier situación de peligro sin perder la serenidad.",
                    content: [
                        "Heian Shodan cuenta con 21 movimientos divididos en dos kiais: en el paso 9 (tercer Oi-tsuki medio) y en el paso 17 (tercer Age-uke alto).",
                        "Enseña transiciones directas entre Gedan-Barai, Oi-Tsuki, Jodan Age-Uke y Shuto-Uke en Kokutsu-dachi.",
                        "El Bunkai revela aplicaciones de escape contra agarres de muñeca, desvíos de patadas frontales y contraataques al plexo solar."
                    ],
                    references: [
                        "Kanazawa, H. (2006). Shotokan Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-hshodan-1",
                        type: "multiple_choice",
                        prompt: "¿Cuántos movimientos y en qué pasos se ejecutan los Kiais en Heian Shodan?",
                        options: [
                            { id: "o1", text: "21 movimientos en total; Kiais en el paso 9 y en el paso 17", isCorrect: true },
                            { id: "o2", text: "15 movimientos con Kiai solo al final", isCorrect: false },
                            { id: "o3", text: "30 movimientos sin ningún Kiai", isCorrect: false },
                            { id: "o4", text: "50 movimientos con 4 Kiais", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Los dos Kiais marcan los momentos de máxima resolución técnica y focalización espiritual.",
                        hint: "21 pasos (Kiai en el 9 y 17)."
                    }
                ]
            }
        ]
    },

    // ── 8° KYU — CINTURÓN NARANJA 🔥 ──────────────────────────────
    {
        id: "unit-kyu-8",
        title: "El Fuego Interior",
        description: "El linaje de Bushi Matsumura, la biomecánica del Hikite, Kokutsu-dachi y Heian Nidan.",
        path: "tradicional",
        beltId: "kyu-8",
        levels: [
            {
                id: "level-historia-kyu-8",
                number: 1,
                title: "Historia",
                subtitle: "Sokon 'Bushi' Matsumura y la guardia de honor de Shuri",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 65,
                theory: {
                    title: "Bushi Matsumura: El Guerrero Imparable",
                    subtitle: "Guardaespaldas de tres reyes de Ryukyu",
                    quote: "La velocidad y la línea recta vencen a la fuerza bruta cuando el espíritu está templado como una espada.",
                    content: [
                        "Sokon Matsumura (1809–1899) fue nombrado comandante de la guardia personal del Castillo de Shuri. Entrenó el estilo de espada Jigen-Ryu de los samuráis de Satsuma y combinó esa ferocidad con el 'Te' autóctono.",
                        "Matsumura transmitió la doctrina de 'un golpe, una decisión': la técnica marcial debe ser tan contundente que resuelva la confrontación en el acto para salvar vidas.",
                        "Fue el maestro principal de Anko Itosu y de Kentsu Yabu, vinculando la corte real con la era moderna."
                    ],
                    references: [
                        "Bishop, M. (1999). Okinawan Karate: Teachers, Styles and Secret Techniques."
                    ]
                },
                questions: [
                    {
                        id: "q-matsumura-1",
                        type: "multiple_choice",
                        prompt: "¿A qué estamento perteneció Sokon 'Bushi' Matsumura durante el Reino de Ryukyu?",
                        options: [
                            { id: "o1", text: "Comandante de la guardia real del Palacio de Shuri", isCorrect: true },
                            { id: "o2", text: "Un recaudador de impuestos de Tokio", isCorrect: false },
                            { id: "o3", text: "Un pescador de la bahía de Tomari", isCorrect: false },
                            { id: "o4", text: "Un médico herbolario de Kioto", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Matsumura protegió a la familia real de Ryukyu y forjó la matriz Shuri-Te.",
                        hint: "Palacio de Shuri."
                    }
                ]
            },
            {
                id: "level-hikite",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "El secreto del Hikite: acción-reacción, dorsales y palancas articulares",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 65,
                theory: {
                    title: "La Física del Hikite (引き手)",
                    subtitle: "Tercera ley de Newton y aceleración de torso",
                    quote: "El puño que golpea solo vuela tan rápido como el puño que recoge.",
                    content: [
                        "Hikite es el retroceso explosivo del puño que no golpea hasta la cresta ilíaca lateral.",
                        "Aplica la 3ª Ley de Newton: la fuerza hacia atrás del brazo que recoge genera un torque torácico que duplica la velocidad del brazo que avanza.",
                        "En combate real, el Hikite representa jalar violentamente el brazo, solapa o cabeza del oponente hacia nosotros para estrellarlo contra nuestro contragolpe."
                    ],
                    references: [
                        "Nakayama, M. (1986). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-hikite-1",
                        type: "multiple_choice",
                        prompt: "¿Qué principio físico y biomecánico optimiza el movimiento de Hikite?",
                        options: [
                            { id: "o1", text: "Acción-reacción (3ª Ley de Newton) y aceleración rotacional de los hombros", isCorrect: true },
                            { id: "o2", text: "La gravedad terrestre atrayendo el codo al suelo", isCorrect: false },
                            { id: "o3", text: "La dilatación de los vasos sanguíneos del brazo", isCorrect: false },
                            { id: "o4", text: "La vibración de las cuerdas vocales", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El retroceso acelera el avance del puño opuesto por conservación del momento angular.",
                        hint: "Acción y reacción."
                    }
                ]
            },
            {
                id: "level-tsuki-basico",
                number: 3,
                title: "Kihon",
                subtitle: "Kokutsu-dachi (postura atrasada), Chudan Uchi-Uke y Mae-Geri Keage",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 65,
                theory: {
                    title: "Defensas Retrasadas y la Primera Patada",
                    subtitle: "Kokutsu-dachi y el látigo de Mae-Geri",
                    quote: "El tronco firme como la roca, la patada ágil como el rayo.",
                    content: [
                        "Kokutsu-dachi apoya el 70% del peso en la pierna retrasada flexionada, permitiendo al karateka esquivar un ataque y contraatacar con la pierna adelantada sin vacilar.",
                        "Chudan Uchi-Uke barre el ataque del oponente de adentro hacia afuera utilizando el radio rotado a 45°.",
                        "Mae-Geri Keage (patada frontal percutante) exige elevar la rodilla al pecho (chambrear), disparar el metatarso (Koshi) y recoger la pierna con velocidad instantánea."
                    ],
                    references: [
                        "Pfluger, A. (2000). Karate: 270 técnicas de Kihon."
                    ]
                },
                questions: [
                    {
                        id: "q-tsuki-1",
                        type: "multiple_choice",
                        prompt: "¿Con qué zona anatómica del pie impacta Mae-Geri Keage?",
                        options: [
                            { id: "o1", text: "Koshi (el metatarso o bola del pie, replegando los dedos hacia atrás)", isCorrect: true },
                            { id: "o2", text: "Con la punta de las uñas de los dedos", isCorrect: false },
                            { id: "o3", text: "Con el talón plano entero", isCorrect: false },
                            { id: "o4", text: "Con el hueso de la espinilla únicamente", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Koshi concentra la energía cinética en una pequeña superficie ósea dura sin fracturar los dedos.",
                        hint: "Bola del pie o metatarso."
                    }
                ]
            },
            {
                id: "level-kata-kyu-8",
                number: 4,
                title: "Kata",
                subtitle: "Heian Nidan (平安二段): mano abierta Shuto, patadas y Nukite",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 75,
                theory: {
                    title: "Heian Nidan: La Fluidez y el Filo de la Mano",
                    subtitle: "26 movimientos de coordinación y defensas complejas",
                    quote: "La fuerza sin control se dispersa; el filo de la mano corta cuando la mente está serena.",
                    content: [
                        "Heian Nidan introduce el uso de la mano abierta Shuto-Uke en Kokutsu-dachi, la combinación de patada frontal Mae-Geri con ataque de puño Uraken, y el penetrante Nukite (mano en lanza).",
                        "Consta de 26 pasos con dos Kiais: en el paso 11 (Nukite central) y en el paso 26 (Gyaku-Tsuki final).",
                        "Su Bunkai aborda defensas contra ataques de cuchillo o golpes simultáneos al cuello y torso."
                    ],
                    references: [
                        "Kanazawa, H. (2006). Shotokan Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-hnidan-1",
                        type: "multiple_choice",
                        prompt: "¿Qué técnica de mano abierta y postura predomina al inicio de Heian Nidan?",
                        options: [
                            { id: "o1", text: "Doble Shuto-Uke (bloqueo con mano espada) en postura Kokutsu-dachi", isCorrect: true },
                            { id: "o2", text: "Gedan Barai en Zenkutsu-dachi", isCorrect: false },
                            { id: "o3", text: "Patada voladora en Kiba-dachi", isCorrect: false },
                            { id: "o4", text: "Un salto mortal hacia atrás", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Shuto-Uke en Kokutsu-dachi es la técnica insignia de Heian Nidan.",
                        hint: "Mano espada en postura atrasada."
                    }
                ]
            }
        ]
    },

    // ── 7° KYU — CINTURÓN VERDE 🎋 ──────────────────────────────
    {
        id: "unit-kyu-7",
        title: "El Bambú que Crece",
        description: "La reforma escolar de Anko Itosu, la rotación pélvica Koshi, Kiba-dachi y Heian Sandan.",
        path: "tradicional",
        beltId: "kyu-7",
        levels: [
            {
                id: "level-historia-kyu-7",
                number: 1,
                title: "Historia",
                subtitle: "Anko Itosu: La revolución educativa y la creación de los Katas Pinan",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 70,
                theory: {
                    title: "Anko Itosu: El Gran Maestro Modernizador",
                    subtitle: "De arte secreto a disciplina educativa escolar",
                    quote: "El Karate no fue creado para pelear en callejones, sino para forjar hombres rectos, valientes y útiles para la sociedad. — Maestro Anko Itosu",
                    content: [
                        "Anko Itosu (1831–1915), conocido como 'El Anciano Sagrado de Shuri', transformó radicalmente la historia marcial en 1901 al incorporar el Karate en el currículo de las escuelas de Okinawa.",
                        "Comprendió que los katas antiguos (Passai, Kusanku) eran demasiado peligrosos y complejos para los niños, por lo que desglosó sus técnicas maestras para crear la serie didáctica Pinan (Heian en japonés).",
                        "En 1908 envió su famosa carta 'Tode Jukun' (Los Diez Preceptos del Karate) a los ministerios de Guerra y Educación de Japón, sentando las bases para su reconocimiento nacional."
                    ],
                    references: [
                        "Cook, H. (2001). Shotokan Karate: A Precise History."
                    ]
                },
                questions: [
                    {
                        id: "q-itosu-1",
                        type: "multiple_choice",
                        prompt: "¿Qué reforma histórica lideró el maestro Anko Itosu en 1901 en Okinawa?",
                        options: [
                            { id: "o1", text: "Introdujo el Karate en las escuelas públicas y creó la serie de Katas Pinan (Heian)", isCorrect: true },
                            { id: "o2", text: "Prohibió la práctica del Karate a menores de 30 años", isCorrect: false },
                            { id: "o3", text: "Eliminó todas las posturas de defensa personal", isCorrect: false },
                            { id: "o4", text: "Fundó la Federación Mundial de Judo", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Itosu democratizó y pedagocizó el Karate para la juventud.",
                        hint: "Katas Pinan / Heian en las escuelas."
                    }
                ]
            },
            {
                id: "level-tai-sabaki",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Rotación pélvica de cadera (Koshi), el Core y las esquivas Tai-Sabaki",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 70,
                theory: {
                    title: "Koshi no Kaiten: El Motor Pélvico",
                    subtitle: "Músculos oblicuos, transverso y alternancia Shomen/Hanmi",
                    quote: "Mover los brazos sin la cadera es golpear con ramas secas; mover la cadera es golpear con el tronco entero.",
                    content: [
                        "La cadera (Koshi) es el engranaje central del cuerpo humano donde convergen las piernas y la columna vertebral.",
                        "En defensa, la pelvis se coloca a 45° (Hanmi), reduciendo la silueta corporal expuesta y permitiendo que los golpes rivales resbalen sin impacto pleno.",
                        "En ataque, la contracción de los músculos oblicuos y glúteos dispara la pelvis al frente (Shomen) generando aceleración angular instantánea."
                    ],
                    references: [
                        "Nakayama, M. (1986). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-koshi-1",
                        type: "multiple_choice",
                        prompt: "¿Por qué la posición de cadera en 'Hanmi' (45°) es fundamental en la defensa?",
                        options: [
                            { id: "o1", text: "Reduce la superficie diana expuesta del torso y almacena energía elástica para el contragolpe", isCorrect: true },
                            { id: "o2", text: "Hace que el cuerpo sea más pesado e inmóvil", isCorrect: false },
                            { id: "o3", text: "Permite ver hacia atrás", isCorrect: false },
                            { id: "o4", text: "Evita tener que flexionar las rodillas", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Hanmi desvía el eje central y tensa los músculos del tronco como un resorte.",
                        hint: "Perfil defensivo a 45 grados."
                    }
                ]
            },
            {
                id: "level-uke-basico",
                number: 3,
                title: "Kihon",
                subtitle: "Kiba-dachi (jinete), Chudan Soto-Uke y Yoko-Geri Kekomi (filo Sokuto)",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 70,
                theory: {
                    title: "Kiba-dachi y las Técnicas Laterales",
                    subtitle: "Estabilidad en el plano frontal y la penetración de Sokuto",
                    quote: "Firme como un jinete a caballo; el filo del pie atraviesa la armadura.",
                    content: [
                        "Kiba-dachi (postura del jinete) sitúa los pies paralelos al doble del ancho de hombros, con el peso repartido 50/50 y rodillas empujando hacia afuera.",
                        "Chudan Soto-Uke impacta con el cúbito en trayectoria rotativa de afuera hacia adentro, desviando ataques dirigidos al tórax.",
                        "Yoko-Geri Kekomi (patada lateral penetrante) empuja con el canto exterior del pie (Sokuto) con flexión extrema de tobillo y extensión completa de cadera."
                    ],
                    references: [
                        "Pfluger, A. (2000). Karate: 270 técnicas de Kihon."
                    ]
                },
                questions: [
                    {
                        id: "q-kiba-1",
                        type: "multiple_choice",
                        prompt: "¿Con qué parte del pie se realiza el impacto demoledor de Yoko-Geri Kekomi?",
                        options: [
                            { id: "o1", text: "SOKUTO (el borde exterior cortante del pie con el talón reforzado)", isCorrect: true },
                            { id: "o2", text: "Con el empeine blando", isCorrect: false },
                            { id: "o3", text: "Con los dedos del pie estirados", isCorrect: false },
                            { id: "o4", text: "Con la pantorrilla interna", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Sokuto es el arma de filo por excelencia en las patadas laterales.",
                        hint: "Borde exterior del pie."
                    }
                ]
            },
            {
                id: "level-kata-kyu-7",
                number: 4,
                title: "Kata",
                subtitle: "Heian Sandan (平安三段): combate en Kiba-dachi, codos y zafadas",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 80,
                theory: {
                    title: "Heian Sandan: El Dominio de la Distancia Corta",
                    subtitle: "20 movimientos de bloqueos dobles y combate cuerpo a cuerpo",
                    quote: "En la corta distancia no hay tiempo para vacilar: el codo y el cuerpo entero son el arma.",
                    content: [
                        "Heian Sandan enseña el combate cerrado mediante Kiba-dachi, introduciendo bloqueos dobles Morote-Uke, barridos de pie y contraataques con codo Empi y dorso de puño Uraken.",
                        "Posee 20 movimientos con Kiais en el paso 10 (Oi-Tsuki central en Zenkutsu-dachi) y en el paso 20 (golpe final de puño en Kiba-dachi tras avance en rotación).",
                        "Su Bunkai aborda el escape de estrangulaciones y agarres por la espalda desarticulando los brazos del agresor."
                    ],
                    references: [
                        "Kanazawa, H. (2006). Shotokan Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-hsandan-1",
                        type: "multiple_choice",
                        prompt: "¿Qué postura sólida lateral domina la fase intermedia y final de Heian Sandan?",
                        options: [
                            { id: "o1", text: "Kiba-dachi (postura del jinete de hierro)", isCorrect: true },
                            { id: "o2", text: "Sanchin-dachi", isCorrect: false },
                            { id: "o3", text: "Nekoashi-dachi", isCorrect: false },
                            { id: "o4", text: "Tsuruashi-dachi", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Kiba-dachi otorga el anclaje lateral indispensable para los giros y golpes de codo de Heian Sandan.",
                        hint: "Postura del jinete."
                    }
                ]
            }
        ]
    },

    // ── 6° KYU — CINTURÓN AZUL 🌊 ──────────────────────────────
    {
        id: "unit-kyu-6",
        title: "El Cielo Infinito",
        description: "La tradición Naha-Te de Kanryo Higaonna, biomecánica de piernas, patada Mawashi-geri y Heian Yondan.",
        path: "tradicional",
        beltId: "kyu-6",
        levels: [
            {
                id: "level-historia-kyu-6",
                number: 1,
                title: "Historia",
                subtitle: "Kanryo Higaonna y el crisol de Naha: la raíz china de Fujian",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 75,
                theory: {
                    title: "Kanryo Higaonna: El Titán de Naha",
                    subtitle: "El viaje clandestino a Fuzhou y el boxeo del sur de China",
                    quote: "El guerrero sabio no busca chocar con la tormenta; se mueve como el agua que llena cada recoveco.",
                    content: [
                        "Kanryo Higaonna (1853–1915) cruzó en barco hacia Fuzhou (provincia de Fujian, China) y entrenó durante más de una década con el maestro Ryu Ryu Ko en el estilo de Grulla Blanca.",
                        "Regresó a Naha enseñando un método centrado en posturas enraizadas, respiración sonora isométrica Ibuki y agarres pesados a puntos vitales.",
                        "Fue el maestro formador de Chojun Miyagi (creador del Goju-Ryu) y Kenwa Mabuni (creador del Shito-Ryu)."
                    ],
                    references: [
                        "McCarthy, P. (1995). The Bible of Karate: Bubishi."
                    ]
                },
                questions: [
                    {
                        id: "q-higaonna-1",
                        type: "multiple_choice",
                        prompt: "¿En qué ciudad china estudió Kanryo Higaonna el estilo de la Grulla Blanca antes de fundar Naha-Te?",
                        options: [
                            { id: "o1", text: "Fuzhou (en la provincia meridional de Fujian)", isCorrect: true },
                            { id: "o2", text: "Pekín en la corte imperial", isCorrect: false },
                            { id: "o3", text: "Shanghái", isCorrect: false },
                            { id: "o4", text: "Hong Kong", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Fujian fue el epicentro del intercambio marcial con el Reino de Ryukyu.",
                        hint: "Fuzhou, Fujian."
                    }
                ]
            },
            {
                id: "level-cuerpo-kyu-6",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Biomecánica de las extremidades inferiores: pivote de apoyo y zonas blandas",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 75,
                theory: {
                    title: "La Cinemática del Pateo Circular",
                    subtitle: "Alineación fémur-pelvis, cuádriceps y apertura articular",
                    quote: "Si el pie de apoyo no gira, la patada se destruye a sí misma desde adentro.",
                    content: [
                        "Mawashi-Geri exige que el pie de apoyo pivote entre 90° y 180° sobre el metatarso, llevando el talón en dirección al adversario.",
                        "Este giro desbloquea el trocánter mayor del fémur impidiendo que impacte contra el hueso ilíaco, permitiendo una trayectoria circular limpia.",
                        "A nivel Chudan, el impacto apunta a las costillas flotantes y la cápsula hepática (hígado), mientras que a nivel Jodan impacta el ángulo mandibular y la arteria carótida."
                    ],
                    references: [
                        "Nakayama, M. (1986). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-cuerpo-6-1",
                        type: "multiple_choice",
                        prompt: "¿Por qué es biomecánicamente obligatorio pivotar el pie de apoyo en Mawashi-Geri?",
                        options: [
                            { id: "o1", text: "Para abrir la articulación de la cadera, proteger la rodilla y proyectar la inercia circular", isCorrect: true },
                            { id: "o2", text: "Para no manchar el suelo del dojo", isCorrect: false },
                            { id: "o3", text: "Para tocar el suelo con el talón levantado", isCorrect: false },
                            { id: "o4", text: "Es opcional y no afecta a la técnica", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El pivote libera el fémur y transmite el torque del tronco al pie de ataque.",
                        hint: "Apertura de cadera y protección articular."
                    }
                ]
            },
            {
                id: "level-geri-basico",
                number: 3,
                title: "Kihon",
                subtitle: "Técnicas de patada (Geri): Mae-Geri, Yoko-Geri y Mawashi-Geri",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 75,
                theory: {
                    title: "La Trilogía de Patadas Clásicas",
                    subtitle: "Mae, Yoko y Mawashi: trayectorias, dianas y velocidad de retorno",
                    quote: "La pierna es tres veces más fuerte que el brazo, pero solo el doble de rápida si se domina el retorno.",
                    content: [
                        "Mae-Geri (frontal), Yoko-Geri (lateral) y Mawashi-Geri (circular) componen el arsenal podal clásico del Karate.",
                        "Toda patada consta de 4 fases indivisibles: 1) Elevación previa de la rodilla flexionada (chambrear), 2) Disparo y extensión fulminante del impacto con Kime, 3) Recogida instantánea de la rodilla (Hikitamae), y 4) Apoyo controlado en el suelo.",
                        "Sin la fase de recogida, el adversario puede atrapar la pierna con facilidad y derribar al practicante."
                    ],
                    references: [
                        "Enoeda, K. (1996). Shotokan Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-geri-6-1",
                        type: "multiple_choice",
                        prompt: "¿Cuál de las 4 fases de una patada evita que el contrincante atrape nuestra pierna en combate?",
                        options: [
                            { id: "o1", text: "La recogida instantánea de la pierna hacia el pecho (Hikitamae) tras el impacto", isCorrect: true },
                            { id: "o2", text: "Dejar la pierna flotando en el aire para intimidar", isCorrect: false },
                            { id: "o3", text: "Cerrar los ojos durante el vuelo", isCorrect: false },
                            { id: "o4", text: "Gritar Kiai antes de levantar el pie", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El repliegue veloz devuelve el centro de gravedad y previene barridos o atrapamientos.",
                        hint: "Recogida o repliegue veloz."
                    }
                ]
            },
            {
                id: "level-kata-kyu-6",
                number: 4,
                title: "Kata",
                subtitle: "Heian Yondan (平安四段): Juji-Uke, patadas y defensas de codo Empi",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 85,
                theory: {
                    title: "Heian Yondan: La Belleza de la Contención y la Explosión",
                    subtitle: "27 movimientos de cambios drásticos de ritmo",
                    quote: "Tan calmo como el agua quieta de un lago, tan devastador como el rayo en la noche.",
                    content: [
                        "Heian Yondan inicia con dos movimientos lentos de apertura en Kokutsu-dachi donde la respiración interna prepara la mente para una cascada de técnicas explosivas.",
                        "Incluye bloqueos cruzados en X (Juji-Uke), patadas Yoko-Geri combinadas con Uraken, defensas de codo Empi-Uchi y un golpe de rodilla Hiza-Geri con agarre a la nuca.",
                        "Posee 27 pasos con Kiais en el paso 13 (golpe de codo frontal Mae-Empi) y en el paso 25 (Hiza-Geri final)."
                    ],
                    references: [
                        "Kanazawa, H. (2006). Shotokan Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-hyondan-1",
                        type: "multiple_choice",
                        prompt: "¿Qué golpe de impacto demoledor a corta distancia introduce Heian Yondan en su paso 25 con Kiai?",
                        options: [
                            { id: "o1", text: "Hiza-Geri (golpe penetrante de rodilla sujetando la cabeza rival)", isCorrect: true },
                            { id: "o2", text: "Una patada con giro de 360 grados", isCorrect: false },
                            { id: "o3", text: "Un empujón con el hombro derecho", isCorrect: false },
                            { id: "o4", text: "Un cabezazo hacia el suelo", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Hiza-Geri atrae la cabeza del agresor al ascenso fulminante de la rodilla.",
                        hint: "Golpe de rodilla."
                    }
                ]
            }
        ]
    },

    // ── 5° KYU — CINTURÓN MORADO 🌸 ──────────────────────────────
    {
        id: "unit-kyu-5",
        title: "La Tormenta Púrpura",
        description: "Kenwa Mabuni y la síntesis del Shito-Ryu, puntos vitales Kyusho medios y Heian Godan.",
        path: "tradicional",
        beltId: "kyu-5",
        levels: [
            {
                id: "level-historia-kyu-5",
                number: 1,
                title: "Historia",
                subtitle: "Kenwa Mabuni: El erudito que unió Shuri-Te y Naha-Te",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 80,
                theory: {
                    title: "Kenwa Mabuni y la Creación del Shito-Ryu",
                    subtitle: "Honrando a Itosu y Higaonna en una síntesis perfecta",
                    quote: "El mayor error es aferrarse a un solo extremo; la verdad marcial une la ligereza del viento con la solidez de la roca.",
                    content: [
                        "Kenwa Mabuni (1889–1952) fue el único maestro privilegiado que entrenó profundamente con los dos colosos de Okinawa: Anko Itosu (Shuri-Te) y Kanryo Higaonna (Naha-Te).",
                        "Para honrar a ambos, tomó el primer kanji del nombre de Itosu ('Shi' 糸) y el primer kanji de Higaonna ('To' 東), fundando la escuela Shito-Ryu (糸東流) en Osaka.",
                        "Mabuni preservó más de 50 katas tradicionales y transmitió las aplicaciones ocultas del Bubishi a la sociedad moderna."
                    ],
                    references: [
                        "Bishop, M. (1999). Okinawan Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-mabuni-1",
                        type: "multiple_choice",
                        prompt: "¿De qué dos maestros tomó Kenwa Mabuni los caracteres para bautizar el estilo 'Shito-Ryu'?",
                        options: [
                            { id: "o1", text: "Anko Itosu (Shi) y Kanryo Higaonna (To)", isCorrect: true },
                            { id: "o2", text: "Gichin Funakoshi y Jigoro Kano", isCorrect: false },
                            { id: "o3", text: "Bruce Lee y Dan Inosanto", isCorrect: false },
                            { id: "o4", text: "Chojun Miyagi y Hironori Otsuka", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Shito-Ryu combina la velocidad lineal de Shuri con la fuerza enraizada de Naha.",
                        hint: "Itosu y Higaonna."
                    }
                ]
            },
            {
                id: "level-cuerpo-kyu-5",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Anatomía de puntos vulnerables medios: plexo solar (Suigetsu) y costillas",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 80,
                theory: {
                    title: "El Plexo Solar (Suigetsu 水月) y los Puntos Medios",
                    subtitle: "La red nerviosa celíaca y la parálisis diafragmática",
                    quote: "Golpear sin precisión gasta energía; tocar el punto vulnerable desactiva la agresión en un instante.",
                    content: [
                        "El plexo solar (Suigetsu en japonés) se ubica en el epigastrio, justo debajo del apéndice xifoides del esternón.",
                        "Alberga el plexo nervioso celíaco que inerva el diafragma, estómago e intestinos. Un impacto de puño o patada aquí desencadena una sobrecarga vagal que detiene temporalmente el espasmo diafragmático, privando al agresor de aire de inmediato.",
                        "Las costillas flotantes 11ª y 12ª carecen de soporte esternal, por lo que impactos en rotación transmiten la onda de choque a órganos vitales internos."
                    ],
                    references: [
                        "McCarthy, P. (1995). The Bible of Karate: Bubishi."
                    ]
                },
                questions: [
                    {
                        id: "q-kyusho-5-1",
                        type: "multiple_choice",
                        prompt: "¿Qué efecto fisiológico produce un impacto certero en el plexo solar (Suigetsu)?",
                        options: [
                            { id: "o1", text: "Espasmo temporal del diafragma por estimulación del plexo celíaco, imposibilitando la respiración", isCorrect: true },
                            { id: "o2", text: "Fractura automática de la clavícula", isCorrect: false },
                            { id: "o3", text: "Pérdida de la audición instantánea", isCorrect: false },
                            { id: "o4", text: "Aumento inmediato de la resistencia física", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La descarga refleja paraliza el diafragma haciendo que el oponente se doble sobre sí mismo.",
                        hint: "Espasmo diafragmático y falta de aire."
                    }
                ]
            },
            {
                id: "level-kihon-kyu-5",
                number: 3,
                title: "Kihon",
                subtitle: "Fudo-dachi (postura inamovible), Uraken-Uchi y Ushiro-Geri (patada trasera)",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 80,
                theory: {
                    title: "La Fuerza Inamovible y el Combate Posterior",
                    subtitle: "Fudo-dachi y la potencia del talón en Ushiro-Geri",
                    quote: "Como una montaña ante el viento; el golpe hacia atrás alcanza lo invisible.",
                    content: [
                        "Fudo-dachi (o Sochin-dachi) combina la profundidad de Zenkutsu-dachi con la anchura de Kiba-dachi, creando una base inquebrantable para el combate en corta distancia.",
                        "Uraken-Uchi (golpe con el dorso del puño) utiliza el juego veloz de la muñeca como un látigo dirigido a la nariz o sienes.",
                        "Ushiro-Geri (patada hacia atrás) emplea el talón (Kakato) empujando en línea recta con extensión máxima del glúteo mayor."
                    ],
                    references: [
                        "Nakayama, M. (1986). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-kihon-5-1",
                        type: "multiple_choice",
                        prompt: "¿Qué hueso del pie transmite la tremenda fuerza penetrante en Ushiro-Geri?",
                        options: [
                            { id: "o1", text: "El calcáneo (el talón del pie endurecido)", isCorrect: true },
                            { id: "o2", text: "La punta de los dedos gordos", isCorrect: false },
                            { id: "o3", text: "El empeine superficial", isCorrect: false },
                            { id: "o4", text: "El maléolo interno", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El talón es la estructura ósea más densa del cuerpo inferior, ideal para el empuje de Ushiro-Geri.",
                        hint: "El talón (calcáneo)."
                    }
                ]
            },
            {
                id: "level-kata-intro",
                number: 4,
                title: "Kata",
                subtitle: "Heian Godan (平安五段): saltos acrobáticos, zafadas Mizu-Nagare y Bunkai",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 90,
                theory: {
                    title: "Heian Godan: La Culminación de la Serie Heian",
                    subtitle: "23 movimientos que sellan el aprendizaje de los katas básicos",
                    quote: "El río fluye sin detenerse por las piedras; el karateka salta por encima del peligro con serenidad.",
                    content: [
                        "Heian Godan es el quinto y último kata de la serie fundamental. Sintetiza defensas a diferentes alturas, ataques en Kiba-dachi y el primer salto marcial (Tobi) para esquivar un barrido bajo.",
                        "Consta de 23 movimientos con Kiais en el paso 12 (Gyaku-Tsuki medio en Kiba-dachi) y en el paso 19 (salto sobre el ataque y aterrizaje en Kosa-dachi con Juji-Uke bajo).",
                        "El Bunkai culmina con la maniobra 'Mizu-Nagare' (agua que fluye), una luxación y derribo que proyecta al agresor utilizando su propia inercia."
                    ],
                    references: [
                        "Kanazawa, H. (2006). Shotokan Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-hgodan-1",
                        type: "multiple_choice",
                        prompt: "¿Cuál es la función táctica del salto acrobático (Tobi) en el paso 19 de Heian Godan?",
                        options: [
                            { id: "o1", text: "Evadir un barrido de pie bajo o corte de arma a los tobillos, cayendo en Kosa-dachi con defensa Juji-Uke", isCorrect: true },
                            { id: "o2", text: "Celebrar que el kata está por terminar", isCorrect: false },
                            { id: "o3", text: "Tratar de tocar el techo del dojo", isCorrect: false },
                            { id: "o4", text: "Dar tiempo al árbitro para anotar puntos", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El salto libra las piernas del barrido enemigo y el aterrizaje en postura cruzada atrapa la pierna atacante.",
                        hint: "Evadir un barrido bajo y atrapar."
                    }
                ]
            }
        ]
    },

    // ── 4° KYU — CINTURÓN MORADO CON BLANCO ☯️ ──────────────────────
    {
        id: "unit-kyu-4",
        title: "La Dualidad del Camino",
        description: "Funakoshi en Tokio (1922), vectores cinéticos, combinaciones Renraku-waza y Tekki Shodan.",
        path: "tradicional",
        beltId: "kyu-4",
        levels: [
            {
                id: "level-historia-kyu-4",
                number: 1,
                title: "Historia",
                subtitle: "La Demostración de Tokio de 1922: Funakoshi y Jigoro Kano",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 85,
                theory: {
                    title: "La Llegada del Karate al Japón Continental",
                    subtitle: "La Exposición Nacional de Educación Física y el encuentro en el Kodokan",
                    quote: "El verdadero progreso nace de la fraternidad entre artes marciales hermanas.",
                    content: [
                        "En mayo de 1922, el Maestro Gichin Funakoshi viajó a Tokio para realizar la primera demostración oficial de Karate en la Primera Exposición Nacional de Educación Física.",
                        "El fundador del Judo, Jigoro Kano, quedó tan impresionado por la elegancia y contundencia del arte que invitó a Funakoshi al dojo central del Kodokan para aprender las formas tradicionales.",
                        "Fruto de esta hermandad, Funakoshi adoptó el uniforme blanco de entrenamiento (Karategi) y el sistema de graduación de cinturones Kyu/Dan creado originalmente por Kano."
                    ],
                    references: [
                        "Funakoshi, G. (1975). Karate-Do: My Way of Life."
                    ]
                },
                questions: [
                    {
                        id: "q-tokio-1",
                        type: "multiple_choice",
                        prompt: "¿Qué ilustre maestro japonés invitó a Funakoshi al Kodokan e inspiró la adopción del Karategi blanco y los grados Kyu/Dan?",
                        options: [
                            { id: "o1", text: "Jigoro Kano (fundador del Judo)", isCorrect: true },
                            { id: "o2", text: "Morihei Ueshiba (Aikido)", isCorrect: false },
                            { id: "o3", text: "El emperador Hirohito", isCorrect: false },
                            { id: "o4", text: "Masutatsu Oyama (Kyokushin)", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Jigoro Kano brindó un respaldo decisivo a Funakoshi para popularizar el Karate en Tokio.",
                        hint: "Fundador del Judo."
                    }
                ]
            },
            {
                id: "level-cuerpo-kyu-4",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Cadenas cinéticas compuestas y vectores de fuerza sagital y coronal",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 85,
                theory: {
                    title: "Vectores Cinéticos en el Combate Intermedio",
                    subtitle: "Transferencia de momento lineal y rotacional sin fugas de energía",
                    quote: "La fuerza que no se alinea en el vector de impacto se disipa como humo.",
                    content: [
                        "En técnicas compuestas (Renraku-waza), la energía no debe reiniciarse desde cero con cada golpe; debe fluir como una ola continua.",
                        "El plano sagital divide el cuerpo en mitades izquierda y derecha (ataques directos como Gyaku-Tsuki); el plano coronal rige los movimientos laterales y barridos (como Kiba-dachi en Tekki).",
                        "Alinear los codos, muñecas y hombros en la línea de vector de fuerza previene lesiones en las articulaciones y garantiza la máxima penetración Kime."
                    ],
                    references: [
                        "Nakayama, M. (1986). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-vector-4-1",
                        type: "multiple_choice",
                        prompt: "¿Por qué en una combinación de técnicas la cadera debe fluir sin detenerse en falso entre golpes?",
                        options: [
                            { id: "o1", text: "Para aprovechar la inercia del movimiento previo y encadenar la fuerza elástica muscular", isCorrect: true },
                            { id: "o2", text: "Para que el rival no pueda parpadear", isCorrect: false },
                            { id: "o3", text: "Porque el árbitro lo exige en el reglamento", isCorrect: false },
                            { id: "o4", text: "No tiene ninguna importancia", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La cadena cinética encadena la aceleración reduciendo el tiempo de reacción entre impactos.",
                        hint: "Aprovechar la inercia elástica."
                    }
                ]
            },
            {
                id: "level-renraku",
                number: 3,
                title: "Kihon",
                subtitle: "Combinaciones tácticas (Renraku-Waza): bloqueo, contraataque y remate",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 85,
                theory: {
                    title: "Renraku-Waza (連絡技): El Arte del Encadenamiento",
                    subtitle: "Transiciones fluidas de defensa a contragolpe decisivo",
                    quote: "Una técnica abre la puerta; la segunda técnica decide el combate.",
                    content: [
                        "Renraku-Waza es la habilidad de enlazar técnicas de bloqueo, puño y patada en una secuencia armónica sin pausas.",
                        "Ejemplo clásico de 4° Kyu: Chudan Uchi-Uke ➔ Kizami-Tsuki ➔ Gyaku-Tsuki ➔ Mae-Geri.",
                        "Entrena el sentido del tiempo (Hyoshi) y el mantenimiento de la guardia y el equilibrio en cada transición."
                    ],
                    references: [
                        "Enoeda, K. (1996). Shotokan Karate: Free Fighting Techniques."
                    ]
                },
                questions: [
                    {
                        id: "q-renraku-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa el término marcial japonés 'Renraku-Waza'?",
                        options: [
                            { id: "o1", text: "Técnicas combinadas o encadenadas de forma fluida", isCorrect: true },
                            { id: "o2", text: "Técnicas de meditación en silencio", isCorrect: false },
                            { id: "o3", text: "El saludo al inicio del examen", isCorrect: false },
                            { id: "o4", text: "Una patada con doble salto", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Renraku significa conexión o enlace continuo entre técnicas.",
                        hint: "Encadenamiento o combinación."
                    }
                ]
            },
            {
                id: "level-kata-kyu-4",
                number: 4,
                title: "Kata",
                subtitle: "Tekki Shodan (鉄騎初段): el combate lateral en la línea del jinete de hierro",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 95,
                theory: {
                    title: "Tekki Shodan: El Jinete de Hierro",
                    subtitle: "El embusen en línea recta absoluta y el barrido Nami-Gaeshi",
                    quote: "Luchar con la espalda pegada a la pared o sobre un puente estrecho: no hay retirada posible.",
                    content: [
                        "Tekki Shodan (originalmente Naihanchi) se ejecuta en su totalidad en una línea recta lateral sin avanzar ni retroceder un solo paso en profundidad.",
                        "Mantiene Kiba-dachi continuo durante los 29 movimientos, obligando al karateka a generar máxima potencia mediante el giro de torso y el agarre plantar.",
                        "Introduce el 'Nami-Gaeshi' (ola que retorna): un barrido con la planta del pie para esquivar o desviar patadas bajas protegiendo la ingle."
                    ],
                    references: [
                        "Kanazawa, H. (2006). Shotokan Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-tekki-1",
                        type: "multiple_choice",
                        prompt: "¿Qué geometría de desplazamiento (Embusen) única caracteriza a Tekki Shodan?",
                        options: [
                            { id: "o1", text: "Una línea recta completamente lateral sin avanzar ni retroceder en profundidad", isCorrect: true },
                            { id: "o2", text: "Un círculo de 360 grados", isCorrect: false },
                            { id: "o3", text: "Una forma de estrella de 5 puntas", isCorrect: false },
                            { id: "o4", text: "Un zigzag diagonal", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Tekki Shodan entrena el combate con la espalda pegada a un acantilado o muro en línea recta.",
                        hint: "Línea recta lateral pura."
                    }
                ]
            }
        ]
    },

    // ── 3° KYU — CINTURÓN CAFÉ (3 LÍNEAS) ⚔️ ────────────────────────
    {
        id: "unit-kyu-3",
        title: "La Forja del Acero",
        description: "El nacimiento de Wado-Ryu con Hironori Otsuka, fisiología bajo estrés y Bassai Dai.",
        path: "tradicional",
        beltId: "kyu-3",
        levels: [
            {
                id: "level-historia-kyu-3",
                number: 1,
                title: "Historia",
                subtitle: "Hironori Otsuka y el Wado-Ryu: la armonía del Ju-Jitsu y el Karate",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 90,
                theory: {
                    title: "Hironori Otsuka: El Camino de la Paz (Wado-Ryu)",
                    subtitle: "Integración de esquivas circulares (Nagashizuki) y luxaciones",
                    quote: "No luches contra la fuerza del río; fluye a su lado y guía su curso hacia el vacío.",
                    content: [
                        "Hironori Otsuka (1892–1982) era un consumado maestro del Ju-Jitsu clásico de Shindo Yoshin Ryu cuando conoció a Funakoshi en 1922.",
                        "Estudió Karate con devoción pero consideró que los bloqueos rígidos cuerpo a cuerpo podían complementarse con las esquivas fluidas, luxaciones articulares y desvíos suaves del Ju-Jitsu.",
                        "En 1934 fundó el Wado-Ryu ('El Camino de la Paz'), uno de los 4 grandes estilos reconocidos en el mundo entero."
                    ],
                    references: [
                        "Bishop, M. (1999). Okinawan Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-otsuka-1",
                        type: "multiple_choice",
                        prompt: "¿Qué arte marcial clásico dominaba Hironori Otsuka antes de crear el estilo Wado-Ryu?",
                        options: [
                            { id: "o1", text: "Ju-Jitsu tradicional (escuela Shindo Yoshin Ryu)", isCorrect: true },
                            { id: "o2", text: "Esgrima olímpica europea", isCorrect: false },
                            { id: "o3", text: "Boxeo tailandés Muay Thai", isCorrect: false },
                            { id: "o4", text: "Sumo profesional de Tokio", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Otsuka enriqueció el Karate con las proyecciones y esquivas del Ju-Jitsu.",
                        hint: "Ju-Jitsu tradicional."
                    }
                ]
            },
            {
                id: "level-cuerpo-kyu-3",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Fisiología bajo estrés combativo: adrenalina, visión de túnel y propiocepción",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 90,
                theory: {
                    title: "El Cuerpo Bajo Fuego: Fisiología del Combate",
                    subtitle: "Control del sistema simpático y preservación de la motricidad fina",
                    quote: "El pulso acelerado traiciona al principiante; la respiración pausada rescata al maestro.",
                    content: [
                        "Ante una amenaza letal, el sistema nervioso simpático segrega adrenalina y noradrenalina, elevando la frecuencia cardíaca y provocando 'visión de túnel' y pérdida de motricidad fina.",
                        "El entrenamiento del cinturón café enseña a controlar este estado mediante la exhalación profunda y el anclaje Tanden, manteniendo la visión periférica activa.",
                        "La propiocepción desarrollada permite percibir la distancia (Maai) y la intención del atacante sin necesidad de razonamiento consciente."
                    ],
                    references: [
                        "Grossman, D. (2004). On Combat: The Psychology and Physiology of Deadly Conflict."
                    ]
                },
                questions: [
                    {
                        id: "q-estres-1",
                        type: "multiple_choice",
                        prompt: "¿Cómo contrarresta el karateka avanzado la pérdida de visión periférica provocada por la adrenalina?",
                        options: [
                            { id: "o1", text: "Mediante la respiración diafragmática profunda y el mantenimiento consciente de Zanshin relajado", isCorrect: true },
                            { id: "o2", text: "Cerrando los párpados para descansar los ojos", isCorrect: false },
                            { id: "o3", text: "Mirando fijamente solo los ojos del rival sin parpadear jamás", isCorrect: false },
                            { id: "o4", text: "Tomando bebidas energéticas antes del combate", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La respiración baja modula el tono vagal permitiendo mantener la vista panorámica del entorno.",
                        hint: "Respiración diafragmática y Zanshin."
                    }
                ]
            },
            {
                id: "level-kihon-kyu-3",
                number: 3,
                title: "Kihon",
                subtitle: "Ashi-Barai (barridos de pie), contraataque Deai y control de distancia",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 90,
                theory: {
                    title: "Ashi-Barai y el Desequilibrio Dinámico (Kuzushi)",
                    subtitle: "Cosechar el apoyo en el instante exacto de la transferencia de peso",
                    quote: "No derribes al oponente con fuerza; quita el suelo bajo sus pies cuando avance.",
                    content: [
                        "Ashi-Barai barre el tobillo o talón del rival justo en la milésima de segundo en que apoya su peso para iniciar un ataque.",
                        "Requiere sincronización perfecta (Deai): si se ejecuta antes de tiempo, el pie rival está en el aire; si se ejecuta tarde, el peso ya está clavado en el suelo.",
                        "El desequilibrio repentino (Kuzushi) deja al oponente indefenso en caída libre para un remate inmediato con Gyaku-Tsuki."
                    ],
                    references: [
                        "Nakayama, M. (1986). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-ashibarai-1",
                        type: "multiple_choice",
                        prompt: "¿En qué momento exacto debe impactar el barrido Ashi-Barai para ser exitoso?",
                        options: [
                            { id: "o1", text: "En la fracción de segundo en que el pie rival toca el suelo transfiriendo su peso", isCorrect: true },
                            { id: "o2", text: "Cuando el rival está sentado en el banquillo", isCorrect: false },
                            { id: "o3", text: "Cinco segundos después de que haya terminado su ataque", isCorrect: false },
                            { id: "o4", text: "Dando una patada hacia arriba en el aire", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La ventana de oportunidad es el instante de la transición de peso donde no puede corregir su apoyo.",
                        hint: "Momento justo de apoyar el peso."
                    }
                ]
            },
            {
                id: "level-kata-intermedio",
                number: 4,
                title: "Kata",
                subtitle: "Bassai Dai (披塞大): romper la fortaleza, invasión y Bunkai de potencia",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 100,
                theory: {
                    title: "Bassai Dai: Atravesar la Fortaleza Enemiga",
                    subtitle: "42 movimientos de bravura indómita y giros de potencia",
                    quote: "Atrapado en una fortaleza sitiada: Bassai Dai rompe el cerco con la furia serena de un torbellino.",
                    content: [
                        "Bassai Dai ('Romper la muralla') es el kata mayor de grado kyu superior. Comienza con una entrada fulminante hacia adelante en Kosa-dachi atrapando la guardia contraria.",
                        "Enseña cambios bruscos entre la calma defensiva y el asalto frontal incesante, con bloqueos dobles Yama-Uke y defensas contra lanzas y bastones.",
                        "Cuenta con 42 movimientos y dos Kiais: en el paso 19 (Uchi-Uke en Kiba-dachi) y en el paso 42 (doble golpe final)."
                    ],
                    references: [
                        "Kanazawa, H. (2006). Shotokan Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-bassaidai-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significado marcial tradicional evoca el nombre del Kata 'Bassai Dai'?",
                        options: [
                            { id: "o1", text: "'Romper o penetrar la fortaleza enemiga' con determinación inquebrantable", isCorrect: true },
                            { id: "o2", text: "'El canto del pájaro al amanecer'", isCorrect: false },
                            { id: "o3", text: "'El descanso de los guerreros'", isCorrect: false },
                            { id: "o4", text: "'Caminar descalzo en la arena'", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Bassai Dai simboliza transformar una desventaja estratégica en una victoria decisiva invadiendo la fortaleza rival.",
                        hint: "Romper la fortaleza enemiga."
                    }
                ]
            }
        ]
    },

    // ── 2° KYU — CINTURÓN CAFÉ (2 LÍNEAS) 🌉 ────────────────────────
    {
        id: "unit-kyu-2",
        title: "El Puente entre Mundos",
        description: "La histórica Cumbre de Naha de 1936, el equilibrio dinámico vestibular, Maai y Kanku Dai.",
        path: "tradicional",
        beltId: "kyu-2",
        levels: [
            {
                id: "level-historia-kyu-2",
                number: 1,
                title: "Historia",
                subtitle: "La Cumbre de Naha de 1936: El bautizo oficial del 'Karate-Do'",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 95,
                theory: {
                    title: "La Asamblea Histórica del 25 de Octubre de 1936",
                    subtitle: "De 'Mano China' a 'Mano Vacía': el nacimiento del Budo moderno",
                    quote: "El vacío no es la nada; es la plenitud infinita que acoge todas las cosas.",
                    content: [
                        "El 25 de octubre de 1936, en el palacio Showa Kaikan de Naha, los patriarcas del Karate (Miyagi, Hanashiro, Yabu, Motobu, Chibana y Shiroma) se reunieron bajo los auspicios del periódico Ryukyu Shimpo.",
                        "En un acuerdo unánime, oficializaron el cambio de ideograma: reemplazaron el kanji 唐 ('To' / China) por el ideograma 空 ('Kara' / Vacío), fijando el nombre 'Karate-Do'.",
                        "Esta transformación consolidó al Karate como una vía espiritual universal inspirada en la vacuidad Zen (Ku)."
                    ],
                    references: [
                        "McCarthy, P. (1995). The Bible of Karate: Bubishi."
                    ]
                },
                questions: [
                    {
                        id: "q-cumbre-1",
                        type: "multiple_choice",
                        prompt: "¿Qué decisión histórica trascendental tomaron los maestros en la Cumbre de Naha de 1936?",
                        options: [
                            { id: "o1", text: "Cambiar oficialmente el kanji de 'Mano de China' (唐手) por el de 'Mano Vacía' (空手道)", isCorrect: true },
                            { id: "o2", text: "Prohibir el uso de patadas en los entrenamientos", isCorrect: false },
                            { id: "o3", text: "Vender los derechos del Karate a una empresa extranjera", isCorrect: false },
                            { id: "o4", text: "Mudar todos los dojos a la isla de Taiwán", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Esa fecha se conmemora anualmente como el Día Mundial del Karate-Do.",
                        hint: "Adopción oficial del kanji 'Vacío' (Kara)."
                    }
                ]
            },
            {
                id: "level-cuerpo-kyu-2",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "El sistema vestibular, canales semicirculares y propiocepción en giros veloces",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 95,
                theory: {
                    title: "El Sistema Vestibular y los Giros en 180° y 360°",
                    subtitle: "Canales semicirculares del oído interno y fijación ocular (spotting)",
                    quote: "La cabeza gira antes que los pies; los ojos encuentran el objetivo antes de que el cuerpo aterrice.",
                    content: [
                        "El sistema vestibular en el oído interno regula el equilibrio espacial a través de los conductos semicirculares llenos de endolinfa.",
                        "Durante rotaciones veloces en katas como Kanku Dai o Bassai Dai, la inercia del fluido puede generar mareo si no se entrena el 'foco visual': la cabeza gira primero y fija la mirada en el nuevo eje.",
                        "La propiocepción muscular retroalimenta la posición de los pies en el tatami asegurando un aterrizaje estable y enraizado."
                    ],
                    references: [
                        "Nakayama, M. (1986). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-vestibular-1",
                        type: "multiple_choice",
                        prompt: "¿Qué técnica neuromuscular evita el mareo o pérdida de balance durante los giros de 180° y 360° en Kata?",
                        options: [
                            { id: "o1", text: "Girar la cabeza velozmente primero fijando el foco visual en el nuevo blanco antes del cuerpo", isCorrect: true },
                            { id: "o2", text: "Cerrar firmemente los ojos durante todo el giro", isCorrect: false },
                            { id: "o3", text: "Inclinar la cabeza lateralmente tocando el hombro", isCorrect: false },
                            { id: "o4", text: "Dar saltos pequeños hasta detenerse", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La fijación ocular estabiliza el reflejo vestíbulo-ocular en la corteza cerebral.",
                        hint: "Foco visual anticipado."
                    }
                ]
            },
            {
                id: "level-maai",
                number: 3,
                title: "Kihon",
                subtitle: "La ciencia del Maai (間合い): Toma, Chika-ma, Issoku-Itto y anticipación",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 95,
                theory: {
                    title: "Maai (間合い): La Distancia Sagrada de Vida o Muerte",
                    subtitle: "Las tres distancias del combate marcial tradicional",
                    quote: "Estar a un milímetro del peligro sin ser tocado; esa es la maestría del Maai.",
                    content: [
                        "Maai no es solo distancia física en centímetros, sino también distancia temporal y psicológica.",
                        "1) Toma (distancia larga): ambos contendientes necesitan más de un paso completo para alcanzarse; zona de observación y fintas.",
                        "2) Issoku-Itto-no-Maai (distancia media decisiva): con un solo paso se puede atacar y con un solo paso se puede esquivar; el filo de la navaja.",
                        "3) Chika-ma (distancia corta): combate cuerpo a cuerpo, codos, rodillas y derribos donde no hay espacio para retroceder."
                    ],
                    references: [
                        "Funakoshi, G. (1938). The Twenty Guiding Principles of Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-maai-1",
                        type: "multiple_choice",
                        prompt: "¿Qué define a la distancia estratégica 'Issoku-Itto-no-Maai'?",
                        options: [
                            { id: "o1", text: "La distancia donde con un solo paso se puede golpear o con un paso esquivar", isCorrect: true },
                            { id: "o2", text: "Estar a 10 metros de distancia del adversario", isCorrect: false },
                            { id: "o3", text: "Estar abrazado en el suelo", isCorrect: false },
                            { id: "o4", text: "Combatir con armas de fuego", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Issoku (un pie/paso) Itto (una espada/golpe): el umbral crítico del combate marcial.",
                        hint: "Un paso para alcanzar o esquivar."
                    }
                ]
            },
            {
                id: "level-kata-kyu-2",
                number: 4,
                title: "Kata",
                subtitle: "Kanku Dai (観空大): 65 movimientos, contemplación del cielo y defensa universal",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 105,
                theory: {
                    title: "Kanku Dai: Mirar Hacia el Cielo Infinito",
                    subtitle: "El kata matriz de 65 movimientos predilecto de Funakoshi",
                    quote: "Alza tus manos unidas al sol y mira a través de ellas: descubrirás que tu mente abarca todo el universo.",
                    content: [
                        "Kanku Dai ('Mirar al cielo') fue el kata favorito del Maestro Gichin Funakoshi para sus demostraciones imperiales.",
                        "Comienza con un triángulo formado con las manos abiertas que se eleva hacia el cielo mientras la vista contempla el firmamento.",
                        "Contiene 65 movimientos ricos en saltos, caídas al suelo para esquivar barridos y contraataques en las 8 direcciones (Happo). De él nacieron los 5 katas Heian."
                    ],
                    references: [
                        "Kanazawa, H. (2006). Shotokan Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-kankudai-1",
                        type: "multiple_choice",
                        prompt: "¿Qué gesto icónico da inicio al majestuoso Kata Kanku Dai?",
                        options: [
                            { id: "o1", text: "Formar un triángulo con los dedos de ambas manos y elevarlo contemplando el cielo a través de él", isCorrect: true },
                            { id: "o2", text: "Dar un salto hacia adelante rompiendo una tabla", isCorrect: false },
                            { id: "o3", text: "Tirarse al suelo boca abajo", isCorrect: false },
                            { id: "o4", text: "Un grito ensordecedor sin moverse", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Kanku (Kan = Mirar, Ku = Cielo/Vacío) evoca la contemplación del cosmos sin ataduras.",
                        hint: "Triángulo con las manos mirando al cielo."
                    }
                ]
            }
        ]
    },

    // ── 1° KYU — CINTURÓN CAFÉ (1 LÍNEA) 🏯 ────────────────────────
    {
        id: "unit-kyu-1",
        title: "La Antesala del Dan",
        description: "Yoshitaka Funakoshi y la revolución técnica, Kyusho avanzado, Jiyu Ippon Kumite y Jion.",
        path: "tradicional",
        beltId: "kyu-1",
        levels: [
            {
                id: "level-historia-kyu-1",
                number: 1,
                title: "Historia",
                subtitle: "Yoshitaka (Gigo) Funakoshi: El genio revolucionario del Karate dinámico",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 100,
                theory: {
                    title: "Yoshitaka Funakoshi: La Forja del Shotokan Moderno",
                    subtitle: "Posturas bajas, Kime demoledor y la creación de nuevas patadas",
                    quote: "El árbol anciano da raíces; la savia joven hace florecer las ramas más altas.",
                    content: [
                        "Yoshitaka Funakoshi (1906–1945), tercer hijo del maestro Gichin Funakoshi, transformó el Karate okinawense estático en un arte dinámico, atlético y explosivo.",
                        "Profundizó las posturas haciéndolas más largas y bajas para fortalecer los muslos y articulaciones, y creó técnicas modernas como Mawashi-Geri, Ushiro-Geri y Yoko-Geri Kekomi tal como se practican hoy.",
                        "Introdujo el Jiyu Kumite (combate libre) entre los clubes universitarios japoneses, preparando el umbral hacia el cinturón negro moderno."
                    ],
                    references: [
                        "Cook, H. (2001). Shotokan Karate: A Precise History."
                    ]
                },
                questions: [
                    {
                        id: "q-yoshitaka-1",
                        type: "multiple_choice",
                        prompt: "¿Qué gran innovación técnica aportó Yoshitaka Funakoshi al Karate-Do moderno?",
                        options: [
                            { id: "o1", text: "Hizo las posturas más bajas y profundas, desarrolló patadas como Mawashi/Ushiro-Geri y creó el combate libre", isCorrect: true },
                            { id: "o2", text: "Prohibió todo tipo de ejercicio físico intenso", isCorrect: false },
                            { id: "o3", text: "Eliminó el uso del cinturón negro", isCorrect: false },
                            { id: "o4", text: "Obligó a entrenar exclusivamente con armadura samurai", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Yoshitaka revolucionó la potencia física y la dinámica biomecánica del Karate.",
                        hint: "Posturas profundas, patadas avanzadas y combate libre."
                    }
                ]
            },
            {
                id: "level-cuerpo-kyu-1",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Anatomía de puntos vitales Kyusho superiores: carótida, sien y esternocleidomastoideo",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 100,
                theory: {
                    title: "Kyusho Avanzado: Los Centros Nerviosos de la Cabeza y Cuello",
                    subtitle: "El seno carotídeo, el nervio vago y la base del cráneo (Kasumi)",
                    quote: "Un golpe al hueso duele; un toque certero al nervio desconecta la conciencia.",
                    content: [
                        "En el umbral del cinturón negro, el karateka debe comprender la fragilidad anatómica del ser humano para no infligir jamás daños irreversibles.",
                        "El seno carotídeo (situado a los lados de la laringe) contiene barorreceptores que regulan la presión arterial; un impacto con Shuto aquí provoca síncope vasovagal instantáneo.",
                        "El punto Kasumi (la sien, articulación del hueso esfenoides) y el triángulo suboccipital requieren el más estricto control (Sundome) en el tatami."
                    ],
                    references: [
                        "McCarthy, P. (1995). The Bible of Karate: Bubishi."
                    ]
                },
                questions: [
                    {
                        id: "q-carotida-1",
                        type: "multiple_choice",
                        prompt: "¿Por qué el control milimétrico (Sundome) es estricto e innegociable ante puntos vitales como el cuello o la sien?",
                        options: [
                            { id: "o1", text: "Porque un impacto directo en el seno carotídeo o la sien puede causar desmayos o lesiones neurológicas graves", isCorrect: true },
                            { id: "o2", text: "Para no despeinar al compañero", isCorrect: false },
                            { id: "o3", text: "Porque el tatami se ensucia", isCorrect: false },
                            { id: "o4", text: "Solo aplica para competiciones olímpicas", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El dominio del cinturón negro consiste en rozar la victoria sin jamás dañar la salud del compañero.",
                        hint: "Preservación estricta de la salud del compañero."
                    }
                ]
            },
            {
                id: "level-preparacion-dan",
                number: 3,
                title: "Kihon",
                subtitle: "Jiyu Ippon Kumite riguroso, llaves articulares (Kansetsu) y Zanshin absoluto",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 100,
                theory: {
                    title: "Jiyu Ippon Kumite: El Umbral del Cinturón Negro",
                    subtitle: "Combate semilibre preestablecido con distancia y timing real",
                    quote: "Un solo paso, un solo golpe, una sola oportunidad: no hay margen para dudar.",
                    content: [
                        "Jiyu Ippon Kumite es el examen de fuego para el ascenso a Shodan.",
                        "El atacante anuncia su técnica (Jodan, Chudan, Mae-Geri) desde distancia real de combate y ataca con velocidad letal máxima.",
                        "El defensor debe absorber o esquivar el ataque en el instante decisivo (Go no Sen o Sen no Sen), bloquear con precisión milimétrica y contraatacar deteniendo el golpe a milímetros de la piel del compañero con Kiai atronador y Zanshin impecable."
                    ],
                    references: [
                        "Nakayama, M. (1986). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-jiyu-1",
                        type: "multiple_choice",
                        prompt: "¿Qué virtud primordial evalúa el tribunal examinador en el defensor durante Jiyu Ippon Kumite?",
                        options: [
                            { id: "o1", text: "Temple sereno sin retroceder con miedo, distancia exacta (Maai) y control milimétrico (Sundome)", isCorrect: true },
                            { id: "o2", text: "Cerrar los ojos y golpear con fuerza desmedida lastimando al compañero", isCorrect: false },
                            { id: "o3", text: "Salir corriendo fuera del área de tatami", isCorrect: false },
                            { id: "o4", text: "Insultar verbalmente al atacante", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Un cinturón negro se reconoce por su serenidad imperturbable y control absoluto de la fuerza.",
                        hint: "Temple, distancia y control milimétrico."
                    }
                ]
            },
            {
                id: "level-kata-kyu-1",
                number: 4,
                title: "Kata",
                subtitle: "Jion (慈恩): 47 movimientos de serena bondad y firmeza monástica",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 110,
                theory: {
                    title: "Jion: Gracia y Compasión del Templo",
                    subtitle: "El kata de los templos budistas con posturas firmes y sobrias",
                    quote: "La verdadera compasión budista no es debilidad; es la fuerza colosal puesta al servicio de la paz.",
                    content: [
                        "Jion ('Piedad y bondad') proviene del antiguo templo budista Jion-ji en China. Es uno de los katas más nobles y solemnes del Karate clásico.",
                        "Inicia con el saludo del monje guerrero: la mano derecha cerrada en puño cubierta por la palma izquierda abierta (saludo Ming).",
                        "Posee 47 movimientos pesados, directos y majestuosos en Zenkutsu-dachi y Kiba-dachi con dos Kiais: en el paso 18 y en el paso 47.",
                        "Es el kata fundamental exigido para la obtención del Cinturón Negro 1° Dan (Shodan)."
                    ],
                    references: [
                        "Kanazawa, H. (2006). Shotokan Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-jion-1",
                        type: "multiple_choice",
                        prompt: "¿Qué saludo ceremonial tradicional abre el solemne Kata Jion?",
                        options: [
                            { id: "o1", text: "El saludo del monje guerrero: el puño derecho cubierto por la palma izquierda abierta al pecho", isCorrect: true },
                            { id: "o2", text: "Una reverencia con ambas manos en el suelo", isCorrect: false },
                            { id: "o3", text: "Un choque de nudillos moderno", isCorrect: false },
                            { id: "o4", text: "Permanecer con los brazos cruzados a la espalda", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Simboliza la unión del sol y la luna (Ming) y la contención de la fuerza marcial bajo el manto de la cortesía.",
                        hint: "Puño cubierto por la palma abierta al pecho."
                    }
                ]
            }
        ]
    }
];
