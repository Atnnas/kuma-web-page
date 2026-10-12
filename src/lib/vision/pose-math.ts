/**
 * Kuma Dojo - Motor Matemático y Biomecánico de Visión Artificial
 * Basado en biomecánica Shotokan tradicional (JKA / Masatoshi Nakayama - Dynamic Karate)
 */

export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Cálculo de ángulo 2D sobre plano de pantalla
 */
export function calculate2DAngle(
  ptA?: PoseLandmark | null,
  ptB?: PoseLandmark | null,
  ptC?: PoseLandmark | null
): number {
  if (!ptA || !ptB || !ptC) return 180;

  const vecAB = { x: ptA.x - ptB.x, y: ptA.y - ptB.y };
  const vecCB = { x: ptC.x - ptB.x, y: ptC.y - ptB.y };

  const dot = vecAB.x * vecCB.x + vecAB.y * vecCB.y;
  const magAB = Math.hypot(vecAB.x, vecAB.y);
  const magCB = Math.hypot(vecCB.x, vecCB.y);

  if (magAB === 0 || magCB === 0) return 180;

  const cosTheta = Math.min(1, Math.max(-1, dot / (magAB * magCB)));
  return Math.round(Math.acos(cosTheta) * (180 / Math.PI));
}

/**
 * Cálculo de ángulo 3D real utilizando coordenadas métricas (worldLandmarks)
 * Invariante a la inclinación o perspectiva de la cámara
 */
export function calculate3DAngle(
  ptA?: PoseLandmark | null,
  ptB?: PoseLandmark | null,
  ptC?: PoseLandmark | null
): number {
  if (!ptA || !ptB || !ptC) return 180;

  // Si no hay z fiable, recurrir a 2D
  if (ptA.z === undefined || ptB.z === undefined || ptC.z === undefined) {
    return calculate2DAngle(ptA, ptB, ptC);
  }

  const v1 = { x: ptA.x - ptB.x, y: ptA.y - ptB.y, z: ptA.z - ptB.z };
  const v2 = { x: ptC.x - ptB.x, y: ptC.y - ptB.y, z: ptC.z - ptB.z };

  const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

  if (mag1 === 0 || mag2 === 0) return 180;

  const cosTheta = Math.min(1, Math.max(-1, dot / (mag1 * mag2)));
  return Math.round(Math.acos(cosTheta) * (180 / Math.PI));
}

/**
 * Filtro de suavizado EMA (Exponential Moving Average) anti-jitter
 * Elimina fluctuaciones de alta frecuencia causadas por ruido de sensor o Karategi
 */
export function smoothAngle(current: number, previous: number | null, alpha = 0.65): number {
  if (previous === null || isNaN(previous)) return current;
  return Math.round(alpha * current + (1 - alpha) * previous);
}

/**
 * Calcula la rotación pélvica (Koshi) relativa a los hombros
 * @returns ángulo en grados: ~0-15° es Shomen (frente total), ~30-55° es Hanmi (semiperfil 45°)
 */
export function calculateKoshiAngle(landmarks: PoseLandmark[]): {
  angle: number;
  mode: "shomen" | "hanmi" | "indeterminado";
} {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
    return { angle: 0, mode: "indeterminado" };
  }

  // Vector de hombros y vector de caderas en el plano horizontal (x, z)
  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
  const hipWidth = Math.abs(leftHip.x - rightHip.x);

  if (shoulderWidth === 0) return { angle: 0, mode: "indeterminado" };

  // Relación de proyección: cuando está de frente, hipWidth/shoulderWidth ~ 0.7-0.9
  // Cuando la cadera rota a Hanmi (45°), la proyección horizontal disminuye cos(45°) ~ 0.707
  const ratio = Math.min(1, hipWidth / (shoulderWidth * 0.85));
  const estimatedAngle = Math.round(Math.acos(ratio) * (180 / Math.PI));

  if (estimatedAngle <= 20) {
    return { angle: estimatedAngle, mode: "shomen" };
  } else if (estimatedAngle >= 25 && estimatedAngle <= 65) {
    return { angle: estimatedAngle, mode: "hanmi" };
  }
  return { angle: estimatedAngle, mode: "indeterminado" };
}

/**
 * Detección de Valgo de Rodilla (Knee Valgus)
 * Alerta si la rodilla colapsa medialmente hacia adentro respecto al eje cadera-tobillo
 */
