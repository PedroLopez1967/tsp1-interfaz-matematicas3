/**
 * Componente ProgressBar - Indicador de progreso visual
 * TSP1 - Matemática III
 */

import React from 'react';
import { Trophy, Star } from 'lucide-react';

interface ProgressBarProps {
  porcentaje: number;
  gemas?: number;
  totalGemas?: number;
  showLabels?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  porcentaje,
  gemas = 0,
  totalGemas = 40,
  showLabels = true,
  className = '',
}) => {
  const porcentajeLimitado = Math.min(100, Math.max(0, porcentaje));

  return (
    <div className={`w-full ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-golden-yellow" />
            <span className="text-sm font-semibold text-gray-700">
              Progreso: {Math.round(porcentajeLimitado)}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-golden-yellow fill-current" />
            <span className="text-sm font-semibold text-gray-700">
              Gemas: {gemas}/{totalGemas}
            </span>
          </div>
        </div>
      )}

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-deep-blue via-vibrant-purple to-golden-yellow transition-all duration-500 ease-out relative"
          style={{ width: `${porcentajeLimitado}%` }}
        >
          {/* Animación de brillo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
        </div>
      </div>

      {/* Barra de progreso por objetivos (opcional) */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ProgressBar;
