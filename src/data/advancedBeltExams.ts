import type { BeltExamConfig } from "./beltExamData";

// ====================================================================
// EXAMEN OFICIAL: 5° KYU A 4° KYU (MORADO A MORADO CON BLANCO)
// ====================================================================
export const EXAM_KYU_5_TO_4: BeltExamConfig = {
    beltId: "kyu-5",
    targetBeltId: "kyu-4",
    beltName: "Cinturón Morado (5° Kyu)",
    targetBeltName: "Cinturón Morado con Blanco (4° Kyu)",
    targetBeltColor: "#9333EA",
    passingScore: 7,
    xpReward: 320,
    title: "Examen de Ascenso a Cinturón Morado con Blanco (4° Kyu)",
    subtitle: "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
    description: "Evaluación de transición hacia los rangos superiores: combinaciones Renraku-Waza, Heian Godan, salto en Kosa-dachi y principios de Hikite.",
    questions: [
        {
            id: "exam-k5-q1",
            type: "multiple_choice",
            prompt: "1. HISTORIA: ¿Quién fue el creador pedagógico de la serie de Katas Heian (Pinan)?",
            description: "Maestro reformador de Okinawa que introdujo el Karate en las escuelas públicas.",
            options: [
                { id: "o1", text: "Maestro Yasutsune (Anko) Itosu (1831–1915)", isCorrect: true },
                { id: "o2", text: "El guerrero Miyamoto Musashi en Kioto", isCorrect: false },
                { id: "o3", text: "El monje Bodhidharma en Henan", isCorrect: false },
                { id: "o4", text: "Jigoro Kano en el Kodokan", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "Anko Itosu sintetizó las formas antiguas (Channan/Passai) en 5 katas educativos para enseñar a niños y jóvenes la autoprotección y la paz.",
        },
        {
            id: "exam-k5-q2",
            type: "multiple_choice",
            prompt: "2. FILOSOFÍA: ¿Qué significado tiene el nombre de los Katas 'HEIAN'?",
            description: "El propósito espiritual detrás de los 5 katas básicos.",
            options: [
                { id: "o1", text: "Paz, tranquilidad y mente en calma", isCorrect: true },
                { id: "o2", text: "Guerra y destrucción total", isCorrect: false },
                { id: "o3", text: "Fuerza bruta sobre el débil", isCorrect: false },
                { id: "o4", text: "Velocidad de relámpago", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "Heian (Hei = calma, An = paz) simboliza que quien domina estas técnicas adquiere la serenidad interior para no recurrir a la violencia innecesaria.",
        },
        {
            id: "exam-k5-q3",
            type: "multiple_choice",
            prompt: "3. BIOMECÁNICA: En el salto característico de Heian Godan, ¿en qué postura se aterriza para amortiguar el impacto?",
            description: "Postura de cruce de piernas sobre los metatarsos.",
            options: [
                { id: "o1", text: "Kosa-Dachi (postura de piernas cruzadas)", isCorrect: true },
                { id: "o2", text: "Zenkutsu-Dachi", isCorrect: false },
                { id: "o3", text: "Kiba-Dachi", isCorrect: false },
                { id: "o4", text: "Heiko-Dachi", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "Kosa-dachi absorbe la energía cinética del salto flexionando ambas rodillas y bajando el centro de gravedad sin perder la verticalidad.",
        },
        {
            id: "exam-k5-q4",
            type: "multiple_choice",
            prompt: "4. KIHON: ¿Qué bloqueo reforzado en Heian Godan protege la línea media con el apoyo del segundo puño?",
            description: "Bloqueo asistido a nivel medio.",
            options: [
                { id: "o1", text: "Morote-Uke", isCorrect: true },
                { id: "o2", text: "Age-Uke", isCorrect: false },
                { id: "o3", text: "Gedan-Barai", isCorrect: false },
                { id: "o4", text: "Nukite", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "Morote-Uke ubica el puño libre cerca del codo del brazo que defiende, multiplicando la resistencia ósea y articular ante impactos pesados.",
        },
        {
            id: "exam-k5-q5",
            type: "multiple_choice",
            prompt: "5. BUNKAI: Tras el salto en Heian Godan, ¿cuál es la técnica de contraataque decisiva?",
            description: "Bloqueo simultáneo en Kokutsu-dachi o Kosa-dachi.",
            options: [
                { id: "o1", text: "Juji-Uke Gedan (bloqueo en X bajo) atrapando la patada del oponente", isCorrect: true },
                { id: "o2", text: "Un empujón con ambas palmas", isCorrect: false },
                { id: "o3", text: "Dar la espalda y retroceder", isCorrect: false },
                { id: "o4", text: "Un saludo Ritsurei", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "El salto evade un barrido bajo o ataque con arma a los tobillos, cayendo en Kosa-dachi para atrapar con Juji-uke el miembro invasor.",
        },
        {
            id: "exam-k5-q6",
            type: "multiple_choice",
            prompt: "6. BIOMECÁNICA: ¿Cuál es la función del 'Hikite' al ejecutar un golpe o bloqueo?",
            description: "La mano de retroceso a la cadera o costillas.",
            options: [
                { id: "o1", text: "Acelerar la torsión pélvica por Tercera Ley de Newton (acción-reacción) y proteger el costado", isCorrect: true },
                { id: "o2", text: "Dejar descansar el brazo mientras el otro trabaja", isCorrect: false },
                { id: "o3", text: "Indicar al árbitro que se terminó la técnica", isCorrect: false },
                { id: "o4", text: "Secar el sudor de la cara", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "Al traccionar con velocidad la mano hacia la cresta ilíaca, se activan dorsal ancho y romboides, duplicando la potencia del golpe que avanza.",
        },
        {
            id: "exam-k5-q7",
            type: "multiple_choice",
            prompt: "7. CUERPO HUMANO: En el bloqueo Shuto-Uke, ¿qué zona anatómica actúa como superficie de contacto?",
            description: "Canto cubital de la mano.",
            options: [
                { id: "o1", text: "El borde cubital carnoso de la mano abierta con dedos unidos y pulgar flexionado", isCorrect: true },
                { id: "o2", text: "La punta de las uñas", isCorrect: false },
                { id: "o3", text: "El dorso de la muñeca", isCorrect: false },
                { id: "o4", text: "La palma plana relajada", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "La mano espada (Shuto) concentra la fuerza sobre el borde externo (cúbito) mientras el pulgar flexionado hacia adentro tensa la faja muscular palmar.",
        },
        {
            id: "exam-k5-q8",
            type: "multiple_choice",
            prompt: "8. KIHON: ¿Cómo se denomina el encadenamiento fluido de múltiples técnicas consecutivas?",
            description: "Combinaciones de ataque y defensa.",
            options: [
                { id: "o1", text: "Renraku-Waza", isCorrect: true },
                { id: "o2", text: "Mokuso", isCorrect: false },
                { id: "o3", text: "Seiretsu", isCorrect: false },
                { id: "o4", text: "Tatami", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "Renraku-Waza entrena la continuidad motriz sin pausas muertas entre defensas y contragolpes.",
        },
        {
            id: "exam-k5-q9",
            type: "multiple_choice",
            prompt: "9. TÁCTICA: En combate convencional Yakusoku Kumite, ¿qué principio es primordial al atacar?",
            description: "Distancia, timing y control.",
            options: [
                { id: "o1", text: "Declarar la diana con precisión, avanzar con Kime y respetar la distancia de seguridad (Sundome)", isCorrect: true },
                { id: "o2", text: "Golpear con toda la fuerza al rostro del compañero sin frenar", isCorrect: false },
                { id: "o3", text: "Cerrar los ojos al avanzar", isCorrect: false },
                { id: "o4", text: "Retroceder sin responder", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "Yakusoku Kumite es un acuerdo técnico donde la precisión milimétrica (Sundome) demuestra maestría y respeto inquebrantable.",
        },
        {
            id: "exam-k5-q10",
            type: "multiple_choice",
            prompt: "10. BUDO: ¿Qué simboliza la franja blanca sobre el cinturón morado en el 4° Kyu?",
            description: "Transición hacia los cinturones café.",
            options: [
                { id: "o1", text: "La dualidad entre la fuerza física y el inicio de la comprensión interna hacia los grados avanzados", isCorrect: true },
                { id: "o2", text: "Un adorno estético sin significado tradicional", isCorrect: false },
                { id: "o3", text: "Que el alumno aún no sabe hacer posturas básicas", isCorrect: false },
                { id: "o4", text: "Que solo puede practicar defensa y no ataque", isCorrect: false },
            ],
            correctAnswerId: "o1",
            explanation: "La línea blanca marca el umbral donde el estudiante deja atrás las técnicas básicas y se prepara para el estudio profundo de los Katas Superiores y el Bunkai.",
        },
    ],
};

// ====================================================================
// EXAMEN OFICIAL: 4° KYU A 3° KYU (MORADO CON BLANCO A CAFÉ 3 LÍNEAS)
// Fuente: "I EXAMEN ESCRITO DE 4 KYU A 3 KYU.pdf" (38 Preguntas)
// ====================================================================
export const EXAM_KYU_4_TO_3: BeltExamConfig = {
    "beltId": "kyu-4",
    "targetBeltId": "kyu-3",
    "beltName": "Cinturón Morado con Blanco (4° Kyu)",
    "targetBeltName": "Cinturón Café 3 Líneas (3° Kyu)",
    "targetBeltColor": "#78350F",
    "passingScore": 28,
    "xpReward": 350,
    "title": "I Examen Escrito Oficial: 4° Kyu a 3° Kyu",
    "subtitle": "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
    "description": "Evaluación oficial de ascenso a Cinturón Café: Terminología marcial, Complete histórico/técnico, reconocimiento visual de Dachi-waza y ensayo formativo.",
    "questions": [
        {
            "id": "exam-4k-q1",
            "type": "multiple_choice",
            "prompt": "1. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHIHAN'?",
            "description": "Asocie de terminología marcial (Jerarquía)",
            "options": [
                {
                    "id": "o1",
                    "text": "Maestro de un rango superior",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Ponerse de pie",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Shihan (師範) designa a un maestro o profesor de rango superior y alta autoridad técnica.",
            "hint": "Rango honorífico de maestro senior."
        },
        {
            "id": "exam-4k-q2",
            "type": "multiple_choice",
            "prompt": "2. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KOHAI'?",
            "description": "Asocie de terminología marcial (Jerarquía)",
            "options": [
                {
                    "id": "o1",
                    "text": "De menor antigüedad",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Maestro de un rango superior",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Detenerse",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Ponerse de pie",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kohai (後輩) es el estudiante de menor antigüedad o rango que aprende de los más experimentados.",
            "hint": "El compañero que ingresó después al camino."
        },
        {
            "id": "exam-4k-q3",
            "type": "multiple_choice",
            "prompt": "3. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEIRETSU'?",
            "description": "Asocie de terminología marcial (Comandos)",
            "options": [
                {
                    "id": "o1",
                    "text": "Ponerse en fila",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Ponerse de pie",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Detenerse",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Seiretsu (整列) es la orden para formar o alinearse por orden de grado de derecha a izquierda.",
            "hint": "Alineación ordenada en el tatami."
        },
        {
            "id": "exam-4k-q4",
            "type": "multiple_choice",
            "prompt": "4. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KIRITSU'?",
            "description": "Asocie de terminología marcial (Comandos)",
            "options": [
                {
                    "id": "o1",
                    "text": "Ponerse de pie",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Detenerse",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Maestro de rango superior",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kiritsu (起立) es el comando para levantarse ordenadamente desde la posición de Seiza.",
            "hint": "Ponerse de pie tras el saludo o meditación."
        },
        {
            "id": "exam-4k-q5",
            "type": "multiple_choice",
            "prompt": "5. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'YAME'?",
            "description": "Asocie de terminología marcial (Comandos)",
            "options": [
                {
                    "id": "o1",
                    "text": "Detenerse",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Ponerse de pie",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Yame (止め) es la orden firme de parar o detener la acción inmediatamente y volver a posición natural.",
            "hint": "Alto o detenerse."
        },
        {
            "id": "exam-4k-q6",
            "type": "multiple_choice",
            "prompt": "6. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'TE'?",
            "description": "Asocie de terminología marcial (Cuerpo y Fundamentos)",
            "options": [
                {
                    "id": "o1",
                    "text": "Mano",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Vacío",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Derecha",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Forma",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Te (手) significa mano en japonés, raíz del arte autóctono okinawense 'Okinawa-Te'.",
            "hint": "Extremidad superior clave en Karate."
        },
        {
            "id": "exam-4k-q7",
            "type": "multiple_choice",
            "prompt": "7. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'MIGI'?",
            "description": "Asocie de terminología marcial (Direcciones)",
            "options": [
                {
                    "id": "o1",
                    "text": "Derecha",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Mano",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Forma",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Saludo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Migi (右) significa derecha (ej. Migi Zenkutsu-dachi = postura adelantada derecha).",
            "hint": "Lado derecho."
        },
        {
            "id": "exam-4k-q8",
            "type": "multiple_choice",
            "prompt": "8. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'REI'?",
            "description": "Asocie de terminología marcial (Etiqueta)",
            "options": [
                {
                    "id": "o1",
                    "text": "Saludo",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Forma",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Vacío",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Derecha",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Rei (礼) representa el saludo, respeto, reverencia y cortesía marcial fundamental.",
            "hint": "Cortesía o reverencia tradicional."
        },
        {
            "id": "exam-4k-q9",
            "type": "multiple_choice",
            "prompt": "9. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KATA'?",
            "description": "Asocie de terminología marcial (Pilares)",
            "options": [
                {
                    "id": "o1",
                    "text": "Forma",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Vacío",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Mano",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Saludo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kata (型 / 形) significa forma o molde; secuencia coreografiada de técnicas de defensa y ataque.",
            "hint": "Forma tradicional preestablecida."
        },
        {
            "id": "exam-4k-q10",
            "type": "multiple_choice",
            "prompt": "10. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KARA'?",
            "description": "Asocie de terminología marcial (Filosofía)",
            "options": [
                {
                    "id": "o1",
                    "text": "Vacío",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Forma",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Saludo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Mano",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kara (空) significa vacío en sentido Zen: mente desprovista de ego y manos sin armas.",
            "hint": "Vacío, sin armas."
        },
        {
            "id": "exam-4k-q11",
            "type": "multiple_choice",
            "prompt": "11. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHOTOKAN'?",
            "description": "Asocie de terminología marcial (Estilo)",
            "options": [
                {
                    "id": "o1",
                    "text": "Escuela de Shoto",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Lugar de la vía",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Fundamento básico",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Meditación",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Shotokan (松濤館): 'La casa o escuela de Shoto' (Shoto era el seudónimo literario de Funakoshi).",
            "hint": "La casa o escuela del maestro Shoto."
        },
        {
            "id": "exam-4k-q12",
            "type": "multiple_choice",
            "prompt": "12. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'DOJO'?",
            "description": "Asocie de terminología marcial (Lugar Sagrado)",
            "options": [
                {
                    "id": "o1",
                    "text": "Lugar de la vía",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Escuela de Shoto",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Fundamento básico",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Sentarse con la espalda erguida",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Dojo (道場): 'Lugar del despertar o de la vía' donde se entrena el cuerpo y se forja el espíritu.",
            "hint": "Lugar donde se practica el camino."
        },
        {
            "id": "exam-4k-q13",
            "type": "multiple_choice",
            "prompt": "13. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KIHON'?",
            "description": "Asocie de terminología marcial (Pilares)",
            "options": [
                {
                    "id": "o1",
                    "text": "Fundamento básico",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Lugar de la vía",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Meditación",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Escuela de Shoto",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kihon (基本) se traduce como fundamentos o técnicas básicas esenciales de Karate.",
            "hint": "La raíz y base técnica."
        },
        {
            "id": "exam-4k-q14",
            "type": "multiple_choice",
            "prompt": "14. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEIZA'?",
            "description": "Asocie de terminología marcial (Postura tradicional)",
            "options": [
                {
                    "id": "o1",
                    "text": "Sentarse con la espalda erguida",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Meditación",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Lugar de la vía",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Fundamento básico",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Seiza (正座): Postura formal de rodillas, sentado correctamente sobre los talones con la espalda recta.",
            "hint": "Postura formal sentado en el suelo."
        },
        {
            "id": "exam-4k-q15",
            "type": "multiple_choice",
            "prompt": "15. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'MOKUSO'?",
            "description": "Asocie de terminología marcial (Mente y Respiración)",
            "options": [
                {
                    "id": "o1",
                    "text": "Meditación",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Escuela de Shoto",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Fundamento básico",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Lugar de la vía",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Mokuso (黙想): Meditación silenciosa con respiración abdominal para serenar la mente.",
            "hint": "Meditación en silencio."
        },
        {
            "id": "exam-4k-q16",
            "type": "multiple_choice",
            "prompt": "16. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'DO'?",
            "description": "Asocie de terminología marcial (Camino)",
            "options": [
                {
                    "id": "o1",
                    "text": "Camino o vía",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Instructor",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Cinturón",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Palabra de palabras",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Do (道): La vía, sendero o filosofía de vida que busca el perfeccionamiento del ser humano.",
            "hint": "El camino espiritual."
        },
        {
            "id": "exam-4k-q17",
            "type": "multiple_choice",
            "prompt": "17. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'OSS'?",
            "description": "Asocie de terminología marcial (Saludo universal)",
            "options": [
                {
                    "id": "o1",
                    "text": "Palabra de palabras",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Cinturón",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Instructor",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "De mayor antigüedad",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Oss (押忍): Definida en el examen como 'palabra de palabras'; encierra perseverancia, paciencia y respeto absoluto.",
            "hint": "La expresión y saludo universal del karateka."
        },
        {
            "id": "exam-4k-q18",
            "type": "multiple_choice",
            "prompt": "18. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SENSEI'?",
            "description": "Asocie de terminología marcial (Jerarquía)",
            "options": [
                {
                    "id": "o1",
                    "text": "Instructor",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Cinturón",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Camino o vía",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Palabra de palabras",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Sensei (先生): Maestro o instructor; literalmente 'aquel que ha nacido antes' y guía en la vía.",
            "hint": "El guía o instructor del Dojo."
        },
        {
            "id": "exam-4k-q19",
            "type": "multiple_choice",
            "prompt": "19. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'OBI'?",
            "description": "Asocie de terminología marcial (Indumentaria)",
            "options": [
                {
                    "id": "o1",
                    "text": "Cinturón",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Instructor",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Camino o vía",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "De mayor antigüedad",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Obi (帯): El cinturón de Karate que sujeta el Karategi y refleja el grado y madurez marcial.",
            "hint": "Cinta o fajín de grado."
        },
        {
            "id": "exam-4k-q20",
            "type": "multiple_choice",
            "prompt": "20. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEMPAI'?",
            "description": "Asocie de terminología marcial (Jerarquía)",
            "options": [
                {
                    "id": "o1",
                    "text": "De mayor antigüedad",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Instructor",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Cinturón",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Camino o vía",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Sempai (先輩): Compañero estudiante de mayor antigüedad o experiencia en el Dojo.",
            "hint": "El alumno avanzado de mayor tiempo."
        },
        {
            "id": "exam-4k-q21",
            "type": "multiple_choice",
            "prompt": "21. COMPLETE: ¿Cuál es el significado literal de 'KARATE DO'?",
            "description": "Complete (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "El camino de la mano vacía",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "El arte de luchar con espada",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "El método de golpear primero",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "El camino de la fuerza bruta",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kara (vacía), Te (mano), Do (camino o vía): El camino formativo y defensivo de la mano desarmada.",
            "hint": "Mano vacía."
        },
        {
            "id": "exam-4k-q22",
            "type": "multiple_choice",
            "prompt": "22. COMPLETE: ¿Cuál es el significado del Kata 'BASSAI DAI'?",
            "description": "Complete (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "Romper o penetrar la fortaleza (Dai: mayor)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Mirar hacia el cielo",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "La calma del estanque",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "El vuelo de la grulla",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Bassai Dai (披砦大) significa 'Asaltar o penetrar la fortaleza' con determinación y potencia inquebrantable.",
            "hint": "Penetrar o romper la fortaleza."
        },
        {
            "id": "exam-4k-q23",
            "type": "multiple_choice",
            "prompt": "23. COMPLETE: ¿Cuál es el significado del Kata 'KANKU DAI'?",
            "description": "Complete (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "Mirar o contemplar el cielo (Dai: mayor)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Romper la fortaleza",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Paso de hierro en el puente",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "La casa del tigre",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kanku Dai (観空大) significa 'Mirar o contemplar el cielo/el vacío', apertura clásica con manos elevadas.",
            "hint": "Contemplar el cielo."
        },
        {
            "id": "exam-4k-q24",
            "type": "multiple_choice",
            "prompt": "24. COMPLETE: ¿Cuál de las siguientes es una oración oficial del 'DOJO KUN'?",
            "description": "Complete (1 Punto) - Los 5 preceptos del Dojo",
            "options": [
                {
                    "id": "o1",
                    "text": "Hitotsu, Jinkaku kansei ni tsutomuru koto (Intentar perfeccionar el carácter)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Buscar la victoria a toda costa en cada combate",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Demostrar superioridad física ante los demás",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Atacar primero sin dudar ante el enemigo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Los 5 principios del Dojo Kun inician siempre con 'Hitotsu' (Primero) destacando el perfeccionamiento del carácter.",
            "hint": "Perfeccionar el carácter."
        },
        {
            "id": "exam-4k-q25",
            "type": "multiple_choice",
            "prompt": "25. COMPLETE: ¿Cuántos Katas oficiales tiene el estilo Shotokan?",
            "description": "Complete (1 Punto) - Catálogo tradicional",
            "options": [
                {
                    "id": "o1",
                    "text": "26 Katas oficiales",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "15 Katas oficiales",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "35 Katas oficiales",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "10 Katas oficiales",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "El estilo Shotokan formalizó oficialmente 26 katas (desde Heian Shodan hasta Meikyo/Wankan/Gojushiho).",
            "hint": "Son exactamente veintiséis."
        },
        {
            "id": "exam-4k-q26",
            "type": "multiple_choice",
            "prompt": "26. COMPLETE: ¿Cuál es el nombre del padre fundador del estilo Shotokan?",
            "description": "Complete (1 Punto) - Historia moderna",
            "options": [
                {
                    "id": "o1",
                    "text": "Gichin Funakoshi",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Kenwa Mabuni",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Chojun Miyagi",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Hironori Otsuka",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "El Maestro Gichin Funakoshi (1868–1957) es considerado el padre del Karate-Do moderno y fundador del Shotokan.",
            "hint": "Maestro Funakoshi."
        },
        {
            "id": "exam-4k-q27",
            "type": "multiple_choice",
            "prompt": "27. COMPLETE: ¿Cuál es el origen geográfico e histórico del Karate Do Shotokan?",
            "description": "Complete (1 Punto) - Geografía e Historia",
            "options": [
                {
                    "id": "o1",
                    "text": "Okinawa / Japón",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Seúl / Corea del Sur",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Pekín / China continental",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Bangkok / Tailandia",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "El Karate nació en la isla de Okinawa (Reino de Ryukyu) y se expandió por todo el territorio de Japón.",
            "hint": "Isla de Okinawa y su desarrollo en Japón."
        },
        {
            "id": "exam-4k-q28",
            "type": "multiple_choice",
            "prompt": "28. COMPLETE: ¿Cuál es el significado de 'JIYU IPPON KUMITE'?",
            "description": "Complete (1 Punto) - Modalidad de combate",
            "options": [
                {
                    "id": "o1",
                    "text": "Combate semilibre a un solo ataque / paso convenido",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Combate libre continuo sin arbitraje",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Combate a tres pasos básicos",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Lucha con bastones largos",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Jiyu Ippon Kumite combina la guardia y distancia libre con la ejecución de un único ataque declarado previamente.",
            "hint": "Semilibre a un paso."
        },
        {
            "id": "exam-4k-q29",
            "type": "multiple_choice",
            "prompt": "29. COMPLETE: ¿Cuál es una de las áreas en las que se divide el Kihon?",
            "description": "Complete (1 Punto) - Metodología de entrenamiento",
            "options": [
                {
                    "id": "o1",
                    "text": "Kihon estático y Kihon con desplazamientos (Ido Kihon)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Natación y carreras de velocidad",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Lanzamientos de dardos",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Solo meditación sin movimiento",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "El Kihon se estructura en trabajo fundamental estático (Sonoba Kihon) y con desplazamientos (Ido Kihon / Renraku).",
            "hint": "Estático o con desplazamientos."
        },
        {
            "id": "exam-4k-q30",
            "type": "multiple_choice",
            "prompt": "30. COMPLETE: ¿Cuál es el nombre en japonés del uniforme de Karate Do?",
            "description": "Complete (1 Punto) - Indumentaria",
            "options": [
                {
                    "id": "o1",
                    "text": "Karategi (o Gi / Dogi)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Kimono festivo",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Hakama de gala",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Yukata",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "El uniforme de entrenamiento se denomina Karategi (空手着) o simplemente Dogi / Gi.",
            "hint": "Karategi."
        },
        {
            "id": "exam-4k-q31",
            "type": "multiple_choice",
            "prompt": "31. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza (1 Punto)",
            "image": "/images/didactic/exams/dachi_heisoku.png",
            "options": [
                {
                    "id": "o1",
                    "text": "HEISOKU DACHI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "KIBA DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "ZENKUTSU DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Heisoku-dachi: Postura con ambos pies completamente juntos y paralelos de talones a dedos.",
            "hint": "Pies juntos y paralelos."
        },
        {
            "id": "exam-4k-q32",
            "type": "multiple_choice",
            "prompt": "32. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza (1 Punto)",
            "image": "/images/didactic/exams/dachi_kiba.png",
            "options": [
                {
                    "id": "o1",
                    "text": "KIBA DACHI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "MUSUBI DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "YOI DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "HEISOKU DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kiba-dachi: Postura del jinete con pies paralelos, rodillas abiertas hacia afuera y peso 50/50.",
            "hint": "Postura del jinete."
        },
        {
            "id": "exam-4k-q33",
            "type": "multiple_choice",
            "prompt": "33. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza (1 Punto)",
            "image": "/images/didactic/exams/dachi_kokutsu.png",
            "options": [
                {
                    "id": "o1",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "ZENKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "KIBA DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "YOI DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kokutsu-dachi: Postura atrasada con el 70% del peso en la pierna trasera y 30% en la delantera.",
            "hint": "Mayoría del peso en la pierna de atrás."
        },
        {
            "id": "exam-4k-q34",
            "type": "multiple_choice",
            "prompt": "34. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza (1 Punto)",
            "image": "/images/didactic/exams/dachi_musubi.png",
            "options": [
                {
                    "id": "o1",
                    "text": "MUSUBI DACHI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "ZENKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "KIBA DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Musubi-dachi: Postura de pie y erguido para saludo; talones juntos y puntas de los pies abiertas a 45°-60°.",
            "hint": "Talones juntos y puntas abiertas para saludar."
        },
        {
            "id": "exam-4k-q35",
            "type": "multiple_choice",
            "prompt": "35. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza (1 Punto)",
            "image": "/images/didactic/exams/dachi_zenkutsu.png",
            "options": [
                {
                    "id": "o1",
                    "text": "ZENKUTSU DACHI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "YOI DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "HEISOKU DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Zenkutsu-dachi: Postura adelantada con 60% del peso en la pierna delantera flexionada y pierna trasera estirada.",
            "hint": "Postura adelantada clásica."
        },
        {
            "id": "exam-4k-q36",
            "type": "multiple_choice",
            "prompt": "36. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza (1 Punto)",
            "image": "/images/didactic/exams/dachi_yoi.png",
            "options": [
                {
                    "id": "o1",
                    "text": "YOI DACHI (HACHIJI DACHI)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "KIBA DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "MUSUBI DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Yoi-dachi (Hachiji-dachi): Postura natural de espera con pies separados al ancho de hombros y puntas hacia afuera.",
            "hint": "Postura de atención y espera."
        },
        {
            "id": "exam-4k-q37",
            "type": "multiple_choice",
            "prompt": "37. DESARROLLO: ¿En qué aspecto fundamental beneficia personalmente el Karate-Do en la vida diaria?",
            "description": "Desarrollo y Madurez Marcial (2 Puntos)",
            "options": [
                {
                    "id": "o1",
                    "text": "Forja del carácter, autodisciplina, respeto al prójimo, salud física y control del estrés",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Aprender a buscar confrontaciones físicas en la calle",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Sentirse superior a las personas que no entrenan",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Solo como pasatiempo sin ninguna repercusión mental",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "El Karate-Do es una disciplina de desarrollo integral donde la autodefensa es el vehículo para cultivar la templanza humana.",
            "hint": "Crecimiento del carácter y salud."
        },
        {
            "id": "exam-4k-q38",
            "type": "multiple_choice",
            "prompt": "38. DESARROLLO: Del Niju Kun (20 preceptos de Funakoshi), ¿cómo se relaciona 'Karate wa rei ni hajimari, rei ni owaru koto' con el vivir diario?",
            "description": "Desarrollo y Filosofía del Budo (2 Puntos)",
            "options": [
                {
                    "id": "o1",
                    "text": "El respeto sincero debe guiar cada acto cotidiano, tratando con cortesía y empatía a los demás antes y después de cualquier acción",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Que solo se debe saludar a personas con cinturón más alto",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Que la cortesía se deja dentro del dojo y no se aplica afuera",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Hacer reverencias mecánicas sin sentir respeto",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "'El Karate comienza con cortesía y concluye con cortesía'. Este precepto exige humildad y respeto en la familia, escuela y trabajo.",
            "hint": "Respeto dentro y fuera del tatami."
        }
    ]
};

// ====================================================================
// EXAMEN OFICIAL: 3° KYU A 2° KYU (CAFÉ 3 LÍNEAS A CAFÉ 2 LÍNEAS)
// Fuente: "I EXAMEN ESCRITO DE 3 KYU A 2 KYU.pdf" (38 Preguntas)
// ====================================================================
export const EXAM_KYU_3_TO_2: BeltExamConfig = {
    "beltId": "kyu-3",
    "targetBeltId": "kyu-2",
    "beltName": "Cinturón Café 3 Líneas (3° Kyu)",
    "targetBeltName": "Cinturón Café 2 Líneas (2° Kyu)",
    "targetBeltColor": "#78350F",
    "passingScore": 28,
    "xpReward": 380,
    "title": "I Examen Escrito Oficial: 3° Kyu a 2° Kyu",
    "subtitle": "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
    "description": "Evaluación oficial de ascenso a 2° Kyu: Terminología marcial, Complete de historia y Katas, reconocimiento visual de Kihon Waza y ensayo sobre Kime y Budo.",
    "questions": [
        {
            "id": "exam-3k-q1",
            "type": "multiple_choice",
            "prompt": "1. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'BUNKAI'?",
            "description": "Asocie de terminología marcial (Kata)",
            "options": [
                {
                    "id": "o1",
                    "text": "Desglose de kata",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Puño",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Grande",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Representación lineal del kata",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Bunkai (分解): Desglose, análisis o aplicación combativa práctica de cada movimiento de un Kata.",
            "hint": "Desglose o aplicación práctica."
        },
        {
            "id": "exam-3k-q2",
            "type": "multiple_choice",
            "prompt": "2. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'BUDOKA'?",
            "description": "Asocie de terminología marcial (Persona)",
            "options": [
                {
                    "id": "o1",
                    "text": "Practicante de artes marciales",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Desglose de kata",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Representación lineal del kata",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Puño",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Budoka (武道家): Aquel que transita y consagra su vida a la práctica y valores del Budo (vía marcial).",
            "hint": "Practicante del camino marcial."
        },
        {
            "id": "exam-3k-q3",
            "type": "multiple_choice",
            "prompt": "3. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'ENBUSEN'?",
            "description": "Asocie de terminología marcial (Kata)",
            "options": [
                {
                    "id": "o1",
                    "text": "Representación lineal del kata",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Practicante de artes marciales",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Grande",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Puño",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Enbusen (演武線): Línea, diagrama o esquema geométrico que dibuja el practicante en el tatami al ejecutar el Kata.",
            "hint": "Línea o diagrama del Kata."
        },
        {
            "id": "exam-3k-q4",
            "type": "multiple_choice",
            "prompt": "4. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'DAI'?",
            "description": "Asocie de terminología marcial (Katas)",
            "options": [
                {
                    "id": "o1",
                    "text": "Grande",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Puño",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Desglose de kata",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Practicante de artes marciales",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Dai (大): Grande o mayor (en oposición a Sho / 小 que significa menor; ej. Bassai Dai vs Bassai Sho).",
            "hint": "Grande o mayor."
        },
        {
            "id": "exam-3k-q5",
            "type": "multiple_choice",
            "prompt": "5. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEIKEN'?",
            "description": "Asocie de terminología marcial (Arma natural)",
            "options": [
                {
                    "id": "o1",
                    "text": "Puño",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Grande",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Representación lineal del kata",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Desglose de kata",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Seiken (正拳): Puño fundamental o puño correcto; zona de impacto de los nudillos del índice y medio.",
            "hint": "El puño frontal."
        },
        {
            "id": "exam-3k-q6",
            "type": "multiple_choice",
            "prompt": "6. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHOMEN NI REI'?",
            "description": "Asocie de terminología marcial (Protocolo de saludo)",
            "options": [
                {
                    "id": "o1",
                    "text": "Saludo al frente",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Saludo entre nosotros",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Dojo central",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Espíritu y armonía",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Shomen ni rei (正面に礼): Reverencia y saludo de respeto hacia el frente de honor del Dojo.",
            "hint": "Saludo hacia el frente."
        },
        {
            "id": "exam-3k-q7",
            "type": "multiple_choice",
            "prompt": "7. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KIAI'?",
            "description": "Asocie de terminología marcial (Energía y Sonido)",
            "options": [
                {
                    "id": "o1",
                    "text": "Espíritu y armonía",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Pinos ondulantes",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Dojo central",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Saludo al frente",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kiai (気合): Definido como 'espíritu y armonía' (Ki = energía vital, Ai = armonía/unión); grito que libera la fuerza concentrada.",
            "hint": "Unión de espíritu y energía."
        },
        {
            "id": "exam-3k-q8",
            "type": "multiple_choice",
            "prompt": "8. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'HONBU DOJO'?",
            "description": "Asocie de terminología marcial (Sede central)",
            "options": [
                {
                    "id": "o1",
                    "text": "Dojo central",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Pinos ondulantes",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Saludo entre nosotros",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Espíritu y armonía",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Honbu Dojo (本部道場): Sede matriz, dojo principal o cuartel general de una organización de Karate.",
            "hint": "Dojo central o sede principal."
        },
        {
            "id": "exam-3k-q9",
            "type": "multiple_choice",
            "prompt": "9. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHOTO'?",
            "description": "Asocie de terminología marcial (Poesía y Linaje)",
            "options": [
                {
                    "id": "o1",
                    "text": "Pinos ondulantes",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Dojo central",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Espíritu y armonía",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Saludo al frente",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Shoto (松濤): 'Pinos ondulantes' o el rumor del viento entre los pinos; seudónimo poético del Maestro Gichin Funakoshi.",
            "hint": "Olas de pinos mecidas por el viento."
        },
        {
            "id": "exam-3k-q10",
            "type": "multiple_choice",
            "prompt": "10. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'OTAGAI NI REI'?",
            "description": "Asocie de terminología marcial (Protocolo de saludo)",
            "options": [
                {
                    "id": "o1",
                    "text": "Saludo entre nosotros",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Saludo al frente",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Dojo central",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Pinos ondulantes",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Otagai ni rei (お互いに礼): Saludo y reverencia mutua entre compañeros de entrenamiento.",
            "hint": "Saludo mutuo entre practicantes."
        },
        {
            "id": "exam-3k-q11",
            "type": "multiple_choice",
            "prompt": "11. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'WAZA'?",
            "description": "Asocie de terminología marcial (Técnica)",
            "options": [
                {
                    "id": "o1",
                    "text": "Técnica",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Lema",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Izquierda",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Palo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Waza (技): Técnica, habilidad o recurso motor específico (ej. Kihon-waza, Buki-waza).",
            "hint": "Técnica marcial."
        },
        {
            "id": "exam-3k-q12",
            "type": "multiple_choice",
            "prompt": "12. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KUN'?",
            "description": "Asocie de terminología marcial (Regla o Lema)",
            "options": [
                {
                    "id": "o1",
                    "text": "Lema",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Técnica",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Palo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Recupérese",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kun (訓): Regla, lema, norma o precepto formativo (como en Dojo Kun o Niju Kun).",
            "hint": "Lema o precepto."
        },
        {
            "id": "exam-3k-q13",
            "type": "multiple_choice",
            "prompt": "13. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'HIDARI'?",
            "description": "Asocie de terminología marcial (Direcciones)",
            "options": [
                {
                    "id": "o1",
                    "text": "Izquierda",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Técnica",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Palo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Recupérese",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Hidari (左): Izquierda (ej. Hidari Zenkutsu-dachi = postura adelantada con pierna izquierda).",
            "hint": "Lado izquierdo."
        },
        {
            "id": "exam-3k-q14",
            "type": "multiple_choice",
            "prompt": "14. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'BO'?",
            "description": "Asocie de terminología marcial (Kobudo)",
            "options": [
                {
                    "id": "o1",
                    "text": "Palo",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Lema",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Técnica",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Izquierda",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Bo (棒): Bastón o palo largo de madera tradicional del Kobudo okinawense (típicamente de 1.82 m / Rokushakubo).",
            "hint": "Palo largo de madera."
        },
        {
            "id": "exam-3k-q15",
            "type": "multiple_choice",
            "prompt": "15. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'NAORE'?",
            "description": "Asocie de terminología marcial (Comandos)",
            "options": [
                {
                    "id": "o1",
                    "text": "Recupérese",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Palo",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Lema",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Izquierda",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Naore (直れ): Orden de 'recupérese' o volver a la postura natural de partida tras una ejecución o saludo.",
            "hint": "Comando de retorno a la normalidad."
        },
        {
            "id": "exam-3k-q16",
            "type": "multiple_choice",
            "prompt": "16. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KAMAE'?",
            "description": "Asocie de terminología marcial (Combate)",
            "options": [
                {
                    "id": "o1",
                    "text": "Posición de combate",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Empezar",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Encuentro de manos",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kamae (構え): Guardia o posición de combate activa y alerta.",
            "hint": "Guardia o postura combativa."
        },
        {
            "id": "exam-3k-q17",
            "type": "multiple_choice",
            "prompt": "17. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'HAJIME'?",
            "description": "Asocie de terminología marcial (Comandos)",
            "options": [
                {
                    "id": "o1",
                    "text": "Empezar",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Posición de combate",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Rango de cinturón",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Hajime (始め): Voz de mando arbitral y docente para iniciar o comenzar la técnica o combate.",
            "hint": "Iniciar o comenzar."
        },
        {
            "id": "exam-3k-q18",
            "type": "multiple_choice",
            "prompt": "18. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEIRETSU'?",
            "description": "Asocie de terminología marcial (Comandos)",
            "options": [
                {
                    "id": "o1",
                    "text": "Ponerse en fila",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Empezar",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Encuentro de manos",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Posición de combate",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Seiretsu (整列): Ponerse en fila de manera ordenada y alineada.",
            "hint": "Alinearse en fila."
        },
        {
            "id": "exam-3k-q19",
            "type": "multiple_choice",
            "prompt": "19. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KUMITE'?",
            "description": "Asocie de terminología marcial (Pilares)",
            "options": [
                {
                    "id": "o1",
                    "text": "Encuentro de manos",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Rango de cinturón",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Posición de combate",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Empezar",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kumite (組手): Literalmente 'encuentro o cruce de manos'; el combate reglamentario con adversario.",
            "hint": "Combate o cruce de manos."
        },
        {
            "id": "exam-3k-q20",
            "type": "multiple_choice",
            "prompt": "20. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KYU'?",
            "description": "Asocie de terminología marcial (Grados)",
            "options": [
                {
                    "id": "o1",
                    "text": "Rango de cinturón",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Encuentro de manos",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Empezar",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Posición de combate",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kyu (級): Rango o grado de aprendizaje previo a la categoría de cinturón negro (Dan).",
            "hint": "Grado de estudiante."
        },
        {
            "id": "exam-3k-q21",
            "type": "multiple_choice",
            "prompt": "21. COMPLETE: ¿Cuál es el significado de 'SHOTOKAN'?",
            "description": "Complete (1 Punto) - Nombre del estilo",
            "options": [
                {
                    "id": "o1",
                    "text": "La casa o escuela de Shoto (Shoto: pinos ondulantes; Kan: casa o escuela)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "El templo de los guerreros del sol",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "El estilo de las manos duras",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "La academia militar de Okinawa",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Shotokan proviene del pseudónimo 'Shoto' que usaba Funakoshi para firmar poemas y 'Kan' que significa edificio o escuela.",
            "hint": "Casa de Shoto."
        },
        {
            "id": "exam-3k-q22",
            "type": "multiple_choice",
            "prompt": "22. COMPLETE: ¿Cuál es el significado de 'ENPI'?",
            "description": "Complete (1 Punto) - Técnica y Kata",
            "options": [
                {
                    "id": "o1",
                    "text": "Codo (o 'El vuelo de la golondrina' en el Kata)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Salto del tigre",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Garra de águila",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Frente de hierro",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Empi/Enpi significa codo (猿臂) como arma natural, y en el Kata Enpi alude al vuelo ágil de la golondrina (燕飛).",
            "hint": "Codo o vuelo de golondrina."
        },
        {
            "id": "exam-3k-q23",
            "type": "multiple_choice",
            "prompt": "23. COMPLETE: ¿Cuál es el significado de 'TEKKI NIDAN'?",
            "description": "Complete (1 Punto) - Kata tradicional",
            "options": [
                {
                    "id": "o1",
                    "text": "Jinete de hierro nivel 2 (o montar a caballo 2)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Vuelo de la grulla nivel 2",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Dos golpes de montaña",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "El dragón oculto",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Tekki (鉄騎) significa 'caballero de hierro o jinete de hierro' en postura Kiba-dachi; Nidan indica el segundo nivel.",
            "hint": "Jinete de hierro nivel 2."
        },
        {
            "id": "exam-3k-q24",
            "type": "multiple_choice",
            "prompt": "24. COMPLETE: ¿Cuál es la similitud fundamental que comparten todos los Katas Heian?",
            "description": "Complete (1 Punto) - Pedagogía de Anko Itosu",
            "options": [
                {
                    "id": "o1",
                    "text": "Todas inician con una técnica defensiva o bloqueo (reflejando 'Karate Ni Sente Nashi')",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Todas tienen la misma cantidad de pasos exactos",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Todas se ejecutan exclusivamente en Kiba-dachi",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Todas usan técnicas con armas de madera",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Los 5 Katas Heian inician invariablemente con un bloqueo defensivo, enseñando que en el Karate no existe el primer ataque.",
            "hint": "Inician siempre defendiendo."
        },
        {
            "id": "exam-3k-q25",
            "type": "multiple_choice",
            "prompt": "25. COMPLETE: ¿Cuáles son las siglas del reglamento utilizado internacionalmente para campeonatos oficiales de Karate Do?",
            "description": "Complete (1 Punto) - Ámbito federado",
            "options": [
                {
                    "id": "o1",
                    "text": "WKF (World Karate Federation)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "FIFA",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "NBA",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "UFC",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "La WKF (World Karate Federation) es el organismo rector mundial oficial reconocido por el Comité Olímpico Internacional.",
            "hint": "Siglas WKF."
        },
        {
            "id": "exam-3k-q26",
            "type": "multiple_choice",
            "prompt": "26. COMPLETE: ¿Quién es el Jefe Instructor de la federación ISKF (International Shotokan Karate Federation)?",
            "description": "Complete (1 Punto) - Linaje institucional",
            "options": [
                {
                    "id": "o1",
                    "text": "Master Teruyuki Okazaki (fundador) / Master Hiroyoshi Okazaki",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Bruce Lee",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Chuck Norris",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Miyamoto Musashi",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "La ISKF fue fundada por el legendario Shihan Teruyuki Okazaki, sucedido por Master Hiroyoshi Okazaki como Chairman y Chief Instructor.",
            "hint": "Familia y maestros Okazaki."
        },
        {
            "id": "exam-3k-q27",
            "type": "multiple_choice",
            "prompt": "27. COMPLETE: ¿Cuál es el origen ancestral e histórico de las artes marciales según la tradición clásica?",
            "description": "Complete (1 Punto) - Raíces orientales",
            "options": [
                {
                    "id": "o1",
                    "text": "India y China (Templo Shaolin con Bodhidharma / Daruma)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Roma y los gladiadores",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Inglaterra medieval",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Egipto antiguo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "La tradición marcial ubica su génesis filosófico y físico en la India y su paso a China en el Templo Shaolin mediante Bodhidharma.",
            "hint": "India, China y el Templo Shaolin."
        },
        {
            "id": "exam-3k-q28",
            "type": "multiple_choice",
            "prompt": "28. COMPLETE: ¿Cuál es el significado de 'JIYU IPPON KUMITE'?",
            "description": "Complete (1 Punto) - Modalidad táctica",
            "options": [
                {
                    "id": "o1",
                    "text": "Combate semilibre a un paso (con ataque convenido y distancia dinámica)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Combate libre sin ninguna regla",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Solo bloqueos sin responder",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Lucha cuerpo a cuerpo en el piso",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Jiyu Ippon Kumite entrena el timing y la distancia real permitiendo desplazamiento libre antes de lanzar un solo ataque convenido.",
            "hint": "Semilibre a un solo ataque."
        },
        {
            "id": "exam-3k-q29",
            "type": "multiple_choice",
            "prompt": "29. COMPLETE: ¿Cuál es el significado de la palabra 'YAKUSOKU'?",
            "description": "Complete (1 Punto) - Metodología",
            "options": [
                {
                    "id": "o1",
                    "text": "Promesa o acuerdo (combate predeterminado)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Golpe fulminante",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Salto con giro",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Piso de tatami",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Yakusoku (約束) significa literalmente 'promesa o acuerdo', refiriéndose al entrenamiento donde las técnicas están pactadas.",
            "hint": "Acuerdo o promesa."
        },
        {
            "id": "exam-3k-q30",
            "type": "multiple_choice",
            "prompt": "30. COMPLETE: ¿Cuál de los siguientes es uno de los estilos principales tradicionales del Karate Do?",
            "description": "Complete (1 Punto) - Estilos reconocidos",
            "options": [
                {
                    "id": "o1",
                    "text": "Shotokan (junto con Goju-Ryu, Shito-Ryu y Wado-Ryu)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Capoeira",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Taekwondo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Krav Maga",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Los 4 estilos mayores canónicos son Shotokan, Goju-Ryu, Shito-Ryu y Wado-Ryu.",
            "hint": "Shotokan."
        },
        {
            "id": "exam-3k-q31",
            "type": "multiple_choice",
            "prompt": "31. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon Waza (1 Punto)",
            "image": "/images/didactic/exams/waza_oi_zuki.png",
            "options": [
                {
                    "id": "o1",
                    "text": "OI ZUKI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "MANJI UKE",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "MOROTE UKE",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "GYAKU ZUKI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Oi-Zuki: Puñetazo directo ejecutado con el mismo brazo de la pierna que avanza en Zenkutsu-dachi.",
            "hint": "Puñetazo al avanzar."
        },
        {
            "id": "exam-3k-q32",
            "type": "multiple_choice",
            "prompt": "32. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon Waza (1 Punto)",
            "image": "/images/didactic/exams/waza_manji_uke.png",
            "options": [
                {
                    "id": "o1",
                    "text": "MANJI UKE",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "OI ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "YAMA ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "MAWASHI GERI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Manji-Uke: Bloqueo doble combinado con Gedan-barai hacia atrás y Jodan-uchi-uke hacia adelante.",
            "hint": "Doble bloqueo alto y bajo en forma de esvástica budista (Manji)."
        },
        {
            "id": "exam-3k-q33",
            "type": "multiple_choice",
            "prompt": "33. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon Waza (1 Punto)",
            "image": "/images/didactic/exams/waza_yama_zuki.png",
            "options": [
                {
                    "id": "o1",
                    "text": "YAMA ZUKI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "GYAKU ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "OI ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "MOROTE UKE",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Yama-Zuki: Golpe de puño simultáneo en forma de montaña (U) con un brazo a nivel Jodan y el otro a nivel Chudan/Gedan.",
            "hint": "Golpe en forma de montaña."
        },
        {
            "id": "exam-3k-q34",
            "type": "multiple_choice",
            "prompt": "34. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon Waza (1 Punto)",
            "image": "/images/didactic/exams/waza_mawashi_geri.png",
            "options": [
                {
                    "id": "o1",
                    "text": "MAWASHI GERI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "OI ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "MANJI UKE",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "GYAKU ZUKI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Mawashi-Geri: Patada circular propulsada con rotación de cadera, impactando con Koshi o Haisoku.",
            "hint": "Patada circular."
        },
        {
            "id": "exam-3k-q35",
            "type": "multiple_choice",
            "prompt": "35. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon Waza (1 Punto)",
            "image": "/images/didactic/exams/waza_gyaku_zuki.png",
            "options": [
                {
                    "id": "o1",
                    "text": "GYAKU ZUKI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "OI ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "YAMA ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "MOROTE UKE",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Gyaku-Zuki: Puñetazo penetrante ejecutado con el brazo contrario a la pierna adelantada, aprovechando la rotación de cadera.",
            "hint": "Puño contrario con torsión de cadera."
        },
        {
            "id": "exam-3k-q36",
            "type": "multiple_choice",
            "prompt": "36. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon Waza (1 Punto)",
            "image": "/images/didactic/exams/waza_morote_uke.png",
            "options": [
                {
                    "id": "o1",
                    "text": "MOROTE UKE",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "MANJI UKE",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "GYAKU ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "MAWASHI GERI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Morote-Uke: Bloqueo reforzado con dos brazos donde el puño de apoyo se sitúa junto al codo del brazo defensor.",
            "hint": "Bloqueo reforzado a dos manos."
        },
        {
            "id": "exam-3k-q37",
            "type": "multiple_choice",
            "prompt": "37. DESARROLLO: ¿En qué consiste 'KIME WAZA' y cuáles son dos criterios utilizados para calificarlo?",
            "description": "Desarrollo y Biomecánica (2 Puntos)",
            "options": [
                {
                    "id": "o1",
                    "text": "Es la máxima concentración de fuerza en el impacto con relajación previa y posterior; se califica por alineación articular sólida y respiración/Zanshin sincronizado",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Es mantener los músculos completamente tensos durante toda la clase sin respirar",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Es dar un salto hacia atrás con un grito agudo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Es golpear con fuerza descontrolada lesionando al compañero",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kime es el foco decisivo instantáneo. Exige velocidad sin tensión previa, máxima contracción en el instante de contacto y retorno a la alerta relajada.",
            "hint": "Foco instantáneo y criterios biomecánicos."
        },
        {
            "id": "exam-3k-q38",
            "type": "multiple_choice",
            "prompt": "38. DESARROLLO: Los grandes maestros afirman que el Karate Do es un estilo de vida. ¿Es esto Cierto o Falso y por qué?",
            "description": "Desarrollo y Filosofía del Budo (2 Puntos)",
            "options": [
                {
                    "id": "o1",
                    "text": "CIERTO: Porque sus valores de respeto, perseverancia y autocontrol se aplican continuamente en la vida diaria, el trabajo y la familia",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "FALSO: Porque solo es una actividad física que termina al salir por la puerta del gimnasio",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "FALSO: Porque solo sirve para ganar trofeos deportivos en competencias",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "CIERTO: Porque obliga a vestir el Karategi las 24 horas del día",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "El Maestro Funakoshi sentenció que el Karate es para cultivar el espíritu a lo largo de toda la existencia; no se limita a técnicas físicas.",
            "hint": "Cierto, porque forja el carácter cotidiano."
        }
    ]
};

// ====================================================================
// EXAMEN OFICIAL: 2° KYU A 1° KYU (CAFÉ 2 LÍNEAS A CAFÉ 1 LÍNEA)
// Fuente: "I EXAMEN ESCRITO DE 2 KYU A 1 KYU.pdf" (44 Preguntas)
// ====================================================================
export const EXAM_KYU_2_TO_1: BeltExamConfig = {
    "beltId": "kyu-2",
    "targetBeltId": "kyu-1",
    "beltName": "Cinturón Café 2 Líneas (2° Kyu)",
    "targetBeltName": "Cinturón Café 1 Línea (1° Kyu)",
    "targetBeltColor": "#78350F",
    "passingScore": 32,
    "xpReward": 420,
    "title": "I Examen Escrito Oficial: 2° Kyu a 1° Kyu",
    "subtitle": "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
    "description": "Evaluación oficial previa al Shodan: Filosofía Bushido y Zen, Katas Superiores, Reglamento WKF de arbitraje y puntuación, y criterios de maestría.",
    "questions": [
        {
            "id": "exam-2k-q1",
            "type": "multiple_choice",
            "prompt": "1. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'BUSHIDO'?",
            "description": "Asocie de terminología marcial (Filosofía)",
            "options": [
                {
                    "id": "o1",
                    "text": "El camino del guerrero",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Kata obligatoria",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Camino de la mano vacía",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Tabla para dar puñetazos",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Bushido (武士道): 'El camino del guerrero', código ético y moral de honor, lealtad y rectitud samurai.",
            "hint": "El camino del guerrero samurai."
        },
        {
            "id": "exam-2k-q2",
            "type": "multiple_choice",
            "prompt": "2. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHITEI KATA'?",
            "description": "Asocie de terminología marcial (Competición)",
            "options": [
                {
                    "id": "o1",
                    "text": "Kata obligatoria",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Kata favorita",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "El camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Tabla para dar puñetazos",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Shitei Kata (指定形): Katas obligatorios reglamentarios designados en torneos para rondas clasificatorias.",
            "hint": "Kata obligatorio de torneo."
        },
        {
            "id": "exam-2k-q3",
            "type": "multiple_choice",
            "prompt": "3. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KARATE DO'?",
            "description": "Asocie de terminología marcial (Disciplina)",
            "options": [
                {
                    "id": "o1",
                    "text": "Camino de la mano vacía",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Kata favorita",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "El camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Kata obligatoria",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Karate-Do: Camino de la mano desarmada y vacía de intenciones violentas o ego.",
            "hint": "Camino de la mano vacía."
        },
        {
            "id": "exam-2k-q4",
            "type": "multiple_choice",
            "prompt": "4. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'TOKUI KATA'?",
            "description": "Asocie de terminología marcial (Competición)",
            "options": [
                {
                    "id": "o1",
                    "text": "Kata favorita",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Kata obligatoria",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "El camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Tabla para dar puñetazos",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Tokui Kata (得意形): Kata de libre elección o forma predilecta en la que el practicante destaca al máximo.",
            "hint": "Kata favorita o de elección personal."
        },
        {
            "id": "exam-2k-q5",
            "type": "multiple_choice",
            "prompt": "5. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'MAKIWARA'?",
            "description": "Asocie de terminología marcial (Acondicionamiento)",
            "options": [
                {
                    "id": "o1",
                    "text": "Tabla para dar puñetazos",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Kata obligatoria",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Kata favorita",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "El camino del guerrero",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Makiwara (巻藁): Poste tradicional de madera con cuerda o almohadilla para acondicionar los nudillos y entrenar el Kime.",
            "hint": "Poste o tabla tradicional de golpeo."
        },
        {
            "id": "exam-2k-q6",
            "type": "multiple_choice",
            "prompt": "6. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'ZAZEN'?",
            "description": "Asocie de terminología marcial (Meditación)",
            "options": [
                {
                    "id": "o1",
                    "text": "Zen sentado",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Estado de concentración",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Cortar el hara",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Matar en un solo golpe",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Zazen (座禅): Práctica de meditación sentada en postura de loto o Seiza para alcanzar la serenidad y presencia plena.",
            "hint": "Zen sentado."
        },
        {
            "id": "exam-2k-q7",
            "type": "multiple_choice",
            "prompt": "7. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'IPPON KEN'?",
            "description": "Asocie de terminología marcial (Arma natural)",
            "options": [
                {
                    "id": "o1",
                    "text": "Puño de un nudillo",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Matar en un solo golpe",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Cortar el hara",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Zen sentado",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Ippon Ken (一本拳): Puño con el segundo nudillo del índice sobresaliendo firmemente para atacar puntos vitales.",
            "hint": "Puño con un solo nudillo."
        },
        {
            "id": "exam-2k-q8",
            "type": "multiple_choice",
            "prompt": "8. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'IKKEN HISSATSU'?",
            "description": "Asocie de terminología marcial (Principio clásico)",
            "options": [
                {
                    "id": "o1",
                    "text": "Matar en un solo golpe",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Cortar el hara",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Puño de un nudillo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Estado de concentración",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Ikken Hissatsu (一拳必殺): 'Vencer o aniquilar de un solo golpe'; máxima concentración de Kime para neutralizar la agresión al instante.",
            "hint": "Un solo golpe decisivo."
        },
        {
            "id": "exam-2k-q9",
            "type": "multiple_choice",
            "prompt": "9. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEPPUKU'?",
            "description": "Asocie de terminología marcial (Cultura samurai)",
            "options": [
                {
                    "id": "o1",
                    "text": "Cortar el hara",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Matar en un solo golpe",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Estado de concentración",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Zen sentado",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Seppuku (切腹): Ritual de honor samurai consistente en cortar el Hara para preservar la dignidad y rectitud ética.",
            "hint": "Cortar el hara."
        },
        {
            "id": "exam-2k-q10",
            "type": "multiple_choice",
            "prompt": "10. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'ZEN'?",
            "description": "Asocie de terminología marcial (Filosofía)",
            "options": [
                {
                    "id": "o1",
                    "text": "Estado de concentración",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Cortar el hara",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Matar en un solo golpe",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Puño de un nudillo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Zen (禅): Corriente espiritual budista enfocada en la atención consciente, concentración profunda y mente vacía de distracciones.",
            "hint": "Estado de concentración plena."
        },
        {
            "id": "exam-2k-q11",
            "type": "multiple_choice",
            "prompt": "11. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'MAWATTE'?",
            "description": "Asocie de terminología marcial (Comandos)",
            "options": [
                {
                    "id": "o1",
                    "text": "Vuelta",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Primero",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Gato",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Cinta negra",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Mawatte (回って): Comando para girar 180° sobre los talones y cambiar de dirección.",
            "hint": "Girar o dar la vuelta."
        },
        {
            "id": "exam-2k-q12",
            "type": "multiple_choice",
            "prompt": "12. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KURO OBI'?",
            "description": "Asocie de terminología marcial (Indumentaria de maestría)",
            "options": [
                {
                    "id": "o1",
                    "text": "Cinta negra",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Rango de cinturón negro",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Primero",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Gato",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kuro Obi (黒帯): Cinturón negro que visten los practicantes graduados con grado Dan.",
            "hint": "Cinta o cinturón negro."
        },
        {
            "id": "exam-2k-q13",
            "type": "multiple_choice",
            "prompt": "13. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'NEKO'?",
            "description": "Asocie de terminología marcial (Posturas y animales)",
            "options": [
                {
                    "id": "o1",
                    "text": "Gato",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Vuelta",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Primero",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Cinta negra",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Neko (猫): Gato; raíz de la postura Neko-Ashi-Dachi (postura del pie de gato).",
            "hint": "Gato."
        },
        {
            "id": "exam-2k-q14",
            "type": "multiple_choice",
            "prompt": "14. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'HITOTSU'?",
            "description": "Asocie de terminología marcial (Dojo Kun)",
            "options": [
                {
                    "id": "o1",
                    "text": "Primero",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Vuelta",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Gato",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Cinta negra",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Hitotsu (一つ): 'Primero'; se antepone a cada una de las 5 normas del Dojo Kun para indicar que todas tienen la máxima prioridad.",
            "hint": "Primero."
        },
        {
            "id": "exam-2k-q15",
            "type": "multiple_choice",
            "prompt": "15. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'DAN'?",
            "description": "Asocie de terminología marcial (Grados)",
            "options": [
                {
                    "id": "o1",
                    "text": "Rango de cinturón negro",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Cinta negra",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Vuelta",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Primero",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Dan (段): Peldaño, nivel o grado de maestría para cinturones negros (desde Shodan 1° Dan en adelante).",
            "hint": "Grado de cinturón negro."
        },
        {
            "id": "exam-2k-q16",
            "type": "multiple_choice",
            "prompt": "16. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'GASSHUKO'?",
            "description": "Asocie de terminología marcial (Entrenamiento)",
            "options": [
                {
                    "id": "o1",
                    "text": "Alojarse juntos",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Clase militar del Japón feudal",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Martillo de hierro",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "El espíritu que perdura",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Gasshuko (合宿): Convivencia o campamento de entrenamiento intensivo donde los practicantes se alojan y entrenan juntos.",
            "hint": "Alojarse juntos en campamento."
        },
        {
            "id": "exam-2k-q17",
            "type": "multiple_choice",
            "prompt": "17. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SAMURAI'?",
            "description": "Asocie de terminología marcial (Historia)",
            "options": [
                {
                    "id": "o1",
                    "text": "Clase militar del Japón feudal",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Alojarse juntos",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Técnica decisiva",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "El espíritu que perdura",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Samurai (侍): Miembro de la casta guerrera y aristocracia militar del Japón feudal, regida por el Bushido.",
            "hint": "Guerrero militar feudal."
        },
        {
            "id": "exam-2k-q18",
            "type": "multiple_choice",
            "prompt": "18. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'TETTSUI'?",
            "description": "Asocie de terminología marcial (Arma natural)",
            "options": [
                {
                    "id": "o1",
                    "text": "Martillo de hierro",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Alojarse juntos",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Clase militar del Japón feudal",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "El espíritu que perdura",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Tettsui (鉄槌): Golpe de puño de martillo con el borde cubital carnoso de la mano cerrada.",
            "hint": "Martillo de hierro."
        },
        {
            "id": "exam-2k-q19",
            "type": "multiple_choice",
            "prompt": "19. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KIME WAZA'?",
            "description": "Asocie de terminología marcial (Concepto biomecánico)",
            "options": [
                {
                    "id": "o1",
                    "text": "Técnica decisiva",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Alojarse juntos",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Martillo de hierro",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Clase militar del Japón feudal",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kime Waza: La ejecución y culminación de una técnica de forma contundente y decisiva.",
            "hint": "Técnica decisiva con foco."
        },
        {
            "id": "exam-2k-q20",
            "type": "multiple_choice",
            "prompt": "20. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'ZANSHIN'?",
            "description": "Asocie de terminología marcial (Estado mental)",
            "options": [
                {
                    "id": "o1",
                    "text": "El espíritu que perdura",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Alojarse juntos",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Martillo de hierro",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Técnica decisiva",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Zanshin (残心): Estado de alerta serena y mente atenta que permanece activo tras ejecutar cualquier acción marcial.",
            "hint": "El espíritu que perdura en alerta."
        },
        {
            "id": "exam-2k-q21",
            "type": "multiple_choice",
            "prompt": "21. COMPLETE: ¿Cuál es el significado de 'KARATE DO SHOTOKAN'?",
            "description": "Complete (1 Punto) - Nombre formal completo",
            "options": [
                {
                    "id": "o1",
                    "text": "El camino de la mano vacía de la escuela o casa de Shoto",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "El arte de luchar con espada de la corte",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Defensa militar del emperador",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "La escuela de boxeo rápido",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Karate (mano vacía), Do (camino espiritual), Shotokan (la escuela de Shoto, en honor a Funakoshi).",
            "hint": "Mano vacía de la escuela de Shoto."
        },
        {
            "id": "exam-2k-q22",
            "type": "multiple_choice",
            "prompt": "22. COMPLETE: ¿Cuál es el significado del Kata 'HANGETSU'?",
            "description": "Complete (1 Punto) - Kata tradicional",
            "options": [
                {
                    "id": "o1",
                    "text": "Media luna",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Sol brillante",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "El vuelo del halcón",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Romper la piedra",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Hangetsu (半月) significa 'Media luna', por la trayectoria circular de los pasos y la postura semicircular Hangetsu-dachi.",
            "hint": "Media luna."
        },
        {
            "id": "exam-2k-q23",
            "type": "multiple_choice",
            "prompt": "23. COMPLETE: ¿Cuál es el significado del Kata 'JION'?",
            "description": "Complete (1 Punto) - Kata tradicional",
            "options": [
                {
                    "id": "o1",
                    "text": "Amor y compasión / Nombre del templo budista Jion-ji",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Guerrero de la tormenta",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Media luna",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Paso de la montaña",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Jion (慈恩) significa 'Amor, piedad y gratitud filial'; se vincula al templo budista clásico Jion-ji.",
            "hint": "Amor y compasión o templo budista."
        },
        {
            "id": "exam-2k-q24",
            "type": "multiple_choice",
            "prompt": "24. COMPLETE: ¿Quién es el Jefe Instructor de la federación ISKF?",
            "description": "Complete (1 Punto) - Liderazgo internacional",
            "options": [
                {
                    "id": "o1",
                    "text": "Master Teruyuki Okazaki / Master Hiroyoshi Okazaki",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Miyamoto Musashi",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Jigoro Kano",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Kenwa Mabuni",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "La ISKF mantiene la línea técnica directa de Master Teruyuki Okazaki y Master Hiroyoshi Okazaki.",
            "hint": "Maestros Okazaki."
        },
        {
            "id": "exam-2k-q25",
            "type": "multiple_choice",
            "prompt": "25. COMPLETE: ¿Cuál es el significado de 'JIYU KUMITE'?",
            "description": "Complete (1 Punto) - Modalidad de combate",
            "options": [
                {
                    "id": "o1",
                    "text": "Combate libre",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Combate a tres pasos predeterminados",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Combate con armas tradicionales",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Solo bloqueos en Seiza",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Jiyu Kumite (自由組手): Combate libre donde ambos oponentes aplican libremente técnicas con control Sundome.",
            "hint": "Combate libre."
        },
        {
            "id": "exam-2k-q26",
            "type": "multiple_choice",
            "prompt": "26. COMPLETE: ¿Cuál es el significado de 'CHAKUGAN'?",
            "description": "Complete (1 Punto) - Principio ocular marcial",
            "options": [
                {
                    "id": "o1",
                    "text": "Punto de enfoque visual / fijación de la mirada",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Salto con rodillazo",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Cinturón de seda",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Caída sobre el tatami",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Chakugan (着眼): La mirada atenta y el punto de fijación visual (Metsuke) para anticipar los movimientos del adversario.",
            "hint": "Fijación y enfoque de la mirada."
        },
        {
            "id": "exam-2k-q27",
            "type": "multiple_choice",
            "prompt": "27. COMPLETE: ¿Cuáles son los 4 estilos oficiales tradicionales de Karate Do reconocidos internacionalmente por la WKF?",
            "description": "Complete (4 Puntos) - Las 4 grandes escuelas",
            "options": [
                {
                    "id": "o1",
                    "text": "Shotokan, Goju-Ryu, Shito-Ryu y Wado-Ryu",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Kyokushin, Capoeira, Taekwondo y Kung Fu",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Judo, Aikido, Kendo y Kudo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Muay Thai, Krav Maga, Jiu-Jitsu y Sambo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "La WKF reconoce formalmente a las 4 ramas matrices: Shotokan (Funakoshi), Goju-Ryu (Miyagi), Shito-Ryu (Mabuni) y Wado-Ryu (Otsuka).",
            "hint": "Shotokan, Goju-Ryu, Shito-Ryu y Wado-Ryu."
        },
        {
            "id": "exam-2k-q28",
            "type": "multiple_choice",
            "prompt": "28. ASOCIE KATAS: ¿En cuál Kata se encuentra la posición que se muestra en la imagen oficial?",
            "description": "Identificación de Katas Superiores (1 Punto)",
            "image": "/images/didactic/exams/kata_jion.png",
            "options": [
                {
                    "id": "o1",
                    "text": "JION",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "HANGETSU",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "KANKU DAI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "TEKKI NIDAN",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Jion: Saludo inicial con brazos cruzados cubriendo el pecho (Kosa-Uke) y pies paralelos.",
            "hint": "Brazos cruzados en guardia solemne inicial."
        },
        {
            "id": "exam-2k-q29",
            "type": "multiple_choice",
            "prompt": "29. ASOCIE KATAS: ¿En cuál Kata se encuentra la posición que se muestra en la imagen oficial?",
            "description": "Identificación de Katas Superiores (1 Punto)",
            "image": "/images/didactic/exams/kata_hangetsu.png",
            "options": [
                {
                    "id": "o1",
                    "text": "HANGETSU",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "BASSAI DAI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "ENPI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "JION",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Hangetsu: Postura semicircular en Hangetsu-dachi con puños al frente y respiración profunda.",
            "hint": "Postura en media luna con puños al frente."
        },
        {
            "id": "exam-2k-q30",
            "type": "multiple_choice",
            "prompt": "30. ASOCIE KATAS: ¿En cuál Kata se encuentra la posición que se muestra en la imagen oficial?",
            "description": "Identificación de Katas Superiores (1 Punto)",
            "image": "/images/didactic/exams/kata_bassai_dai.png",
            "options": [
                {
                    "id": "o1",
                    "text": "BASSAI DAI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "JION",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "TEKKI NIDAN",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "ENPI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Bassai Dai: Ejecución de Manji-Uke / Yama-Zuki en Kokutsu-dachi mirando hacia el flanco.",
            "hint": "Defensa doble característica en Kokutsu-dachi."
        },
        {
            "id": "exam-2k-q31",
            "type": "multiple_choice",
            "prompt": "31. ASOCIE KATAS: ¿En cuál Kata se encuentra la posición que se muestra en la imagen oficial?",
            "description": "Identificación de Katas Superiores (1 Punto)",
            "image": "/images/didactic/exams/kata_enpi.png",
            "options": [
                {
                    "id": "o1",
                    "text": "ENPI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "HANGETSU",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "KANKU DAI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "BASSAI DAI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Enpi: Postura en piernas cruzadas (Kosa-dachi) con codos laterales elevados (doble golpe de codo).",
            "hint": "Kosa-dachi con codos laterales."
        },
        {
            "id": "exam-2k-q32",
            "type": "multiple_choice",
            "prompt": "32. ASOCIE KATAS: ¿En cuál Kata se encuentra la posición que se muestra en la imagen oficial?",
            "description": "Identificación de Katas Superiores (1 Punto)",
            "image": "/images/didactic/exams/kata_kanku_dai.png",
            "options": [
                {
                    "id": "o1",
                    "text": "KANKU DAI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "JION",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "TEKKI NIDAN",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "HANGETSU",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kanku Dai: Gesto emblemático de apertura elevando ambas manos juntas hacia el cielo formando un triángulo.",
            "hint": "Manos elevadas mirando al cielo."
        },
        {
            "id": "exam-2k-q33",
            "type": "multiple_choice",
            "prompt": "33. ASOCIE KATAS: ¿En cuál Kata se encuentra la posición que se muestra en la imagen oficial?",
            "description": "Identificación de Katas Superiores (1 Punto)",
            "image": "/images/didactic/exams/kata_tekki_nidan.png",
            "options": [
                {
                    "id": "o1",
                    "text": "TEKKI NIDAN",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "BASSAI DAI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "ENPI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "KANKU DAI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Tekki Nidan: Cruce lateral de pies y deslizamiento de apoyo en Kiba-dachi (Kosa-dachi lateral).",
            "hint": "Paso lateral de pies en Tekki."
        },
        {
            "id": "exam-2k-q34",
            "type": "multiple_choice",
            "prompt": "34. ASOCIE WKF: En el sistema de arbitraje WKF, ¿a cuántos puntos equivale un 'IPPON'?",
            "description": "Puntuación de Kumite WKF (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "3 PUNTOS",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "2 PUNTOS",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "1 PUNTO",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "PISO",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Ippon (3 puntos) se otorga por patadas a nivel Jodan (cabeza/cuello) o cualquier técnica válida sobre un rival derribado en el suelo.",
            "hint": "Tres puntos."
        },
        {
            "id": "exam-2k-q35",
            "type": "multiple_choice",
            "prompt": "35. ASOCIE WKF: En el sistema de arbitraje WKF, ¿a cuántos puntos equivale un 'WAZA-RI'?",
            "description": "Puntuación de Kumite WKF (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "2 PUNTOS",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "3 PUNTOS",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "1 PUNTO",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "PISO",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Waza-ari (2 puntos) se otorga por patadas a nivel Chudan (abdomen, torso o espalda).",
            "hint": "Dos puntos."
        },
        {
            "id": "exam-2k-q36",
            "type": "multiple_choice",
            "prompt": "36. ASOCIE WKF: En el sistema de arbitraje WKF, ¿a cuántos puntos equivale un 'YUKO'?",
            "description": "Puntuación de Kumite WKF (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "1 PUNTO",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "2 PUNTOS",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "3 PUNTOS",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "PISO",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Yuko (1 punto) se concede por puñetazos válidos directos (Tsuki) o técnicas de mano abierta (Uchi) a zonas puntuables.",
            "hint": "Un punto."
        },
        {
            "id": "exam-2k-q37",
            "type": "multiple_choice",
            "prompt": "37. ASOCIE WKF: En la terminología oficial de competición, ¿qué significa 'TATAMI'?",
            "description": "Área de combate WKF (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "PISO",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "3 PUNTOS",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "2 PUNTOS",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "1 PUNTO",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Tatami es la colchoneta o piso oficial sobre el que se desarrollan los encuentros de combate y kata.",
            "hint": "Piso o superficie de combate."
        },
        {
            "id": "exam-2k-q38",
            "type": "multiple_choice",
            "prompt": "38. ASOCIE WKF: En las órdenes y colores del árbitro, ¿qué significa 'AKA'?",
            "description": "Comandos y arbitraje WKF (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "ROJO",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "AZUL",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "GANADOR",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "DECISION ARBITRAL",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Aka (赤) es el competidor que viste cinturón y protecciones rojas.",
            "hint": "Color rojo."
        },
        {
            "id": "exam-2k-q39",
            "type": "multiple_choice",
            "prompt": "39. ASOCIE WKF: En las órdenes y colores del árbitro, ¿qué significa 'AO'?",
            "description": "Comandos y arbitraje WKF (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "AZUL",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "ROJO",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "EMPEZAR COMBATE",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "GANADOR",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Ao (青) es el competidor que viste cinturón y protecciones azules.",
            "hint": "Color azul."
        },
        {
            "id": "exam-2k-q40",
            "type": "multiple_choice",
            "prompt": "40. ASOCIE WKF: ¿Qué significa la orden arbitral 'TSUZUKETE HAJIME'?",
            "description": "Comandos y arbitraje WKF (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "EMPEZAR COMBATE (o reanudar combate)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "DECISION ARBITRAL",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "GANADOR",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "ROJO",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Tsuzukete Hajime: 'Continuar, ¡empiecen!'; comando para reanudar la contienda tras una interrupción arbitral.",
            "hint": "Reanudar o empezar el combate."
        },
        {
            "id": "exam-2k-q41",
            "type": "multiple_choice",
            "prompt": "41. ASOCIE WKF: ¿Cuál es el significado del término arbitral 'HANTEI'?",
            "description": "Comandos y arbitraje WKF (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "DECISION ARBITRAL",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "GANADOR",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "EMPEZAR COMBATE",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "AZUL",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Hantei (判定): Votación o decisión conjunta de los jueces y árbitro para resolver un empate o determinar el vencedor.",
            "hint": "Decisión de los jueces."
        },
        {
            "id": "exam-2k-q42",
            "type": "multiple_choice",
            "prompt": "42. ASOCIE WKF: ¿Qué proclama el árbitro con la expresión 'NO KACHI'?",
            "description": "Comandos y arbitraje WKF (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "GANADOR",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "DECISION ARBITRAL",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "EMPEZAR COMBATE",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "ROJO",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "No Kachi (の勝ち) significa 'victoria para' (ej. 'Aka no kachi' = victoria para el competidor rojo).",
            "hint": "Ganador o victoria."
        },
        {
            "id": "exam-2k-q43",
            "type": "multiple_choice",
            "prompt": "43. DESARROLLO: Explique los criterios fundamentales utilizados respectivamente para calificar Kumite y Kata:",
            "description": "Evaluación Técnica Comparada (4 Puntos)",
            "options": [
                {
                    "id": "o1",
                    "text": "KATA: Conformidad técnica de posturas/trayectorias, potencia, velocidad, ritmo y respiración. KUMITE: Buena forma, actitud deportiva vigorosa, Zanshin, distancia (Ma-ai) y oportunidad de tiempo (Timing)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "En Kata solo cuenta gritar fuerte y en Kumite lastimar al oponente",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Ambos se califican únicamente por la cantidad de veces que se saluda",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "No existen criterios objetivos, depende del azar del jurado",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Los 6 criterios WKF de Kumite y los criterios técnicos/atléticos de Kata definen la maestría objetiva del practicante avanzado.",
            "hint": "Conformidad técnica en Kata y los 6 criterios de puntuación en Kumite."
        },
        {
            "id": "exam-2k-q44",
            "type": "multiple_choice",
            "prompt": "44. DESARROLLO: ¿Qué significa para usted haber alcanzado el grado de Café 1° Kyu y estar pronto a su Cinta Negra?",
            "description": "Madurez Ética y Vocación de Maestría (1 Punto)",
            "options": [
                {
                    "id": "o1",
                    "text": "Comprender con humildad que el cinturón negro no es el fin sino el inicio del verdadero aprendizaje (Shodan = Primer Nivel), asumiendo el deber ético de liderar como Sempai y dar ejemplo de perseverancia a los grados menores",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Pensar que ya se sabe todo y que no es necesario volver a entrenar con esfuerzo",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Tener autoridad para exigir privilegios sin respetar a los compañeros",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Un simple adorno de color para presumir en redes sociales",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Shodan significa 'primer escalón'. El 1° Kyu alcanza la madurez cuando comprende que el cinturón negro renace como un principiante de nivel superior.",
            "hint": "Humildad, ejemplo como Sempai y comienzo del verdadero camino."
        }
    ]
};
