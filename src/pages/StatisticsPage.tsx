/**
 * Página StatisticsPage - Estadísticas detalladas del progreso
 * TSP1 - Matemática III
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Target, Clock, Lightbulb, Award, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProgressStore } from '../store/progressStore';
import problemsData from '../data/problems.json';

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const StatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const problemas = useProgressStore((state) => state.problemas);
  const objetivosCompletados = useProgressStore((state) => state.objetivos_completados);
  const puntajePromedio = useProgressStore((state) => state.puntaje_promedio);
  const porcentajeCompletado = useProgressStore((state) => state.porcentaje_completado);

  // Calcular estadísticas detalladas
  const stats = useMemo(() => {
    const problemasArray = Object.entries(problemas);
    const completados = problemasArray.filter(([_, p]) => p.es_correcto);
    const enProgreso = problemasArray.filter(([_, p]) => p.intentos > 0 && !p.es_correcto);
    const noIniciados = problemasArray.filter(([_, p]) => p.intentos === 0);

    const totalIntentos = problemasArray.reduce((sum, [_, p]) => sum + p.intentos, 0);
    const totalPistasUsadas = problemasArray.reduce((sum, [_, p]) => sum + (p.pistas_usadas?.length || 0), 0);
    const puntajeTotal = completados.reduce((sum, [_, p]) => sum + p.puntaje, 0);

    // Calcular tasa de éxito
    const tasaExito = totalIntentos > 0 ? (completados.length / totalIntentos) * 100 : 0;

    // Problemas por objetivo
    const problemasPorObjetivo = problemsData.objetivos.map((obj) => {
      const problemasObj = obj.problemas.map(p => p.id);
      const completadosObj = problemasObj.filter(id => problemas[id as keyof typeof problemas]?.es_correcto).length;
      return {
        id: obj.id,
        titulo: obj.titulo,
        total: problemasObj.length,
        completados: completadosObj,
        porcentaje: (completadosObj / problemasObj.length) * 100,
      };
    });

    // Mejor y peor rendimiento
    const problemasConPuntaje = completados
      .map(([id, p]) => ({
        id,
        puntaje: p.puntaje,
        intentos: p.intentos,
      }))
      .sort((a, b) => b.puntaje - a.puntaje);

    const mejorPuntaje = problemasConPuntaje[0];
    const peorPuntaje = problemasConPuntaje[problemasConPuntaje.length - 1];

    // Promedio de intentos por problema completado
    const promedioIntentos = completados.length > 0
      ? completados.reduce((sum, [_, p]) => sum + p.intentos, 0) / completados.length
      : 0;

    // Uso eficiente de pistas
    const problemasConPistas = completados.filter(([_, p]) => (p.pistas_usadas?.length || 0) > 0).length;
    const porcentajePistas = completados.length > 0 ? (problemasConPistas / completados.length) * 100 : 0;

    return {
      total: 8,
      completados: completados.length,
      enProgreso: enProgreso.length,
      noIniciados: noIniciados.length,
      totalIntentos,
      totalPistasUsadas,
      puntajeTotal,
      tasaExito,
      problemasPorObjetivo,
      mejorPuntaje,
      peorPuntaje,
      promedioIntentos,
      porcentajePistas,
    };
  }, [problemas]);

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
          className="bg-gradient-to-br from-deep-blue to-vibrant-purple rounded-xl p-4 sm:p-6 md:p-8 text-white mb-6 sm:mb-8 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-5xl sm:text-6xl"
            >
              📊
            </motion.div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl sm:text-3xl font-fredoka mb-2">
                Estadísticas Detalladas
              </h1>
              <p className="text-base sm:text-lg opacity-90">
                Análisis completo de tu desempeño en TSP1
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg px-6 py-4 text-center">
              <div className="text-4xl font-fredoka">{Math.round(porcentajeCompletado)}%</div>
              <div className="text-sm opacity-90">Completado</div>
            </div>
          </div>
        </motion.div>

        {/* Métricas principales */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={cardVariants} className="card text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-emerald-success" />
            <div className="text-3xl font-fredoka text-deep-blue">{stats.completados}/{stats.total}</div>
            <div className="text-xs text-gray-600">Problemas Completados</div>
          </motion.div>

          <motion.div variants={cardVariants} className="card text-center">
            <Activity className="w-8 h-8 mx-auto mb-2 text-golden-yellow" />
            <div className="text-3xl font-fredoka text-vibrant-purple">{stats.totalIntentos}</div>
            <div className="text-xs text-gray-600">Total Intentos</div>
          </motion.div>

          <motion.div variants={cardVariants} className="card text-center">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 text-vibrant-purple" />
            <div className="text-3xl font-fredoka text-golden-yellow">{stats.totalPistasUsadas}</div>
            <div className="text-xs text-gray-600">Pistas Usadas</div>
          </motion.div>

          <motion.div variants={cardVariants} className="card text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-deep-blue" />
            <div className="text-3xl font-fredoka text-emerald-success">{Math.round(puntajePromedio)}</div>
            <div className="text-xs text-gray-600">Puntaje Promedio</div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribución de problemas */}
          <motion.div variants={cardVariants} className="card">
            <h2 className="text-xl font-fredoka text-deep-blue mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Distribución de Problemas
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-emerald-success"></div>
                  <span className="text-sm">Completados</span>
                </div>
                <span className="font-semibold text-emerald-success">{stats.completados}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-golden-yellow"></div>
                  <span className="text-sm">En Progreso</span>
                </div>
                <span className="font-semibold text-golden-yellow">{stats.enProgreso}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded bg-gray-400"></div>
                  <span className="text-sm">No Iniciados</span>
                </div>
                <span className="font-semibold text-gray-600">{stats.noIniciados}</span>
              </div>
            </div>

            {/* Barra de progreso visual */}
            <div className="mt-6">
              <div className="h-8 bg-gray-200 rounded-full overflow-hidden flex">
                {stats.completados > 0 && (
                  <div
                    className="bg-emerald-success flex items-center justify-center text-white text-xs font-semibold"
                    style={{ width: `${(stats.completados / stats.total) * 100}%` }}
                  >
                    {stats.completados > 0 && `${stats.completados}`}
                  </div>
                )}
                {stats.enProgreso > 0 && (
                  <div
                    className="bg-golden-yellow flex items-center justify-center text-white text-xs font-semibold"
                    style={{ width: `${(stats.enProgreso / stats.total) * 100}%` }}
                  >
                    {stats.enProgreso > 0 && `${stats.enProgreso}`}
                  </div>
                )}
                {stats.noIniciados > 0 && (
                  <div
                    className="bg-gray-400 flex items-center justify-center text-white text-xs font-semibold"
                    style={{ width: `${(stats.noIniciados / stats.total) * 100}%` }}
                  >
                    {stats.noIniciados > 0 && `${stats.noIniciados}`}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Métricas de rendimiento */}
          <motion.div variants={cardVariants} className="card">
            <h2 className="text-xl font-fredoka text-deep-blue mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Métricas de Rendimiento
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Tasa de Éxito</span>
                  <span className="font-semibold text-emerald-success">{stats.tasaExito.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-emerald-success"
                    style={{ width: `${stats.tasaExito}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Promedio de Intentos</span>
                  <span className="font-semibold text-vibrant-purple">{stats.promedioIntentos.toFixed(1)}</span>
                </div>
                <div className="text-xs text-gray-500">Por problema completado</div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Uso de Pistas</span>
                  <span className="font-semibold text-golden-yellow">{stats.porcentajePistas.toFixed(0)}%</span>
                </div>
                <div className="text-xs text-gray-500">Problemas con pistas</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progreso por objetivo */}
        <motion.div variants={cardVariants} className="card mb-8">
          <h2 className="text-xl font-fredoka text-deep-blue mb-4 flex items-center">
            <Activity className="w-6 h-6 mr-2" />
            Progreso por Objetivo
          </h2>
          <div className="space-y-4">
            {stats.problemasPorObjetivo.map((obj) => (
              <div key={obj.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-deep-blue">{obj.id}: {obj.titulo}</span>
                  <span className="text-sm font-semibold">{obj.completados}/{obj.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-vibrant-purple to-deep-blue"
                    style={{ width: `${obj.porcentaje}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-600 mt-1">{obj.porcentaje.toFixed(0)}% completado</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mejores y peores rendimientos */}
        {stats.completados > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.mejorPuntaje && (
              <motion.div variants={cardVariants} className="card bg-gradient-to-br from-emerald-50 to-green-50 border-l-4 border-emerald-success">
                <h3 className="font-fredoka text-deep-blue mb-2 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-emerald-success" />
                  Mejor Rendimiento
                </h3>
                <p className="text-2xl font-bold text-emerald-success mb-1">Problema {stats.mejorPuntaje.id}</p>
                <p className="text-sm text-gray-600">
                  Puntaje: <span className="font-semibold">{stats.mejorPuntaje.puntaje}</span> |
                  Intentos: <span className="font-semibold">{stats.mejorPuntaje.intentos}</span>
                </p>
              </motion.div>
            )}

            {stats.peorPuntaje && stats.completados > 1 && (
              <motion.div variants={cardVariants} className="card bg-gradient-to-br from-orange-50 to-yellow-50 border-l-4 border-golden-yellow">
                <h3 className="font-fredoka text-deep-blue mb-2 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2 text-golden-yellow" />
                  Área de Mejora
                </h3>
                <p className="text-2xl font-bold text-golden-yellow mb-1">Problema {stats.peorPuntaje.id}</p>
                <p className="text-sm text-gray-600">
                  Puntaje: <span className="font-semibold">{stats.peorPuntaje.puntaje}</span> |
                  Intentos: <span className="font-semibold">{stats.peorPuntaje.intentos}</span>
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
