/**
 * Tipos TypeScript para problemas matemáticos
 * TSP1 - Matemática III
 */

// Tipos de identificadores
export type ObjectiveId = 'I.1' | 'I.2' | 'II.1' | 'II.2';

export type ProblemId =
  | 'I.1.1' | 'I.1.2'
  | 'I.2.1' | 'I.2.2'
  | 'II.1.1' | 'II.1.2'
  | 'II.2.1' | 'II.2.2';

export type ProblemType =
  | 'verificacion_formula'
  | 'integral_definida_sustitucion'
  | 'convergencia_integral_impropia'
  | 'volumen_revolucion_impropia'
  | 'volumen_por_rotacion_acotada'
  | 'longitud_arco'
  | 'recta_tangente_parametrica'
  | 'area_polar_entre_curvas';

export type VisualizationType =
  | 'grafico_2D'
  | 'grafico_2D_con_limites'
  | 'solido_3D'
  | 'region_2D_y_solido_3D'
  | 'curva_2D_con_longitud'
  | 'curva_parametrica'
  | 'trazado_polar_con_area'
  | null;

export type Difficulty = 'media' | 'media-dificil' | 'dificil' | 'muy_dificil';

export type StepStatus = 'bloqueado' | 'activo' | 'completado' | 'omitido';

export type InputType = 'ecuacion' | 'opcion_multiple' | 'numerico' | 'interaccion_grafico';

export interface Hint {
  nivel: 1 | 2 | 3 | 4 | 5;
  texto: string;
  utilidad: 'Direccional' | 'Explicativa' | 'Detallada' | 'Ayuda Visual' | 'Solución Dada';
  deduccion: number;
}

export interface ProblemStep {
  id: string;
  titulo: string;
  instruccion: string;
  tipo_entrada: InputType;
  validacion: string; // Descripción de cómo validar
  pistas: string[]; // Array de pistas (simplificado para MVP)
  visualizacion?: string; // Nombre del componente de visualización
  status?: StepStatus;
}

export interface Visualization {
  tipo: VisualizationType;
  mostrar: string | string[];
}

export interface Problem {
  id: ProblemId;
  objectiveId: ObjectiveId;
  tipo: ProblemType;
  enunciado: string;
  metodo_solucion: string;
  pasos: string[] | ProblemStep[];
  errores_comunes?: string[];
  visualizacion: Visualization | null;
  dificultad: Difficulty;
  puntos_maximos?: number;
}

export interface Objective {
  id: ObjectiveId;
  titulo: string;
  descripcion: string;
  problemas: Problem[];
  icono?: string;
}

export interface ProblemAttempt {
  intentos: number;
  pistas_usadas: number[];
  tiempo_gastado: number; // en segundos
  respuesta_final: string | number | null;
  es_correcto: boolean;
  puntaje: number;
  pasos_completados: boolean[];
  fecha_inicio?: Date;
  fecha_completado?: Date;
}
