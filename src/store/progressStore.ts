/**
 * Store Zustand para gestión de progreso del usuario
 * TSP1 - Matemática III
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ProblemId, ObjectiveId, ProblemAttempt, StudentInfo, UserProgress } from '../types';

interface ProgressState {
  // Estado
  studentInfo: StudentInfo | null;
  problemas: Record<ProblemId, ProblemAttempt>;
  currentProblem: ProblemId | null;
  currentObjective: ObjectiveId | null;

  // Métricas calculadas
  porcentaje_completado: number;
  puntaje_promedio: number;
  tiempo_total: number;
  objetivos_completados: ObjectiveId[];

  // Acciones
  setStudentInfo: (info: StudentInfo) => void;
  setCurrentProblem: (problemId: ProblemId) => void;
  setCurrentObjective: (objectiveId: ObjectiveId) => void;

  updateProblemAttempt: (problemId: ProblemId, attempt: Partial<ProblemAttempt>) => void;
  completeProblem: (problemId: ProblemId, puntaje: number, respuesta: string | number) => void;

  addHintUsed: (problemId: ProblemId, hintLevel: number) => void;
  incrementAttempts: (problemId: ProblemId) => void;

  calculateMetrics: () => void;
  resetProgress: () => void;
  exportProgress: () => UserProgress;
}

const initialProblemAttempt: ProblemAttempt = {
  intentos: 0,
  pistas_usadas: [],
  tiempo_gastado: 0,
  respuesta_final: null,
  es_correcto: false,
  puntaje: 0,
  pasos_completados: [],
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      studentInfo: null,
      problemas: {} as any as any as any,
      currentProblem: null,
      currentObjective: null,
      porcentaje_completado: 0,
      puntaje_promedio: 0,
      tiempo_total: 0,
      objetivos_completados: [],

      // Acciones
      setStudentInfo: (info) => set({ studentInfo: info }),

      setCurrentProblem: (problemId) => set({ currentProblem: problemId }),

      setCurrentObjective: (objectiveId) => set({ currentObjective: objectiveId }),

      updateProblemAttempt: (problemId, attempt) => {
        const problemas = get().problemas;
        const currentAttempt = problemas[problemId] || { ...initialProblemAttempt };

        set({
          problemas: {
            ...problemas,
            [problemId]: { ...currentAttempt, ...attempt }
          }
        });

        get().calculateMetrics();
      },

      completeProblem: (problemId, puntaje, respuesta) => {
        get().updateProblemAttempt(problemId, {
          es_correcto: true,
          puntaje,
          respuesta_final: respuesta,
          fecha_completado: new Date(),
        });
      },

      addHintUsed: (problemId, hintLevel) => {
        const problemas = get().problemas;
        const attempt = problemas[problemId] || { ...initialProblemAttempt };

        set({
          problemas: {
            ...problemas,
            [problemId]: {
              ...attempt,
              pistas_usadas: [...attempt.pistas_usadas, hintLevel]
            }
          }
        });
      },

      incrementAttempts: (problemId) => {
        const problemas = get().problemas;
        const attempt = problemas[problemId] || { ...initialProblemAttempt };

        set({
          problemas: {
            ...problemas,
            [problemId]: {
              ...attempt,
              intentos: attempt.intentos + 1
            }
          }
        });
      },

      calculateMetrics: () => {
        const { problemas } = get();
        const totalProblemas = 8; // 8 problemas en total
        const problemasArray = Object.values(problemas);

        // Calcular problemas completados
        const completados = problemasArray.filter(p => p.es_correcto).length;
        const porcentaje_completado = (completados / totalProblemas) * 100;

        // Calcular puntaje promedio
        const puntajes = problemasArray.map(p => p.puntaje);
        const puntaje_promedio = puntajes.length > 0
          ? puntajes.reduce((a, b) => a + b, 0) / puntajes.length
          : 0;

        // Calcular tiempo total
        const tiempo_total = problemasArray.reduce((total, p) => total + p.tiempo_gastado, 0);

        // Calcular objetivos completados
        const objetivosMap: Record<string, number> = {
          'I.1': 2, 'I.2': 2, 'II.1': 2, 'II.2': 2
        };

        const objetivos_completados: ObjectiveId[] = [];
        Object.entries(problemas).forEach(([id, attempt]) => {
          if (attempt.es_correcto) {
            const objId = id.substring(0, id.lastIndexOf('.')) as ObjectiveId;
            if (!objetivos_completados.includes(objId)) {
              // Verificar si todos los problemas del objetivo están completados
              const problemasObjetivo = Object.entries(problemas)
                .filter(([pid]) => pid.startsWith(objId))
                .filter(([, att]) => att.es_correcto);

              if (problemasObjetivo.length === objetivosMap[objId]) {
                objetivos_completados.push(objId);
              }
            }
          }
        });

        set({
          porcentaje_completado,
          puntaje_promedio,
          tiempo_total,
          objetivos_completados
        });
      },

      resetProgress: () => set({
        problemas: {} as any as any,
        currentProblem: null,
        currentObjective: null,
        porcentaje_completado: 0,
        puntaje_promedio: 0,
        tiempo_total: 0,
        objetivos_completados: [],
      }),

      exportProgress: () => {
        const state = get();
        return {
          studentInfo: state.studentInfo!,
          problemas: new Map(Object.entries(state.problemas)) as Map<ProblemId, ProblemAttempt>,
          porcentaje_completado: state.porcentaje_completado,
          puntaje_promedio: state.puntaje_promedio,
          tiempo_total: state.tiempo_total,
          objetivos_completados: state.objetivos_completados,
          ultima_actualizacion: new Date(),
        };
      },
    }),
    {
      name: 'tsp1-progress-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