export function checkKneeValgus(hip: PoseLandmark, knee: PoseLandmark, ankle: PoseLandmark, isLeftLeg: boolean): boolean {
  if (!hip || !knee || !ankle) return false;
  // En pierna izquierda vista de frente, si la rodilla se va a la derecha del eje hip-ankle
  const midX = (hip.x + ankle.x) / 2;
  const deviation = knee.x - midX;
  return isLeftLeg ? deviation > 0.04 : deviation < -0.04;
}

// --------------------------------------------------------------------------
// ANALIZADORES DE POSTURAS SHOTOKAN (KIHON ANATOMY)
// --------------------------------------------------------------------------

export interface StanceAnalysisResult {
  stanceName: string;
  isValid: boolean;
  score: number; // 0 - 100
  feedback: string;
  metrics: Record<string, number | string | boolean>;
}

/**
 * Análisis biomecánico de Zenkutsu-dachi (前屈立ち - Postura Adelantada)
 * Criterios canónicos JKA / Funakoshi / Nakayama:
 * - 60% peso adelante / 40% atrás
 * - Rodilla delantera flexionada en vertical sobre el empeine (ángulo 90°-105°)
 * - Pierna trasera extendida firmemente (ángulo 170°-180°)
 */
export function analyzeZenkutsuDachi(
  landmarks: PoseLandmark[],
  worldLandmarks?: PoseLandmark[]
): StanceAnalysisResult {
  const lms = worldLandmarks && worldLandmarks.length >= 33 ? worldLandmarks : landmarks;

  const leftHip = lms[23];
  const rightHip = lms[24];
  const leftKnee = lms[25];
  const rightKnee = lms[26];
  const leftAnkle = lms[27];
  const rightAnkle = lms[28];

  const leftKneeAngle = calculate3DAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculate3DAngle(rightHip, rightKnee, rightAnkle);

  // Determinar cuál pierna está adelantada (la más flexionada)
  const isLeftFront = leftKneeAngle < rightKneeAngle;
  const frontKneeAngle = isLeftFront ? leftKneeAngle : rightKneeAngle;
  const rearKneeAngle = isLeftFront ? rightKneeAngle : leftKneeAngle;

  const frontKneeOk = frontKneeAngle >= 85 && frontKneeAngle <= 115;
  const rearLegExtended = rearKneeAngle >= 165;

  let score = 0;
  let feedback = "";

  if (frontKneeOk && rearLegExtended) {
    score = 95;
    feedback = "¡Zenkutsu-dachi óptimo! Peso correcto 60/40 y pierna posterior bloqueada.";
  } else if (!frontKneeOk && frontKneeAngle > 115) {
    score = Math.max(30, 100 - (frontKneeAngle - 100));
    feedback = "Flexiona más la rodilla delantera sobre el empeine (busca 90°-100°).";
  } else if (!rearLegExtended) {
    score = Math.max(40, Math.round(rearKneeAngle / 180 * 100));
    feedback = "Estira por completo la pierna trasera para empujar la fuerza del suelo.";
  } else {
    score = 60;
    feedback = "Ajusta la apertura entre ambas piernas.";
  }

  const koshi = calculateKoshiAngle(landmarks);

  return {
    stanceName: "Zenkutsu-dachi",
    isValid: frontKneeOk && rearLegExtended,
    score,
    feedback,
    metrics: {
      piernaAdelantada: isLeftFront ? "Izquierda" : "Derecha",
      anguloRodillaDelantera: frontKneeAngle,
      anguloPiernaTrasera: rearKneeAngle,
      orientacionKoshi: koshi.mode,
      valgoDetectado: isLeftFront 
        ? checkKneeValgus(leftHip, leftKnee, leftAnkle, true)
        : checkKneeValgus(rightHip, rightKnee, rightAnkle, false),
    }
  };
}

/**
 * Análisis biomecánico de Kokutsu-dachi (後屈立ち - Postura Atrasada)
 * Criterios canónicos JKA:
 * - 70% peso atrás / 30% adelante
 * - Rodilla trasera flexionada a 90°-105°
 * - Pierna delantera relajada y semi-extendida (150°-165°)
 */
