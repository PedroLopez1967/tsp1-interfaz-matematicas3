/**
 * Componente MathInput - Editor de ecuaciones LaTeX con vista previa
 * TSP1 - Matemática III
 */

import React, { useState, useEffect } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { AlertCircle, Check } from 'lucide-react';

interface MathInputProps {
  onSubmit: (latex: string) => void;
  placeholder?: string;
  initialValue?: string;
  showPalette?: boolean;
  disabled?: boolean;
  error?: string;
  success?: boolean;
}

const SYMBOL_PALETTE = [
  { symbol: '\\int', label: '∫' },
  { symbol: '\\frac{}{}', label: '÷' },
  { symbol: '^{}', label: 'xⁿ' },
  { symbol: '\\sqrt{}', label: '√' },
  { symbol: '\\pi', label: 'π' },
  { symbol: '\\theta', label: 'θ' },
  { symbol: '\\infty', label: '∞' },
  { symbol: '\\sin', label: 'sin' },
  { symbol: '\\cos', label: 'cos' },
  { symbol: '\\ln', label: 'ln' },
  { symbol: '\\lim', label: 'lim' },
  { symbol: '\\sum', label: 'Σ' },
];

export const MathInput: React.FC<MathInputProps> = ({
  onSubmit,
  placeholder = 'Ingresa LaTeX (ej. \\int x^2 dx)',
  initialValue = '',
  showPalette = true,
  disabled = false,
  error,
  success = false,
}) => {
  const [latex, setLatex] = useState(initialValue);
  const [renderError, setRenderError] = useState(false);

  useEffect(() => {
    setLatex(initialValue);
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLatex(value);
    setRenderError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (latex.trim()) {
      onSubmit(latex.trim());
    }
  };

  const insertSymbol = (symbol: string) => {
    setLatex((prev) => prev + symbol);
  };

  const renderPreview = () => {
    try {
      return <InlineMath math={latex || '...'} />;
    } catch (err) {
      setRenderError(true);
      return <span className="text-red-500 text-sm">Error de sintaxis LaTeX</span>;
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Paleta de símbolos */}
      {showPalette && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {SYMBOL_PALETTE.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => insertSymbol(item.symbol)}
              disabled={disabled}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-deep-blue hover:text-white transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              title={item.symbol}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Input principal */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={latex}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`math-input ${
              error ? 'border-red-500' : success ? 'border-emerald-success' : ''
            } disabled:bg-gray-100 disabled:cursor-not-allowed`}
          />
          {success && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-success" />
          )}
        </div>

        {/* Vista previa renderizada */}
        <div className="bg-soft-cream border-2 border-gray-200 rounded-lg p-4 min-h-[60px] flex items-center justify-center">
          <div className="text-lg">{renderPreview()}</div>
        </div>

        {/* Mensajes de error/éxito */}
        {error && (
          <div className="flex items-center space-x-2 text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {renderError && !error && (
          <div className="text-amber-600 text-sm">
            Verifica la sintaxis LaTeX. Usa llaves {} para agrupar expresiones.
          </div>
        )}

        <button
          type="submit"
          disabled={disabled || !latex.trim()}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar Respuesta
        </button>
      </form>

      {/* Ayuda rápida */}
      <details className="text-sm text-gray-600">
        <summary className="cursor-pointer hover:text-deep-blue">
          Ayuda de sintaxis LaTeX
        </summary>
        <div className="mt-2 space-y-1 pl-4 text-xs">
          <p>• Fracciones: \frac{"{numerador}"}{"{denominador}"}</p>
          <p>• Exponentes: x^{"{2}"} o x^{"{n+1}"}</p>
          <p>• Raíces: \sqrt{"{x}"} o \sqrt[n]{"{x}"}</p>
          <p>• Integrales: \int_{"{a}"}^{"{b}"} f(x) dx</p>
          <p>• Límites: \lim_{"{x \\to \\infty}"}</p>
        </div>
      </details>
    </div>
  );
};

export default MathInput;
