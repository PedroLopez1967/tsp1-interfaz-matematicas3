# TSP1 Matemática III - Interfaz Educativa Interactiva

Interfaz web interactiva para el **Trabajo Sustitutivo de Prueba 1 (TSP1)** de **Matemática III (Código 733)** de la Universidad Nacional Abierta (UNA).

## 📋 Descripción

Este proyecto transforma la asignación tradicional de matemáticas en una experiencia de aprendizaje interactiva, visual y pedagógicamente rica, basada en el escenario **"Calculus Quest - La Aventura de la Integración"**.

### Características Principales

- **Interfaz Gamificada**: Sistema de progreso con gemas, insignias y reinos temáticos
- **Renderizado Matemático**: Soporte completo para LaTeX usando KaTeX
- **Visualizaciones Interactivas**: Gráficos 2D/3D, coordenadas polares, sólidos de revolución
- **Sistema de Pistas Progresivas**: Ayuda contextual en 5 niveles de dificultad
- **Seguimiento de Progreso**: Persistencia local del avance del estudiante
- **Diseño Responsivo**: Funciona en dispositivos móviles y de escritorio

## 🚀 Estado Actual - Fase 1 (Fundación) COMPLETADA

✅ **Completado:**
- Configuración de proyecto React + TypeScript + Vite
- Instalación de dependencias (TailwindCSS, mathjs, KaTeX, Three.js, D3.js, etc.)
- Configuración de TailwindCSS con paleta de colores personalizada
- Estructura completa de carpetas del proyecto
- Tipos TypeScript para problemas, respuestas y usuario
- Store Zustand para gestión de progreso con persistencia
- Componentes base:
  - Header con navegación
  - ProgressBar con animaciones
  - MathInput con editor LaTeX interactivo
- Dashboard con tarjetas de objetivos
- Configuración de React Router
- Base de datos de 8 problemas en JSON

## 🛠️ Stack Tecnológico

### Frontend
- **React 18.2+** - Biblioteca UI
- **TypeScript 5.0+** - Tipado estático
- **Vite** - Build tool y servidor de desarrollo

### Estilos
- **TailwindCSS 3.3+** - Framework CSS utility-first
- **Framer Motion** - Animaciones fluidas
- **Lucide React** - Iconos

### Matemáticas y Visualización
- **KaTeX 0.16+** - Renderizado de fórmulas LaTeX
- **math.js** - Cálculos simbólicos y numéricos
- **Three.js (r152+)** - Visualización 3D (sólidos de revolución)
- **D3.js v7** - Gráficos polares
- **Recharts** - Gráficos 2D

### Gestión de Estado
- **Zustand** - State management con persistencia
- **React Router DOM** - Enrutamiento

## 📁 Estructura del Proyecto

```
tsp1-interfaz-matematicas/
├── src/
│   ├── components/
│   │   ├── common/          # Componentes reutilizables
│   │   │   ├── Header.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── MathInput.tsx
│   │   ├── problems/        # Componentes de problemas
│   │   │   ├── objetivo_I_1/
│   │   │   ├── objetivo_I_2/
│   │   │   ├── objetivo_II_1/
│   │   │   └── objetivo_II_2/
│   │   ├── visualizations/  # Componentes de visualización
│   │   └── ui/             # Componentes UI base
│   ├── pages/
│   │   └── Dashboard.tsx   # Página principal
│   ├── lib/                # Utilidades
│   ├── store/
│   │   └── progressStore.ts # Store Zustand
│   ├── types/              # Tipos TypeScript
│   │   ├── problem.types.ts
│   │   ├── answer.types.ts
│   │   └── user.types.ts
│   ├── data/
│   │   └── problems.json   # Base de datos de problemas
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎯 Los 8 Problemas

### Objetivo I.1: Técnicas de Integración (⚗️)
1. Verificación de fórmula integral
2. Integral definida con sustitución

### Objetivo I.2: Integrales Impropias (🔭)
1. Convergencia de integral impropia
2. Volumen de revolución con límite infinito

### Objetivo II.1: Sólidos de Revolución (📐)
1. Volumen por rotación de región acotada
2. Longitud de arco

### Objetivo II.2: Coordenadas Polares (🌀)
1. Recta tangente paramétrica
2. Área entre curvas polares

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Navegar al directorio del proyecto
cd tsp1-interfaz-matematicas

# Las dependencias ya están instaladas, pero si necesitas reinstalar:
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en **http://localhost:5173/**

### Build para Producción

```bash
# Crear build optimizado
npm run build

# Previsualizar build de producción
npm run preview
```

## 🎨 Paleta de Colores

```css
/* Escenario 1: Calculus Quest */
--deep-blue: #1E3A8A;          /* Precisión matemática */
--vibrant-purple: #7C3AED;     /* Creatividad */
--golden-yellow: #F59E0B;      /* Logros */
--emerald-success: #10B981;    /* Éxito */
--coral-warning: #EF4444;      /* Advertencia */
--soft-cream: #FFFBEB;         /* Fondo */
```

## 📖 Tipografía

- **Fredoka One** - Títulos y encabezados
- **Inter** - Texto del cuerpo
- **Poppins** - Botones y CTAs
- **Roboto Mono** - Código y entrada matemática
- **KaTeX** - Renderizado de fórmulas

## 🔄 Próximos Pasos - Fase 2

- [ ] Implementar componentes de problemas individuales
- [ ] Crear framework de solucionador paso a paso
- [ ] Sistema de validación de respuestas
- [ ] Sistema de pistas (5 niveles)
- [ ] Página de objetivos con problemas
- [ ] Componente de solución de problemas

## 🔄 Fase 3 - Visualizaciones

- [ ] Graficador de funciones 2D (Canvas)
- [ ] Visor de sólidos 3D (Three.js)
- [ ] Trazador polar (D3.js)
- [ ] Visualizaciones específicas por problema
- [ ] Integración con solucionadores

## 🔄 Fase 4 - Refinamiento

- [ ] Mejorar inteligencia de pistas
- [ ] Animaciones con Framer Motion
- [ ] Optimización para móviles
- [ ] Pruebas de usuario
- [ ] Mejoras de accesibilidad (WCAG 2.1 AA)

## 🧪 Testing

```bash
# Ejecutar pruebas unitarias (cuando estén implementadas)
npm run test

# Ejecutar pruebas con cobertura
npm run test:coverage
```

## 📝 Licencia

Este proyecto es parte del material educativo de la Universidad Nacional Abierta (UNA) para la asignatura Matemática III (Código 733).

## 👥 Créditos

- **Diseño e Implementación**: Basado en la especificación completa "Escenarios de Diseño de Interfaz Educativa"
- **Institución**: Universidad Nacional Abierta (UNA)
- **Asignatura**: Matemática III (Código 733)
- **Período**: 2025-2

## 🤝 Contribuciones

Este es un proyecto educativo. Para contribuciones o mejoras, consulta con el instructor de la asignatura.

## 📧 Soporte

Para preguntas técnicas o problemas con la aplicación, revisa la documentación en el código fuente o contacta al equipo de desarrollo.

---

**¡Buena suerte con tus aventuras matemáticas! 🚀📐**
