import { Unit, BeltRankId } from "@/types/didactica";
import { KYU_UNITS } from "./units/kyuUnits";
import { DAN_UNITS } from "./units/danUnits";
import { SHOTOKAN_KANJIS } from "./shotokanKanjis";
import { KIAI_KANJIS } from "./kiaiKanjis";
import { KATA_KANJIS } from "./kataKanjis";

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
                    subtitle: "La Travesía de la Mano Vacía, los 3 Pilares y las Tres Ramas Matrices de Okinawa",
                    quote: "El Karate no consiste en herir o vencer a otros; consiste en vencer las propias debilidades, dominar el ego y forjar un espíritu noble de rectitud, serenidad y paz. — Maestro Gichin Funakoshi (Padre del Karate Moderno)",
                    images: [
                        {
                            src: "/images/didactic/kuma_pixar_origins_map.jpg",
                            alt: "La Ruta del Barco de Kuma: De China a Okinawa y su expansión a Japón",
                            caption: "Fig 1. La Travesía de la Mano Vacía: El Kung-Fu de China viajó a la Isla de Okinawa donde nació el Karate, y el Maestro Funakoshi lo expandió a las universidades de Japón y al mundo entero."
                        },
                        {
                            src: "/images/didactic/kuma_pixar_okinawa_branches.jpg",
                            alt: "El Triángulo Histórico de Okinawa: Shuri-Te, Tomari-Te y Naha-Te",
                            caption: "Fig 2. El Triángulo de Ryukyu: Las tres ramas matrices de donde nació el Karate: Shuri-Te (Castillo Real y nobleza), Tomari-Te (bahía pesquera y campesinos) y Naha-Te (puerto comercial y marineros)."
                        },
                        {
                            src: "/images/didactic/kuma_pixar_tree_pillars.jpg",
                            alt: "Los 3 Pilares del Karate: Kihon, Kata y Kumite",
                            caption: "Fig 3. El Árbol de los 3 Pilares (Kihon, Kata y Kumite): Las raíces de Kihon alimentan el tronco firme de Kata para desarrollar el combate Kumite con respeto, distancia y control."
                        },
                        {
                            src: "/images/didactic/bubishi_ancient_scroll.jpg",
                            alt: "El Manuscrito Clásico Bubishi (武備志)",
                            caption: "Fig 4. El Manuscrito Secreto Bubishi (武備志): compendio canónico de 48 técnicas combativas de Grulla Blanca de Fujian preservado en secreto en Okinawa."
                        }
                    ],
                    content: [
                        "1. La Travesía de la Mano Vacía y la Ruta del Barco (China ➔ Okinawa ➔ Japón): El Karate-Do (空手道) no nació en el Japón continental, sino en el antiguo archipiélago de Ryukyu —hoy prefectura de Okinawa—. Por su posición privilegiada en el Mar de China Oriental, los maestros pioneros viajaron en barco a la provincia de Fujian (China meridional) para estudiar el Quan-Fa (Kung-Fu) y el boxeo de la Grulla Blanca. Este saber navegó hacia Okinawa y se fusionó con el combate autóctono insular ('Te') para dar origen a la 'Mano Vacía'. Décadas después, el Maestro Gichin Funakoshi zarpó desde Okinawa hacia el puerto de Tokio en 1922, presentando el arte marcial en el Ministerio de Educación y fundando los primeros clubes en universidades japonesas (Keio, Waseda, Takushoku), abriendo las puertas para que el Karate se expandiera a todos los dojos del planeta.",
                        "2. Cartografía Ancestral de Okinawa: Las Tres Ramas Matrices (Shuri, Tomari y Naha): Antes de las escuelas modernas, el arte se conocía como 'Okinawa-Te' y se forjó en un triángulo geográfico histórico de tres ciudades con identidades marciales únicas (Fig 2):\n\n• Shuri-Te (首里手 - La Corte Real y la Nobleza Peichin): Desarrollado en la colina del Castillo de Shuri por la aristocracia y la escolta de los reyes de Ryukyu. Se distingue por desplazamientos lineales fulminantes, velocidad explosiva, posturas dinámicas y contraataques decisivos de largo alcance. Maestros cumbres: Kanga Sakugawa, Sokon Matsumura y Anko Itosu. Es la matriz directa del estilo Shotokan (fundado por Gichin Funakoshi) y co-fundamento del Shito-Ryu (Kenwa Mabuni).\n\n• Tomari-Te (泊手 - Los Pescadores, Náufragos y la Esquiva Tenshin): Forjado en la bahía y puerto pesquero de Tomari, nutrido por náufragos chinos y marineros que enseñaron en secreto a orillas del mar. Se caracteriza por su asombrosa ligereza, giros en rotación evasiva (Tenshin), cambios repentinos de altura y fintas con saltos sorpresivos. Maestros cumbres: Kosaku Matsumora, Kishin Teruya y Choki Motobu. Preservó katas clásicas como Rohai, Wankan y Chinto (Gankaku).\n\n• Naha-Te (那覇手 - El Puerto Mercantil, Enraizamiento e Ibuki): Nacido en el bullicioso puerto comercial de Naha y la comunidad china de Kumemura. Con fuerte raíz en el boxeo del sur de China, se enfoca en el combate a muy corta distancia, posiciones bajas y sólidas (Sanchin-dachi), agarres pesados y respiración diafragmática profunda e isométrica (Ibuki) que fortalece el cuerpo como hierro. Maestros cumbres: Kanryo Higaonna y Chojun Miyagi. Dio origen directo al estilo Goju-Ryu ('Duro y Suave') y al Uechi-Ryu.",
                        "3. El Árbol de los 3 Pilares del Karate: La Tríada de las 3 'K' (Kihon, Kata y Kumite): La pedagogía tradicional compara al Karate con un árbol en crecimiento (Fig 3) que se desarrolla en equilibrio constante:\n\n• Kihon (基本 - La Raíz Profunda): Son los cimientos biomecánicos: posturas (Dachi), golpes de puño (Tsuki), bloqueos (Uke) y patadas (Geri). Una raíz sólida da estabilidad; por ello, la repetición constante del Kihon forja la alineación articular, el equilibrio y la firmeza postural.\n\n• Kata (型 - El Tronco Sólido): Es la estructura central que une todo el árbol. Cada Kata es una enciclopedia en movimiento creada por los maestros antiguos para preservar las secuencias técnicas y aplicaciones prácticas (Bunkai) sin necesidad de registros escritos.\n\n• Kumite (組手 - Las Flores del Combate): Es la copa florecida del árbol; la práctica con un compañero donde la técnica se aplica de forma dinámica. No busca lastimar ni vencer por fuerza desmedida, sino ejercitar la distancia adecuada (Maai), el tiempo de reacción, la concentración y el respeto mutuo, aplicando el control milimétrico (Sundome) para cuidar la integridad física del compañero.",
                        "4. La Invasión Satsuma de 1609 y la Forja Clandestina del Kobudo: En 1609, los samuráis del clan Satsuma invadieron Ryukyu e impusieron un edicto de desarme absoluto castigado con la pena de muerte. Los maestros llevaron el entrenamiento marcial a la clandestinidad nocturna, endureciendo sus nudillos contra el makiwara forrado de paja, y transformaron aperos de labranza y pesca en armas defensivas (el Bo o vara larga, el Tonfa o manivela de molino de arroz, el Sai o tridente, el Nunchaku y el remo Eku).",
                        "5. El Manuscrito Clásico Bubishi (武備志): Tratado Histórico del Karate: El documento tradicional más influyente preservado por los maestros antiguos es el Bubishi (武備志 - 'Tratado de Preparación Marcial'). Este texto histórico, copiado a mano y transmitido de maestro a discípulo en Okinawa, recopila 48 posturas combativas ilustradas de la Grulla Blanca de Fujian, nociones anatómicas de puntos vulnerables (Kyusho), y formulaciones de medicina herbolaria tradicional y digitopuntura para el tratamiento de lesiones y golpes. Maestros fundamentales como Kanryo Higaonna, Chojun Miyagi, Anko Itosu, Kenwa Mabuni y Gichin Funakoshi conservaron copias de este tratado clásico.",
                        "6. La Cumbre Histórica de Naha de 1936 y la Esencia de 'Mano Vacía': A inicios del siglo XX, Gichin Funakoshi y otros pioneros llevaron el arte a Tokio y a las universidades japonesas. El 25 de octubre de 1936, los máximos maestros de Okinawa (Chojun Miyagi, Chomo Hanashiro, Kentsu Yabu, Choki Motobu, Choshin Chibana, Shinpan Shiroma y Genwa Nakasone) celebraron una reunión cumbre en el palacio Showa Kaikan de Naha. En un acuerdo histórico, oficializaron el reemplazo del kanji original 唐手 ('To-de' / Mano de la dinastía Tang de China) por el ideograma homófono 空手 ('Kara-Te' / Mano Vacía), incorporando el sufijo 'Dō' (道 - Vía espiritual de superación personal). Esta evolución filosófica se basa en el principio Zen del vacío: 'Vaciar la mente de ego, vanidad, rencor y soberbia para reflejar el universo con la nitidez y calma de un espejo de agua'. Cada 25 de octubre se celebra el Día Mundial del Karate en conmemoración de aquella asamblea.",
                        "7. Pilares Éticos y Biomecánicos: Fundamentos del Dojo a la Vida Diaria: La práctica tradicional del Karate se apoya en los tres pilares de Kihon (fundamentos biomecánicos y postura), Kata (las formas clásicas del estilo y sus aplicaciones prácticas Bunkai) y Kumite (la práctica interactiva donde se ejercita la distancia Maai y el autocontrol). Toda esta disciplina técnica está orientada a principios fundamentales de convivencia y ética marcial: 'Karate ni sente nashi' (空手に先手なし - En el Karate no existe el primer ataque; el practicante evita cualquier agresión y solo actúa con fines de autodefensa legítima), 'Rei' (礼 - Respeto mutuo y cortesía que rige el inicio y final de cada práctica) y el control absoluto del impacto (Sundome) para cuidar siempre la seguridad de los compañeros de entrenamiento."
                    ],
                    bulletPoints: [
                        {
                            title: "La Travesía del Barco: China ➔ Okinawa ➔ Japón",
                            desc: "El Kung-Fu navegó en barco de China a Okinawa para crear la Mano Vacía, y el Maestro Funakoshi lo llevó a Tokio y a las universidades para darlo a conocer al mundo entero.",
                            badge: "Ruta Histórica",
                            image: "/images/didactic/kuma_pixar_origins_map.jpg"
                        },
                        {
                            title: "El Triángulo Histórico de Okinawa (Shuri, Tomari y Naha)",
                            desc: "Las tres ciudades matrices donde nació el Karate-Do: la nobleza de Shuri, los pescadores de Tomari y los marineros comerciantes de Naha.",
                            badge: "3 Ramas Matrices",
                            image: "/images/didactic/kuma_pixar_okinawa_branches.jpg"
                        },
                        {
                            title: "Los 3 Pilares: Las 3 'K' (Kihon, Kata y Kumite)",
                            desc: "La raíz profunda de Kihon sostiene el tronco estructurado de Kata para hacer florecer el combate Kumite con respeto, distancia y control.",
                            badge: "Pilares del Árbol",
                            image: "/images/didactic/kuma_pixar_tree_pillars.jpg"
                        },
                        {
                            title: "Shuri-Te (首里手): Nobleza, Agilidad y Velocidad",
                            desc: "Nacido en el Castillo de Shuri entre la corte real y nobles Peichin. Desplazamientos lineales fulminantes y velocidad explosiva. Matriz directa de Shotokan y Shito-Ryu.",
                            badge: "Palacio Real",
                            image: "/images/didactic/kuma_pixar_okinawa_branches.jpg"
                        },
                        {
                            title: "Naha-Te (那覇手): Puerto Comercial, Fuerza e Ibuki",
                            desc: "Cultivado en el puerto marítimo de Naha y Kumemura. Combate a corta distancia, postura sólida Sanchin y respiración diafragmática profunda Ibuki. Matriz de Goju-Ryu y Uechi-Ryu.",
                            badge: "Fuerza y Respiración",
                            image: "/images/didactic/kuma_pixar_okinawa_branches.jpg"
                        },
                        {
                            title: "Tomari-Te (泊手): Pescadores, Fluidez y Evasión",
                            desc: "Originado en la bahía de Tomari, enriquecido por náufragos chinos. Ágil, acrobático y rico en giros evasivos Tenshin y saltos sorpresivos. Creador de katas Rohai y Chinto.",
                            badge: "Fluidez Evasiva",
                            image: "/images/didactic/kuma_pixar_okinawa_branches.jpg"
                        },
                        {
                            title: "El Manuscrito Clásico Bubishi (武備志)",
                            desc: "El manual fundacional del Karate: 48 técnicas combativas de la Grulla Blanca, anatomía de puntos vulnerables (Kyusho) y medicina tradicional transmitida entre maestros.",
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
                            title: "Karate Ni Sente Nashi y el Autocontrol Sundome",
                            desc: "'En el Karate no existe el primer ataque'. Máxima ética universal del Maestro Funakoshi que consagra al Karate como un camino de preservación de la vida, humildad y dominio absoluto del ego.",
                            badge: "Pilar Moral"
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
                            chapter: "Capítulo II y III: La travesía de Okinawa a Tokio y la trascendental asamblea de maestros de Naha en 1936",
                            note: "Autobiografía indispensable del padre del Karate moderno que relata las sesiones secretas nocturnas, el viaje a Japón y la adopción filosófica del kanji 'Vacío' (空)."
                        },
                        {
                            title: "La Historia del Karate: Goju-Ryu de Okinawa",
                            author: "Maestro Morio Higaonna (10° Dan)",
                            year: 1996,
                            editorial: "Editorial Miraguano (Madrid)",
                            chapter: "Capítulo 1 y 3: Las tres ramas de Ryukyu (Shuri, Tomari y Naha) y las raíces en Fujian",
                            note: "Crónica antropológica de primera mano sobre la preservación de los métodos de combate en Naha, la respiración Ibuki y la transmisión del Bubishi a Chojun Miyagi."
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
                            title: "El Mejor Karate: Fundamentos (Vol. 1)",
                            author: "Maestro Masatoshi Nakayama (Director Técnico JKA)",
                            year: 1989,
                            editorial: "Editorial Tutor (Madrid)",
                            chapter: "Capítulo 1: La tríada pedagógica del Karate-Do: Kihon, Kata y Kumite en equilibrio formativo",
                            note: "Manual técnico de referencia mundial sobre la relación indisociable entre la raíz básica, la forma clásica y la floración del combate libre."
                        },
                        {
                            title: "Karate-Do Kyohan: El Texto Maestro",
                            author: "Maestro Gichin Funakoshi",
                            year: 1935,
                            editorial: "Editorial Eyras (Madrid)",
                            chapter: "Capítulo 2: Relación recíproca entre Kata, Kihon y el combate libre Kumite",
                            note: "Explica cómo la técnica básica forja el cuerpo, la kata estructura la memoria marcial y el combate libre prueba el temple bajo autocontrol."
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
                            author: "Maestro Masatoshi Nakayama",
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
                        prompt: "Traza con tu dedo o mouse los Kanjis de KARATE-DO (空手道)",
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
                        id: "q-shotokan-kanji-draw",
                        type: "kanji_draw",
                        prompt: "Traza los Kanjis de SHŌTŌKAN (松濤館)",
                        description: "Sigue los trazos en el pergamino para forjar el nombre del estilo de Gichin Funakoshi.",
                        kanjiList: SHOTOKAN_KANJIS,
                        explanation: "¡Excelente maestría! Shōtōkan (松濤館) significa 'La Casa del Susurro de los Pinos'. Shōtō (松濤 - Olas de Pino) era el seudónimo poético de Funakoshi en su juventud en Okinawa, y Kan (館) representa el dojo o escuela.",
                        hint: "Sigue el punto rojo numerado y traza en dirección a las guías.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 8: El Seudónimo Shōtō y la Creación del Shōtōkan",
                                note: "Narra cómo su seudónimo literario en Okinawa dio nombre al dojo central inaugurado en Tokio en 1939."
                            },
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Prólogo: La Filosofía de Shōtō y la Rectitud Marcial",
                                note: "Describe la conexión entre la resistencia del pino ante el viento y el carácter perseverante del karateka."
                            },
                            {
                                title: "Karate Shotokan: Una Historia Precisa",
                                author: "Harry Cook",
                                year: 2004,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 5: El Primer Dojo Central Shōtōkan en Tokio (1939)",
                                note: "Documenta la construcción del salón central Meikyokan/Shotokan y el origen de la placa caligráfica en madera."
                            }
                        ]
                    },
                    {
                        id: "q-shodo-numeros-1-10",
                        type: "shodo_numbers",
                        prompt: "Conteo Marcial: Los Números del 1 al 10",
                        description: "Traza con el pincel los 10 Kanjis y aprende su pronunciación tradicional en el Dojo.",
                        image: "/images/didactic/kuma_pixar_shodo_numbers.jpg",
                        options: [],
                        correctAnswerId: "completed",
                        explanation: "¡Excelente maestría! Ahora dominas el conteo del 1 al 10 en japonés (Ichi, Ni, San, Shi, Go, Roku, Shichi, Hachi, Kyu, Ju) para los calentamientos y series de golpes en el Dojo.",
                        references: [
                            {
                                title: "Karate-Do Kyohan: Terminología y Conteo Tradicional",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo II: Comandos y Conteo de Kihon en el Dojo",
                                note: "Establece el conteo formal del 1 al 10 en japonés para la sincronización grupal y el ritmo respiratorio."
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
                        type: "tatami_rei",
                        prompt: "Entrando al tatami de manera correcta: saludo y seguridad entrando al tatami",
                        description: "Protocolo de cortesía y seguridad al ingresar al tatami.",
                        image: "/images/didactic/kuma_tatami_3_steps.jpg",
                        explanation: "¡Excelente! Has cumplido el protocolo marcial: 1. Pararse al borde del tatami con la mano levantada, 2. Decir con energía '¡Oss Sensei!', 3. Realizar la reverencia formal Rei a 30°, y tras la aprobación del Sensei o Senpai, ingresar al tatami con honor.",
                        hint: "Sigue los 3 pasos: 1. Pararse al borde con la mano levantada, 2. Decir '¡Oss Sensei!', 3. Hacer Rei (reverencia) y esperar la aprobación del Sensei para ingresar.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 1: El espíritu del Rei y la etiqueta marcial en el dojo tradicional",
                                note: "El maestro fundador advierte que la técnica marcial sin reverencia ni respeto mutuo carece de verdadero sentido formativo."
                            },
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Principio 1: Karate-do wa rei ni hajimari, rei ni owaru koto (El Karate empieza y termina con respeto)",
                                note: "La regla de oro del Karate tradicional como sendero de autocontrol y elevación del espíritu humano."
                            },
                            {
                                title: "El Mejor Karate: Fundamentos",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1989,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 1: Reigi Sahō: El protocolo y la cortesía dentro del Dojo",
                                note: "Manual formativo que detalla la reverencia al maestro (Sensei ni rei), a los compañeros (Otagai ni rei) y al recinto del Dojo."
                            }
                        ]
                    },
                    {
                        id: "q-kiai-kanji-draw",
                        type: "kanji_draw",
                        prompt: "Traza los Kanjis del KIAI (気合): Energía & Concentración",
                        description: "Traza Ki (Energía) y Ai (Unión) para forjar la respiración y el control abdominal de Kuma Sensei.",
                        kanjiList: KIAI_KANJIS,
                        explanation: "¡KIAI extraordinario! 気合 une Ki (Energía / Espíritu) y Ai (Unión). Al emitir el Kiai, la exhalación brusca estabiliza tu centro abdominal (Tanden) y transmite la fuerza y concentración (Kime) al impacto.",
                        hint: "Sigue el punto rojo numerado para trazar cada ideograma y avanzar.",
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
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 3: La coordinación respiratoria y la manifestación del espíritu en el impacto",
                                note: "Funakoshi describe cómo el grito unifica la mente, la respiración y la tensión muscular en un solo microsegundo."
                            },
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Principio 11: El Karate debe practicarse con seriedad y espíritu sincero",
                                note: "Explica cómo la energía interior (Ki) y la concentración en el bajo vientre (Hara) forjan el carácter y la potencia del karateka."
                            }
                        ]
                    },
                    {
                        id: "q-pilares-kihon-kata-kumite",
                        type: "tree_pillars",
                        prompt: "Los 3 Pilares del Karate: ¡Completa el Árbol de las 3 'K'!",
                        description: "Ubica cada pilar en el árbol: la Raíz (Kihon), el Tronco (Kata) y las Flores (Kumite).",
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
                        id: "q-kata-bunkai-kanji-draw",
                        type: "kanji_draw",
                        prompt: "Traza los Kanjis de KATA & BUNKAI (型・解)",
                        description: "De la Forma técnica individual (型) a la Aplicación práctica en defensa (解).",
                        kanjiList: KATA_KANJIS,
                        explanation: "¡Excelente trazo! Kata (型) es el molde y archivo técnico en la memoria del cuerpo. Bunkai (解) es el análisis práctico que demuestra la aplicación de cada movimiento frente a situaciones reales de autodefensa.",
                        hint: "Sigue el punto rojo numerado para trazar cada ideograma y continuar.",
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
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 2: Relación recíproca entre Kata, Kihon y el combate libre Kumite",
                                note: "El maestro fundador explica cómo la forma preserva el arsenal técnico y el Bunkai comprueba su efectividad marcial."
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
                        type: "sundome_timing",
                        prompt: "El principio del ikken hissatsu: Control del Kime",
                        description: "Detén la técnica en la Zona Dorada a 2 centímetros del blanco para demostrar dominio marcial sin lesionar.",
                        image: "/images/didactic/kuma_pixar_ikken_hissatsu.jpg",
                        explanation: "¡Maestría marcial demostrada! Ikken Hissatsu exige entregar el 100% de tu energía y velocidad en un solo impacto decisivo, pero el verdadero cinturón negro domina el Sundome: el freno milimétrico a 2 cm para proteger la salud de su compañero.",
                        hint: "Presiona el botón de frenar cuando la aguja cruce la Zona Dorada de 2 cm.",
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
                                note: "Tratado formativo sobre el autocontrol, la disciplina y el respeto a la vida dentro y fuera del tatami."
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
                    title: "El Cuerpo Humano: Anatomía y Biomecánica en Karate",
                    subtitle: "Aprende los puntos anatómicos y las alturas en japonés de pies a cabeza",
                    quote: "El cuerpo es el instrumento del karateka: la alineación y el equilibrio comienzan desde la base en los pies y ascienden hasta la mente.",
                    content: [
                        "1. Los Tres Niveles del Cuerpo: En Karate dividimos la altura en tres zonas fundamentales: 上段 (JODAN) para la cabeza y el cuello, 中段 (CHUDAN) para el torso y el pecho, y 下段 (GEDAN) para las piernas y los pies.",
                        "2. Base e Inferior: Los pies 足 (Ashi) proporcionan el enraizamiento firme en el tatami, las rodillas 膝 (Hiza) flexionan para absorber impacto y la cadera 腰 (Koshi) es el eje biomecánico de rotación que genera potencia.",
                        "3. Centro y Tronco: El abdomen 腹 / 丹田 (Hara/Tanden) estabiliza el centro de gravedad y la respiración diafragmática, mientras el pecho 胸 (Mune) mantiene la columna vertebral erguida con hombros relajados.",
                        "4. Extremidades Superiores: Los brazos 腕 (Ude) y codos 猿臂 (Empi) forman estructuras de palanca para defensas y bloqueos, y las manos 手 (Te) se configuran en puño frontal cerrado 正拳 (Seiken) o mano espada 手刀 (Shuto).",
                        "5. Cabeza y Sentidos: La cabeza 頭 (Atama) permanece equilibrada protegiendo el cuello, y la mirada atenta 目 (Me - Metsuke) mantiene la concentración visual sin desviar la atención."
                    ],
                    images: [
                        {
                            src: "/images/didactic/kuma_clean_anatomy_bear.jpg",
                            alt: "Kuma Sensei Pixar 3D: Anatomía de Karate de Pies a Cabeza",
                            caption: "Fig 1. Mapa anatómico de Kuma Sensei: Estructura biomecánica de pies a cabeza"
                        },
                        {
                            src: "/images/didactic/kuma_pixar_alturas_karate.jpg",
                            alt: "Kuma Sensei Pixar 3D: Las 3 Alturas Jodan, Chudan y Gedan",
                            caption: "Fig 2. Los tres niveles del cuerpo en Karate: Jodan (Alto), Chudan (Medio) y Gedan (Bajo)"
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
                        type: "kuma_anatomy",
                        prompt: "Arma el Cuerpo de Kuma Sensei: De Pies a Cabeza",
                        description: "Coloca cada punto anatómico en el cuerpo de Kuma Sensei, avanzando en orden biomecánico desde la base en los pies hasta la mirada en la cabeza.",
                        image: "/images/didactic/kuma_clean_anatomy_bear.jpg",
                        explanation: "¡Excelente dominio! Has aprendido las partes anatómicas de Karate en orden de pies a cabeza: Pies (Ashi), Rodillas (Hiza), Cadera (Koshi), Abdomen (Hara/Tanden), Pecho (Mune), Brazos y Codos (Ude/Empi), Manos (Te), Cabeza (Atama) y Mirada (Me).",
                        hint: "Avanza por las 3 fases de abajo hacia arriba: primero la base (pies a cadera), luego el tronco y brazos, y por último la guardia alta (cabeza y sentidos).",
                        references: [
                            {
                                title: "Karate-Do Kyohan: The Master Text",
                                author: "Maestro Gichin Funakoshi",
                                year: 1973,
                                editorial: "Kodansha International",
                                chapter: "Capítulo III: Puntos del cuerpo humano y alineación biomecánica",
                                note: "Tratado fundamental sobre la postura recta, las articulaciones de apoyo y la distribución del peso corporal."
                            },
                            {
                                title: "Karate Dinámico: Instrucción Oficial",
                                author: "Maestro Masatoshi Nakayama",
                                year: 1986,
                                editorial: "Editorial Paidotribo",
                                chapter: "Capítulo 1: Anatomía aplicada al Karate: postura, centros de impacto y equilibrio",
                                note: "Análisis biomecánico exhaustivo de cómo la cadera (Koshi) y el abdomen (Hara) coordinan la fuerza muscular del cuerpo entero."
                            },
                            {
                                title: "The History of Karate: Okinawan Goju Ryu",
                                author: "Morio Higaonna",
                                year: 1996,
                                editorial: "Dragon Books",
                                chapter: "Capítulo 4: El acondicionamiento físico de pies a cabeza en la tradición de Okinawa",
                                note: "Detalla el fortalecimiento progresivo de las extremidades inferiores, la respiración diafragmática y la concentración visual (Metsuke)."
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
                        "Cook, Harry (2004). Karate Shotokan: Una Historia Precisa. Editorial Tutor.",
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
                    subtitle: "Formas tradicionales, memoria motriz y aplicación práctica (Bunkai)",
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
                        hint: "Piensa en el Kata como una biblioteca grabada en movimiento corporal.",
                        references: [
                            {
                                title: "Karate-Do: Mi Camino de Vida",
                                author: "Maestro Gichin Funakoshi",
                                year: 1975,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo 4: El espíritu del Kata como biblioteca viva",
                                note: "El fundador explica que los katas son la esencia eterna del Karate-Do, donde cada movimiento encierra una lección combativa y moral.",
                            },
                            {
                                title: "El Mejor Karate (Vol. 5): Heian y Tekki",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1992,
                                editorial: "Editorial Tutor",
                                chapter: "Introducción al Entrenamiento de Formas Tradicionales",
                                note: "Define el kata como una batalla simulada contra múltiples adversarios imaginarios que pule el equilibrio y la técnica pura.",
                            },
                            {
                                title: "Bunkai: Aplicaciones Prácticas y Secretas del Kata",
                                author: "Sensei Iain Abernethy (7° Dan)",
                                year: 2005,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 1: Deconstruyendo el Kata Tradicional",
                                note: "Demuestra cómo los movimientos individuales preservan derribos, luxaciones y golpes de defensa personal civil.",
                            }
                        ]
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
                        hint: "Es la combinación básica de paso largo frontal con bloqueo bajo y golpe de puño directo.",
                        references: [
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo V: Formas Básicas: Taikyoku Shodan",
                                note: "Creado por Funakoshi para enseñar los rudimentos indispensables: paso frontal Zenkutsu-dachi, bloqueo Gedan-Barai y puño Oi-Zuki.",
                            },
                            {
                                title: "Karate Kata Completo (Vol. 1): Colección Oficial Shotokan",
                                author: "Maestro Hirokazu Kanazawa (SKIF)",
                                year: 2006,
                                editorial: "Editorial Tutor",
                                chapter: "Katas Básicos: Taikyoku Shodan a Sandan",
                                note: "Guía fotográfica detallada con los 20 movimientos del kata y los dos Kiais reglamentarios.",
                            },
                            {
                                title: "El Mejor Karate (Vol. 1): Fundamentos",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1989,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 3: La Postura Zenkutsu y el Empuje Frontal",
                                note: "Analiza la biomecánica de la distribución de peso 60/40 en el avance del principiante.",
                            }
                        ]
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
                        hint: "Se refiere al trazo o dibujo geométrico que marcas sobre el piso al desplazarte.",
                        references: [
                            {
                                title: "Karate-Do Kyohan: El Texto Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1935,
                                editorial: "Editorial Eyras",
                                chapter: "Capítulo IV: El Embusen y la Orientación Espacial",
                                note: "Subraya la obligación de volver exactamente al punto de origen como prueba de equilibrio y exactitud en los desplazamientos.",
                            },
                            {
                                title: "Karate Dinámico: Instrucción Práctica y Biomecánica",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 6: La Geometría del Tatami y los Ejes del Embusen",
                                note: "Estudio métrico de las líneas de desplazamiento en forma de I, T o H en los katas Shotokan.",
                            },
                            {
                                title: "El Secreto de los Katas de Karate",
                                author: "Sensei Roland Habersetzer (9° Dan)",
                                year: 2003,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 2: El Diagrama de Desplazamiento en el Suelo (Embusen)",
                                note: "Explicación histórica de cómo los maestros antiguos trazaban el mapa de batalla en el suelo del dojo.",
                            }
                        ]
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
                        hint: "Palabra clave: aplicación práctica combate a combate.",
                        references: [
                            {
                                title: "Bubishi: La Biblia del Karate",
                                author: "Sensei Patrick McCarthy (Hanshi 9° Dan)",
                                year: 2001,
                                editorial: "Editorial Tutor",
                                chapter: "Sección Técnica: El descifrado de las posturas clásicas",
                                note: "Tratado canónico que desvela las aplicaciones ocultas de agarre, luxación y puntos vulnerables en las formas de Okinawa.",
                            },
                            {
                                title: "Bunkai: Aplicaciones Prácticas y Secretas del Kata Tradicional",
                                author: "Sensei Iain Abernethy (7° Dan)",
                                year: 2005,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 2: Principios del Bunkai Real frente a la Demostración",
                                note: "Metodología pragmática para transformar cada secuencia de kata en defensas eficaces cuerpo a cuerpo.",
                            },
                            {
                                title: "Karate Tradicional: Su Filosofía, Su Historia y Sus Fundamentos",
                                author: "Maestro Kenei Mabuni",
                                year: 2000,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 5: El Bunkai Kumite como Alma del Kata",
                                note: "El hijo del fundador de Shito-Ryu expone cómo el kata sin Bunkai se convierte en una danza vacía de espíritu marcial.",
                            }
                        ]
                    }
                ]
            }
        ]
    },

    ...KYU_UNITS,
    ...DAN_UNITS,

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
                        "Abernethy, Iain (2013). Karate Tradicional frente a Karate Deportivo: Del Punto Único al Sistema WKF. Editorial Tutor.",
                        "Federación Mundial de Karate (WKF) / RFEK (2023-2026). Reglamento Oficial de Competición de Kumite y Kata WKF. Comisión de Arbitraje RFEK / WKF."
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
                        hint: "Ocurrió 48 años después de la demostración de Funakoshi en Tokio.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite y Kata WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Sección Histórica: De la Fundación de la WUKO en Tokio 1970 a la WKF",
                                note: "Documento oficial que narra la unificación de los estilos mundiales para crear un marco de competencia seguro y global.",
                            },
                            {
                                title: "Historia del Karate Deportivo y Tradicional",
                                author: "Sensei Salvador Herráiz (7° Dan)",
                                year: 2005,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 8: El Nacimiento de la WUKO y los Primeros Mundiales",
                                note: "Crónica histórica de la unificación deportiva internacional y su camino hacia el reconocimiento olímpico.",
                            },
                            {
                                title: "Enciclopedia del Karate-Do",
                                author: "Sensei José María Fraguas (8° Dan)",
                                year: 2008,
                                editorial: "Editorial Alas",
                                chapter: "Capítulo 12: Las Organizaciones Mundiales del Karate Moderno",
                                note: "Evolución institucional y normativa del Karate como deporte federado internacional.",
                            }
                        ]
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
                        hint: "Es el número que define la victoria antes de tiempo en Kumite WKF.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 10: Duración y Finalización del Combate por Ventaja Manifiesta",
                                note: "Reglamenta la detención anticipada del encuentro cuando un atleta alcanza una ventaja clara de 8 puntos sobre su oponente.",
                            },
                            {
                                title: "Manual de Arbitraje y Criterios Técnicos de Kumite WKF",
                                author: "Comisión Nacional de Arbitraje RFEK",
                                year: 2024,
                                editorial: "Real Federación Española de Karate",
                                chapter: "Capítulo 4: Conducción del Asalto y Criterios de Victoria",
                                note: "Guía práctica para jueces sobre la aplicación de la regla de superioridad de 8 puntos en combate.",
                            }
                        ]
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
                        "Federación Mundial de Karate (WKF) / RFEK (2023-2026). Reglamento Oficial WKF: Artículo 6: Criterios de Puntuación. Comisión de Arbitraje RFEK."
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
                        hint: "Es el estado de concentración y presencia que nunca se pierde tras el ataque.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 6: Criterios de Puntuación: Zanshin (Alerta Continuada)",
                                note: "Define el Zanshin como el estado de concentración y compromiso mental ininterrumpido antes, durante y después del impacto.",
                            },
                            {
                                title: "El Mejor Karate (Vol. 3): Kumite 1",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1991,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 2: El Enfoque Visual y la Guardia Alerta Post-Ataque",
                                note: "Tratado formativo sobre mantener la guardia y la mirada fija en el rival sin relajarse jamás tras golpear.",
                            }
                        ]
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
                        hint: "Tiene que ver con la atención ininterrumpida hacia el adversario.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 6: Invalidación de Puntos por Pérdida de Zanshin",
                                note: "Estipula taxativamente que si el competidor celebra o baja la guardia antes de la voz de Yame del árbitro, el punto queda anulado.",
                            },
                            {
                                title: "Los Veinte Principios Rectores del Karate: El Legado Espiritual del Maestro",
                                author: "Maestro Gichin Funakoshi",
                                year: 1938,
                                editorial: "Editorial Tutor",
                                chapter: "Principio 12: No pienses en ganar, piensa en no ser vencido",
                                note: "El maestro advierte que la euforia prematura y el descuido mental son la causa principal de la derrota marcial.",
                            },
                            {
                                title: "Karate Dinámico: Instrucción Práctica y Biomecánica",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1994,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 4: Actitud y Compostura en el Combate Libre",
                                note: "Análisis del autocontrol ético y el temple sereno que debe manifestar todo karateka en el tatami.",
                            }
                        ]
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
                        hint: "Momento oportuno donde el adversario no puede defender.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 6: Criterios Técnicos: Buen Timing y Oportunidad",
                                note: "Detalla la ejecución de la técnica en el instante preciso de máxima vulnerabilidad motriz del adversario.",
                            },
                            {
                                title: "El Mejor Karate (Vol. 4): Kumite 2",
                                author: "Maestro Masatoshi Nakayama (JKA)",
                                year: 1991,
                                editorial: "Editorial Tutor",
                                chapter: "Capítulo 3: Anticipación y Deai en el Momento del Ataque",
                                note: "Estudio táctico de la sincronización milimétrica para interceptar golpes en el instante en que el rival inicia el avance.",
                            }
                        ]
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
                        "Federación Mundial de Karate (WKF) / RFEK. Manual Oficial de Señales y Gestos Arbitrales WKF. Real Federación Española de Karate."
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
                        hint: "Es el puntaje más alto del Karate WKF.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 7: Puntuación de Tres Puntos (Ippon)",
                                note: "El brazo elevado a 45 grados por encima del hombro es la señal oficial para conceder IPPON (patada alta Jodan o técnica a rival caído).",
                            },
                            {
                                title: "Manual Oficial de Gestos y Señales Arbitrales WKF",
                                author: "Comisión Nacional de Arbitraje RFEK",
                                year: 2024,
                                editorial: "Real Federación Española de Karate",
                                chapter: "Apéndice Gráfico: Señalización de Ippon en el Tatami",
                                note: "Guía fotográfica de la postura del árbitro central al otorgar la máxima puntuación en Kumite.",
                            }
                        ]
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
                        hint: "Vale 2 puntos y se otorga por patadas al torso.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 7: Puntuación de Dos Puntos (Waza-ari)",
                                note: "El brazo horizontal a la altura del hombro indica WAZA-ARI (2 puntos), otorgado por patadas circulares o frontales a la zona media (Chudan).",
                            },
                            {
                                title: "Manual Oficial de Gestos y Señales Arbitrales WKF",
                                author: "Comisión Nacional de Arbitraje RFEK",
                                year: 2024,
                                editorial: "Real Federación Española de Karate",
                                chapter: "Apéndice Gráfico: Señalización de Waza-ari",
                                note: "Descripción biomecánica y gestual del árbitro al señalar dos puntos.",
                            }
                        ]
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
                        hint: "Es el punto básico de puño.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 7: Puntuación de Un Punto (Yuko)",
                                note: "El brazo extendido hacia abajo a 45 grados señala YUKO (1 punto), por Tsuki directo o golpe de puño controlado a zona válida.",
                            },
                            {
                                title: "Manual Oficial de Gestos y Señales Arbitrales WKF",
                                author: "Comisión Nacional de Arbitraje RFEK",
                                year: 2024,
                                editorial: "Real Federación Española de Karate",
                                chapter: "Apéndice Gráfico: Señalización de Yuko",
                                note: "Instrucciones de arbitraje para la confirmación de impactos rápidos de puño.",
                            }
                        ]
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
                        ],
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 7: Escala Jerárquica de Puntuación: Yuko, Waza-ari e Ippon",
                                note: "Tabla comparativa que premia con mayor puntaje la dificultad técnica y la espectacularidad de las patadas frente a los puños.",
                            },
                            {
                                title: "Guía Didáctica del Karate Deportivo WKF",
                                author: "Real Federación Española de Karate (RFEK)",
                                year: 2022,
                                editorial: "RFEK Formación y Titulaciones",
                                chapter: "Módulo 3: La Puntuación en el Combate Reglamentario",
                                note: "Manual de formación docente para entrenadores nacionales sobre la táctica de acumulación de puntos.",
                            }
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
                        "Federación Mundial de Karate (WKF) / RFEK. Reglamento Oficial WKF: Artículo 13: Penalizaciones y Advertencias. Comisión de Arbitraje RFEK."
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
                        hint: "Es el paso previo antes del Hansoku definitivo.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 13: Penalizaciones y Advertencias: Hansoku-Chui",
                                note: "El dedo índice apuntando a los pies del infractor a 45 grados advierte que una nueva falta conllevará la descalificación inmediata.",
                            },
                            {
                                title: "Manual Oficial de Gestos y Señales Arbitrales WKF",
                                author: "Comisión Nacional de Arbitraje RFEK",
                                year: 2024,
                                editorial: "Real Federación Española de Karate",
                                chapter: "Apéndice Gráfico: Señalización de Hansoku-Chui",
                                note: "Protocolo visual para comunicar la advertencia grave previa a la expulsión.",
                            }
                        ]
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
                        hint: "Otorga la victoria inmediata al adversario.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 13: Descalificación del Combate (Hansoku)",
                                note: "El dedo índice señalando hacia el rostro del infractor y luego fuera del tatami decreta la derrota inmediata por acumulación de faltas o falta grave.",
                            },
                            {
                                title: "Manual Oficial de Arbitraje WKF",
                                author: "Comisión Nacional de Arbitraje RFEK",
                                year: 2024,
                                editorial: "Real Federación Española de Karate",
                                chapter: "Capítulo 6: La Aplicación de Hansoku y la Concesión de Victoria",
                                note: "Criterios para declarar vencedor al adversario ante una infracción mayor.",
                            }
                        ]
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
                        hint: "Es la sanción más severa de todas en el karate federado.",
                        references: [
                            {
                                title: "Reglamento Oficial de Competición de Kumite WKF (2023-2026)",
                                author: "Federación Mundial de Karate (WKF) / Real Federación Española de Karate (RFEK)",
                                year: 2023,
                                editorial: "Comisión de Arbitraje RFEK / WKF",
                                chapter: "Artículo 13: Expulsión Definitiva del Torneo (Shikkaku)",
                                note: "El brazo levantado hacia atrás señalando la salida del pabellón expulsa al competidor o entrenador de todo el torneo por daño malicioso o falta grave de honor.",
                            },
                            {
                                title: "Código de Ética y Disciplina Deportiva WKF",
                                author: "Federación Mundial de Karate (WKF)",
                                year: 2023,
                                editorial: "WKF Disciplinary Commission",
                                chapter: "Sección 2: Sanciones por Conducta Antideportiva y Desacato Marcial",
                                note: "Marco disciplinario que salvaguarda la dignidad, el respeto y la integridad en las competiciones federadas.",
                            }
                        ]
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
