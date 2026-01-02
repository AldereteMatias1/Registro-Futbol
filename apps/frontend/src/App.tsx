import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import JugadoresPage from './pages/JugadoresPage';
import PartidosPage from './pages/PartidosPage';
import PartidoDetallePage from './pages/PartidoDetallePage';
import EstadisticasPage from './pages/EstadisticasPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/jugadores" element={<JugadoresPage />} />
        <Route path="/partidos" element={<PartidosPage />} />
        <Route path="/partidos/:id" element={<PartidoDetallePage />} />
        <Route path="/estadisticas" element={<EstadisticasPage />} />
      </Routes>
    </Layout>
  );
}
