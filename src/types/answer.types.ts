/**
 * Tipos TypeScript para validación de respuestas
 * TSP1 - Matemática III
 */

export type ValidationMethod =
  | 'comparacion_simbolica'
  | 'evaluacion_numerica'
  | 'comparacion_conjuntos'
  | 'validacion_por_pasos';

export type FeedbackType = 'correcto' | 'parcialmente_correcto' | 'incorrecto' | 'error_comun';

export interface ValidationResult {
  esCorrecta: boolean;
  metodo: ValidationMethod;
  mensaje: string;
  feedbackType: FeedbackType;
  puntaje?: number;
  sugerencia?: string;
  errorDetectado?: string;
}

export interface StepValidation {
  stepId: string;
  esCorrecta: boolean;
  feedback: string;
  intentos: number;
}

export interface AnswerSubmission {
  problemId: string;
  stepId?: string;
  respuesta: string | number | string[];
  timestamp: Date;
}

export interface ValidationConfig {
  tolerancia_numerica?: number; // Para comparaciones numéricas
  puntos_prueba?: number; // Cantidad de puntos a evaluar
  ignorar_orden?: boolean; // Para comparación de conjuntos
  simplificar?: boolean; // Para comparación simbólica
}
