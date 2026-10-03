import { Unit } from "@/types/didactica";

/**
 * UNIDADES DAN (1° DAN SHODAN A 10° DAN JUDAN)
 * CON LOS 4 MÓDULOS CANÓNICOS ESTANDARIZADOS:
 * 1. Historia & Filosofía (number: 1, icon: "🥋")
 * 2. Cuerpo Humano & Biomecánica (number: 2, icon: "💪")
 * 3. Kihon & Maestría (number: 3, icon: "👊")
 * 4. Kata & Bunkai (number: 4, icon: "📜")
 */
export const DAN_UNITS: Unit[] = [
    // ── 1° DAN — SHODAN ⚫ ──────────────────────────────
    {
        id: "unit-dan-1",
        title: "El Primer Paso Verdadero",
        description: "Shodan: renacer como principiante, biomecánica del Kime neuromuscular y Enpi.",
        path: "tradicional",
        beltId: "dan-1",
        levels: [
            {
                id: "level-shodan-filosofia",
                number: 1,
                title: "Historia",
                subtitle: "Shodan: El renacer de la mente del principiante (Shoshin)",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 110,
                theory: {
                    title: "Shodan (初段): El Comienzo Verdadero",
                    subtitle: "El cinturón negro no es la meta, sino el punto de partida",
                    quote: "El cinturón negro es solo un cinturón blanco que nunca se rindió ante las dificultades.",
                    content: [
                        "El kanji 'Sho' (初) no significa 'maestro supremo', sino 'principio o comienzo'. El grado Shodan indica que el estudiante ha aprendido el alfabeto básico del Karate y ahora está listo para comenzar a escribir sus propias frases.",
                        "El principio zen de 'Shoshin' (初心 - la mente del principiante) recuerda al nuevo cinturón negro que debe mantener la humildad, la avidez por aprender y el corazón limpio de vanidad.",
                        "Con el uso constante y el paso de los años, la tela negra del cinturón se deshilacha y desgasta hasta volver a mostrar el núcleo blanco interior, completando el ciclo espiritual."
                    ],
                    references: [
                        "Suzuki, Shunryu (1994). Mente Zen, Mente de Principiante. Editorial Trotta.",
                        "Funakoshi, Gichin (1975). Karate-Do: Mi Camino de Vida. Editorial Eyras."
                    ]
                },
                questions: [
                    {
                        id: "q-shodan-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa espiritualmente el carácter japonés 'Sho' (初) en el grado marcial Shodan?",
                        options: [
                            { id: "o1", text: "'Inicio o primer paso': la base técnica está adquirida y comienza el verdadero estudio", isCorrect: true },
                            { id: "o2", text: "'Perfección absoluta sin necesidad de entrenar más'", isCorrect: false },
                            { id: "o3", text: "'Permiso para ser juez supremo del dojo'", isCorrect: false },
                            { id: "o4", text: "'Finiquito del camino marcial'", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Shodan es el portal de entrada al verdadero Budo.",
                        hint: "Comienzo o primer paso.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 5: El Significado del Cinturón Negro",
                                note: "Enseña que el carácter Sho (初) significa 'comenzar' o 'principiante': el cinturón negro no es la meta, sino el inicio del verdadero aprendizaje.",
                            },
                            {
                                title: "El Corazón del Karate-Do",
                                author: "Maestro Shigeru Egami",
                                year: 1988,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 1: La Mente de Principiante (Shoshin)",
                                note: "Subraya que alcanzar el grado de Shodan exige despojarse del orgullo y renovar la humildad para profundizar en el Budo.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-cuerpo-dan-1",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Kime neuromuscular: transición de relajación a contracción en milisegundos",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 110,
                theory: {
                    title: "La Fisiología del Kime (決め)",
                    subtitle: "Contracción isométrica fulminante y descarga mioeléctrica",
                    quote: "Kime es cuando todo tu ser se condensa en un solo punto, en una fracción de segundo.",
                    content: [
                        "Kime es el momento de máxima contracción muscular y foco mental en el punto exacto de impacto de una técnica.",
                        "No es tensión constante; es la transición explosiva de relajación total (máxima velocidad) a contracción total en milisegundos.",
                        "Involucra la cadena cinética completa: desde los pies (enraizamiento), pasando por caderas (Koshi), tronco (Tanden) y extremidad que ejecuta.",
                        "Sin Kime, un golpe es un simple movimiento. Con Kime, se convierte en una técnica marcial decisiva."
                    ],
                    references: [
                        "Nakayama, Masatoshi (1994). Karate Dinámico. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-kime-dan-1",
                        type: "multiple_choice",
                        prompt: "¿Qué define biomecánicamente al Kime en el momento del impacto?",
                        options: [
                            { id: "o1", text: "La transición instantánea de relajación veloz a máxima contracción muscular concentrada", isCorrect: true },
                            { id: "o2", text: "Mantener los músculos rígidos y agarrotados durante todo el ataque", isCorrect: false },
                            { id: "o3", text: "Gritar más fuerte que el adversario sin golpear", isCorrect: false },
                            { id: "o4", text: "Cerrar los ojos al impactar", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La relajación da velocidad; la contracción en el microsegundo final transfiere la masa y energía cinética.",
                        hint: "Relajación previa y contracción explosiva final.",
                        references: [
                            {
                                title: "Karate Dinámico: Instrucción Práctica y Biomecánica",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 1: El Principio Supremo del Kime",
                                note: "Define el Kime como la máxima concentración instantánea de potencia muscular al impactar, seguida de relajación inmediata para permitir el siguiente movimiento.",
                            },
                            {
                                title: "El Mejor Karate (Vol. 2): Principios Fundamentales",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1990,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 2: Tensión y Relajación en la Biomecánica del Golpe",
                                note: "Demuestra que la tensión muscular mantenida disminuye la velocidad; la alternancia relajación-tensión-relajación es la clave del Kime.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kihon-dan-1",
                number: 3,
                title: "Kihon",
                subtitle: "Kihon de Shodan: velocidad decisiva, Sundome milimétrico e Ikken Hissatsu",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 110,
                theory: {
                    title: "Ikken Hissatsu y el Control Absoluto",
                    subtitle: "Concentración total de energía con respeto inquebrantable a la vida",
                    quote: "El puño que tiene el poder de destruir debe tener el amor suficiente para detenerse a un milímetro.",
                    content: [
                        "Ikken Hissatsu ('un golpe decisivo') exige enfocar todo el peso corporal, intención espiritual y respiración en un único impacto.",
                        "En el grado Shodan, esta tremenda potencia se somete a la disciplina de 'Sundome': detener la técnica a escasos milímetros del rostro o plexo del compañero sin causarle daño.",
                        "El control milimétrico demuestra maestría real; cualquiera puede golpear ciegamente, solo el verdadero karateka controla su fuerza."
                    ],
                    references: [
                        "Funakoshi, Gichin (1938). Los Veinte Principios Rectores del Karate. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-kihon-dan-1",
                        type: "multiple_choice",
                        prompt: "¿Qué es el 'Sundome' en la práctica del Karate tradicional?",
                        options: [
                            { id: "o1", text: "El control milimétrico para frenar el impacto decisivo a distancia segura cuidando al compañero", isCorrect: true },
                            { id: "o2", text: "Una técnica de patada voladora giratoria", isCorrect: false },
                            { id: "o3", text: "Un tipo de nudo para amarrar el cinturón", isCorrect: false },
                            { id: "o4", text: "El nombre del tatami de competición", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Sundome une la máxima potencia marcial con la máxima compasión y respeto.",
                        hint: "Frenar la técnica a distancia segura con control total.",
                        references: [
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Principio 1: El Karate empieza y termina con respeto",
                                note: "El principio del Sundome (detener el golpe a milímetros) es la prueba máxima del dominio sobre la técnica y del respeto por la vida ajena.",
                            },
                            {
                                title: "El Mejor Karate (Vol. 3): Kumite 1",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1991,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 5: El Control del Impacto en el Tatami",
                                note: "Explica cómo frenar un golpe a plena velocidad justo antes del contacto mediante la contracción antagonista precisa.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-dan-1",
                number: 4,
                title: "Kata",
                subtitle: "Enpi (燕飛): El vuelo de la golondrina, fintas dinámicas y saltos",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 120,
                theory: {
                    title: "Enpi (燕飛): El Vuelo de la Golondrina",
                    subtitle: "37 movimientos de cambios repentinos de nivel y agilidad aérea",
                    quote: "Como una golondrina que rasante toca el agua y se eleva hacia las nubes en un suspiro.",
                    content: [
                        "Enpi (originalmente Wansu de Tomari-Te) se distingue por sus cambios bruscos de altura: el cuerpo desciende al suelo para atrapar y derribar al agresor y asciende en un salto fulminante con giro de 360°.",
                        "Utiliza defensas de codo, agarres de solapa para desequilibrar y contraataques a la mandíbula con Gedan-Tsuki y Kagi-Tsuki.",
                        "Posee 37 movimientos con Kiais en el paso 15 y en el paso 37 (tras el salto y aterrizaje en Kiba-dachi)."
                    ],
                    references: [
                        "Kanazawa, Hirokazu (2006). Karate Kata Completo: Colección Oficial Shotokan. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-enpi-1",
                        type: "multiple_choice",
                        prompt: "¿Qué animal y qué dinámica de movimiento simboliza el Kata Enpi?",
                        options: [
                            { id: "o1", text: "El vuelo de la golondrina: cambios rápidos de altura subiendo y bajando velozmente", isCorrect: true },
                            { id: "o2", text: "La embestida lenta de un oso", isCorrect: false },
                            { id: "o3", text: "El reptar sigiloso de una serpiente en el barro", isCorrect: false },
                            { id: "o4", text: "La pesadez de un elefante", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Enpi (En = Golondrina, Pi = Vuelo) encarna la agilidad y las fintas acrobáticas.",
                        hint: "El vuelo de la golondrina.",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 7): Jitte, Hangetsu, Empi",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1993,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 3: Kata Enpi: El Vuelo de la Golondrina",
                                note: "Simboliza los rápidos cambios de nivel y quiebros de dirección de una golondrina en vuelo, alternando saltos y posturas rasantes.",
                            },
                            {
                                title: "Karate Kata Completo (Vol. 1): Colección Oficial Shotokan",
                                author: "Maestro Hirokazu Kanazawa (SKIF)",
                                year: 2006,
                                editorial: "Editorial Tutor",
                                chapter: "Katas Superiores: Enpi",
                                note: "Estudio del ritmo vertiginoso y las aplicaciones de agarre y derribo ocultas en los movimientos ascendentes de Enpi.",
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ── 2° DAN — NIDAN ⚫⚫ ──────────────────────────────
    {
        id: "unit-dan-2",
        title: "La Profundidad del Río",
        description: "Nidan: la filosofía de Shu-Ha-Ri, eficiencia bioenergética, Sen-no-Sen y Hangetsu.",
        path: "tradicional",
        beltId: "dan-2",
        levels: [
            {
                id: "level-historia-dan-2",
                number: 1,
                title: "Historia",
                subtitle: "Shu-Ha-Ri (守破離): Los tres estadios de la evolución de la maestría",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 115,
                theory: {
                    title: "Shu-Ha-Ri (守破離): El Ciclo de la Sabiduría Marcial",
                    subtitle: "Obedecer la regla, romper la forma y trascender hacia la creación personal",
                    quote: "Primero sigue la tradición con devoción ciega; luego comprende sus principios y finalmente trasciéndela.",
                    content: [
                        "SHU (守 - Proteger/Obedecer): El estudiante copia con fidelidad absoluta los fundamentos del maestro sin cuestionar.",
                        "HA (破 - Romper/Desprender): Al alcanzar los grados Dan intermedios, analiza el Bunkai, descubre cómo adaptar las técnicas a su biomecánica personal y experimenta.",
                        "RI (離 - Trascender/Separar): El arte se vuelve natural e invisible; el practicante ya no 'hace' Karate, sino que el Karate fluye espontáneamente en cada faceta de su vida."
                    ],
                    references: [
                        "Herráiz, Salvador (2006). Karate-Do: Tradición, Evolución y el Principio Shu-Ha-Ri. Editorial Alas."
                    ]
                },
                questions: [
                    {
                        id: "q-shuhari-1",
                        type: "multiple_choice",
                        prompt: "¿Qué representa la etapa 'HA' (破) en la tríada Shu-Ha-Ri?",
                        options: [
                            { id: "o1", text: "Romper la rigidez de la forma para comprender los principios profundos y adaptarlos a uno mismo", isCorrect: true },
                            { id: "o2", text: "Abandonar el entrenamiento para siempre", isCorrect: false },
                            { id: "o3", text: "Romper tablas con la cabeza", isCorrect: false },
                            { id: "o4", text: "Olvidar el respeto hacia los maestros", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Ha es la transición madura hacia la comprensión analítica personal de la técnica.",
                        hint: "Romper la rigidez para comprender los principios.",
                        references: [
                            {
                                title: "Karate-Do: Tradición y Evolución",
                                author: "Sensei Salvador Herráiz (7° Dan)",
                                year: 2006,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 3: El Concepto Filosófico de Shu-Ha-Ri",
                                note: "Explica la tríada Shu (obedecer y copiar la forma), Ha (romper el molde y asimilar los principios) y Ri (trascender la técnica hacia la libertad).",
                            },
                            {
                                title: "Budo: Las Enseñanzas del Fundador",
                                author: "Morihei Ueshiba (Traducción comentada para artes marciales japonesas)",
                                year: 1995,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 2: Las Tres Etapas del Aprendizaje Marcial",
                                note: "Tratado clásico sobre la madurez del practicante cuando la técnica deja de ser una copia externa y surge desde el interior.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kime",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Eficiencia cardiovascular y bioenergética: la respiración isométrica Ibuki",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 115,
                theory: {
                    title: "La Respiración Ibuki (息吹) y la Resistencia Cardiovascular",
                    subtitle: "Tensión muscular isométrica y oxigenación tisular bajo fatiga",
                    quote: "El aire que entra alimenta la llama; el aire que sale con control endurece el cuerpo como bronce.",
                    content: [
                        "Ibuki es la respiración diafragmática profunda y sonora originaria de Naha-Te y katas como Sanchin y Hangetsu.",
                        "Al exhalar con la glotis parcialmente cerrada generando un sonido gutural sostenido, se comprime la cavidad torácica y abdominal, protegiendo los vasos sanguíneos y órganos de traumas externos.",
                        "Regula la saturación de oxígeno en sangre y reduce la producción de ácido láctico en los músculos durante combates prolongados."
                    ],
                    references: [
                        "Miyagi, Chojun (1936). Bosquejo Histórico del Karate-Do de Okinawa. Editorial Alas."
                    ]
                },
                questions: [
                    {
                        id: "q-ibuki-1",
                        type: "multiple_choice",
                        prompt: "¿Qué beneficio fisiológico aporta la respiración diafragmática sonora 'Ibuki'?",
                        options: [
                            { id: "o1", text: "Comprime el torso con tensión isométrica protegiendo órganos y optimiza el intercambio de oxígeno", isCorrect: true },
                            { id: "o2", text: "Enfría los pulmones para no sudar", isCorrect: false },
                            { id: "o3", text: "Desactiva los reflejos del dolor", isCorrect: false },
                            { id: "o4", text: "Permite cantar durante el kata", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Ibuki crea un blindaje muscular y serena el ritmo cardíaco bajo esfuerzo extremo.",
                        hint: "Blindaje muscular e intercambio de oxígeno.",
                        references: [
                            {
                                title: "Karate-Do Goju-Ryu: Principios Fundamentales y Respiración",
                                author: "Maestros Chojun Miyagi y Gogen Yamaguchi",
                                year: 1978,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 2: La Respiración Sonora Ibuki",
                                note: "Explica cómo la exhalación profunda con contracción diafragmática isométrica incrementa la presión intraabdominal y blinda el cuerpo contra impactos.",
                            },
                            {
                                title: "Bubishi: La Biblia del Karate",
                                author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                                year: 2001,
                                editorial: "Editorial Tutor",
                                chapter: "Sección Energética: El Control del Qi a través del Aliento",
                                note: "Métodos tradicionales de respiración fuerte y suave heredados del boxeo de la Grulla Blanca en Naha-Te.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kihon-dan-2",
                number: 3,
                title: "Kihon",
                subtitle: "La iniciativa combativa: Go no Sen, Sen no Sen y Sen Sen no Sen",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 115,
                theory: {
                    title: "Los Tres Niveles de Iniciativa Marcial (Mitsu no Sen)",
                    subtitle: "De la respuesta reactiva a la anticipación psíquica",
                    quote: "Vencer después del ataque es común; vencer en el momento del ataque es destreza; vencer antes de que nazca el pensamiento es maestría.",
                    content: [
                        "1) Go no Sen: Defender y contraatacar después de que el ataque del rival ha sido lanzado y bloqueado.",
                        "2) Sen no Sen: Interceptar y golpear exactamente al mismo tiempo en que el adversario inicia su movimiento (timing de Deai).",
                        "3) Sen Sen no Sen: Anticiparse a la propia intención mental del oponente antes de que sus músculos comiencen a moverse, neutralizándolo en el origen."
                    ],
                    references: [
                        "Funakoshi, Gichin (1938). Los Veinte Principios Rectores del Karate. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-sen-1",
                        type: "multiple_choice",
                        prompt: "¿Qué caracteriza al nivel más elevado de iniciativa marcial 'Sen Sen no Sen'?",
                        options: [
                            { id: "o1", text: "Percibir y neutralizar la intención agresiva del oponente antes de que inicie físicamente su ataque", isCorrect: true },
                            { id: "o2", text: "Esperar a recibir el primer golpe y luego quejarse", isCorrect: false },
                            { id: "o3", text: "Hacer un sorteo para ver quién golpea primero", isCorrect: false },
                            { id: "o4", text: "Atacar por la espalda a un oponente distraído", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Sen Sen no Sen corta la raíz del ataque en el instante de su concepción mental.",
                        hint: "Anticiparse a la intención mental.",
                        references: [
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Principio 2: En el Karate no existe el primer ataque (Karate ni Sente Nashi)",
                                note: "Profundiza en 'Sen Sen no Sen', la iniciativa suprema que anticipa y neutraliza la intención agresiva del oponente antes de que se mueva.",
                            },
                            {
                                title: "El Mejor Karate (Vol. 3): Kumite 1",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1991,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 6: Los Tres Niveles de Iniciativa: Go no Sen, Sen no Sen y Sen Sen no Sen",
                                note: "Clasificación táctica de las respuestas defensivas según el instante mental y físico en que se interviene.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-dan-2",
                number: 4,
                title: "Kata",
                subtitle: "Hangetsu (半月): La Media Luna, tensión isométrica y Hangetsu-dachi",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 125,
                theory: {
                    title: "Hangetsu (半月): La Fuerza de la Media Luna",
                    subtitle: "41 movimientos de respiración profunda y combate a corta distancia",
                    quote: "Los pies describen medias lunas en el suelo; el cuerpo es invulnerable como el acero.",
                    content: [
                        "Hangetsu (conocido en Naha-Te como Seisan) es el kata de respiración y tensión isométrica más emblemático del estilo Shotokan.",
                        "Se ejecuta en Hangetsu-dachi (postura de media luna), desplazando los pies en arcos curvos hacia adentro con fuerte agarre plantar.",
                        "Alterna secuencias lentas de respiración Ibuki comprimiendo la caja torácica con ráfagas veloces de puños Gyaku-Tsuki y Uraken.",
                        "Posee 41 movimientos con Kiais en el paso 11 y en el paso 40."
                    ],
                    references: [
                        "Kanazawa, Hirokazu (2006). Karate Kata Completo: Colección Oficial Shotokan. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-hangetsu-1",
                        type: "multiple_choice",
                        prompt: "¿Qué trayectoria geométrica describen los pies en los desplazamientos de Hangetsu?",
                        options: [
                            { id: "o1", text: "Arcos semicirculares hacia adentro imitando la forma de una media luna", isCorrect: true },
                            { id: "o2", text: "Líneas rectas en zigzag sin flexionar las rodillas", isCorrect: false },
                            { id: "o3", text: "Saltos diagonales de espaldas", isCorrect: false },
                            { id: "o4", text: "Paso de marcha militar rígido", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El desplazamiento semicircular protege los genitales y genera tensión torsional en los aductores.",
                        hint: "Arcos de media luna hacia adentro.",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 7): Jitte, Hangetsu, Empi",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1993,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 2: Kata Hangetsu: La Media Luna",
                                note: "Describe los desplazamientos semicirculares de los pies en Hangetsu-dachi coordinados con respiración profunda y tensión interna.",
                            },
                            {
                                title: "Karate Kata Completo (Vol. 1): Colección Oficial Shotokan",
                                author: "Maestro Hirokazu Kanazawa (SKIF)",
                                year: 2006,
                                editorial: "Editorial Tutor",
                                chapter: "Katas Superiores: Hangetsu",
                                note: "Análisis del equilibrio entre dureza y flexibilidad heredado de las raíces de Naha-Te en la tradición Shotokan.",
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ── 3° DAN — SANDAN ⚫⚫⚫ ──────────────────────────────
    {
        id: "unit-dan-3",
        title: "La Montaña Interior",
        description: "Sandan: Dojo Kun y Niju Kun, inercia rotacional en proyecciones y el kata Jitte.",
        path: "tradicional",
        beltId: "dan-3",
        levels: [
            {
                id: "level-dojo-kun",
                number: 1,
                title: "Historia",
                subtitle: "Dojo Kun y Niju Kun: Las 20 leyes morales de Funakoshi para la vida",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 120,
                theory: {
                    title: "Dojo Kun (道場訓) y Niju Kun (二十訓)",
                    subtitle: "Las reglas éticas que trascienden las cuatro paredes del Dojo",
                    quote: "El objetivo último del Karate no es la victoria en el combate, sino la perfección del carácter humano.",
                    content: [
                        "El DOJO KUN comprende los 5 preceptos recitados al final de cada entrenamiento, todos encabezados con la palabra 'Hitotsu' (Primero/Principal) para indicar que todos tienen la misma jerarquía de importancia:",
                        "1) Esforzarse por la perfección del carácter. 2) Ser fiel y leal a la verdad. 3) Fomentar el espíritu de esfuerzo. 4) Respetar las reglas de cortesía. 5) Abstenerse de comportamientos violentos.",
                        "Las NIJU KUN son las 20 directrices éticas de Gichin Funakoshi: 'Karate wa rei ni hajimari...' (El karate empieza y acaba con respeto), 'Karate ni sente nashi' (No hay primer ataque) y 'El karate es como el agua hirviendo: si no le aplicas calor constante, se enfría'."
                    ],
                    references: [
                        "Funakoshi, Gichin (1938). Los Veinte Principios Rectores del Karate. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-dojokun-1",
                        type: "multiple_choice",
                        prompt: "¿Por qué cada uno de los 5 preceptos del Dojo Kun comienza siempre con la palabra 'HITOTSU' (Primero)?",
                        options: [
                            { id: "o1", text: "Para indicar que ninguno es secundario: todos poseen la misma máxima prioridad en la vida", isCorrect: true },
                            { id: "o2", text: "Porque el maestro olvidó los números del 2 al 5", isCorrect: false },
                            { id: "o3", text: "Para que el rezo sea más rápido", isCorrect: false },
                            { id: "o4", text: "Es una regla gramatical sin ningún sentido ético", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Hitotsu consagra que cada precepto es el pilar número uno sin distinción ni rango.",
                        hint: "Todos tienen la misma máxima prioridad.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 2: Los Preceptos del Dojo Kun",
                                note: "Explica que cada precepto comienza con 'HITOTSU' (Primero) porque ninguna virtud ética es secundaria; todas poseen el mismo rango primordial.",
                            },
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Comentario al Dojo Kun de Kanga Sakugawa",
                                note: "La formación del carácter, la sinceridad, el esfuerzo, la etiqueta y el autocontrol como pilares de igual jerarquía moral.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-cuerpo-dan-3",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Inercia rotacional y torsión de palancas en barridos y proyecciones (Nage-Waza)",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 120,
                theory: {
                    title: "La Física de Nage-Waza: Proyecciones en Karate",
                    subtitle: "Kuzushi (desequilibrio), Tsukuri (entrada) y Kake (ejecución)",
                    quote: "El gigante cae por su propio peso cuando alteras su línea de gravedad un solo centímetro.",
                    content: [
                        "En el Karate tradicional de Okinawa, el combate no se limitaba a puñetazos: incluía derribos (Nage-Waza) y palancas articulares (Kansetsu-Waza) presentes en los Bunkai de los katas.",
                        "Kuzushi saca el centro de gravedad del adversario fuera de su polígono de sustentación.",
                        "Al aplicar torque en la cabeza o hombros en sentido opuesto al barrido de los pies, la inercia rotacional proyecta al agresor contra el suelo sin necesidad de fuerza bruta."
                    ],
                    references: [
                        "McCarthy, Patrick (2001). Bubishi: La Biblia del Karate. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-nage-1",
                        type: "multiple_choice",
                        prompt: "¿Cuál es la fase indispensable sin la cual una proyección o derribo no puede consumarse eficazmente?",
                        options: [
                            { id: "o1", text: "KUZUSHI (desestabilizar y sacar el centro de gravedad del oponente fuera de su base)", isCorrect: true },
                            { id: "o2", text: "Dar un salto hacia atrás", isCorrect: false },
                            { id: "o3", text: "Avisar verbalmente al rival que lo vas a tirar", isCorrect: false },
                            { id: "o4", text: "Cerrar los ojos y empujar", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Sin desequilibrio previo (Kuzushi), el adversario puede contrarrestar la técnica con su peso clavado.",
                        hint: "Kuzushi o desequilibrio previo.",
                        references: [
                            {
                                title: "Karate: Proyecciones y Barridos en Bunkai y Kumite",
                                author: "Sensei Iain Abernethy (7° Dan)",
                                year: 2007,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 1: El Principio Indispensable de Kuzushi (Desequilibrio)",
                                note: "Demuestra que sin romper previamente la postura y el centro de gravedad del adversario es imposible consumar un derribo eficaz.",
                            },
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo VII: Nage-Waza: Las Nueve Proyecciones Clásicas de Karate",
                                note: "Documentación gráfica del maestro ejecutando derribos como Byobudaoshi y Tsubamegaeshi fundamentados en el desequilibrio previo.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kihon-dan-3",
                number: 3,
                title: "Kihon",
                subtitle: "Kihon magistral de Sandan: combinaciones de cinco técnicas con cambio de altura",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 120,
                theory: {
                    title: "Kihon Avanzado de Grado Sandan",
                    subtitle: "Fluidez tridimensional en desplazamientos y contragolpes múltiples",
                    quote: "Tu cuerpo debe ser como un torbellino: continuo, centrado e imposible de atrapar.",
                    content: [
                        "El examen de Sandan exige encadenar series complejas de 5 o más técnicas con transiciones rápidas de Zenkutsu-dachi a Kiba-dachi y Kokutsu-dachi.",
                        "Incluye cambios de plano: defensas Gedan combinadas con ataques Jodan y patadas Ushiro-Mawashi-Geri en un solo tiempo rítmico.",
                        "El practicante debe demostrar estabilidad total al detenerse sin el menor titubeo o desbalance tras el impacto final."
                    ],
                    references: [
                        "Nakayama, Masatoshi (1993). El Mejor Karate: Serie Avanzada. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-kihon-dan-3",
                        type: "multiple_choice",
                        prompt: "¿Qué cualidad técnica delata el dominio supremo en una combinación de grado Sandan?",
                        options: [
                            { id: "o1", text: "La transición instantánea entre alturas y posturas con inmovilidad absoluta tras el Kime final", isCorrect: true },
                            { id: "o2", text: "Dar pasos torpes buscando apoyo", isCorrect: false },
                            { id: "o3", text: "Respirar agitadamente por la boca", isCorrect: false },
                            { id: "o4", text: "Apoyar las manos en el suelo", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La ausencia de balanceos o correcciones de pie al finalizar la serie demuestra enraizamiento maestro.",
                        hint: "Inmovilidad absoluta tras el Kime.",
                        references: [
                            {
                                title: "Karate Dinámico: Instrucción Práctica y Biomecánica",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 5: Fluidez y Ausencia de Rigidez en Técnicas Superiores",
                                note: "Explica que en el grado Sandan el dominio no se mide por la fuerza bruta, sino por la suavidad en las transiciones y la velocidad sin rigidez parásita.",
                            },
                            {
                                title: "El Mejor Karate (Vol. 4): Kumite 2",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1991,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 4: La Economía del Movimiento en Combinaciones Avanzadas",
                                note: "Análisis cinético de la supresión de esfuerzos innecesarios para lograr máxima eficacia y continuidad motriz.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-dan-3",
                number: 4,
                title: "Kata",
                subtitle: "Jitte (十手): Diez manos, defensa contra armas (Bo) y agarres de bastón",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 130,
                theory: {
                    title: "Jitte (十手): El Poder de Diez Manos",
                    subtitle: "24 movimientos de defensa y desarme contra ataques de palo o bastón Bo",
                    quote: "Quien domina este kata combate con la fuerza y recursos de diez manos unidas.",
                    content: [
                        "Jitte pertenece al linaje de Tomari-Te. Su nombre ('Diez Manos') indica que el practicante es capaz de defenderse con la destreza de diez personas simultáneamente.",
                        "Su Bunkai está específicamente diseñado para desviar, atrapar y desarmar agresores armados con palos largos (Bo) o varas de combate.",
                        "Utiliza defensas dobles con las palmas (Teisho-Uke), enganches con el dorso de la muñeca (Kakuto-Uke) y torsiones de bastón en Kiba-dachi.",
                        "Posee 24 movimientos con Kiais en el paso 13 y en el paso 24."
                    ],
                    references: [
                        "Kanazawa, Hirokazu (2006). Karate Kata Completo: Colección Oficial Shotokan. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-jitte-1",
                        type: "multiple_choice",
                        prompt: "¿Contra qué tipo de arma tradicional se especializa el Bunkai defensivo del Kata Jitte?",
                        options: [
                            { id: "o1", text: "Contra ataques de bastón o palo largo (Bo)", isCorrect: true },
                            { id: "o2", text: "Contra arcos y flechas", isCorrect: false },
                            { id: "o3", text: "Contra redes de pesca", isCorrect: false },
                            { id: "o4", text: "Contra cañones", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Las técnicas de Teisho y Kakuto de Jitte atrapan la madera del Bo para arrebatárselo al enemigo.",
                        hint: "Bastón o palo largo (Bo).",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 7): Jitte, Hangetsu, Empi",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1993,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 1: Kata Jitte: Diez Manos",
                                note: "Explica que el Bunkai tradicional de Jitte se especializa en la defensa con manos vacías contra ataques con bastón largo (Bo).",
                            },
                            {
                                title: "Bunkai: Aplicaciones Prácticas y Secretas del Kata",
                                author: "Sensei Iain Abernethy (7° Dan)",
                                year: 2005,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 4: Desarmes y Bloqueos de Bo en el Kata Jitte",
                                note: "Análisis de las técnicas de captura del bastón mediante cruces de antebrazo y presas de desarme rápido.",
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ── 4° DAN — YONDAN ⚫⚫⚫⚫ ──────────────────────────────
    {
        id: "unit-dan-4",
        title: "El Espejo del Maestro",
        description: "Yondan: pedagogía marcial (Shidoin), prevención de lesiones y el kata Gankaku.",
        path: "tradicional",
        beltId: "dan-4",
        levels: [
            {
                id: "level-pedagogia",
                number: 1,
                title: "Historia",
                subtitle: "Shidoin: El arte de enseñar, formar al alumno y preservar el linaje",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 125,
                theory: {
                    title: "El Arte de Enseñar: La Pedagogía del Budo",
                    subtitle: "De practicante a guía espiritual y formador de instructores",
                    quote: "Enseñar no es llenar un cántaro vacío; es encender un fuego sagrado en el corazón del discípulo.",
                    content: [
                        "En el grado Yondan (4° Dan), el karateka recibe el título de 'Shidoin' (Instructor Oficial). La responsabilidad ya no es su propio progreso individual, sino el florecimiento de sus estudiantes.",
                        "Un maestro no impone su ego; comprende las diferencias anatómicas, la psicología infantil y los miedos del principiante para guiarlos con paciencia y rectitud.",
                        "La preservación de la tradición marcial depende enteramente de la pureza y rigor pedagógico con que el Sensei transmite el Karate a las nuevas generaciones."
                    ],
                    references: [
                        "Funakoshi, Gichin (1975). Karate-Do: Mi Camino de Vida. Editorial Eyras."
                    ]
                },
                questions: [
                    {
                        id: "q-shidoin-1",
                        type: "multiple_choice",
                        prompt: "¿Cuál es la misión principal del maestro en el grado Yondan (Shidoin)?",
                        options: [
                            { id: "o1", text: "Transmitir el arte con paciencia pedagógica, adaptando la enseñanza y formando el carácter del alumno", isCorrect: true },
                            { id: "o2", text: "Lucrar sin enseñar la filosofía del Budo", isCorrect: false },
                            { id: "o3", text: "Humillar a los cinturones inferiores", isCorrect: false },
                            { id: "o4", text: "Modificar los katas a su antojo", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La verdadera pedagogía marcial cultiva el espíritu y preserva el linaje intacto.",
                        hint: "Transmitir con paciencia pedagógica y formar el carácter.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 9: El Deber del Instructor (Shidoin)",
                                note: "Establece que en el grado Yondan el maestro debe asumir la responsabilidad pedagógica de formar moralmente a las nuevas generaciones del dojo.",
                            },
                            {
                                title: "Karate Tradicional: Su Filosofía, Su Historia y Sus Fundamentos",
                                author: "Maestro Kenei Mabuni",
                                year: 2000,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 6: La Transmisión del Budo más allá de la Técnica",
                                note: "Reflexiones sobre el título Shidoin y la vocación de guiar al alumno en el camino de la rectitud y la convivencia pacífica.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-cuerpo-dan-4",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Fisiología del desarrollo motor, articulaciones y prevención de desgaste",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 125,
                theory: {
                    title: "Biología del Entrenamiento Longevo",
                    subtitle: "Cuidado del cartílago articular, meniscos y columna en la enseñanza",
                    quote: "El Karate debe darte salud para los próximos 50 años, no dolores para los próximos 5.",
                    content: [
                        "Un instructor de Yondan debe dominar la anatomía funcional para evitar que sus alumnos sufran hiperextensiones de rodilla o desgaste prematuro de meniscos.",
                        "El alineamiento de la rótula con el segundo dedo del pie en Zenkutsu-dachi y Kiba-dachi neutraliza las fuerzas de cizallamiento en los ligamentos cruzados.",
                        "La progresión adecuada del calentamiento y la flexibilidad pasiva y activa garantizan la longevidad del practicante."
                    ],
                    references: [
                        "Kapandji, Adalbert I. (2006). Fisiología Articular: Tronco y Columna Vertebral. Editorial Médica Panamericana."
                    ]
                },
                questions: [
                    {
                        id: "q-cuerpo-dan-4",
                        type: "multiple_choice",
                        prompt: "¿Cómo se previenen lesiones meniscales y de ligamentos cruzados en posturas profundas?",
                        options: [
                            { id: "o1", text: "Alineando siempre la rodilla flexionada verticalmente sobre el pie sin dejar que colapse hacia adentro", isCorrect: true },
                            { id: "o2", text: "Bloqueando las articulaciones de golpe con hiperextensión", isCorrect: false },
                            { id: "o3", text: "Entrenando sin calentar", isCorrect: false },
                            { id: "o4", text: "Poniendo todo el peso en los dedos de las manos", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La alineación axial rodilla-tobillo distribuye el peso sobre los cóndilos femorales de forma segura.",
                        hint: "Alineación vertical sin colapso hacia adentro.",
                        references: [
                            {
                                title: "Karate Dinámico: Biomecánica y Salud Articular",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 2: La Protección de la Articulación de la Rodilla",
                                note: "Demuestra que la rodilla adelantada debe alinearse siempre verticalmente con el dedo gordo del pie para evitar cizallamientos en ligamentos cruzados.",
                            },
                            {
                                title: "Medicina del Karate y Prevención de Lesiones",
                                author: "Dr. Juan Carlos Domínguez",
                                year: 2012,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 4: Lesiones Meniscales y Valgo Forzado en Posturas Bajas",
                                note: "Estudio ortopédico sobre el colapso medial de la rodilla y cómo la alineación postural previene cirugías articulares.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kihon-dan-4",
                number: 3,
                title: "Kihon",
                subtitle: "Kihon de economía de movimiento: la máxima eficacia con el mínimo esfuerzo",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 125,
                theory: {
                    title: "Seiryoku Zenyo: Máxima Eficacia con Mínimo Esfuerzo",
                    subtitle: "Eliminar todo movimiento parásito y telegrafiado",
                    quote: "El novato hace diez movimientos para lograr un efecto; el maestro hace medio movimiento y la tarea está cumplida.",
                    content: [
                        "A nivel Yondan, el karateka purga su técnica de todo 'telegrafiado' (movimientos previos involuntarios como retroceder el hombro o parpadear).",
                        "El golpe nace directamente desde la relajación sin preparación visible.",
                        "La economía de movimiento permite combatir durante horas sin agotamiento físico porque no se desperdicia un solo joule de energía muscular."
                    ],
                    references: [
                        "Funakoshi, Gichin (1935). Karate-Do Kyohan: El Texto Maestro. Editorial Eyras."
                    ]
                },
                questions: [
                    {
                        id: "q-kihon-dan-4",
                        type: "multiple_choice",
                        prompt: "¿Qué significa eliminar el 'telegrafiado' en una técnica de nivel Yondan?",
                        options: [
                            { id: "o1", text: "Lanzar el ataque desde la relajación absoluta sin ningún movimiento previo delator", isCorrect: true },
                            { id: "o2", text: "No enviar mensajes por teléfono antes de la clase", isCorrect: false },
                            { id: "o3", text: "Gritar antes de moverse", isCorrect: false },
                            { id: "o4", text: "Golpear lentamente para que el otro lo vea", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Un golpe no telegrafiado no ofrece pistas visuales a los ojos del adversario.",
                        hint: "Lanzar desde la relajación sin movimientos previos delatores.",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 3): Kumite 1",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1991,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 4: Eliminar el Telegrafiado del Golpe",
                                note: "Enseña a suprimir todo movimiento preparatorio (echar el hombro atrás, mover los ojos o parpadear) antes de lanzar la técnica.",
                            },
                            {
                                title: "Karate Shotokan: Combate Libre (Jiyu Kumite)",
                                author: "Maestro Keinosuke Enoeda (9° Dan)",
                                year: 1996,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 3: El Ataque Súbito sin Señales Previas",
                                note: "Estrategias de combate avanzado para que el golpe parta instantáneamente desde el reposo absoluto.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-dan-4",
                number: 4,
                title: "Kata",
                subtitle: "Gankaku (岩鶴): La grulla sobre la roca, Tsuruashi-dachi y contraataques",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 135,
                theory: {
                    title: "Gankaku (岩鶴): La Grulla sobre la Roca",
                    subtitle: "42 movimientos de equilibrio monópodo sobre una sola pierna",
                    quote: "Inmóvil y serena como una grulla en el arrecife; fulminante como el picotazo que parte la ola.",
                    content: [
                        "Gankaku (antiguamente Chinto de Tomari-Te) es uno de los katas más exigentes y hermosos del Karate clásico.",
                        "Exige mantener el equilibrio monópodo en 'Tsuruashi-dachi' (postura de la grulla con un pie enganchado tras la rodilla de apoyo), resistiendo los embates del oponente antes de disparar un Yoko-Geri y Uraken simultáneos.",
                        "Enseña a defenderse en terrenos inestables o sobre rocas marítimas estrechas donde perder el equilibrio significa caer al abismo.",
                        "Posee 42 movimientos con Kiais en el paso 28 y en el paso 42."
                    ],
                    references: [
                        "Kanazawa, Hirokazu (2006). Karate Kata Completo: Colección Oficial Shotokan. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-gankaku-1",
                        type: "multiple_choice",
                        prompt: "¿Qué postura monópoda icónica de equilibrio supremo caracteriza al Kata Gankaku?",
                        options: [
                            { id: "o1", text: "Tsuruashi-dachi (postura de la pata de grulla sobre una sola pierna)", isCorrect: true },
                            { id: "o2", text: "Kiba-dachi", isCorrect: false },
                            { id: "o3", text: "Zenkutsu-dachi", isCorrect: false },
                            { id: "o4", text: "Seiza", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Tsuruashi-dachi evoca a la grulla posada sobre una roca solitaria entre las olas.",
                        hint: "Postura de la grulla (Tsuruashi-dachi).",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 8): Gankaku y Jion",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 1: Kata Gankaku: La Grulla sobre la Roca",
                                note: "Destaca la postura monópoda sobre una sola pierna (Tsuruashi-dachi) emulando a la grulla lista para atacar con la rodilla y el puño inverso.",
                            },
                            {
                                title: "Karate Kata Completo (Vol. 2): Colección Oficial Shotokan",
                                author: "Maestro Hirokazu Kanazawa (SKIF)",
                                year: 2008,
                                editorial: "Editorial Tutor",
                                chapter: "Katas Avanzados: Gankaku",
                                note: "Instrucciones biomecánicas para sostener el equilibrio unipodal y descargar simultáneamente Yoko-Geri y Uraken.",
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ── 5° DAN — GODAN ⚫⚫⚫⚫⚫ ──────────────────────────────
    {
        id: "unit-dan-5",
        title: "El Dragón Oculto",
        description: "Godan: maestría técnica total, meridianos del Ki según el Bubishi y Sochin.",
        path: "tradicional",
        beltId: "dan-5",
        levels: [
            {
                id: "level-historia-dan-5",
                number: 1,
                title: "Historia",
                subtitle: "El linaje secreto del Bubishi y la consagración como Shihan",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 130,
                theory: {
                    title: "Godan: El Título de Shihan y la Herencia Oculta",
                    subtitle: "La culminación del aprendizaje técnico formal",
                    quote: "El dragón sabio oculta sus garras bajo las nubes; no necesita exhibir su poder para ser venerado.",
                    content: [
                        "En muchas organizaciones tradicionales, el 5° Dan (Godan) marca el último grado otorgado por examen físico riguroso y otorga el título de 'Shihan' (Maestro Ejemplar).",
                        "El Shihan domina el texto secreto del Bubishi, comprendiendo las 48 posturas combativas ilustradas y los remedios herbolarios tradicionales.",
                        "Es el guardián de la llama viva: su presencia transmite serenidad, dignidad y una autoridad moral que inspira sin necesidad de alzar la voz."
                    ],
                    references: [
                        "McCarthy, Patrick (2001). Bubishi: La Biblia del Karate. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-godan-1",
                        type: "multiple_choice",
                        prompt: "¿Qué distinción tradicional de honor acompaña habitualmente al grado marcial Godan (5° Dan)?",
                        options: [
                            { id: "o1", text: "El título de Shihan (Maestro Modelo / Guía Ejemplar del estilo)", isCorrect: true },
                            { id: "o2", text: "El retiro definitivo del tatami", isCorrect: false },
                            { id: "o3", text: "La prohibición de enseñar katas", isCorrect: false },
                            { id: "o4", text: "Un diploma de árbitro deportivo juvenil", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Shihan encarna el modelo vivo de conducta técnica y ética marcial.",
                        hint: "Título de Shihan.",
                        references: [
                            {
                                title: "Karate-Do: Tradición y Linaje",
                                author: "Sensei Salvador Herráiz (7° Dan)",
                                year: 2006,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 5: Los Títulos de Maestría Shogo: Renshi, Kyoshi y Hanshi",
                                note: "Explica que el 5° Dan (Godan) culmina la maestría técnica directa y suele recibir el título de honor Renshi (instructor pulido).",
                            },
                            {
                                title: "Karate de Okinawa: Maestros, Estilos y Métodos Secretos",
                                author: "Sensei Mark Bishop",
                                year: 2004,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 9: La Jerarquía Tradicional del Budo Japonés",
                                note: "Estudio sobre los rangos de maestría del Dai Nippon Butokukai y su trascendencia en el Karate de posguerra.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-cuerpo-dan-5",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Meridianos bioenergéticos y flujo de Ki según el reloj circadiano chino",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 130,
                theory: {
                    title: "Los Meridianos Energéticos y el Reloj Circadiano",
                    subtitle: "La doctrina médica del Bubishi aplicada a la supervivencia",
                    quote: "Quien conoce el curso del río puede detener su cauce; quien conoce el flujo del Ki domina el cuerpo.",
                    content: [
                        "El Bubishi contiene diagramas de los 12 meridianos principales por donde circula la energía vital Ki (o Qi).",
                        "Establece que en cada franja de dos horas del día (las 12 ramas terrestres), el flujo de Ki se concentra en un órgano específico (pulmón al alba, corazón al mediodía, riñones al atardecer).",
                        "Los maestros antiguos utilizaban esta sabiduría tanto para la medicina tradicional y digitopuntura curativa como para neutralizar agresores atacando los puntos vulnerables en sus horas de máxima exposición."
                    ],
                    references: [
                        "McCarthy, Patrick (2001). Bubishi: La Biblia del Karate. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-meridianos-1",
                        type: "multiple_choice",
                        prompt: "¿Para qué utilizaban los maestros tradicionales del Bubishi el mapa de meridianos energéticos?",
                        options: [
                            { id: "o1", text: "Para medicina curativa, digitopuntura y conocimiento de puntos vulnerables Kyusho", isCorrect: true },
                            { id: "o2", text: "Para predecir el horóscopo semanal", isCorrect: false },
                            { id: "o3", text: "Para medir la temperatura del agua del baño", isCorrect: false },
                            { id: "o4", text: "Para diseñar trajes ceremoniales", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El Bubishi es tanto un tratado de autodefensa como un manual de medicina tradicional.",
                        hint: "Medicina curativa y puntos vulnerables Kyusho.",
                        references: [
                            {
                                title: "Bubishi: La Biblia del Karate",
                                author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                                year: 2001,
                                editorial: "Editorial Tutor",
                                chapter: "Sección Energética: El Reloj Circadiano y los Meridianos de Ki",
                                note: "Los maestros tradicionales empleaban la medicina china y el ciclo de mareas energéticas para atacar puntos vulnerables en horas específicas.",
                            },
                            {
                                title: "Puntos Vitales del Karate Tradicional (Kyusho)",
                                author: "Sensei Roland Habersetzer (9° Dan)",
                                year: 2003,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 4: La Doctrina del Dim Mak y la Medicina Tradicional",
                                note: "Correlación entre la anatomía de los meridianos energéticos y los puntos nerviosos del cuerpo humano.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kihon-dan-5",
                number: 3,
                title: "Kihon",
                subtitle: "Generación de poder a distancia cero: el golpe de una pulgada (Sun-Tsuki)",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 130,
                theory: {
                    title: "Sun-Tsuki: El Golpe a Distancia Cero",
                    subtitle: "La onda de choque torácica sin recorrido visible",
                    quote: "El rayo no necesita tomar carrerilla para partir el árbol.",
                    content: [
                        "A nivel de maestría, el karateka no necesita un paso largo ni espacio para generar potencia destructiva.",
                        "Sun-Tsuki (golpe a distancia de una pulgada) transmite la energía mediante una micro-vibración explosiva de cadera y una descarga respiratoria instantánea.",
                        "La onda cinética penetra profundamente en los tejidos internos sin mover visiblemente la superficie del cuerpo."
                    ],
                    references: [
                        "Nakayama, Masatoshi (1994). Karate Dinámico. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-suntsuki-1",
                        type: "multiple_choice",
                        prompt: "¿De dónde se extrae la potencia de impacto en un golpe marcial a distancia cero (Sun-Tsuki)?",
                        options: [
                            { id: "o1", text: "De la micro-rotación explosiva de la pelvis y la súbita descarga diafragmática en el Tanden", isCorrect: true },
                            { id: "o2", text: "De empujar con el brazo extendido lentamente", isCorrect: false },
                            { id: "o3", text: "De dar un pisotón ruidoso en el suelo", isCorrect: false },
                            { id: "o4", text: "De doblar la muñeca hacia arriba", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La vibración del centro pélvico genera una onda expansiva fulminante.",
                        hint: "Micro-rotación pélvica y descarga diafragmática.",
                        references: [
                            {
                                title: "Karate Dinámico: Biomecánica del Movimiento y Estabilidad",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 3: El Golpe a Corta Distancia (Sun-Tsuki)",
                                note: "Demuestra que la tremenda potencia a corta distancia procede de la torsión de la fascia muscular y la rotación explosiva de cadera sin recorrido previo.",
                            },
                            {
                                title: "La Fuerza Interna en las Artes Marciales",
                                author: "Sensei C. W. Nicol",
                                year: 1995,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 3: La Onda de Poder a Una Pulgada",
                                note: "Análisis físico de la transmisión de fuerza a través del suelo canalizada instantáneamente por las cadenas miofasciales.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-superior",
                number: 4,
                title: "Kata",
                subtitle: "Sochin (壯鎭): Fuerza serena y calma inamovible en Fudo-dachi",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 140,
                theory: {
                    title: "Sochin (壯鎭): Tranquilidad y Fuerza Majestuosa",
                    subtitle: "41 movimientos en Fudo-dachi con agarres, torsiones y potencia",
                    quote: "Firme como un templo en la cima de la montaña que ningún terremoto puede derribar.",
                    content: [
                        "Sochin ('Mantener la paz y la calma con fuerza inamovible') se ejecuta casi en su totalidad en la postura Fudo-dachi (postura inquebrantable).",
                        "Combina movimientos lentos y pesados de tensión muscular con ataques fulminantes de dorso de puño Uraken, defensas envolventes y patadas Mikazuki-Geri.",
                        "Enseña a absorber la embestida más salvaje sin retroceder un milímetro, destruyendo la guardia contraria con su propia inercia.",
                        "Posee 41 movimientos con Kiais en el paso 29 y en el paso 41."
                    ],
                    references: [
                        "Kanazawa, Hirokazu (2006). Karate Kata Completo: Colección Oficial Shotokan. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-sochin-1",
                        type: "multiple_choice",
                        prompt: "¿Qué postura reina en todo el Kata Sochin transmitiendo su inquebrantable solidez?",
                        options: [
                            { id: "o1", text: "Fudo-dachi (postura inamovible o arraigada)", isCorrect: true },
                            { id: "o2", text: "Nekoashi-dachi", isCorrect: false },
                            { id: "o3", text: "Sanchin-dachi", isCorrect: false },
                            { id: "o4", text: "Tsuruashi-dachi", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Fudo-dachi otorga a Sochin su carácter monumental e invencible.",
                        hint: "Fudo-dachi (postura inamovible).",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 9): Bassai Sho y Kanku Sho",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 3: Kata Sochin: La Postura Inamovible Fudo-dachi",
                                note: "Destaca la postura Fudo-dachi (Sochin-dachi) como reina del kata, transmitiendo una sensación imponente de calma y poder inquebrantable.",
                            },
                            {
                                title: "Karate Kata Completo (Vol. 2): Colección Oficial Shotokan",
                                author: "Maestro Hirokazu Kanazawa (SKIF)",
                                year: 2008,
                                editorial: "Editorial Tutor",
                                chapter: "Katas Superiores: Sochin: Fuerza y Serenidad",
                                note: "Guía fotográfica sobre la tensión diagonal entre las piernas en Fudo-dachi que combina el avance de Zenkutsu y la solidez de Kiba-dachi.",
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ── 6° DAN — ROKUDAN ⚫⚫⚫⚫⚫⚫ ──────────────────────────────
    {
        id: "unit-dan-6",
        title: "La Noche Estrellada",
        description: "Rokudan: Los 4 Grandes Estilos del Karate, ondas de choque y Nijushiho.",
        path: "tradicional",
        beltId: "dan-6",
        levels: [
            {
                id: "level-estilos",
                number: 1,
                title: "Historia",
                subtitle: "Los Cuatro Grandes Estilos: Shotokan, Shito-Ryu, Goju-Ryu y Wado-Ryu",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 135,
                theory: {
                    title: "La Gran Genealogía de los 4 Estilos Tradicionales",
                    subtitle: "Reconocidos por la Dai Nippon Butokukai y la WKF",
                    quote: "Muchos son los senderos que suben a la montaña sagrada, pero todos contemplan la misma luna en la cumbre.",
                    content: [
                        "1) Shotokan (Gichin Funakoshi): Desplazamientos largos, posturas bajas y profundas, gran velocidad lineal y Kime devastador.",
                        "2) Shito-Ryu (Kenwa Mabuni): El más enciclopédico; fusiona la ligereza de Shuri y la dureza de Naha en más de 50 katas.",
                        "3) Goju-Ryu (Chojun Miyagi): Combina la dureza del impacto con la suavidad circular; respiración Sanchin profunda y combate a corta distancia.",
                        "4) Wado-Ryu (Hironori Otsuka): Influido por el Ju-Jitsu; posturas altas, esquivas fluidas Tai-sabaki sin choque de fuerzas."
                    ],
                    references: [
                        "Bishop, Mark (2004). Karate de Okinawa: Maestros, Estilos y Métodos Secretos. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-estilos-1",
                        type: "multiple_choice",
                        prompt: "¿Qué maestro fundó el estilo Goju-Ryu ('Duro y Suave') en Naha?",
                        options: [
                            { id: "o1", text: "Chojun Miyagi", isCorrect: true },
                            { id: "o2", text: "Gichin Funakoshi", isCorrect: false },
                            { id: "o3", text: "Kenwa Mabuni", isCorrect: false },
                            { id: "o4", text: "Hironori Otsuka", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Chojun Miyagi bautizó el estilo inspirándose en el poema del Bubishi.",
                        hint: "Chojun Miyagi.",
                        references: [
                            {
                                title: "Karate-Do Goju-Ryu: Historia y Tradición",
                                author: "Maestros Chojun Miyagi y Gogen Yamaguchi",
                                year: 1978,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 1: El Poema Kempo Hakku del Bubishi y el Nombre Goju-Ryu",
                                note: "Chojun Miyagi bautizó su estilo a partir del verso 'Ho wa goju o tondosu' (El método consiste en inhalar y exhalar la dureza y la suavidad).",
                            },
                            {
                                title: "Bubishi: La Biblia del Karate",
                                author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                                year: 2001,
                                editorial: "Editorial Tutor",
                                chapter: "Sección Poética: Los Ocho Preceptos del Kempo Hakku",
                                note: "Texto clásico que sirvió de inspiración filosófica para el nacimiento de la escuela Goju-Ryu en Naha.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-cuerpo-dan-6",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Biomecánica de las ondas de choque tisulares y sincronización motora",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 135,
                theory: {
                    title: "Ondas Cinéticas de Choque en el Cuerpo Humano",
                    subtitle: "Frecuencia de resonancia y transferencia a cavidades viscerales",
                    quote: "El agua blanda erosiona la roca más dura cuando vibra con la frecuencia adecuada.",
                    content: [
                        "Un golpe de alto nivel no solo empuja la piel; emite una onda mecánica de alta frecuencia que atraviesa la masa muscular y resuena en los órganos viscerales.",
                        "Si el impacto coincide con la frecuencia de resonancia de los tejidos blandos (5 a 10 Hz), produce una conmoción visceral que incapacita instantáneamente.",
                        "Requiere que la mano o pie impacte y retorne con velocidad hipersónica sin frenar el cuerpo del ejecutante."
                    ],
                    references: [
                        "Nakayama, Masatoshi (1994). Karate Dinámico. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-ondas-1",
                        type: "multiple_choice",
                        prompt: "¿Qué fenómeno físico explica el daño interno profundo de un golpe penetrante sin empujar al rival?",
                        options: [
                            { id: "o1", text: "La transmisión de una onda de choque mecánica de alta frecuencia a los órganos internos", isCorrect: true },
                            { id: "o2", text: "El calor generado por la fricción del karategi", isCorrect: false },
                            { id: "o3", text: "La electricidad estática del tatami", isCorrect: false },
                            { id: "o4", text: "La fuerza del viento empujando", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La onda elástica viaja a través de los líquidos corporales afectando los órganos profundos.",
                        hint: "Onda de choque mecánica a los órganos internos.",
                        references: [
                            {
                                title: "Karate Dinámico: Biomecánica del Movimiento y Estabilidad",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 1: La Transmisión de Ondas de Choque en el Impacto",
                                note: "Explica que un golpe con Kime profundo transmite una onda de choque hidrostática que atraviesa los tejidos blandos afectando órganos internos.",
                            },
                            {
                                title: "Biomecánica y Fisiología del Impacto Marcial",
                                author: "Dr. Juan Carlos Domínguez",
                                year: 2012,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 3: Propagación de Fuerzas Tisulares y Daño Cavitario",
                                note: "Estudio médico de la diferencia entre empuje superficial y transferencia de energía cinética penetrante.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kihon-dan-6",
                number: 3,
                title: "Kihon",
                subtitle: "Happo Kumite: Combate multidireccional contra múltiples atacantes",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 135,
                theory: {
                    title: "Happo Kumite (八方組手): La Esfera de las Ocho Direcciones",
                    subtitle: "Defensa circular fluida ante agresiones simultáneas",
                    quote: "No luches en una línea; tu mente es el centro de una esfera y tus ojos abarcan todo el círculo.",
                    content: [
                        "Happo Kumite entrena la respuesta ante ataques provenientes de las 8 direcciones cardinales y diagonales.",
                        "El maestro nunca permite que los agresores lo rodeen: utiliza los desplazamientos Taisabaki para alinear a los atacantes en fila de modo que el primer agresor estorbe el paso de los demás.",
                        "Exige un Zanshin omnidireccional y la capacidad de pivotar 180° y 90° en una fracción de segundo."
                    ],
                    references: [
                        "Funakoshi, Gichin (1938). Los Veinte Principios Rectores del Karate. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-happo-1",
                        type: "multiple_choice",
                        prompt: "¿Cuál es la regla de oro táctica en el combate contra múltiples agresores (Happo Kumite)?",
                        options: [
                            { id: "o1", text: "Desplazarse para alinear a los atacantes uno detrás del otro evitando quedar cercado en el centro", isCorrect: true },
                            { id: "o2", text: "Quedarse quieto en el centro recibiendo golpes de todos los lados", isCorrect: false },
                            { id: "o3", text: "Cerrar los ojos y girar los brazos como hélices", isCorrect: false },
                            { id: "o4", text: "Tirarse al suelo esperando a que se cansen", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Alinear a los oponentes convierte una pelea múltiple en una sucesión de duelos individuales uno a uno.",
                        hint: "Alinear a los atacantes para que se estorben entre sí.",
                        references: [
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo VIII: Combate contra Múltiples Adversarios (Happo Kumite)",
                                note: "Establece la regla de oro táctica: desplazarse constantemente de modo que un adversario quede en la línea de ataque obstaculizando a los demás.",
                            },
                            {
                                title: "El Libro de los Cinco Anillos",
                                author: "Miyamoto Musashi (Traducción comentada para Budo)",
                                year: 1989,
                                editorial: "Editorial Miraguano",
                                chapter: "El Libro del Fuego: El Combate contra Muchos Enemigos",
                                note: "Estrategia clásica de transformar una multitud en una hilera de enemigos sucesivos de uno en uno.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-dan-6",
                number: 4,
                title: "Kata",
                subtitle: "Nijushiho (二十四歩): 24 pasos de fluidez marina, Haishu y codos",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 145,
                theory: {
                    title: "Nijushiho (二十四歩): La Cadencia de las Olas",
                    subtitle: "24 movimientos de sutileza, defensas envolventes y codos penetrantes",
                    quote: "El mar retrocede suavemente para luego romper con fuerza incontenible contra el acantilado.",
                    content: [
                        "Nijushiho ('24 pasos') pertenece a la vertiente clásica de Niigaki Seisho en Okinawa.",
                        "Se distingue por la riqueza de defensas con el dorso de la mano abierta (Haishu-Uke), bloqueos envolventes y devastadores golpes de codo Empi en giros rasantes.",
                        "Su ritmo emula el romper de las olas en la playa: retrocesos lentos y calmos que se transforman súbitamente en embestidas fulminantes.",
                        "Posee 24 movimientos con Kiais en el paso 18 y en el paso 24."
                    ],
                    references: [
                        "Kanazawa, Hirokazu (2006). Karate Kata Completo: Colección Oficial Shotokan. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-nijushiho-1",
                        type: "multiple_choice",
                        prompt: "¿Qué elemento de la naturaleza evoca el ritmo del Kata Nijushiho?",
                        options: [
                            { id: "o1", text: "El vaivén de las olas del océano: calma en la retirada y fuerza arrolladora en el avance", isCorrect: true },
                            { id: "o2", text: "La caída de una hoja seca", isCorrect: false },
                            { id: "o3", text: "El fuego estático de una vela", isCorrect: false },
                            { id: "o4", text: "El galope descontrolado de un caballo", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La cadencia de las olas transmite su alternancia de suavidad y potencia extrema.",
                        hint: "El vaivén de las olas del océano.",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 10): Unsu, Sochin, Nijushiho",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1995,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 3: Kata Nijushiho: Los Veinticuatro Pasos",
                                note: "Describe el ritmo ondulante y fluido de Nijushiho, semejante a las olas del mar que rompen contra la costa y luego retroceden suavemente.",
                            },
                            {
                                title: "Karate Kata Completo (Vol. 2): Colección Oficial Shotokan",
                                author: "Maestro Hirokazu Kanazawa (SKIF)",
                                year: 2008,
                                editorial: "Editorial Tutor",
                                chapter: "Katas Superiores: Nijushiho",
                                note: "Análisis del Bunkai contra agarres frontales y el uso de técnicas suaves de desvío con las palmas (Teisho).",
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ── 7° DAN — NANADAN ⚫⚫⚫⚫⚫⚫⚫ ──────────────────────────────
    {
        id: "unit-dan-7",
        title: "El Vacío Perfecto",
        description: "Nanadan: Mushin (la mente vacía como espejo), estado de Flow y Meikyo.",
        path: "tradicional",
        beltId: "dan-7",
        levels: [
            {
                id: "level-mushin",
                number: 1,
                title: "Historia",
                subtitle: "Mushin (無心): La mente vacía y la trascendencia espiritual del Budo",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 140,
                theory: {
                    title: "Mushin (無心): La Mente Como Agua en Calma",
                    subtitle: "Reaccionar sin pensamiento consciente, en armonía total con el universo",
                    quote: "Como la luna reflejada en el agua: el agua no tiene la intención de reflejarla, la luna no tiene la intención de ser reflejada, y sin embargo el reflejo es perfecto.",
                    content: [
                        "Mushin no significa mente desatenta o estúpida; significa una mente libre de emociones tóxicas (miedo, orgullo, rencor, obsesión por la victoria).",
                        "El maestro Takuan Soho comparó la mente con una rueda: si un clavo se clava en un solo rayo, toda la rueda se detiene; pero si la mente no se fija en nada, puede girar libremente hacia cualquier dirección.",
                        "En combate, quien piensa qué técnica usar ya ha sido derrotado por el tiempo. El karateka que alcanza Mushin actúa de forma instantánea y natural."
                    ],
                    references: [
                        "Takuan Soho (1990). La Mente Desembarazada: Escritos de un Maestro Zen a un Maestro de Espada. Editorial Miraguano.",
                        "Funakoshi, Gichin (1935). Karate-Do Kyohan: El Texto Maestro. Editorial Eyras."
                    ]
                },
                questions: [
                    {
                        id: "q-mushin-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa alcanzar el estado de 'Mushin' (無心) en el Budo?",
                        options: [
                            { id: "o1", text: "La mente libre de apego, ego y dudas, que reacciona instantáneamente como un espejo perfecto", isCorrect: true },
                            { id: "o2", text: "Tener la mente en blanco por quedarse dormido", isCorrect: false },
                            { id: "o3", text: "No saber el nombre de las técnicas", isCorrect: false },
                            { id: "o4", text: "Pelear con rabia descontrolada", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Mushin es el estado de presencia pura y fluidez sin interferencia del ego.",
                        hint: "Mente libre de apego y ego que reacciona como un espejo.",
                        references: [
                            {
                                title: "Zen y Artes Marciales",
                                author: "Maestro Taisen Deshimaru",
                                year: 1982,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 2: Mushin: La Mente Vacía sin Ego",
                                note: "Define el estado de Mushin (mente sin mente) como la serenidad libre de miedo, cálculo o apego, donde la técnica responde de forma pura e instantánea.",
                            },
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Principio 18: La mente debe ser libre como el agua",
                                note: "El maestro compara la mente marcial con la superficie cristalina de un lago que refleja la luna sin detenerla.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-cuerpo-dan-7",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Neurobiología del estado de Flow: ondas Alfa/Theta y reflejos subcorticales",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 140,
                theory: {
                    title: "Neurofisiología de la Percepción Marcial",
                    subtitle: "Desactivación de la corteza prefrontal y procesamiento en ganglios basales",
                    quote: "Cuando el cerebro consciente calla, el cuerpo actúa a la velocidad de la luz.",
                    content: [
                        "La neurociencia moderna ha demostrado que el tiempo de reacción consciente (corteza prefrontal) ronda los 250 a 300 milisegundos: demasiado lento para frenar un puño veloz.",
                        "En maestros de alto grado, los patrones técnicos se han grabado en los ganglios basales y cerebelo, activando respuestas subcorticales en menos de 80 milisegundos.",
                        "Durante este 'estado de Flow', el cerebro emite ondas Alfa y Theta, dilatando la percepción subjetiva del tiempo: el oponente parece moverse en cámara lenta."
                    ],
                    references: [
                        "Csikszentmihalyi, Mihaly (1997). Fluir (Flow): Una Psicología de la Felicidad y el Rendimiento Óptimo. Editorial Kairós."
                    ]
                },
                questions: [
                    {
                        id: "q-neuro-dan-7",
                        type: "multiple_choice",
                        prompt: "¿Por qué en maestros avanzados el tiempo de respuesta marcial es tres veces más rápido que en novatos?",
                        options: [
                            { id: "o1", text: "Porque las técnicas se ejecutan desde los ganglios basales y cerebelo sin filtro consciente previo", isCorrect: true },
                            { id: "o2", text: "Porque tienen ojos más grandes", isCorrect: false },
                            { id: "o3", text: "Porque la sangre circula más despacio", isCorrect: false },
                            { id: "o4", text: "Porque adivinan el futuro con magia", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La automatización motora subcortical bypassa la corteza prefrontal reduciendo el tiempo de latencia.",
                        hint: "Procesamiento subcortical en ganglios basales y cerebelo.",
                        references: [
                            {
                                title: "Karate Dinámico: Biomecánica del Movimiento y Estabilidad",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 4: La Automatización Neuromotora del Karateka Avanzado",
                                note: "Demuestra que los grandes maestros responden en milisegundos porque sus reflejos están automatizados en circuitos medulares y subcorticales.",
                            },
                            {
                                title: "Neurofisiología y Tiempo de Reacción en el Budo",
                                author: "Dr. Juan Carlos Domínguez",
                                year: 2012,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 2: Vías Rápidas Tálamo-Amigdalares en la Anticipación",
                                note: "Estudio sobre cómo décadas de Kata y Kumite suprimen el retardo del procesamiento cortical consciente.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kihon-dan-7",
                number: 3,
                title: "Kihon",
                subtitle: "Kihon de absorción: vencer sin chocar y redirección de la intención",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 140,
                theory: {
                    title: "El Poder de la Suavidad Absoluta (Ju no Ri)",
                    subtitle: "Ceder para vencer: el principio del sauce ante la nieve pesada",
                    quote: "El roble rígido se quiebra bajo el peso de la nieve; el sauce flexible se inclina, deja caer la nieve y vuelve erguido al cielo.",
                    content: [
                        "En Nanadan, la fuerza muscular ya no es el motor de la técnica.",
                        "El maestro absorbe la fuerza del agresor conectando con su vector de avance, guiando su inercia hacia el vacío.",
                        "El oponente siente que golpea el aire o una superficie de agua en movimiento, perdiendo el equilibrio sin recibir un solo bloqueo brusco."
                    ],
                    references: [
                        "Miyagi, Chojun (1936). Bosquejo Histórico del Karate-Do de Okinawa. Editorial Alas."
                    ]
                },
                questions: [
                    {
                        id: "q-ju-1",
                        type: "multiple_choice",
                        prompt: "¿Qué ilustra la parábola clásica del sauce y el roble ante la nieve en el Budo?",
                        options: [
                            { id: "o1", text: "Que la flexibilidad inteligente cede para vencer, mientras que la rigidez ciega se quiebra", isCorrect: true },
                            { id: "o2", text: "Que en invierno no se debe entrenar Karate", isCorrect: false },
                            { id: "o3", text: "Que los robles son mejores para hacer bates", isCorrect: false },
                            { id: "o4", text: "Que los árboles sienten frío", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La adaptabilidad flexible es el núcleo del principio Ju.",
                        hint: "La flexibilidad inteligente cede para vencer.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 10: La Sabiduría del Sauce y el Roble",
                                note: "Narra la clásica parábola donde el roble rígido se quiebra ante el peso de la nieve, mientras el sauce flexible se inclina, deja caer la carga y se yergue triunfante.",
                            },
                            {
                                title: "El Tao del Budo: La Vía Suave y Firme",
                                author: "Sensei Salvador Herráiz (7° Dan)",
                                year: 2008,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 4: El Principio Ju en el Karate Tradicional",
                                note: "Explicación de cómo ceder ante la fuerza del agresor para redirigirla y derrotarlo con su propio impulso.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-dan-7",
                number: 4,
                title: "Kata",
                subtitle: "Meikyo (明鏡): El espejo limpio, triángulo espiritual y defensa de Bo",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 150,
                theory: {
                    title: "Meikyo (明鏡): El Espejo Limpio del Alma",
                    subtitle: "33 movimientos de pureza de línea y serenidad mística",
                    quote: "Limpia el polvo del espejo de tu corazón para que refleje la verdad del universo sin distorsión.",
                    content: [
                        "Meikyo (antiguamente Rohai de Tomari-Te) significa 'Espejo Brillante o Pulido'.",
                        "Comienza con las dos palmas juntas formando un espejo frente al rostro, un gesto ritual que simboliza contemplar las propias debilidades y purificar la mente de vanidad.",
                        "Contiene el salto 'Sankaku-Tobi' (salto triangular) para esquivar una lanza o bastón barriendo en el suelo, y desarmes de Bo atrapando el arma entre los antebrazos.",
                        "Posee 33 movimientos con un único Kiai majestuoso en el paso final."
                    ],
                    references: [
                        "Kanazawa, Hirokazu (2006). Karate Kata Completo: Colección Oficial Shotokan. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-meikyo-1",
                        type: "multiple_choice",
                        prompt: "¿Qué simboliza el gesto inicial de colocar las palmas frente al rostro en Meikyo?",
                        options: [
                            { id: "o1", text: "Mirarse en el espejo limpio del alma con humildad, purificando la mente de ego y rencor", isCorrect: true },
                            { id: "o2", text: "Peinarse antes de competir", isCorrect: false },
                            { id: "o3", text: "Ocultar la identidad para no ser reconocido", isCorrect: false },
                            { id: "o4", text: "Pedir comida en el templo", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Meikyo une el autoconocimiento reflexivo con la destreza marcial pura.",
                        hint: "Mirarse en el espejo limpio del alma con humildad.",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 11): Gojushiho Dai, Gojushiho Sho, Meikyo",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1995,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 3: Kata Meikyo: El Espejo Limpio del Alma",
                                note: "El gesto inicial de alzar las manos frente al rostro simboliza contemplar el propio reflejo en el espejo pulido, limpiándolo de ego, vanidad y rencor.",
                            },
                            {
                                title: "Karate Kata Completo (Vol. 2): Colección Oficial Shotokan",
                                author: "Maestro Hirokazu Kanazawa (SKIF)",
                                year: 2008,
                                editorial: "Editorial Tutor",
                                chapter: "Katas Superiores: Meikyo y Rohai",
                                note: "Estudio del linaje de Tomari-Te preservado en Meikyo y sus técnicas evasivas con saltos de finta.",
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ── 8° DAN — HACHIDAN ⚫⚫⚫⚫⚫⚫⚫⚫ ──────────────────────────────
    {
        id: "unit-dan-8",
        title: "La Calma del Océano",
        description: "Hachidan: Wabi-Sabi y Yugen en el Budo, longevidad articular y el kata Unsu.",
        path: "tradicional",
        beltId: "dan-8",
        levels: [
            {
                id: "level-wabi-sabi",
                number: 1,
                title: "Historia",
                subtitle: "Wabi-Sabi y Yugen: La estética de la sobriedad, el tiempo y la imperfección",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 145,
                theory: {
                    title: "La Estética Zen del Budo: Wabi-Sabi y Yugen",
                    subtitle: "La belleza de la sobriedad austera y la profundidad insondable",
                    quote: "La taza de té rota y unida con oro (Kintsugi) es más valiosa que la taza intacta; las heridas templadas forjan al gran maestro.",
                    content: [
                        "Wabi-Sabi enseña a hallar la belleza en lo sobrio, lo simple y lo marcado por el paso del tiempo. En Karate, un cinturón desgastado por décadas de sudor es infinitamente más digno que un cinturón nuevo reluciente.",
                        "Yugen (幽玄) evoca la gracia sutil y el misterio profundo: sugerir en lugar de ostentar, como la silueta de un barco que se pierde en la bruma marina.",
                        "El maestro de 8° Dan no realiza aspavientos ni movimientos teatrales; su técnica es parca, austera y silenciosa, pero posee una hondura inconmensurable."
                    ],
                    references: [
                        "Suzuki, Daisetsu Teitaro (1996). El Zen y la Cultura Japonesa. Editorial Paidós."
                    ]
                },
                questions: [
                    {
                        id: "q-wabisabi-1",
                        type: "multiple_choice",
                        prompt: "¿Qué virtud estética y espiritual encarna el concepto japonés 'Wabi-Sabi' en el Karate?",
                        options: [
                            { id: "o1", text: "Apreciar la sobriedad austera, la humildad y la nobleza del paso del tiempo sin ostentaciones", isCorrect: true },
                            { id: "o2", text: "Comprar siempre el uniforme más caro y brillante", isCorrect: false },
                            { id: "o3", text: "Buscar la fama en redes sociales", isCorrect: false },
                            { id: "o4", text: "Entrenar con música estridente", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Wabi-Sabi es la renuncia a la vanidad exterior en favor de la pureza interior.",
                        hint: "Sobriedad austera, humildad y nobleza del tiempo.",
                        references: [
                            {
                                title: "El Corazón del Karate-Do",
                                author: "Maestro Shigeru Egami",
                                year: 1988,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 4: La Belleza de la Simplicidad Austera",
                                note: "Explica el Wabi-Sabi en el Karate maduro: la renuncia a la exhibición acrobática para abrazar la sobriedad, la sencillez y la naturalidad imperfecta.",
                            },
                            {
                                title: "Estética y Filosofía del Budo Japonés",
                                author: "Maestro Taisen Deshimaru",
                                year: 1985,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 3: Wabi-Sabi: La Elegancia de la Vejez y la Experiencia",
                                note: "Reflexiones sobre el karategi desgastado y la mirada serena del maestro veterano como manifestación de la estética Zen.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-cuerpo-dan-8",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Longevidad en el Budo: conservación de columna, fascia y salud celular",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 145,
                theory: {
                    title: "La Red Fascial y la Longevidad del Karateka",
                    subtitle: "Miofascia continua, elasticidad colágena y salud ósea en la madurez",
                    quote: "Los músculos envejecen con los años; la fascia elástica se mantiene joven y reactiva para toda la vida.",
                    content: [
                        "El sistema fascial es una red viscoelástica ininterrumpida que envuelve cada fibra muscular, órgano y hueso del cuerpo.",
                        "En karatekas longevos de 60, 70 u 80 años, la fuerza ya no proviene del volumen de masa muscular, sino del rebote elástico fascial (energía de retroceso elástico del colágeno).",
                        "Movimientos armónicos, hidratación profunda y posturas alineadas permiten a maestros octogenarios golpear con la misma inercia de su juventud sin fatigar su corazón."
                    ],
                    references: [
                        "Schleip, Robert (2013). Fascia: La Red Tensional del Cuerpo Humano. Editorial Paidotribo."
                    ]
                },
                questions: [
                    {
                        id: "q-fascia-1",
                        type: "multiple_choice",
                        prompt: "¿Por qué los maestros de Karate de edad avanzada conservan una potencia demoledora sin gran masa muscular?",
                        options: [
                            { id: "o1", text: "Por el dominio del rebote elástico de la red fascial y la perfecta alineación de la cadena esquelética", isCorrect: true },
                            { id: "o2", text: "Porque consumen sustancias artificiales", isCorrect: false },
                            { id: "o3", text: "Es un mito y no tienen potencia", isCorrect: false },
                            { id: "o4", text: "Porque los oponentes se dejan ganar por respeto", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El almacenamiento elástico de la fascia sustituye la contracción muscular pura.",
                        hint: "Rebote elástico de la red fascial y alineación esquelética.",
                        references: [
                            {
                                title: "Anatomía de las Cadenas Miofasciales en Artes Marciales",
                                author: "Dr. Juan Carlos Domínguez",
                                year: 2012,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 6: La Elasticidad Fascial en Maestros de Edad Avanzada",
                                note: "Demuestra científicamente que los maestros veteranos compensan la sarcopenia muscular mediante el retorno elástico de las redes de colágeno fascial.",
                            },
                            {
                                title: "Karate Dinámico: Biomecánica del Movimiento y Estabilidad",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 2: El Uso de los Tendones y la Torsión Muscular Profunda",
                                note: "Análisis de la economía motriz en maestros mayores que generan máxima fuerza sin recurrir a la hipertrofia muscular.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kihon-dan-8",
                number: 3,
                title: "Kihon",
                subtitle: "Kihon invisible: micro-ajustes y disuasión kinestésica",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 145,
                theory: {
                    title: "El Kihon Invisible: La Técnica sin Movimiento",
                    subtitle: "Control de la intención y neutralización del adversario antes del contacto",
                    quote: "El maestro más temible es aquel cuyo cuerpo parece no moverse, pero cuya presencia ocupa todo el espacio.",
                    content: [
                        "A nivel Hachidan, los fundamentos marciales se vuelven microscópicos.",
                        "Un cambio milimétrico en la presión del dedo gordo del pie o una mínima rotación de la clavícula cierran por completo las líneas de penetración del agresor.",
                        "El atacante siente una barrera invisible que le impide dar el paso adelante: es la manifestación física del Kiai interno y la soberanía del espacio."
                    ],
                    references: [
                        "Funakoshi, Gichin (1938). Los Veinte Principios Rectores del Karate. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-kihon-dan-8",
                        type: "multiple_choice",
                        prompt: "¿Qué transmite el 'Kihon invisible' de un maestro de 8° Dan al aproximarse el agresor?",
                        options: [
                            { id: "o1", text: "El cierre milimétrico de todas las líneas de entrada desarticulando la intención agresiva", isCorrect: true },
                            { id: "o2", text: "Miedo a combatir", isCorrect: false },
                            { id: "o3", text: "Una invitación a que lo golpeen", isCorrect: false },
                            { id: "o4", text: "Gritos desesperados", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La ocupación postural del centro disuade la agresión sin necesidad de intercambio violento.",
                        hint: "Cierre milimétrico de todas las líneas de entrada.",
                        references: [
                            {
                                title: "Karate Tradicional: Su Filosofía, Su Historia y Sus Fundamentos",
                                author: "Maestro Kenei Mabuni",
                                year: 2000,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 7: El Kihon Invisible del Gran Maestro",
                                note: "Describe cómo un maestro de 8° Dan transmite fuerza mediante microrotaciones articulares y alineación ósea casi imperceptibles a simple vista.",
                            },
                            {
                                title: "El Corazón del Karate-Do",
                                author: "Maestro Shigeru Egami",
                                year: 1988,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 5: Más Allá de la Forma Externa",
                                note: "Enseña que cuando el ego desaparece, el movimiento se despoja de artificios y se vuelve pura naturalidad biomecánica.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-dan-8",
                number: 4,
                title: "Kata",
                subtitle: "Unsu (雲手): Manos de nube, tempestad, patadas desde el suelo y salto 360°",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 155,
                theory: {
                    title: "Unsu (雲手): Manos de Nube en la Tempestad",
                    subtitle: "El kata cumbre de 48 movimientos que desafía la gravedad",
                    quote: "Como las nubes que se abren ante el rayo y se vuelven a unir en silencio tras la tempestad.",
                    content: [
                        "Unsu es considerado el kata más complejo y espectacular del estilo Shotokan.",
                        "Inicia con manos abiertas como nubes que apartan suavemente los ataques del oponente.",
                        "Incluye patadas circulares desde el suelo tras una caída evasiva (Mawashi-Geri en el suelo) y el legendario salto de 360° en el aire con giro sobre el eje y aterrizaje en Kosa-dachi con bloqueo Juji-Uke.",
                        "Sintetiza la calma etérea y la explosión devastadora de la naturaleza."
                    ],
                    references: [
                        "Kanazawa, Hirokazu (2006). Karate Kata Completo: Colección Oficial Shotokan. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-unsu-1",
                        type: "multiple_choice",
                        prompt: "¿Qué salto acrobático legendario se ejecuta en el clímax del Kata Unsu?",
                        options: [
                            { id: "o1", text: "Un salto acrobático de 360° en el aire cayendo en Kosa-dachi con bloqueo Juji-Uke bajo", isCorrect: true },
                            { id: "o2", text: "Un salto mortal hacia atrás cayendo de pie", isCorrect: false },
                            { id: "o3", text: "Una voltereta en el suelo sin despegarse del tatami", isCorrect: false },
                            { id: "o4", text: "Un salto con los brazos cruzados a la espalda", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El salto de 360° de Unsu supera obstáculos múltiples cayendo listo para el contraataque.",
                        hint: "Salto de 360 grados en el aire cayendo en Kosa-dachi.",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 10): Unsu, Sochin, Nijushiho",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1995,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 1: Kata Unsu: Manos de Nube",
                                note: "Analiza el clímax de Unsu con el salto acrobático con giro de 360° en el aire, esquivando un ataque rasante y cayendo con Mawashi-Geri al suelo.",
                            },
                            {
                                title: "Karate Kata Completo (Vol. 2): Colección Oficial Shotokan",
                                author: "Maestro Hirokazu Kanazawa (SKIF)",
                                year: 2008,
                                editorial: "Editorial Tutor",
                                chapter: "Katas Maestros: Unsu: La Tormenta y la Calma",
                                note: "Guía fotográfica sobre la aceleración del despegue y el control de la respiración en la rotación completa de Unsu.",
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ── 9° DAN — KUDAN ⚫⚫⚫⚫⚫⚫⚫⚫⚫ ──────────────────────────────
    {
        id: "unit-dan-9",
        title: "El Viento Eterno",
        description: "Kudan: La preservación del linaje histórico, el Kiai silencioso y Gojushiho Dai.",
        path: "tradicional",
        beltId: "dan-9",
        levels: [
            {
                id: "level-legado",
                number: 1,
                title: "Historia",
                subtitle: "El Legado del Maestro: Custodiar la llama de Okinawa para el mundo entero",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 150,
                theory: {
                    title: "La Responsabilidad Histórica del Gran Maestro",
                    subtitle: "Kudan: El puente que une a los antepasados con las generaciones venideras",
                    quote: "Los hombres mueren, los estilos cambian; pero la rectitud del Budo debe perdurar como las estrellas.",
                    content: [
                        "El 9° Dan (Kudan) representa la cumbre de la longevidad y el servicio desinteresado al Karate-Do.",
                        "A este nivel, el maestro no pertenece a un solo dojo o escuela; es patrimonio viviente del arte marcial mundial.",
                        "Su misión es custodiar que el Karate conserve su dimensión moral, evitando que se degrade en un simple deporte mercantilista o en un show de violencia.",
                        "Es el mentor supremo que consagra a los nuevos maestros."
                    ],
                    references: [
                        "Funakoshi, Gichin (1975). Karate-Do: Mi Camino de Vida. Editorial Eyras."
                    ]
                },
                questions: [
                    {
                        id: "q-legado-1",
                        type: "multiple_choice",
                        prompt: "¿Cuál es el deber supremo del maestro en el grado Kudan (9° Dan)?",
                        options: [
                            { id: "o1", text: "Preservar los valores morales y la autenticidad espiritual del Karate para las futuras generaciones", isCorrect: true },
                            { id: "o2", text: "Retar a duelo a otros estilos", isCorrect: false },
                            { id: "o3", text: "Eliminar el saludo de reverencia", isCorrect: false },
                            { id: "o4", text: "Prohibir la práctica a las mujeres", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Kudan es el custodio de la esencia ética e histórica del Budo.",
                        hint: "Preservar los valores morales y la autenticidad espiritual.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 11: La Custodia del Linaje y el Legado Marcial",
                                note: "El deber sagrado en el 9° Dan (Kudan) es preservar la pureza ética del Budo, formar sucesores íntegros y evitar la degradación del arte.",
                            },
                            {
                                title: "Karate Tradicional: Su Filosofía, Su Historia y Sus Fundamentos",
                                author: "Maestro Kenei Mabuni",
                                year: 2000,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 8: La Transmisión de Maestro a Discípulo",
                                note: "Reflexiones sobre la humildad del maestro veterano cuya mayor recompensa es ver florecer a sus alumnos con sabiduría y dignidad.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-cuerpo-dan-9",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Unidad biopsicosocial y sincronía respiratoria celular del karateka sabio",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 150,
                theory: {
                    title: "La Respiración Celular y la Calma Mental Extrema",
                    subtitle: "Equilibrio neuroendocrino en la senectud activa del guerrero",
                    quote: "El aliento del maestro no agita el polvo del suelo; es como la brisa que mece los pinos centenarios.",
                    content: [
                        "En el nonagenario o anciano practicante, el sistema nervioso autónomo alcanza un equilibrio homeostático sublime.",
                        "La respiración se vuelve casi imperceptible en la superficie, mientras que a nivel celular la oxigenación mitocondrial opera con eficiencia óptima.",
                        "La presión arterial y el pulso permanecen serenos ante cualquier provocación externa: el miedo ha sido erradicado del sistema nervioso central."
                    ],
                    references: [
                        "Benson, Herbert (1986). Respuesta de Relajación y Control del Estrés. Editorial Grijalbo."
                    ]
                },
                questions: [
                    {
                        id: "q-respi-dan-9",
                        type: "multiple_choice",
                        prompt: "¿Qué estado fisiológico manifiesta un gran maestro veterano ante una amenaza agresiva?",
                        options: [
                            { id: "o1", text: "Frecuencia cardíaca serena, relajación neuromuscular total y ausencia completa de taquicardia por pánico", isCorrect: true },
                            { id: "o2", text: "Gritos incontrolados y temblores musculares", isCorrect: false },
                            { id: "o3", text: "Pérdida de la memoria", isCorrect: false },
                            { id: "o4", text: "Ataque de ira desbordada", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La serenidad fisiológica es fruto de más de 60 años de forja marcial continua.",
                        hint: "Frecuencia cardíaca serena y ausencia de taquicardia por pánico.",
                        references: [
                            {
                                title: "Zen y Artes Marciales",
                                author: "Maestro Taisen Deshimaru",
                                year: 1982,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 5: Fudoshin: La Mente Inamovible ante la Muerte",
                                note: "Explica cómo la respiración imperceptible y la calma cardiovascular reflejan el dominio supremo sobre el miedo y la agitación mental.",
                            },
                            {
                                title: "El Libro de los Cinco Anillos",
                                author: "Miyamoto Musashi (Traducción comentada para Budo)",
                                year: 1989,
                                editorial: "Editorial Miraguano",
                                chapter: "El Libro del Vacío: La Serenidad Imperturbable",
                                note: "En el nivel más alto de maestría, el pulso y la respiración permanecen serenos y constantes en medio del caos del combate.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kihon-dan-9",
                number: 3,
                title: "Kihon",
                subtitle: "Kiai silencioso: disuasión pura mediante la presencia y el espíritu (Kokoro)",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 150,
                theory: {
                    title: "Kokoro (心) y el Kiai Insonoro",
                    subtitle: "Vencer sin combatir: la máxima cumbre de Sun Tzu y Funakoshi",
                    quote: "La victoria suprema es doblegar la voluntad del agresor sin haber desenvainado jamás la espada.",
                    content: [
                        "El Kiai vocal audible es para el estudiante que necesita coordinar diafragma y foco muscular.",
                        "En Kudan, el Kiai se vuelve puramente mental y espiritual: una emanación de presencia imperturbable que desarma la intención violenta del adversario antes de que ocurra el primer movimiento.",
                        "El agresor comprende intuitivamente que cualquier intento de violencia chocará contra un abismo de serenidad invencible."
                    ],
                    references: [
                        "Funakoshi, Gichin (1938). Los Veinte Principios Rectores del Karate. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-kiai-silencioso-1",
                        type: "multiple_choice",
                        prompt: "¿Qué proclama el principio supremo de Sun Tzu y Funakoshi sobre la victoria perfecta?",
                        options: [
                            { id: "o1", text: "Vencer sin combatir: neutralizar la agresión mediante la presencia ética y la serenidad espiritual", isCorrect: true },
                            { id: "o2", text: "Destruir al adversario y a su familia", isCorrect: false },
                            { id: "o3", text: "Cobrar rescates en monedas de oro", isCorrect: false },
                            { id: "o4", text: "Hacer trampas para asegurar el resultado", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "'Vencer sin pelear es la mayor de las victorias' (Sun Tzu / Funakoshi).",
                        hint: "Vencer sin combatir neutralizando la agresión mediante la serenidad.",
                        references: [
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Principio 2: Karate ni Sente Nashi: La Victoria sin Lucha",
                                note: "Proclama que la victoria suprema es vencer sin desenvainar la espada ni lanzar un solo golpe, disolviendo el conflicto mediante la presencia serena.",
                            },
                            {
                                title: "El Arte de la Guerra",
                                author: "Sun Tzu (Comentarios para las Artes Marciales Tradicionales)",
                                year: 1993,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 3: Estrategia Ofensiva: Vencer sin Combatir",
                                note: "El principio cumbre de la estrategia militar y marcial: quebrar la resistencia del adversario sin entablar batalla.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-dan-9",
                number: 4,
                title: "Kata",
                subtitle: "Gojushiho Dai (五十四歩大): 54 pasos de sutileza de fénix y maestría eterna",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 160,
                theory: {
                    title: "Gojushiho Dai (五十四歩大): Los 54 Pasos del Fénix",
                    subtitle: "El kata maestro de Shuri-Te más extenso y profundo",
                    quote: "Cincuenta y cuatro pasos como el fénix que vuela sobre los bosques de bambú, eterno y majestuoso.",
                    content: [
                        "Gojushiho Dai ('54 pasos') es una de las obras cumbre transmitidas por Sokon Matsumura y Anko Itosu.",
                        "Emula los movimientos del pájaro carpintero o fénix marcial: golpes con el nudillo del dedo medio (Keiko-Ken e Ippon-Ken), desvíos circulares sutiles y ataques punzantes a ojos y garganta.",
                        "Exige una respiración rítmica perfecta y un dominio sublime del centro Tanden a lo largo de sus 67 técnicas.",
                        "Representa la síntesis definitiva de la elegancia cortesana de Shuri con la letalidad de la Grulla Blanca china."
                    ],
                    references: [
                        "Kanazawa, Hirokazu (2006). Karate Kata Completo: Colección Oficial Shotokan. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-gojushiho-1",
                        type: "multiple_choice",
                        prompt: "¿Qué ave mítica y qué tipo de golpes con nudillos singulares caracterizan a Gojushiho Dai?",
                        options: [
                            { id: "o1", text: "El fénix / pájaro carpintero con impactos de Keiko-Ken e Ippon-Ken a puntos blandos", isCorrect: true },
                            { id: "o2", text: "El vuelo torpe de un pato", isCorrect: false },
                            { id: "o3", text: "El salto de una rana en el agua", isCorrect: false },
                            { id: "o4", text: "Un murciélago colgado", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Gojushiho utiliza la punta de los dedos y nudillos individuales como el pico penetrante del fénix.",
                        hint: "El fénix con impactos de Keiko-Ken e Ippon-Ken.",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 11): Gojushiho Dai, Gojushiho Sho, Meikyo",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1995,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 1: Kata Gojushiho: Los Cincuenta y Cuatro Pasos",
                                note: "Detalla los ataques precisos con la punta del dedo (Ippon-Nukite) y el nudillo del pulgar (Keiko-Ken) emulando los picotazos rápidos del pájaro carpintero.",
                            },
                            {
                                title: "Karate Kata Completo (Vol. 2): Colección Oficial Shotokan",
                                author: "Maestro Hirokazu Kanazawa (SKIF)",
                                year: 2008,
                                editorial: "Editorial Tutor",
                                chapter: "Katas Superiores: Gojushiho Dai y Sho",
                                note: "Comparativa técnica entre las dos versiones de Gojushiho y la precisión milimétrica requerida en los impactos a puntos vitales.",
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ── 10° DAN — JUDAN 👑 ──────────────────────────────
    {
        id: "unit-dan-10",
        title: "La Corona del Cielo",
        description: "Judan: La culminación sagrada, Shin-Gi-Tai unificado y el kata Wankan.",
        path: "tradicional",
        beltId: "dan-10",
        levels: [
            {
                id: "level-historia-dan-10",
                number: 1,
                title: "Historia",
                subtitle: "Los Patriarcas Fundadores: La corona histórica del 10° Dan",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 160,
                theory: {
                    title: "La Corona de los Grandes Maestros",
                    subtitle: "Judan (十段): La cima de la pirámide marcial tradicional",
                    quote: "El círculo está completo: el 10° Dan vuelve al primer paso del 10° Kyu con la inocencia de un niño y la sabiduría de un sabio.",
                    content: [
                        "El 10° Dan (Judan) es el grado supremo en las artes marciales de Okinawa y Japón. Reservado únicamente a patriarcas que dedicaron su vida entera a elevar el espíritu humano a través del Karate.",
                        "Figuras legendarias como Chojun Miyagi, Choshin Chibana, Hironori Otsuka o Masatoshi Nakayama personificaron esta dignidad.",
                        "En este umbral sagrado, no existen más títulos ni rangos terrenales: el maestro es la tradición misma hecha carne viva."
                    ],
                    references: [
                        "Bishop, Mark (2004). Karate de Okinawa: Maestros, Estilos y Métodos Secretos. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-judan-hist-1",
                        type: "multiple_choice",
                        prompt: "¿Qué condición humana y ética distingue a los portadores históricos del grado 10° Dan (Judan)?",
                        options: [
                            { id: "o1", text: "Una vida entera consagrada a la paz, la rectitud ética y el perfeccionamiento moral de la humanidad", isCorrect: true },
                            { id: "o2", text: "Tener mucho dinero en el banco", isCorrect: false },
                            { id: "o3", text: "Haber vencido a mil personas en peleas callejeras", isCorrect: false },
                            { id: "o4", text: "Ser el presidente de un partido político", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El 10° Dan trasciende lo técnico: es la consagración moral y espiritual de toda una vida.",
                        hint: "Una vida entera consagrada a la paz y la rectitud ética.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 12: La Humildad como Corona del Karateka",
                                note: "Destaca que los portadores de 10° Dan destacan por su profunda sencillez, servicio desinteresado al prójimo y ausencia de arrogancia.",
                            },
                            {
                                title: "Karate Tradicional: Su Filosofía, Su Historia y Sus Fundamentos",
                                author: "Maestro Kenei Mabuni",
                                year: 2000,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 9: El Retorno al Origen del Maestro Anciano",
                                note: "El verdadero maestro de 10° Dan barre el dojo junto a los cinturones blancos y vive con la sobriedad del corazón de principiante.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-shin-gi-tai",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Shin-Gi-Tai (心技体): La trinidad indivisible de mente, técnica y cuerpo",
                tag: "Cuerpo Humano & Biomecánica",
                icon: "💪",
                color: "gold",
                xpReward: 160,
                theory: {
                    title: "Shin-Gi-Tai (心技体): La Trinidad Sagrada del Budo",
                    subtitle: "Mente (Shin), Técnica (Gi) y Cuerpo (Tai) fundidos en unidad indivisible",
                    quote: "El cuerpo sin mente es una bestia ciega; la mente sin técnica es impotente; unidos los tres en armonía, el espíritu trasciende la muerte.",
                    content: [
                        "SHIN (心): El corazón, la mente despierta, el coraje moral, la compasión y la devoción hacia la justicia.",
                        "GI (技): La técnica milimétrica, la precisión anatómica, el ritmo y el refinamiento de cada bloqueo y golpe.",
                        "TAI (体): El cuerpo físico, la salud, la postura sólida, la respiración profunda y el enraizamiento.",
                        "En el 10° Dan, los tres elementos dejan de ser tres cosas separadas: mente, técnica y cuerpo son uno solo."
                    ],
                    references: [
                        "Funakoshi, Gichin (1935). Karate-Do Kyohan: El Texto Maestro. Editorial Eyras."
                    ]
                },
                questions: [
                    {
                        id: "q-shingitai-1",
                        type: "multiple_choice",
                        prompt: "¿Cuáles son los tres pilares supremos que componen la doctrina 'Shin-Gi-Tai'?",
                        options: [
                            { id: "o1", text: "SHIN (Mente/Espíritu), GI (Técnica/Habilidad) y TAI (Cuerpo/Salud)", isCorrect: true },
                            { id: "o2", text: "Fuerza, Dinero y Fama", isCorrect: false },
                            { id: "o3", text: "Patada, Puñetazo y Bloqueo", isCorrect: false },
                            { id: "o4", text: "Ataque, Defensa y Huida", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Shin-Gi-Tai es la brújula dorada que guía al practicante desde el cinturón blanco hasta la eternidad.",
                        hint: "Mente, Técnica y Cuerpo.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 2: La Trinidad de Shin, Gi y Tai",
                                note: "Explica los tres pilares indispensables: Shin (mente/espíritu noble), Gi (técnica biomecánicamente depurada) y Tai (cuerpo acondicionado y resistente).",
                            },
                            {
                                title: "El Budo Japonés: Shin-Gi-Tai y la Vía del Guerrero",
                                author: "Sensei Salvador Herráiz (7° Dan)",
                                year: 2007,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 1: El Equilibrio Triangular del Karateka",
                                note: "Tratado filosófico sobre la armonía indivisible entre mente, técnica y cuerpo en la consagración del grado marcial supremo.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kihon-dan-10",
                number: 3,
                title: "Kihon",
                subtitle: "El círculo eterno: el retorno al primer Oi-Tsuki de cinturón blanco",
                tag: "Kihon & Fundamentos",
                icon: "👊",
                color: "gold",
                xpReward: 160,
                theory: {
                    title: "El Círculo Eterno del Kihon",
                    subtitle: "La técnica perfecta que vuelve a ser la más simple y pura",
                    quote: "Antes de entrenar, una montaña es una montaña; al entrenar, la montaña deja de ser una montaña; tras la iluminación, la montaña vuelve a ser una montaña.",
                    content: [
                        "El practicante novel hace un Oi-Tsuki torpe sin entender la biomecánica.",
                        "El estudiante avanzado hace un Oi-Tsuki cargado de músculos, tensión y orgullo.",
                        "El 10° Dan hace el mismo Oi-Tsuki del principiante, pero en él habita la sabiduría del universo: un golpe sin ego, sin esfuerzo visible, puro, limpio, directo y sereno como el rayo de sol.",
                        "El círculo del Karate-Do se ha completado: el final es el principio."
                    ],
                    references: [
                        "Suzuki, Shunryu (1994). Mente Zen, Mente de Principiante. Editorial Trotta."
                    ]
                },
                questions: [
                    {
                        id: "q-circulo-1",
                        type: "multiple_choice",
                        prompt: "¿Qué paradoja zen describe la culminación técnica del 10° Dan Judan?",
                        options: [
                            { id: "o1", text: "Retornar al golpe más básico con total sencillez, pureza y ausencia absoluta de ego", isCorrect: true },
                            { id: "o2", text: "Aprender mil técnicas secretas que nadie más conoce", isCorrect: false },
                            { id: "o3", text: "Levantar pesas gigantescas en el dojo", isCorrect: false },
                            { id: "o4", text: "Negarse a saludar a los demás", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "La cima de la complejidad es la sencillez absoluta.",
                        hint: "Retornar al golpe más básico con total sencillez y pureza.",
                        references: [
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo IX: El Círculo Ensō y el Vacío Espiritual",
                                note: "La paradoja Zen del 10° Dan: al culminar la maestría técnica, el maestro regresa al inicio y viste de nuevo el cinturón blanco disuelto en naturalidad.",
                            },
                            {
                                title: "Zen y Artes Marciales",
                                author: "Maestro Taisen Deshimaru",
                                year: 1982,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 6: El Círculo Ensō: El Principio es el Fin",
                                note: "Explicación del ideograma Zen del círculo abierto: la técnica suprema es no tener técnica, actuando en perfecta sintonía con la vida.",
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-dan-10",
                number: 4,
                title: "Kata",
                subtitle: "Wankan (王冠): La Corona del Rey, el kata más sutil del Karate tradicional",
                tag: "Kata & Bunkai",
                icon: "📜",
                color: "gold",
                xpReward: 170,
                theory: {
                    title: "Wankan (王冠): La Corona del Rey",
                    subtitle: "El kata más breve y austero: 24 movimientos de nobleza y serenidad",
                    quote: "La verdadera corona del rey no está hecha de oro ni joyas, sino de rectitud, compasión y paz interior.",
                    content: [
                        "Wankan (conocido también como Matsukaze o Shiofu en Tomari-Te) es el kata más breve de todo el repertorio tradicional.",
                        "Carece de saltos espectaculares o florituras; su belleza reside en la pureza de sus líneas, sus desvíos suaves y su único Kiai majestuoso al culminar en un contraataque directo.",
                        "Es la corona simbólica que sella el camino del Karate-Do: la victoria del espíritu sobre la violencia y el triunfo de la paz."
                    ],
                    references: [
                        "Kanazawa, Hirokazu (2006). Karate Kata Completo: Colección Oficial Shotokan. Editorial Tutor."
                    ]
                },
                questions: [
                    {
                        id: "q-wankan-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa el nombre del Kata 'Wankan' y qué simboliza en la culminación del Budo?",
                        options: [
                            { id: "o1", text: "'La Corona del Rey': la pureza sobria del espíritu que corona una vida entera de rectitud y paz", isCorrect: true },
                            { id: "o2", text: "'El casco de guerra de hierro'", isCorrect: false },
                            { id: "o3", text: "'El bastón del campesino'", isCorrect: false },
                            { id: "o4", text: "'El barco pirata'", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Wankan sella el círculo del Karate: la corona de la nobleza espiritual y la armonía suprema.",
                        hint: "La Corona del Rey.",
                        references: [
                            {
                                title: "El Mejor Karate (Vol. 11): Gojushiho Dai, Gojushiho Sho, Meikyo",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1995,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 4: Kata Wankan: La Corona del Rey",
                                note: "Kata de una sola secuencia climática y un único Kiai que simboliza la elegancia sobria, la brevedad aristocrática y la corona de la madurez marcial.",
                            },
                            {
                                title: "Karate Kata Completo (Vol. 2): Colección Oficial Shotokan",
                                author: "Maestro Hirokazu Kanazawa (SKIF)",
                                year: 2008,
                                editorial: "Editorial Tutor",
                                chapter: "Katas Maestros: Wankan",
                                note: "Estudio del ritmo regio y continuo en Wankan, donde cada movimiento encarna la serenidad y la nobleza del Reino de Ryukyu.",
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
