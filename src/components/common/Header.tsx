/**
 * Componente Header - Barra de navegación superior
 * TSP1 - Matemática III
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, BarChart3, Download, Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressStore } from '../../store/progressStore';

export const Header: React.FC = () => {
  const location = useLocation();
  const studentInfo = useProgressStore((state) => state.studentInfo);
  const porcentajeCompletado = useProgressStore((state) => state.porcentaje_completado);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleExportProgress = () => {
    const state = useProgressStore.getState();
    const progressData = {
      studentInfo: state.studentInfo,
      problemas: state.problemas,
      objetivos_completados: state.objetivos_completados,
      porcentaje_completado: state.porcentaje_completado,
      puntaje_promedio: state.puntaje_promedio,
      fecha_exportacion: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `progreso-tsp1-${studentInfo?.id || 'estudiante'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-deep-blue text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <BookOpen className="w-8 h-8" />
              <div className="hidden sm:block">
                <h1 className="text-xl font-fredoka font-bold">TSP1 Matemática III</h1>
                <p className="text-xs text-gray-300">Código 733 - UNA</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-lg font-fredoka font-bold">TSP1</h1>
              </div>
            </Link>
          </div>

          {/* Navegación central - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-2 transition-colors cursor-pointer ${
                isActive('/') ? 'text-golden-yellow font-semibold' : 'text-white hover:text-golden-yellow'
              }`}
              aria-label="Ir al dashboard"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/logros"
              className={`flex items-center space-x-2 transition-colors cursor-pointer ${
                isActive('/logros') ? 'text-golden-yellow font-semibold' : 'text-white hover:text-golden-yellow'
              }`}
              aria-label="Ver mis logros"
            >
              <Trophy className="w-5 h-5" />
              <span>Logros</span>
            </Link>
            <Link
              to="/estadisticas"
              className={`flex items-center space-x-2 transition-colors cursor-pointer ${
                isActive('/estadisticas') ? 'text-golden-yellow font-semibold' : 'text-white hover:text-golden-yellow'
              }`}
              aria-label="Ver estadísticas"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Estadísticas</span>
            </Link>
          </nav>

          {/* Controles derecha */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Progreso */}
            <div className="flex items-center space-x-2 bg-white bg-opacity-10 px-2 sm:px-3 py-2 rounded-lg">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-golden-yellow" />
              <span className="font-semibold text-sm sm:text-base">{Math.round(porcentajeCompletado)}%</span>
            </div>

            {/* Menú de usuario - Desktop */}
            {studentInfo && (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 bg-white bg-opacity-10 px-3 py-2 rounded-lg hover:bg-opacity-20 transition-all"
                  aria-label="Menú de usuario"
                  aria-expanded={userMenuOpen}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-semibold max-w-[120px] truncate">{studentInfo.nombre.split(' ')[0]}</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-xl py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="font-semibold text-sm">{studentInfo.nombre}</p>
                        <p className="text-xs text-gray-500">ID: {studentInfo.id}</p>
                        {studentInfo.centro_local && (
                          <p className="text-xs text-gray-500">{studentInfo.centro_local}</p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          handleExportProgress();
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Exportar Progreso</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Botón menú móvil */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pt-4 border-t border-white border-opacity-20"
            >
              <div className="flex flex-col space-y-2">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive('/') ? 'bg-golden-yellow text-deep-blue font-semibold' : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/logros"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive('/logros') ? 'bg-golden-yellow text-deep-blue font-semibold' : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <Trophy className="w-5 h-5" />
                  <span>Logros</span>
                </Link>
                <Link
                  to="/estadisticas"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                    isActive('/estadisticas') ? 'bg-golden-yellow text-deep-blue font-semibold' : 'text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Estadísticas</span>
                </Link>
                {studentInfo && (
                  <>
                    <div className="border-t border-white border-opacity-20 my-2"></div>
                    <div className="px-4 py-2">
                      <p className="text-sm font-semibold">{studentInfo.nombre}</p>
                      <p className="text-xs text-gray-300">ID: {studentInfo.id}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleExportProgress();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                      <span>Exportar Progreso</span>
                    </button>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
