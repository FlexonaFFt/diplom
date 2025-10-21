import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');
  const [stats, setStats] = useState({
    easy: { total: 0, solved: 0 },
    medium: { total: 0, solved: 0 },
    hard: { total: 0, solved: 0 }
  });

  // Временные данные для демонстрации
  useEffect(() => {
    const mockTasks = [
      { id: 1, title: 'Средний элемент', difficulty: 'easy', status: 'solved' },
      { id: 2, title: 'Самый дешевый путь', difficulty: 'medium', status: 'unsolved' },
      { id: 3, title: 'Вывести маршрут максимальной стоимости', difficulty: 'medium', status: 'unsolved' },
      { id: 4, title: 'Ход конём', difficulty: 'easy', status: 'solved' },
      { id: 5, title: 'Кафе', difficulty: 'hard', status: 'unsolved' },
      { id: 6, title: 'НОП с восстановлением ответа', difficulty: 'medium', status: 'unsolved' },
      { id: 7, title: 'Поиск в глубину', difficulty: 'medium', status: 'unsolved' },
      { id: 8, title: 'Компоненты связности', difficulty: 'medium', status: 'unsolved' },
    ];
    
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
    
    // Подсчет статистики
    const newStats = {
      easy: { total: 0, solved: 0 },
      medium: { total: 0, solved: 0 },
      hard: { total: 0, solved: 0 }
    };
    
    mockTasks.forEach(task => {
      newStats[task.difficulty].total += 1;
      if (task.status === 'solved') {
        newStats[task.difficulty].solved += 1;
      }
    });
    
    setStats(newStats);
  }, []);

  // Фильтрация задач
  useEffect(() => {
    let result = [...tasks];
    
    if (searchQuery) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        task.id.toString().includes(searchQuery)
      );
    }
    
    if (difficulty !== 'all') {
      result = result.filter(task => task.difficulty === difficulty);
    }
    
    if (status !== 'all') {
      result = result.filter(task => task.status === status);
    }
    
    setFilteredTasks(result);
  }, [searchQuery, difficulty, status, tasks]);

  // Обработчик клика по задаче
  const handleTaskClick = (taskId) => {
    navigate(`/task/${taskId}`);
  };

  // Получение класса цвета в зависимости от сложности
  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  // Получение текста сложности на русском
  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Лёгкая';
      case 'medium': return 'Средняя';
      case 'hard': return 'Сложная';
      default: return 'Неопределённая';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Задачи <span className="text-gray-500 text-lg">{tasks.length}</span></h1>
      
      {/* Фильтры и поиск */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Поиск по номеру или названию задачи"
            className="w-full px-4 py-2 border rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="absolute right-3 top-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
        
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 border rounded-md"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="all">Все сложности</option>
            <option value="easy">Лёгкие</option>
            <option value="medium">Средние</option>
            <option value="hard">Сложные</option>
          </select>
          
          <select 
            className="px-4 py-2 border rounded-md"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="solved">Решённые</option>
            <option value="unsolved">Нерешённые</option>
          </select>
          
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            Случайная
          </button>
        </div>
      </div>
      
      {/* Статистика */}
      <div className="mb-6 bg-gray-100 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">Задач решено</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="font-medium">Лёгких</div>
            <div>{stats.easy.solved} из {stats.easy.total}</div>
          </div>
          <div>
            <div className="font-medium">Средних</div>
            <div>{stats.medium.solved} из {stats.medium.total}</div>
          </div>
          <div>
            <div className="font-medium">Сложных</div>
            <div>{stats.hard.solved} из {stats.hard.total}</div>
          </div>
        </div>
      </div>
      
      {/* Таблица задач */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Статус</th>
              <th className="py-3 px-6 text-left">№</th>
              <th className="py-3 px-6 text-left">Название</th>
              <th className="py-3 px-6 text-left">Сложность</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {filteredTasks.map((task) => (
              <tr 
                key={task.id} 
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleTaskClick(task.id)}
              >
                <td className="py-3 px-6 text-left">
                  {task.status === 'solved' && <span className="text-green-500">✓</span>}
                </td>
                <td className="py-3 px-6 text-left">{task.id}.</td>
                <td className="py-3 px-6 text-left font-medium">{task.title}</td>
                <td className={`py-3 px-6 text-left ${getDifficultyClass(task.difficulty)}`}>
                  {getDifficultyText(task.difficulty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksPage;