/**
 * Página AchievementsPage - Muestra los logros del estudiante
 * TSP1 - Matemática III
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';
import achievements, { getAchievementColor, getAchievementBorder, type Achievement, type AchievementStats } from '../data/achievements';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      },
  },
};

export const AchievementsPage: React.FC = () => {
  const navigate = useNavigate();
  const problemas = useProgressStore((state) => state.problemas);
  const objetivosCompletados = useProgressStore((state) => state.objetivos_completados);
  const puntajePromedio = useProgressStore((state) => state.puntaje_promedio);

  // Calcular estadísticas para los logros
  const stats: AchievementStats = useMemo(() => {
    const problemasArray = Object.values(problemas);
    const completados = problemasArray.filter(p => p.es_correcto);
    const pistasUsadasTotal = problemasArray.reduce((sum, p) => sum + (p.pistas_usadas?.length || 0), 0);
    const intentosTotal = problemasArray.reduce((sum, p) => sum + p.intentos, 0);

    // Calcular racha (simplificado - problemas completados consecutivos)
    let racha = 0;
    let rachaActual = 0;
    problemasArray.forEach(p => {
      if (p.es_correcto) {
        rachaActual++;
        racha = Math.max(racha, rachaActual);
      } else if (p.intentos > 0) {
        rachaActual = 0;
      }
    });

    return {
      problemasCompletados: completados.length,
      objetivosCompletados: objetivosCompletados.length,
      puntajePromedio,
      pistasUsadas: pistasUsadasTotal,
      intentosTotales: intentosTotal,
      racha,
    };
  }, [problemas, objetivosCompletados, puntajePromedio]);

  // Determinar qué logros están desbloqueados
  const achievementsWithStatus = useMemo(() => {
    return achievements.map(achievement => ({
      ...achievement,
      desbloqueado: achievement.criterio(stats),
    }));
  }, [stats]);

  const logrosDesbloqueados = achievementsWithStatus.filter(a => a.desbloqueado);
  const logrosBloqueados = achievementsWithStatus.filter(a => !a.desbloqueado && !a.oculto);
  const logrosOcultos = achievementsWithStatus.filter(a => !a.desbloqueado && a.oculto);

  const porcentajeCompletado = Math.round((logrosDesbloqueados.length / achievements.length) * 100);

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-vibrant-purple to-deep-blue rounded-xl p-4 sm:p-6 md:p-8 text-white mb-6 sm:mb-8 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-5xl sm:text-6xl"
            >
              🏆
            </motion.div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-fredoka mb-2">
                Tus Logros
              </h1>
              <p className="text-base sm:text-lg opacity-90">
                Colecciona logros mientras dominas el cálculo integral
              </p>
            </div>
          </div>

          {/* Progreso de logros */}
          <div className="mt-6 bg-white bg-opacity-20 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progreso de logros</span>
              <span className="font-semibold">
                {logrosDesbloqueados.length}/{achievements.length} desbloqueados
              </span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${porcentajeCompletado}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className="h-full rounded-full bg-white"
              />
            </div>
            <div className="text-center mt-2 text-2xl font-bold">
              {porcentajeCompletado}%
            </div>
          </div>
        </motion.div>

        {/* Estadísticas rápidas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={cardVariants} className="card text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-fredoka text-deep-blue">
              {stats.problemasCompletados}/8
            </div>
            <div className="text-xs text-gray-600">Problemas</div>
          </motion.div>
          <motion.div variants={cardVariants} className="card text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-fredoka text-vibrant-purple">
              {Math.round(stats.puntajePromedio)}
            </div>
            <div className="text-xs text-gray-600">Promedio</div>
          </motion.div>
          <motion.div variants={cardVariants} className="card text-center">
            <div className="text-3xl mb-2">💡</div>
            <div className="text-2xl font-fredoka text-golden-yellow">
              {stats.pistasUsadas}
            </div>
            <div className="text-xs text-gray-600">Pistas</div>
          </motion.div>
          <motion.div variants={cardVariants} className="card text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-fredoka text-coral-warning">
              {stats.racha}
            </div>
            <div className="text-xs text-gray-600">Racha</div>
          </motion.div>
        </motion.div>

        {/* Logros desbloqueados */}
        {logrosDesbloqueados.length > 0 && (
          <div className="mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl font-fredoka text-deep-blue mb-4"
            >
              ✨ Logros Desbloqueados ({logrosDesbloqueados.length})
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {logrosDesbloqueados.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} desbloqueado={true} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Logros bloqueados */}
        {logrosBloqueados.length > 0 && (
          <div className="mb-8">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl font-fredoka text-gray-600 mb-4"
            >
              🔒 Logros por Desbloquear ({logrosBloqueados.length})
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {logrosBloqueados.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} desbloqueado={false} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Logros ocultos */}
        {logrosOcultos.length > 0 && (
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl sm:text-2xl font-fredoka text-gray-400 mb-4"
            >
              🎭 Logros Secretos ({logrosOcultos.length})
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {logrosOcultos.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  variants={cardVariants}
                  className="card opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl opacity-50">❓</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-600">Logro Secreto</h3>
                      <p className="text-xs text-gray-500">Sigue explorando para descubrirlo</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para tarjeta de logro individual
const AchievementCard: React.FC<{ achievement: Achievement & { desbloqueado: boolean }; desbloqueado: boolean }> = ({
  achievement,
  desbloqueado,
}) => {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={desbloqueado ? { scale: 1.05, y: -5 } : {}}
      className={`card relative overflow-hidden ${desbloqueado ? '' : 'opacity-60'} border-l-4 ${getAchievementBorder(achievement.tipo)}`}
      role="article"
      aria-label={`${achievement.titulo}. ${achievement.descripcion}. ${desbloqueado ? 'Desbloqueado' : 'Bloqueado'}`}
    >
      {/* Indicador de desbloqueado */}
      {desbloqueado && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="absolute top-2 right-2"
        >
          <Trophy className="w-5 h-5 text-golden-yellow" />
        </motion.div>
      )}

      {/* Icono bloqueado */}
      {!desbloqueado && (
        <div className="absolute top-2 right-2 opacity-50">
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
      )}

      <div className="flex items-start space-x-3">
        <div className={`text-5xl ${!desbloqueado && 'grayscale opacity-50'}`}>
          {achievement.icono}
        </div>
        <div className="flex-1">
          <div className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white mb-1 bg-gradient-to-r ${getAchievementColor(achievement.tipo)}`}>
            {achievement.tipo.toUpperCase()}
          </div>
          <h3 className={`font-semibold mb-1 ${desbloqueado ? 'text-deep-blue' : 'text-gray-600'}`}>
            {achievement.titulo}
          </h3>
          <p className="text-xs text-gray-600">
            {achievement.descripcion}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementsPage;
