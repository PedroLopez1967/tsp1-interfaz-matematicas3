/**
 * Sistema de pistas inteligentes por problema
 * TSP1 - Matemática III
 */

import type { ProblemId } from '../types';

interface Hint {
  nivel: 1 | 2 | 3 | 4 | 5;
  texto: string;
  utilidad: 'Direccional' | 'Explicativa' | 'Detallada' | 'Ayuda Visual' | 'Solución Dada';
  deduccion: number;
}

export const hints: Record<ProblemId, Hint[]> = {
  'I.1.1': [
    {
      nivel: 1,
      texto: 'Recuerda que para verificar una fórmula integral, puedes derivar el lado derecho y comprobar que obtienes el integrando original.',
      utilidad: 'Direccional',
      deduccion: 5,
    },
    {
      nivel: 2,
      texto: 'Aplica la regla del cociente para derivar a²/(a+bu) y la regla de la cadena para ln|a+bu|.',
      utilidad: 'Explicativa',
      deduccion: 5,
    },
    {
      nivel: 3,
      texto: 'Al derivar: d/du[bu] = b, d/du[a²/(a+bu)] = -a²b/(a+bu)², y d/du[2aln|a+bu|] = 2ab/(a+bu)',
      utilidad: 'Detallada',
      deduccion: 5,
    },
    {
      nivel: 4,
      texto: 'Combina los términos con denominador común (a+bu)². Deberías obtener: [b(a+bu)² - a²b - 2ab(a+bu)]/(a+bu)²',
      utilidad: 'Ayuda Visual',
      deduccion: 5,
    },
    {
      nivel: 5,
      texto: 'Simplificando el numerador: b(a+bu)² - a²b - 2ab(a+bu) = bu² que dividido por (a+bu)² da u²/(a+bu)², verificando la fórmula.',
      utilidad: 'Solución Dada',
      deduccion: 5,
    },
  ],

  'I.1.2': [
    {
      nivel: 1,
      texto: 'La sustitución dada es x-1 = t². Esto significa que dx = 2t dt.',
      utilidad: 'Direccional',
      deduccion: 5,
    },
    {
      nivel: 2,
      texto: 'Transforma los límites: cuando x=1, t=0; cuando x=5, t=2. Expresa √(x-1) como t.',
      utilidad: 'Explicativa',
      deduccion: 5,
    },
    {
      nivel: 3,
      texto: 'La integral se convierte en: ∫₀² (t/(t²+1)) · 2t dt = 2∫₀² t²/(t²+1) dt',
      utilidad: 'Detallada',
      deduccion: 5,
    },
    {
      nivel: 4,
      texto: 'Usa división larga o reescribe: t²/(t²+1) = 1 - 1/(t²+1). La integral de 1/(t²+1) es arctan(t).',
      utilidad: 'Ayuda Visual',
      deduccion: 5,
    },
    {
      nivel: 5,
      texto: 'Respuesta final: 2[t - arctan(t)]₀² = 2(2 - arctan(2)) = 4 - 2arctan(2) ≈ 1.771',
      utilidad: 'Solución Dada',
      deduccion: 5,
    },
  ],

  'I.2.1': [
    {
      nivel: 1,
      texto: 'Para integrales impropias de -∞ a ∞, divide en dos límites: de -∞ a 0 y de 0 a ∞.',
      utilidad: 'Direccional',
      deduccion: 5,
    },
    {
      nivel: 2,
      texto: 'Usa sustitución u = 3e²ˣ + 3. Entonces du = 6e²ˣ dx.',
      utilidad: 'Explicativa',
      deduccion: 5,
    },
    {
      nivel: 3,
      texto: 'Nota que 3eˣ = √[(u-3)/3] · √3. La integral se simplifica considerablemente.',
      utilidad: 'Detallada',
      deduccion: 5,
    },
    {
      nivel: 4,
      texto: 'Evalúa lim[a→-∞] ∫ₐ⁰ y lim[b→∞] ∫₀ᵇ por separado. Ambos deben converger.',
      utilidad: 'Ayuda Visual',
      deduccion: 5,
    },
    {
      nivel: 5,
      texto: 'La integral converge. El resultado es arctan(∞) - arctan(-∞) = π/2 - (-π/2) = π.',
      utilidad: 'Solución Dada',
      deduccion: 5,
    },
  ],

  'I.2.2': [
    {
      nivel: 1,
      texto: 'Para volumen de revolución, usa V = π∫[f(x)]² dx. Aquí f(x) = 1/x^(3/2).',
      utilidad: 'Direccional',
      deduccion: 5,
    },
    {
      nivel: 2,
      texto: 'V = π∫₁^∞ (1/x^(3/2))² dx = π∫₁^∞ 1/x³ dx = π∫₁^∞ x⁻³ dx',
      utilidad: 'Explicativa',
      deduccion: 5,
    },
    {
      nivel: 3,
      texto: 'La antiderivada de x⁻³ es -1/(2x²). Evalúa el límite lim[b→∞] [-1/(2b²) + 1/2]',
      utilidad: 'Detallada',
      deduccion: 5,
    },
    {
      nivel: 4,
      texto: 'A medida que b→∞, el término -1/(2b²) → 0.',
      utilidad: 'Ayuda Visual',
      deduccion: 5,
    },
    {
      nivel: 5,
      texto: 'El volumen es V = π · [0 + 1/2] = π/2 unidades cúbicas. La integral converge.',
      utilidad: 'Solución Dada',
      deduccion: 5,
    },
  ],

  'II.1.1': [
    {
      nivel: 1,
      texto: 'Primero encuentra los puntos de intersección de las dos curvas: 2y=2x+4 y 2y²-6y=4x.',
      utilidad: 'Direccional',
      deduccion: 5,
    },
    {
      nivel: 2,
      texto: 'De la primera ecuación: x = y-2. Sustituye en la segunda para encontrar y.',
      utilidad: 'Explicativa',
      deduccion: 5,
    },
    {
      nivel: 3,
      texto: 'Obtienes 2y²-6y = 4(y-2) → 2y²-10y+8=0 → y²-5y+4=0 → (y-1)(y-4)=0',
      utilidad: 'Detallada',
      deduccion: 5,
    },
    {
      nivel: 4,
      texto: 'Usa el método de arandelas: V = π∫₁⁴ [R(y)² - r(y)²] dy donde R es radio exterior y r es radio interior.',
      utilidad: 'Ayuda Visual',
      deduccion: 5,
    },
    {
      nivel: 5,
      texto: 'V = π∫₁⁴ [(y-2)² - ((y²-3y)/2)²] dy. Evalúa esta integral para obtener el volumen.',
      utilidad: 'Solución Dada',
      deduccion: 5,
    },
  ],

  'II.1.2': [
    {
      nivel: 1,
      texto: 'La fórmula de longitud de arco es L = ∫√[1 + (dy/dx)²] dx.',
      utilidad: 'Direccional',
      deduccion: 5,
    },
    {
      nivel: 2,
      texto: 'Deriva implícitamente 9y² = x(x-3)²: 18y(dy/dx) = (x-3)² + 2x(x-3)',
      utilidad: 'Explicativa',
      deduccion: 5,
    },
    {
      nivel: 3,
      texto: 'Simplifica: 18y(dy/dx) = (x-3)² + 2x(x-3) = (x-3)[(x-3) + 2x] = (x-3)(3x-3) = 3(x-3)(x-1)',
      utilidad: 'Detallada',
      deduccion: 5,
    },
    {
      nivel: 4,
      texto: 'Calcula 1 + (dy/dx)². Nota que y = √[x(x-3)²]/3 en Q1.',
      utilidad: 'Ayuda Visual',
      deduccion: 5,
    },
    {
      nivel: 5,
      texto: 'Después de simplificar bajo el radical, la integral resulta en L = ∫₁³ √[...] dx. Evalúa para obtener la longitud.',
      utilidad: 'Solución Dada',
      deduccion: 5,
    },
  ],

  'II.2.1': [
    {
      nivel: 1,
      texto: 'Para curvas paramétricas, dy/dx = (dy/dt)/(dx/dt).',
      utilidad: 'Direccional',
      deduccion: 5,
    },
    {
      nivel: 2,
      texto: 'Calcula dx/dt = sin(t) + t·cos(t) y dy/dt = cos(t) - t·sin(t)',
      utilidad: 'Explicativa',
      deduccion: 5,
    },
    {
      nivel: 3,
      texto: 'En t=π/2: dx/dt = 1 + 0 = 1 y dy/dt = 0 - π/2 = -π/2',
      utilidad: 'Detallada',
      deduccion: 5,
    },
    {
      nivel: 4,
      texto: 'Por lo tanto dy/dx = -π/2. El punto es (π/2, 0) cuando t=π/2.',
      utilidad: 'Ayuda Visual',
      deduccion: 5,
    },
    {
      nivel: 5,
      texto: 'La recta tangente es: y - 0 = -π/2(x - π/2) → y = -πx/2 + π²/4',
      utilidad: 'Solución Dada',
      deduccion: 5,
    },
  ],

  'II.2.2': [
    {
      nivel: 1,
      texto: 'Encuentra intersecciones resolviendo 2sin(2θ) = 2sin(θ).',
      utilidad: 'Direccional',
      deduccion: 5,
    },
    {
      nivel: 2,
      texto: 'Usa sin(2θ) = 2sin(θ)cos(θ): 4sin(θ)cos(θ) = 2sin(θ) → 2sin(θ)[2cos(θ)-1] = 0',
      utilidad: 'Explicativa',
      deduccion: 5,
    },
    {
      nivel: 3,
      texto: 'Las soluciones son: sin(θ)=0 → θ=0,π; o cos(θ)=1/2 → θ=π/3, 5π/3',
      utilidad: 'Detallada',
      deduccion: 5,
    },
    {
      nivel: 4,
      texto: 'En [0,π/3], la rosa (r=2sin(2θ)) es la curva exterior. Usa A = ½∫[r_outer² - r_inner²]dθ',
      utilidad: 'Ayuda Visual',
      deduccion: 5,
    },
    {
      nivel: 5,
      texto: 'A₁ = ½∫₀^(π/3) [4sin²(2θ) - 4sin²(θ)]dθ. Por simetría, área total = 4A₁. Evalúa usando identidades trigonométricas.',
      utilidad: 'Solución Dada',
      deduccion: 5,
    },
  ],
};

export default hints;
