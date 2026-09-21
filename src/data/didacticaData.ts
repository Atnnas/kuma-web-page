import { Unit, BeltRankId } from "@/types/didactica";

export const DIDACTIC_UNITS: Unit[] = [
    // ==========================================
    // CAMINO MARCIAL TRADICIONAL 🥋 (20 CINTURONES: 10 KYU + 10 DAN)
    // ==========================================

    // ── 10° KYU — CINTURÓN BLANCO ⚪ ──────────────────────────────
    {
        id: "unit-kyu-10",
        title: "El Despertar del Espíritu",
        description: "Descubre el origen del Karategi, la etiqueta del Dojo y la filosofía del vacío.",
        path: "tradicional",
        beltId: "kyu-10",
        levels: [
            {
                id: "level-karategi",
                number: 1,
                title: "Historia del Karate-Do",
                subtitle: "Origen ancestral, el secreto del Bubishi y la forja del Budo",
                tag: "Historia & Filosofía",
                icon: "🥋",
                color: "gold",
                xpReward: 50,
                theory: {
                    title: "Historia y Filosofía del Karate-Do",
                    subtitle: "El Camino de la Mano Vacía, el Secreto del Bubishi y el Legado Ancestral de Okinawa",
                    quote: "El Karate no consiste en herir o vencer a otros; consiste en vencer las propias debilidades, dominar el ego y forjar un espíritu noble de rectitud, serenidad y paz. — Maestro Gichin Funakoshi (Padre del Karate Moderno)",
                    images: [
                        {
                            src: "/images/didactic/bubishi_ancient_scroll.jpg",
                            alt: "El Manuscrito Sagrado Bubishi (武備志)",
                            caption: "Fig 1. Tratado canónico secreto Bubishi (武備志): compendio histórico de las 48 técnicas de Grulla Blanca y puntos vitales traídos de Fujian a Okinawa."
                        },
                        {
                            src: "/images/didactic/okinawa_masters_history.jpg",
                            alt: "Maestros de Okinawa entrenando en la clandestinidad",
                            caption: "Fig 2. Práctica nocturna clandestina en las murallas de Shuri tras los edictos de desarme forzoso de 1609 bajo la invasión del clan Satsuma."
                        }
                    ],
                    content: [
                        "1. El Nacimiento en el Reino Insular de Ryukyu (Okinawa): El Karate-Do (空手道) no tuvo su cuna en el Japón continental, sino en el antiguo Reino de Ryukyu —el archipiélago subtropical hoy conocido como Okinawa—. Durante siglos, Ryukyu floreció como un puente marítimo pacífico entre China, Japón y el sudeste asiático. En este crisol cultural confluieron el 'Te' (手, arte de combate nativo okinawense caracterizado por la dureza física) y los métodos de 'Quan-fa' (boxeo chino del sur de la provincia de Fujian), enriquecidos de manera decisiva a partir de 1392 con la llegada a la aldea de Kumemura de las legendarias 'Treinta y Seis Familias Chinas', artesanos y eruditos enviados por el emperador Ming.",
                        "2. La Invasión Satsuma de 1609 y la Forja Clandestina: En 1609, los samuráis del poderoso clan japonés Satsuma invadieron y subyugaron el Reino de Ryukyu. Los invasores impusieron una política despiadada de desarme absoluto: poseer espadas, lanzas o cualquier metal cortante era castigado sumariamente con la muerte. En esta atmósfera de extrema indefensión, los maestros okinawenses llevaron el entrenamiento a la más rigurosa clandestinidad nocturna. A puerta cerrada y bajo la luna, los practicantes forjaron sus propios cuerpos como armas vivientes mediante el makiwara (poste de impacto envuelto en cuerda de paja), al tiempo que desarrollaban el Kobudo utilizando herramientas cotidianas agrícolas y pesqueras (como el Bo, Tonfa, Sai, Kama y Nunchaku).",
                        "3. El Bubishi (武備志): La Biblia Secreta del Karate: El testimonio documental más trascendental que sobrevivió a generaciones de maestros es el Bubishi (武備志 - 'Tratado de Preparación Marcial'). Este texto fundacional, copiado y transmitido a mano en tinta china de maestro a discípulo en secreto absoluto, recopila 48 posturas combativas, la biomecánica del estilo de la Grulla Blanca, diagramas de meridianos de presión vital (Kyusho-Jitsu) y fórmulas de medicina herbolaria tradicional para curar traumatismos marciales. Maestros de la talla de Kanryo Higaonna, Chojun Miyagi, Anko Itosu y Gichin Funakoshi atesoraron copias de este venerado manual.",
                        "4. Las Tres Vertientes Originales de Okinawa: Antes del nacimiento de los estilos contemporáneos con denominaciones comerciales, el arte se conocía genéricamente como 'Okinawa-Te' y se diferenciaba según la geografía urbana donde floreció: Shuri-Te (desarrollado en torno a la corte real del Castillo de Shuri, distinguido por desplazamientos lineales, velocidad fulminante y posturas dinámicas; base de escuelas como Shotokan y Shito-Ryu); Naha-Te (cultivado en el bullicioso puerto mercantil de Naha, caracterizado por posturas sólidas y enraizadas como Sanchin, respiración diafragmática profunda Ibuki y trayectorias circulares; base del Goju-Ryu y Uechi-Ryu); y Tomari-Te (practicado en el pueblo pesquero de Tomari, fusionando la versatilidad de campesinos y marineros con técnicas de esquiva evasiva).",
                        "5. La Gran Transformación: De 'Mano China' a 'Mano Vacía': A inicios del siglo XX, el Maestro Gichin Funakoshi presentó el arte en Tokio ante el emperador y en las principales universidades de Japón. En 1936, durante una cumbre histórica de maestros celebrada en Naha, se oficializó el cambio del ideograma original 唐手 ('To-de' o Mano China / Dinastía Tang) por el ideograma homófono 空手 ('Kara-Te' o Mano Vacía). Funakoshi integró formalmente el sufijo 'Dō' (道 - Camino de vida espiritual) inspirado en la doctrina Zen: 'Vaciar la mente de ambición desmedida, orgullo y vanidad para reflejar el mundo con la nitidez y calma de un espejo de agua'.",
                        "6. La Tríada Sagrada del Dojo y el Código Ético Universal: La maestría en el Karate-Do descansa sobre una tríada indivisible: el Kihon (repetición metódica y rigurosa de las bases posturales y biomecánicas), el Kata (la enciclopedia viviente del sistema, cuyas secuencias coreografiadas encierran aplicaciones secretas de defensa letal o Bunkai) y el Kumite (el combate donde se somete a prueba el temple, la distancia y el tiempo). Todo este poder técnico se encuentra supeditado a los dos mandamientos eternos del Budo: 'Karate ni sente nashi' (En el Karate no existe el primer ataque) y el principio 'Ikken Hissatsu' (comprometer todo el ser en un golpe decisivo, regido por el control milimétrico o Sundome para jamás dañar la vida de quien entrena a nuestro lado)."
                    ],
                    bulletPoints: [
                        {
                            title: "El Bubishi (武備志)",
                            desc: "La biblia documental del Karate: compendio secreto de 48 técnicas de combate, puntos vitales (Kyusho) y medicina marcial transmitido de maestro a discípulo en Okinawa.",
                            badge: "Documento Sagrado"
                        },
                        {
                            title: "Karate Ni Sente Nashi (空手に先手なし)",
                            desc: "'En el Karate no existe el primer ataque'. Máxima ética del Maestro Funakoshi que consagra al arte como un escudo de paz, defensa personal y dominio absoluto del ego.",
                            badge: "Pilar Moral"
                        },
                        {
                            title: "Ikken Hissatsu & Sundome",
                            desc: "La determinación inquebrantable de dar un golpe decisivo y certero ('de un solo golpe, muerte certera'), balanceada con el freno milimétrico (Sundome) para proteger la vida del compañero.",
                            badge: "Control Supremo"
                        },
                        {
                            title: "Shuri-Te, Naha-Te y Tomari-Te",
                            desc: "Las tres ramas geográficas matrices de Okinawa: la nobleza ágil de Shuri, la potencia circular y respiratoria del puerto de Naha, y la versatilidad de los pescadores de Tomari.",
                            badge: "Geografía Madre"
                        },
                        {
                            title: "Biomecánica del Kiai & Kime",
                            desc: "La exhalación diafragmática explosiva que blinda los órganos internos, contrae la musculatura abdominal y canaliza la energía Ki en el instante del impacto.",
                            badge: "Fuerza Interior"
                        },
                        {
                            title: "El Protocolo Sagrado Rei (礼)",
                            desc: "'El Karate empieza y termina con respeto'. La reverencia inicial y final que consagra la gratitud hacia el dojo, el sensei y los compañeros de camino.",
                            badge: "Etiqueta Tradicional"
                        }
                    ],
                    references: [
                        {
                            title: "Bubishi: La Biblia del Karate",
                            author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                            year: 2001,
                            editorial: "Editorial Tutor (Madrid)",
                            chapter: "Estudio preliminar, traducción íntegra del manuscrito chino y análisis de las 48 técnicas combativas",
                            note: "Obra de investigación histórica culmen que rastrea el origen del texto secreto en la provincia de Fujian y su custodia en los linajes de Okinawa."
                        },
                        {
                            title: "Karate-Do: Mi Camino de Vida",
                            author: "Maestro Gichin Funakoshi",
                            year: 1975,
                            editorial: "Editorial Eyras (Madrid)",
                            chapter: "Capítulo II: La forja del Karate en Okinawa y la trascendental asamblea de maestros de Naha en 1936",
                            note: "Autobiografía indispensable del padre del Karate moderno que relata las sesiones secretas nocturnas y la adopción filosófica del kanji 'Vacío' (空)."
                        },
                        {
                            title: "La Historia del Karate: Goju-Ryu de Okinawa",
                            author: "Maestro Morio Higaonna (10° Dan)",
                            year: 1996,
                            editorial: "Editorial Miraguano (Madrid)",
                            chapter: "Capítulo 1: Naha-Te, el maestro Kanryo Higaonna y las raíces en el templo de Fujian",
                            note: "Crónica antropológica de primera mano sobre la preservación de los métodos de combate en Naha y la transmisión del Bubishi a Chojun Miyagi."
                        },
                        {
                            title: "Karate de Okinawa: Maestros, Estilos y Métodos Secretos",
                            author: "Mark Bishop",
                            year: 1999,
                            editorial: "Editorial Paidotribo (Barcelona)",
                            chapter: "Capítulos 1 y 2: El contexto histórico de la invasión Satsuma de 1609 y la evolución de Shuri, Naha y Tomari",
                            note: "Tratado enciclopédico sobre las vicisitudes del desarme civil en Ryukyu y la forja del Kobudo y el Te en la clandestinidad."
                        },
                        {
                            title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                            author: "Maestro Gichin Funakoshi",
                            year: 1938,
                            editorial: "Editorial Tutor (Madrid)",
                            chapter: "Principios I y II: El respeto (Rei) y la máxima 'Karate ni sente nashi' como pilares del Budo",
                            note: "El código deontológico y espiritual que distingue a un auténtico practicante marcial de un mero combatiente callejero."
                        },
                        {
                            title: "Karate Dinámico: Instrucción Oficial y Principios Biomecánicos",
                            author: "Maestro Masatoshi Nakayama (Director Técnico JKA)",
                            year: 1986,
                            editorial: "Editorial Paidotribo (Barcelona)",
                            chapter: "Capítulo 3: La física del Kime, la respiración abdominal diafragmática y el control milimétrico Sundome",
                            note: "Análisis científico-marcial sobre la concentración instantánea de potencia muscular y el respeto incondicional hacia el oponente."
                        }
                    ]
                },
                questions: [
                    {
                        id: "q-karate-kanji-draw-1",
                        type: "kanji_draw",
                        prompt: "Traza con tu dedo o mouse los Kanjis sagrados de KARATE-DO (空手道)",
                        description: "Sigue los trazos guiados en orden sobre el pergamino para forjar la caligrafía marcial del guerrero.",
                        explanation: "¡Excelente maestría caligráfica! Karate-Dō (空手道) significa literalmente 'El Camino de la Mano Vacía'. El maestro Gichin Funakoshi adoptó el kanji 空 (Kara - Vacío) para representar tanto la autodefensa sin armas como el ideal del Budismo Zen: una mente despejada de ego, orgullo y malas intenciones.",
                        hint: "Sigue el punto rojo numerado y traza en dirección al círculo guía.",
                        references: [
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 1: La adopción formal del kanji 'Kara' (空 - Vacío)",
                                note: "Fundamento filosófico del reemplazo formal del antiguo kanji 唐 (China/Tang) por 空 (Vacío) en el Karate-Do."
                            },
                            {
                                title: "Karate Shotokan: Una Historia Precisa",
                                author: "Harry Cook",
                                year: 2001,
                                editorial: "Edición Histórica Marcial",
                                chapter: "La asamblea histórica de maestros de Okinawa de 1936",
                                note: "Investigación documental sobre la reunión en Naha donde se oficializó el término Karate-Do."
                            }
                        ]
                    },
                    {
                        id: "q-bubishi-origen-okinawa",
                        type: "multiple_choice",
                        prompt: "¿Cuál fue la raíz histórica que dio origen al Karate en Okinawa?",
                        description: "Tratado secreto Bubishi (武備志) del antiguo Reino de Ryukyu.",
                        options: [
                            {
                                id: "o1",
                                text: "🇯🇵 Te de Okinawa + Jujutsu Samurái",
                                isCorrect: false
                            },
                            {
                                id: "o2",
                                text: "🇨🇳 Te de Okinawa + Quan-fa del sur de China",
                                isCorrect: true
                            },
                            {
                                id: "o3",
                                text: "🥋 Boxeo Shaolin del Norte",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "⛵ Lucha de marineros de Taiwán",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o2",
                        explanation: "¡Exacto! El Bubishi documenta la síntesis del 'Te' (手) nativo de Okinawa con el 'Quan-fa' del sur de China (Fujian), preservado por los primeros maestros de Ryukyu.",
                        hint: "El Bubishi es de herencia chino-okinawense: busca la influencia del sur de China.",
                        references: [
                            {
                                title: "Bubishi: La Biblia del Karate",
                                author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                                year: 2001,
                                editorial: "Editorial Tutor",
                                chapter: "Traducción y comentarios de los 32 artículos del manuscrito secreto",
                                note: "Obra de referencia obligada traducida al español por Sensei Patrick McCarthy sobre el manuscrito secreto que preservaron los maestros fundadores de Okinawa (como Higashionna, Miyagi e Itosu)."
                            },
                            {
                                title: "La Historia del Karate: Goju-Ryu de Okinawa",
                                author: "Maestro Morio Higaonna (10° Dan)",
                                year: 1996,
                                editorial: "Editorial Miraguano",
                                chapter: "Capítulo 2: Los orígenes del Naha-Te y la herencia del Bubishi en Ryukyu",
                                note: "Crónica histórica de cómo el Bubishi fue transmitido desde Fuzhou (China) a Naha y atesorado por los pioneros del Karate."
                            },
                            {
                                title: "Karate de Okinawa: Maestros, Estilos y Métodos Secretos",
                                author: "Mark Bishop",
                                year: 1999,
                                editorial: "Editorial Paidotribo",
                                chapter: "Linajes tradicionales de Shuri, Tomari y Naha y su conexión con China",
                                note: "Estudio exhaustivo en español sobre las raíces autóctonas de Okinawa y el impacto de los inmigrantes chinos de Fujian."
                            }
                        ]
                    },
                    {
                        id: "q-prohibicion-armas-okinawa",
                        type: "multiple_choice",
                        prompt: "¿Por qué se entrenaba en secreto y de noche en la antigua Okinawa?",
                        description: "Clandestinidad marcial tras la invasión samurái de 1609.",
                        options: [
                            {
                                id: "o1",
                                text: "🌙 Por meditar y combatir bajo la luna",
                                isCorrect: false
                            },
                            {
                                id: "o2",
                                text: "☀️ Por el calor del mediodía",
                                isCorrect: false
                            },
                            {
                                id: "o3",
                                text: "⚔️ Por la prohibición total de armas impuesta por los samuráis",
                                isCorrect: true
                            },
                            {
                                id: "o4",
                                text: "⛵ Para evitar a los pescadores",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o3",
                        explanation: "¡Exacto! Tras la invasión del clan Satsuma en 1609 y la prohibición de armas, los maestros entrenaban de noche en secreto para transformar su propio cuerpo en un arma de autodefensa.",
                        hint: "Piensa en las leyes de desarme impuestas a los habitantes de Okinawa.",
                        references: [
                            {
                                title: "Karate de Okinawa: Maestros, Estilos y Métodos Secretos",
                                author: "Mark Bishop",
                                year: 1999,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 1: El contexto sociopolítico del desarme en el Reino de Ryukyu",
                                note: "Documenta cómo la confiscación de armas por los samuráis obligó a los maestros a enseñar a puerta cerrada en patios nocturnos."
                            }
                        ]
                    },
                    {
                        id: "q-karate-ni-sente-nashi",
                        type: "multiple_choice",
                        prompt: "¿Qué enseña el lema «Karate ni sente nashi»?",
                        description: "Pilar ético fundamental del Maestro Gichin Funakoshi.",
                        options: [
                            {
                                id: "o1",
                                text: "🕊️ En el Karate no existe el primer ataque (defensa y paz)",
                                isCorrect: true
                            },
                            {
                                id: "o2",
                                text: "⚡ Atacar antes que el rival para ganar",
                                isCorrect: false
                            },
                            {
                                id: "o3",
                                text: "🛡️ Rendirse jamás ante la derrota",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "🥊 Buscar el nocaut obligatorio en el primer golpe",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o1",
                        explanation: "¡Brillante! 'Karate ni sente nashi' enseña que un karateka jamás inicia la violencia: el arte fue creado para la autoprotección y la paz.",
                        hint: "La palabra 'sente' significa la primera iniciativa o agresión.",
                        references: [
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Principio 2: Karate ni sente nashi (En el Karate no existe el primer ataque)",
                                note: "Fundamento moral que distingue al verdadero practicante del Budo de un peleador callejero."
                            }
                        ]
                    },
                    {
                        id: "q-ciudades-okinawa-te",
                        type: "multiple_choice",
                        prompt: "¿Cómo se llamaban las ramas originales del Karate en Okinawa?",
                        description: "Las 3 vertientes urbanas antes de los estilos modernos.",
                        options: [
                            {
                                id: "o1",
                                text: "🏔️ Por sus montañas (Yanbaru, Motobu)",
                                isCorrect: false
                            },
                            {
                                id: "o2",
                                text: "🥋 Por las guardias (Jodan, Chudan, Gedan)",
                                isCorrect: false
                            },
                            {
                                id: "o3",
                                text: "👑 Por reyes de la dinastía Ryukyu",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "🏯 Por sus 3 ciudades: Shuri, Naha y Tomari",
                                isCorrect: true
                            }
                        ],
                        correctAnswerId: "o4",
                        explanation: "¡Correcto! Originalmente se llamaban según la ciudad donde nacieron: Shuri-Te (nobleza), Naha-Te (puerto mercantil) y Tomari-Te (campesinos y pescadores).",
                        hint: "Se clasificaban de acuerdo a 3 ciudades históricas de la isla.",
                        references: [
                            {
                                title: "La Historia del Karate: Goju-Ryu de Okinawa",
                                author: "Maestro Morio Higaonna (10° Dan)",
                                year: 1996,
                                editorial: "Editorial Miraguano",
                                chapter: "Capítulo 3: Desarrollo regional: Shuri-Te, Naha-Te y Tomari-Te",
                                note: "Explica cómo cada ciudad desarrolló un enfoque biomecánico único según la clase social y oficio de sus habitantes."
                            }
                        ]
                    },
                    {
                        id: "q-significado-saludo-rei",
                        type: "multiple_choice",
                        prompt: "¿Por qué toda práctica marcial inicia y termina con el saludo (Rei)?",
                        description: "Protocolo y etiqueta sagrada del Dojo.",
                        options: [
                            {
                                id: "o1",
                                text: "🙇‍♂️ Por sumisión obligatoria ante el sensei",
                                isCorrect: false
                            },
                            {
                                id: "o2",
                                text: "🤝 Por respeto mutuo y cortesía marcial",
                                isCorrect: true
                            },
                            {
                                id: "o3",
                                text: "⏱️ Para que el árbitro inicie el reloj",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "🧘 Para estirar los músculos del cuello",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o2",
                        explanation: "¡Exacto! 'El Karate empieza y termina con respeto'. El saludo (Rei) recuerda que el compañero nos ayuda a crecer y superarnos mutuamente.",
                        hint: "El Budo busca forjar carácter y respeto, no violencia.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 1: El espíritu del Rei y la etiqueta marcial en el dojo tradicional",
                                note: "El fundador advierte que la técnica de combate sin reverencia ni respeto se degrada a simple violencia."
                            }
                        ]
                    },
                    {
                        id: "q-funcion-real-kiai",
                        type: "multiple_choice",
                        prompt: "¿Para qué sirve el grito explosivo (Kiai) al golpear?",
                        description: "Ciencia del impacto y respiración diafragmática.",
                        options: [
                            {
                                id: "o1",
                                text: "👀 Para distraer al rival",
                                isCorrect: false
                            },
                            {
                                id: "o2",
                                text: "📢 Para avisar al público y jueces",
                                isCorrect: false
                            },
                            {
                                id: "o3",
                                text: "💥 Blindar el abdomen y enfocar máxima potencia (Kime)",
                                isCorrect: true
                            },
                            {
                                id: "o4",
                                text: "😮‍💨 Para fingir cansancio",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o3",
                        explanation: "¡Perfecto! 'Kiai' significa unión de energía. Al exhalar con fuerza, el abdomen se tensa como un escudo y transmite toda la masa al impacto.",
                        hint: "Se relaciona con la respiración y la protección del torso.",
                        references: [
                            {
                                title: "Karate Dinámico",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1986,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 4: La física del impacto, la respiración y el principio del Kiai",
                                note: "Estudio biomecánico que demuestra el aumento de masa efectiva y estabilidad que produce la exhalación brusca."
                            }
                        ]
                    },
                    {
                        id: "q-pilares-kihon-kata-kumite",
                        type: "multiple_choice",
                        prompt: "¿Cuáles son los 3 pilares esenciales del Karate tradicional?",
                        description: "La tríada formativa del dojo.",
                        options: [
                            {
                                id: "o1",
                                text: "🥋 Kihon (básicos), Kata (formas) y Kumite (combate)",
                                isCorrect: true
                            },
                            {
                                id: "o2",
                                text: "🗡️ Katana, Kamikaze y Kodokan",
                                isCorrect: false
                            },
                            {
                                id: "o3",
                                text: "⚡ Kyusho, Kiai y Karategi",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "👟 Kizami, Keri y Koshiki",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o1",
                        explanation: "¡Exacto! El Karate se apoya en tres bases: Kihon (fundamentos), Kata (formas clásicas) y Kumite (combate con compañero).",
                        hint: "Busca las tres 'K' esenciales del dojo.",
                        references: [
                            {
                                title: "El Mejor Karate: Fundamentos",
                                author: "Maestro Masatoshi Nakayama",
                                year: 1989,
                                editorial: "Editorial Tutor",
                                chapter: "Introducción general a los tres pilares del Karate-Do",
                                note: "Tratado técnico de la Japan Karate Association (JKA) sobre la progresión formativa del alumno."
                            }
                        ]
                    },
                    {
                        id: "q-que-es-un-kata",
                        type: "multiple_choice",
                        prompt: "¿Qué función cumplían los Katas en la antigüedad marcial?",
                        description: "Preservación del conocimiento de combate sin libros ni videos.",
                        options: [
                            {
                                id: "o1",
                                text: "🎭 Bailes festivos para la corte imperial",
                                isCorrect: false
                            },
                            {
                                id: "o2",
                                text: "🤸 Gimnasia rítmica para niños",
                                isCorrect: false
                            },
                            {
                                id: "o3",
                                text: "🧘 Calentamiento sin defensa real",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "📚 Enciclopedias vivientes de defensa personal y derribos (Bunkai)",
                                isCorrect: true
                            }
                        ],
                        correctAnswerId: "o4",
                        explanation: "¡Exacto! Un Kata es una biblioteca en movimiento: cada paso oculta llaves, derribos y defensas reales frente a agresiones.",
                        hint: "Eran enciclopedias secretas de técnicas reales.",
                        references: [
                            {
                                title: "Bubishi: La Biblia del Karate",
                                author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                                year: 2001,
                                editorial: "Editorial Tutor",
                                chapter: "Análisis del Bunkai: La descodificación de los Katas clásicos de Okinawa",
                                note: "Explica cómo cada movimiento formal de un Kata responde a una situación real de vida o muerte en la calle."
                            }
                        ]
                    },
                    {
                        id: "q-ikken-hissatsu-control",
                        type: "multiple_choice",
                        prompt: "¿Qué exige la regla «Ikken Hissatsu» (Golpe Decisivo) en el dojo?",
                        description: "El balance supremo entre potencia y autocontrol.",
                        options: [
                            {
                                id: "o1",
                                text: "💥 Buscar el nocaut inmediato del compañero",
                                isCorrect: false
                            },
                            {
                                id: "o2",
                                text: "🎯 Máxima potencia con autocontrol para no lesionar",
                                isCorrect: true
                            },
                            {
                                id: "o3",
                                text: "🙈 Golpear con los ojos cerrados",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "🛑 Detenerse solo con silbato",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o2",
                        explanation: "¡Extraordinario! 'Ikken Hissatsu' enseña a dar el 100% de potencia con el autocontrol milimétrico (Sundome) para cuidar a los compañeros.",
                        hint: "El poder real es la capacidad de controlar la fuerza.",
                        references: [
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 5: El concepto de Ikken Hissatsu y la disciplina del autocontrol",
                                note: "Funakoshi enfatiza que sin autocontrol milimétrico el karateka se convierte en un peligro público."
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-anatomia",
                number: 2,
                title: "Anatomía Marcial & Kyusho",
                subtitle: "Conoce tu herramienta: Puntos vitales y biomecánica en japonés",
                tag: "Anatomía & Impacto",
                icon: "🦴",
                color: "red",
                xpReward: 60,
                theory: {
                    title: "El Cuerpo Humano en la Práctica del Karate",
                    subtitle: "Niveles de ataque, biomecánica y terminología japonesa esencial",
                    quote: "El cuerpo es el templo y el arma del karateka. Conocer sus divisiones es la base del control y la precisión.",
                    content: [
                        "En el Karate tradicional y deportivo, el cuerpo humano se divide verticalmente en tres alturas de ataque y defensa:",
                        "1. JODAN (Zona Alta): Comprende el cuello, mandíbula, rostro y cabeza (Atama). Requiere máximo control debido a la vulnerabilidad craneal.",
                        "2. CHUDAN (Zona Media): Desde las clavículas hasta el cinturón (Obi), incluyendo plexo solar, costillas flotantes y abdomen.",
                        "3. GEDAN (Zona Baja): Del cinturón hacia abajo, incluyendo muslos, ingles, rodillas (Hiza), espinillas (Sune) y pies (Ashi).",
                        "Los puntos vitales (Kyusho) son centros nerviosos, uniones articulares y vasos sanguíneos que en el combate marcial maximizan el impacto con el mínimo esfuerzo."
                    ],
                    images: [
                        {
                            src: "/images/kuma-partes-cuerpo.jpg",
                            alt: "Partes del Cuerpo - Kuma Dojo",
                            caption: "Fig 2. Mapa anatómico de partes del cuerpo y niveles en japonés"
                        }
                    ],
                    references: [
                        "Funakoshi, G. (1973). Karate-Do Kyohan: The Master Text. Tokio: Kodansha.",
                        "Habersetzer, R. (2004). Encyclopédie des arts martiaux de l'Extrême-Orient. París: Amphora."
                    ]
                },
                questions: [
                    {
                        id: "q-anat-1",
                        type: "matching",
                        prompt: "Empareja cada nivel del cuerpo con su término japonés:",
                        explanation: "Jodan es la zona alta (cabeza/cuello), Chudan es la zona media (pecho/abdomen) y Gedan es la zona baja.",
                        pairs: [
                            { id: "p1", left: "JODAN", right: "Zona Alta (Cabeza/Cuello)" },
                            { id: "p2", left: "CHUDAN", right: "Zona Media (Torso/Costillas)" },
                            { id: "p3", left: "GEDAN", right: "Zona Baja (Debajo de cintura)" },
                        ]
                    },
                    {
                        id: "q-anat-2",
                        type: "image_choice",
                        prompt: "Observa el mapa anatómico Kuma. ¿Qué término japonés designa a la cabeza / rostro?",
                        image: "/images/kuma-partes-cuerpo.jpg",
                        options: [
                            { id: "o1", text: "Atama / Men", isCorrect: true },
                            { id: "o2", text: "Hiza", isCorrect: false },
                            { id: "o3", text: "Empi", isCorrect: false },
                            { id: "o4", text: "Kakitawake", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Atama significa cabeza y Men hace referencia a la faz/rostro en las artes marciales japonesas.",
                        hint: "Hiza es rodilla y Empi es codo."
                    },
                    {
                        id: "q-anat-3",
                        type: "matching",
                        prompt: "Empareja la extremidad con su nombre en japonés:",
                        explanation: "Hiza = Rodilla, Empi/Hiji = Codo, Seiken = Puño frontal, Ashi = Pierna/Pie.",
                        pairs: [
                            { id: "p1", left: "Hiza", right: "Rodilla" },
                            { id: "p2", left: "Empi", right: "Codo" },
                            { id: "p3", left: "Seiken", right: "Puño frontal" },
                        ]
                    }
                ]
            },
            {
                id: "level-kumite-tradicional",
                number: 3,
                title: "Evolución del Kumite",
                subtitle: "Entrelazar manos: Del combate vital al Budo moderno",
                tag: "Combate & Tradición",
                icon: "🤝",
                color: "amber",
                xpReward: 65,
                theory: {
                    title: "El Origen del Kumite (組手)",
                    subtitle: "Del Tegumi de Okinawa al Kumite reglado",
                    quote: "El término Kumite se traduce literalmente como 'entrelazar manos', haciendo referencia a su origen arcaico en la lucha sumatoria okinawense.",
                    content: [
                        "En la visión antigua de Okinawa, el combate libre (Jiyu Kumite) prácticamente no existía. La práctica se enfocaba casi en su totalidad en los Katas y el acondicionamiento corporal.",
                        "Los maestros consideraban que las técnicas reales eran letales, por lo que el entrenamiento con compañero se realizaba como Yakusoku Kumite (combate predeterminado), cuyo fin era descifrar la aplicación práctica (Bunkai) de los katas.",
                        "Esto se regía bajo el principio de 'Ikken Hissatsu' ('un golpe, una muerte'), donde la contundencia y la resolución inmediata eran primordiales.",
                        "La transición hacia el combate fluido que conocemos hoy nació en los clubes universitarios de Tokio en los años 1920 y 1930, impulsada por figuras innovadoras como Yoshitaka Funakoshi.",
                        "Este salto transformó el combate de un método de defensa personal civil a una disciplina de educación física y desarrollo espiritual (Budo), donde el control, el tiempo (Timing) y la distancia (Maai) son los pilares fundamentales."
                    ],
                    images: [
                        {
                            src: "/images/kuma-reglamento-kumite.jpg",
                            alt: "Combate Dinámico Kuma",
                            caption: "Fig 3. El encuentro dinámico y la gestión de la distancia (Maai)"
                        }
                    ],
                    references: [
                        "Cook, H. (2001). Shotokan Karate: A Precise History.",
                        "Funakoshi, G. (1973). Karate-Do Kyohan: The Master Text.",
                        "Johnson, N. (2012). The History of Karate: Okinawan and Japanese Styles.",
                        "Nagamine, S. (1976). The Essence of Okinawan Karate-Do."
                    ]
                },
                questions: [
                    {
                        id: "q-kumite-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa literalmente el término japonés 'Kumite' (組手)?",
                        options: [
                            { id: "o1", text: "Entrelazar manos", isCorrect: true },
                            { id: "o2", text: "Patada voladora", isCorrect: false },
                            { id: "o3", text: "Pared de hierro", isCorrect: false },
                            { id: "o4", text: "Golpe fulminante", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Kumi (juntar/entrelazar) y Te (mano): 'entrelazar manos', vinculado a los agarres y luchas arcaicas del Tegumi.",
                        hint: "Kumi = enlazar o unir; Te = mano."
                    },
                    {
                        id: "q-kumite-2",
                        type: "multiple_choice",
                        prompt: "¿Cuál era la filosofía clásica de eficacia en el karate okinawense tradicional?",
                        options: [
                            { id: "o1", text: "Ikken Hissatsu ('Un golpe, una muerte')", isCorrect: true },
                            { id: "o2", text: "Ganar por puntos en 3 minutos", isCorrect: false },
                            { id: "o3", text: "Evadir al oponente indefinidamente", isCorrect: false },
                            { id: "o4", text: "Luchar en el suelo", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Ikken Hissatsu reflejaba la búsqueda de la máxima eficacia resolutiva con un solo golpe decisivo.",
                        hint: "Significa terminar el combate de un solo impacto."
                    },
                    {
                        id: "q-kumite-3",
                        type: "true_false",
                        prompt: "¿El combate libre (Jiyu Kumite) competitivo siempre formó parte de la enseñanza original de Okinawa?",
                        correctBool: false,
                        explanation: "¡Falso! En Okinawa se practicaba Yakusoku Kumite (preestablecido) y kata; el combate libre moderno nació en las universidades japonesas del siglo XX.",
                        hint: "Revisa el rol de los clubes universitarios de Tokio en 1920."
                    }
                ]
            }
        ]
    },

    // ── 9° KYU — CINTURÓN AMARILLO 🌅 ──────────────────────────────
    {
        id: "unit-kyu-9",
        title: "Los Primeros Rayos del Sol",
        description: "Domina las posiciones fundamentales (Dachi) que forman los cimientos del karate.",
        path: "tradicional",
        beltId: "kyu-9",
        levels: [
            {
                id: "level-dachi-basico",
                number: 1,
                title: "Posiciones Fundamentales (Dachi)",
                subtitle: "Los cimientos sobre los que se construye todo el arte marcial",
                tag: "Posiciones Básicas",
                icon: "🦶",
                color: "gold",
                xpReward: 55,
                theory: {
                    title: "Las Posiciones Básicas del Karate (Dachi)",
                    subtitle: "Zenkutsu-dachi, Kokutsu-dachi y Kiba-dachi",
                    quote: "Sin raíces fuertes, incluso el árbol más grande cae ante el viento.",
                    content: [
                        "Las posiciones (Dachi/Tachi) son la base de toda técnica de karate. Sin una posición sólida, ningún golpe, bloqueo o patada puede ejecutarse con eficacia.",
                        "ZENKUTSU-DACHI (Posición adelantada larga): Pierna delantera flexionada, pierna trasera extendida. Distribuye el peso 60% adelante, 40% atrás. Ideal para ataques frontales.",
                        "KOKUTSU-DACHI (Posición atrasada): El peso se concentra 70% en la pierna trasera y 30% en la delantera. Permite retroceder y defender rápidamente.",
                        "KIBA-DACHI (Posición del jinete): Piernas abiertas al doble del ancho de hombros, rodillas flexionadas hacia afuera, centro de gravedad bajo. Fortalece piernas y Hara."
                    ],
                    references: [
                        "Nakayama, M. (1966). Dynamic Karate. Tokyo: Kodansha.",
                        "Funakoshi, G. (1973). Karate-Do Kyohan: The Master Text."
                    ]
                },
                questions: [
                    {
                        id: "q-dachi-1",
                        type: "multiple_choice",
                        prompt: "¿Qué posición distribuye el peso 60% en la pierna delantera y 40% en la trasera?",
                        options: [
                            { id: "o1", text: "Zenkutsu-dachi (Posición adelantada larga)", isCorrect: true },
                            { id: "o2", text: "Kokutsu-dachi (Posición atrasada)", isCorrect: false },
                            { id: "o3", text: "Kiba-dachi (Posición del jinete)", isCorrect: false },
                            { id: "o4", text: "Neko-ashi-dachi (Posición del gato)", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Zenkutsu-dachi proyecta el peso hacia adelante para potenciar los ataques directos.",
                        hint: "El nombre indica 'inclinarse hacia adelante'."
                    },
                    {
                        id: "q-dachi-2",
                        type: "matching",
                        prompt: "Empareja cada posición con su característica principal:",
                        explanation: "Zenkutsu = Avance, Kokutsu = Retroceso, Kiba = Estabilidad lateral.",
                        pairs: [
                            { id: "p1", left: "Zenkutsu-dachi", right: "Pierna delantera flexionada, ideal para ataques" },
                            { id: "p2", left: "Kokutsu-dachi", right: "70% del peso atrás, ideal para defensa" },
                            { id: "p3", left: "Kiba-dachi", right: "Piernas abiertas, posición del jinete" },
                        ]
                    }
                ]
            },
            {
                id: "level-rei-etiqueta",
                number: 2,
                title: "Rei y Etiqueta del Dojo",
                subtitle: "El saludo que honra al arte, al maestro y a uno mismo",
                tag: "Etiqueta & Cortesía",
                icon: "🙇",
                color: "amber",
                xpReward: 50,
                theory: {
                    title: "Rei: El Saludo y la Etiqueta Marcial",
                    subtitle: "La cortesía como pilar del Budo",
                    quote: "Karate wa Rei ni hajimari, Rei ni owaru — El Karate comienza y termina con respeto.",
                    content: [
                        "En el Karate, el saludo (Rei) no es un simple gesto social, sino un acto de humildad y compromiso espiritual.",
                        "RITSU-REI: Saludo de pie con inclinación de 30° desde la cintura, brazos pegados al cuerpo. Se realiza al entrar y salir del Dojo.",
                        "ZA-REI: Saludo arrodillado desde la posición Seiza. Se utiliza al inicio y fin de la clase formal (Mokuso).",
                        "La frase ritual 'OSU' (押忍) expresa respeto, perseverancia y compromiso. Es el saludo universal del karateka."
                    ],
                    references: [
                        "Lowry, D. (2006). In the Dojo: A Guide to the Rituals and Etiquette."
                    ]
                },
                questions: [
                    {
                        id: "q-rei-1",
                        type: "multiple_choice",
                        prompt: "¿Cuál es la máxima fundamental sobre el Rei en el Karate?",
                        options: [
                            { id: "o1", text: "El Karate comienza y termina con respeto (Rei)", isCorrect: true },
                            { id: "o2", text: "El Karate comienza con un golpe y termina con una patada", isCorrect: false },
                            { id: "o3", text: "El Karate comienza con fuerza y termina con velocidad", isCorrect: false },
                            { id: "o4", text: "El Karate solo se practica en silencio", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Karate wa Rei ni hajimari, Rei ni owaru: esta frase resume que la cortesía es el principio y el fin del arte.",
                        hint: "Es una de las 20 reglas de Funakoshi (Niju Kun)."
                    },
                    {
                        id: "q-rei-2",
                        type: "true_false",
                        prompt: "¿El saludo Za-Rei se realiza de pie con una inclinación de 30 grados?",
                        correctBool: false,
                        explanation: "Falso. Za-Rei se realiza desde la posición arrodillada (Seiza). El saludo de pie es Ritsu-Rei.",
                        hint: "Za significa sentado/arrodillado."
                    }
                ]
            }
        ]
    },

    // ── 8° KYU — CINTURÓN NARANJA 🔥 ──────────────────────────────
    {
        id: "unit-kyu-8",
        title: "El Fuego Interior",
        description: "Forja tus técnicas de puño: Oi-Zuki, Gyaku-Zuki y la potencia del Seiken.",
        path: "tradicional",
        beltId: "kyu-8",
        levels: [
            {
                id: "level-tsuki-basico",
                number: 1,
                title: "Técnicas de Puño (Tsuki)",
                subtitle: "El puño como extensión del espíritu guerrero",
                tag: "Técnicas de Puño",
                icon: "👊",
                color: "gold",
                xpReward: 60,
                theory: {
                    title: "El Arte del Tsuki (突き) — Técnicas de Puño",
                    subtitle: "Oi-Zuki, Gyaku-Zuki y Kizami-Zuki",
                    quote: "El puño no golpea con el brazo; golpea con todo el cuerpo, desde el Hara.",
                    content: [
                        "OI-ZUKI (Puño directo perseguidor): Puño lanzado con el mismo brazo que la pierna adelantada. Todo el cuerpo avanza como una lanza. Es el primer ataque que aprende todo karateka.",
                        "GYAKU-ZUKI (Puño inverso): Puño contrario a la pierna adelantada. La rotación de caderas (Koshi) genera una potencia explosiva. Es la técnica más puntuada en el kumite.",
                        "KIZAMI-ZUKI (Puño de estocada): Golpe rápido con el puño delantero, sin rotación completa de cadera. Usado como jab para romper distancia.",
                        "Todas las técnicas de puño se ejecutan con Seiken (superficie frontal de los dos nudillos principales: índice y medio)."
                    ],
                    references: [
                        "Nakayama, M. (1966). Dynamic Karate.",
                        "Kanazawa, H. (2006). Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-tsuki-1",
                        type: "multiple_choice",
                        prompt: "¿Qué técnica de puño utiliza el brazo contrario a la pierna adelantada y genera potencia con la rotación de caderas?",
                        options: [
                            { id: "o1", text: "Gyaku-Zuki (Puño inverso)", isCorrect: true },
                            { id: "o2", text: "Oi-Zuki (Puño perseguidor)", isCorrect: false },
                            { id: "o3", text: "Kizami-Zuki (Puño estocada)", isCorrect: false },
                            { id: "o4", text: "Tetsui (Puño martillo)", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Gyaku-Zuki usa el brazo opuesto a la pierna delantera, potenciado por la rotación de Koshi (caderas).",
                        hint: "Gyaku significa 'inverso' o 'contrario'."
                    },
                    {
                        id: "q-tsuki-2",
                        type: "multiple_choice",
                        prompt: "¿Qué superficie del puño se utiliza para impactar en las técnicas de Tsuki correctamente?",
                        options: [
                            { id: "o1", text: "Seiken: nudillos del índice y medio", isCorrect: true },
                            { id: "o2", text: "La palma de la mano", isCorrect: false },
                            { id: "o3", text: "Los dedos extendidos", isCorrect: false },
                            { id: "o4", text: "El dorso de la mano", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Seiken (los dos nudillos principales) concentra toda la fuerza en un área pequeña para máximo impacto.",
                        hint: "Son los dos primeros nudillos del puño cerrado."
                    }
                ]
            },
            {
                id: "level-hikite",
                number: 2,
                title: "El Secreto del Hikite",
                subtitle: "La mano que retrocede es tan poderosa como la que golpea",
                tag: "Principio de Acción-Reacción",
                icon: "🔄",
                color: "red",
                xpReward: 55,
                theory: {
                    title: "Hikite (引き手) — La Mano que Retrae",
                    subtitle: "Tercera ley de Newton aplicada al Budo",
                    quote: "El puño que retrocede con velocidad multiplica la fuerza del que avanza.",
                    content: [
                        "Hikite es el principio de retraer la mano contraria hacia la cadera (Koshi) mientras el otro puño golpea. Esta acción-reacción genera una fuerza rotatoria que amplifica el impacto.",
                        "En la aplicación real (Bunkai), Hikite también representa un agarre: la mano que retrae sujeta y jala al oponente mientras el puño libre golpea con devastadora eficacia.",
                        "El dominio de Hikite diferencia a un principiante de un karateka avanzado. Sin retracción, el golpe pierde hasta un 40% de su potencia."
                    ],
                    references: [
                        "Abernethy, I. (2002). Bunkai-Jutsu: The Practical Application of Karate Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-hikite-1",
                        type: "multiple_choice",
                        prompt: "¿Qué es el Hikite en el Karate?",
                        options: [
                            { id: "o1", text: "La acción de retraer la mano contraria hacia la cadera al golpear", isCorrect: true },
                            { id: "o2", text: "Una patada giratoria", isCorrect: false },
                            { id: "o3", text: "Un tipo de kata avanzado", isCorrect: false },
                            { id: "o4", text: "El nombre del cinturón negro", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Hikite (引き手) es la retracción de la mano contraria, que genera fuerza de acción-reacción.",
                        hint: "Hiki = tirar/retraer, Te = mano."
                    },
                    {
                        id: "q-hikite-2",
                        type: "true_false",
                        prompt: "¿El Hikite solo sirve para verse más estético durante el kata?",
                        correctBool: false,
                        explanation: "Falso. Hikite tiene una función biomecánica (acción-reacción) y una aplicación real (agarre y control del oponente).",
                        hint: "Piensa en la tercera ley de Newton y el Bunkai."
                    }
                ]
            }
        ]
    },

    // ── 7° KYU — CINTURÓN VERDE 🎋 ──────────────────────────────
    {
        id: "unit-kyu-7",
        title: "El Bambú que Crece",
        description: "Aprende los bloqueos fundamentales (Uke) que protegen al guerrero en combate.",
        path: "tradicional",
        beltId: "kyu-7",
        levels: [
            {
                id: "level-uke-basico",
                number: 1,
                title: "Técnicas de Bloqueo (Uke)",
                subtitle: "La defensa es el primer ataque del guerrero sabio",
                tag: "Bloqueos Fundamentales",
                icon: "🛡️",
                color: "emerald",
                xpReward: 60,
                theory: {
                    title: "Los Bloqueos Fundamentales (受け — Uke)",
                    subtitle: "Age-Uke, Soto-Uke, Uchi-Uke y Gedan-Barai",
                    quote: "El bloqueo no es un muro pasivo; es un rayo que intercepta.",
                    content: [
                        "AGE-UKE (Bloqueo ascendente): Desvía ataques a la zona alta (Jodan) elevando el antebrazo sobre la frente con giro de muñeca.",
                        "SOTO-UKE (Bloqueo exterior-interior): El antebrazo barre de afuera hacia adentro, desviando ataques a la zona media (Chudan).",
                        "UCHI-UKE (Bloqueo interior-exterior): Opuesto al Soto-Uke, el antebrazo barre desde dentro hacia fuera.",
                        "GEDAN-BARAI (Barrido bajo): Desvía ataques a la zona baja con un movimiento descendente y diagonal del antebrazo."
                    ],
                    references: [
                        "Nakayama, M. (1981). Best Karate Vol.2: Fundamentals. Tokyo: Kodansha."
                    ]
                },
                questions: [
                    {
                        id: "q-uke-1",
                        type: "matching",
                        prompt: "Empareja cada bloqueo con la zona que protege:",
                        explanation: "Age-Uke protege Jodan, Soto-Uke protege Chudan, Gedan-Barai protege Gedan.",
                        pairs: [
                            { id: "p1", left: "Age-Uke", right: "Zona alta (Jodan) — Cabeza" },
                            { id: "p2", left: "Soto-Uke", right: "Zona media (Chudan) — Torso" },
                            { id: "p3", left: "Gedan-Barai", right: "Zona baja (Gedan) — Abdomen bajo" },
                        ]
                    },
                    {
                        id: "q-uke-2",
                        type: "multiple_choice",
                        prompt: "¿Qué bloqueo utiliza un movimiento ascendente del antebrazo sobre la frente?",
                        options: [
                            { id: "o1", text: "Age-Uke (Bloqueo ascendente)", isCorrect: true },
                            { id: "o2", text: "Gedan-Barai (Barrido bajo)", isCorrect: false },
                            { id: "o3", text: "Soto-Uke (Bloqueo exterior)", isCorrect: false },
                            { id: "o4", text: "Shuto-Uke (Bloqueo de mano espada)", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Age-Uke sube el antebrazo en diagonal para desviar ataques dirigidos a la cabeza.",
                        hint: "Age significa 'subir' o 'elevar'."
                    }
                ]
            },
            {
                id: "level-tai-sabaki",
                number: 2,
                title: "Tai Sabaki — Esquivas Corporales",
                subtitle: "Mueve tu cuerpo como el agua que rodea la roca",
                tag: "Movimiento Corporal",
                icon: "💨",
                color: "green",
                xpReward: 55,
                theory: {
                    title: "Tai Sabaki (体捌き) — El Arte de Esquivar",
                    subtitle: "El cuerpo se mueve, la mente permanece",
                    quote: "No recibas la fuerza del enemigo; desvíala y hazla tuya.",
                    content: [
                        "Tai Sabaki es el arte de mover el cuerpo para esquivar un ataque mientras se mantiene la posición para contraatacar.",
                        "A diferencia de los bloqueos directos, el Tai Sabaki no confronta la fuerza del oponente; la redirige y la utiliza en su contra.",
                        "Los principales movimientos incluyen: desplazamientos laterales (Yori-ashi), pivotes (Tenkan) y retrocesos angulados.",
                        "El dominio del Tai Sabaki convierte al karateka en un blanco móvil imposible de alcanzar."
                    ],
                    references: [
                        "Toguchi, S. (1976). Okinawan Goju-Ryu II: Advanced Techniques."
                    ]
                },
                questions: [
                    {
                        id: "q-tai-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa Tai Sabaki en el contexto del Karate?",
                        options: [
                            { id: "o1", text: "El arte de esquivar moviendo el cuerpo sin confrontar la fuerza directamente", isCorrect: true },
                            { id: "o2", text: "Un tipo de patada giratoria alta", isCorrect: false },
                            { id: "o3", text: "El nombre de un kata avanzado", isCorrect: false },
                            { id: "o4", text: "La meditación antes de la clase", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Tai (cuerpo) + Sabaki (manejo/control): es el control del cuerpo para esquivar y redirigir la fuerza.",
                        hint: "Tai = cuerpo, Sabaki = manejo."
                    }
                ]
            }
        ]
    },

    // ── 6° KYU — CINTURÓN AZUL 🌊 ──────────────────────────────
    {
        id: "unit-kyu-6",
        title: "El Cielo Infinito",
        description: "Eleva tus técnicas con las patadas fundamentales (Geri) del karate.",
        path: "tradicional",
        beltId: "kyu-6",
        levels: [
            {
                id: "level-geri-basico",
                number: 1,
                title: "Patadas Fundamentales (Geri)",
                subtitle: "Las piernas son las armas más poderosas del guerrero",
                tag: "Técnicas de Patada",
                icon: "🦵",
                color: "blue",
                xpReward: 65,
                theory: {
                    title: "El Arte del Geri (蹴り) — Técnicas de Patada",
                    subtitle: "Mae-Geri, Yoko-Geri y Mawashi-Geri",
                    quote: "La patada del karateka no es un pie que se eleva; es una tormenta que asciende.",
                    content: [
                        "MAE-GERI (Patada frontal): Golpe directo hacia adelante con la parte alta de la planta del pie (Koshi/Josokutei). La rodilla se eleva primero como una grúa, luego el pie se extiende como un látigo.",
                        "YOKO-GERI (Patada lateral): Golpe lateral con el canto del pie (Sokuto). Existe en dos variantes: Kekomi (empujón penetrante) y Keage (ascendente cortante).",
                        "MAWASHI-GERI (Patada circular): Patada circular devastadora que impacta con el empeine (Haisoku). La cadera rota completamente para generar fuerza centrífuga.",
                        "La clave de toda patada es el Hiki-ashi: la retracción rápida de la pierna tras el impacto, igual que el Hikite del puño."
                    ],
                    references: [
                        "Nakayama, M. (1981). Best Karate Vol.4: Kumite 2. Tokyo: Kodansha."
                    ]
                },
                questions: [
                    {
                        id: "q-geri-1",
                        type: "matching",
                        prompt: "Empareja cada patada con su dirección:",
                        explanation: "Mae = Frontal, Yoko = Lateral, Mawashi = Circular.",
                        pairs: [
                            { id: "p1", left: "Mae-Geri", right: "Patada frontal directa" },
                            { id: "p2", left: "Yoko-Geri", right: "Patada lateral al costado" },
                            { id: "p3", left: "Mawashi-Geri", right: "Patada circular con empeine" },
                        ]
                    },
                    {
                        id: "q-geri-2",
                        type: "multiple_choice",
                        prompt: "¿Con qué parte del pie se ejecuta correctamente el Mawashi-Geri?",
                        options: [
                            { id: "o1", text: "Haisoku (Empeine)", isCorrect: true },
                            { id: "o2", text: "Kakato (Talón)", isCorrect: false },
                            { id: "o3", text: "Tsumasaki (Puntas de los dedos)", isCorrect: false },
                            { id: "o4", text: "Sokuto (Canto del pie)", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El Mawashi-Geri impacta con el empeine (Haisoku), permitiendo un arco circular de máximo alcance.",
                        hint: "La superficie plana superior del pie."
                    }
                ]
            }
        ]
    },

    // ── 5° KYU — CINTURÓN MORADO 🌸 ──────────────────────────────
    {
        id: "unit-kyu-5",
        title: "La Tormenta Púrpura",
        description: "Descubre los Kata: formas sagradas que codifican siglos de sabiduría marcial.",
        path: "tradicional",
        beltId: "kyu-5",
        levels: [
            {
                id: "level-kata-intro",
                number: 1,
                title: "Introducción al Kata",
                subtitle: "El kata es la enciclopedia viva del karate",
                tag: "Kata & Formas",
                icon: "📜",
                color: "purple",
                xpReward: 70,
                theory: {
                    title: "Kata (型) — Las Formas Sagradas",
                    subtitle: "La biblioteca marcial codificada en movimiento",
                    quote: "El kata es el maestro silencioso: enseña a quien sabe escuchar sus movimientos.",
                    content: [
                        "Kata significa literalmente 'forma' o 'molde'. Es una secuencia predeterminada de técnicas que simula un combate contra múltiples adversarios imaginarios.",
                        "Cada kata contiene Bunkai (aplicaciones prácticas) ocultos en sus movimientos. Los maestros codificaron técnicas letales en patrones que parecían inofensivos.",
                        "Los Heian (Pinan en algunos estilos) son los 5 kata básicos creados por Anko Itosu para la educación escolar en Okinawa. Su nombre significa 'paz y tranquilidad'.",
                        "TAIKYOKU SHODAN: El kata más básico, creado por Funakoshi como herramienta didáctica. Utiliza solo Gedan-Barai y Oi-Zuki en Zenkutsu-dachi."
                    ],
                    references: [
                        "Funakoshi, G. (1973). Karate-Do Kyohan.",
                        "Kanazawa, H. (2006). Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-kata-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa la palabra Kata (型) en el contexto del Karate?",
                        options: [
                            { id: "o1", text: "Forma o molde: secuencia de técnicas contra adversarios imaginarios", isCorrect: true },
                            { id: "o2", text: "Un tipo de combate libre sin reglas", isCorrect: false },
                            { id: "o3", text: "El nombre del cinturón de competición", isCorrect: false },
                            { id: "o4", text: "Una técnica de meditación estática", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Kata (型) es una forma predeterminada que codifica técnicas de combate en secuencias precisas.",
                        hint: "Es una pelea coreografiada contra oponentes imaginarios."
                    },
                    {
                        id: "q-kata-2",
                        type: "multiple_choice",
                        prompt: "¿Qué término designa la aplicación práctica oculta dentro de los movimientos del kata?",
                        options: [
                            { id: "o1", text: "Bunkai (分解 — Descomposición)", isCorrect: true },
                            { id: "o2", text: "Kihon (基本 — Básico)", isCorrect: false },
                            { id: "o3", text: "Randori (乱取 — Práctica libre)", isCorrect: false },
                            { id: "o4", text: "Mokuso (黙想 — Meditación)", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Bunkai significa literalmente 'descomponer' y se refiere a descifrar las aplicaciones reales de cada movimiento del kata.",
                        hint: "Bun = dividir/descomponer, Kai = entender/resolver."
                    }
                ]
            }
        ]
    },

    // ── 4° KYU — CINTURÓN MORADO CON BLANCO ☯️ ──────────────────
    {
        id: "unit-kyu-4",
        title: "La Dualidad del Camino",
        description: "Domina las combinaciones (Renraku-waza) y la fluidez entre ataque y defensa.",
        path: "tradicional",
        beltId: "kyu-4",
        levels: [
            {
                id: "level-renraku",
                number: 1,
                title: "Combinaciones (Renraku-Waza)",
                subtitle: "La fluidez entre ataque y defensa es la marca del guerrero intermedio",
                tag: "Combinaciones Tácticas",
                icon: "⚡",
                color: "purple",
                xpReward: 75,
                theory: {
                    title: "Renraku-Waza (連絡技) — Combinaciones Encadenadas",
                    subtitle: "Cuando las técnicas aisladas se convierten en torrentes",
                    quote: "Una sola gota no mueve la piedra; pero un torrente constante la destruye.",
                    content: [
                        "Renraku-waza es el arte de encadenar múltiples técnicas en secuencias fluidas y devastadoras.",
                        "Ejemplo básico: Kizami-Zuki → Gyaku-Zuki (jab seguido de golpe inverso). La primera técnica abre la guardia, la segunda penetra.",
                        "Ejemplo intermedio: Mawashi-Geri Jodan → Gyaku-Zuki Chudan. La patada alta distrae, el puño al cuerpo finaliza.",
                        "La clave es el ritmo (Hyoshi): alternar velocidades rápidas y lentas para romper la predictibilidad del adversario."
                    ],
                    references: [
                        "Kanazawa, H. (2009). Karate Fighting Techniques: The Complete Kumite."
                    ]
                },
                questions: [
                    {
                        id: "q-renraku-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa Renraku-Waza en el Karate?",
                        options: [
                            { id: "o1", text: "Combinaciones encadenadas de técnicas múltiples", isCorrect: true },
                            { id: "o2", text: "Un tipo de meditación sentada", isCorrect: false },
                            { id: "o3", text: "El nombre de un kata avanzado", isCorrect: false },
                            { id: "o4", text: "Un bloqueo con ambas manos", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Renraku (連絡) = conexión/encadenamiento, Waza (技) = técnica. Son técnicas encadenadas fluidamente.",
                        hint: "Piensa en 'conectar' varias técnicas en un flujo continuo."
                    }
                ]
            }
        ]
    },

    // ── 3° KYU — CINTURÓN CAFÉ (3 LÍNEAS BLANCAS) ⚔️ ──────────
    {
        id: "unit-kyu-3",
        title: "La Forja del Acero",
        description: "Perfecciona los Kata intermedios y comprende la estructura profunda del Bunkai.",
        path: "tradicional",
        beltId: "kyu-3",
        levels: [
            {
                id: "level-kata-intermedio",
                number: 1,
                title: "Kata Intermedio y Bunkai",
                subtitle: "Cada movimiento del kata oculta un secreto mortal",
                tag: "Kata Avanzado",
                icon: "📖",
                color: "amber",
                xpReward: 80,
                theory: {
                    title: "Kata Intermedios y su Bunkai",
                    subtitle: "Bassai-Dai, Kanku-Dai y Empi",
                    quote: "El kata habla en silencio; solo el estudioso paciente comprende su idioma.",
                    content: [
                        "BASSAI-DAI (Penetrar la fortaleza): Kata de potencia y determinación. Sus movimientos enseñan a romper la guardia del oponente con técnicas explosivas.",
                        "KANKU-DAI (Contemplar el cielo): Inspirado en el gesto de mirar al cielo con las manos formando un triángulo. Combina técnicas de todas las alturas.",
                        "EMPI (El vuelo del golondrina): Kata rápido y ágil con saltos y cambios de nivel. Enseña la ligereza y la velocidad.",
                        "El Bunkai de estos kata revela agarres (Tuidi), luxaciones (Kansetsu-waza) y proyecciones (Nage-waza) ocultas en movimientos aparentemente simples."
                    ],
                    references: [
                        "Abernethy, I. (2002). Bunkai-Jutsu: The Practical Application of Karate Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-kata-i-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa literalmente Bassai-Dai (抜塞大)?",
                        options: [
                            { id: "o1", text: "Penetrar la fortaleza (Grande)", isCorrect: true },
                            { id: "o2", text: "El vuelo del golondrina", isCorrect: false },
                            { id: "o3", text: "Contemplar el cielo", isCorrect: false },
                            { id: "o4", text: "Las diez manos", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Bassai = penetrar/extraer, Dai = grande. Simboliza la determinación de romper las defensas del enemigo.",
                        hint: "El nombre evoca una fortaleza que debe ser conquistada."
                    },
                    {
                        id: "q-kata-i-2",
                        type: "matching",
                        prompt: "Empareja cada Kata con su significado:",
                        explanation: "Bassai = Fortaleza, Kanku = Cielo, Empi = Golondrina.",
                        pairs: [
                            { id: "p1", left: "Bassai-Dai", right: "Penetrar la fortaleza" },
                            { id: "p2", left: "Kanku-Dai", right: "Contemplar el cielo" },
                            { id: "p3", left: "Empi", right: "El vuelo del golondrina" },
                        ]
                    }
                ]
            }
        ]
    },

    // ── 2° KYU — CINTURÓN CAFÉ (2 LÍNEAS BLANCAS) 🌉 ──────────
    {
        id: "unit-kyu-2",
        title: "El Puente entre Mundos",
        description: "Domina la distancia (Maai) y la estrategia del Kumite táctico.",
        path: "tradicional",
        beltId: "kyu-2",
        levels: [
            {
                id: "level-maai",
                number: 1,
                title: "Maai — La Distancia Sagrada",
                subtitle: "Quien controla la distancia, controla el combate",
                tag: "Estrategia & Distancia",
                icon: "📐",
                color: "amber",
                xpReward: 85,
                theory: {
                    title: "Maai (間合い) — El Arte de la Distancia",
                    subtitle: "Chika-Ma, To-Ma e Issoku-ittou-no-Maai",
                    quote: "La verdadera victoria se decide antes del primer golpe, en la gestión del espacio.",
                    content: [
                        "MAAI es la distancia relativa entre dos combatientes. No es una medida fija, sino dinámica, que cambia con cada movimiento.",
                        "CHIKA-MA (Distancia corta): Ambos pueden atacar sin avanzar. Zona de máximo peligro y explosividad.",
                        "TO-MA (Distancia larga): Ninguno puede atacar sin dar al menos un paso. Zona de observación y preparación.",
                        "ISSOKU-ITTOU-NO-MAAI (Un paso, un golpe): La distancia ideal donde un solo paso permite conectar una técnica decisiva."
                    ],
                    references: [
                        "Kanazawa, H. (2009). Karate Fighting Techniques."
                    ]
                },
                questions: [
                    {
                        id: "q-maai-1",
                        type: "matching",
                        prompt: "Empareja cada tipo de Maai con su descripción:",
                        explanation: "Chika-Ma = cerca, To-Ma = lejos, Issoku-ittou = distancia de un paso.",
                        pairs: [
                            { id: "p1", left: "Chika-Ma", right: "Distancia corta — Ataque inmediato sin avanzar" },
                            { id: "p2", left: "To-Ma", right: "Distancia larga — Requiere avanzar para atacar" },
                            { id: "p3", left: "Issoku-ittou-no-Maai", right: "Un paso = un golpe decisivo" },
                        ]
                    }
                ]
            }
        ]
    },

    // ── 1° KYU — CINTURÓN CAFÉ (1 LÍNEA BLANCA) 🏯 ──────────
    {
        id: "unit-kyu-1",
        title: "La Antesala del Dan",
        description: "Preparación integral para el examen de cinturón negro: Kihon, Kata y Kumite.",
        path: "tradicional",
        beltId: "kyu-1",
        levels: [
            {
                id: "level-preparacion-dan",
                number: 1,
                title: "Examen de Cinturón Negro",
                subtitle: "El último paso antes del primer paso verdadero",
                tag: "Preparación Integral",
                icon: "🏯",
                color: "amber",
                xpReward: 100,
                theory: {
                    title: "Preparación para el Examen de Dan",
                    subtitle: "Kihon, Kata, Kumite: los tres pilares del examen",
                    quote: "El cinturón negro no es el final; es el inicio del verdadero aprendizaje.",
                    content: [
                        "El examen de Shodan (1° Dan) evalúa tres pilares fundamentales: Kihon (técnicas básicas ejecutadas con maestría), Kata (formas con precisión y espíritu) y Kumite (combate con control y Zanshin).",
                        "KIHON: Se exigen todas las técnicas fundamentales ejecutadas con postura impecable, potencia y kiai.",
                        "KATA: Normalmente se evalúan Heian 1 al 5, Tekki Shodan y al menos un kata superior elegido por el aspirante.",
                        "KUMITE: Se evalúa Ippon Kumite (un paso), Jiyu Ippon Kumite (semiformal) y Jiyu Kumite (libre).",
                        "El espíritu de Fudoshin (mente inamovible) y Zanshin (alerta perpetua) son tan evaluados como la técnica misma."
                    ],
                    references: [
                        "Funakoshi, G. (1973). Karate-Do Kyohan.",
                        "Nakayama, M. (1966). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-dan-prep-1",
                        type: "multiple_choice",
                        prompt: "¿Cuáles son los tres pilares evaluados en el examen de Shodan?",
                        options: [
                            { id: "o1", text: "Kihon (Técnica básica), Kata (Formas) y Kumite (Combate)", isCorrect: true },
                            { id: "o2", text: "Velocidad, Fuerza y Resistencia", isCorrect: false },
                            { id: "o3", text: "Meditación, Flexibilidad y Kata", isCorrect: false },
                            { id: "o4", text: "Armas, Kata y Golpes", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El examen de Dan evalúa la trinidad del karate: Kihon, Kata y Kumite, junto con el espíritu marcial.",
                        hint: "Son los tres pilares clásicos de la formación del karate."
                    },
                    {
                        id: "q-dan-prep-2",
                        type: "multiple_choice",
                        prompt: "¿Qué estado mental se espera del aspirante durante todo el examen de Dan?",
                        options: [
                            { id: "o1", text: "Fudoshin (Mente inamovible) y Zanshin (Alerta perpetua)", isCorrect: true },
                            { id: "o2", text: "Relajación total sin concentración", isCorrect: false },
                            { id: "o3", text: "Agresividad máxima sin control", isCorrect: false },
                            { id: "o4", text: "Indiferencia ante el resultado", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Fudoshin (mente firme e inamovible) y Zanshin (alerta constante) reflejan la madurez mental del aspirante.",
                        hint: "Son dos conceptos japoneses sobre la fortaleza mental."
                    }
                ]
            }
        ]
    },

    // ── 1° DAN — SHODAN ⚫ ──────────────────────────────
    {
        id: "unit-dan-1",
        title: "El Primer Paso Verdadero",
        description: "Shodan: el cinturón negro marca el inicio real de la maestría marcial.",
        path: "tradicional",
        beltId: "dan-1",
        levels: [
            {
                id: "level-shodan-filosofia",
                number: 1,
                title: "Filosofía del Cinturón Negro",
                subtitle: "Shodan no es la meta; es el verdadero comienzo",
                tag: "Filosofía Dan",
                icon: "🌑",
                color: "gold",
                xpReward: 100,
                theory: {
                    title: "Shodan (初段) — El Primer Grado",
                    subtitle: "El significado profundo del cinturón negro",
                    quote: "Sho significa 'principio'. Shodan significa: el principio del verdadero camino.",
                    content: [
                        "En occidente, el cinturón negro se percibe como el nivel máximo. En Japón, Shodan significa literalmente 'primer grado': el comienzo del aprendizaje real.",
                        "Jigoro Kano (fundador del Judo) creó el sistema de Dan en 1883. Gichin Funakoshi lo adoptó para el Karate. Los primeros cinturones negros de karate se otorgaron en 1924.",
                        "El cinturón negro no indica perfección; indica que el karateka ha dominado los fundamentos y está listo para estudiar en profundidad.",
                        "En la tradición, el obi negro se desgasta con los años hasta volver a ser blanco: símbolo del ciclo eterno de aprendizaje."
                    ],
                    references: [
                        "Funakoshi, G. (1975). Karate-Do: My Way of Life."
                    ]
                },
                questions: [
                    {
                        id: "q-shodan-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa literalmente 'Shodan' (初段)?",
                        options: [
                            { id: "o1", text: "Primer grado / Primer peldaño", isCorrect: true },
                            { id: "o2", text: "Maestro supremo", isCorrect: false },
                            { id: "o3", text: "Nivel perfecto", isCorrect: false },
                            { id: "o4", text: "Guerrero invencible", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Sho (初) = primero/inicio, Dan (段) = grado/peldaño. Shodan es el primer peldaño de la escalera de la maestría.",
                        hint: "El nombre indica un comienzo, no un final."
                    },
                    {
                        id: "q-shodan-2",
                        type: "true_false",
                        prompt: "¿El sistema de grados Dan fue creado originalmente para el Karate?",
                        correctBool: false,
                        explanation: "Falso. Jigoro Kano lo creó para el Judo en 1883 y Funakoshi lo adaptó al Karate décadas después.",
                        hint: "El creador del Judo ideó este sistema."
                    }
                ]
            }
        ]
    },

    // ── 2° DAN — NIDAN ⚫⚫ ──────────────────────────────
    {
        id: "unit-dan-2",
        title: "La Profundidad del Río",
        description: "Nidan: biomecánica avanzada, Kime y la ciencia del impacto.",
        path: "tradicional",
        beltId: "dan-2",
        levels: [
            {
                id: "level-kime",
                number: 1,
                title: "Kime — El Foco del Poder",
                subtitle: "Toda la energía del universo concentrada en un instante",
                tag: "Biomecánica Avanzada",
                icon: "💥",
                color: "gold",
                xpReward: 110,
                theory: {
                    title: "Kime (決め) — La Concentración del Poder",
                    subtitle: "El instante de máxima contracción y foco",
                    quote: "Kime es cuando todo tu ser se condensa en un solo punto, en una fracción de segundo.",
                    content: [
                        "Kime es el momento de máxima contracción muscular y foco mental en el punto exacto de impacto de una técnica.",
                        "No es tensión constante; es la transición explosiva de relajación total a contracción total en milisegundos.",
                        "Involucra la cadena cinética completa: desde los pies (enraizamiento), pasando por caderas (Koshi), tronco (Tanden) y extremidad que ejecuta.",
                        "Sin Kime, un golpe es un simple movimiento. Con Kime, se convierte en una técnica marcial devastadora."
                    ],
                    references: [
                        "Nakayama, M. (1966). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-kime-1",
                        type: "multiple_choice",
                        prompt: "¿Qué es el Kime (決め) en el Karate?",
                        options: [
                            { id: "o1", text: "El momento de máxima concentración de fuerza y foco en el punto de impacto", isCorrect: true },
                            { id: "o2", text: "Un tipo de patada voladora", isCorrect: false },
                            { id: "o3", text: "El grito que se emite al final del kata", isCorrect: false },
                            { id: "o4", text: "La meditación antes de combatir", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Kime (決め) es la decisión/determinación: la concentración explosiva de toda la energía en el instante del impacto.",
                        hint: "Viene de 'kimeru' (decidir/determinar)."
                    }
                ]
            }
        ]
    },

    // ── 3° DAN — SANDAN ⚫⚫⚫ ──────────────────────────────
    {
        id: "unit-dan-3",
        title: "La Montaña Interior",
        description: "Sandan: la filosofía del Budo, el Dojo Kun y las 20 reglas de Funakoshi.",
        path: "tradicional",
        beltId: "dan-3",
        levels: [
            {
                id: "level-dojo-kun",
                number: 1,
                title: "Dojo Kun y Niju Kun",
                subtitle: "Las leyes morales del guerrero que trascienden el tatami",
                tag: "Filosofía del Budo",
                icon: "📿",
                color: "gold",
                xpReward: 120,
                theory: {
                    title: "Dojo Kun (道場訓) y Niju Kun (二十訓)",
                    subtitle: "Las reglas éticas del Karate de Funakoshi",
                    quote: "El objetivo último del Karate no es la victoria en el combate, sino la perfección del carácter.",
                    content: [
                        "El DOJO KUN son los 5 preceptos recitados al final de cada clase: 1) Esforzarse por la perfección del carácter, 2) Defender los caminos de la verdad, 3) Fomentar el espíritu de esfuerzo, 4) Honrar los principios de etiqueta, 5) Guardarse contra el comportamiento impulsivo.",
                        "Las NIJU KUN son las 20 reglas de Gichin Funakoshi, incluyendo: 'El karate comienza y termina con Rei', 'No existe primer ataque en karate' y 'El karate es un auxiliar de la justicia'.",
                        "Estas reglas demuestran que el Karate no es solo un arte de combate, sino un camino de desarrollo moral y espiritual (Do = Camino)."
                    ],
                    references: [
                        "Funakoshi, G. (1938). The Twenty Guiding Principles of Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-dojokun-1",
                        type: "multiple_choice",
                        prompt: "¿Cuál es el primer precepto del Dojo Kun?",
                        options: [
                            { id: "o1", text: "Esforzarse por la perfección del carácter", isCorrect: true },
                            { id: "o2", text: "Ganar todos los combates", isCorrect: false },
                            { id: "o3", text: "Entrenar 8 horas diarias", isCorrect: false },
                            { id: "o4", text: "Nunca retroceder ante el enemigo", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Hitotsu! Jinkaku kansei ni tsutomuru koto — El objetivo supremo es perfeccionar el carácter humano.",
                        hint: "No tiene que ver con combatir, sino con crecer como persona."
                    }
                ]
            }
        ]
    },

    // ── 4° DAN — YONDAN ⚫⚫⚫⚫ ──────────────────────────
    {
        id: "unit-dan-4",
        title: "El Espejo del Maestro",
        description: "Yondan: pedagogía marcial, el arte de enseñar y formar al siguiente Sensei.",
        path: "tradicional",
        beltId: "dan-4",
        levels: [
            {
                id: "level-pedagogia",
                number: 1,
                title: "El Arte de Enseñar (Shidoin)",
                subtitle: "Enseñar es la forma más profunda de aprender",
                tag: "Pedagogía Marcial",
                icon: "🎓",
                color: "gold",
                xpReward: 130,
                theory: {
                    title: "Shidoin (指導員) — El Instructor Marcial",
                    subtitle: "Transmitir el arte con exactitud y humanidad",
                    quote: "El mejor maestro no impone; inspira. No ordena; guía.",
                    content: [
                        "A partir de Yondan, el karateka asume formalmente el rol de Shidoin (instructor calificado).",
                        "La pedagogía marcial exige: 1) Demostración impecable, 2) Explicación clara en terminología japonesa y local, 3) Corrección individualizada, 4) Fomento del espíritu Osu.",
                        "El Sensei (先生 = nacido antes) no es un título de habilidad, sino de responsabilidad: quien enseña carga con la integridad del arte para las futuras generaciones."
                    ],
                    references: [
                        "Lowry, D. (2006). In the Dojo: A Guide to the Rituals and Etiquette."
                    ]
                },
                questions: [
                    {
                        id: "q-shidoin-1",
                        type: "multiple_choice",
                        prompt: "¿Qué significa literalmente Sensei (先生)?",
                        options: [
                            { id: "o1", text: "Nacido antes / Quien precede en el camino", isCorrect: true },
                            { id: "o2", text: "Luchador invicto", isCorrect: false },
                            { id: "o3", text: "Cinturón negro de 5° Dan", isCorrect: false },
                            { id: "o4", text: "Director del dojo", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Sen (先) = antes/previo, Sei (生) = nacido/vida. Indica experiencia previa, no superioridad.",
                        hint: "El significado está en los kanjis: 先 (antes) + 生 (nacido)."
                    }
                ]
            }
        ]
    },

    // ── 5° DAN — GODAN ⚫⚫⚫⚫⚫ ──────────────────────────
    {
        id: "unit-dan-5",
        title: "El Dragón Oculto",
        description: "Godan: maestría de los kata superiores y la esencia oculta del Bunkai.",
        path: "tradicional",
        beltId: "dan-5",
        levels: [
            {
                id: "level-kata-superior",
                number: 1,
                title: "Kata Superiores",
                subtitle: "Las formas maestras que codifican la sabiduría suprema",
                tag: "Kata Maestro",
                icon: "🐉",
                color: "gold",
                xpReward: 140,
                theory: {
                    title: "Kata Superiores — Unsu, Gojushiho y Sochin",
                    subtitle: "Los kata reservados para la maestría",
                    quote: "En el kata superior, cada respiración es una técnica y cada pausa es una trampa.",
                    content: [
                        "UNSU (Manos de nube): Considerado el kata más complejo del Shotokan. Incluye saltos, giros en 360° y cambios dramáticos de nivel.",
                        "GOJUSHIHO DAI/SHO (54 pasos): Kata extenso y detallado con técnicas de dedos (Nukite) y movimientos de grulla.",
                        "SOCHIN (Gran calma/Fuerza tranquila): Kata en posición Fudo-dachi (enraizada) que enseña la estabilidad bajo presión extrema."
                    ],
                    references: [
                        "Kanazawa, H. (2006). Karate: The Complete Kata."
                    ]
                },
                questions: [
                    {
                        id: "q-kata-s-1",
                        type: "matching",
                        prompt: "Empareja cada Kata superior con su significado:",
                        explanation: "Unsu = Manos de nube, Gojushiho = 54 pasos, Sochin = Gran calma.",
                        pairs: [
                            { id: "p1", left: "Unsu", right: "Manos de nube — El más complejo" },
                            { id: "p2", left: "Gojushiho", right: "54 pasos — Extenso y detallado" },
                            { id: "p3", left: "Sochin", right: "Gran calma — Estabilidad bajo presión" },
                        ]
                    }
                ]
            }
        ]
    },

    // ── 6° DAN — ROKUDAN ⚫×6 ──────────────────────────────
    {
        id: "unit-dan-6",
        title: "La Noche Estrellada",
        description: "Rokudan: historia de los cuatro grandes estilos y sus fundadores legendarios.",
        path: "tradicional",
        beltId: "dan-6",
        levels: [
            {
                id: "level-estilos",
                number: 1,
                title: "Los Cuatro Grandes Estilos",
                subtitle: "Shotokan, Goju-Ryu, Shito-Ryu y Wado-Ryu",
                tag: "Historia de Estilos",
                icon: "🌟",
                color: "gold",
                xpReward: 150,
                theory: {
                    title: "Los Cuatro Estilos Principales del Karate",
                    subtitle: "Reconocidos por la WKF como estilos tradicionales",
                    quote: "Cuatro ríos, un solo océano. Cuatro estilos, un solo Karate.",
                    content: [
                        "SHOTOKAN (松濤館): Fundado por Gichin Funakoshi. Posiciones largas y profundas, técnicas lineales y potentes. El estilo más practicado del mundo.",
                        "GOJU-RYU (剛柔流): Fundado por Chojun Miyagi. Combina técnicas duras (Go) y suaves (Ju). Énfasis en la respiración y el trabajo a corta distancia.",
                        "SHITO-RYU (糸東流): Fundado por Kenwa Mabuni. Integra las tradiciones de Shuri-Te y Naha-Te. Posee el mayor número de katas de todos los estilos.",
                        "WADO-RYU (和道流): Fundado por Hironori Ohtsuka. Fusiona karate con Jujutsu. Énfasis en esquivas (Nagashi) y eficiencia de movimiento."
                    ],
                    references: [
                        "McCarthy, P. (1999). Ancient Okinawan Martial Arts."
                    ]
                },
                questions: [
                    {
                        id: "q-estilos-1",
                        type: "matching",
                        prompt: "Empareja cada estilo con su fundador:",
                        explanation: "Los cuatro pilares del karate moderno y sus creadores.",
                        pairs: [
                            { id: "p1", left: "Shotokan", right: "Gichin Funakoshi" },
                            { id: "p2", left: "Goju-Ryu", right: "Chojun Miyagi" },
                            { id: "p3", left: "Shito-Ryu", right: "Kenwa Mabuni" },
                        ]
                    }
                ]
            }
        ]
    },

    // ── 7° DAN — NANADAN ⚫×7 ──────────────────────────────
    {
        id: "unit-dan-7",
        title: "El Vacío Perfecto",
        description: "Nanadan: Mushin, Fudoshin y la mente inmutable del guerrero supremo.",
        path: "tradicional",
        beltId: "dan-7",
        levels: [
            {
                id: "level-mushin",
                number: 1,
                title: "Mushin — La Mente Vacía",
                subtitle: "Cuando la mente no piensa, el cuerpo actúa en perfección",
                tag: "Filosofía Zen",
                icon: "🧘",
                color: "gold",
                xpReward: 160,
                theory: {
                    title: "Mushin (無心) — La Mente Sin Mente",
                    subtitle: "El estado supremo de la conciencia marcial",
                    quote: "La mente debe ser como el agua: cuando está quieta, refleja la luna con claridad perfecta.",
                    content: [
                        "MUSHIN (無心): Literalmente 'sin mente'. Es el estado donde el karateka reacciona instintivamente, sin pensamiento consciente que retrase la acción.",
                        "FUDOSHIN (不動心): La mente inamovible. Ninguna emoción (miedo, ira, orgullo) perturba la calma interior del maestro.",
                        "ZANSHIN (残心): La mente que permanece. Incluso después de ejecutar una técnica, la atención nunca se relaja.",
                        "Estos tres estados mentales (Mushin, Fudoshin, Zanshin) forman el triángulo de la maestría psicológica del Budo."
                    ],
                    references: [
                        "Suzuki, D.T. (1959). Zen and Japanese Culture."
                    ]
                },
                questions: [
                    {
                        id: "q-mushin-1",
                        type: "matching",
                        prompt: "Empareja cada estado mental con su significado:",
                        explanation: "Mushin = sin mente, Fudoshin = mente inamovible, Zanshin = mente que permanece.",
                        pairs: [
                            { id: "p1", left: "Mushin (無心)", right: "Mente vacía — Reacción instintiva sin pensamiento" },
                            { id: "p2", left: "Fudoshin (不動心)", right: "Mente inamovible — Calma ante cualquier situación" },
                            { id: "p3", left: "Zanshin (残心)", right: "Mente que permanece — Alerta constante" },
                        ]
                    }
                ]
            }
        ]
    },

    // ── 8° DAN — HACHIDAN ⚫×8 ──────────────────────────────
    {
        id: "unit-dan-8",
        title: "La Calma del Océano",
        description: "Hachidan: Wabi-Sabi, la belleza de la imperfección en el arte marcial.",
        path: "tradicional",
        beltId: "dan-8",
        levels: [
            {
                id: "level-wabi-sabi",
                number: 1,
                title: "Wabi-Sabi en el Budo",
                subtitle: "La belleza reside en lo imperfecto, lo efímero y lo incompleto",
                tag: "Estética Zen",
                icon: "🍂",
                color: "gold",
                xpReward: 170,
                theory: {
                    title: "Wabi-Sabi (侘寂) en el Karate",
                    subtitle: "La perfección de la imperfección",
                    quote: "El maestro más grande reconoce que siempre es un estudiante. Esa humildad es la verdadera perfección.",
                    content: [
                        "Wabi-Sabi es la estética japonesa que encuentra belleza en la imperfección, la transitoriedad y la incompletitud.",
                        "Aplicado al Budo: ninguna técnica será jamás perfecta. Cada repetición revela nuevas capas de comprensión. El camino no tiene final.",
                        "El cinturón negro que se desgasta hasta volver a ser blanco encarna perfectamente el Wabi-Sabi: el ciclo eterno de aprendizaje y humildad."
                    ],
                    references: [
                        "Koren, L. (1994). Wabi-Sabi for Artists, Designers, Poets & Philosophers."
                    ]
                },
                questions: [
                    {
                        id: "q-wabi-1",
                        type: "multiple_choice",
                        prompt: "¿Qué concepto japonés celebra la belleza de la imperfección y la transitoriedad?",
                        options: [
                            { id: "o1", text: "Wabi-Sabi (侘寂)", isCorrect: true },
                            { id: "o2", text: "Bushido (武士道)", isCorrect: false },
                            { id: "o3", text: "Ikebana (生け花)", isCorrect: false },
                            { id: "o4", text: "Origami (折り紙)", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Wabi-Sabi es la estética zen que encuentra perfección en lo imperfecto, lo efímero y lo incompleto.",
                        hint: "Es un concepto estético, no una técnica marcial."
                    }
                ]
            }
        ]
    },

    // ── 9° DAN — KUDAN ⚫×9 ──────────────────────────────
    {
        id: "unit-dan-9",
        title: "El Viento Eterno",
        description: "Kudan: el legado del maestro, la preservación y transmisión del arte.",
        path: "tradicional",
        beltId: "dan-9",
        levels: [
            {
                id: "level-legado",
                number: 1,
                title: "El Legado del Maestro",
                subtitle: "Transmitir el arte intacto a las generaciones futuras",
                tag: "Legado & Tradición",
                icon: "🕊️",
                color: "gold",
                xpReward: 180,
                theory: {
                    title: "Shu-Ha-Ri (守破離) — Las Tres Etapas del Aprendizaje",
                    subtitle: "El ciclo eterno del discípulo al maestro",
                    quote: "Shu: obedece la regla. Ha: rompe la regla. Ri: sé la regla.",
                    content: [
                        "SHU (守 — Proteger/Obedecer): El estudiante imita fielmente al maestro sin cuestionar. Absorbe la forma exacta.",
                        "HA (破 — Romper): El practicante avanzado comienza a experimentar, adaptar y cuestionar las formas aprendidas.",
                        "RI (離 — Trascender): El maestro trasciende las formas. Ya no sigue reglas porque su cuerpo y mente SON la regla.",
                        "Kudan marca la etapa Ri: el maestro ha interiorizado el arte tan profundamente que cada movimiento suyo es expresión pura."
                    ],
                    references: [
                        "Hatsumi, M. (2006). Japanese Sword Fighting."
                    ]
                },
                questions: [
                    {
                        id: "q-shuhari-1",
                        type: "matching",
                        prompt: "Empareja cada etapa de Shu-Ha-Ri con su significado:",
                        explanation: "Shu = obedecer, Ha = romper, Ri = trascender.",
                        pairs: [
                            { id: "p1", left: "Shu (守)", right: "Obedecer — Imitar fielmente al maestro" },
                            { id: "p2", left: "Ha (破)", right: "Romper — Experimentar y adaptar" },
                            { id: "p3", left: "Ri (離)", right: "Trascender — Ser la regla misma" },
                        ]
                    }
                ]
            }
        ]
    },

    // ── 10° DAN — JUDAN ⚫×10 ──────────────────────────────
    {
        id: "unit-dan-10",
        title: "La Corona del Cielo",
        description: "Judan: Shin-Gi-Tai — la trinidad sagrada de mente, técnica y cuerpo.",
        path: "tradicional",
        beltId: "dan-10",
        levels: [
            {
                id: "level-shin-gi-tai",
                number: 1,
                title: "Shin-Gi-Tai — La Trinidad Sagrada",
                subtitle: "Mente, técnica y cuerpo se funden en la unidad absoluta",
                tag: "Maestría Suprema",
                icon: "👑",
                color: "gold",
                xpReward: 200,
                theory: {
                    title: "Shin-Gi-Tai (心技体) — La Unidad Perfecta",
                    subtitle: "La cumbre de la pirámide marcial",
                    quote: "Cuando el corazón, la técnica y el cuerpo son uno solo, has alcanzado el Karate verdadero.",
                    content: [
                        "SHIN (心 — Corazón/Mente/Espíritu): La fortaleza mental, la ética y la compasión del guerrero. Sin Shin, el arte es vacío.",
                        "GI (技 — Técnica/Habilidad): La perfección técnica forjada por décadas de práctica incansable. Sin Gi, el espíritu no tiene expresión.",
                        "TAI (体 — Cuerpo/Físico): La salud, la fortaleza y la resistencia que sostienen al espíritu y la técnica. Sin Tai, nada se materializa.",
                        "Judan (10° Dan) es el rango supremo del Karate, otorgado históricamente solo a los fundadores de estilos y a los maestros cuya contribución al arte es inconmensurable."
                    ],
                    references: [
                        "Funakoshi, G. (1975). Karate-Do: My Way of Life.",
                        "Nakayama, M. (1966). Dynamic Karate."
                    ]
                },
                questions: [
                    {
                        id: "q-shingi-1",
                        type: "matching",
                        prompt: "Empareja cada componente de Shin-Gi-Tai:",
                        explanation: "Shin = mente/espíritu, Gi = técnica/habilidad, Tai = cuerpo/físico.",
                        pairs: [
                            { id: "p1", left: "Shin (心)", right: "Corazón, mente y espíritu del guerrero" },
                            { id: "p2", left: "Gi (技)", right: "Técnica y habilidad perfeccionada" },
                            { id: "p3", left: "Tai (体)", right: "Cuerpo, salud y fortaleza física" },
                        ]
                    },
                    {
                        id: "q-shingi-2",
                        type: "multiple_choice",
                        prompt: "¿A quiénes se ha otorgado históricamente el 10° Dan (Judan)?",
                        options: [
                            { id: "o1", text: "Solo a fundadores de estilos y maestros de contribución histórica inconmensurable", isCorrect: true },
                            { id: "o2", text: "A cualquier competidor que gane 3 campeonatos mundiales", isCorrect: false },
                            { id: "o3", text: "A todos los que entrenen más de 40 años", isCorrect: false },
                            { id: "o4", text: "A instructores con más de 100 alumnos", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El 10° Dan es un honor reservado para los pilares del arte cuya contribución transformó la historia del Karate.",
                        hint: "Es el rango más alto que existe y se concede muy raramente."
                    }
                ]
            }
        ]
    },

    // ==========================================
    // CAMINO DEPORTIVO WKF 🏆
    // ==========================================
    {
        id: "unit-wkf-1",
        title: "Reglamento y Criterios Oficiales WKF",
        description: "Domina los 6 criterios técnicos, el sistema de puntos de 1 a 3 y el protocolo del árbitro.",
        path: "wkf",
        levels: [
            {
                id: "level-consenso-wkf",
                number: 1,
                title: "Del Shobu Ippon a la WKF",
                subtitle: "La unificación mundial y la seguridad de los competidores",
                tag: "Reglamento Deportivo",
                icon: "🏆",
                color: "gold",
                xpReward: 50,
                theory: {
                    title: "La Evolución del Kumite Deportivo WKF",
                    subtitle: "De Shobu Ippon al sistema de alta dinámica de 8 puntos",
                    quote: "El objetivo era transformar el arte marcial en un deporte internacional viable y seguro, aspirando al reconocimiento olímpico.",
                    content: [
                        "Originalmente, bajo el sistema de Shobu Ippon ('un punto definitivo'), los combates buscaban emular un golpe perfecto (Kime). Sin embargo, esto presentaba riesgos elevados de lesiones y alta subjetividad en los fallos arbitrales.",
                        "Con la creación de la WUKO en 1970 (hoy Federación Mundial de Karate - WKF), se acordó unificar los estilos bajo un marco común.",
                        "Se introdujo el sistema de puntuación múltiple (Sanbon Shobu y luego la regla de diferencia de 8 puntos), categorías de peso y equipo de protección homologado (guantines, espinilleras, bucal, pechera).",
                        "Esto redujo drásticamente los accidentes, aumentó la emoción para los espectadores y consolidó criterios objetivos para la valoración técnica."
                    ],
                    images: [
                        {
                            src: "/images/kuma-intro-puntos.jpg",
                            alt: "Sistema de Puntuación WKF Kuma Dojo",
                            caption: "Fig 4. Sistema oficial de valoración y puntuación deportiva WKF"
                        }
                    ],
                    references: [
                        "Abernethy, I. (2013). Traditional Karate vs Sport Karate: One Point vs Multiple Points.",
                        "World Karate Federation. (2023-2026). WKF Karate Competition Rules."
                    ]
                },
                questions: [
                    {
                        id: "q-wkf-hist-1",
                        type: "multiple_choice",
                        prompt: "¿En qué año se fundó la WUKO (predecesora de la actual WKF) para unificar el karate deportivo?",
                        options: [
                            { id: "o1", text: "1970", isCorrect: true },
                            { id: "o2", text: "1922", isCorrect: false },
                            { id: "o3", text: "2000", isCorrect: false },
                            { id: "o4", text: "1940", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "En 1970 se celebró en Tokio el primer campeonato unificado y nació la WUKO (luego WKF).",
                        hint: "Ocurrió 48 años después de la demostración de Funakoshi en Tokio."
                    },
                    {
                        id: "q-wkf-hist-2",
                        type: "multiple_choice",
                        prompt: "¿Cuál es la diferencia de puntos con la que finaliza un combate por superioridad técnica manifiesta?",
                        options: [
                            { id: "o1", text: "8 puntos de ventaja", isCorrect: true },
                            { id: "o2", text: "3 puntos de ventaja", isCorrect: false },
                            { id: "o3", text: "15 puntos de ventaja", isCorrect: false },
                            { id: "o4", text: "5 puntos de ventaja", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "En el reglamento WKF, una ventaja clara de 8 puntos sobre el rival finaliza el encuentro inmediatamente.",
                        hint: "Es el número que define la victoria antes de tiempo en Kumite WKF."
                    }
                ]
            },
            {
                id: "level-criterios-tecnicos",
                number: 2,
                title: "Los 6 Criterios de Puntuación",
                subtitle: "Sin estos 6 requisitos, ningún golpe puede ser válido",
                tag: "Criterios WKF",
                icon: "🏆",
                color: "blue",
                xpReward: 70,
                theory: {
                    title: "Los 6 Criterios Técnicos para Conceder Puntos",
                    subtitle: "Regla de Oro: Todo punto debe cumplir obligatoriamente los 6 pilares",
                    quote: "Una técnica sólo se considerará puntuable cuando sea ejecutada en una zona válida con los 6 criterios técnicos plenamente satisfechos.",
                    content: [
                        "1. Buena Forma: Técnica con características de eficacia probable dentro de los conceptos tradicionales del Karate. Debe mostrar pureza y alineación biomecánica.",
                        "2. Actitud Deportiva: Refleja una actitud no maliciosa y de gran concentración durante la ejecución. El competidor debe mostrar respeto y compostura.",
                        "3. Aplicación Vigorosa: Demuestra potencia, velocidad y clara voluntad de éxito. El golpe debe ser contundente pero con control absoluto.",
                        "4. Zanshin (Alerta): Estado de compromiso mental y físico continuado tras el ataque. Se mantiene total atención en el oponente, listo para defender o continuar la acción.",
                        "5. Buen Timing: Ejecución de la técnica en el momento preciso de máxima vulnerabilidad del oponente.",
                        "6. Distancia Correcta: El golpe llega al punto de impacto con precisión milimétrica (skin touch en el cuerpo o a 5-10 cm con control en la cara)."
                    ],
                    bulletPoints: [
                        { title: "1. Buena Forma", desc: "Mecánica pura y postura sólida.", image: "/images/kuma-buena-forma.jpg" },
                        { title: "2. Actitud Deportiva", desc: "Compostura, respeto y autocontrol.", image: "/images/kuma-actitud-deportiva.jpg" },
                        { title: "3. Aplicación Vigorosa", desc: "Velocidad y potencia controlada.", image: "/images/kuma-aplicacion-vigorosa.jpg" },
                        { title: "4. Zanshin", desc: "Alerta mental continuada post-ataque.", image: "/images/kuma-zanshing-v2.jpg" },
                        { title: "5. Buen Timing", desc: "Momento exacto de oportunidad.", image: "/images/kuma-buen-timing.jpg" },
                        { title: "6. Distancia Correcta", desc: "Precisión y control de contacto.", image: "/images/kuma-distancia-correcta.jpg" },
                    ],
                    references: [
                        "WKF Competition Rules (2023-2026). Artículo 6: Criterios de Puntuación."
                    ]
                },
                questions: [
                    {
                        id: "q-crit-1",
                        type: "image_choice",
                        prompt: "¿Qué criterio técnico WKF representa esta imagen oficial de Kuma Dojo?",
                        image: "/images/kuma-zanshing-v2.jpg",
                        options: [
                            { id: "o1", text: "Zanshin (Estado de alerta continuo)", isCorrect: true },
                            { id: "o2", text: "Falta por pasividad", isCorrect: false },
                            { id: "o3", text: "Fin del tiempo reglamentario", isCorrect: false },
                            { id: "o4", text: "Petición de descanso", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Representa el Zanshin: mantener la guardia, enfoque visual y disposición mental tras lanzar una técnica.",
                        hint: "Es el estado de concentración y presencia que nunca se pierde tras el ataque."
                    },
                    {
                        id: "q-crit-2",
                        type: "multiple_choice",
                        prompt: "Si un atleta conecta un golpe con velocidad, pero voltea la cara y celebra antes de que el árbitro detenga el combate, ¿por qué NO se debe otorgar el punto?",
                        options: [
                            { id: "o1", text: "Porque perdió el Zanshin (Alerta continuada)", isCorrect: true },
                            { id: "o2", text: "Porque las patadas valen más", isCorrect: false },
                            { id: "o3", text: "Porque el árbitro estaba de espaldas", isCorrect: false },
                            { id: "o4", text: "Porque los golpes al pecho no valen", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Bajar la guardia o celebrar antes de tiempo anula el Zanshin, lo cual descalifica la técnica como punto válido.",
                        hint: "Tiene que ver con la atención ininterrumpida hacia el adversario."
                    },
                    {
                        id: "q-crit-3",
                        type: "image_choice",
                        prompt: "Observa la imagen. ¿A cuál de los 6 criterios técnicos corresponde?",
                        image: "/images/kuma-buen-timing.jpg",
                        options: [
                            { id: "o1", text: "Buen Timing (Oportunidad precisa)", isCorrect: true },
                            { id: "o2", text: "Exceso de contacto", isCorrect: false },
                            { id: "o3", text: "Salida del tatami", isCorrect: false },
                            { id: "o4", text: "Empujón antirreglamentario", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Buen Timing consiste en anticipar o interceptar en la fracción de segundo precisa.",
                        hint: "Momento oportuno donde el adversario no puede defender."
                    }
                ]
            },
            {
                id: "level-puntos-kumite",
                number: 3,
                title: "El Sistema de Puntos (Yuko, Waza-ari, Ippon)",
                subtitle: "Valoración técnica y señales oficiales de los jueces",
                tag: "Puntuación WKF",
                icon: "🏆",
                color: "red",
                xpReward: 75,
                theory: {
                    title: "Escala Oficial de Puntuación Kumite WKF",
                    subtitle: "Yuko (1 pt), Waza-ari (2 pts) e Ippon (3 pts)",
                    quote: "Cada nivel de puntuación recompensa la dificultad técnica, la espectacularidad y el control del golpe.",
                    content: [
                        "IPPON (3 PUNTOS):",
                        "● Patadas a la zona alta (Jodan Geri) en rostro, cabeza o cuello.",
                        "● Cualquier técnica puntuable ejecutada sobre un adversario derribado, caído o que esté en el suelo.",
                        "WAZA-ARI (2 PUNTOS):",
                        "● Patadas a la zona media (Chudan Geri) en abdomen, pecho o espalda.",
                        "YUKO (1 PUNTO):",
                        "● Puño directo (Tsuki) a zona media o alta.",
                        "● Golpe circular de puño (Uchi) a la zona alta con control absoluto."
                    ],
                    bulletPoints: [
                        { title: "IPPON - 3 Puntos", desc: "Jodan Geri o técnica sobre rival caído.", image: "/images/kuma-arbitro-puntos-ippon.jpg", badge: "3 Puntos" },
                        { title: "WAZA-ARI - 2 Puntos", desc: "Chudan Geri (patada al cuerpo).", image: "/images/kuma-arbitro-puntos-waza-ari.jpg", badge: "2 Puntos" },
                        { title: "YUKO - 1 Punto", desc: "Tsuki o Uchi a zona puntuable.", image: "/images/kuma-arbitro-puntos-yuko.jpg", badge: "1 Punto" },
                    ],
                    references: [
                        "WKF Competition Rules. Apéndice de Señales y Gestos de Arbitraje."
                    ]
                },
                questions: [
                    {
                        id: "q-puntos-1",
                        type: "image_choice",
                        prompt: "¿Qué puntuación y técnica indica esta señal del árbitro con el brazo extendido a 45° hacia arriba?",
                        image: "/images/kuma-arbitro-puntos-ippon.jpg",
                        options: [
                            { id: "o1", text: "IPPON (3 Puntos)", isCorrect: true },
                            { id: "o2", text: "YUKO (1 Punto)", isCorrect: false },
                            { id: "o3", text: "WAZA-ARI (2 Puntos)", isCorrect: false },
                            { id: "o4", text: "Advertencia por salida", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El brazo levantado a 45 grados por encima del hombro es la señal oficial para conceder IPPON (3 puntos).",
                        hint: "Es el puntaje más alto del Karate WKF."
                    },
                    {
                        id: "q-puntos-2",
                        type: "image_choice",
                        prompt: "¿Qué puntuación indica la señal con el brazo paralelo al suelo?",
                        image: "/images/kuma-arbitro-puntos-waza-ari.jpg",
                        options: [
                            { id: "o1", text: "WAZA-ARI (2 Puntos)", isCorrect: true },
                            { id: "o2", text: "IPPON (3 Puntos)", isCorrect: false },
                            { id: "o3", text: "YUKO (1 Punto)", isCorrect: false },
                            { id: "o4", text: "Empate técnico", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "El brazo horizontal a la altura del hombro indica Waza-ari (2 puntos), otorgado por Chudan Geri.",
                        hint: "Vale 2 puntos y se otorga por patadas al torso."
                    },
                    {
                        id: "q-puntos-3",
                        type: "image_choice",
                        prompt: "¿Qué puntuación señala el árbitro con el brazo inclinado 45° hacia abajo?",
                        image: "/images/kuma-arbitro-puntos-yuko.jpg",
                        options: [
                            { id: "o1", text: "YUKO (1 Punto)", isCorrect: true },
                            { id: "o2", text: "IPPON (3 Puntos)", isCorrect: false },
                            { id: "o3", text: "Descalificación", isCorrect: false },
                            { id: "o4", text: "Falta por agarre", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Brazo apuntando a 45 grados hacia abajo señala Yuko (1 punto), por Tsuki o Uchi válidos.",
                        hint: "Es el punto básico de puño."
                    },
                    {
                        id: "q-puntos-4",
                        type: "matching",
                        prompt: "Empareja cada técnica con su puntaje reglamentario WKF:",
                        explanation: "Jodan Geri = Ippon (3 pts), Chudan Geri = Waza-ari (2 pts), Tsuki válido = Yuko (1 pt).",
                        pairs: [
                            { id: "p1", left: "Patada a la cabeza (Jodan Geri)", right: "IPPON (3 Pts)" },
                            { id: "p2", left: "Patada al torso (Chudan Geri)", right: "WAZA-ARI (2 Pts)" },
                            { id: "p3", left: "Puño al pecho o cara (Tsuki)", right: "YUKO (1 Pt)" },
                        ]
                    }
                ]
            },
            {
                id: "level-penalizaciones",
                number: 4,
                title: "Penalizaciones y Faltas Arbitrales",
                subtitle: "El precio del error en el tatami: De Chui a Shikkaku",
                tag: "Reglamento & Faltas",
                icon: "🏆",
                color: "amber",
                xpReward: 80,
                theory: {
                    title: "Escala de Sanciones en Kumite WKF",
                    subtitle: "Infracciones, advertencias acumulativas y descalificación",
                    quote: "En el tatami, la disciplina es tan estricta como el golpe. Conoce las advertencias antes de que te cueste el combate.",
                    content: [
                        "Las faltas se sancionan según su gravedad y reiteración en el combate:",
                        "1. CHUI 1 (CH1): Primera infracción menor que no disminuye las posibilidades del adversario.",
                        "2. CHUI 2 (CH2): Segunda infracción menor acumulada.",
                        "3. CHUI 3 (CH3): Tercera infracción. Última advertencia de categoría menor.",
                        "4. HANSOKU-CHUI (HC): Advertencia grave de descalificación. El próximo error provocará la derrota inmediata.",
                        "5. HANSOKU (H): Descalificación total del combate. Victoria concedida al oponente.",
                        "6. SHIKKAKU (S): Expulsión definitiva del torneo entero. Se aplica ante actos maliciosos, conducta antideportiva grave o desacato al dojo y árbitros."
                    ],
                    bulletPoints: [
                        { title: "CHUI 1, 2 y 3", desc: "Advertencias menores progresivas.", image: "/images/kuma-arbitro-chui.jpg" },
                        { title: "HANSOKU-CHUI", desc: "Advertencia previa a la descalificación.", image: "/images/kuma-arbitro-hc.jpg" },
                        { title: "HANSOKU", desc: "Descalificación del combate.", image: "/images/kuma-arbitro-Hansoku.jpg" },
                        { title: "SHIKKAKU", desc: "Expulsión del torneo por falta de honor.", image: "/images/kuma-arbitro-shikakku.jpg" },
                    ],
                    references: [
                        "WKF Competition Rules. Artículo 13: Penalizaciones y Advertencias."
                    ]
                },
                questions: [
                    {
                        id: "q-pen-1",
                        type: "image_choice",
                        prompt: "El árbitro apunta con el dedo índice a los pies del competidor. ¿Qué sanción es?",
                        image: "/images/kuma-arbitro-hc.jpg",
                        options: [
                            { id: "o1", text: "HANSOKU-CHUI (Advertencia de descalificación)", isCorrect: true },
                            { id: "o2", text: "Yuko", isCorrect: false },
                            { id: "o3", text: "Revisión de video", isCorrect: false },
                            { id: "o4", text: "Ajuste de cinturón", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Hansoku-Chui se señala con el dedo extendido hacia adelante y abajo a 45 grados: advierte que la siguiente falta supondrá la descalificación.",
                        hint: "Es el paso previo antes del Hansoku definitivo."
                    },
                    {
                        id: "q-pen-2",
                        type: "image_choice",
                        prompt: "¿Qué sanción definitiva representa esta señal con el dedo índice hacia el rostro del infractor?",
                        image: "/images/kuma-arbitro-Hansoku.jpg",
                        options: [
                            { id: "o1", text: "HANSOKU (Descalificación del combate)", isCorrect: true },
                            { id: "o2", text: "Chui 1", isCorrect: false },
                            { id: "o3", text: "Repetición del asalto", isCorrect: false },
                            { id: "o4", text: "Falta leve", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Hansoku es la descalificación del combate por faltas acumuladas o infracción mayor directa.",
                        hint: "Otorga la victoria inmediata al adversario."
                    },
                    {
                        id: "q-pen-3",
                        type: "image_choice",
                        prompt: "¿Qué representa la señal con el brazo levantado hacia atrás señalando la salida del pabellón?",
                        image: "/images/kuma-arbitro-shikakku.jpg",
                        options: [
                            { id: "o1", text: "SHIKKAKU (Expulsión total del torneo)", isCorrect: true },
                            { id: "o2", text: "Llamada al médico", isCorrect: false },
                            { id: "o3", text: "Cambio de tatami", isCorrect: false },
                            { id: "o4", text: "Pausa técnica de 1 minuto", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "Shikkaku expulsa al atleta o entrenador de toda la competición por conducta deshonrosa o daño malicioso.",
                        hint: "Es la sanción más severa de todas en el karate federado."
                    }
                ]
            }
        ]
    }
];

// Helper to get total levels
export const ALL_LEVELS = DIDACTIC_UNITS.flatMap(u => u.levels);

export interface DidacticCatalogStats {
    totalQuestions: number;
    unitCounts: Record<string, number>;
    levelCounts: Record<string, number>;
}

export function getDidacticCatalogStats(): DidacticCatalogStats {
    let totalQuestions = 0;
    const unitCounts: Record<string, number> = {};
    const levelCounts: Record<string, number> = {};
    DIDACTIC_UNITS.forEach((u) => {
        let uCount = 0;
        u.levels.forEach((l) => {
            const lCount = l.questions?.length || 0;
            levelCounts[l.id] = lCount;
            uCount += lCount;
            totalQuestions += lCount;
        });
        unitCounts[u.id] = uCount;
    });
    return { totalQuestions, unitCounts, levelCounts };
}
