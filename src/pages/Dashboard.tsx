/**
 * Página Dashboard - Página principal con resumen de objetivos
 * TSP1 - Matemática III
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import ProgressBar from '../components/common/ProgressBar';
import { useProgressStore } from '../store/progressStore';
import problemsData from '../data/problems.json';
import type { ObjectiveId } from '../types';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      },
  },
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const studentInfo = useProgressStore((state) => state.studentInfo);
  const porcentajeCompletado = useProgressStore((state) => state.porcentaje_completado);
  const objetivosCompletados = useProgressStore((state) => state.objetivos_completados);
  const problemas = useProgressStore((state) => state.problemas);
  const setStudentInfo = useProgressStore((state) => state.setStudentInfo);

  useEffect(() => {
    // Si no hay información del estudiante, solicitar
    if (!studentInfo) {
      const nombre = prompt('Ingresa tu nombre completo:');
      const id = prompt('Ingresa tu número de cédula:');
      const centroLocal = prompt('Ingresa tu centro local (opcional):') || undefined;

      if (nombre && id) {
        setStudentInfo({
          nombre,
          id,
          centro_local: centroLocal,
          inicio_sesion: new Date(),
        });
      }
    }
  }, [studentInfo, setStudentInfo]);

  const getObjectiveStatus = (objectiveId: ObjectiveId): 'completado' | 'activo' | 'bloqueado' => {
    if (objetivosCompletados.includes(objectiveId)) {
      return 'completado';
    }

    // Verificar si algún problema del objetivo está iniciado
    const problemasObjetivo = (problemsData.objetivos.find(obj => obj.id === objectiveId)?.problemas || []);
    const algunoIniciado = problemasObjetivo.some(prob => {
      const attempt = problemas[prob.id as keyof typeof problemas];
      return attempt && attempt.intentos > 0;
    });

    if (algunoIniciado) {
      return 'activo';
    }

    // Todos los objetivos están desbloqueados para acceso libre
    return 'activo';
  };

  const handleObjectiveClick = (objectiveId: ObjectiveId) => {
    const status = getObjectiveStatus(objectiveId);
    if (status !== 'bloqueado') {
      navigate(`/objetivo/${objectiveId}`);
    }
  };

  return (
    <div className="min-h-screen bg-soft-cream pattern-grid">
      <div className="container mx-auto px-4 py-8">
        {/* Bienvenida */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-fredoka text-deep-blue mb-2">
              Calculus Quest
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              La Aventura de la Integración - TSP1 Matemática III
            </p>
          </div>
          <button
            onClick={() => navigate('/logros')}
            className="btn-secondary whitespace-nowrap flex items-center space-x-2"
            aria-label="Ver mis logros y achievements"
          >
            <span>🏆</span>
            <span>Mis Logros</span>
          </button>
        </div>

        {/* Barra de progreso global */}
        <div className="mb-12 card">
          <ProgressBar
            porcentaje={porcentajeCompletado}
            gemas={objetivosCompletados.length * 10}
            totalGemas={40}
          />
        </div>

        {/* Mapa de Reinos (Objetivos) */}
        <div className="mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-fredoka text-deep-blue mb-6"
          >
            🗺️ Mapa de Reinos
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {problemsData.objetivos.map((objetivo: any) => {
              const status = getObjectiveStatus(objetivo.id);
              const isLocked = status === 'bloqueado';
              const isCompleted = status === 'completado';
              const isActive = status === 'activo';

              return (
                <motion.div
                  key={objetivo.id}
                  variants={cardVariants}
                  whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                  onClick={() => handleObjectiveClick(objetivo.id)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isLocked) {
                      e.preventDefault();
                      handleObjectiveClick(objetivo.id);
                    }
                  }}
                  tabIndex={isLocked ? -1 : 0}
                  role="button"
                  aria-label={`${objetivo.titulo}. ${objetivo.descripcion}. ${
                    isCompleted ? 'Completado' : isActive ? 'En progreso' : 'Bloqueado'
                  }`}
                  aria-disabled={isLocked}
                  className={`
                    relative overflow-hidden rounded-xl shadow-lg transition-all duration-300
                    ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer focus:outline-none focus:ring-4 focus:ring-deep-blue focus:ring-opacity-50'}
                  `}
                >
                  {/* Fondo degradado */}
                  <div className={`bg-gradient-to-br ${OBJECTIVE_COLORS[objetivo.id]} p-4 sm:p-6 text-white`}>
                    {/* Estado visual */}
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      {isCompleted && <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-success" />}
                      {isActive && !isCompleted && <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-golden-yellow" />}
                      {isLocked && <Lock className="w-6 h-6 sm:w-8 sm:h-8" />}
                    </div>

                    {/* Icono del objetivo */}
                    <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">
                      {OBJECTIVE_ICONS[objetivo.id]}
                    </div>

                    {/* Título */}
                    <h3 className="text-lg sm:text-xl font-fredoka mb-2">
                      {objetivo.id}: {objetivo.titulo}
                    </h3>

                    {/* Descripción */}
                    <p className="text-xs sm:text-sm opacity-90 mb-3 sm:mb-4 line-clamp-2">
                      {objetivo.descripcion}
                    </p>

                    {/* Contador de problemas */}
                    <div className="flex items-center justify-between text-sm">
                      <span>
                        {objetivo.problemas.length} problemas
                      </span>
                      {isCompleted && (
                        <span className="bg-white text-green-600 px-2 py-1 rounded font-semibold text-xs">
                          ✓ Completado
                        </span>
                      )}
                      {isActive && !isCompleted && (
                        <span className="bg-white text-blue-600 px-2 py-1 rounded font-semibold text-xs">
                          En Progreso
                        </span>
                      )}
                      {isLocked && (
                        <span className="bg-white bg-opacity-20 px-2 py-1 rounded font-semibold text-xs">
                          🔒 Bloqueado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Indicador de progreso del objetivo */}
                  {!isLocked && (
                    <div className="bg-white p-3">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progreso</span>
                        <span>
                          {objetivo.problemas.filter((p: any) =>
                            problemas[p.id as keyof typeof problemas]?.es_correcto
                          ).length}/{objetivo.problemas.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${OBJECTIVE_COLORS[objetivo.id]}`}
                          style={{
                            width: `${(objetivo.problemas.filter((p: any) =>
                              problemas[p.id as keyof typeof problemas]?.es_correcto
                            ).length / objetivo.problemas.length) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Estadísticas rápidas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.div variants={cardVariants} className="card text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="text-4xl font-fredoka text-deep-blue mb-2"
            >
              {Object.values(problemas).filter((p: any) => p.es_correcto).length}/8
            </motion.div>
            <div className="text-gray-600">Problemas Completados</div>
          </motion.div>
          <motion.div variants={cardVariants} className="card text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="text-4xl font-fredoka text-vibrant-purple mb-2"
            >
              {objetivosCompletados.length}/4
            </motion.div>
            <div className="text-gray-600">Objetivos Completados</div>
          </motion.div>
          <motion.div variants={cardVariants} className="card text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
              className="text-4xl font-fredoka text-golden-yellow mb-2"
            >
              {Math.round(useProgressStore.getState().puntaje_promedio)}
            </motion.div>
            <div className="text-gray-600">Puntuación Promedio</div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
