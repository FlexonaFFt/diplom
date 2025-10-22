import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthGuard = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1) нет токена — просто рендерим детей (login/admin и т.д.)
        if (!authService.isAuthenticated()) {
          setIsLoading(false);
          return;
        }

        // 2) есть токен — проверим валидность
        try {
          await authService.getCurrentUser();

          // 2a) редиректим на dashboard ТОЛЬКО если человек пришёл на /login или /signup
          if (location.pathname === '/login' || location.pathname === '/signup') {
            navigate('/dashboard', { replace: true });
          }
        } catch (error) {
          // Токен недействителен — чистим и не редиректим насильно
          authService.logout();
        }
      } catch (error) {
        console.error('Auth check error:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;
