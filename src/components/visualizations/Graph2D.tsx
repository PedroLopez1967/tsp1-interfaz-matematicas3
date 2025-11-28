/**
 * Componente Graph2D - Visualización de funciones 2D
 * TSP1 - Matemática III
 */

import React, { useEffect, useRef } from 'react';

interface Graph2DProps {
  expression?: string;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  shadedArea?: { from: number; to: number };
  width?: number;
  height?: number;
}

export const Graph2D: React.FC<Graph2DProps> = ({
  expression = 'x^2',
  xMin = -5,
  xMax = 5,
  yMin = -5,
  yMax = 5,
  shadedArea,
  width = 600,
  height = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);

    // Configuración
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Función para convertir coordenadas matemáticas a canvas
    const toCanvasX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * graphWidth;
    const toCanvasY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * graphHeight;

    // Dibujar ejes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;

    // Eje X
    const yAxisPos = toCanvasY(0);
    ctx.beginPath();
    ctx.moveTo(padding, yAxisPos);
    ctx.lineTo(width - padding, yAxisPos);
    ctx.stroke();

    // Eje Y
    const xAxisPos = toCanvasX(0);
    ctx.beginPath();
    ctx.moveTo(xAxisPos, padding);
    ctx.lineTo(xAxisPos, height - padding);
    ctx.stroke();

    // Dibujar grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if (x === 0) continue;
      const canvasX = toCanvasX(x);
      ctx.beginPath();
      ctx.moveTo(canvasX, padding);
      ctx.lineTo(canvasX, height - padding);
      ctx.stroke();
    }

    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
      if (y === 0) continue;
      const canvasY = toCanvasY(y);
      ctx.beginPath();
      ctx.moveTo(padding, canvasY);
      ctx.lineTo(width - padding, canvasY);
      ctx.stroke();
    }

    // Función de ejemplo: evaluar expresión simple
    const evaluateExpression = (x: number): number => {
      try {
        // Para demo: solo función cuadrática simple
        // En producción usarías math.js para evaluar expresiones complejas
        if (expression.includes('sqrt')) {
          const match = expression.match(/sqrt\((.*?)\)/);
          if (match) {
            const inner = match[1].replace(/x/g, String(x));
            return Math.sqrt(eval(inner));
          }
        }
        return eval(expression.replace(/x/g, String(x)));
      } catch {
        return 0;
      }
    };

    // Dibujar área sombreada si existe
    if (shadedArea) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.beginPath();

      const steps = 100;
      const dx = (shadedArea.to - shadedArea.from) / steps;

      ctx.moveTo(toCanvasX(shadedArea.from), toCanvasY(0));

      for (let i = 0; i <= steps; i++) {
        const x = shadedArea.from + i * dx;
        const y = evaluateExpression(x);
        ctx.lineTo(toCanvasX(x), toCanvasY(y));
      }

      ctx.lineTo(toCanvasX(shadedArea.to), toCanvasY(0));
      ctx.closePath();
      ctx.fill();
    }

    // Dibujar función
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const steps = 200;
    const dx = (xMax - xMin) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = evaluateExpression(x);

      if (i === 0) {
        ctx.moveTo(toCanvasX(x), toCanvasY(y));
      } else {
        ctx.lineTo(toCanvasX(x), toCanvasY(y));
      }
    }

    ctx.stroke();

    // Etiquetas de ejes
    ctx.fillStyle = '#333';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';

    // Etiqueta X
    ctx.fillText('x', width - padding + 15, yAxisPos + 5);

    // Etiqueta Y
    ctx.save();
    ctx.translate(xAxisPos - 15, padding - 10);
    ctx.fillText('y', 0, 0);
    ctx.restore();

  }, [expression, xMin, xMax, yMin, yMax, shadedArea, width, height]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Gráfico 2D</h3>
        <p className="text-xs text-gray-500">Función: y = {expression}</p>
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded"
      />
    </div>
  );
};

export default Graph2D;
