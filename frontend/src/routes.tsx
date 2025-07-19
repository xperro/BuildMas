import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import ClientsPage from "./pages/ClientsPage";
import EstimatesPage from "./pages/EstimatesPage";
import LoginPage from "./pages/Login";
import Layout from "./components/Layout";

const ProtectedRoute = () => {
  const isAuthenticated = localStorage.getItem("loggedIn") === "true";
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setAuthChecked(true);
  }, [localStorage.getItem("loggedIn")]);

  if (!authChecked) return null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/clients" />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/estimates" element={<EstimatesPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
