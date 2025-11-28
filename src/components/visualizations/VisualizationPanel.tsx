/**
 * Componente VisualizationPanel - Panel que integra todas las visualizaciones
 * TSP1 - Matemática III
 */

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Graph2D from './Graph2D';
import Solid3D from './Solid3D';
import PolarGraph from './PolarGraph';
import ImproperIntegral from './ImproperIntegral';
import type { Problem } from '../../types';

interface VisualizationPanelProps {
  problem: Problem;
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({ problem }) => {
  const [showVisualization, setShowVisualization] = React.useState(true);

  if (!problem.visualizacion) {
    return null;
  }

  const renderVisualization = () => {
    const vis = problem.visualizacion;
    if (!vis) return null;

    switch (vis.tipo) {
      case 'grafico_2D':
        // Para problema I.1.2: √(x-1)/x de 1 a 5
        if (problem.id === 'I.1.2') {
          return (
            <Graph2D
              expression="Math.sqrt(x-1)/x"
              xMin={0}
              xMax={6}
              yMin={0}
              yMax={1}
              shadedArea={{ from: 1, to: 5 }}
            />
          );
        }
        return <Graph2D />;

      case 'grafico_2D_con_limites':
        // Para integrales impropias - problema I.2.2
        if (problem.id === 'I.2.2') {
          return (
            <ImproperIntegral
              functionExpression="1/x^(3/2)"
              lowerLimit={1}
              upperLimit="infinity"
              isConvergent={true}
            />
          );
        }
        // Integral impropia genérica
        return (
          <ImproperIntegral
            functionExpression="3*Math.exp(x)/(3*Math.exp(2*x)+3)"
            lowerLimit={0}
            upperLimit="infinity"
            isConvergent={true}
          />
        );

      case 'solido_3D':
        // Para problema I.2.2: Volumen de revolución y=1/x^(3/2)
        if (problem.id === 'I.2.2') {
          return (
            <Solid3D
              functionExpression="1/Math.pow(x,1.5)"
              rotationAxis="x"
              xMin={1}
              xMax={5}
              segments={40}
            />
          );
        }
        return <Solid3D />;

      case 'region_2D_y_solido_3D':
        // Para problema II.1.1
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Graph2D
              expression="(2*x+4)/2"
              xMin={-2}
              xMax={6}
              yMin={-2}
              yMax={6}
            />
            <Solid3D
              functionExpression="(2*x+4)/2"
              rotationAxis="x"
              xMin={0}
              xMax={4}
            />
          </div>
        );

      case 'curva_2D_con_longitud':
        // Para problema II.1.2: Longitud de arco
        return (
          <Graph2D
            expression="Math.pow(x*(x-3)*(x-3)/9, 0.5)"
            xMin={0}
            xMax={4}
            yMin={0}
            yMax={3}
          />
        );

      case 'curva_parametrica':
        // Para problema II.2.1: Curva paramétrica
        return (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Curva Paramétrica</h3>
            <p className="text-xs text-gray-500 mb-3">
              x = t·sin(t), y = t·cos(t)
            </p>
            <div className="bg-gray-100 p-4 rounded text-center">
              <p className="text-sm text-gray-600">
                📊 Visualización de curva paramétrica
              </p>
              <p className="text-xs text-gray-500 mt-2">
                (Canvas de ejemplo - se puede mejorar con animación)
              </p>
            </div>
          </div>
        );

      case 'trazado_polar_con_area':
        // Para problema II.2.2: Rosa y círculo polar
        if (problem.id === 'II.2.2') {
          return (
            <PolarGraph
              expression1="2*Math.sin(2*theta)"
              expression2="2*Math.sin(theta)"
              thetaMin={0}
              thetaMax={2 * Math.PI}
              maxRadius={2.5}
              showArea={true}
            />
          );
        }
        return <PolarGraph />;

      default:
        return (
          <div className="card bg-gray-50">
            <p className="text-gray-600 text-center">
              Visualización no disponible para este tipo de problema
            </p>
          </div>
        );
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-fredoka text-deep-blue flex items-center">
          {showVisualization ? <Eye className="w-6 h-6 mr-2" /> : <EyeOff className="w-6 h-6 mr-2" />}
          Visualización Interactiva
        </h2>
        <button
          onClick={() => setShowVisualization(!showVisualization)}
          className="px-4 py-2 bg-deep-blue text-white rounded-lg hover:bg-opacity-90 transition-all text-sm"
        >
          {showVisualization ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>

      {showVisualization && (
        <div className="mt-4">
          {renderVisualization()}
          <div className="mt-4 bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>💡 Ayuda:</strong> {
                Array.isArray(problem.visualizacion?.mostrar)
                  ? (problem.visualizacion.mostrar as string[]).join(', ')
                  : problem.visualizacion?.mostrar
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizationPanel;
