import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем, есть ли токен в localStorage
        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }

        // Проверяем валидность токена
        try {
          await authService.getCurrentUser();
          setIsAuthenticated(true);
        } catch (error) {
          // Токен недействителен, очищаем его и перенаправляем на логин
          console.log('Token is invalid, redirecting to login');
          authService.logout();
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        authService.logout();
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

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

  if (!isAuthenticated) {
    return null; // Компонент не рендерится, пока идет перенаправление
  }

  return children;
};

export default ProtectedRoute;
