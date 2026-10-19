import { BeltExamConfig } from "./beltExamData";

// ====================================================================
// EXAMEN OFICIAL: 5° KYU A 4° KYU (MORADO A MORADO BLANCO)
// ====================================================================
export const EXAM_KYU_5_TO_4: BeltExamConfig = {
    "beltId": "kyu-5",
    "targetBeltId": "kyu-4",
    "beltName": "Cinturón Morado (5° Kyu)",
    "targetBeltName": "Cinturón Morado con Blanco (4° Kyu)",
    "targetBeltColor": "#9333EA",
    "passingScore": 7,
    "xpReward": 320,
    "title": "Examen de Ascenso a Cinturón Morado con Blanco (4° Kyu)",
    "subtitle": "Tribunal Examinador Oficial de Grado • Kuma Sensei Dojo",
    "description": "Evaluación de transición hacia los rangos superiores: combinaciones Renraku-Waza, Heian Godan, salto en Kosa-dachi y principios de Hikite.",
    "questions": [
        {
            "id": "exam-k5-q1",
            "type": "multiple_choice",
            "prompt": "1. HISTORIA: ¿Quién fue el creador pedagógico de la serie de Katas Heian (Pinan)?",
            "description": "Maestro reformador de Okinawa que introdujo el Karate en las escuelas públicas.",
            "options": [
                {
                    "id": "o1",
                    "text": "Maestro Yasutsune (Anko) Itosu (1831–1915)",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "El guerrero Miyamoto Musashi en Kioto",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Jigoro Kano en el Kodokan",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "El monje Bodhidharma en Henan",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Anko Itosu sintetizó las formas antiguas en 5 katas educativos para enseñar la autoprotección y la paz."
        },
        {
            "id": "exam-k5-q2",
            "type": "multiple_choice",
            "prompt": "2. FILOSOFÍA: ¿Qué significado tiene el nombre de los Katas 'HEIAN'?",
            "description": "El propósito espiritual detrás de los 5 katas básicos.",
            "options": [
                {
                    "id": "o3",
                    "text": "Fuerza bruta sobre el débil",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Velocidad de relámpago",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Paz, tranquilidad y mente en calma",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Guerra y destrucción total",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Heian (Hei = calma, An = paz) simboliza serenidad interior para no recurrir a la violencia."
        },
        {
            "id": "exam-k5-q3",
            "type": "multiple_choice",
            "prompt": "3. BIOMECÁNICA: En el salto característico de Heian Godan, ¿en qué postura se aterriza para amortiguar el impacto?",
            "description": "Postura de cruce de piernas sobre los metatarsos.",
            "options": [
                {
                    "id": "o3",
                    "text": "Kiba-Dachi",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Heiko-Dachi",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Zenkutsu-Dachi",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Kosa-Dachi (postura de piernas cruzadas)",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kosa-dachi absorbe la energía cinética del salto flexionando ambas rodillas y bajando el centro de gravedad."
        }
    ]
};

// ====================================================================
// EXAMEN OFICIAL: 4° KYU A 3° KYU (MORADO CON BLANCO A CAFÉ 3 LÍNEAS)
// Fuente Oficial: "I EXAMEN ESCRITO DE 4 KYU A 3 KYU.pdf" (38 Preguntas)
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
    "description": "Evaluación oficial canónica de ascenso a Cinturón Café: Asocie de terminología marcial, Complete técnico/histórico escrito, reconocimiento visual de Dachi-waza y ensayo formativo de Budo.",
    "questions": [
        {
            "id": "e4k-q1",
            "type": "multiple_choice",
            "prompt": "1. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'SHIHAN'?",
            "description": "Jerarquía marcial",
            "options": [
                {
                    "id": "o4",
                    "text": "Ponerse de pie",
                    "isCorrect": false
                },
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
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Ponerse de pie",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Maestro de un rango superior",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "De menor antigüedad",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Detenerse",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
            "id": "e4k-q4",
            "type": "multiple_choice",
            "prompt": "4. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'KIRITSU'?",
            "description": "Comandos del tatami",
            "options": [
                {
                    "id": "o1",
                    "text": "Ponerse de pie",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Maestro de rango superior",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Detenerse",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                },
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
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Forma",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Vacío",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Mano",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Saludo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Izquierda",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Atrás",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Adelante",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Derecha",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Pelea",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Saludo / Cortesía",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Victoria",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Desplazamiento",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Cinturón",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Forma",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Fuerza bruta",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Combate libre",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Camino",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Lleno",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Mano",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Vacío",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Templo Shaolin",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Escuela de Shoto",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Escuela de la fuerza",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Castillo de Shuri",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Gimnasio deportivo",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Sala de descanso",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Patio de armas",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Lugar del camino",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Fundamento básico",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Combate final",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Forma artística",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Meditación",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Acostarse",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Estar de pie",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Caminar despacio",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Sentarse con la espalda erguida",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Grito de combate",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Meditación",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Calentamiento muscular",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Flexión de brazos",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Técnica física",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Competencia",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Camino o vía de vida",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Victoria",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Orden de atacar",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Palabra de palabras / cortesía y perseverancia",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Grito de enojo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Despedida final",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Estudiante novato",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Árbitro lateral",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Compañero de fila",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Instructor / Maestro ('El nacido antes')",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Uniforme",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Zapatos",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Protector de puño",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Cinturón",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Público espectador",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "De mayor antigüedad",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Cinturón blanco nuevo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Sempai (先輩) es el alumno más antiguo o avanzado respecto a otro, con la responsabilidad de ser ejemplo.",
            "hint": "El estudiante mayor o más veterano."
        },
        {
            "id": "e4k-q21",
            "type": "written",
            "prompt": "21. COMPLETE: Escriba el significado de 'KARATEDO':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "mano vacia",
                "camino de la mano vacia",
                "mano vacía",
                "camino mano vacia"
            ],
            "sampleAnswer": "El camino de la mano vacía (Kara = Vacío, Te = Mano, Do = Camino o senda de vida).",
            "isEssay": false,
            "explanation": "Karate-Do (空手道): 'Kara' (vacío de armas y libre de ego), 'Te' (mano) y 'Do' (camino ético y formativo de vida).",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e4k-q22",
            "type": "written",
            "prompt": "22. COMPLETE: Escriba el significado del Kata 'BASSAI DAI':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "penetrar en la fortaleza",
                "romper la fortaleza",
                "penetrar la fortaleza",
                "romper fortaleza",
                "penetrar fortaleza",
                "atravesar la fortaleza",
                "quebrar la fortaleza"
            ],
            "sampleAnswer": "Penetrar en la fortaleza (Dai = Grande o mayor).",
            "isEssay": false,
            "explanation": "Bassai (披塞) simboliza la potencia, coraje y resolución implacable para penetrar o romper una fortaleza enemiga.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e4k-q23",
            "type": "written",
            "prompt": "23. COMPLETE: Escriba el significado del Kata 'KANKU DAI':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "mirar al cielo",
                "mirando al cielo",
                "contemplar el cielo",
                "observar el cielo",
                "mirar cielo",
                "mirar el cielo"
            ],
            "sampleAnswer": "Mirar hacia el cielo (Dai = Grande).",
            "isEssay": false,
            "explanation": "Kanku (観空): 'Kan' (mirar/observar) y 'Ku' (cielo/vacío/universo), evocado en su postura inicial de manos trianguladas elevadas al firmamento.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e4k-q24",
            "type": "written",
            "prompt": "24. COMPLETE: Escriba una de las 5 oraciones oficiales del 'DOJO KUN':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "perfeccionar",
                "caracter",
                "leal",
                "fidelidad",
                "constante",
                "esfuerzo",
                "respetar",
                "respeto",
                "violentos",
                "violencia",
                "abstenerse",
                "jinkaku",
                "makoto",
                "doryoku",
                "reigi",
                "keki"
            ],
            "sampleAnswer": "Cualquiera de los 5 preceptos: 'Intentar perfeccionar el carácter' (Jinkaku kansei ni tsutomuru koto), 'Ser leal', 'Ser constante', 'Respetar a los demás', o 'Abstenerse de comportamientos violentos'.",
            "isEssay": false,
            "explanation": "El Dojo Kun son los cinco principios éticos proclamados por Sakukawa y Funakoshi para cultivar virtudes en el karateka.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e4k-q25",
            "type": "written",
            "prompt": "25. COMPLETE: ¿Cuántos Katas oficiales tiene el estilo Shotokan?",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "26",
                "veintiseis",
                "veintiséis"
            ],
            "sampleAnswer": "26 Katas oficiales.",
            "isEssay": false,
            "explanation": "El canon tradicional Shotokan JKA/WKF consta exactamente de 26 katas (Heian 1-5, Tekki 1-3, Bassai Dai/Sho, Kanku Dai/Sho, Jion, Enpi, Hangetsu, Jitte, Gankaku, Kanku Sho, Chinte, Sochin, Meikyo, Jiin, Gojushiho Dai/Sho, Nijushiho, Wankan y Unsu).",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e4k-q26",
            "type": "written",
            "prompt": "26. COMPLETE: Escriba el nombre del Padre Fundador del estilo Shotokan:",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "gichin funakoshi",
                "funakoshi",
                "maestro funakoshi",
                "gichin"
            ],
            "sampleAnswer": "Maestro Gichin Funakoshi (1868–1957).",
            "isEssay": false,
            "explanation": "El Maestro Gichin Funakoshi es universalmente reverenciado como el padre del Karate-Do moderno por difundirlo desde Okinawa a Japón continental y al mundo.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e4k-q27",
            "type": "written",
            "prompt": "27. COMPLETE: Escriba el origen geográfico e histórico del Karate Do Shotokan:",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "okinawa",
                "japon",
                "isla de okinawa",
                "okinawa japon",
                "shuri"
            ],
            "sampleAnswer": "Isla de Okinawa (Reino de Ryukyu, Japón).",
            "isEssay": false,
            "explanation": "El Karate se gestó en Okinawa por la confluencia del Te autóctono con el Quanfa chino de Fujian, antes de su establecimiento en Tokio en los años 1920.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e4k-q28",
            "type": "written",
            "prompt": "28. COMPLETE: Escriba el significado de 'JIYU IPPON KUMITE':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "semi libre",
                "semi-libre",
                "un paso",
                "ataque anunciado",
                "un solo ataque",
                "libre a un paso",
                "combate semi libre"
            ],
            "sampleAnswer": "Combate semi-libre a un solo ataque predeterminado y anunciado.",
            "isEssay": false,
            "explanation": "Jiyu Ippon Kumite combina la distancia dinámica y movimiento libre de combate con un ataque declarado a máxima potencia y control.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e4k-q29",
            "type": "written",
            "prompt": "29. COMPLETE: Escriba una de las áreas técnicas en las que se divide el Kihon:",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "posiciones",
                "dachi",
                "bloqueos",
                "defensas",
                "uke",
                "golpes",
                "tsuki",
                "zuki",
                "patadas",
                "geri",
                "uchi",
                "kihon ido",
                "desplazamiento",
                "desplazamientos"
            ],
            "sampleAnswer": "Dachi (posiciones), Uke (bloqueos/defensas), Tsuki (ataques de puño frontal), Uchi (golpes indirectos) o Geri (patadas).",
            "isEssay": false,
            "explanation": "El Kihon se subdivide en posiciones fundamentales (Dachi-waza), defensas (Uke-waza), ataques directos (Tsuki-waza), golpes de percusión (Uchi-waza) y patadas (Geri-waza).",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e4k-q30",
            "type": "written",
            "prompt": "30. COMPLETE: Escriba el nombre en japonés del uniforme de Karate Do:",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "karategi",
                "gi",
                "dogi",
                "keikogi"
            ],
            "sampleAnswer": "Karategi (o simplemente Gi / Dogi).",
            "isEssay": false,
            "explanation": "Karategi (空手着) es el uniforme de lona blanca compuesto por chaqueta (Uwagi), pantalón (Zubon) y cinturón (Obi).",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e4k-q31",
            "type": "multiple_choice",
            "prompt": "31. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "image": "/images/didactic/exams/dachi_heisoku.png",
            "options": [
                {
                    "id": "o2",
                    "text": "KIBA DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "HEISOKU DACHI",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "ZENKUTSU DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Heisoku-dachi: Postura con pies juntos en paralelo tocándose por completo bordes internos y talones.",
            "hint": "Pies juntos y paralelos."
        },
        {
            "id": "e4k-q32",
            "type": "multiple_choice",
            "prompt": "32. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "image": "/images/didactic/exams/dachi_kiba.png",
            "options": [
                {
                    "id": "o3",
                    "text": "YOI DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "HEISOKU DACHI",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "KIBA DACHI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "MUSUBI DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kiba-dachi: Postura del jinete con pies paralelos, rodillas abiertas hacia afuera y peso 50/50.",
            "hint": "Postura del jinete."
        },
        {
            "id": "e4k-q33",
            "type": "multiple_choice",
            "prompt": "33. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "image": "/images/didactic/exams/dachi_kokutsu.png",
            "options": [
                {
                    "id": "o1",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": true
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
                },
                {
                    "id": "o2",
                    "text": "ZENKUTSU DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kokutsu-dachi: Postura atrasada con el 70% del peso en la pierna trasera y 30% en la delantera.",
            "hint": "Mayoría del peso en la pierna de atrás."
        },
        {
            "id": "e4k-q34",
            "type": "multiple_choice",
            "prompt": "34. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "image": "/images/didactic/exams/dachi_musubi.png",
            "options": [
                {
                    "id": "o4",
                    "text": "KIBA DACHI",
                    "isCorrect": false
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
                    "id": "o1",
                    "text": "MUSUBI DACHI",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Musubi-dachi: Postura de pie y erguido para saludo; talones juntos y puntas de los pies abiertas a 45°-60°.",
            "hint": "Talones juntos y puntas abiertas para saludar."
        },
        {
            "id": "e4k-q35",
            "type": "multiple_choice",
            "prompt": "35. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
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
            "id": "e4k-q36",
            "type": "multiple_choice",
            "prompt": "36. POSICIONES: ¿Cuál es la posición que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Dachi-waza",
            "image": "/images/didactic/exams/dachi_yoi.png",
            "options": [
                {
                    "id": "o1",
                    "text": "YOI DACHI (HACHIJI DACHI)",
                    "isCorrect": true
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
                },
                {
                    "id": "o2",
                    "text": "KOKUTSU DACHI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Yoi-dachi (Hachiji-dachi): Postura natural de espera con pies separados al ancho de hombros y puntas hacia afuera.",
            "hint": "Postura de atención y espera."
        },
        {
            "id": "e4k-q37",
            "type": "written",
            "prompt": "37. DESARROLLO: ¿En qué aspecto fundamental le ha beneficiado personalmente el Karate-Do en su vida diaria?",
            "description": "Ensayo formativo de grado (2 Puntos)",
            "acceptedKeywords": [],
            "sampleAnswer": "Forja del carácter, disciplina personal en la escuela/trabajo, respeto sincero al prójimo, serenidad para manejar el estrés y salud física integral.",
            "isEssay": true,
            "explanation": "El Karate-Do es una disciplina de desarrollo humano donde la autodefensa es el vehículo para cultivar la templanza, la humildad y la fortaleza mental.",
            "hint": "Reflexión personal honesta y profunda."
        },
        {
            "id": "e4k-q38",
            "type": "written",
            "prompt": "38. DESARROLLO: Del Niju Kun (20 preceptos de Funakoshi), elija un concepto y explique cómo lo relaciona con su vivir diario:",
            "description": "Ensayo formativo de Budo (2 Puntos)",
            "acceptedKeywords": [],
            "sampleAnswer": "Por ejemplo: 'Karate wa rei ni hajimari, rei ni owaru koto' (El Karate empieza y termina con respeto): aplicar la cortesía y la humildad en la familia y la sociedad, tratando a los demás con empatía antes y después de cualquier desacuerdo.",
            "isEssay": true,
            "explanation": "Los 20 principios rectores de Funakoshi enseñan que el verdadero Karate se practica fuera del Dojo en cada acto de la vida cotidiana.",
            "hint": "Reflexión personal honesta y profunda."
        }
    ]
};

// ====================================================================
// EXAMEN OFICIAL: 3° KYU A 2° KYU (CAFÉ 3 LÍNEAS A CAFÉ 2 LÍNEAS)
// Fuente Oficial: "I EXAMEN ESCRITO DE 3 KYU A 2 KYU.pdf" (38 Preguntas)
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
    "description": "Evaluación oficial canónica de ascenso de grado Café: Asocie de terminología y comandos, Complete técnico/histórico escrito, reconocimiento visual de técnicas de Kihon y ensayo sobre Kime-waza.",
    "questions": [
        {
            "id": "e3k-q1",
            "type": "multiple_choice",
            "prompt": "1. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'BUNKAI'?",
            "description": "Comprensión de Kata",
            "options": [
                {
                    "id": "o2",
                    "text": "Puño grande",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Saludo al frente",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Desglose de Kata / Aplicación práctica",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Línea de ejecución",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Desglose de kata",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Línea del kata",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Practicante de artes marciales",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Dojo central",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Puño grande",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Representación lineal del kata",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Saludo entre nosotros",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Desglose de kata",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Primero",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Grande o mayor",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Segundo",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Pequeño o menor",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Línea del kata",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Desglose de kata",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Puño frontal (nudillos principales)",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Saludo al frente",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Dojo central",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Espíritu y armonía",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Saludo al frente",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Saludo entre nosotros",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Línea del kata",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Pinos ondulantes",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Desglose de kata",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Espíritu y armonía / unión de energía",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Espíritu y armonía",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Saludo al frente",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Pinos ondulantes",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Dojo central / Sede principal",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Puño grande",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Saludo al frente",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Dojo central",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Pinos ondulantes",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Desglose de kata",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Saludo entre nosotros / mutuo",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Dojo central",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Saludo al frente",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Abajo",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Arriba",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Derecha",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Izquierda",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Palo o bastón largo de madera",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Escudo",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Cuchillo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Espada",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Golpear fuerte",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Empezar combate",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Recupérese / Volver a posición natural",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Posición de guardia / combate",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Lema del dojo",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Recupérese",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Ponerse en fila",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Saludo mutuo",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Detenerse",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Empezar",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Recupérese",
                    "isCorrect": false
                },
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
                    "text": "Posición de guardia",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Encuentro de manos / Combate",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Rango de grado",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Lema formativo",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Forma coreografiada",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Grado de cinta negra",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Uniforme oficial",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Maestro supremo",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Rango de grado previo a cinta negra",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Lema",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Grado",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Palo largo",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Técnica",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Lema / Precepto formativo",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Bastón",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Combate",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Izquierda",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kun (訓) significa lema, regla o enseñanza moral (como en Dojo Kun).",
            "hint": "Precepto moral o máxima de conducta."
        },
        {
            "id": "e3k-q21",
            "type": "written",
            "prompt": "21. COMPLETE: Escriba el significado de 'SHOTOKAN':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "shoto",
                "ondas de los pinos",
                "casa de shoto",
                "pinos",
                "viento en los pinos",
                "seudonimo"
            ],
            "sampleAnswer": "La casa de Shoto (Shoto = seudónimo poético de Funakoshi 'ondas de pinos', Kan = casa o salón).",
            "isEssay": false,
            "explanation": "Shotokan (松濤館) fue el nombre dado por sus alumnos al primer dojo de Funakoshi en Tokio en 1939.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e3k-q22",
            "type": "written",
            "prompt": "22. COMPLETE: Escriba el significado del Kata 'ENPI':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "vuelo de la golondrina",
                "golondrina",
                "vuelo de golondrina",
                "vuelo golondrina"
            ],
            "sampleAnswer": "El vuelo de la golondrina (movimientos ligeros y rápidos arriba y abajo simulando el vuelo del ave).",
            "isEssay": false,
            "explanation": "Enpi (燕飛) destaca por su velocidad vertiginosa, cambio súbito de alturas y técnicas de agarre y salto.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e3k-q23",
            "type": "written",
            "prompt": "23. COMPLETE: Escriba el significado del Kata 'TEKKI NIDAN':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "jinete de hierro",
                "caballo de hierro",
                "jinete hierro",
                "hierro nivel 2",
                "jinete de hierro 2"
            ],
            "sampleAnswer": "Jinete de hierro nivel 2 (Tekki = jinete a caballo de hierro, Nidan = segundo nivel).",
            "isEssay": false,
            "explanation": "Tekki Nidan se desarrolla en Kiba-dachi sobre un Enbusen lineal simulando combate con la espalda pegada a un muro o sobre una embarcación.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e3k-q24",
            "type": "written",
            "prompt": "24. COMPLETE: Escriba la similitud fundamental que comparten todos los Katas Heian:",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "defensa",
                "bloqueo",
                "uke",
                "inician con defensa",
                "comienzan con defensa",
                "empiezan con defensa",
                "defensivo",
                "pacificar"
            ],
            "sampleAnswer": "Todos los 5 Katas Heian inician con un movimiento defensivo o bloqueo (Uke), reflejando que el Karate nunca ataca primero.",
            "isEssay": false,
            "explanation": "El principio 'Karate ni sente nashi' (en el Karate no hay primer ataque) se plasma en el inicio defensivo de los katas básicos.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e3k-q25",
            "type": "written",
            "prompt": "25. COMPLETE: Escriba las siglas del reglamento utilizado internacionalmente para campeonatos oficiales de Karate Do:",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "wkf",
                "world karate federation"
            ],
            "sampleAnswer": "WKF (World Karate Federation).",
            "isEssay": false,
            "explanation": "La WKF es la entidad internacional rectora del deporte del Karate olímpico y mundial.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e3k-q26",
            "type": "written",
            "prompt": "26. COMPLETE: Escriba el nombre del Jefe Instructor de la federación ISKF (International Shotokan Karate Federation):",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "teruyuki okazaki",
                "hiroyoshi okazaki",
                "okazaki",
                "sensei okazaki"
            ],
            "sampleAnswer": "Maestro Teruyuki Okazaki (Fundador) / Hiroyoshi Okazaki (Jefe Instructor actual).",
            "isEssay": false,
            "explanation": "La ISKF fue fundada por el Shihan Teruyuki Okazaki (10° Dan, discípulo directo de Funakoshi y Nakayama).",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e3k-q27",
            "type": "written",
            "prompt": "27. COMPLETE: Escriba el origen ancestral de las artes marciales según la tradición clásica:",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "india",
                "china",
                "shaolin",
                "bodhidharma",
                "okinawa"
            ],
            "sampleAnswer": "India (Bodhidharma) y el Monasterio Shaolin de China, con posterior desarrollo en Okinawa.",
            "isEssay": false,
            "explanation": "La tradición marcial traza sus raíces en las enseñanzas de Bodhidharma en el Monasterio Shaolin, que florecieron en Okinawa.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e3k-q28",
            "type": "written",
            "prompt": "28. COMPLETE: Escriba el significado de 'JIYU IPPON KUMITE':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "semi libre",
                "semi-libre",
                "un paso",
                "ataque anunciado",
                "un solo ataque",
                "combate semi libre"
            ],
            "sampleAnswer": "Combate semi-libre a un solo ataque anunciado a distancia real.",
            "isEssay": false,
            "explanation": "Entrenamiento transitorio crucial para adquirir sentido del timing, Maai y contragolpe fulminante con Kime.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e3k-q29",
            "type": "written",
            "prompt": "29. COMPLETE: Escriba el significado de la palabra 'YAKUSOKU':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "promesa",
                "acuerdo",
                "pactado",
                "acordado",
                "compromiso"
            ],
            "sampleAnswer": "Promesa o acuerdo (combate acordado / predeterminado).",
            "isEssay": false,
            "explanation": "Yakusoku Kumite es el combate donde el atacante y defensor siguen una secuencia convenida para pulir la técnica sin daño.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e3k-q30",
            "type": "written",
            "prompt": "30. COMPLETE: Escriba uno de los cuatro estilos principales tradicionales del Karate Do:",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "shotokan",
                "shito",
                "goju",
                "wado",
                "shito ryu",
                "goju ryu",
                "wado ryu",
                "shorin ryu"
            ],
            "sampleAnswer": "Shotokan, Shito-Ryu, Goju-Ryu o Wado-Ryu.",
            "isEssay": false,
            "explanation": "Son los 4 estilos tradicionales universales que integran las directrices técnicas del Karate japonés.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e3k-q31",
            "type": "multiple_choice",
            "prompt": "31. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "image": "/images/didactic/exams/waza_manji_uke.png",
            "options": [
                {
                    "id": "o1",
                    "text": "MANJI UKE",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "MOROTE UKE",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "YAMA ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "GYAKU ZUKI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Manji-Uke: Bloqueo doble en 'vórtice' con Gedan Barai frontal y Jodan Uchi-Uke hacia atrás.",
            "hint": "Defensa doble característica de Heian Godan y Kanku Dai."
        },
        {
            "id": "e3k-q32",
            "type": "multiple_choice",
            "prompt": "32. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "image": "/images/didactic/exams/waza_morote_uke.png",
            "options": [
                {
                    "id": "o1",
                    "text": "MOROTE UKE",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "MAWASHI GERI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "MANJI UKE",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "OI ZUKI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Morote-Uke: Bloqueo medio reforzado con el otro puño apoyado en el antebrazo o codo ejecutor.",
            "hint": "Defensa reforzada a dos manos."
        },
        {
            "id": "e3k-q33",
            "type": "multiple_choice",
            "prompt": "33. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "image": "/images/didactic/exams/waza_gyaku_zuki.png",
            "options": [
                {
                    "id": "o1",
                    "text": "GYAKU ZUKI",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "OI ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o2",
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
            "explanation": "Gyaku-Zuki: Golpe de puño contrario a la pierna adelantada aprovechando la potente rotación de cadera.",
            "hint": "Golpe de puño inverso o contrario."
        },
        {
            "id": "e3k-q34",
            "type": "multiple_choice",
            "prompt": "34. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "image": "/images/didactic/exams/waza_oi_zuki.png",
            "options": [
                {
                    "id": "o3",
                    "text": "MAWASHI GERI",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "OI ZUKI",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "MANJI UKE",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "GYAKU ZUKI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Oi-Zuki: Ataque directo de puño avanzando con el mismo brazo y pierna delantera.",
            "hint": "Golpe de puño en avance con el mismo lado."
        },
        {
            "id": "e3k-q35",
            "type": "multiple_choice",
            "prompt": "35. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "image": "/images/didactic/exams/waza_yama_zuki.png",
            "options": [
                {
                    "id": "o3",
                    "text": "MANJI UKE",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "YAMA ZUKI",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "MOROTE UKE",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "OI ZUKI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Yama-Zuki: Golpe simultáneo a dos alturas (U-zuki o golpe en montaña) característico de Bassai Dai.",
            "hint": "Golpe doble de puño en forma de montaña."
        },
        {
            "id": "e3k-q36",
            "type": "multiple_choice",
            "prompt": "36. TÉCNICAS: ¿Cuál es la técnica que se muestra en la imagen oficial del examen?",
            "description": "Identificación visual de Kihon/Waza",
            "image": "/images/didactic/exams/waza_mawashi_geri.png",
            "options": [
                {
                    "id": "o3",
                    "text": "OI ZUKI",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "MAWASHI GERI",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "MOROTE UKE",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "GYAKU ZUKI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Mawashi-Geri: Patada circular percutante con elevación de rodilla y rotación completa de la cadera de apoyo.",
            "hint": "Patada circular tradicional."
        },
        {
            "id": "e3k-q37",
            "type": "written",
            "prompt": "37. DESARROLLO: KIME-WAZA: Explique en qué consiste y enumere dos criterios fundamentales que se utilizan para calificarlo:",
            "description": "Ensayo biomecánico y formativo (2 Puntos)",
            "acceptedKeywords": [],
            "sampleAnswer": "Kime es la concentración explosiva instantánea de la fuerza muscular, mental y respiratoria en el momento exacto del impacto. Criterios para calificarlo: 1) Torsión y fijación articular sólida de cadera con Hikite y Kiai; 2) Estabilidad postural y retorno inmediato al estado de alerta vigilante (Zanshin) sin perder el equilibrio.",
            "isEssay": true,
            "explanation": "Kime (決め) es el alma del golpe en Karate: máxima aceleración y transmisión de energía cinética con parada instantánea en el blanco.",
            "hint": "Reflexión personal honesta y profunda."
        },
        {
            "id": "e3k-q38",
            "type": "written",
            "prompt": "38. DESARROLLO: Afirman los grandes maestros que el Karate Do es un estilo de vida: ¿Es esto Cierto o Falso y por qué?",
            "description": "Ensayo ético y filosófico (2 Puntos)",
            "acceptedKeywords": [],
            "sampleAnswer": "Es Cierto. Porque los valores de respeto, disciplina, paciencia y superación que se forjan en el entrenamiento se aplican permanentemente en la convivencia familiar, académica y laboral, guiando la toma de decisiones con templanza y rectitud moral.",
            "isEssay": true,
            "explanation": "El Karate-Do trasciende la técnica física deportiva: es una vía de perfeccionamiento humano permanente que acompaña al practicante toda la vida.",
            "hint": "Reflexión personal honesta y profunda."
        }
    ]
};

// ====================================================================
// EXAMEN OFICIAL: 2° KYU A 1° KYU (CAFÉ 2 LÍNEAS A CAFÉ 1 LÍNEA)
// Fuente Oficial: "I EXAMEN ESCRITO DE 2 KYU A 1 KYU.pdf" (44 Preguntas)
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
    "description": "Evaluación oficial canónica de antesala a Cinta Negra: Asocie de filosofía y Budo, Complete técnico/histórico escrito, reconocimiento visual de Katas superiores, normativa deportiva WKF y ensayo ético.",
    "questions": [
        {
            "id": "e2k-q1",
            "type": "multiple_choice",
            "prompt": "1. TERMINOLOGÍA: Según el examen oficial, ¿cuál es el significado de 'BUSHIDO'?",
            "description": "Código ético samurái",
            "options": [
                {
                    "id": "o1",
                    "text": "El camino del guerrero",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Kata obligatorio",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Tabla para golpear",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Cinta negra",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Kata obligatorio de competición",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "El camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Cinturón negro",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Kata libre favorito",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "El camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Matar de un golpe",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Camino de la mano vacía",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Kata obligatorio",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Kata favorito o de libre elección",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "El camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Kata obligatorio",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Tabla de golpeo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Kata obligatorio",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Camino del guerrero",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Meditación zen",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Tabla para golpear y forjar los puños",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Matar de un golpe",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Cinturón negro",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Corte del vientre",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Meditación zen sentado",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Puño con nudillo del dedo índice sobresaliente",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Patada de gato",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Puño de martillo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Matar de un golpe",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Vencer o abatir de un solo golpe decisivo",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Entrenar juntos",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Corte del vientre",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Meditación zen",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Corte del vientre / Harakiri ritual",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Cinturón negro",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Alojarse juntos",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Matar de un golpe",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Puño de hierro",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Estado de concentración y vacío mental",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Corte del vientre",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Tabla de golpeo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Rango de grado de cinta negra",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Kata obligatorio",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "De menor antigüedad",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Cinta blanca",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Técnica decisiva",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Corte del vientre",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Cinturón negro",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Alojarse y entrenar juntos en concentración intensiva",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Campesino",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Monje pacífico",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Clase militar del Japón feudal",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Árbitro deportivo",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Espíritu que perdura",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Puño de martillo de hierro",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Puño de un nudillo",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Cinturón negro",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Patada de gato",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Técnica decisiva con máxima concentración de fuerza",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Vuelta completa",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Saludo formal",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Puño de martillo",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "El espíritu que perdura / Alerta continua post-técnica",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Cinturón negro",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Corte del vientre",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Detenerse",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Sentarse",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Giro / Vuelta",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Avanzar",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Cinturón café",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Cinturón negro",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "Cinturón blanco",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Uniforme negro",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "Águila",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Tigre",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Gato (como en Neko-ashi-dachi)",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "Dragón",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "Primero / Uno (lema que encabeza cada precepto)",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Segundo",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Último",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Tercero",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Hitosu (一つ) precede cada uno de los 5 preceptos del Dojo Kun para indicar que todos tienen la misma importancia primordial.",
            "hint": "La palabra con la que inicia cada frase del Dojo Kun."
        },
        {
            "id": "e2k-q21",
            "type": "written",
            "prompt": "21. COMPLETE: Escriba el significado de 'KARATEDO SHOTOKAN':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "mano vacia",
                "shoto",
                "ondas de los pinos",
                "casa de shoto",
                "camino de la mano vacia"
            ],
            "sampleAnswer": "El camino de la mano vacía de la escuela de las ondas de los pinos (Shoto = seudónimo de Funakoshi, Kan = casa/escuela, Kara = vacío, Te = mano, Do = camino).",
            "isEssay": false,
            "explanation": "Sintetiza la disciplina ética del vacío físico y mental enseñada en la escuela tradicional fundada por Funakoshi.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e2k-q22",
            "type": "written",
            "prompt": "22. COMPLETE: Escriba el significado del Kata 'HANGETSU':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "media luna",
                "mitad de la luna",
                "semicirculo"
            ],
            "sampleAnswer": "Media luna (debido a los desplazamientos semicirculares y la postura Hangetsu-dachi).",
            "isEssay": false,
            "explanation": "Hangetsu (半月) es uno de los katas más antiguos de origen Naha-Te, focalizado en respiración profunda (Ibuki) y tensión isométrica.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e2k-q23",
            "type": "written",
            "prompt": "23. COMPLETE: Escriba el significado del Kata 'JION':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "amor y bondad",
                "templo jion",
                "piedad",
                "templo",
                "bondad",
                "compasion"
            ],
            "sampleAnswer": "Amor y bondad (o Sonido del Templo budista Jion-ji).",
            "isEssay": false,
            "explanation": "Jion (慈恩) proviene de las formas de Tomari-Te; inicia con el saludo Ming (mano cerrada y mano abierta) en señal de respeto y devoción budista.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e2k-q24",
            "type": "written",
            "prompt": "24. COMPLETE: Escriba el nombre del Jefe Instructor de la federación ISKF:",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "teruyuki okazaki",
                "hiroyoshi okazaki",
                "okazaki",
                "sensei okazaki"
            ],
            "sampleAnswer": "Maestro Teruyuki Okazaki (Fundador) / Hiroyoshi Okazaki (Jefe Instructor actual).",
            "isEssay": false,
            "explanation": "La ISKF es una de las mayores federaciones internacionales de Shotokan tradicional a nivel mundial.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e2k-q25",
            "type": "written",
            "prompt": "25. COMPLETE: Escriba el significado de 'JIYU KUMITE':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "combate libre",
                "pelea libre",
                "combate sin predeterminar",
                "libre"
            ],
            "sampleAnswer": "Combate libre (combate dinámico sin técnicas predeterminadas pero con control total de impacto).",
            "isEssay": false,
            "explanation": "Jiyu Kumite pone a prueba la improvisación, el timing, la lectura de intenciones y la serenidad bajo presión de combate.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e2k-q26",
            "type": "written",
            "prompt": "26. COMPLETE: Escriba el significado de 'CHAKUGAN':",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "mirada",
                "contacto visual",
                "fijacion de la mirada",
                "fijar la mirada",
                "ojos"
            ],
            "sampleAnswer": "Fijación y enfoque de la mirada (contacto visual constante con los ojos del adversario).",
            "isEssay": false,
            "explanation": "Chakugan (着眼) enseña a mirar los ojos del oponente abarcando todo su cuerpo en visión periférica sin delatar intenciones.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e2k-q27",
            "type": "written",
            "prompt": "27. COMPLETE: Escriba los 4 estilos oficiales tradicionales de Karate Do reconocidos internacionalmente por la WKF:",
            "description": "Respuesta escrita de grado (1 Punto)",
            "acceptedKeywords": [
                "shotokan",
                "shito",
                "goju",
                "wado",
                "shito ryu",
                "goju ryu",
                "wado ryu"
            ],
            "sampleAnswer": "Shotokan, Shito-Ryu, Goju-Ryu y Wado-Ryu.",
            "isEssay": false,
            "explanation": "Los cuatro estilos matrices fundados respectivamente por Funakoshi, Mabuni, Miyagi y Otsuka.",
            "hint": "Escriba los términos o palabras clave correspondientes."
        },
        {
            "id": "e2k-q28",
            "type": "multiple_choice",
            "prompt": "28. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "image": "/images/didactic/exams/kata_hangetsu.png",
            "options": [
                {
                    "id": "o1",
                    "text": "HANGETSU",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "KANKU DAI",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "JION",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "TEKKI NIDAN",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Hangetsu: Paso semicircular característico con postura Hangetsu-dachi y respiración concentrada.",
            "hint": "Katas de pasos semicirculares de media luna."
        },
        {
            "id": "e2k-q29",
            "type": "multiple_choice",
            "prompt": "29. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "image": "/images/didactic/exams/kata_jion.png",
            "options": [
                {
                    "id": "o2",
                    "text": "ENPI",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "JION",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "HANGETSU",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "BASSAI DAI",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Jion: Saludo budista inicial de puño cubierto (Jiai no kamae) y desplazamientos firmes en Kiba y Zenkutsu.",
            "hint": "Katas del templo Jion con saludo inicial de puño cubierto."
        },
        {
            "id": "e2k-q30",
            "type": "multiple_choice",
            "prompt": "30. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "image": "/images/didactic/exams/kata_kanku_dai.png",
            "options": [
                {
                    "id": "o1",
                    "text": "KANKU DAI",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "ENPI",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "BASSAI DAI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "TEKKI NIDAN",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Kanku Dai: Gesto majestuoso de apertura mirando el cielo a través del triángulo de las manos.",
            "hint": "Apertura contemplando el cielo."
        },
        {
            "id": "e2k-q31",
            "type": "multiple_choice",
            "prompt": "31. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "image": "/images/didactic/exams/kata_tekki_nidan.png",
            "options": [
                {
                    "id": "o4",
                    "text": "ENPI",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "TEKKI NIDAN",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "HANGETSU",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "JION",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Tekki Nidan: Guardia característica con codo arriba y trabajo de Kiba-dachi sobre línea lateral.",
            "hint": "Jinete de hierro nivel 2."
        },
        {
            "id": "e2k-q32",
            "type": "multiple_choice",
            "prompt": "32. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "image": "/images/didactic/exams/kata_enpi.png",
            "options": [
                {
                    "id": "o1",
                    "text": "ENPI",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "BASSAI DAI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "KANKU DAI",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "JION",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Enpi: Movimiento ágil de elevación y descenso súbito característico de la golondrina.",
            "hint": "El vuelo de la golondrina."
        },
        {
            "id": "e2k-q33",
            "type": "multiple_choice",
            "prompt": "33. KATAS: ¿En cuál Kata oficial se encuentra la posición que se muestra en la imagen?",
            "description": "Identificación visual de Kata",
            "image": "/images/didactic/exams/kata_bassai_dai.png",
            "options": [
                {
                    "id": "o2",
                    "text": "HANGETSU",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "ENPI",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "TEKKI NIDAN",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "BASSAI DAI",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Bassai Dai: Potente avance de ruptura con Morote Tsukami-Uke y Yama-Zuki penetrando la fortaleza.",
            "hint": "Penetrar en la fortaleza con máxima fuerza."
        },
        {
            "id": "e2k-q34",
            "type": "multiple_choice",
            "prompt": "34. WKF: Según el reglamento oficial de competición, ¿cuántos puntos otorga el 'YUKO'?",
            "description": "Puntuación de Kumite WKF",
            "options": [
                {
                    "id": "o2",
                    "text": "2 Puntos",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Descalificación",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "3 Puntos",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "1 Punto",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "1 Punto",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "3 Puntos",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "2 Puntos",
                    "isCorrect": true
                },
                {
                    "id": "o4",
                    "text": "4 Puntos",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "1 Punto",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "2 Puntos",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Medio Punto",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "3 Puntos",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "TATAMI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "DOJO",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "ENBUSEN",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "KAMAE",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o2",
                    "text": "Azul",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "Ganador",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "Empate",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Rojo (competidor del lado rojo)",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o4",
                    "text": "Piso",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "Rojo",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "Azul (competidor del lado azul)",
                    "isCorrect": true
                },
                {
                    "id": "o3",
                    "text": "Empate",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "HANTEI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "SEIRETSU",
                    "isCorrect": false
                },
                {
                    "id": "o2",
                    "text": "YAME",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "TSUZUKETE (Hajime)",
                    "isCorrect": true
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o1",
                    "text": "HAJIME",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "YAME",
                    "isCorrect": false
                },
                {
                    "id": "o3",
                    "text": "HANTEI",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "KIRITSU",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
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
                    "id": "o3",
                    "text": "TSUZUKETE",
                    "isCorrect": false
                },
                {
                    "id": "o1",
                    "text": "HANTEI / NO KACHI",
                    "isCorrect": true
                },
                {
                    "id": "o2",
                    "text": "YAME",
                    "isCorrect": false
                },
                {
                    "id": "o4",
                    "text": "KIRITSU",
                    "isCorrect": false
                }
            ],
            "correctAnswerId": "o1",
            "explanation": "Hantei (判定) es la consulta arbitral por banderas para definir al ganador (Aka/Ao no Kachi).",
            "hint": "Decisión y declaración de victoria."
        },
        {
            "id": "e2k-q43",
            "type": "written",
            "prompt": "43. DESARROLLO: Explique dos criterios fundamentales respectivamente utilizados para calificar Kumite y Kata en el arbitraje oficial:",
            "description": "Ensayo arbitral y reglamentario (2 Puntos)",
            "acceptedKeywords": [],
            "sampleAnswer": "Para Kumite: 1) Buena forma y aplicación técnica rigurosa; 2) Distancia correcta (Maai) y control absoluto sin causar daño lesivo (Sun-dome). Para Kata: 1) Conformidad y precisión biomecánica del estilo respetando el Enbusen; 2) Potencia, velocidad, ritmo y estabilidad sólida con Kime y Zanshin.",
            "isEssay": true,
            "explanation": "Se evalúa el dominio del reglamento WKF: en Kumite prima la precisión y control; en Kata la maestría de ejecución técnica y presencia marcial.",
            "hint": "Reflexión personal honesta y profunda."
        },
        {
            "id": "e2k-q44",
            "type": "written",
            "prompt": "44. DESARROLLO: ¿Qué significado tiene para usted haber alcanzado el grado de Café 2° Kyu y estar pronto a su Cinta Negra?",
            "description": "Ensayo formativo de madurez marcial (2 Puntos)",
            "acceptedKeywords": [],
            "sampleAnswer": "Representa una enorme responsabilidad moral: dejar atrás el aprendizaje básico para convertirse en modelo de perseverancia y humildad para los grados menores, comprendiendo que el cinturón negro no es la cima, sino el auténtico inicio del camino marcial.",
            "isEssay": true,
            "explanation": "El paso de 2° Kyu a 1° Kyu y Shodan exige madurez, espíritu de servicio al Dojo, fidelidad a los valores del Sensei y temple de carácter.",
            "hint": "Reflexión personal honesta y profunda."
        }
    ]
};
