/**
 * Componente ImproperIntegral - Visualización de integrales impropias con D3.js
 * TSP1 - Matemática III
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Play, Pause, RotateCw, TrendingUp } from 'lucide-react';

interface ImproperIntegralProps {
  functionExpression?: string;
  lowerLimit?: number;
  upperLimit?: number | 'infinity';
  isConvergent?: boolean;
  width?: number;
  height?: number;
}

export const ImproperIntegral: React.FC<ImproperIntegralProps> = ({
  functionExpression = '1/x^(3/2)',
  lowerLimit = 1,
  upperLimit = 'infinity',
  isConvergent = true,
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [animatedLimit, setAnimatedLimit] = useState(5);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showArea, setShowArea] = useState(true);

  // Evaluar función
  const evaluateFunction = (x: number): number => {
    try {
      if (functionExpression.includes('1/x')) {
        const match = functionExpression.match(/1\/x\^?\(?([\d./]+)\)?/);
        const exponent = match ? parseFloat(match[1]) : 1.5;
        return 1 / Math.pow(x, exponent);
      }
      return eval(functionExpression.replace(/x/g, String(x)));
    } catch {
      return 0;
    }
  };

  // Calcular integral aproximada
  const calculateIntegral = (upperBound: number): number => {
    const steps = 1000;
    const dx = (upperBound - lowerLimit) / steps;
    let sum = 0;

    for (let i = 0; i < steps; i++) {
      const x = lowerLimit + i * dx;
      const y = evaluateFunction(x);
      sum += y * dx;
    }

    return sum;
  };

  const integralValue = calculateIntegral(animatedLimit);

  // Animación del límite
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setAnimatedLimit((prev) => {
        const next = prev + 0.5;
        if (next >= 50) {
          setIsAnimating(false);
          return 50;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAnimating]);

  // Renderizar gráfico con D3
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Escalas
    const xMax = Math.min(animatedLimit * 1.2, 50);
    const xScale = d3.scaleLinear().domain([0, xMax]).range([0, innerWidth]);

    const yMax = evaluateFunction(lowerLimit) * 1.2;
    const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

    // Ejes
    const xAxis = d3.axisBottom(xScale).ticks(10);
    const yAxis = d3.axisLeft(yScale).ticks(8);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 35)
      .attr('fill', '#000')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('x');

    g.append('g')
      .call(yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -35)
      .attr('fill', '#000')
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .text('y');

    // Generar datos de la curva
    const curveData: [number, number][] = [];
    const steps = 500;
    const dx = (xMax - lowerLimit) / steps;

    for (let i = 0; i <= steps; i++) {
      const x = lowerLimit + i * dx;
      const y = evaluateFunction(x);
      if (!isNaN(y) && isFinite(y)) {
        curveData.push([x, y]);
      }
    }

    // Dibujar curva
    const line = d3.line<[number, number]>()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(curveData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#7c3aed')
      .attr('stroke-width', 2.5);

    // Área bajo la curva (hasta el límite animado)
    if (showArea) {
      const areaData: [number, number][] = curveData.filter(d => d[0] <= animatedLimit);

      const area = d3.area<[number, number]>()
        .x(d => xScale(d[0]))
        .y0(innerHeight)
        .y1(d => yScale(d[1]))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(areaData)
        .attr('d', area)
        .attr('fill', '#7c3aed')
        .attr('fill-opacity', 0.2);
    }

    // Línea vertical en el límite superior actual
    if (animatedLimit > lowerLimit && animatedLimit <= xMax) {
      g.append('line')
        .attr('x1', xScale(animatedLimit))
        .attr('y1', 0)
        .attr('x2', xScale(animatedLimit))
        .attr('y2', innerHeight)
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');

      // Etiqueta del límite
      g.append('text')
        .attr('x', xScale(animatedLimit))
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('fill', '#f59e0b')
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .text(`x = ${animatedLimit.toFixed(1)}`);
    }

    // Línea vertical en el límite inferior
    g.append('line')
      .attr('x1', xScale(lowerLimit))
      .attr('y1', 0)
      .attr('x2', xScale(lowerLimit))
      .attr('y2', innerHeight)
      .attr('stroke', '#10b981')
      .attr('stroke-width', 2);

    g.append('text')
      .attr('x', xScale(lowerLimit))
      .attr('y', innerHeight + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#10b981')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text(`a = ${lowerLimit}`);

  }, [functionExpression, lowerLimit, animatedLimit, width, height, showArea]);

  const handleReset = () => {
    setAnimatedLimit(5);
    setIsAnimating(false);
  };

  const handleToggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Integral Impropia</h3>
        <div className="text-xs text-gray-500">
          <p className="font-mono">
            ∫<sub>{lowerLimit}</sub><sup>{upperLimit === 'infinity' ? '∞' : upperLimit}</sup> {functionExpression} dx
          </p>
          <p className="mt-1">
            {isConvergent ? (
              <span className="text-green-600 font-medium">✓ Convergente</span>
            ) : (
              <span className="text-red-600 font-medium">✗ Divergente</span>
            )}
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="mb-3 flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
        <button
          onClick={handleToggleAnimation}
          className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs rounded transition-colors"
          title={isAnimating ? 'Pausar animación' : 'Iniciar animación'}
        >
          {isAnimating ? <Pause size={14} /> : <Play size={14} />}
          <span>{isAnimating ? 'Pausar' : 'Animar'}</span>
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
          title="Reiniciar límite"
        >
          <RotateCw size={14} />
          <span>Reiniciar</span>
        </button>

        <button
          onClick={() => setShowArea(!showArea)}
          className={`flex items-center gap-1 px-3 py-1.5 text-white text-xs rounded transition-colors ${
            showArea ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-500 hover:bg-gray-600'
          }`}
          title={showArea ? 'Ocultar área' : 'Mostrar área'}
        >
          <TrendingUp size={14} />
          <span>Área</span>
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <label className="text-xs text-gray-600">Límite superior:</label>
          <input
            type="range"
            min={lowerLimit + 1}
            max="50"
            step="0.5"
            value={animatedLimit}
            onChange={(e) => {
              setAnimatedLimit(parseFloat(e.target.value));
              setIsAnimating(false);
            }}
            className="w-32"
            title="Ajustar límite superior"
          />
          <span className="text-xs text-gray-700 font-medium w-12">
            {animatedLimit.toFixed(1)}
          </span>
        </div>
      </div>

      {/* SVG */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded bg-white"
      />

      {/* Información del valor */}
      <div className="mt-3 p-2 bg-violet-50 rounded border border-violet-200">
        <div className="text-xs space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Integral de {lowerLimit} a {animatedLimit.toFixed(1)}:</span>
            <span className="font-mono font-bold text-violet-700">
              {integralValue.toFixed(6)}
            </span>
          </div>
          {upperLimit === 'infinity' && isConvergent && (
            <div className="flex justify-between items-center pt-1 border-t border-violet-300">
              <span className="text-gray-600">Valor límite (t → ∞):</span>
              <span className="font-mono font-bold text-green-600">
                ≈ {calculateIntegral(1000).toFixed(6)}
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 text-xs text-gray-400">
        💡 Ajusta el límite superior o anima para ver cómo converge la integral
      </p>
    </div>
  );
};

export default ImproperIntegral;
