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
                title: "Historia",
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
                            src: "/images/didactic/okinawa_three_cities_map.jpg",
                            alt: "Mapa Histórico de Okinawa: Shuri, Tomari y Naha",
                            caption: "Fig 1. Cartografía ancestral del Reino de Ryukyu con las tres cunas matrices del Karate: Shuri (capital y corte real), Tomari (puerto pesquero) y Naha (puerto comercial marítimo)."
                        },
                        {
                            src: "/images/didactic/bubishi_ancient_scroll.jpg",
                            alt: "El Manuscrito Sagrado Bubishi (武備志)",
                            caption: "Fig 2. Tratado canónico secreto Bubishi (武備志): compendio histórico de las 48 técnicas de Grulla Blanca y puntos vitales traídos de Fujian a Okinawa."
                        },
                        {
                            src: "/images/didactic/okinawa_masters_history.jpg",
                            alt: "Maestros de Okinawa entrenando en la clandestinidad",
                            caption: "Fig 3. Práctica nocturna clandestina en las murallas de Shuri tras los edictos de desarme forzoso de 1609 bajo la invasión del clan Satsuma."
                        }
                    ],
                    content: [
                        "1. El Nacimiento en el Reino Insular de Ryukyu (Okinawa): El Karate-Do (空手道) no nació en el Japón continental, sino en el antiguo archipiélago de Ryukyu —hoy prefectura de Okinawa—. Por su privilegiada posición en el Mar de China Oriental, Ryukyu floreció como un enclave de intercambio comercial y diplomático pacífico entre China, Japón, Siam y el sudeste asiático. En este crisol confluieron el 'Te' (手, combate autóctono caracterizado por la dureza de acondicionamiento) y las artes marciales de China meridional (Quan-fa de Fujian). Este puente intercultural se consolidó para siempre en 1392 con la llegada a la aldea de Kumemura de las 'Treinta y Seis Familias Chinas': eruditos, artesanos y navegantes enviados por el emperador Ming que sembraron las semillas de las artes de combate chinas en suelo okinawense.",
                        "2. La Invasión Satsuma de 1609 y la Forja Clandestina del Kobudo: En 1609, los samuráis del poderoso clan japonés Satsuma invadieron Ryukyu y sometieron a la monarquía. Los invasores impusieron un implacable edicto de desarme civil absoluto: la posesión de espadas, lanzas o cualquier metal cortante era castigada con la muerte inmediata. Ante esta opresión desmedida, los maestros llevaron el entrenamiento marcial a la más estricta clandestinidad nocturna. A puerta cerrada y bajo la penumbra, endurecieron sus nudillos y extremidades contra el makiwara (poste de impacto forrado en paja) hasta convertir sus cuerpos en escudos vivientes. Al mismo tiempo, los pobladores crearon el Kobudo: el ingenioso arte de transformar herramientas agrícolas y aperos de pesca cotidianos en armas letales de defensa (el Bo o vara larga, el Tonfa o manivela de molino de arroz, el Sai o tridente metálico, las hoces Kama, el mayal Nunchaku y el remo Eku).",
                        "3. Cartografía Ancestral de Okinawa: Las Tres Cunas Matrices: Antes de que existieran las federaciones y escuelas modernas con nombres comerciales, el arte marcial se conocía como 'Okinawa-Te' (Mano de Okinawa) y se dividía en tres vertientes geográficas y metodológicas bien definidas (representadas en la cartografía histórica de la Fig 1):\n\n• Shuri-Te (首里手 - La Corte Real y la Aristocracia Peichin): Desarrollado en la colina del Castillo de Shuri, la sede de la monarquía de Ryukyu. Era practicado por nobles guerreros (Peichin) y escoltas reales. Se distingue por desplazamientos lineales fulminantes, velocidad explosiva, posturas dinámicas (Zenkutsu-dachi y Kokutsu-dachi) y contraataques decisivos de largo alcance. Maestros cumbres: Kanga 'Tode' Sakugawa, Sokon 'Bushi' Matsumura (escolta de tres reyes de Ryukyu) y Anko Itosu (creador de las katas Pinan/Heian y pionero que introdujo el karate al sistema escolar público en 1901). Es la matriz directa del estilo Shotokan (fundado por Gichin Funakoshi) y co-fundamento del Shito-Ryu (Kenwa Mabuni).\n\n• Naha-Te (那覇手 - El Puerto Mercantil y el Enraizamiento Ibuki): Desarrollado en el activo puerto comercial de Naha y la aldea china de Kumemura. Con fuerte arraigo en el boxeo del sur de China (estilos de la Grulla Blanca - Baihequan y Boxeo del Monje de Fujian). Se enfoca en el combate a muy corta distancia, posturas compactas e inamovibles (Sanchin-dachi), respiración diafragmática profunda e isométrica (Ibuki) y desvíos circulares suaves que absorben la inercia del agresor antes de detonar impactos destructivos (armonía 'Go-Ju': duro y suave). Maestros cumbres: Seisho Arakaki, Kanryo Higaonna (quien viajó y entrenó más de una década en Fuzhou con el maestro Ryu Ryu Ko) y Chojun Miyagi. Dio origen a los estilos Goju-Ryu y Uechi-Ryu (creado por Kanbun Uechi).\n\n• Tomari-Te (泊手 - Los Pescadores, Náufragos y la Esquiva Tenshin): Forjado en el humilde pueblo pesquero y puerto fluvial de Tomari. A este puerto arribaban barcos comerciales de cabotaje, campesinos y marineros chinos. Su método se nutrió del saber transmitido en secreto por náufragos chinos refugiados en las cuevas costeras de Tomari (maestros legendarios como Annan y Chinto). Se caracteriza por su asombrosa ligereza acrobática, esquivas angulares en rotación (Tenshin), cambios repentinos de altura y contragolpes a media y corta distancia. Maestros cumbres: Kosaku Matsumora (célebre por desarmar a un samurái de Satsuma arrebatándole la katana usando solo una toalla húmeda), Kishin Teruya y el invicto peleador callejero Choki Motobu. Preservó las katas matrices Rohai (la visión de la grulla), Wankan (la corona del rey), Chinto (Gankaku) y Bassai Tomari.",
                        "4. El Bubishi (武備志): La Biblia Secreta del Karate: El tesoro documental más venerado que sobrevivió a generaciones de maestros es el Bubishi (武備志 - 'Tratado de Preparación Marcial'). Este texto fundacional, copiado a mano con tinta china y transmitido de maestro a discípulo predilecto en secreto absoluto, recopila 48 posturas combativas ilustradas de la Grulla Blanca de Fujian, diagramas anatómicos de meridianos energéticos y horas del reloj circadiano donde el flujo de Ki se concentra en puntos vulnerables (doctrina Kyusho-Jitsu / Dim Mak), y recetas de medicina herbolaria y digitopuntura para tratar fracturas y contusiones. Gigantes como Kanryo Higaonna, Chojun Miyagi, Anko Itosu, Kenwa Mabuni y Gichin Funakoshi preservaron copias de este manuscrito sagrado.",
                        "5. La Cumbre Histórica de Naha de 1936 y la Esencia de 'Mano Vacía': A inicios del siglo XX, Gichin Funakoshi y otros pioneros llevaron el arte a Tokio y a las universidades japonesas. El 25 de octubre de 1936, los máximos maestros de Okinawa (Chojun Miyagi, Chomo Hanashiro, Kentsu Yabu, Choki Motobu, Choshin Chibana, Shinpan Shiroma y Genwa Nakasone) celebraron una reunión cumbre en el palacio Showa Kaikan de Naha. En un acuerdo histórico, oficializaron el reemplazo del kanji original 唐手 ('To-de' / Mano de la dinastía Tang de China) por el ideograma homófono 空手 ('Kara-Te' / Mano Vacía), incorporando el sufijo 'Dō' (道 - Vía espiritual de superación personal). Esta evolución filosófica se basa en el principio Zen del vacío: 'Vaciar la mente de ego, vanidad, rencor y soberbia para reflejar el universo con la nitidez y calma de un espejo de agua'. Cada 25 de octubre se celebra el Día Mundial del Karate en conmemoración de aquella asamblea.",
                        "6. Pilares Éticos y Biomecánicos: Del Tatami al Espíritu de Vida: La práctica tradicional del Karate descansa sobre la tríada indivisible de Kihon (fundamentos biomecánicos y postura), Kata (la biblioteca viva del estilo y sus aplicaciones secretas Bunkai) y Kumite (el combate donde se prueba la distancia Maai y el temple). Toda esta capacidad técnica está consagrada a los mandamientos supremos del Budo: 'Karate ni sente nashi' (空手に先手なし - En el Karate no existe el primer ataque; el practicante jamás busca la violencia y solo actúa para preservar la vida), 'Rei' (礼 - Respeto reverencial incondicional que rige el inicio y final de toda sesión marcial) e 'Ikken Hissatsu' (el compromiso total de concentrar toda la energía física y mental en un solo golpe definitivo mediante el Kime y Kiai, siempre controlado con la maestría milimétrica del Sundome para proteger la salud de quien entrena junto a nosotros)."
                    ],
                    bulletPoints: [
                        {
                            title: "Shuri-Te (首里手): Nobleza y Velocidad",
                            desc: "Nacido en el Castillo de Shuri entre la corte real y nobles Peichin. Desplazamientos lineales ágiles, posturas profundas y velocidad explosiva. Matriz directa de Shotokan y Shito-Ryu.",
                            badge: "Cuna Capitalina",
                            image: "/images/didactic/okinawa_three_cities_map.jpg"
                        },
                        {
                            title: "Naha-Te (那覇手): Puerto, Enraizamiento e Ibuki",
                            desc: "Cultivado en el bullicioso puerto de Naha y Kumemura. Fuerte influencia china de Fujian, combate a corta distancia, postura Sanchin y respiración diafragmática Ibuki. Matriz de Goju-Ryu y Uechi-Ryu.",
                            badge: "Fuerza y Respiración",
                            image: "/images/didactic/okinawa_three_cities_map.jpg"
                        },
                        {
                            title: "Tomari-Te (泊手): Pescadores, Náufragos y Esquiva",
                            desc: "Originado en el pueblo pesquero de Tomari, enriquecido por náufragos chinos y maestros como Kosaku Matsumora. Ágil, acrobático y rico en esquivas Tenshin. Creador de katas Rohai, Wankan y Chinto.",
                            badge: "Agilidad Evasiva",
                            image: "/images/didactic/okinawa_three_cities_map.jpg"
                        },
                        {
                            title: "El Manuscrito Sagrado Bubishi (武備志)",
                            desc: "La biblia secreta del Karate: 48 técnicas combativas de la Grulla Blanca, anatomía de puntos vitales (Kyusho-Jitsu) y medicina herbolaria tradicional copiada de maestro a discípulo.",
                            badge: "Tratado Clave",
                            image: "/images/didactic/bubishi_ancient_scroll.jpg"
                        },
                        {
                            title: "El Edicto Satsuma de 1609 y el Kobudo",
                            desc: "La prohibición samurái de portar armas que obligó al entrenamiento secreto nocturno y transformó herramientas campesinas y de pesca (Bo, Tonfa, Sai, Nunchaku, Kama) en armas de autodefensa.",
                            badge: "Forja Clandestina",
                            image: "/images/didactic/okinawa_masters_history.jpg"
                        },
                        {
                            title: "La Asamblea de Naha de 1936 (空手道)",
                            desc: "Cumbre histórica de los grandes maestros okinawenses donde se oficializó el cambio de ideograma de Mano China (唐手) a Mano Vacía (空手) y el 25 de octubre como Día Mundial del Karate.",
                            badge: "Hito Histórico"
                        },
                        {
                            title: "Karate Ni Sente Nashi (空手に先手なし)",
                            desc: "'En el Karate no existe el primer ataque'. Máxima ética universal del Maestro Funakoshi que consagra al Karate como un camino de preservación de la vida, humildad y dominio absoluto del ego.",
                            badge: "Pilar Moral"
                        },
                        {
                            title: "Biomecánica de Kime, Kiai y Sundome",
                            desc: "La concentración explosiva de energía en el instante del impacto (Kime), canalizada con el grito diafragmático (Kiai) y contenida con el freno milimétrico de respeto absoluto (Sundome).",
                            badge: "Control Supremo"
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
                        id: "q-karate-origen-mapas",
                        type: "map_drag",
                        prompt: "¿Cómo nació el Karate? ¡Navega con Kuma Sensei!",
                        description: "Guía el barquito de Kuma: Toca China 🇨🇳 (1), luego la Isla de Okinawa 🏝️ (2) y viaja a Japón 🇯🇵 (3).",
                        explanation: "¡Extraordinario! El Karate nació en la pequeña isla de Okinawa. Los maestros viajaron en barco a China para aprender Kung-Fu y lo fusionaron con su combate nativo para crear la Mano Vacía. ¡Luego viajó a Japón y a todo el mundo!",
                        hint: "Toca los puertos en orden: 1. China 🇨🇳 ➔ 2. Okinawa 🏝️ ➔ 3. Japón 🇯🇵.",
                        dragMaps: [
                            {
                                id: "china",
                                title: "1. Costa de China",
                                subtitle: "Cuna del Kung-Fu",
                                image: "/images/didactic/kuma_pixar_origins_map_v2.jpg",
                                targetSlot: "china",
                                badge: "🇨🇳 KUNG-FU",
                                description: "Quan-Fa del sur y boxeo de la grulla."
                            },
                            {
                                id: "okinawa",
                                title: "2. Isla de Okinawa",
                                subtitle: "¡Cuna del Karate!",
                                image: "/images/didactic/kuma_pixar_origins_map_v2.jpg",
                                targetSlot: "okinawa",
                                badge: "🏝️ MANO VACÍA",
                                description: "Aquí nació el Karate-Do."
                            }
                        ],
                        references: [
                            {
                                title: "Bubishi: La Biblia del Karate",
                                author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                                year: 2001,
                                editorial: "Editorial Tutor",
                                chapter: "Introducción histórica: La ruta de Fuzhou a Naha y el linaje de Fujian",
                                note: "Investigación sobre la migración de las 36 familias chinas a Kumemura (Okinawa) y los viajes comerciales que llevaron el Quan-Fa a Ryukyu."
                            },
                            {
                                title: "Karate de Okinawa: Maestros, Estilos y Métodos Secretos",
                                author: "Mark Bishop",
                                year: 1999,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 1: El Reino de Ryukyu y el intercambio marcial sino-okinawense",
                                note: "Detalla la síntesis geográfica e histórica entre la provincia de Fujian y los puertos de Okinawa."
                            },
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 1: Los dos orígenes del arte de Okinawa",
                                note: "El padre del Karate moderno explica cómo el arte surgió de la conjunción de las raíces chinas con la tradición autóctona de Okinawa."
                            }
                        ]
                    },
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
                                chapter: "Capítulo 4: La asamblea histórica de maestros de Okinawa de 1936",
                                note: "Investigación documental sobre la reunión en Naha donde se oficializó el término y la caligrafía de Karate-Do."
                            },
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo II: La transformación de To-te a Karate y el concepto Zen del vacío",
                                note: "Explica cómo el kanji 'Vacío' simboliza limpiar la mente de egoísmo para actuar con serenidad y justicia."
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
                            },
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 1: Mis primeros años bajo la luna en el jardín de Maestro Azato",
                                note: "Relato directo de los entrenamientos a medianoche alumbrados por faroles de papel para evitar ser descubiertos por las autoridades."
                            },
                            {
                                title: "La Esencia del Karate-Do Okinawense",
                                author: "Maestro Shoshin Nagamine (10° Dan)",
                                year: 1998,
                                editorial: "Editorial Miraguano",
                                chapter: "Capítulo I: Génesis clandestina tras la ocupación militar de Satsuma de 1609",
                                note: "Análisis histórico de las penas de muerte por porte de armas que impulsaron el acondicionamiento corporal y el uso del makiwara."
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
                            },
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Introducción: La naturaleza defensiva y pacífica del Karate",
                                note: "Establece que todas las katas tradicionales comienzan siempre con un movimiento de defensa o bloqueo."
                            },
                            {
                                title: "Enciclopedia de las Artes Marciales del Extremo Oriente",
                                author: "Roland Habersetzer (Hanshi 9° Dan)",
                                year: 2004,
                                editorial: "Editorial Miraguano",
                                chapter: "Tomo II: Filosofía moral del Budo y el concepto 'Sente Nashi'",
                                note: "Exégesis histórica sobre el origen okinawense de la máxima y su integración en el código de honor japonés."
                            }
                        ]
                    },
                    {
                        id: "q-ciudades-okinawa-te",
                        type: "okinawa_branches",
                        image: "/images/didactic/kuma_pixar_okinawa_branches.jpg",
                        prompt: "¿Cuáles fueron las 3 ramas matrices del Karate en Okinawa?",
                        description: "Ubica las 3 ciudades históricas en el mapa ilustrado: Shuri, Tomari y Naha.",
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
                            },
                            {
                                title: "Karate de Okinawa: Maestros, Estilos y Métodos Secretos",
                                author: "Mark Bishop",
                                year: 1999,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 2 y 3: Las tres ramas matrices de Ryukyu",
                                note: "Comparativa exhaustiva entre los movimientos lineales de Shuri, la potencia de Naha y la versatilidad de Tomari."
                            },
                            {
                                title: "Bubishi: La Biblia del Karate",
                                author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                                year: 2001,
                                editorial: "Editorial Tutor",
                                chapter: "Sección Histórica: La geografía marcial del archipiélago de Ryukyu",
                                note: "Cartografía y linajes de transmisión de los tres núcleos urbanos primitivos de la isla de Okinawa."
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
                            },
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Principio 1: Karate-do wa rei ni hajimari, rei ni owaru koto (El Karate empieza y termina con respeto)",
                                note: "La regla áurea número uno del Karate tradicional como camino de elevación del espíritu humano."
                            },
                            {
                                title: "El Mejor Karate: Fundamentos",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1989,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 1: Reigi Sahō: El protocolo y la cortesía dentro del Dojo",
                                note: "Manual formativo que detalla la reverencia al maestro (Sensei ni rei), a los compañeros (Otagai ni rei) y al recinto sagrado."
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
                            },
                            {
                                title: "Traditional Karate-Do: Okinawa Goju Ryu Vol. 1",
                                author: "Maestro Morio Higaonna (10° Dan)",
                                year: 1985,
                                editorial: "Minato Research / Miraguano",
                                chapter: "Capítulo 3: La respiración diafragmática Ibuki y la focalización del Ki",
                                note: "Análisis de la presión intraabdominal que blinda los órganos viscerales contra impactos directos."
                            },
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 3: La coordinación respiratoria y la manifestación del espíritu en el impacto",
                                note: "Funakoshi describe cómo el grito unifica la mente, la respiración y la tensión muscular en un solo microsegundo."
                            }
                        ]
                    },
                    {
                        id: "q-pilares-kihon-kata-kumite",
                        type: "tree_pillars",
                        prompt: "Los 3 Pilares del Karate: ¡Haz florecer el Árbol Sagrado!",
                        description: "Coloca cada gema en su altar: la Raíz (Kihon), el Tronco (Kata) y las Flores (Kumite).",
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
                            },
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 2: Relación recíproca entre Kata, Kihon y el combate libre Kumite",
                                note: "Explica cómo la técnica básica forja el cuerpo, la kata estructura la memoria y el combate prueba el temple."
                            },
                            {
                                title: "Karate Shotokan: Una Historia Precisa",
                                author: "Harry Cook",
                                year: 2001,
                                editorial: "Edición Histórica Marcial / Page Bros",
                                chapter: "Capítulo 6: La formalización pedagógica de los tres pilares del karate moderno",
                                note: "Cronología documental de la integración del Kumite y el Kihon metódico en las universidades de Tokio."
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
                            },
                            {
                                title: "Karate de Okinawa: Maestros, Estilos y Métodos Secretos",
                                author: "Mark Bishop",
                                year: 1999,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 4: El Kata como sistema mnemotécnico de supervivencia sin registros escritos",
                                note: "Estudio antropológico sobre la transmisión oral y cinética de las técnicas de combate en Ryukyu."
                            },
                            {
                                title: "Watashi no Karate-Jutsu: Mi Arte del Karate",
                                author: "Maestro Choki Motobu",
                                year: 1932,
                                editorial: "Kitsutsuki / Ryukyu Martial Archives",
                                chapter: "Capítulo II: Aplicaciones reales (Bunkai) de Naihanchi y las formas tradicionales",
                                note: "El legendario combatiente okinawense desglosa las aplicaciones prácticas de llaves, barridos y luxaciones de las formas clásicas."
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
                            },
                            {
                                title: "Karate Dinámico: Instrucción Oficial y Principios Biomecánicos",
                                author: "Maestro Masatoshi Nakayama",
                                year: 1986,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 2: El Sundome: El freno a milímetros del blanco en el entrenamiento de Kumite",
                                note: "Estudio neuromuscular sobre la deceleración agonista-antagonista que permite detener el golpe a milímetros de la piel."
                            },
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Principio 12: No pienses que tienes que ganar; piensa más bien en no perder",
                                note: "Tratado filosófico sobre la templanza y el cuidado reverencial de la vida humana en el tatami."
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-anatomia",
                number: 2,
                title: "Cuerpo Humano",
                subtitle: "Partes anatómicas, alturas y armas naturales en japonés",
                tag: "Cuerpo Humano & Karate",
                icon: "💪",
                color: "red",
                xpReward: 75,
                theory: {
                    title: "El Cuerpo Humano: Superpoderes y Armas Naturales de Kuma Sensei",
                    subtitle: "¡Aprende las partes del cuerpo y alturas en japonés jugando!",
                    quote: "El cuerpo es tu mejor amigo y tu escudo. ¡Conocer cada parte en japonés te hace más fuerte y ágil!",
                    content: [
                        "¡Bienvenido al mapa del cuerpo de Kuma Sensei! En Karate-Do, nuestro cuerpo tiene 3 alturas principales (pisos) y muchas herramientas secretas para defenderse:",
                        "1. Los Tres Pisos del Cuerpo: Arriba está 上段 (JODAN), que cuida la cabeza y rostro. Al medio está 中段 (CHUDAN), donde están el pecho y la pancita. Y abajo está 下段 (GEDAN), para piernas y pies.",
                        "2. Cabeza y Sentidos: Los ojos 目 (Me) miran todo alrededor con atención (Metsuke), los oídos 耳 (Mimi) escuchan los pasos y la cabeza 頭部 (Atama) piensa con calma.",
                        "3. Las Manos y Brazos Mágicos: Tu mano se convierte en 正拳 (Seiken - puño cerrado), 手刀 (Shuto - mano espada) y 裏拳 (Uraken - revés rápido). ¡Y el codo 猿臂 (Empi) es durísimo como una roca!",
                        "4. El Motor Secreto: La fuerza de tus golpes no viene del brazo, ¡viene de girar la cadera 腰 (Koshi) y respirar desde la pancita 腹 / 丹田 (Hara/Tanden)!",
                        "5. Piernas Fuertes: La rodilla 膝 (Hiza) sube como resorte, la espinilla 脛 (Sune) es tu escudo para bloquear y el pie 足 (Ashi) se enraíza fuerte en el tatami."
                    ],
                    images: [
                        {
                            src: "/images/didactic/kuma_pixar_anatomia_cuerpo.jpg",
                            alt: "Kuma Sensei Pixar 3D: Mapa del Cuerpo Humano en Karate",
                            caption: "Fig 1. Mapa anatómico de Kuma Sensei: Partes del cuerpo en japonés y español"
                        },
                        {
                            src: "/images/didactic/kuma_pixar_alturas_karate.jpg",
                            alt: "Kuma Sensei Pixar 3D: Las 3 Alturas Jodan, Chudan y Gedan",
                            caption: "Fig 2. Los tres pisos del cuerpo humano en Karate: Jodan (Alto), Chudan (Medio) y Gedan (Bajo)"
                        }
                    ],
                    bulletPoints: [
                        {
                            title: "Jodan, Chudan y Gedan: Los 3 Pisos",
                            desc: "Jodan es la cabeza, Chudan el pecho y pancita, y Gedan las piernas y pies.",
                            badge: "Alturas del Cuerpo",
                            image: "/images/didactic/kuma_pixar_alturas_karate.jpg"
                        },
                        {
                            title: "Seiken, Empi y Shuto: Armas de la Mano",
                            desc: "Puño cerrado, mano espada y el codo como un ariete súper duro.",
                            badge: "Brazos y Manos",
                            image: "/images/didactic/kuma_pixar_anatomia_cuerpo.jpg"
                        },
                        {
                            title: "Koshi y Tanden: El Motor de Poder",
                            desc: "La fuerza nace al girar la cadera (Koshi) y concentrarse en el abdomen (Tanden).",
                            badge: "Fuerza y Centro",
                            image: "/images/didactic/kuma_pixar_anatomia_cuerpo.jpg"
                        },
                        {
                            title: "Hiza, Sune y Ashi: Escudos de la Pierna",
                            desc: "Rodilla para saltar y defender, espinilla como escudo y pie para pisar fuerte.",
                            badge: "Piernas Fuertes",
                            image: "/images/didactic/kuma_pixar_anatomia_cuerpo.jpg"
                        }
                    ],
                    references: [
                        {
                            title: "Karate-Do Kyohan: The Master Text",
                            author: "Maestro Gichin Funakoshi",
                            year: 1973,
                            editorial: "Kodansha International",
                            chapter: "Capítulo III: Puntos del cuerpo humano y alturas de ataque: Jodan, Chudan y Gedan",
                            note: "Tratado fundamental sobre la división de las tres zonas corporales y el acondicionamiento de las armas naturales."
                        },
                        {
                            title: "Karate Dinámico: Principios Biomecánicos y Dianas Anatómicas",
                            author: "Maestro Masatoshi Nakayama (JKA)",
                            year: 1986,
                            editorial: "Editorial Paidotribo",
                            chapter: "Capítulo 1: Anatomía aplicada al Karate: el uso de la cadera (Koshi) y alineación ósea",
                            note: "Estudio oficial sobre cómo la masa corporal y la estructura ósea multiplican el impacto sin lastimar las articulaciones."
                        },
                        {
                            title: "Bubishi: La Biblia del Karate",
                            author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                            year: 2001,
                            editorial: "Editorial Tutor",
                            chapter: "Capítulo V: Los centros nerviosos y los puntos vulnerables del cuerpo humano (Kyusho)",
                            note: "El tratado clásico de Okinawa y China sobre las dianas vitales, el meridiano central y el cuidado anatómico."
                        }
                    ]
                },
                questions: [
                    {
                        id: "q-cuerpo-1",
                        type: "matching",
                        prompt: "En Karate dividimos el cuerpo en 3 alturas. ¡Empareja cada una con su piso!",
                        explanation: "¡Eso es! Jodan es arriba (cabeza), Chudan al medio (pecho) y Gedan abajo (piernas y pies).",
                        hint: "Jo = Alto, Chu = Medio, Ge = Bajo.",
                        pairs: [
                            { id: "p1", left: "上段 (JODAN)", right: "Zona Alta (Cabeza)" },
                            { id: "p2", left: "中段 (CHUDAN)", right: "Zona Media (Pecho y Torso)" },
                            { id: "p3", left: "下段 (GEDAN)", right: "Zona Baja (Piernas y Pies)" },
                        ],
                        references: [
                            {
                                title: "Karate-Do Kyohan: The Master Text",
                                author: "Maestro Gichin Funakoshi",
                                year: 1973,
                                editorial: "Kodansha International",
                                chapter: "Capítulo III: Puntos del cuerpo humano y alturas de ataque: Jodan, Chudan y Gedan",
                                note: "Define los tres niveles verticales de la anatomía humana y su correspondencia con las defensas fundamentales."
                            },
                            {
                                title: "Karate Dinámico: Instrucción Oficial y Principios Biomecánicos",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1986,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 1: Las tres zonas corporales y las dianas anatómicas",
                                note: "Estudio anatómico que detalla la trayectoria y altura precisa de cada técnica respecto al eje del cuerpo."
                            },
                            {
                                title: "Enciclopedia de las Artes Marciales del Extremo Oriente",
                                author: "Roland Habersetzer (Hanshi 9° Dan)",
                                year: 2004,
                                editorial: "Editorial Miraguano",
                                chapter: "Sección Terminología Biomecánica: Jodan, Chudan, Gedan",
                                note: "Compendio enciclopédico sobre la división tripartita del cuerpo en el Budo tradicional japonés."
                            }
                        ]
                    },
                    {
                        id: "q-cuerpo-2",
                        type: "multiple_choice",
                        prompt: "¿Cómo se llama el CODO en japonés? (El arma más dura del brazo para corta distancia)",
                        options: [
                            { id: "o1", text: "猿臂 / 肘 (Empi / Hiji)", isCorrect: true },
                            { id: "o2", text: "膝 (Hiza)", isCorrect: false },
                            { id: "o3", text: "首 (Kubi)", isCorrect: false },
                            { id: "o4", text: "足 (Ashi)", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "¡Muy bien! 猿臂 (Empi) o 肘 (Hiji) es el codo en japonés, una articulación fuertísima.",
                        hint: "Hiza es rodilla y Ashi es pie.",
                        references: [
                            {
                                title: "Karate-Do Kyohan: The Master Text",
                                author: "Maestro Gichin Funakoshi",
                                year: 1973,
                                editorial: "Kodansha International",
                                chapter: "Capítulo IV: Armas corporales: Empi-uchi (el golpe de codo)",
                                note: "Ilustra las trayectorias de impacto con el olécranon (codo) en distancias cerradas de autodefensa."
                            },
                            {
                                title: "El Mejor Karate: Fundamentos",
                                author: "Maestro Masatoshi Nakayama",
                                year: 1989,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 2: Las armas anatómicas: Empi (codo) y su biomecánica de impacto",
                                note: "Detalla la flexión muscular del bíceps para bloquear la articulación del codo al impactar."
                            },
                            {
                                title: "Karate de Okinawa: Maestros, Estilos y Métodos Secretos",
                                author: "Mark Bishop",
                                year: 1999,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 6: Armas corporales anatómicas y acondicionamiento en Ryukyu",
                                note: "Describe el uso del codo en los estilos tradicionales de Tomari-Te y Goju-Ryu."
                            }
                        ]
                    },
                    {
                        id: "q-cuerpo-3",
                        type: "image_choice",
                        prompt: "Mira a Kuma Sensei en la imagen. ¿Qué término señala la CABEZA y el ROSTRO?",
                        image: "/images/didactic/kuma_pixar_anatomia_cuerpo.jpg",
                        options: [
                            { id: "o1", text: "頭部 / 面 (Atama / Men)", isCorrect: true },
                            { id: "o2", text: "腰 / 腹 (Koshi / Hara)", isCorrect: false },
                            { id: "o3", text: "脛 / 膝 (Sune / Hiza)", isCorrect: false },
                            { id: "o4", text: "肩 / 猿臂 (Kata / Empi)", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "¡Excelente! 頭部 (Atama) es cabeza y 面 (Men) es el rostro. ¡Siempre debemos protegerlos!",
                        hint: "Está arriba de todo en el cartel de Kuma Sensei.",
                        references: [
                            {
                                title: "Bubishi: La Biblia del Karate",
                                author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                                year: 2001,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo V: Los puntos vulnerables del cráneo y rostro (Atama/Men)",
                                note: "Identificación de los centros nerviosos craneales y el riesgo biomecánico de impacto en la zona cefálica."
                            },
                            {
                                title: "Karate-Do Kyohan: The Master Text",
                                author: "Maestro Gichin Funakoshi",
                                year: 1973,
                                editorial: "Kodansha International",
                                chapter: "Capítulo IV: Terminología anatómica de la cabeza (Atama) y la cara (Men)",
                                note: "Glosario canónico de los blancos vitales superiores y la necesidad de Sundome al atacar el rostro."
                            },
                            {
                                title: "Anatomía de las Artes Marciales",
                                author: "Dr. Norman Link",
                                year: 2008,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 2: Estructuras craneofaciales y el control de impacto en el Karate tradicional",
                                note: "Análisis médico-deportivo sobre la vulnerabilidad de los huesos propios nasales y mandíbula."
                            }
                        ]
                    },
                    {
                        id: "q-cuerpo-4",
                        type: "matching",
                        prompt: "¡La mano del karateka se transforma! Empareja cada golpe de mano:",
                        explanation: "¡Genial! Seiken es el puño cerrado, Shuto la mano espada y Uraken el revés de puño.",
                        hint: "Ken significa puño y To significa espada.",
                        pairs: [
                            { id: "p1", left: "正拳 (Seiken)", right: "Puño frontal cerrado" },
                            { id: "p2", left: "手刀 (Shuto)", right: "Mano espada (canto abierto)" },
                            { id: "p3", left: "裏拳 (Uraken)", right: "Dorso del puño (revés rápido)" },
                        ],
                        references: [
                            {
                                title: "Karate Dinámico: Instrucción Oficial",
                                author: "Maestro Masatoshi Nakayama",
                                year: 1986,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 2: Las armas de la mano: Seiken, Shuto y Uraken",
                                note: "Explicación biomecánica de la tensión muscular y alineación ósea del radio y cúbito."
                            },
                            {
                                title: "Shotokan Karate: A Precise History",
                                author: "Harry Cook",
                                year: 2001,
                                editorial: "Cook & Page",
                                chapter: "Capítulo 4: La evolución de las técnicas de golpeo con la mano vacía",
                                note: "Historia del desarrollo de los métodos de endurecimiento de puños y dedos en Okinawa y Japón."
                            },
                            {
                                title: "Karate-Do Kyohan",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo II: Métodos de formación del puño (Seiken) y la mano abierta (Shuto)",
                                note: "Tratado original ilustrado por Funakoshi sobre cómo cerrar el puño apretando el pulgar sobre el índice y medio."
                            }
                        ]
                    },
                    {
                        id: "q-cuerpo-5",
                        type: "multiple_choice",
                        prompt: "¿De dónde viene la verdadera fuerza de un golpe de karate?",
                        options: [
                            { id: "o1", text: "腰 (Koshi)", isCorrect: true },
                            { id: "o2", text: "耳 (Mimi)", isCorrect: false },
                            { id: "o3", text: "指 (Yubi)", isCorrect: false },
                            { id: "o4", text: "鼻 (Hana)", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "¡Correcto! La fuerza nace al girar la cadera (Koshi), no solo de los brazos.",
                        hint: "Es la articulación de la cintura que gira con fuerza.",
                        references: [
                            {
                                title: "The Twenty Guiding Principles of Karate",
                                author: "Maestro Gichin Funakoshi",
                                year: 2003,
                                editorial: "Kodansha International",
                                chapter: "Principio IX: La aplicación de la fuerza y la rotación de la cadera (Koshi)",
                                note: "Explicación filosófica y física de cómo la cadera es el eje dinámico del Karate-Do."
                            },
                            {
                                title: "Karate Dinámico: La Cadera como Centro de Potencia",
                                author: "Maestro Masatoshi Nakayama",
                                year: 1986,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 1: La biomecánica de la cadera: rotación, vibración y empuje",
                                note: "Análisis con diagramas de vectores de fuerza que demuestran que el 70% de la fuerza del Tsuki nace en la cadera."
                            },
                            {
                                title: "Traditional Karate-do: Okinawa Goju Ryu Vol. 1",
                                author: "Morio Higaonna (Hanshi 10° Dan)",
                                year: 1985,
                                editorial: "Minerva Press",
                                chapter: "Capítulo 3: Fundamentos corporales: Koshi y respiración en Sanchin",
                                note: "Enseñanzas sobre la báscula pélvica y la compresión del Tanden para generar solidez."
                            }
                        ]
                    },
                    {
                        id: "q-cuerpo-6",
                        type: "matching",
                        prompt: "¡Tus piernas también son escudos y arietes! Empareja cada parte:",
                        explanation: "¡Perfecto! Hiza es la rodilla, Sune la espinilla de escudo y Kakato el talón duro.",
                        hint: "Hiza se usa en los rodillazos de karate.",
                        pairs: [
                            { id: "p1", left: "膝 (Hiza)", right: "Rodilla" },
                            { id: "p2", left: "脛 (Sune)", right: "Espinilla" },
                            { id: "p3", left: "踵 (Kakato)", right: "Talón" },
                        ],
                        references: [
                            {
                                title: "El Mejor Karate: Fundamentos",
                                author: "Maestro Masatoshi Nakayama",
                                year: 1989,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 3: Técnicas de pierna y armas corporales: Hiza, Sune y Kakato",
                                note: "Guía de alineación articular al golpear con la rodilla y el talón."
                            },
                            {
                                title: "Karate de Okinawa: Maestros, Estilos y Métodos Secretos",
                                author: "Mark Bishop",
                                year: 1999,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 7: Métodos tradicionales de acondicionamiento de piernas (Sune y Kakato)",
                                note: "Prácticas tradicionales de endurecimiento tibial para bloquear patadas bajas (Gedan Barai / Sune Uke)."
                            },
                            {
                                title: "Encyclopédie des Arts Martiaux de l'Extrême-Orient",
                                author: "Roland Habersetzer",
                                year: 2000,
                                editorial: "Éditions Amphora",
                                chapter: "Sección Anatomía: Hiza, Sune y Kakato en las artes del Budo",
                                note: "Compendio enciclopédico sobre las superficies de contacto y escudos osteomusculares inferiores."
                            }
                        ]
                    },
                    {
                        id: "q-cuerpo-7",
                        type: "matching",
                        prompt: "Un karateka siempre está muy atento. Empareja cada sentido del cuerpo:",
                        explanation: "¡Bien hecho! Me son los ojos para ver, Mimi los oídos para escuchar y Kubi el cuello.",
                        hint: "Metsuke es la mirada atenta con los ojos (Me).",
                        pairs: [
                            { id: "p1", left: "目 (Me)", right: "Ojos (Visión alerta)" },
                            { id: "p2", left: "耳 (Mimi)", right: "Oídos (Escucha atenta)" },
                            { id: "p3", left: "首 (Kubi)", right: "Cuello (Soporte de la cabeza)" },
                        ],
                        references: [
                            {
                                title: "Karate-Do: My Way of Life",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Kodansha International",
                                chapter: "Capítulo 6: La actitud mental, la mirada panorámica (Metsuke) y los sentidos",
                                note: "Reflexión autobiográfica sobre cómo un karateka debe observar la totalidad del oponente sin clavar los ojos en un solo punto."
                            },
                            {
                                title: "Bubishi: The Classic Manual of Martial Arts",
                                author: "Sensei Patrick McCarthy",
                                year: 1995,
                                editorial: "Tuttle Publishing",
                                chapter: "Capítulo IV: Los sentidos del guerrero: vista, audición y los puntos vulnerables del cuello",
                                note: "Tratado tradicional sobre el rol de la percepción sensorial y los puntos arteriales del cuello (Kubi)."
                            },
                            {
                                title: "The Essence of Okinawan Karate-Do",
                                author: "Maestro Shoshin Nagamine",
                                year: 1976,
                                editorial: "Tuttle Publishing",
                                chapter: "Capítulo 2: Fundamentos del Budo: La mirada tranquila y el control del cuello",
                                note: "Instrucciones de Nagamine sobre la postura serena de la cabeza y el cuello erguido."
                            }
                        ]
                    },
                    {
                        id: "q-cuerpo-8",
                        type: "true_false",
                        prompt: "¿Verdadero o Falso? El 腹 (Hara / Tanden) está en la pancita y es el centro de equilibrio del karateka.",
                        explanation: "¡Verdadero! El Hara o Tanden en el bajo abdomen es el centro de equilibrio y respiración profunda.",
                        correctBool: true,
                        hint: "Queda unos deditos debajo del ombligo.",
                        references: [
                            {
                                title: "Karate-Do Kyohan: The Master Text",
                                author: "Maestro Gichin Funakoshi",
                                year: 1973,
                                editorial: "Kodansha International",
                                chapter: "Capítulo II: El Tanden como centro de gravedad y respiración abdominal",
                                note: "Explica que toda postura estable requiere concentrar el peso y la respiración en el bajo vientre (Tanden)."
                            },
                            {
                                title: "The History of Karate: Okinawan Goju Ryu",
                                author: "Morio Higaonna",
                                year: 1996,
                                editorial: "Dragon Books",
                                chapter: "Capítulo 4: El desarrollo del Tanden mediante el kata Sanchin",
                                note: "Análisis histórico y fisiológico de la respiración Ibuki para fortalecer la zona abdominal y proteger los órganos internos."
                            },
                            {
                                title: "Bubishi: A la source du Karate-Do",
                                author: "Roland Habersetzer",
                                year: 1986,
                                editorial: "Éditions Amphora",
                                chapter: "Capítulo III: La circulación del Ki y el reservorio del Dan Tien",
                                note: "Estudio sobre los conceptos de la medicina tradicional china y su adopción en las artes marciales okinawenses."
                            }
                        ]
                    },
                    {
                        id: "q-cuerpo-9",
                        type: "multiple_choice",
                        prompt: "Cuando el Sensei dice '¡Ashi!' en el tatami, ¿a qué parte se refiere?",
                        options: [
                            { id: "o1", text: "Al pie o pierna", isCorrect: true },
                            { id: "o2", text: "Al hombro", isCorrect: false },
                            { id: "o3", text: "Al pecho", isCorrect: false },
                            { id: "o4", text: "A la oreja", isCorrect: false },
                        ],
                        correctAnswerId: "o1",
                        explanation: "¡Así es! 足 (Ashi) significa pie o pierna, la base para caminar y desplazarse en el dojo.",
                        hint: "Es con lo que pisas fuerte el tatami.",
                        references: [
                            {
                                title: "Karate Dinámico: Movimiento de Pies (Ashi-sabaki)",
                                author: "Maestro Masatoshi Nakayama",
                                year: 1986,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 3: Ashi-sabaki: desplazamiento con Yori-ashi, Tsugi-ashi y Okuri-ashi",
                                note: "Tratado biomecánico sobre la distribución del peso en la planta del pie (Teisoku) y el metatarso (Koshi)."
                            },
                            {
                                title: "Karate-Do Kyohan: The Master Text",
                                author: "Maestro Gichin Funakoshi",
                                year: 1973,
                                editorial: "Kodansha International",
                                chapter: "Capítulo V: Trabajo de pies y posturas básicas (Dachi)",
                                note: "Define la conexión entre el pie (Ashi) y el suelo para generar solidez y ligereza."
                            },
                            {
                                title: "Shotokan Karate: A Precise History",
                                author: "Harry Cook",
                                year: 2001,
                                editorial: "Cook & Page",
                                chapter: "Capítulo 5: Principios de desplazamiento y combate",
                                note: "Detalla la evolución de los desplazamientos ágiles introducidos por Yoshitaka Funakoshi."
                            }
                        ]
                    },
                    {
                        id: "q-cuerpo-10",
                        type: "matching",
                        prompt: "Para pararte derechito como un karateka (Shisei), empareja el tronco:",
                        explanation: "¡Excelente! Pecho abierto (Mune), espalda recta (Senaka) y hombros abajo (Kata).",
                        hint: "Mune es pecho y Senaka espalda.",
                        pairs: [
                            { id: "p1", left: "胸 (Mune)", right: "Pecho (abierto sin tensión)" },
                            { id: "p2", left: "背中 (Senaka)", right: "Espalda (columna derechita)" },
                            { id: "p3", left: "肩 (Kata)", right: "Hombros (relajados)" },
                        ],
                        references: [
                            {
                                title: "Karate Dinámico: La Postura Correcta (Shisei)",
                                author: "Maestro Masatoshi Nakayama",
                                year: 1986,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 1: Alineación del torso: Mune, Senaka y relajación escapular",
                                note: "Estudio biomecánico sobre la posición del esternón y la columna neutra al ejecutar técnicas de Kime."
                            },
                            {
                                title: "Karate-Do Kyohan: The Master Text",
                                author: "Maestro Gichin Funakoshi",
                                year: 1973,
                                editorial: "Kodansha International",
                                chapter: "Capítulo III: Postura correcta del cuerpo humano (Shisei)",
                                note: "Enfatiza que encoger los hombros (Kata) debilita el impacto y agota la energía innecesariamente."
                            },
                            {
                                title: "Tales of Okinawa's Great Masters",
                                author: "Maestro Shoshin Nagamine",
                                year: 2000,
                                editorial: "Tuttle Publishing",
                                chapter: "Capítulo 3: La rectitud física y moral del karateka tradicional",
                                note: "Anécdotas de maestros de Shuri y Tomari que corregían la verticalidad de la espalda (Senaka) mediante el entrenamiento diario."
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kumite-tradicional",
                number: 3,
                title: "Kihon",
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
                        hint: "Kumi = enlazar o unir; Te = mano.",
                        references: [
                            {
                                title: "La Esencia del Karate-Do Okinawense",
                                author: "Maestro Shoshin Nagamine (10° Dan)",
                                year: 1998,
                                editorial: "Editorial Miraguano",
                                chapter: "Capítulo 1: Del Tegumi primitivo al Kumite: entrelazar las manos en combate",
                                note: "Investigación sobre la lucha autóctona de Okinawa (Tegumi) como precursora del combate cuerpo a cuerpo."
                            },
                            {
                                title: "Karate Shotokan: Una Historia Precisa",
                                author: "Harry Cook",
                                year: 2001,
                                editorial: "Edición Histórica Marcial / Page Bros",
                                chapter: "Capítulo 5: Etimología marcial del término Kumite (組手) y sus orígenes okinawenses",
                                note: "Análisis lingüístico e histórico de cómo 'entrelazar manos' evolucionó a combate reglado."
                            },
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 4: El significado de Kumite: unir voluntades y entrelazar manos en el dojo",
                                note: "Funakoshi expone la transición del entrenamiento solista en kata hacia el encuentro respetuoso de manos."
                            }
                        ]
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
                        hint: "Significa terminar el combate de un solo impacto.",
                        references: [
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 5: El concepto de Ikken Hissatsu y la determinación decisiva en el combate",
                                note: "La doctrina de concentrar cuerpo y mente en un solo golpe resolutivo para frenar de inmediato la agresión."
                            },
                            {
                                title: "Karate Dinámico: Instrucción Oficial y Principios Biomecánicos",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1986,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 2: La concentración de energía resolutiva: El principio de Ikken Hissatsu",
                                note: "Estudio sobre la física del impacto y la máxima transferencia cinética en un instante único."
                            },
                            {
                                title: "Bubishi: La Biblia del Karate",
                                author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                                year: 2001,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 6: La búsqueda de la eficacia fulminante en el combate civil de Ryukyu",
                                note: "Antecedentes chinos y okinawenses de la resolución de conflictos sin prolongar la confrontación."
                            }
                        ]
                    },
                    {
                        id: "q-kumite-3",
                        type: "true_false",
                        prompt: "¿El combate libre (Jiyu Kumite) competitivo siempre formó parte de la enseñanza original de Okinawa?",
                        correctBool: false,
                        explanation: "¡Falso! En Okinawa se practicaba Yakusoku Kumite (preestablecido) y kata; el combate libre moderno nació en las universidades japonesas del siglo XX.",
                        hint: "Revisa el rol de los clubes universitarios de Tokio en 1920.",
                        references: [
                            {
                                title: "Karate Shotokan: Una Historia Precisa",
                                author: "Harry Cook",
                                year: 2001,
                                editorial: "Edición Histórica Marcial / Page Bros",
                                chapter: "Capítulo 7: La invención del Jiyu Kumite libre en las universidades de Tokio por Yoshitaka Funakoshi",
                                note: "Documentación sobre los primeros combates libres desarrollados en las universidades de Keio y Waseda."
                            },
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 3: Cómo el karate antiguo de katas evolucionó hacia el combate libre universitario",
                                note: "Funakoshi narra los debates iniciales sobre si permitir o no el combate libre entre los jóvenes universitarios."
                            },
                            {
                                title: "Karate de Okinawa: Maestros, Estilos y Métodos Secretos",
                                author: "Mark Bishop",
                                year: 1999,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 4: La ausencia de combate libre deportivo en la antigua Okinawa y el predominio del Yakusoku Kumite",
                                note: "Explica cómo la letalidad de las técnicas tradicionales impedía los combates libres deportivos en Ryukyu."
                            }
                        ]
                    }
                ]
            },
            {
                id: "level-kata-blanco",
                number: 4,
                title: "Kata",
                subtitle: "La enciclopedia viva del Karate-Do: Taikyoku Shodan, Embusen y Bunkai",
                tag: "Kata & Formas",
                icon: "📜",
                color: "gold",
                xpReward: 80,
                theory: {
                    title: "Kata (型 / 形) — El Alma y la Biblioteca Viva del Karate",
                    subtitle: "Secuencias sagradas, memoria corporal y la aplicación real (Bunkai)",
                    quote: "El Kata no es una simple danza; es un combate real grabado en la memoria del cuerpo donde cada respiración y cada pausa deciden la vida. — Maestro Gichin Funakoshi",
                    content: [
                        "1. ¿Qué es un Kata?: Literalmente significa 'forma' o 'molde'. En la tradición marcial de Okinawa y Japón, el Kata es la enciclopedia viva y el archivo histórico del Karate. Es una coreografía geométrica predeterminada que simula un combate a muerte contra múltiples adversarios invisibles.",
                        "2. Taikyoku Shodan (太極初段): Creado por Gichin Funakoshi junto a su hijo Yoshitaka, 'Taikyoku' significa 'Gran Causa Primera' o 'El Gran Origen'. Es la primera forma que aprende todo cinturón blanco. Consta de 20 movimientos ejecutados en un diagrama geométrico en forma de 'H' o 'I', combinando únicamente la postura Zenkutsu-dachi con bloqueos bajos (Gedan-Barai) y golpes de puño directos (Oi-Zuki).",
                        "3. El Embusen (演武線): Es la línea de desplazamiento o mapa geométrico dibujado en el tatami sobre el cual se desarrolla el kata. Todo kata tradicional debe iniciar y concluir exactamente en el mismo punto de origen, simbolizando el ciclo completo de la energía y el equilibrio absoluto.",
                        "4. El Secreto del Bunkai (分解): Detrás de cada bloqueo y golpe del kata reside el Bunkai ('desarmar' o 'analizar'). Lo que aparenta ser un bloqueo ante la mirada no iniciada, es en realidad una luxación articular (Kansetsu-waza), un derribo (Nage-waza) o un ataque a puntos vitales (Kyusho) preservado por los maestros antiguos.",
                        "5. Kiai, Zanshin y Ritmo: Un kata vivo requiere alternar lentitud y explosividad, relajación y Kime, sellando los giros cruciales con el grito de Ki (Kiai en los movimientos 8 y 16) y manteniendo la alerta mental imperturbable (Zanshin) hasta el saludo final Rei."
                    ],
                    bulletPoints: [
                        {
                            title: "Taikyoku Shodan (太極初段)",
                            desc: "La matriz básica de 20 pasos en forma de 'H': Zenkutsu-dachi, Gedan-Barai y Oi-Zuki.",
                            badge: "Primera Forma"
                        },
                        {
                            title: "Embusen (演武線)",
                            desc: "Línea geométrica del kata: comenzar y finalizar exactamente en las mismas coordenadas.",
                            badge: "Geometría Zen"
                        },
                        {
                            title: "Bunkai (分解)",
                            desc: "La aplicación combativa real: luxaciones, derribos y defensa personal oculta en las formas.",
                            badge: "Clave Aplicada"
                        }
                    ],
                    references: [
                        {
                            title: "Karate-Do Kyohan: El Texto Maestro",
                            author: "Maestro Gichin Funakoshi",
                            year: 1973,
                            editorial: "Kodansha International",
                            chapter: "Capítulo IV: La pedagogía de las formas Taikyoku y Heian",
                            note: "Fundamento de por qué los katas Taikyoku fueron creados para educar la lateralidad y los giros en los principiantes."
                        },
                        {
                            title: "Bunkai-Jutsu: The Practical Application of Karate Kata",
                            author: "Iain Abernethy (7° Dan)",
                            year: 2002,
                            editorial: "Summersdale Publishers",
                            chapter: "Capítulo 1: Deconstruyendo el Kata: Principios de combate cuerpo a cuerpo",
                            note: "Investigación sobre las aplicaciones pragmáticas de palancas y puntos de presión ocultas en las formas básicas."
                        }
                    ]
                },
                questions: [
                    {
                        id: "q-kata-definicion-esencia",
                        type: "multiple_choice",
                        prompt: "¿Qué es en su esencia más profunda un KATA (型 / 形) en el Karate-Do?",
                        description: "La biblioteca motriz heredada de los maestros de Okinawa.",
                        options: [
                            {
                                id: "o1",
                                text: "📜 Una secuencia predeterminada de técnicas que simula un combate y preserva la sabiduría del arte",
                                isCorrect: true
                            },
                            {
                                id: "o2",
                                text: "🥊 Un calentamiento gimnástico sin ninguna aplicación de defensa real",
                                isCorrect: false
                            },
                            {
                                id: "o3",
                                text: "🏃 Una carrera de velocidad entre compañeros de dojo",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "🧘 Un ejercicio donde está prohibido moverse del lugar",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o1",
                        explanation: "¡Exacto! El Kata es la enciclopedia viva del Karate: una coreografía marcial precisa que codifica ataques, defensas, distancias y estrategias contra adversarios imaginarios.",
                        hint: "Piensa en el Kata como una biblioteca grabada en movimiento corporal."
                    },
                    {
                        id: "q-kata-taikyoku-shodan-movimientos",
                        type: "multiple_choice",
                        prompt: "¿Qué técnicas y posturas componen la primera forma básica TAIKYOKU SHODAN?",
                        description: "El primer kata que aprende todo cinturón blanco en el dojo.",
                        options: [
                            {
                                id: "o1",
                                text: "🥋 Zenkutsu-dachi + Gedan-Barai (bloqueo bajo) + Oi-Zuki (puño directo)",
                                isCorrect: true
                            },
                            {
                                id: "o2",
                                text: "🦶 Kiba-dachi + Mawashi-Geri + Shuto-Uke",
                                isCorrect: false
                            },
                            {
                                id: "o3",
                                text: "🗡️ Salto giratorio con patada voladora en el aire",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "🛡️ Solo posturas estáticas de meditación sentada (Seiza)",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o1",
                        explanation: "¡Correcto! Taikyoku Shodan consta de 20 movimientos ejecutados en postura Zenkutsu-dachi, utilizando únicamente la defensa baja Gedan-Barai y el puño frontal Oi-Zuki.",
                        hint: "Es la combinación básica de paso largo frontal con bloqueo bajo y golpe de puño directo."
                    },
                    {
                        id: "q-kata-embusen-concepto",
                        type: "multiple_choice",
                        prompt: "¿Qué es el EMBUSEN (演武線) de un Kata?",
                        description: "La regla de oro de la precisión espacial en el tatami.",
                        options: [
                            {
                                id: "o1",
                                text: "📐 La línea o diagrama geométrico en el suelo que el practicante debe iniciar y finalizar en el mismo punto",
                                isCorrect: true
                            },
                            {
                                id: "o2",
                                text: "🥋 El cinturón especial que se usa únicamente en competiciones de kata",
                                isCorrect: false
                            },
                            {
                                id: "o3",
                                text: "⏱️ El cronómetro digital que mide la velocidad del practicante",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "📣 El silbato que hace sonar el sensei para cambiar de técnica",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o1",
                        explanation: "¡Excelente! El Embusen es la trayectoria espacial geométrica del kata. Una prueba clave de dominio técnico es comenzar y regresar exactamente al mismo punto de partida.",
                        hint: "Se refiere al trazo o dibujo geométrico que marcas sobre el piso al desplazarte."
                    },
                    {
                        id: "q-kata-bunkai-concepto",
                        type: "multiple_choice",
                        prompt: "¿Qué significa el término BUNKAI (分解) en el entrenamiento de Kata?",
                        description: "El puente entre la forma solitaria y la efectividad combativa real.",
                        options: [
                            {
                                id: "o1",
                                text: "⚔️ La aplicación práctica y descifrado de cada técnica del kata en combate real con compañero",
                                isCorrect: true
                            },
                            {
                                id: "o2",
                                text: "🧹 El ritual de limpiar el suelo del dojo con agua al terminar",
                                isCorrect: false
                            },
                            {
                                id: "o3",
                                text: "🍱 La comida ceremonial compartida con el maestro tras el examen",
                                isCorrect: false
                            },
                            {
                                id: "o4",
                                text: "💤 El descanso de diez minutos entre ejercicios pesados",
                                isCorrect: false
                            }
                        ],
                        correctAnswerId: "o1",
                        explanation: "¡Brillante! Bunkai significa 'analizar o desarmar'. Es la explicación combativa real con compañero (luxaciones, golpes, derribos) que da vida y propósito a cada movimiento del kata.",
                        hint: "Palabra clave: aplicación práctica combate a combate."
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
                            { id: "o1", text: "Zenkutsu-dachi (前屈立ち)", isCorrect: true },
                            { id: "o2", text: "Kokutsu-dachi (後屈立ち)", isCorrect: false },
                            { id: "o3", text: "Kiba-dachi (騎馬立ち)", isCorrect: false },
                            { id: "o4", text: "Neko-ashi-dachi (猫足立ち)", isCorrect: false },
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
                            { id: "o1", text: "Gyaku-Zuki (逆突き)", isCorrect: true },
                            { id: "o2", text: "Oi-Zuki (追い突き)", isCorrect: false },
                            { id: "o3", text: "Kizami-Zuki (刻み突き)", isCorrect: false },
                            { id: "o4", text: "Tetsui-Uchi (鉄槌打ち)", isCorrect: false },
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
                            { id: "o1", text: "Age-Uke (上げ受け)", isCorrect: true },
                            { id: "o2", text: "Gedan-Barai (下段払い)", isCorrect: false },
                            { id: "o3", text: "Soto-Uke (外受け)", isCorrect: false },
                            { id: "o4", text: "Shuto-Uke (手刀受け)", isCorrect: false },
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
