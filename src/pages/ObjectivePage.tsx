/**
 * Página ObjectivePage - Muestra todos los problemas de un objetivo
 * TSP1 - Matemática III
 */

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';
import problemsData from '../data/problems.json';
import type { ObjectiveId, Problem } from '../types';

const OBJECTIVE_ICONS: Record<string, string> = {
  'I.1': '⚗️',
  'I.2': '🔭',
  'II.1': '📐',
  'II.2': '🌀',
};

const OBJECTIVE_COLORS: Record<string, string> = {
  'I.1': 'from-blue-500 to-blue-600',
  'I.2': 'from-purple-500 to-purple-600',
  'II.1': 'from-green-500 to-green-600',
  'II.2': 'from-pink-500 to-pink-600',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  'media': 'Media',
  'media-dificil': 'Media-Difícil',
  'dificil': 'Difícil',
  'muy_dificil': 'Muy Difícil',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      },
  },
};

export const ObjectivePage: React.FC = () => {
  const { objectiveId } = useParams<{ objectiveId: ObjectiveId }>();
  const navigate = useNavigate();
  const problemas = useProgressStore((state) => state.problemas);

  // Encontrar el objetivo actual
  const objetivo = problemsData.objetivos.find(obj => obj.id === objectiveId);

  if (!objetivo) {
    return (
      <div className="min-h-screen bg-soft-cream flex items-center justify-center">
        <div className="card max-w-md">
          <h2 className="text-2xl font-fredoka text-coral-warning mb-4">Objetivo no encontrado</h2>
          <p className="text-gray-600 mb-4">El objetivo que buscas no existe.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getProblemStatus = (problem: Problem): 'completado' | 'en-progreso' | 'no-iniciado' => {
    const attempt = problemas[problem.id as keyof typeof problemas];

    if (attempt?.es_correcto) {
      return 'completado';
    }

    if (attempt && attempt.intentos > 0) {
      return 'en-progreso';
    }

    return 'no-iniciado';
  };

  const handleProblemClick = (problemId: string) => {
    navigate(`/problema/${problemId}`);
  };

  return (
    <div className="min-h-screen bg-soft-cream pattern-grid">
      <div className="container mx-auto px-4 py-8">
        {/* Botón volver */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-deep-blue hover:text-vibrant-purple transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Volver al Dashboard</span>
        </button>

        {/* Header del objetivo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-br ${OBJECTIVE_COLORS[objetivo.id]} rounded-xl p-4 sm:p-6 md:p-8 text-white mb-6 sm:mb-8 shadow-lg`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-5xl sm:text-6xl"
            >
              {OBJECTIVE_ICONS[objetivo.id]}
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-fredoka mb-2">
                {objetivo.id}: {objetivo.titulo}
              </h1>
              <p className="text-base sm:text-lg opacity-90">
                {objetivo.descripcion}
              </p>
            </div>
          </div>

          {/* Progreso del objetivo */}
          <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progreso del objetivo</span>
              <span className="font-semibold">
                {objetivo.problemas.filter(p =>
                  problemas[p.id as keyof typeof problemas]?.es_correcto
                ).length}/{objetivo.problemas.length} completados
              </span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
              <div
                className="h-full rounded-full bg-white"
                style={{
                  width: `${(objetivo.problemas.filter(p =>
                    problemas[p.id as keyof typeof problemas]?.es_correcto
                  ).length / objetivo.problemas.length) * 100}%`
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Lista de problemas */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-fredoka text-deep-blue"
          >
            Problemas
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {objetivo.problemas.map((problema, index) => {
              const status = getProblemStatus(problema as any);
              const attempt = problemas[problema.id as keyof typeof problemas];

              return (
                <motion.div
                  key={problema.id as string}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProblemClick(problema.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleProblemClick(problema.id);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Problema ${problema.id}. ${status === 'completado' ? 'Completado' : status === 'en-progreso' ? 'En progreso' : 'No iniciado'}. Dificultad: ${DIFFICULTY_LABELS[problema.dificultad]}`}
                  className="card hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-deep-blue focus:outline-none focus:ring-4 focus:ring-deep-blue focus:ring-opacity-50"
                >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Número y estado */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                        ${status === 'completado' ? 'bg-emerald-success' :
                          status === 'en-progreso' ? 'bg-golden-yellow' :
                          'bg-gray-400'}
                      `}>
                        {index + 1}
                      </div>

                      <div className="flex items-center space-x-2">
                        {status === 'completado' && (
                          <>
                            <CheckCircle className="w-5 h-5 text-emerald-success" />
                            <span className="text-emerald-success font-semibold">Completado</span>
                          </>
                        )}
                        {status === 'en-progreso' && (
                          <>
                            <PlayCircle className="w-5 h-5 text-golden-yellow" />
                            <span className="text-golden-yellow font-semibold">En Progreso</span>
                          </>
                        )}
                        {status === 'no-iniciado' && (
                          <span className="text-gray-500 font-semibold">No iniciado</span>
                        )}
                      </div>
                    </div>

                    {/* Título del problema */}
                    <h3 className="text-base sm:text-lg font-semibold text-deep-blue mb-2">
                      Problema {problema.id}
                    </h3>

                    {/* Enunciado */}
                    <p className="text-sm sm:text-base text-gray-700 mb-3 leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {problema.enunciado}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span className="font-semibold">Dificultad:</span>
                        <span className={`
                          px-2 py-1 rounded text-xs font-semibold
                          ${problema.dificultad === 'media' ? 'bg-green-100 text-green-700' :
                            problema.dificultad === 'media-dificil' ? 'bg-yellow-100 text-yellow-700' :
                            problema.dificultad === 'dificil' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'}
                        `}>
                          {DIFFICULTY_LABELS[problema.dificultad]}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <span className="font-semibold">Puntos:</span>
                        <span>{problema.puntos_maximos || 100}</span>
                      </div>

                      {attempt && (
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold">Intentos:</span>
                          <span>{attempt.intentos}</span>
                        </div>
                      )}

                      {attempt?.puntaje > 0 && (
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold">Puntaje:</span>
                          <span className="text-emerald-success font-bold">{attempt.puntaje}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Icono de flecha */}
                  <div className="ml-4">
                    <div className="w-10 h-10 rounded-full bg-deep-blue bg-opacity-10 flex items-center justify-center">
                      <ArrowLeft className="w-5 h-5 text-deep-blue transform rotate-180" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ObjectivePage;
