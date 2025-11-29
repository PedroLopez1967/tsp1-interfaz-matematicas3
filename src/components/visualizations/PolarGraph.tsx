/**
 * Componente PolarGraph - Visualización de coordenadas polares con D3.js
 * TSP1 - Matemática III
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Grid, Eye, EyeOff } from 'lucide-react';

interface PolarGraphProps {
  expression1?: string; // r = f(θ)
  expression2?: string; // Opcional: segunda curva para comparación
  thetaMin?: number;
  thetaMax?: number;
  maxRadius?: number;
  showArea?: boolean;
  width?: number;
  height?: number;
}

export const PolarGraph: React.FC<PolarGraphProps> = ({
  expression1 = '2*sin(2*theta)', // Rosa de 4 pétalos
  expression2, // Círculo: '2*sin(theta)'
  thetaMin = 0,
  thetaMax = 2 * Math.PI,
  maxRadius = 3,
  showArea: showAreaProp = false,
  width = 500,
  height = 500,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Estados para controles interactivos
  const [showGrid, setShowGrid] = useState(true);
  const [showArea, setShowArea] = useState(showAreaProp);
  const [showSecondCurve, setShowSecondCurve] = useState(!!expression2);
  const [animatedTheta] = useState(thetaMax);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
    const centerX = width / 2;
    const centerY = height / 2;

    // Grupo principal centrado
    const g = svg
      .append('g')
      .attr('transform', `translate(${centerX},${centerY})`);

    // Escalas
    const radiusScale = d3.scaleLinear().domain([0, maxRadius]).range([0, radius]);

    // Función para evaluar expresión polar
    const evaluatePolarExpression = (expr: string, theta: number): number => {
      try {
        const processed = expr
          .replace(/theta/g, String(theta))
          .replace(/sin/g, 'Math.sin')
          .replace(/cos/g, 'Math.cos')
          .replace(/tan/g, 'Math.tan');
        return eval(processed);
      } catch {
        return 0;
      }
    };

    // Grilla radial (condicional)
    if (showGrid) {
      const gridCircles = [0.5, 1, 1.5, 2, 2.5];
      gridCircles.forEach((r) => {
        g.append('circle')
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', radiusScale(r))
          .attr('fill', 'none')
          .attr('stroke', '#e0e0e0')
          .attr('stroke-width', 1);

        // Etiqueta del radio
        g.append('text')
          .attr('x', 5)
          .attr('y', -radiusScale(r))
          .attr('font-size', '10px')
          .attr('fill', '#666')
          .text(r.toString());
      });

      // Líneas radiales (cada 30 grados)
      const angles = d3.range(0, 360, 30);
      angles.forEach((angle: number) => {
        const rad = (angle * Math.PI) / 180;
        g.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', radiusScale(maxRadius) * Math.cos(rad - Math.PI / 2))
          .attr('y2', radiusScale(maxRadius) * Math.sin(rad - Math.PI / 2))
          .attr('stroke', '#f0f0f0')
          .attr('stroke-width', 1);

        // Etiquetas de ángulos
        const labelRadius = radiusScale(maxRadius) + 15;
        g.append('text')
          .attr('x', labelRadius * Math.cos(rad - Math.PI / 2))
          .attr('y', labelRadius * Math.sin(rad - Math.PI / 2))
          .attr('text-anchor', 'middle')
          .attr('font-size', '11px')
          .attr('fill', '#666')
          .text(`${angle}°`);
      });
    }

    // Generar path generator polar
    const polarToCartesian = (r: number, theta: number) => {
      return {
        x: radiusScale(r) * Math.cos(theta - Math.PI / 2),
        y: radiusScale(r) * Math.sin(theta - Math.PI / 2),
      };
    };

    const generatePolarPath = (expression: string, color: string, fillArea: boolean = false) => {
      const steps = 200;
      const dTheta = (thetaMax - thetaMin) / steps;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i <= steps; i++) {
        const theta = thetaMin + i * dTheta;
        const r = evaluatePolarExpression(expression, theta);
        const point = polarToCartesian(Math.abs(r), theta);
        points.push(point);
      }

      const pathData = d3.line<{ x: number; y: number }>()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveCardinalClosed)(points);

      if (fillArea) {
        g.append('path')
          .datum(points)
          .attr('d', pathData)
          .attr('fill', color)
          .attr('fill-opacity', 0.2)
          .attr('stroke', 'none');
      }

      g.append('path')
        .datum(points)
        .attr('d', pathData)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 2.5);
    };

    // Dibujar primera curva (rosa)
    generatePolarPath(expression1, '#7c3aed', showArea);

    // Dibujar segunda curva si existe (círculo)
    if (expression2 && showSecondCurve) {
      generatePolarPath(expression2, '#f59e0b', false);
    }

    // Ejes principales
    g.append('line')
      .attr('x1', -radiusScale(maxRadius))
      .attr('y1', 0)
      .attr('x2', radiusScale(maxRadius))
      .attr('y2', 0)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    g.append('line')
      .attr('x1', 0)
      .attr('y1', -radiusScale(maxRadius))
      .attr('x2', 0)
      .attr('y2', radiusScale(maxRadius))
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    // Centro
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 3)
      .attr('fill', '#333');

  }, [expression1, expression2, thetaMin, thetaMax, maxRadius, showArea, showGrid, showSecondCurve, width, height, animatedTheta]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Gráfico Polar</h3>
        <div className="text-xs text-gray-500 space-y-1">
          <p>r₁ = {expression1} (morado)</p>
          {expression2 && <p>r₂ = {expression2} (naranja)</p>}
        </div>
      </div>

      {/* Controles interactivos */}
      <div className="mb-3 flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200">
        <button
          onClick={() => setShowGrid(!showGrid)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
          title={showGrid ? 'Ocultar grilla polar' : 'Mostrar grilla polar'}
        >
          <Grid size={14} />
          <span>Grilla</span>
        </button>

        <button
          onClick={() => setShowArea(!showArea)}
          className={`flex items-center gap-1 px-3 py-1.5 text-white text-xs rounded transition-colors ${
            showArea ? 'bg-violet-600 hover:bg-violet-700' : 'bg-gray-500 hover:bg-gray-600'
          }`}
          title={showArea ? 'Ocultar área' : 'Mostrar área'}
        >
          {showArea ? <Eye size={14} /> : <EyeOff size={14} />}
          <span>Área</span>
        </button>

        {expression2 && (
          <button
            onClick={() => setShowSecondCurve(!showSecondCurve)}
            className={`flex items-center gap-1 px-3 py-1.5 text-white text-xs rounded transition-colors ${
              showSecondCurve ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-500 hover:bg-gray-600'
            }`}
            title={showSecondCurve ? 'Ocultar segunda curva' : 'Mostrar segunda curva'}
          >
            {showSecondCurve ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>Curva 2</span>
          </button>
        )}
      </div>

      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded"
      />
      {showArea && (
        <p className="mt-2 text-xs text-gray-500">Área sombreada en morado</p>
      )}
    </div>
  );
};

export default PolarGraph;
