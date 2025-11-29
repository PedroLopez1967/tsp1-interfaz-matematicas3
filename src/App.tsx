/**
 * Componente App - Componente raíz con enrutamiento
 * TSP1 - Matemática III
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Dashboard from './pages/Dashboard';
import ObjectivePage from './pages/ObjectivePage';
import ProblemSolver from './pages/ProblemSolver';
import AchievementsPage from './pages/AchievementsPage';
import StatisticsPage from './pages/StatisticsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/objetivo/:objectiveId" element={<ObjectivePage />} />
          <Route path="/problema/:problemId" element={<ProblemSolver />} />
          <Route path="/logros" element={<AchievementsPage />} />
          <Route path="/estadisticas" element={<StatisticsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
