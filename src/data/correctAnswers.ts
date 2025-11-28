/**
 * Respuestas correctas para cada problema
 * TSP1 - Matemática III
 */

import type { ProblemId } from '../types';

export interface ProblemAnswer {
  type: 'numeric' | 'algebraic' | 'keywords';
  correctValues: (number | string)[];
  tolerance?: number;
  keywords?: {
    required: string[];
    optional: string[];
  };
}

export const correctAnswers: Record<ProblemId, ProblemAnswer> = {
  'I.1.1': {
    type: 'keywords',
    correctValues: [],
    keywords: {
      required: ['derivar', 'verificar', 'fórmula', 'integral'],
      optional: ['regla', 'cociente', 'cadena', 'simplificar'],
    },
  },

  'I.1.2': {
    type: 'numeric',
    correctValues: [
      4 - 2 * Math.atan(2), // Forma exacta
      1.771, // Aproximación decimal
      1.77,
      '4-2arctan(2)',
      '4-2*arctan(2)',
    ],
    tolerance: 0.01,
  },

  'I.2.1': {
    type: 'numeric',
    correctValues: [
      Math.PI, // π
      3.14159,
      3.1416,
      3.14,
      'pi',
      'π',
    ],
    tolerance: 0.01,
  },

  'I.2.2': {
    type: 'numeric',
    correctValues: [
      Math.PI / 2, // π/2
      1.5708,
      1.571,
      'pi/2',
      'π/2',
    ],
    tolerance: 0.01,
  },

  'II.1.1': {
    type: 'keywords',
    correctValues: [],
    keywords: {
      required: ['volumen', 'revolución', 'arandelas', 'integral'],
      optional: ['radio', 'exterior', 'interior', 'evaluar'],
    },
  },

  'II.1.2': {
    type: 'keywords',
    correctValues: [],
    keywords: {
      required: ['longitud', 'arco', 'derivar', 'integral'],
      optional: ['implícita', 'simplificar', 'calcular'],
    },
  },

  'II.2.1': {
    type: 'algebraic',
    correctValues: [
      'y=-πx/2+π²/4',
      'y=-(π/2)x+π²/4',
      'y=-pi*x/2+pi^2/4',
      '-πx/2+π²/4',
    ],
    tolerance: 0.01,
  },

  'II.2.2': {
    type: 'keywords',
    correctValues: [],
    keywords: {
      required: ['área', 'polar', 'intersección', 'integral'],
      optional: ['simetría', 'rosa', 'círculo', 'evaluar'],
    },
  },
};

export default correctAnswers;
