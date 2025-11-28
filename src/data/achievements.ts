/**
 * Sistema de logros y achievements
 * TSP1 - Matemática III
 */

export interface Achievement {
  id: string;
  titulo: string;
  descripcion: string;
  icono: string;
  criterio: (stats: AchievementStats) => boolean;
  tipo: 'bronze' | 'silver' | 'gold' | 'platinum';
  oculto?: boolean;
}

export interface AchievementStats {
  problemasCompletados: number;
  objetivosCompletados: number;
  puntajePromedio: number;
  pistasUsadas: number;
  intentosTotales: number;
  racha: number;
}

export const achievements: Achievement[] = [
  // Logros de iniciación
  {
    id: 'primer-paso',
    titulo: 'Primer Paso',
    descripcion: 'Completa tu primer problema',
    icono: '🎯',
    tipo: 'bronze',
    criterio: (stats) => stats.problemasCompletados >= 1,
  },
  {
    id: 'principiante',
    titulo: 'Principiante',
    descripcion: 'Completa un objetivo completo',
    icono: '📚',
    tipo: 'bronze',
    criterio: (stats) => stats.objetivosCompletados >= 1,
  },

  // Logros de progreso
  {
    id: 'estudiante-dedicado',
    titulo: 'Estudiante Dedicado',
    descripcion: 'Completa 4 problemas',
    icono: '📖',
    tipo: 'silver',
    criterio: (stats) => stats.problemasCompletados >= 4,
  },
  {
    id: 'maestro-integracion',
    titulo: 'Maestro de la Integración',
    descripcion: 'Completa todos los objetivos',
    icono: '🏆',
    tipo: 'gold',
    criterio: (stats) => stats.objetivosCompletados >= 4,
  },
  {
    id: 'perfeccionista',
    titulo: 'Perfeccionista',
    descripcion: 'Completa todos los problemas',
    icono: '💎',
    tipo: 'platinum',
    criterio: (stats) => stats.problemasCompletados >= 8,
  },

  // Logros de rendimiento
  {
    id: 'estudiante-brillante',
    titulo: 'Estudiante Brillante',
    descripcion: 'Obtén un puntaje promedio mayor a 80',
    icono: '⭐',
    tipo: 'silver',
    criterio: (stats) => stats.puntajePromedio >= 80,
  },
  {
    id: 'genio-matematico',
    titulo: 'Genio Matemático',
    descripcion: 'Obtén un puntaje promedio mayor a 95',
    icono: '🌟',
    tipo: 'gold',
    criterio: (stats) => stats.puntajePromedio >= 95,
  },

  // Logros de estrategia
  {
    id: 'autonomo',
    titulo: 'Autónomo',
    descripcion: 'Completa 3 problemas sin usar pistas',
    icono: '🧠',
    tipo: 'gold',
    criterio: (stats) => stats.problemasCompletados >= 3 && stats.pistasUsadas === 0,
  },
  {
    id: 'pensador-independiente',
    titulo: 'Pensador Independiente',
    descripcion: 'Completa un problema sin usar pistas',
    icono: '💡',
    tipo: 'silver',
    criterio: (stats) => stats.problemasCompletados >= 1 && stats.pistasUsadas === 0,
  },

  // Logros de perseverancia
  {
    id: 'persistente',
    titulo: 'Persistente',
    descripcion: 'Realiza 10 intentos en total',
    icono: '💪',
    tipo: 'bronze',
    criterio: (stats) => stats.intentosTotales >= 10,
  },
  {
    id: 'incansable',
    titulo: 'Incansable',
    descripcion: 'Realiza 25 intentos en total',
    icono: '🔥',
    tipo: 'silver',
    criterio: (stats) => stats.intentosTotales >= 25,
  },

  // Logros especiales
  {
    id: 'racha-caliente',
    titulo: 'Racha Caliente',
    descripcion: 'Completa 3 problemas seguidos sin fallar',
    icono: '🔥',
    tipo: 'gold',
    criterio: (stats) => stats.racha >= 3,
    oculto: true,
  },
];

export const getAchievementColor = (tipo: Achievement['tipo']): string => {
  const colors = {
    bronze: 'from-amber-700 to-amber-900',
    silver: 'from-gray-400 to-gray-600',
    gold: 'from-yellow-400 to-yellow-600',
    platinum: 'from-purple-400 to-purple-600',
  };
  return colors[tipo];
};

export const getAchievementBorder = (tipo: Achievement['tipo']): string => {
  const borders = {
    bronze: 'border-amber-700',
    silver: 'border-gray-500',
    gold: 'border-yellow-500',
    platinum: 'border-purple-500',
  };
  return borders[tipo];
};

export default achievements;
