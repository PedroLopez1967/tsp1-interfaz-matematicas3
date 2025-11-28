/**
 * Utilidades de validación matemática
 * TSP1 - Matemática III
 */

export interface ValidationResult {
  esCorrecta: boolean;
  feedback?: string;
  puntajeParcial?: number;
}

/**
 * Normaliza una respuesta matemática eliminando espacios y estandarizando formato
 */
export const normalizeMathExpression = (expr: string): string => {
  return expr
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\*/g, '')
    .replace(/×/g, '')
    .replace(/·/g, '')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt')
    .trim();
};

/**
 * Compara dos números con tolerancia para errores de redondeo
 */
export const compareNumbers = (num1: number, num2: number, tolerance: number = 0.01): boolean => {
  return Math.abs(num1 - num2) <= tolerance;
};

/**
 * Extrae el valor numérico de una expresión simple
 */
export const extractNumericValue = (expr: string): number | null => {
  try {
    const normalized = expr
      .replace(/π/g, String(Math.PI))
      .replace(/pi/gi, String(Math.PI))
      .replace(/e(?!\d)/gi, String(Math.E))
      .replace(/√/g, 'Math.sqrt')
      .replace(/sqrt/gi, 'Math.sqrt')
      .replace(/arctan/gi, 'Math.atan')
      .replace(/atan/gi, 'Math.atan')
      .replace(/arcsin/gi, 'Math.asin')
      .replace(/asin/gi, 'Math.asin')
      .replace(/arccos/gi, 'Math.acos')
      .replace(/acos/gi, 'Math.acos')
      .replace(/ln/gi, 'Math.log')
      .replace(/log/gi, 'Math.log10');

    // Evaluar la expresión de forma segura (solo números y operaciones matemáticas)
    const sanitized = normalized.replace(/[^0-9+\-*/().,\sMath.]/g, '');
    return eval(sanitized);
  } catch {
    return null;
  }
};

/**
 * Valida una respuesta numérica con respuestas aceptadas
 */
export const validateNumericAnswer = (
  userAnswer: string,
  correctAnswers: (number | string)[],
  tolerance: number = 0.01
): ValidationResult => {
  const userValue = extractNumericValue(userAnswer);

  if (userValue === null) {
    return {
      esCorrecta: false,
      feedback: 'La respuesta no tiene un formato numérico válido.',
    };
  }

  // Comparar con cada respuesta correcta posible
  for (const correctAnswer of correctAnswers) {
    const correctValue = typeof correctAnswer === 'number'
      ? correctAnswer
      : extractNumericValue(correctAnswer);

    if (correctValue !== null && compareNumbers(userValue, correctValue, tolerance)) {
      return {
        esCorrecta: true,
        feedback: '¡Correcto! Tu respuesta es exacta.',
        puntajeParcial: 100,
      };
    }
  }

  // Verificar si está cerca (puntaje parcial)
  for (const correctAnswer of correctAnswers) {
    const correctValue = typeof correctAnswer === 'number'
      ? correctAnswer
      : extractNumericValue(correctAnswer);

    if (correctValue !== null && compareNumbers(userValue, correctValue, 0.1)) {
      return {
        esCorrecta: false,
        feedback: 'Tu respuesta está cerca pero no es exacta. Revisa tus cálculos.',
        puntajeParcial: 70,
      };
    }
  }

  return {
    esCorrecta: false,
    feedback: 'Respuesta incorrecta. Revisa tu procedimiento y vuelve a intentar.',
    puntajeParcial: 0,
  };
};

/**
 * Valida una expresión algebraica (comparación de texto normalizado)
 */
export const validateAlgebraicExpression = (
  userAnswer: string,
  correctAnswers: string[]
): ValidationResult => {
  const normalizedUser = normalizeMathExpression(userAnswer);

  for (const correctAnswer of correctAnswers) {
    const normalizedCorrect = normalizeMathExpression(correctAnswer);

    if (normalizedUser === normalizedCorrect) {
      return {
        esCorrecta: true,
        feedback: '¡Correcto! Tu expresión coincide con la respuesta esperada.',
        puntajeParcial: 100,
      };
    }

    // Verificar formas equivalentes comunes
    if (areEquivalentExpressions(normalizedUser, normalizedCorrect)) {
      return {
        esCorrecta: true,
        feedback: '¡Correcto! Tu expresión es equivalente a la respuesta esperada.',
        puntajeParcial: 100,
      };
    }
  }

  return {
    esCorrecta: false,
    feedback: 'La expresión no coincide con ninguna forma esperada. Verifica tu procedimiento.',
    puntajeParcial: 0,
  };
};

/**
 * Verifica si dos expresiones son equivalentes (implementación básica)
 */
const areEquivalentExpressions = (expr1: string, expr2: string): boolean => {
  // Casos comunes de equivalencia
  const equivalences = [
    // Conmutatividad
    [/(\w+)\+(\w+)/, '$2+$1'],
    [/(\w+)\*(\w+)/, '$2*$1'],
    // Formas alternativas de pi
    [/pi/, 'π'],
    [/π/, 'pi'],
  ];

  let modified = expr1;
  for (const [pattern, replacement] of equivalences) {
    if (typeof pattern === 'string') continue;
    const temp = modified.replace(pattern, replacement as string);
    if (temp === expr2) return true;
    modified = temp;
  }

  return false;
};

/**
 * Valida respuestas con palabras clave (para preguntas conceptuales)
 */
export const validateKeywords = (
  userAnswer: string,
  requiredKeywords: string[],
  optionalKeywords: string[] = []
): ValidationResult => {
  const normalized = userAnswer.toLowerCase();
  const foundRequired = requiredKeywords.filter(kw => normalized.includes(kw.toLowerCase()));
  const foundOptional = optionalKeywords.filter(kw => normalized.includes(kw.toLowerCase()));

  const requiredScore = requiredKeywords.length > 0
    ? (foundRequired.length / requiredKeywords.length) * 70
    : 70;

  const optionalScore = optionalKeywords.length > 0
    ? (foundOptional.length / optionalKeywords.length) * 30
    : 30;

  const totalScore = requiredScore + optionalScore;

  if (totalScore >= 90) {
    return {
      esCorrecta: true,
      feedback: '¡Excelente! Tu respuesta incluye todos los conceptos clave.',
      puntajeParcial: 100,
    };
  } else if (totalScore >= 70) {
    return {
      esCorrecta: true,
      feedback: 'Bien! Tu respuesta incluye los conceptos principales.',
      puntajeParcial: Math.round(totalScore),
    };
  } else if (totalScore >= 40) {
    return {
      esCorrecta: false,
      feedback: 'Tu respuesta está incompleta. Faltan conceptos importantes.',
      puntajeParcial: Math.round(totalScore),
    };
  }

  return {
    esCorrecta: false,
    feedback: 'Tu respuesta no incluye los conceptos clave esperados.',
    puntajeParcial: 0,
  };
};

export default {
  normalizeMathExpression,
  compareNumbers,
  extractNumericValue,
  validateNumericAnswer,
  validateAlgebraicExpression,
  validateKeywords,
};
