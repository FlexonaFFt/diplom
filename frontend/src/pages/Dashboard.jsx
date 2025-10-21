import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import JudgeWorkspace from '../components/judge/JudgeWorkspace';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!authService.isAuthenticated()) {
          navigate('/login');
          return;
        }

        const userData = await authService.getCurrentUser();
        setUser(userData.user);
      } catch (error) {
        console.error('Error loading user:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Всё равно перенаправляем на страницу входа
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Контрольная панель</h1>
              <p className="text-xs text-gray-500">Управление пользователями и контестом</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">Привет, {user?.username || user?.email}!</span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Информация о пользователе</h2>
              <p className="text-sm text-gray-500">Статус и основные данные учетной записи</p>
            </div>
            <div className="grid gap-1 text-sm text-gray-600 md:text-right">
              <span>ID: {user?.id}</span>
              <span>Email: {user?.email}</span>
              <span>Username: {user?.username}</span>
              <span>Статус: {user?.is_active ? 'Активен' : 'Неактивен'}</span>
              <span>
                Дата регистрации:{' '}
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('ru-RU')
                  : 'Неизвестно'}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white/70 p-1 shadow-sm backdrop-blur">
          <div className="rounded-2xl bg-white p-6">
            <JudgeWorkspace />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
