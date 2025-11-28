/**
 * Página ProblemSolver - Interfaz para resolver un problema paso a paso
 * TSP1 - Matemática III
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, Info } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';
import VisualizationPanel from '../components/visualizations/VisualizationPanel';
import problemsData from '../data/problems.json';
import hints from '../data/hints';
import correctAnswers from '../data/correctAnswers';
import { validateNumericAnswer, validateAlgebraicExpression, validateKeywords } from '../utils/mathValidator';
import type { Problem, ProblemId } from '../types';

const HINT_LEVELS = [
  { level: 1, label: 'Pista Direccional', color: 'bg-blue-100 text-blue-700' },
  { level: 2, label: 'Pista Explicativa', color: 'bg-green-100 text-green-700' },
  { level: 3, label: 'Pista Detallada', color: 'bg-yellow-100 text-yellow-700' },
  { level: 4, label: 'Ayuda Visual', color: 'bg-orange-100 text-orange-700' },
  { level: 5, label: 'Solución Completa', color: 'bg-red-100 text-red-700' },
];

export const ProblemSolver: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const navigate = useNavigate();

  const [respuesta, setRespuesta] = useState('');
  const [pistasUsadas, setPistasUsadas] = useState<number[]>([]);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [esCorrecta, setEsCorrecta] = useState(false);
  const [feedbackMensaje, setFeedbackMensaje] = useState('');
  const [tiempoInicio] = useState(new Date());

  const problemas = useProgressStore((state) => state.problemas);
  const incrementAttempts = useProgressStore((state) => state.incrementAttempts);
  const addHintUsed = useProgressStore((state) => state.addHintUsed);
  const completeProblem = useProgressStore((state) => state.completeProblem);

  // Encontrar el problema
  let problema: Problem | undefined;
  let objetivoId: string = '';

  for (const objetivo of problemsData.objetivos) {
    const found = objetivo.problemas.find(p => p.id === problemId);
    if (found) {
      problema = found;
      objetivoId = objetivo.id;
      break;
    }
  }

  if (!problema) {
    return (
      <div className="min-h-screen bg-soft-cream flex items-center justify-center">
        <div className="card max-w-md">
          <h2 className="text-2xl font-fredoka text-coral-warning mb-4">Problema no encontrado</h2>
          <p className="text-gray-600 mb-4">El problema que buscas no existe.</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const attempt = problemas[problemId as ProblemId];
  const problemHints = hints[problemId as ProblemId] || [];

  const handlePistaClick = (nivel: number) => {
    if (!pistasUsadas.includes(nivel)) {
      setPistasUsadas([...pistasUsadas, nivel]);
      addHintUsed(problemId as ProblemId, nivel);
    }
  };

  const handleVerificarRespuesta = () => {
    incrementAttempts(problemId as ProblemId);

    // Obtener respuesta correcta del problema
    const answerConfig = correctAnswers[problemId as ProblemId];
    let validation;

    if (!answerConfig) {
      // Fallback: validación básica
      validation = {
        esCorrecta: respuesta.trim().length > 0,
        feedback: 'Respuesta registrada. Consulta con tu profesor para la evaluación final.',
        puntajeParcial: 100,
      };
    } else {
      // Validación real según el tipo
      switch (answerConfig.type) {
        case 'numeric':
          validation = validateNumericAnswer(
            respuesta,
            answerConfig.correctValues,
            answerConfig.tolerance
          );
          break;
        case 'algebraic':
          validation = validateAlgebraicExpression(
            respuesta,
            answerConfig.correctValues as string[]
          );
          break;
        case 'keywords':
          validation = validateKeywords(
            respuesta,
            answerConfig.keywords?.required || [],
            answerConfig.keywords?.optional || []
          );
          break;
        default:
          validation = {
            esCorrecta: false,
            feedback: 'Tipo de validación no soportado.',
            puntajeParcial: 0,
          };
      }
    }

    setEsCorrecta(validation.esCorrecta);
    setFeedbackMensaje(validation.feedback || '');
    setMostrarResultado(true);

    if (validation.esCorrecta) {
      const tiempoTranscurrido = Math.floor((new Date().getTime() - tiempoInicio.getTime()) / 1000);
      const penalizacion = pistasUsadas.length * 5;
      const puntajeBase = validation.puntajeParcial || 100;
      const puntaje = Math.max(0, puntajeBase - penalizacion);

      completeProblem(problemId as ProblemId, puntaje, respuesta);
    }
  };

  return (
    <div className="min-h-screen bg-soft-cream pattern-grid">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <button
          onClick={() => navigate(`/objetivo/${objetivoId}`)}
          className="flex items-center space-x-2 text-deep-blue hover:text-vibrant-purple transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Volver a {objetivoId}</span>
        </button>

        {/* Card principal del problema */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-fredoka text-deep-blue mb-2">
                Problema {problema.id}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold whitespace-nowrap">
                  {problema.tipo.replace(/_/g, ' ')}
                </span>
                <span className="whitespace-nowrap">Puntos máximos: {problema.puntos_maximos || 100}</span>
                {attempt && <span className="whitespace-nowrap">Intentos: {attempt.intentos}</span>}
              </div>
            </div>

            {attempt?.es_correcto && (
              <div className="flex items-center space-x-2 text-emerald-success">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="font-semibold text-sm sm:text-base">Completado</span>
              </div>
            )}
          </div>

          {/* Enunciado */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-deep-blue mb-3 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Enunciado
            </h2>
            <div className="text-gray-700 text-lg leading-relaxed">
              {problema.enunciado}
            </div>
          </div>

          {/* Método de solución sugerido */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-deep-blue mb-2">💡 Método sugerido:</h3>
            <p className="text-gray-700">{problema.metodo_solucion}</p>
          </div>

          {/* Pasos */}
          {Array.isArray(problema.pasos) && typeof problema.pasos[0] === 'string' && (
            <div className="mb-6">
              <h3 className="font-semibold text-deep-blue mb-3">📝 Pasos a seguir:</h3>
              <ol className="space-y-2">
                {(problema.pasos as string[]).map((paso, index) => (
                  <li key={index} className="flex">
                    <span className="font-semibold text-vibrant-purple mr-2">{index + 1}.</span>
                    <span className="text-gray-700">{paso}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Errores comunes */}
          {problema.errores_comunes && problema.errores_comunes.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Errores comunes:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {problema.errores_comunes.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Panel de visualización */}
        {problema.visualizacion && (
          <div className="mb-6">
            <VisualizationPanel problem={problema} />
          </div>
        )}

        {/* Sistema de pistas */}
        {!attempt?.es_correcto && (
          <div className="card mb-6">
            <h2 className="text-xl font-fredoka text-deep-blue mb-4 flex items-center">
              <Lightbulb className="w-6 h-6 mr-2 text-golden-yellow" />
              Sistema de Pistas
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Cada pista reduce tu puntuación en 5 puntos. Úsalas sabiamente.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {HINT_LEVELS.map((hint, index) => {
                const realHint = problemHints.find(h => h.nivel === hint.level);
                const isUsed = pistasUsadas.includes(hint.level);

                return (
                  <motion.button
                    key={hint.level}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={!isUsed ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isUsed ? { scale: 0.98 } : {}}
                    onClick={() => handlePistaClick(hint.level)}
                    disabled={isUsed}
                    aria-label={`${hint.label}, Nivel ${hint.level}. ${isUsed ? 'Pista revelada' : 'Clic para ver pista'}. Penalización: ${realHint?.deduccion || 5} puntos`}
                    aria-pressed={isUsed}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${isUsed
                        ? `${hint.color} border-current`
                        : 'bg-white border-gray-200 hover:border-deep-blue hover:shadow-md focus:outline-none focus:ring-4 focus:ring-deep-blue focus:ring-opacity-50'}
                      ${isUsed ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{hint.label}</div>
                        <div className="text-xs text-gray-600">Nivel {hint.level} • -{realHint?.deduccion || 5} pts</div>
                      </div>
                      <AnimatePresence>
                        {isUsed && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            <CheckCircle className="w-5 h-5" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <AnimatePresence>
                      {isUsed && realHint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 p-3 bg-white bg-opacity-50 rounded text-sm text-gray-800 leading-relaxed overflow-hidden"
                        >
                          <div className="font-semibold text-xs text-gray-600 mb-1">
                            {realHint.utilidad}
                          </div>
                          {realHint.texto}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Área de respuesta */}
        {!attempt?.es_correcto && (
          <div className="card">
            <h2 className="text-xl font-fredoka text-deep-blue mb-4">
              ✍️ Tu Respuesta
            </h2>

            <div className="mb-4">
              <label htmlFor="respuesta-input" className="block text-sm font-semibold text-gray-700 mb-2">
                Ingresa tu respuesta final:
              </label>
              <textarea
                id="respuesta-input"
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                className="math-input h-32"
                aria-describedby="respuesta-hint"
                aria-required="true"
              />
              <span id="respuesta-hint" className="sr-only">
                Ingresa tu respuesta matemática completa para este problema
              </span>
            </div>

            <button
              onClick={handleVerificarRespuesta}
              disabled={!respuesta.trim()}
              aria-label={`Verificar respuesta. ${!respuesta.trim() ? 'Primero ingresa una respuesta' : 'Presiona para enviar tu respuesta'}`}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-deep-blue focus:ring-opacity-50"
            >
              Verificar Respuesta
            </button>

            {/* Resultado de la verificación */}
            <AnimatePresence>
              {mostrarResultado && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mt-4 p-4 rounded-lg ${esCorrecta ? 'bg-green-50' : 'bg-red-50'}`}
                >
                  <div className="flex items-center space-x-2">
                    {esCorrecta ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <CheckCircle className="w-6 h-6 text-emerald-success" />
                        </motion.div>
                        <div>
                          <span className="font-semibold text-emerald-success block">
                            ¡Correcto! Puntaje: {Math.max(0, 100 - (pistasUsadas.length * 5))}
                          </span>
                          {feedbackMensaje && (
                            <span className="text-sm text-gray-700">{feedbackMensaje}</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          <XCircle className="w-6 h-6 text-coral-warning" />
                        </motion.div>
                        <div>
                          <span className="font-semibold text-coral-warning block">
                            Incorrecto. Intenta de nuevo.
                          </span>
                          {feedbackMensaje && (
                            <span className="text-sm text-gray-700">{feedbackMensaje}</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Problema completado */}
        {attempt?.es_correcto && (
          <div className="card bg-gradient-to-br from-emerald-50 to-green-50">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-emerald-success mx-auto mb-4" />
              <h2 className="text-2xl font-fredoka text-emerald-success mb-2">
                ¡Problema Completado!
              </h2>
              <p className="text-gray-700 mb-4">
                Puntaje obtenido: <span className="font-bold text-2xl">{attempt.puntaje}</span>
              </p>
              <button
                onClick={() => navigate(`/objetivo/${objetivoId}`)}
                className="btn-primary"
              >
                Volver a los Problemas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemSolver;
