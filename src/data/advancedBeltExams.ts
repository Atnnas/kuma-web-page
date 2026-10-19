// src/data/advancedBeltExams.ts
// Exámenes Oficiales Escritos de Grado para Cinturones Avanzados (4° Kyu, 3° Kyu, 2° Kyu)
// Generado automáticamente a partir de los temarios oficiales de Kuma Sensei Dojo / ISKF.
// Todas las preguntas están configuradas como Selección Única con 4 opciones aleatorias para estudio previo al examen escrito real.

import type { BeltExamConfig } from "./beltExamData";

// ====================================================================
// EXAMEN OFICIAL: 5° KYU A 4° KYU
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

// ====================================================================
// EXAMEN OFICIAL: 4° KYU A 3° KYU
// ====================================================================
export const EXAM_KYU_4_TO_3: BeltExamConfig = {
    "beltId": "kyu-4",
    "targetBeltId": "kyu-3",
    "beltName": "4° Kyu — Cinturón Morado con Blanco",
    "targetBeltName": "3° Kyu — Cinturón Café (3 Líneas)",
    "targetBeltColor": "#78350F",
    "passingScore": 30,
    "xpReward": 300,
    "title": "Examen Oficial Escrito: 4° Kyu a 3° Kyu",
    "subtitle": "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo / ISKF",
    "description": "Examen oficial de ascenso de 4° Kyu a 3° Kyu de Kuma Sensei Dojo. Evaluación integral de terminología marcial, principios biomecánicos, identificación visual de posturas y ética del Budo.",
    "questions": [
        {
            "id": "e4k-q1",
            "type": "multiple_choice",
            "prompt": "1. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHIHAN'?",
            "description": "Jerarquía marcial",
            "options": [
                {
                    "id": "e4k-q1-o1",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q1-o2",
                    "text": "Ponerse de pie",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q1-o3",
                    "text": "Maestro de un rango superior",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q1-o4",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q1-o3",
            "explanation": "Shihan (師範) designa a un maestro o profesor de rango superior y alta autoridad técnica.",
            "hint": "Rango honorífico de maestro senior."
        },
        {
            "id": "e4k-q2",
            "type": "multiple_choice",
            "prompt": "2. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KOHAI'?",
            "description": "Jerarquía marcial",
            "options": [
                {
                    "id": "e4k-q2-o1",
                    "text": "De menor antigüedad",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q2-o2",
                    "text": "Maestro de un rango superior",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q2-o3",
                    "text": "Detenerse",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q2-o4",
                    "text": "Ponerse de pie",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q2-o1",
            "explanation": "Kohai (後輩) es el estudiante de menor antigüedad o rango que aprende de los más experimentados.",
            "hint": "El compañero que ingresó después al camino."
        },
        {
            "id": "e4k-q3",
            "type": "multiple_choice",
            "prompt": "3. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEIRETSU'?",
            "description": "Comandos de formación",
            "options": [
                {
                    "id": "e4k-q3-o1",
                    "text": "Detenerse",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q3-o2",
                    "text": "Ponerse en fila",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q3-o3",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q3-o4",
                    "text": "Ponerse de pie",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q3-o2",
            "explanation": "Seiretsu (整列) es la orden para formar o alinearse por orden de grado de derecha a izquierda.",
            "hint": "Alineación ordenada en el tatami."
        },
        {
            "id": "e4k-q4",
            "type": "multiple_choice",
            "prompt": "4. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KIRITSU'?",
            "description": "Comandos del tatami",
            "options": [
                {
                    "id": "e4k-q4-o1",
                    "text": "Detenerse",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q4-o2",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q4-o3",
                    "text": "Ponerse de pie",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q4-o4",
                    "text": "Maestro de rango superior",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q4-o3",
            "explanation": "Kiritsu (起立) es el comando para levantarse ordenadamente desde la posición de Seiza.",
            "hint": "Ponerse de pie tras el saludo o meditación."
        },
        {
            "id": "e4k-q5",
            "type": "multiple_choice",
            "prompt": "5. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'YAME'?",
            "description": "Comandos de combate",
            "options": [
                {
                    "id": "e4k-q5-o1",
                    "text": "Detenerse",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q5-o2",
                    "text": "Ponerse de pie",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q5-o3",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q5-o4",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q5-o1",
            "explanation": "Yame (止め) es la orden firme de parar o detener la acción inmediatamente y volver a posición natural.",
            "hint": "Alto o detenerse."
        },
        {
            "id": "e4k-q6",
            "type": "multiple_choice",
            "prompt": "6. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'TE'?",
            "description": "Cuerpo y fundamentos",
            "options": [
                {
                    "id": "e4k-q6-o1",
                    "text": "Mano",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q6-o2",
                    "text": "Vacío",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q6-o3",
                    "text": "Saludo",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q6-o4",
                    "text": "Forma",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q6-o1",
            "explanation": "Te (手) significa mano; raíz original del arte de combate okinawense.",
            "hint": "Parte anatómica que golpea o bloquea."
        },
        {
            "id": "e4k-q7",
            "type": "multiple_choice",
            "prompt": "7. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'MIGI'?",
            "description": "Direccionales en el dojo",
            "options": [
                {
                    "id": "e4k-q7-o1",
                    "text": "Atrás",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q7-o2",
                    "text": "Derecha",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q7-o3",
                    "text": "Izquierda",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q7-o4",
                    "text": "Adelante",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q7-o2",
            "explanation": "Migi (右) es el lado o dirección derecha.",
            "hint": "Dirección opuesta a Hidari."
        },
        {
            "id": "e4k-q8",
            "type": "multiple_choice",
            "prompt": "8. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'REI'?",
            "description": "Etiqueta marcial (Reigi)",
            "options": [
                {
                    "id": "e4k-q8-o1",
                    "text": "Victoria",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q8-o2",
                    "text": "Saludo / Cortesía",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q8-o3",
                    "text": "Desplazamiento",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q8-o4",
                    "text": "Pelea",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q8-o2",
            "explanation": "Rei (礼) representa el saludo sincero, la etiqueta, reverencia y respeto mutuo.",
            "hint": "El principio con el que comienza y termina el Karate."
        },
        {
            "id": "e4k-q9",
            "type": "multiple_choice",
            "prompt": "9. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KATA'?",
            "description": "Pilares del Karate",
            "options": [
                {
                    "id": "e4k-q9-o1",
                    "text": "Fuerza bruta",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q9-o2",
                    "text": "Combate libre",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q9-o3",
                    "text": "Forma",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q9-o4",
                    "text": "Cinturón",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q9-o3",
            "explanation": "Kata (形 / 型) es la secuencia formal coreografiada de combate simulado contra múltiples oponentes.",
            "hint": "Las formas tradicionales legadas por los antiguos maestros."
        },
        {
            "id": "e4k-q10",
            "type": "multiple_choice",
            "prompt": "10. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KARA'?",
            "description": "Filosofía del vacío",
            "options": [
                {
                    "id": "e4k-q10-o1",
                    "text": "Camino",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q10-o2",
                    "text": "Vacío",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q10-o3",
                    "text": "Mano",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q10-o4",
                    "text": "Lleno",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q10-o2",
            "explanation": "Kara (空) significa vacío en el sentido zen: desprovisto de armas y libre de egoísmos.",
            "hint": "Vacío de mente y sin armas en la mano."
        },
        {
            "id": "e4k-q11",
            "type": "multiple_choice",
            "prompt": "11. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHOTOKAN'?",
            "description": "Escuela de Funakoshi",
            "options": [
                {
                    "id": "e4k-q11-o1",
                    "text": "Templo Shaolin",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q11-o2",
                    "text": "Escuela de Shoto",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q11-o3",
                    "text": "Castillo de Shuri",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q11-o4",
                    "text": "Escuela de la fuerza",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q11-o2",
            "explanation": "Shotokan (松濤館): Shoto era el seudónimo poético de Funakoshi ('ondas de pinos') y Kan significa casa/escuela.",
            "hint": "La casa o escuela fundada con el seudónimo del maestro."
        },
        {
            "id": "e4k-q12",
            "type": "multiple_choice",
            "prompt": "12. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'DOJO'?",
            "description": "Espacio sagrado marcial",
            "options": [
                {
                    "id": "e4k-q12-o1",
                    "text": "Lugar del camino",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q12-o2",
                    "text": "Sala de descanso",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q12-o3",
                    "text": "Gimnasio deportivo",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q12-o4",
                    "text": "Patio de armas",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q12-o1",
            "explanation": "Dojo (道場) se traduce como el lugar donde se practica y busca el camino (Do).",
            "hint": "El recinto sagrado de entrenamiento espiritual y físico."
        },
        {
            "id": "e4k-q13",
            "type": "multiple_choice",
            "prompt": "13. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KIHON'?",
            "description": "Pilares del entrenamiento",
            "options": [
                {
                    "id": "e4k-q13-o1",
                    "text": "Combate final",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q13-o2",
                    "text": "Forma artística",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q13-o3",
                    "text": "Fundamento básico",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q13-o4",
                    "text": "Meditación",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q13-o3",
            "explanation": "Kihon (基本) comprende las técnicas fundamentales de posiciones, bloqueos y golpes repetidos metódicamente.",
            "hint": "Los cimientos técnicos indispensables."
        },
        {
            "id": "e4k-q14",
            "type": "multiple_choice",
            "prompt": "14. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEIZA'?",
            "description": "Etiqueta y postura",
            "options": [
                {
                    "id": "e4k-q14-o1",
                    "text": "Sentarse con la espalda erguida",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q14-o2",
                    "text": "Estar de pie",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q14-o3",
                    "text": "Acostarse",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q14-o4",
                    "text": "Caminar despacio",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q14-o1",
            "explanation": "Seiza (正座) es la postura formal tradicional sentada sobre los talones con la columna vertical.",
            "hint": "Sentarse formalmente de rodillas sobre los talones."
        },
        {
            "id": "e4k-q15",
            "type": "multiple_choice",
            "prompt": "15. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'MOKUSO'?",
            "description": "Concentración zen",
            "options": [
                {
                    "id": "e4k-q15-o1",
                    "text": "Meditación",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q15-o2",
                    "text": "Flexión de brazos",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q15-o3",
                    "text": "Grito de combate",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q15-o4",
                    "text": "Calentamiento muscular",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q15-o1",
            "explanation": "Mokuso (黙想) es el momento de introspección silenciosa antes y después de la clase para calmar la mente.",
            "hint": "Cerrar los ojos y serenar el espíritu."
        },
        {
            "id": "e4k-q16",
            "type": "multiple_choice",
            "prompt": "16. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'DO'?",
            "description": "Filosofía del Budo",
            "options": [
                {
                    "id": "e4k-q16-o1",
                    "text": "Camino o vía de vida",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q16-o2",
                    "text": "Técnica física",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q16-o3",
                    "text": "Victoria",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q16-o4",
                    "text": "Competencia",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q16-o1",
            "explanation": "Do (道) designa la senda filosófica de autorrealización ética y espiritual que dura toda la vida.",
            "hint": "La senda ética y de constante evolución."
        },
        {
            "id": "e4k-q17",
            "type": "multiple_choice",
            "prompt": "17. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'OSS'?",
            "description": "Espíritu marcial",
            "options": [
                {
                    "id": "e4k-q17-o1",
                    "text": "Palabra de palabras / cortesía y perseverancia",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q17-o2",
                    "text": "Grito de enojo",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q17-o3",
                    "text": "Orden de atacar",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q17-o4",
                    "text": "Despedida final",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q17-o1",
            "explanation": "Oss (Osu / 押忍) es la expresión marcial que denota respeto, paciencia y perseverancia bajo cualquier presión.",
            "hint": "Condensa perseverar, empujar y soportar con honor."
        },
        {
            "id": "e4k-q18",
            "type": "multiple_choice",
            "prompt": "18. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SENSEI'?",
            "description": "Jerarquía del Dojo",
            "options": [
                {
                    "id": "e4k-q18-o1",
                    "text": "Instructor / Maestro ('El nacido antes')",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q18-o2",
                    "text": "Árbitro lateral",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q18-o3",
                    "text": "Compañero de fila",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q18-o4",
                    "text": "Estudiante novato",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q18-o1",
            "explanation": "Sensei (先生) significa literalmente 'el que nació antes' o el guía experimentado en la senda.",
            "hint": "El maestro que guía a los estudiantes."
        },
        {
            "id": "e4k-q19",
            "type": "multiple_choice",
            "prompt": "19. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'OBI'?",
            "description": "Indumentaria",
            "options": [
                {
                    "id": "e4k-q19-o1",
                    "text": "Cinturón",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q19-o2",
                    "text": "Zapatos",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q19-o3",
                    "text": "Protector de puño",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q19-o4",
                    "text": "Uniforme",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q19-o1",
            "explanation": "Obi (帯) es la cinta o cinturón que ajusta el karategi y representa el grado y la madurez marcial.",
            "hint": "La faja o cinta que ata el traje."
        },
        {
            "id": "e4k-q20",
            "type": "multiple_choice",
            "prompt": "20. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEMPAI'?",
            "description": "Jerarquía del Dojo",
            "options": [
                {
                    "id": "e4k-q20-o1",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q20-o2",
                    "text": "De mayor antigüedad",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q20-o3",
                    "text": "Público espectador",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q20-o4",
                    "text": "Cinturón blanco nuevo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q20-o2",
            "explanation": "Sempai (先輩) es el alumno más antiguo o avanzado respecto a otro, con la responsabilidad de ser ejemplo.",
            "hint": "El estudiante mayor o más veterano."
        },
        {
            "id": "e4k-q21",
            "type": "multiple_choice",
            "prompt": "21. COMPLETE: ¿Cuál es el significado etimológico y marcial del término 'KARATEDO'?",
            "description": "Fundamento filosófico del Karate",
            "options": [
                {
                    "id": "e4k-q21-o1",
                    "text": "El camino de la mano vacía (Kara = Vacío, Te = Mano, Do = Camino)",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q21-o2",
                    "text": "El camino del puño de hierro y la fuerza física",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q21-o3",
                    "text": "El combate libre y continuo con armas tradicionales",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q21-o4",
                    "text": "El arte de la espada samurái y la defensa personal",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q21-o1",
            "explanation": "Karate-Do (空手道): 'Kara' (vacío de armas y libre de ego), 'Te' (mano) y 'Do' (camino ético y formativo de vida).",
            "hint": "Vacío de armas y senda formativa."
        },
        {
            "id": "e4k-q22",
            "type": "multiple_choice",
            "prompt": "22. COMPLETE: ¿Cuál es el significado del nombre del Kata 'BASSAI DAI'?",
            "description": "Katas avanzados Shotokan",
            "options": [
                {
                    "id": "e4k-q22-o1",
                    "text": "Mirar hacia el cielo contemplando las estrellas",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q22-o2",
                    "text": "El vuelo veloz de la golondrina al atardecer",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q22-o3",
                    "text": "La calma de la luna reflejada sobre el lago",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q22-o4",
                    "text": "Penetrar en la fortaleza (Dai = Mayor o grande)",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e4k-q22-o4",
            "explanation": "Bassai (披塞) simboliza la potencia, coraje y resolución implacable para penetrar o romper una fortaleza enemiga.",
            "hint": "Ruptura y penetración de una fortaleza."
        },
        {
            "id": "e4k-q23",
            "type": "multiple_choice",
            "prompt": "23. COMPLETE: ¿Cuál es el significado del nombre del Kata 'KANKU DAI'?",
            "description": "Katas avanzados Shotokan",
            "options": [
                {
                    "id": "e4k-q23-o1",
                    "text": "La danza mística de las diez manos",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q23-o2",
                    "text": "Penetrar en la fortaleza con máxima fuerza",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q23-o3",
                    "text": "Mirar hacia el cielo (Dai = Mayor o grande)",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q23-o4",
                    "text": "El jinete sobre el caballo de hierro",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q23-o3",
            "explanation": "Kanku (観空): 'Kan' (mirar/observar) y 'Ku' (cielo/vacío/universo), evocado en su postura inicial con manos trianguladas hacia el cielo.",
            "hint": "Apertura contemplando el cielo infinito."
        },
        {
            "id": "e4k-q24",
            "type": "multiple_choice",
            "prompt": "24. COMPLETE: ¿Cuál de las siguientes es una de las 5 oraciones oficiales del 'DOJO KUN'?",
            "description": "Código de honor del Dojo",
            "options": [
                {
                    "id": "e4k-q24-o1",
                    "text": "Atacar siempre primero para garantizar la victoria en el combate",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q24-o2",
                    "text": "Buscar la fama deportiva y la superioridad sobre los demás",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q24-o3",
                    "text": "Vencer a todo oponente sin importar los medios utilizados",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q24-o4",
                    "text": "Intentar perfeccionar el carácter (Jinkaku kansei ni tsutomuru koto)",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e4k-q24-o4",
            "explanation": "El Dojo Kun son los cinco principios éticos proclamados por Sakukawa y Funakoshi para cultivar virtudes en el karateka.",
            "hint": "El perfeccionamiento del carácter personal."
        },
        {
            "id": "e4k-q25",
            "type": "multiple_choice",
            "prompt": "25. COMPLETE: ¿Cuántos Katas oficiales tradicionales integran el canon del estilo Shotokan?",
            "description": "Katas oficiales JKA / WKF",
            "options": [
                {
                    "id": "e4k-q25-o1",
                    "text": "50 Katas oficiales",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q25-o2",
                    "text": "26 Katas oficiales",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q25-o3",
                    "text": "32 Katas oficiales",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q25-o4",
                    "text": "15 Katas oficiales",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q25-o2",
            "explanation": "El canon tradicional Shotokan consta exactamente de 26 katas (Heian 1-5, Tekki 1-3, Bassai Dai/Sho, Kanku Dai/Sho, Jion, Enpi, Hangetsu, Jitte, Gankaku, Chinte, Sochin, Meikyo, Jiin, Gojushiho Dai/Sho, Nijushiho, Wankan y Unsu).",
            "hint": "Número exacto entre 25 y 27."
        },
        {
            "id": "e4k-q26",
            "type": "multiple_choice",
            "prompt": "26. COMPLETE: ¿Quién es universalmente reconocido como el Padre Fundador del Karate-Do Shotokan?",
            "description": "Historia del Karate moderno",
            "options": [
                {
                    "id": "e4k-q26-o1",
                    "text": "Maestro Hironori Otsuka (Fundador de Wado-Ryu)",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q26-o2",
                    "text": "Maestro Gichin Funakoshi (1868–1957)",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q26-o3",
                    "text": "Maestro Chojun Miyagi (Fundador de Goju-Ryu)",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q26-o4",
                    "text": "Maestro Kenwa Mabuni (Fundador de Shito-Ryu)",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q26-o2",
            "explanation": "El Maestro Gichin Funakoshi es reverenciado como el padre del Karate-Do moderno por difundirlo desde Okinawa a Japón continental y al mundo entero.",
            "hint": "El creador del seudónimo Shoto."
        },
        {
            "id": "e4k-q27",
            "type": "multiple_choice",
            "prompt": "27. COMPLETE: ¿Cuál es el origen geográfico e histórico del Karate Do Shotokan?",
            "description": "Historia y geografía marcial",
            "options": [
                {
                    "id": "e4k-q27-o1",
                    "text": "Ciudad imperial de Kioto (Japón central)",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q27-o2",
                    "text": "Provincia de Cantón (China meridional)",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q27-o3",
                    "text": "Península de Corea (Reino de Silla)",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q27-o4",
                    "text": "Isla de Okinawa (Antiguo Reino de Ryukyu, Japón)",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e4k-q27-o4",
            "explanation": "El Karate se originó en la isla de Okinawa por la combinación del arte nativo okinawense (Te) con artes de combate chinas.",
            "hint": "Isla al sur del archipiélago japonés."
        },
        {
            "id": "e4k-q28",
            "type": "multiple_choice",
            "prompt": "28. COMPLETE: ¿Cuál es la definición y características de 'JIYU IPPON KUMITE'?",
            "description": "Modalidades de combate",
            "options": [
                {
                    "id": "e4k-q28-o1",
                    "text": "Combate semi-libre a un solo ataque anunciado ejecutado a velocidad y distancia real",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q28-o2",
                    "text": "Secuencia básica predeterminada a cinco pasos continuos (Gohon Kumite)",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q28-o3",
                    "text": "Combate de exhibición sin desplazamientos ni contacto defensivo",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q28-o4",
                    "text": "Combate libre continuo por puntos sin aviso previo de técnicas",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q28-o1",
            "explanation": "Jiyu Ippon Kumite combina la distancia dinámica y movimiento libre con un ataque declarado a máxima potencia y control riguroso.",
            "hint": "Semi-libre a un solo ataque anunciado."
        },
        {
            "id": "e4k-q29",
            "type": "multiple_choice",
            "prompt": "29. COMPLETE: ¿Cuál de las siguientes opciones describe áreas técnicas fundamentales del Kihon?",
            "description": "Pilares del Kihon",
            "options": [
                {
                    "id": "e4k-q29-o1",
                    "text": "Dachi-waza (posiciones), Uke-waza (defensas) y Tsuki/Uchi-waza (golpes)",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q29-o2",
                    "text": "Kappo-waza (reanimación y primeros auxilios en el tatami)",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q29-o3",
                    "text": "Kangeiko (entrenamiento de natación invernal en aguas abiertas)",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q29-o4",
                    "text": "Tameshiwari (rompimiento competitivo de materiales de construcción)",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q29-o1",
            "explanation": "El Kihon se subdivide en posiciones (Dachi), defensas (Uke), golpes frontales (Tsuki), golpes indirectos (Uchi) y patadas (Geri).",
            "hint": "Posiciones, defensas y ataques de golpeo."
        },
        {
            "id": "e4k-q30",
            "type": "multiple_choice",
            "prompt": "30. COMPLETE: ¿Cuál es el nombre en japonés del uniforme oficial de práctica de Karate Do?",
            "description": "Indumentaria tradicional",
            "options": [
                {
                    "id": "e4k-q30-o1",
                    "text": "Kimono ceremonial de seda",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q30-o2",
                    "text": "Karategi (o simplemente Gi / Dogi)",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q30-o3",
                    "text": "Hakama tradicional con pliegues",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q30-o4",
                    "text": "Yukata ligero de descanso",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q30-o2",
            "explanation": "Karategi (空手着) es el uniforme de lona blanca compuesto por chaqueta (Uwagi), pantalón (Zubon) y cinturón (Obi).",
            "hint": "El traje blanco de entrenamiento marcial."
        },
        {
            "id": "e4k-q31",
            "type": "multiple_choice",
            "prompt": "31. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "options": [
                {
                    "id": "e4k-q31-o1",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q31-o2",
                    "text": "KIBA DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q31-o3",
                    "text": "ZENKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q31-o4",
                    "text": "HEISOKU DACHI",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e4k-q31-o4",
            "explanation": "Heisoku-dachi: Postura con pies juntos en paralelo tocándose por completo bordes internos y talones.",
            "hint": "Pies juntos y paralelos.",
            "image": "/images/didactic/exams/dachi_heisoku.png"
        },
        {
            "id": "e4k-q32",
            "type": "multiple_choice",
            "prompt": "32. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "options": [
                {
                    "id": "e4k-q32-o1",
                    "text": "HEISOKU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q32-o2",
                    "text": "MUSUBI DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q32-o3",
                    "text": "YOI DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q32-o4",
                    "text": "KIBA DACHI",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e4k-q32-o4",
            "explanation": "Kiba-dachi: Postura del jinete con pies paralelos, rodillas abiertas hacia afuera y peso 50/50.",
            "hint": "Postura del jinete.",
            "image": "/images/didactic/exams/dachi_kiba.png"
        },
        {
            "id": "e4k-q33",
            "type": "multiple_choice",
            "prompt": "33. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "options": [
                {
                    "id": "e4k-q33-o1",
                    "text": "YOI DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q33-o2",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q33-o3",
                    "text": "ZENKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q33-o4",
                    "text": "KIBA DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q33-o2",
            "explanation": "Kokutsu-dachi: Postura atrasada con el 70% del peso en la pierna trasera y 30% en la delantera.",
            "hint": "Mayoría del peso en la pierna de atrás.",
            "image": "/images/didactic/exams/dachi_kokutsu.png"
        },
        {
            "id": "e4k-q34",
            "type": "multiple_choice",
            "prompt": "34. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "options": [
                {
                    "id": "e4k-q34-o1",
                    "text": "MUSUBI DACHI",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q34-o2",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q34-o3",
                    "text": "KIBA DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q34-o4",
                    "text": "ZENKUTSU DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q34-o1",
            "explanation": "Musubi-dachi: Postura de pie y erguido para saludo; talones juntos y puntas de los pies abiertas a 45°-60°.",
            "hint": "Talones juntos y puntas abiertas para saludar.",
            "image": "/images/didactic/exams/dachi_musubi.png"
        },
        {
            "id": "e4k-q35",
            "type": "multiple_choice",
            "prompt": "35. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "options": [
                {
                    "id": "e4k-q35-o1",
                    "text": "YOI DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q35-o2",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q35-o3",
                    "text": "ZENKUTSU DACHI",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q35-o4",
                    "text": "HEISOKU DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q35-o3",
            "explanation": "Zenkutsu-dachi: Postura adelantada con 60% del peso en la pierna delantera flexionada y pierna trasera estirada.",
            "hint": "Postura adelantada clásica.",
            "image": "/images/didactic/exams/dachi_zenkutsu.png"
        },
        {
            "id": "e4k-q36",
            "type": "multiple_choice",
            "prompt": "36. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "options": [
                {
                    "id": "e4k-q36-o1",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q36-o2",
                    "text": "MUSUBI DACHI",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q36-o3",
                    "text": "YOI DACHI (HACHIJI DACHI)",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q36-o4",
                    "text": "KIBA DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q36-o3",
            "explanation": "Yoi-dachi (Hachiji-dachi): Postura natural de espera con pies separados al ancho de hombros y puntas hacia afuera.",
            "hint": "Postura de atención y espera.",
            "image": "/images/didactic/exams/dachi_yoi.png"
        },
        {
            "id": "e4k-q37",
            "type": "multiple_choice",
            "prompt": "37. DESARROLLO: Según los principios formativos del Karate-Do, ¿en qué aspecto fundamental beneficia su práctica a la vida diaria?",
            "description": "Formación de valores marciales",
            "options": [
                {
                    "id": "e4k-q37-o1",
                    "text": "Forja del carácter, disciplina en los estudios/trabajo, respeto sincero al prójimo y serenidad ante la adversidad",
                    "isCorrect": true
                },
                {
                    "id": "e4k-q37-o2",
                    "text": "Buscar constantemente situaciones peligrosas en la calle para poner a prueba las técnicas",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q37-o3",
                    "text": "Aprender a reaccionar con violencia física inmediata ante cualquier desacuerdo",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q37-o4",
                    "text": "Desarrollar arrogancia e intimidar a otros demostrando superioridad marcial en discusiones",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e4k-q37-o1",
            "explanation": "El Karate-Do es una vía de superación integral donde la defensa personal es el medio para forjar templanza, humildad y serenidad emocional.",
            "hint": "Crecimiento del carácter y autocontrol moral."
        },
        {
            "id": "e4k-q38",
            "type": "multiple_choice",
            "prompt": "38. DESARROLLO: Del Niju Kun (20 preceptos de Funakoshi), ¿cuál máxima rige la cortesía y la conducta en el vivir diario?",
            "description": "Ética del Niju Kun",
            "options": [
                {
                    "id": "e4k-q38-o1",
                    "text": "El estudiante debe ocultar su miedo mostrando agresividad externa constante",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q38-o2",
                    "text": "El practicante debe destruir a su rival por cualquier medio sin importar las reglas",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q38-o3",
                    "text": "La cortesía y el saludo son innecesarios una vez alcanzado el grado avanzado",
                    "isCorrect": false
                },
                {
                    "id": "e4k-q38-o4",
                    "text": "Karate wa rei ni hajimari, rei ni owaru koto (El Karate empieza y termina con respeto y cortesía)",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e4k-q38-o4",
            "explanation": "Funakoshi enfatizó que el verdadero Karate se practica fuera del Dojo mediante la cortesía constante, el respeto y la humildad hacia todos.",
            "hint": "Empieza y termina con respeto."
        }
    ]
};

// ====================================================================
// EXAMEN OFICIAL: 3° KYU A 2° KYU
// ====================================================================
export const EXAM_KYU_3_TO_2: BeltExamConfig = {
    "beltId": "kyu-3",
    "targetBeltId": "kyu-2",
    "beltName": "3° Kyu — Cinturón Café (3 Líneas)",
    "targetBeltName": "2° Kyu — Cinturón Café (2 Líneas)",
    "targetBeltColor": "#602A0B",
    "passingScore": 30,
    "xpReward": 350,
    "title": "Examen Oficial Escrito: 3° Kyu a 2° Kyu",
    "subtitle": "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo / ISKF",
    "description": "Examen oficial de ascenso de 3° Kyu a 2° Kyu de Kuma Sensei Dojo. Dominio de terminología avanzada, identificación visual de técnicas (Waza), historia del Shotokan y biomecánica de Kime.",
    "questions": [
        {
            "id": "e3k-q1",
            "type": "multiple_choice",
            "prompt": "1. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'BUNKAI'?",
            "description": "Comprensión de Kata",
            "options": [
                {
                    "id": "e3k-q1-o1",
                    "text": "Saludo al frente",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q1-o2",
                    "text": "Puño grande",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q1-o3",
                    "text": "Desglose de Kata / Aplicación práctica",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q1-o4",
                    "text": "Línea de ejecución",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q1-o3",
            "explanation": "Bunkai (分解) es el análisis y aplicación marcial real de cada técnica y movimiento del kata.",
            "hint": "Descomponer y analizar la técnica."
        },
        {
            "id": "e3k-q2",
            "type": "multiple_choice",
            "prompt": "2. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'BUDOKA'?",
            "description": "Identidad marcial",
            "options": [
                {
                    "id": "e3k-q2-o1",
                    "text": "Practicante de artes marciales",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q2-o2",
                    "text": "Dojo central",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q2-o3",
                    "text": "Desglose de kata",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q2-o4",
                    "text": "Línea del kata",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q2-o1",
            "explanation": "Budoka (武道家) es la persona que consagra su vida y conducta al camino del Budo.",
            "hint": "El estudiante o maestro comprometido con el Budo."
        },
        {
            "id": "e3k-q3",
            "type": "multiple_choice",
            "prompt": "3. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'ENBUSEN'?",
            "description": "Geometría del Kata",
            "options": [
                {
                    "id": "e3k-q3-o1",
                    "text": "Saludo entre nosotros",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q3-o2",
                    "text": "Representación lineal del kata",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q3-o3",
                    "text": "Desglose de kata",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q3-o4",
                    "text": "Puño grande",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q3-o2",
            "explanation": "Enbusen (演武線) es el diagrama o línea sobre el suelo por donde transcurre la trayectoria del kata.",
            "hint": "La línea imaginaria que traza el kata."
        },
        {
            "id": "e3k-q4",
            "type": "multiple_choice",
            "prompt": "4. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'DAI'?",
            "description": "Nomenclatura de Katas",
            "options": [
                {
                    "id": "e3k-q4-o1",
                    "text": "Primero",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q4-o2",
                    "text": "Grande o mayor",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q4-o3",
                    "text": "Segundo",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q4-o4",
                    "text": "Pequeño o menor",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q4-o2",
            "explanation": "Dai (大) significa grande o mayor; se usa para distinguir versiones extensas (Bassai Dai, Kanku Dai).",
            "hint": "Opuesto a Sho (pequeño/menor)."
        },
        {
            "id": "e3k-q5",
            "type": "multiple_choice",
            "prompt": "5. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEIKEN'?",
            "description": "Armas corporales",
            "options": [
                {
                    "id": "e3k-q5-o1",
                    "text": "Puño frontal (nudillos principales)",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q5-o2",
                    "text": "Desglose de kata",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q5-o3",
                    "text": "Saludo al frente",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q5-o4",
                    "text": "Línea del kata",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q5-o1",
            "explanation": "Seiken (正拳) es el puño fundamental cerrado que impacta con los nudillos del índice y corazón.",
            "hint": "El puño correcto tradicional."
        },
        {
            "id": "e3k-q6",
            "type": "multiple_choice",
            "prompt": "6. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHOMEN NI REI'?",
            "description": "Etiqueta del Dojo",
            "options": [
                {
                    "id": "e3k-q6-o1",
                    "text": "Dojo central",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q6-o2",
                    "text": "Saludo al frente",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q6-o3",
                    "text": "Espíritu y armonía",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q6-o4",
                    "text": "Saludo entre nosotros",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q6-o2",
            "explanation": "Shomen ni rei (正面に礼) es el saludo reverente hacia el frente principal del dojo.",
            "hint": "Saludo hacia el punto focal del dojo."
        },
        {
            "id": "e3k-q7",
            "type": "multiple_choice",
            "prompt": "7. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KIAI'?",
            "description": "Energía marcial",
            "options": [
                {
                    "id": "e3k-q7-o1",
                    "text": "Pinos ondulantes",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q7-o2",
                    "text": "Espíritu y armonía / unión de energía",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q7-o3",
                    "text": "Línea del kata",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q7-o4",
                    "text": "Desglose de kata",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q7-o2",
            "explanation": "Kiai (気合): 'Ki' (energía vital) y 'Ai' (unión/armonía), proyectado con voz firme en el momento del impacto.",
            "hint": "La liberación vocal de la energía interna."
        },
        {
            "id": "e3k-q8",
            "type": "multiple_choice",
            "prompt": "8. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'HONBU DOJO'?",
            "description": "Organización marcial",
            "options": [
                {
                    "id": "e3k-q8-o1",
                    "text": "Pinos ondulantes",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q8-o2",
                    "text": "Espíritu y armonía",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q8-o3",
                    "text": "Saludo al frente",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q8-o4",
                    "text": "Dojo central / Sede principal",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e3k-q8-o4",
            "explanation": "Honbu Dojo (本部道場) es el dojo matriz o sede central de una organización o escuela.",
            "hint": "El dojo principal de la organización."
        },
        {
            "id": "e3k-q9",
            "type": "multiple_choice",
            "prompt": "9. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHOTO'?",
            "description": "Historia de Funakoshi",
            "options": [
                {
                    "id": "e3k-q9-o1",
                    "text": "Puño grande",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q9-o2",
                    "text": "Pinos ondulantes",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q9-o3",
                    "text": "Saludo al frente",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q9-o4",
                    "text": "Dojo central",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q9-o2",
            "explanation": "Shoto (松濤) era el seudónimo con el que Funakoshi firmaba sus poemas juveniles en Shuri ('el rumor del viento en los pinos').",
            "hint": "Seudónimo poético del Maestro Funakoshi."
        },
        {
            "id": "e3k-q10",
            "type": "multiple_choice",
            "prompt": "10. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'OTAGAI NI REI'?",
            "description": "Etiqueta del Dojo",
            "options": [
                {
                    "id": "e3k-q10-o1",
                    "text": "Saludo al frente",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q10-o2",
                    "text": "Dojo central",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q10-o3",
                    "text": "Saludo entre nosotros / mutuo",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q10-o4",
                    "text": "Desglose de kata",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q10-o3",
            "explanation": "Otagai ni rei (お互いに礼) es la reverencia mutua entre compañeros de entrenamiento.",
            "hint": "Saludo recíproco de respeto mutuo."
        },
        {
            "id": "e3k-q11",
            "type": "multiple_choice",
            "prompt": "11. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'HIDARI'?",
            "description": "Direccionales en el dojo",
            "options": [
                {
                    "id": "e3k-q11-o1",
                    "text": "Derecha",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q11-o2",
                    "text": "Izquierda",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q11-o3",
                    "text": "Abajo",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q11-o4",
                    "text": "Arriba",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q11-o2",
            "explanation": "Hidari (左) designa el lado o dirección izquierda.",
            "hint": "Lado opuesto a Migi."
        },
        {
            "id": "e3k-q12",
            "type": "multiple_choice",
            "prompt": "12. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'BO'?",
            "description": "Armamento tradicional Kobudo",
            "options": [
                {
                    "id": "e3k-q12-o1",
                    "text": "Palo o bastón largo de madera",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q12-o2",
                    "text": "Cuchillo",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q12-o3",
                    "text": "Espada",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q12-o4",
                    "text": "Escudo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q12-o1",
            "explanation": "Bo (棒) es el bastón de madera largo (aprox. 180 cm) clásico del Kobudo okinawense.",
            "hint": "Bastón largo tradicional de madera."
        },
        {
            "id": "e3k-q13",
            "type": "multiple_choice",
            "prompt": "13. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'NAORE'?",
            "description": "Comandos del tatami",
            "options": [
                {
                    "id": "e3k-q13-o1",
                    "text": "Recupérese / Volver a posición natural",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q13-o2",
                    "text": "Golpear fuerte",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q13-o3",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q13-o4",
                    "text": "Empezar combate",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q13-o1",
            "explanation": "Naore (直れ) es la orden para relajarse y regresar a la postura natural (Shizentai/Hachiji-dachi).",
            "hint": "Orden para regresar al estado normal de atención."
        },
        {
            "id": "e3k-q14",
            "type": "multiple_choice",
            "prompt": "14. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KAMAE'?",
            "description": "Posición táctica",
            "options": [
                {
                    "id": "e3k-q14-o1",
                    "text": "Lema del dojo",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q14-o2",
                    "text": "Posición de guardia / combate",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q14-o3",
                    "text": "Recupérese",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q14-o4",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q14-o2",
            "explanation": "Kamae (構え) es la postura de alerta, guardia y disposición corporal/mental ante el oponente.",
            "hint": "Guardia activa de combate."
        },
        {
            "id": "e3k-q15",
            "type": "multiple_choice",
            "prompt": "15. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'HAJIME'?",
            "description": "Comandos de combate",
            "options": [
                {
                    "id": "e3k-q15-o1",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q15-o2",
                    "text": "Saludo mutuo",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q15-o3",
                    "text": "Empezar",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q15-o4",
                    "text": "Detenerse",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q15-o3",
            "explanation": "Hajime (始め) es el comando arbitral o del instructor para dar inicio inmediato a la acción.",
            "hint": "¡Comenzar!"
        },
        {
            "id": "e3k-q16",
            "type": "multiple_choice",
            "prompt": "16. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEIRETSU'?",
            "description": "Comandos de formación",
            "options": [
                {
                    "id": "e3k-q16-o1",
                    "text": "Recupérese",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q16-o2",
                    "text": "Ponerse en fila",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q16-o3",
                    "text": "Empezar",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q16-o4",
                    "text": "Posición de guardia",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q16-o2",
            "explanation": "Seiretsu (整列) es la orden para formar en línea recta ordenada por graduaciones.",
            "hint": "Formación alineada de los karatekas."
        },
        {
            "id": "e3k-q17",
            "type": "multiple_choice",
            "prompt": "17. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KUMITE'?",
            "description": "Pilares del Karate",
            "options": [
                {
                    "id": "e3k-q17-o1",
                    "text": "Encuentro de manos / Combate",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q17-o2",
                    "text": "Lema formativo",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q17-o3",
                    "text": "Rango de grado",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q17-o4",
                    "text": "Forma coreografiada",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q17-o1",
            "explanation": "Kumite (組手): 'Kumi' (entrelazar/encuentro) y 'Te' (manos), el combate real o pautado con un oponente.",
            "hint": "La aplicación técnica frente a un adversario."
        },
        {
            "id": "e3k-q18",
            "type": "multiple_choice",
            "prompt": "18. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KYU'?",
            "description": "Sistema de grados",
            "options": [
                {
                    "id": "e3k-q18-o1",
                    "text": "Grado de cinta negra",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q18-o2",
                    "text": "Uniforme oficial",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q18-o3",
                    "text": "Rango de grado previo a cinta negra",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q18-o4",
                    "text": "Maestro supremo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q18-o3",
            "explanation": "Kyu (級) designa los niveles de aprendizaje de cinturones de color previos al Dan.",
            "hint": "Los grados de cinturones de color hasta el café."
        },
        {
            "id": "e3k-q19",
            "type": "multiple_choice",
            "prompt": "19. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'WAZA'?",
            "description": "Terminología técnica",
            "options": [
                {
                    "id": "e3k-q19-o1",
                    "text": "Técnica",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q19-o2",
                    "text": "Grado",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q19-o3",
                    "text": "Lema",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q19-o4",
                    "text": "Palo largo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q19-o1",
            "explanation": "Waza (技) significa técnica o arte en la ejecución de los movimientos marciales.",
            "hint": "Habilidad o técnica corporal."
        },
        {
            "id": "e3k-q20",
            "type": "multiple_choice",
            "prompt": "20. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KUN'?",
            "description": "Filosofía del Budo",
            "options": [
                {
                    "id": "e3k-q20-o1",
                    "text": "Combate",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q20-o2",
                    "text": "Izquierda",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q20-o3",
                    "text": "Lema / Precepto formativo",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q20-o4",
                    "text": "Bastón",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q20-o3",
            "explanation": "Kun (訓) significa lema, regla o enseñanza moral (como en Dojo Kun).",
            "hint": "Precepto moral o máxima de conducta."
        },
        {
            "id": "e3k-q21",
            "type": "multiple_choice",
            "prompt": "21. COMPLETE: ¿Cuál es el significado histórico y literal de 'SHOTOKAN'?",
            "description": "Historia de la escuela Shotokan",
            "options": [
                {
                    "id": "e3k-q21-o1",
                    "text": "El monasterio sagrado de las artes secretas",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q21-o2",
                    "text": "La casa de Shoto (Shoto: 'ondas de pinos', seudónimo de Funakoshi; Kan: casa o salón)",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q21-o3",
                    "text": "El templo del tigre celestial de Okinawa",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q21-o4",
                    "text": "La fortaleza invencible del puño de acero",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q21-o2",
            "explanation": "Shotokan (松濤館) fue el nombre que sus discípulos dieron al dojo central inaugurado por Funakoshi en Tokio en 1939.",
            "hint": "El seudónimo poético de Funakoshi y su dojo."
        },
        {
            "id": "e3k-q22",
            "type": "multiple_choice",
            "prompt": "22. COMPLETE: ¿Cuál es el significado del nombre del Kata 'ENPI'?",
            "description": "Katas avanzados Shotokan",
            "options": [
                {
                    "id": "e3k-q22-o1",
                    "text": "La grulla blanca descansando en el loto",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q22-o2",
                    "text": "La luna llena brillando sobre la montaña",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q22-o3",
                    "text": "El vuelo de la golondrina (movimientos rápidos y ligeros simulando el vuelo del ave)",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q22-o4",
                    "text": "Penetrar en la fortaleza con máxima potencia",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q22-o3",
            "explanation": "Enpi (燕飛) destaca por cambios súbitos de altura, saltos y fintas rápidas emulando a la golondrina.",
            "hint": "Ave ágil de vuelo rasante y quiebres rápidos."
        },
        {
            "id": "e3k-q23",
            "type": "multiple_choice",
            "prompt": "23. COMPLETE: ¿Cuál es el significado marcial del Kata 'TEKKI NIDAN'?",
            "description": "Katas de la serie Tekki",
            "options": [
                {
                    "id": "e3k-q23-o1",
                    "text": "El salto del leopardo en segunda posición",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q23-o2",
                    "text": "La media luna creciente de Okinawa",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q23-o3",
                    "text": "Diez manos protegiendo el castillo imperial",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q23-o4",
                    "text": "Jinete de hierro nivel 2 (desarrollado en Kiba-dachi sobre un Enbusen lineal)",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e3k-q23-o4",
            "explanation": "Tekki (鉄騎) simula el combate en espacios reducidos (muros o embarcaciones) con desplazamientos laterales en Kiba-dachi.",
            "hint": "Jinete a caballo de hierro, segundo nivel."
        },
        {
            "id": "e3k-q24",
            "type": "multiple_choice",
            "prompt": "24. COMPLETE: ¿Cuál es la similitud fundamental que comparten todos los Katas de la serie Heian?",
            "description": "Estructura de Katas Heian",
            "options": [
                {
                    "id": "e3k-q24-o1",
                    "text": "Todos inician con un ataque de puño frontal a máxima potencia (Oi-Zuki)",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q24-o2",
                    "text": "Todos los 5 Katas Heian inician con un movimiento defensivo o bloqueo (Uke)",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q24-o3",
                    "text": "Todos se ejecutan exclusivamente en la posición Kiba-dachi sin avanzar",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q24-o4",
                    "text": "Todos culminan obligatoriamente con una patada de salto voladora (Tobi-Geri)",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q24-o2",
            "explanation": "El principio 'Karate ni sente nashi' (en el Karate no existe el primer ataque) se refleja en que todo Heian comienza defendiendo.",
            "hint": "Ningún kata básico inicia atacando."
        },
        {
            "id": "e3k-q25",
            "type": "multiple_choice",
            "prompt": "25. COMPLETE: ¿Cuáles son las siglas del organismo internacional rector para campeonatos mundiales de Karate?",
            "description": "Organizaciones mundiales",
            "options": [
                {
                    "id": "e3k-q25-o1",
                    "text": "UFC (Ultimate Fighting Championship)",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q25-o2",
                    "text": "WTF (World Taekwondo Federation)",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q25-o3",
                    "text": "WKF (World Karate Federation)",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q25-o4",
                    "text": "IJF (International Judo Federation)",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q25-o3",
            "explanation": "La World Karate Federation (WKF) es la máxima entidad rectora del deporte del Karate ante el Comité Olímpico Internacional.",
            "hint": "Federación Mundial de Karate."
        },
        {
            "id": "e3k-q26",
            "type": "multiple_choice",
            "prompt": "26. COMPLETE: ¿Quién fundó la federación internacional ISKF (International Shotokan Karate Federation)?",
            "description": "Maestros del Shotokan",
            "options": [
                {
                    "id": "e3k-q26-o1",
                    "text": "Maestro Teruyuki Okazaki (10° Dan)",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q26-o2",
                    "text": "Maestro Hidetaka Nishiyama",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q26-o3",
                    "text": "Maestro Masatoshi Nakayama",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q26-o4",
                    "text": "Maestro Taiji Kase",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q26-o1",
            "explanation": "La ISKF fue fundada por el Shihan Teruyuki Okazaki, discípulo directo de Funakoshi y pionero en la expansión internacional del Shotokan.",
            "hint": "Shihan fundador Okazaki."
        },
        {
            "id": "e3k-q27",
            "type": "multiple_choice",
            "prompt": "27. COMPLETE: Según la tradición clásica, ¿cuál es el origen ancestral raíz de las artes marciales orientales?",
            "description": "Historia de las artes marciales",
            "options": [
                {
                    "id": "e3k-q27-o1",
                    "text": "Las legiones de gladiadores romanos trasladados al Lejano Oriente",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q27-o2",
                    "text": "Las academias de tiro con arco mongol del siglo XIII",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q27-o3",
                    "text": "India (Bodhidharma / Daruma) y el Templo Shaolin de China, con desarrollo en Okinawa",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q27-o4",
                    "text": "Los torneos de esgrima samurái de Kioto en el siglo XIX",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q27-o3",
            "explanation": "La tradición traza el origen del combate sin armas en el monje indio Bodhidharma en el Monasterio Shaolin, influyendo luego en el Te okinawense.",
            "hint": "Bodhidharma, Shaolin y Okinawa."
        },
        {
            "id": "e3k-q28",
            "type": "multiple_choice",
            "prompt": "28. COMPLETE: ¿Cuál es el significado y propósito técnico de 'JIYU IPPON KUMITE'?",
            "description": "Pedagogía del combate",
            "options": [
                {
                    "id": "e3k-q28-o1",
                    "text": "Combate de sumisiones en el suelo con agarres al cuello",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q28-o2",
                    "text": "Combate semi-libre a un solo ataque anunciado ejecutado a velocidad, distancia y potencia real",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q28-o3",
                    "text": "Coreografía gimnástica sin oposición física de un compañero",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q28-o4",
                    "text": "Combate libre competitivo sin aviso de técnicas para sumar puntos rápidos",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q28-o2",
            "explanation": "Jiyu Ippon Kumite entrena el sentido de la distancia crítica (Maai), el timming exacto y la respuesta decisiva con Kime.",
            "hint": "Ataque anunciado con distancia libre."
        },
        {
            "id": "e3k-q29",
            "type": "multiple_choice",
            "prompt": "29. COMPLETE: ¿Cuál es el significado literal del término marcial 'YAKUSOKU'?",
            "description": "Terminología de entrenamiento",
            "options": [
                {
                    "id": "e3k-q29-o1",
                    "text": "Victoria por abandono del adversario",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q29-o2",
                    "text": "Promesa o acuerdo (combate acordado / predeterminado)",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q29-o3",
                    "text": "Descalificación por exceso de contacto",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q29-o4",
                    "text": "Ataque sorpresa sin aviso previo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q29-o2",
            "explanation": "Yakusoku Kumite es el combate convenido o prometido donde ambos atletas ejecutan secuencias pautadas para aprender con seguridad.",
            "hint": "Pactado o acordado previamente."
        },
        {
            "id": "e3k-q30",
            "type": "multiple_choice",
            "prompt": "30. COMPLETE: ¿Cuáles son los cuatro estilos tradicionales principales de Karate Do japonés reconocidos por la WKF?",
            "description": "Estilos mayores del Karate",
            "options": [
                {
                    "id": "e3k-q30-o1",
                    "text": "Shotokan, Shito-Ryu, Goju-Ryu y Wado-Ryu",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q30-o2",
                    "text": "Kyokushin, Judo, Aikido y Kendo",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q30-o3",
                    "text": "Shotokan, Taekwondo, Kung Fu y Jiu-Jitsu",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q30-o4",
                    "text": "Shorinji Kempo, Capoeira, Hapkido y Muay Thai",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q30-o1",
            "explanation": "Los cuatro grandes estilos tradicionales japoneses son Shotokan (Funakoshi), Shito-Ryu (Mabuni), Goju-Ryu (Miyagi) y Wado-Ryu (Otsuka).",
            "hint": "Los 4 estilos matrices de la WKF."
        },
        {
            "id": "e3k-q31",
            "type": "multiple_choice",
            "prompt": "31. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "options": [
                {
                    "id": "e3k-q31-o1",
                    "text": "GYAKU ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q31-o2",
                    "text": "YAMA ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q31-o3",
                    "text": "MOROTE UKE",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q31-o4",
                    "text": "MANJI UKE",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e3k-q31-o4",
            "explanation": "Manji-Uke: Bloqueo doble en 'vórtice' con Gedan Barai frontal y Jodan Uchi-Uke hacia atrás.",
            "hint": "Defensa doble característica de Heian Godan y Kanku Dai.",
            "image": "/images/didactic/exams/waza_manji_uke.png"
        },
        {
            "id": "e3k-q32",
            "type": "multiple_choice",
            "prompt": "32. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "options": [
                {
                    "id": "e3k-q32-o1",
                    "text": "MANJI UKE",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q32-o2",
                    "text": "OI ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q32-o3",
                    "text": "MAWASHI GERI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q32-o4",
                    "text": "MOROTE UKE",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e3k-q32-o4",
            "explanation": "Morote-Uke: Bloqueo medio reforzado con el otro puño apoyado en el antebrazo o codo ejecutor.",
            "hint": "Defensa reforzada a dos manos.",
            "image": "/images/didactic/exams/waza_morote_uke.png"
        },
        {
            "id": "e3k-q33",
            "type": "multiple_choice",
            "prompt": "33. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "options": [
                {
                    "id": "e3k-q33-o1",
                    "text": "YAMA ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q33-o2",
                    "text": "GYAKU ZUKI",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q33-o3",
                    "text": "OI ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q33-o4",
                    "text": "MOROTE UKE",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q33-o2",
            "explanation": "Gyaku-Zuki: Golpe de puño contrario a la pierna adelantada aprovechando la potente rotación de cadera.",
            "hint": "Golpe de puño inverso o contrario.",
            "image": "/images/didactic/exams/waza_gyaku_zuki.png"
        },
        {
            "id": "e3k-q34",
            "type": "multiple_choice",
            "prompt": "34. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "options": [
                {
                    "id": "e3k-q34-o1",
                    "text": "GYAKU ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q34-o2",
                    "text": "OI ZUKI",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q34-o3",
                    "text": "MAWASHI GERI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q34-o4",
                    "text": "MANJI UKE",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q34-o2",
            "explanation": "Oi-Zuki: Ataque directo de puño avanzando con el mismo brazo y pierna delantera.",
            "hint": "Golpe de puño en avance con el mismo lado.",
            "image": "/images/didactic/exams/waza_oi_zuki.png"
        },
        {
            "id": "e3k-q35",
            "type": "multiple_choice",
            "prompt": "35. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "options": [
                {
                    "id": "e3k-q35-o1",
                    "text": "MOROTE UKE",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q35-o2",
                    "text": "OI ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q35-o3",
                    "text": "YAMA ZUKI",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q35-o4",
                    "text": "MANJI UKE",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q35-o3",
            "explanation": "Yama-Zuki: Golpe simultáneo a dos alturas (U-zuki o golpe en montaña) característico de Bassai Dai.",
            "hint": "Golpe doble de puño en forma de montaña.",
            "image": "/images/didactic/exams/waza_yama_zuki.png"
        },
        {
            "id": "e3k-q36",
            "type": "multiple_choice",
            "prompt": "36. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "options": [
                {
                    "id": "e3k-q36-o1",
                    "text": "MAWASHI GERI",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q36-o2",
                    "text": "OI ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q36-o3",
                    "text": "GYAKU ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q36-o4",
                    "text": "MOROTE UKE",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q36-o1",
            "explanation": "Mawashi-Geri: Patada circular percutante con elevación de rodilla y rotación completa de la cadera de apoyo.",
            "hint": "Patada circular tradicional.",
            "image": "/images/didactic/exams/waza_mawashi_geri.png"
        },
        {
            "id": "e3k-q37",
            "type": "multiple_choice",
            "prompt": "37. DESARROLLO: KIME-WAZA: ¿En qué consiste biomecánicamente y cuáles son dos criterios fundamentales para calificarlo?",
            "description": "Biomecánica y concepto de Kime",
            "options": [
                {
                    "id": "e3k-q37-o1",
                    "text": "Mover los brazos a máxima velocidad sacrificando la posición de los pies y el equilibrio",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q37-o2",
                    "text": "Emitir un grito ensordecedor sin tensar los músculos ni fijar la articulación en el blanco",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q37-o3",
                    "text": "Empujar de forma continua al adversario con el peso del cuerpo hasta desplazarlo hacia atrás",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q37-o4",
                    "text": "Concentración explosiva instantánea de fuerza muscular, mental y respiratoria en el impacto con sólida estabilidad y Hikite",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e3k-q37-o4",
            "explanation": "Kime (決め) es el enfoque terminal: máxima aceleración y transmisión de energía cinética con fijación instantánea y retorno a Zanshin.",
            "hint": "Concentración instantánea de potencia y parada sólida."
        },
        {
            "id": "e3k-q38",
            "type": "multiple_choice",
            "prompt": "38. DESARROLLO: Los grandes maestros afirman que 'el Karate Do es un estilo de vida'. ¿Por qué esta afirmación es verdadera?",
            "description": "Filosofía del Budo en la vida",
            "options": [
                {
                    "id": "e3k-q38-o1",
                    "text": "Porque los valores de respeto, disciplina, paciencia y autocontrol forjados en el dojo se aplican en la vida familiar, laboral y social",
                    "isCorrect": true
                },
                {
                    "id": "e3k-q38-o2",
                    "text": "Porque entrena a la persona para resolver cualquier diferencia cotidiana mediante la confrontación física",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q38-o3",
                    "text": "Porque su único fin es ganar medallas en torneos y obtener compensaciones económicas",
                    "isCorrect": false
                },
                {
                    "id": "e3k-q38-o4",
                    "text": "Porque obliga al practicante a vivir aislado de la sociedad en un templo marcial",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e3k-q38-o1",
            "explanation": "El Karate-Do es una vía de autorrealización ética: la disciplina del cuerpo educa la mente para actuar con rectitud y serenidad ante los desafíos diarios.",
            "hint": "Valores aplicados permanentemente en la convivencia."
        }
    ]
};

// ====================================================================
// EXAMEN OFICIAL: 2° KYU A 1° KYU
// ====================================================================
export const EXAM_KYU_2_TO_1: BeltExamConfig = {
    "beltId": "kyu-2",
    "targetBeltId": "kyu-1",
    "beltName": "2° Kyu — Cinturón Café (2 Líneas)",
    "targetBeltName": "1° Kyu — Cinturón Café (1 Línea)",
    "targetBeltColor": "#451A03",
    "passingScore": 35,
    "xpReward": 400,
    "title": "Examen Oficial Escrito: 2° Kyu a 1° Kyu",
    "subtitle": "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo / ISKF",
    "description": "Examen oficial de ascenso de 2° Kyu a 1° Kyu de Kuma Sensei Dojo. Evaluación exhaustiva previa al Shodan: código Bushido, reglamento oficial WKF, identificación visual de katas y madurez marcial.",
    "questions": [
        {
            "id": "e2k-q1",
            "type": "multiple_choice",
            "prompt": "1. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'BUSHIDO'?",
            "description": "Código ético samurái",
            "options": [
                {
                    "id": "e2k-q1-o1",
                    "text": "El camino del guerrero",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q1-o2",
                    "text": "Cinta negra",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q1-o3",
                    "text": "Tabla para golpear",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q1-o4",
                    "text": "Kata obligatorio",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q1-o1",
            "explanation": "Bushido (武士道): Código moral y de honor que regía la vida y conducta de la casta samurái.",
            "hint": "La vía del honor del guerrero japonés."
        },
        {
            "id": "e2k-q2",
            "type": "multiple_choice",
            "prompt": "2. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHITEI KATA'?",
            "description": "Normativa de competición",
            "options": [
                {
                    "id": "e2k-q2-o1",
                    "text": "Kata libre favorito",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q2-o2",
                    "text": "Kata obligatorio de competición",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q2-o3",
                    "text": "El camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q2-o4",
                    "text": "Cinturón negro",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q2-o2",
            "explanation": "Shitei Kata (指定形) son los katas obligatorios reglamentarios en las primeras rondas de torneos.",
            "hint": "Katas designados oficialmente por sorteo o ronda obligatoria."
        },
        {
            "id": "e2k-q3",
            "type": "multiple_choice",
            "prompt": "3. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KARATEDO'?",
            "description": "Filosofía",
            "options": [
                {
                    "id": "e2k-q3-o1",
                    "text": "El camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q3-o2",
                    "text": "Matar de un golpe",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q3-o3",
                    "text": "Kata obligatorio",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q3-o4",
                    "text": "Camino de la mano vacía",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q3-o4",
            "explanation": "Karatedo (空手道) es la vía marcial de defensa con el cuerpo desarmado y el espíritu desprovisto de malicia.",
            "hint": "Vía de la mano sin armas."
        },
        {
            "id": "e2k-q4",
            "type": "multiple_choice",
            "prompt": "4. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'TOKUI KATA'?",
            "description": "Especialización técnica",
            "options": [
                {
                    "id": "e2k-q4-o1",
                    "text": "Tabla de golpeo",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q4-o2",
                    "text": "Kata favorito o de libre elección",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q4-o3",
                    "text": "El camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q4-o4",
                    "text": "Kata obligatorio",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q4-o2",
            "explanation": "Tokui Kata (得意形) es el kata de máxima maestría y predilección personal que el karateka escoge para finales.",
            "hint": "La forma predilecta del competidor."
        },
        {
            "id": "e2k-q5",
            "type": "multiple_choice",
            "prompt": "5. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'MAKIWARA'?",
            "description": "Acondicionamiento tradicional",
            "options": [
                {
                    "id": "e2k-q5-o1",
                    "text": "Camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q5-o2",
                    "text": "Meditación zen",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q5-o3",
                    "text": "Tabla para golpear y forjar los puños",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q5-o4",
                    "text": "Kata obligatorio",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q5-o3",
            "explanation": "Makiwara (巻藁) es el poste de madera tradicional almohadillado usado para acondicionar puños y afinar el impacto.",
            "hint": "Instrumento okinawense de golpeo."
        },
        {
            "id": "e2k-q6",
            "type": "multiple_choice",
            "prompt": "6. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'ZAZEN'?",
            "description": "Práctica zen",
            "options": [
                {
                    "id": "e2k-q6-o1",
                    "text": "Matar de un golpe",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q6-o2",
                    "text": "Meditación zen sentado",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q6-o3",
                    "text": "Corte del vientre",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q6-o4",
                    "text": "Cinturón negro",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q6-o2",
            "explanation": "Zazen (座禅) es la práctica de meditación sentada para alcanzar calma mental y presencia plena.",
            "hint": "Sentarse en quietud contemplativa."
        },
        {
            "id": "e2k-q7",
            "type": "multiple_choice",
            "prompt": "7. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'IPPON KEN'?",
            "description": "Armas corporales",
            "options": [
                {
                    "id": "e2k-q7-o1",
                    "text": "Patada de gato",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q7-o2",
                    "text": "Matar de un golpe",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q7-o3",
                    "text": "Puño con nudillo del dedo índice sobresaliente",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q7-o4",
                    "text": "Puño de martillo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q7-o3",
            "explanation": "Ippon-Ken (一本拳) concentra la fuerza en un único nudillo saliente para atacar puntos vitales.",
            "hint": "Puño de un solo nudillo prominente."
        },
        {
            "id": "e2k-q8",
            "type": "multiple_choice",
            "prompt": "8. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'IKKEN HISSATSU'?",
            "description": "Principio terminal",
            "options": [
                {
                    "id": "e2k-q8-o1",
                    "text": "Corte del vientre",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q8-o2",
                    "text": "Meditación zen",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q8-o3",
                    "text": "Entrenar juntos",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q8-o4",
                    "text": "Vencer o abatir de un solo golpe decisivo",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q8-o4",
            "explanation": "Ikken Hissatsu (一拳必殺): Máxima del Karate clásico que exige que cada técnica sea ejecutada con tal plenitud que decida el combate.",
            "hint": "Un golpe, victoria definitiva."
        },
        {
            "id": "e2k-q9",
            "type": "multiple_choice",
            "prompt": "9. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SEPPUKU'?",
            "description": "Tradición samurái",
            "options": [
                {
                    "id": "e2k-q9-o1",
                    "text": "Alojarse juntos",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q9-o2",
                    "text": "Matar de un golpe",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q9-o3",
                    "text": "Cinturón negro",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q9-o4",
                    "text": "Corte del vientre / Harakiri ritual",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q9-o4",
            "explanation": "Seppuku (切腹) era el suicidio ritual samurái para preservar el honor ante la derrota o deshonra.",
            "hint": "El ritual solemne de honor samurái."
        },
        {
            "id": "e2k-q10",
            "type": "multiple_choice",
            "prompt": "10. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'ZEN'?",
            "description": "Filosofía oriental",
            "options": [
                {
                    "id": "e2k-q10-o1",
                    "text": "Corte del vientre",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q10-o2",
                    "text": "Puño de hierro",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q10-o3",
                    "text": "Estado de concentración y vacío mental",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q10-o4",
                    "text": "Tabla de golpeo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q10-o3",
            "explanation": "Zen (禅) es la escuela budista que enfatiza la iluminación a través de la meditación y la acción directa sin apego.",
            "hint": "Serenidad y atención sin distracciones."
        },
        {
            "id": "e2k-q11",
            "type": "multiple_choice",
            "prompt": "11. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'DAN'?",
            "description": "Graduación avanzada",
            "options": [
                {
                    "id": "e2k-q11-o1",
                    "text": "Rango de grado de cinta negra",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q11-o2",
                    "text": "Cinta blanca",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q11-o3",
                    "text": "Kata obligatorio",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q11-o4",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q11-o1",
            "explanation": "Dan (段) designa los niveles de maestría a partir del cinturón negro (Shodan a Judan).",
            "hint": "Nivel de cinturón negro."
        },
        {
            "id": "e2k-q12",
            "type": "multiple_choice",
            "prompt": "12. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'GASSHUKU'?",
            "description": "Convivencia marcial",
            "options": [
                {
                    "id": "e2k-q12-o1",
                    "text": "Alojarse y entrenar juntos en concentración intensiva",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q12-o2",
                    "text": "Técnica decisiva",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q12-o3",
                    "text": "Cinturón negro",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q12-o4",
                    "text": "Corte del vientre",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q12-o1",
            "explanation": "Gasshuku (合宿) es el campamento intensivo donde maestros y alumnos conviven y entrenan bajo el mismo techo.",
            "hint": "Retiro o campamento colectivo de entrenamiento."
        },
        {
            "id": "e2k-q13",
            "type": "multiple_choice",
            "prompt": "13. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SAMURAI'?",
            "description": "Historia japonesa",
            "options": [
                {
                    "id": "e2k-q13-o1",
                    "text": "Monje pacífico",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q13-o2",
                    "text": "Árbitro deportivo",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q13-o3",
                    "text": "Campesino",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q13-o4",
                    "text": "Clase militar del Japón feudal",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q13-o4",
            "explanation": "Samurái (侍): Miembro de la nobleza militar del Japón feudal regido por la lealtad y el honor.",
            "hint": "El guerrero feudal japonés."
        },
        {
            "id": "e2k-q14",
            "type": "multiple_choice",
            "prompt": "14. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'TETSUI'?",
            "description": "Armas corporales",
            "options": [
                {
                    "id": "e2k-q14-o1",
                    "text": "Espíritu que perdura",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q14-o2",
                    "text": "Cinturón negro",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q14-o3",
                    "text": "Puño de un nudillo",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q14-o4",
                    "text": "Puño de martillo de hierro",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q14-o4",
            "explanation": "Tetsui (鉄槌) golpea con la base carnosa del puño cerrado simulando un martillo de hierro.",
            "hint": "Golpe con la base o canto del puño cerrado."
        },
        {
            "id": "e2k-q15",
            "type": "multiple_choice",
            "prompt": "15. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KIME-WAZA'?",
            "description": "Eficacia marcial",
            "options": [
                {
                    "id": "e2k-q15-o1",
                    "text": "Saludo formal",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q15-o2",
                    "text": "Vuelta completa",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q15-o3",
                    "text": "Técnica decisiva con máxima concentración de fuerza",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q15-o4",
                    "text": "Patada de gato",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q15-o3",
            "explanation": "Kime-waza (決め技) es la técnica ejecutada con enfoque terminal capaz de neutralizar la agresión.",
            "hint": "Técnica terminal y concluyente."
        },
        {
            "id": "e2k-q16",
            "type": "multiple_choice",
            "prompt": "16. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'ZANSHIN'?",
            "description": "Conciencia marcial",
            "options": [
                {
                    "id": "e2k-q16-o1",
                    "text": "Cinturón negro",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q16-o2",
                    "text": "Corte del vientre",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q16-o3",
                    "text": "Puño de martillo",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q16-o4",
                    "text": "El espíritu que perdura / Alerta continua post-técnica",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q16-o4",
            "explanation": "Zanshin (残心) es la actitud de calma y vigilancia ininterrumpida que se mantiene antes, durante y después del ataque.",
            "hint": "Mente atenta que no se relaja tras el golpe."
        },
        {
            "id": "e2k-q17",
            "type": "multiple_choice",
            "prompt": "17. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'MAWATTE'?",
            "description": "Comandos de tatami",
            "options": [
                {
                    "id": "e2k-q17-o1",
                    "text": "Sentarse",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q17-o2",
                    "text": "Giro / Vuelta",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q17-o3",
                    "text": "Detenerse",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q17-o4",
                    "text": "Avanzar",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q17-o2",
            "explanation": "Mawatte (回って) es la orden para girar o cambiar de frente en el Kihon y los Katas.",
            "hint": "Comando de giro o media vuelta."
        },
        {
            "id": "e2k-q18",
            "type": "multiple_choice",
            "prompt": "18. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KURO OBI'?",
            "description": "Indumentaria",
            "options": [
                {
                    "id": "e2k-q18-o1",
                    "text": "Cinturón negro",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q18-o2",
                    "text": "Uniforme negro",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q18-o3",
                    "text": "Cinturón blanco",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q18-o4",
                    "text": "Cinturón café",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q18-o1",
            "explanation": "Kuro Obi (黒帯) es el cinturón negro que simboliza la consagración de los fundamentos.",
            "hint": "La cinta negra de maestría."
        },
        {
            "id": "e2k-q19",
            "type": "multiple_choice",
            "prompt": "19. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'NEKO'?",
            "description": "Posiciones zoomorfas",
            "options": [
                {
                    "id": "e2k-q19-o1",
                    "text": "Gato (como en Neko-ashi-dachi)",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q19-o2",
                    "text": "Águila",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q19-o3",
                    "text": "Dragón",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q19-o4",
                    "text": "Tigre",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q19-o1",
            "explanation": "Neko (猫) significa gato; Neko-ashi-dachi es la postura elástica del pie de gato con el 90% del peso en la pierna trasera.",
            "hint": "El felino ágil que inspira la postura de guardia corta."
        },
        {
            "id": "e2k-q20",
            "type": "multiple_choice",
            "prompt": "20. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'HITOSU'?",
            "description": "Estructura del Dojo Kun",
            "options": [
                {
                    "id": "e2k-q20-o1",
                    "text": "Último",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q20-o2",
                    "text": "Tercero",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q20-o3",
                    "text": "Primero / Uno (lema que encabeza cada precepto)",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q20-o4",
                    "text": "Segundo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q20-o3",
            "explanation": "Hitosu (一つ) precede cada uno de los 5 preceptos del Dojo Kun para indicar que todos tienen la misma importancia primordial.",
            "hint": "La palabra con la que inicia cada frase del Dojo Kun."
        },
        {
            "id": "e2k-q21",
            "type": "multiple_choice",
            "prompt": "21. COMPLETE: ¿Cuál es el significado integral del término 'KARATEDO SHOTOKAN'?",
            "description": "Fundamento de la escuela",
            "options": [
                {
                    "id": "e2k-q21-o1",
                    "text": "El camino de la mano vacía de la escuela de las ondas de los pinos (Shoto-Kan)",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q21-o2",
                    "text": "El sendero samurái del sable de bambú y la armadura",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q21-o3",
                    "text": "El combate moderno de defensa extrema sin reglas deportivas",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q21-o4",
                    "text": "El arte de los cien golpes destructivos de la guardia imperial",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q21-o1",
            "explanation": "Sintetiza la disciplina ética del vacío físico y mental enseñada en la escuela fundada por el Maestro Gichin Funakoshi.",
            "hint": "Mano vacía y escuela de Shoto."
        },
        {
            "id": "e2k-q22",
            "type": "multiple_choice",
            "prompt": "22. COMPLETE: ¿Cuál es el significado marcial y las características del Kata 'HANGETSU'?",
            "description": "Katas avanzados de respiración",
            "options": [
                {
                    "id": "e2k-q22-o1",
                    "text": "Media luna (desplazamientos semicirculares, postura Hangetsu-dachi y respiración profunda Ibuki)",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q22-o2",
                    "text": "El vuelo del halcón con saltos acrobáticos de alta velocidad",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q22-o3",
                    "text": "La tormenta de truenos con rápidos golpes de codo lineales",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q22-o4",
                    "text": "La flor de loto flotando serenamente en aguas tranquilas",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q22-o1",
            "explanation": "Hangetsu (半月) es de linaje Naha-Te; enfatiza la tensión dinámica isométrica, desplazamientos circulares y respiración ventral profunda.",
            "hint": "Pasos semicirculares de media luna."
        },
        {
            "id": "e2k-q23",
            "type": "multiple_choice",
            "prompt": "23. COMPLETE: ¿Cuál es el significado del nombre y saludo inicial del Kata 'JION'?",
            "description": "Katas de linaje Tomari-Te",
            "options": [
                {
                    "id": "e2k-q23-o1",
                    "text": "El vuelo veloz de la golondrina al cambiar de dirección",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q23-o2",
                    "text": "Ataque implacable de furia frontal para romper la muralla",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q23-o3",
                    "text": "El jinete a caballo combatiendo con armas ocultas",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q23-o4",
                    "text": "Amor y bondad (derivado del templo budista Jion-ji, inicia con saludo de respeto Ming / Jiai no kamae)",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q23-o4",
            "explanation": "Jion (慈恩) proviene de Tomari-Te; su saludo con mano derecha empuñada cubierta por la izquierda expresa compasión y benevolencia.",
            "hint": "Amor, bondad y el templo budista Jion."
        },
        {
            "id": "e2k-q24",
            "type": "multiple_choice",
            "prompt": "24. COMPLETE: ¿Quién fundó y lideró históricamente la federación ISKF (International Shotokan Karate Federation)?",
            "description": "Liderazgo del Karate tradicional",
            "options": [
                {
                    "id": "e2k-q24-o1",
                    "text": "Maestro Masatoshi Nakayama",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q24-o2",
                    "text": "Maestro Tsutomu Ohshima",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q24-o3",
                    "text": "Maestro Teruyuki Okazaki (10° Dan)",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q24-o4",
                    "text": "Maestro Hirokazu Kanazawa",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q24-o3",
            "explanation": "La ISKF es una de las organizaciones de Karate Shotokan tradicional de mayor trayectoria y prestigio técnico en el mundo.",
            "hint": "Shihan Teruyuki Okazaki."
        },
        {
            "id": "e2k-q25",
            "type": "multiple_choice",
            "prompt": "25. COMPLETE: ¿Cuál es la definición técnica y la norma de seguridad en 'JIYU KUMITE'?",
            "description": "Modalidades de combate",
            "options": [
                {
                    "id": "e2k-q25-o1",
                    "text": "Pelea sin límites donde se premia noquear al compañero de dojo",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q25-o2",
                    "text": "Combate libre sin técnicas predeterminadas pero con control total de impacto (Sun-dome)",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q25-o3",
                    "text": "Combate a cinco pasos pautados sin posibilidad de variar el ataque",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q25-o4",
                    "text": "Secuencia coreografiada de exhibición donde nadie intenta puntuar",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q25-o2",
            "explanation": "Jiyu Kumite evalúa timing, lectura de intenciones, anticipación y control absoluto para frenar el impacto antes de lesionar.",
            "hint": "Libre y dinámico con control riguroso."
        },
        {
            "id": "e2k-q26",
            "type": "multiple_choice",
            "prompt": "26. COMPLETE: ¿Cuál es el significado y la función del concepto marcial 'CHAKUGAN'?",
            "description": "Principios de combate",
            "options": [
                {
                    "id": "e2k-q26-o1",
                    "text": "Rotación de cadera para duplicar la potencia del impacto",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q26-o2",
                    "text": "Fijación y enfoque de la mirada (contacto visual permanente abarcando todo el cuerpo del rival)",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q26-o3",
                    "text": "Retracción rápida del puño hacia la cadera en el Hikite",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q26-o4",
                    "text": "Grito concentrado para desestabilizar la mente del rival",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q26-o2",
            "explanation": "Chakugan (着眼) enseña a mirar fijamente a los ojos del adversario con visión panorámica sin desviar la vista hacia las extremidades.",
            "hint": "La mirada atenta que no pestañea."
        },
        {
            "id": "e2k-q27",
            "type": "multiple_choice",
            "prompt": "27. COMPLETE: ¿Cuáles son los 4 estilos oficiales tradicionales de Karate Do reconocidos por la WKF?",
            "description": "Estilos mayores oficiales",
            "options": [
                {
                    "id": "e2k-q27-o1",
                    "text": "Shito-Ryu, Tang Soo Do, Hapkido y Krav Maga",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q27-o2",
                    "text": "Goju-Ryu, Taekwondo, Kenpo y Kickboxing",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q27-o3",
                    "text": "Shotokan, Shito-Ryu, Goju-Ryu y Wado-Ryu",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q27-o4",
                    "text": "Shotokan, Uechi-Ryu, Kyokushinkai y Shorin-Ryu",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q27-o3",
            "explanation": "Son los 4 estilos oficiales universales que conforman el marco técnico y competitivo mundial avalado por la WKF.",
            "hint": "Shotokan, Shito, Goju y Wado."
        },
        {
            "id": "e2k-q28",
            "type": "multiple_choice",
            "prompt": "28. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "options": [
                {
                    "id": "e2k-q28-o1",
                    "text": "TEKKI NIDAN",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q28-o2",
                    "text": "JION",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q28-o3",
                    "text": "HANGETSU",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q28-o4",
                    "text": "KANKU DAI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q28-o3",
            "explanation": "Hangetsu: Paso semicircular característico con postura Hangetsu-dachi y respiración concentrada.",
            "hint": "Katas de pasos semicirculares de media luna.",
            "image": "/images/didactic/exams/kata_hangetsu.png"
        },
        {
            "id": "e2k-q29",
            "type": "multiple_choice",
            "prompt": "29. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "options": [
                {
                    "id": "e2k-q29-o1",
                    "text": "JION",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q29-o2",
                    "text": "HANGETSU",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q29-o3",
                    "text": "ENPI",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q29-o4",
                    "text": "BASSAI DAI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q29-o1",
            "explanation": "Jion: Saludo budista inicial de puño cubierto (Jiai no kamae) y desplazamientos firmes en Kiba y Zenkutsu.",
            "hint": "Katas del templo Jion con saludo inicial de puño cubierto.",
            "image": "/images/didactic/exams/kata_jion.png"
        },
        {
            "id": "e2k-q30",
            "type": "multiple_choice",
            "prompt": "30. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "options": [
                {
                    "id": "e2k-q30-o1",
                    "text": "KANKU DAI",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q30-o2",
                    "text": "TEKKI NIDAN",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q30-o3",
                    "text": "ENPI",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q30-o4",
                    "text": "BASSAI DAI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q30-o1",
            "explanation": "Kanku Dai: Gesto majestuoso de apertura mirando el cielo a través del triángulo de las manos.",
            "hint": "Apertura contemplando el cielo.",
            "image": "/images/didactic/exams/kata_kanku_dai.png"
        },
        {
            "id": "e2k-q31",
            "type": "multiple_choice",
            "prompt": "31. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "options": [
                {
                    "id": "e2k-q31-o1",
                    "text": "TEKKI NIDAN",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q31-o2",
                    "text": "HANGETSU",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q31-o3",
                    "text": "ENPI",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q31-o4",
                    "text": "JION",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q31-o1",
            "explanation": "Tekki Nidan: Guardia característica con codo arriba y trabajo de Kiba-dachi sobre línea lateral.",
            "hint": "Jinete de hierro nivel 2.",
            "image": "/images/didactic/exams/kata_tekki_nidan.png"
        },
        {
            "id": "e2k-q32",
            "type": "multiple_choice",
            "prompt": "32. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "options": [
                {
                    "id": "e2k-q32-o1",
                    "text": "JION",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q32-o2",
                    "text": "BASSAI DAI",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q32-o3",
                    "text": "KANKU DAI",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q32-o4",
                    "text": "ENPI",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q32-o4",
            "explanation": "Enpi: Movimiento ágil de elevación y descenso súbito característico de la golondrina.",
            "hint": "El vuelo de la golondrina.",
            "image": "/images/didactic/exams/kata_enpi.png"
        },
        {
            "id": "e2k-q33",
            "type": "multiple_choice",
            "prompt": "33. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "options": [
                {
                    "id": "e2k-q33-o1",
                    "text": "HANGETSU",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q33-o2",
                    "text": "TEKKI NIDAN",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q33-o3",
                    "text": "ENPI",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q33-o4",
                    "text": "BASSAI DAI",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q33-o4",
            "explanation": "Bassai Dai: Potente avance de ruptura con Morote Tsukami-Uke y Yama-Zuki penetrando la fortaleza.",
            "hint": "Penetrar en la fortaleza con máxima fuerza.",
            "image": "/images/didactic/exams/kata_bassai_dai.png"
        },
        {
            "id": "e2k-q34",
            "type": "multiple_choice",
            "prompt": "34. WKF: Según el reglamento oficial de competición, ¿cuántos puntos otorga el 'YUKO'?",
            "description": "Puntuación de Kumite WKF",
            "options": [
                {
                    "id": "e2k-q34-o1",
                    "text": "1 Punto",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q34-o2",
                    "text": "Descalificación",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q34-o3",
                    "text": "3 Puntos",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q34-o4",
                    "text": "2 Puntos",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q34-o1",
            "explanation": "Yuko (有効): 1 punto técnico otorgado por Chudan o Jodan Tsuki.",
            "hint": "Un punto técnico."
        },
        {
            "id": "e2k-q35",
            "type": "multiple_choice",
            "prompt": "35. WKF: Según el reglamento oficial de competición, ¿cuántos puntos otorga el 'WAZA-ARI'?",
            "description": "Puntuación de Kumite WKF",
            "options": [
                {
                    "id": "e2k-q35-o1",
                    "text": "2 Puntos",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q35-o2",
                    "text": "3 Puntos",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q35-o3",
                    "text": "1 Punto",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q35-o4",
                    "text": "4 Puntos",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q35-o1",
            "explanation": "Waza-ari (技あり): 2 puntos técnicos otorgados por patadas al cuerpo (Chudan Geri).",
            "hint": "Dos puntos técnicos."
        },
        {
            "id": "e2k-q36",
            "type": "multiple_choice",
            "prompt": "36. WKF: Según el reglamento oficial de competición, ¿cuántos puntos otorga el 'IPPON'?",
            "description": "Puntuación de Kumite WKF",
            "options": [
                {
                    "id": "e2k-q36-o1",
                    "text": "2 Puntos",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q36-o2",
                    "text": "1 Punto",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q36-o3",
                    "text": "Medio Punto",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q36-o4",
                    "text": "3 Puntos",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q36-o4",
            "explanation": "Ippon (一本): 3 puntos técnicos otorgados por patadas a la cabeza (Jodan Geri) o derribo seguido de golpe puntuable.",
            "hint": "Máxima puntuación técnica (3 puntos)."
        },
        {
            "id": "e2k-q37",
            "type": "multiple_choice",
            "prompt": "37. WKF: Según el reglamento oficial, ¿cómo se denomina el piso o área de combate?",
            "description": "Reglamento del tatami",
            "options": [
                {
                    "id": "e2k-q37-o1",
                    "text": "KAMAE",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q37-o2",
                    "text": "ENBUSEN",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q37-o3",
                    "text": "DOJO",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q37-o4",
                    "text": "TATAMI",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q37-o4",
            "explanation": "El Tatami oficial de competición WKF tiene 8x8 metros de área de combate más zona de seguridad perimetral.",
            "hint": "Superficie de colchonetas reglamentarias."
        },
        {
            "id": "e2k-q38",
            "type": "multiple_choice",
            "prompt": "38. WKF: En el arbitraje oficial WKF, ¿qué designa el término 'AKA'?",
            "description": "Identificación de competidores",
            "options": [
                {
                    "id": "e2k-q38-o1",
                    "text": "Rojo (competidor del lado rojo)",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q38-o2",
                    "text": "Azul",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q38-o3",
                    "text": "Empate",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q38-o4",
                    "text": "Ganador",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q38-o1",
            "explanation": "Aka (赤) es el competidor que porta cinturón y protecciones rojas y se posiciona a la derecha del árbitro.",
            "hint": "Color rojo en japonés."
        },
        {
            "id": "e2k-q39",
            "type": "multiple_choice",
            "prompt": "39. WKF: En el arbitraje oficial WKF, ¿qué designa el término 'AO'?",
            "description": "Identificación de competidores",
            "options": [
                {
                    "id": "e2k-q39-o1",
                    "text": "Empate",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q39-o2",
                    "text": "Azul (competidor del lado azul)",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q39-o3",
                    "text": "Rojo",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q39-o4",
                    "text": "Piso",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q39-o2",
            "explanation": "Ao (青) es el competidor que porta cinturón y protecciones azules y se posiciona a la izquierda del árbitro.",
            "hint": "Color azul en japonés."
        },
        {
            "id": "e2k-q40",
            "type": "multiple_choice",
            "prompt": "40. WKF: ¿Cuál es la señal arbitral utilizada para reanudar el combate suspendido?",
            "description": "Comandos del réferi",
            "options": [
                {
                    "id": "e2k-q40-o1",
                    "text": "HANTEI",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q40-o2",
                    "text": "SEIRETSU",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q40-o3",
                    "text": "YAME",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q40-o4",
                    "text": "TSUZUKETE (Hajime)",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q40-o4",
            "explanation": "Tsuzukete (続けて) es la orden para continuar la acción; el réferi puede ordenar 'Tsuzukete Hajime'.",
            "hint": "¡Continuar!"
        },
        {
            "id": "e2k-q41",
            "type": "multiple_choice",
            "prompt": "41. WKF: ¿Cuál es el comando utilizado por el árbitro central para iniciar el combate?",
            "description": "Comandos del réferi",
            "options": [
                {
                    "id": "e2k-q41-o1",
                    "text": "KIRITSU",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q41-o2",
                    "text": "YAME",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q41-o3",
                    "text": "HANTEI",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q41-o4",
                    "text": "HAJIME",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q41-o4",
            "explanation": "Hajime (始め) marca el inicio de las acciones.",
            "hint": "Comenzar."
        },
        {
            "id": "e2k-q42",
            "type": "multiple_choice",
            "prompt": "42. WKF: ¿Cómo se denomina el procedimiento en que los jueces declaran el resultado por decisión?",
            "description": "Veredicto arbitral",
            "options": [
                {
                    "id": "e2k-q42-o1",
                    "text": "YAME",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q42-o2",
                    "text": "KIRITSU",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q42-o3",
                    "text": "TSUZUKETE",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q42-o4",
                    "text": "HANTEI / NO KACHI",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "e2k-q42-o4",
            "explanation": "Hantei (判定) es la consulta arbitral por banderas para definir al ganador (Aka/Ao no Kachi).",
            "hint": "Decisión y declaración de victoria."
        },
        {
            "id": "e2k-q43",
            "type": "multiple_choice",
            "prompt": "43. DESARROLLO: En el arbitraje oficial WKF, ¿cuáles son los criterios fundamentales para calificar Kumite y Kata?",
            "description": "Criterios arbitrales oficiales",
            "options": [
                {
                    "id": "e2k-q43-o1",
                    "text": "En Kumite: causar daño evidente al rival; en Kata: incluir saltos acrobáticos no tradicionales",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q43-o2",
                    "text": "En Kumite: derribos con sumisiones en el suelo; en Kata: el color y brillo del karategi",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q43-o3",
                    "text": "En Kumite: buena forma, control riguroso y Maai; en Kata: conformidad biomecánica de estilo, ritmo, Kime y Zanshin",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q43-o4",
                    "text": "En Kumite: quién grite más fuerte durante el asalto; en Kata: quién termine en menos tiempo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q43-o3",
            "explanation": "En Kumite prima la precisión técnica sin causar daño (Sun-dome); en Kata se exige fidelidad biomecánica al estilo con potencia y estabilidad.",
            "hint": "Forma y control en Kumite; conformidad biomecánica en Kata."
        },
        {
            "id": "e2k-q44",
            "type": "multiple_choice",
            "prompt": "44. DESARROLLO: Para un aspirante a Cinta Negra, ¿cuál es el significado formativo de alcanzar el grado de Café 2° Kyu?",
            "description": "Madurez marcial del cinturón café",
            "options": [
                {
                    "id": "e2k-q44-o1",
                    "text": "Considerarse un maestro acabado y eximirse de practicar los fundamentos básicos (Kihon)",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q44-o2",
                    "text": "Enfocarse únicamente en ganar medallas deportivas descuidando los valores éticos del Budo",
                    "isCorrect": false
                },
                {
                    "id": "e2k-q44-o3",
                    "text": "Asumir mayor responsabilidad moral, ser modelo de humildad y perseverancia para los novatos y comprender que el camino apenas comienza",
                    "isCorrect": true
                },
                {
                    "id": "e2k-q44-o4",
                    "text": "Sentirse superior a los demás compañeros y exigir privilegios especiales dentro del dojo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "e2k-q44-o3",
            "explanation": "El grado café avanzado demanda madurez, entrega al dojo, respeto inquebrantable a las enseñanzas del Sensei y temple moral.",
            "hint": "Humildad, ejemplo y entendimiento de que el camino apenas comienza."
        }
    ]
};

export const ADVANCED_BELT_EXAMS: Record<string, BeltExamConfig> = {
    "kyu-5": EXAM_KYU_5_TO_4,
    "kyu-4": EXAM_KYU_4_TO_3,
    "kyu-3": EXAM_KYU_3_TO_2,
    "kyu-2": EXAM_KYU_2_TO_1
};

export function getAdvancedBeltExam(beltId: string): BeltExamConfig | undefined {
    return ADVANCED_BELT_EXAMS[beltId];
}

export function hasAdvancedBeltExam(beltId: string): boolean {
    return Boolean(ADVANCED_BELT_EXAMS[beltId]);
}