export function analyzeKokutsuDachi(
  landmarks: PoseLandmark[],
  worldLandmarks?: PoseLandmark[]
): StanceAnalysisResult {
  const lms = worldLandmarks && worldLandmarks.length >= 33 ? worldLandmarks : landmarks;

  const leftKneeAngle = calculate3DAngle(lms[23], lms[25], lms[27]);
  const rightKneeAngle = calculate3DAngle(lms[24], lms[26], lms[28]);

  // En Kokutsu-dachi, la pierna de apoyo (trasera) está fuertemente flexionada
  const isLeftRear = leftKneeAngle < rightKneeAngle;
  const rearKneeAngle = isLeftRear ? leftKneeAngle : rightKneeAngle;
  const frontLegAngle = isLeftRear ? rightKneeAngle : leftKneeAngle;

  const rearKneeOk = rearKneeAngle >= 85 && rearKneeAngle <= 115;
  const frontLegOk = frontLegAngle >= 140 && frontLegAngle <= 170;

  let score = 0;
  let feedback = "";

  if (rearKneeOk && frontLegOk) {
    score = 95;
    feedback = "¡Kokutsu-dachi impecable! 70% de apoyo real atrás y centro bajo.";
  } else if (!rearKneeOk && rearKneeAngle > 115) {
    score = Math.max(35, 100 - (rearKneeAngle - 100));
    feedback = "Flexiona más la pierna de apoyo trasera para asentar el 70% del peso.";
  } else if (!frontLegOk && frontLegAngle < 140) {
    score = 60;
    feedback = "Demasiado peso en la pierna delantera. Libérala extendiendo ligeramente.";
  } else {
    score = 50;
    feedback = "Coloca el centro de gravedad atrás.";
  }

  return {
    stanceName: "Kokutsu-dachi",
    isValid: rearKneeOk && frontLegOk,
    score,
    feedback,
    metrics: {
      piernaApoyoTrasera: isLeftRear ? "Izquierda" : "Derecha",
      anguloRodillaTrasera: rearKneeAngle,
      anguloPiernaDelantera: frontLegAngle,
      distribucionEstimada: "70% atrás / 30% adelante"
    }
  };
}

/**
 * Análisis biomecánico de Kiba-dachi (騎馬立ち - Postura del Jinete)
 * Criterios canónicos JKA:
 * - 50% / 50% de peso bilateral simétrico
 * - Rodillas flexionadas a 105°-120° empujadas hacia afuera
 * - Torso estrictamente vertical (Seichusen)
 */
export function analyzeKibaDachi(
  landmarks: PoseLandmark[],
  worldLandmarks?: PoseLandmark[]
): StanceAnalysisResult {
  const lms = worldLandmarks && worldLandmarks.length >= 33 ? worldLandmarks : landmarks;

  const leftKneeAngle = calculate3DAngle(lms[23], lms[25], lms[27]);
  const rightKneeAngle = calculate3DAngle(lms[24], lms[26], lms[28]);

  const symmetryDiff = Math.abs(leftKneeAngle - rightKneeAngle);
  const avgKnee = (leftKneeAngle + rightKneeAngle) / 2;
  const depthOk = avgKnee >= 100 && avgKnee <= 130;
  const symmetricOk = symmetryDiff <= 12;

  // Torso tilt vs vertical
  let torsoTilt = 0;
  const midShoulder = { x: (landmarks[11].x + landmarks[12].x) / 2, y: (landmarks[11].y + landmarks[12].y) / 2 };
  const midHip = { x: (landmarks[23].x + landmarks[24].x) / 2, y: (landmarks[23].y + landmarks[24].y) / 2 };
  const dx = midShoulder.x - midHip.x;
  const dy = midShoulder.y - midHip.y;
  if (Math.hypot(dx, dy) > 0) {
    torsoTilt = Math.round(Math.abs(Math.atan2(dx, -dy) * (180 / Math.PI)));
  }

  const torsoOk = torsoTilt <= 10;

  let score = 0;
  let feedback = "";

  if (depthOk && symmetricOk && torsoOk) {
    score = 96;
    feedback = "¡Kiba-dachi firme! Simetría perfecta 50/50 y espalda recta.";
  } else if (!symmetricOk) {
    score = Math.max(40, 100 - symmetryDiff * 4);
    feedback = "Equilibra el peso por igual entre ambas piernas (diferencia actual: " + symmetryDiff + "°).";
  } else if (!depthOk) {
    score = Math.max(40, 100 - Math.abs(avgKnee - 115));
    feedback = "Ajusta la profundidad de flexión de tus rodillas.";
  } else if (!torsoOk) {
    score = 65;
    feedback = "Mantén la columna vertical sin inclinar el torso hacia los lados.";
  }

  return {
    stanceName: "Kiba-dachi",
    isValid: depthOk && symmetricOk && torsoOk,
    score,
    feedback,
    metrics: {
      anguloRodillaIzquierda: leftKneeAngle,
      anguloRodillaDerecha: rightKneeAngle,
      diferenciaSimetria: symmetryDiff,
      inclinacionTorso: torsoTilt
    }
  };
}
