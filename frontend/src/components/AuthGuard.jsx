import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthGuard = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем, есть ли токен в localStorage
        if (!authService.isAuthenticated()) {
          setIsLoading(false);
          return;
        }

        // Проверяем валидность токена, пытаясь получить данные пользователя
        try {
          await authService.getCurrentUser();
          setIsAuthenticated(true);
          
          // Перенаправляем на dashboard только если пользователь на странице логина или регистрации
          const publicPaths = ['/login', '/signup', '/'];
          if (publicPaths.includes(location.pathname)) {
            navigate('/dashboard');
          }
        } catch (error) {
          // Токен недействителен, очищаем его
          console.log('Token is invalid, clearing storage');
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
