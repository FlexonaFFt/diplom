import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AuthGuard from './components/AuthGuard';
import ProtectedRoute from './components/ProtectedRoute';

function Router() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}

export default Router;