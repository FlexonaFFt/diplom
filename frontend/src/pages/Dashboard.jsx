import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
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
          {/* top row */}
          <div className="flex min-h-16 items-center justify-between py-2">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Контрольная панель</h1>
              <p className="text-xs text-gray-500">Управление пользователями и контестом</p>
            </div>

            <div className="flex items-center gap-4">
              {/* CTA в админку — на md+ в правом углу */}
              <Link
                to="/admin"
                aria-label="Открыть панель администратора"
                className="hidden md:inline-flex items-center gap-2 h-10 rounded-2xl border border-gray-300 px-4 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.99] transition"
              >
                <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                <span>Панель администратора</span>
              </Link>

              <span className="text-sm text-gray-700">Привет, {user?.username || user?.email}!</span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Выйти
              </button>
            </div>
          </div>

          {/* мобильная версия CTA: под заголовком, на всю ширину не растягиваем */}
          <div className="pb-3 md:hidden">
            <Link
              to="/admin"
              aria-label="Открыть панель администратора"
              className="inline-flex items-center gap-2 h-10 rounded-2xl border border-gray-300 px-4 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.99] transition"
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Панель администратора</span>
            </Link>
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
