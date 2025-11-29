/**
 * Tipos TypeScript para datos de usuario y progreso
 * TSP1 - Matemática III
 */

import type { ProblemId, ObjectiveId } from './problem.types';
import type { ProblemAttempt } from './problem.types';

export interface StudentInfo {
  nombre: string;
  id: string;
  centro_local?: string;
  inicio_sesion: Date;
}

export interface UserProgress {
  studentInfo: StudentInfo;
  problemas: Map<ProblemId, ProblemAttempt>;
  porcentaje_completado: number;
  puntaje_promedio: number;
  tiempo_total: number; // en segundos
  objetivos_completados: ObjectiveId[];
  ultima_actualizacion: Date;
}

export interface Achievement {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  desbloqueado: boolean;
  fecha_desbloqueo?: Date;
}

export interface SessionMetrics {
  duracion: number; // en segundos
  problemas_intentados: number;
  problemas_completados: number;
  pistas_usadas: number;
  precision: number; // porcentaje
}
