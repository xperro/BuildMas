import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClientsPage from './pages/ClientsPage';
import EstimatesPage from './pages/EstimatesPage';
import Layout from './components/Layout';

const AppRoutes = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/clients" />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/estimates" element={<EstimatesPage />} />
      </Routes>
    </Layout>
  </Router>
);

export default AppRoutes;
