import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TramitesPage from './pages/TramitesPage';
import TramiteFormPage from './pages/TramiteFormPage';
import MisTramitesPage from './pages/MisTramitesPage';
import FuncionarioPage from './pages/FuncionarioPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/tramites" element={<TramitesPage />} />
          <Route
            path="/tramites/:id"
            element={
              <ProtectedRoute roles={['CIUDADANO']}>
                <TramiteFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mis-tramites"
            element={
              <ProtectedRoute roles={['CIUDADANO']}>
                <MisTramitesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/funcionario"
            element={
              <ProtectedRoute roles={['FUNCIONARIO']}>
                <FuncionarioPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
