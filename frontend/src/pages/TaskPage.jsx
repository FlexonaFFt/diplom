import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TaskPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  // Временные данные для демонстрации
  useEffect(() => {
    // В реальном приложении здесь будет запрос к API
    const mockTask = {
      id: 4,
      title: 'Ход конём',
      difficulty: 'easy',
      description: `
        <h2>Ход конём</h2>
        <p>Дана прямоугольная доска N × M (N строк и M столбцов). В левом верхнем углу находится шахматный конь, которого необходимо переместить в правый нижний угол доски. В данной задаче конь может перемещаться на две клетки вниз и одну клетку вправо или на одну клетку вниз и две клетки вправо.</p>
        <p>Необходимо определить, сколько существует различных маршрутов, ведущих из левого верхнего в правый нижний угол.</p>
        
        <h3>Формат ввода</h3>
        <p>Входной файл содержит два натуральных числа N и M (1 ≤ N, M ≤ 50).</p>
        
        <h3>Формат вывода</h3>
        <p>В выходной файл выведите единственное число — количество способов добраться конём до правого нижнего угла доски.</p>
        
        <h3>Ограничения</h3>
        <ul>
          <li>Ограничение времени: 1 с</li>
          <li>Ограничение памяти: 64 МБ</li>
        </ul>
      `,
      examples: [
        {
          input: '3 2',
          output: '1'
        },
        {
          input: '3 3',
          output: '2'
        },
        {
          input: '4 4',
          output: '5'
        }
      ],
      defaultCode: {
        python: `def count_knight_paths(N, M):
    # Ваш код здесь
    dp = [[0] * M for _ in range(N)]
    dp[0][0] = 1
    
    for i in range(N):
        for j in range(M):
            if i + 2 < N and j + 1 < M:
                dp[i+2][j+1] += dp[i][j]
            if i + 1 < N and j + 2 < M:
                dp[i+1][j+2] += dp[i][j]
    
    return dp[N-1][M-1]

def main():
    N, M = map(int, input().strip().split())
    print(count_knight_paths(N, M))

if __name__ == '__main__':
    main()`,
        cpp: `#include <iostream>
#include <vector>
using namespace std;

int count_knight_paths(int N, int M) {
    // Ваш код здесь
    vector<vector<long long>> dp(N, vector<long long>(M, 0));
    dp[0][0] = 1;
    
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < M; j++) {
            if (i + 2 < N && j + 1 < M) {
                dp[i+2][j+1] += dp[i][j];
            }
            if (i + 1 < N && j + 2 < M) {
                dp[i+1][j+2] += dp[i][j];
            }
        }
    }
    
    return dp[N-1][M-1];
}

int main() {
    int N, M;
    cin >> N >> M;
    cout << count_knight_paths(N, M) << endl;
    return 0;
}`,
        java: `import java.util.Scanner;

public class Main {
    public static long countKnightPaths(int N, int M) {
        // Ваш код здесь
        long[][] dp = new long[N][M];
        dp[0][0] = 1;
        
        for (int i = 0; i < N; i++) {
            for (int j = 0; j < M; j++) {
                if (i + 2 < N && j + 1 < M) {
                    dp[i+2][j+1] += dp[i][j];
                }
                if (i + 1 < N && j + 2 < M) {
                    dp[i+1][j+2] += dp[i][j];
                }
            }
        }
        
        return dp[N-1][M-1];
    }
    
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int N = scanner.nextInt();
        int M = scanner.nextInt();
        System.out.println(countKnightPaths(N, M));
        scanner.close();
    }
}`
      }
    };
    
    setTask(mockTask);
    setCode(mockTask.defaultCode[language]);
  }, [taskId, language]);

  const handleLanguageChange = (newLanguage) => {
    if (task && task.defaultCode[newLanguage]) {
      setLanguage(newLanguage);
      setCode(task.defaultCode[newLanguage]);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Имитация отправки решения
    setTimeout(() => {
      // В реальном приложении здесь будет запрос к API
      setResult({
        status: 'success',
        message: 'Решение принято!',
        testResults: [
          { id: 1, input: '3 2', expectedOutput: '1', actualOutput: '1', status: 'passed' },
          { id: 2, input: '3 3', expectedOutput: '2', actualOutput: '2', status: 'passed' },
          { id: 3, input: '4 4', expectedOutput: '5', actualOutput: '5', status: 'passed' }
        ]
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleRun = () => {
    setIsSubmitting(true);
    
    // Имитация запуска кода
    setTimeout(() => {
      // В реальном приложении здесь будет запрос к API
      setResult({
        status: 'success',
        message: 'Код выполнен успешно!',
        testResults: [
          { id: 1, input: '3 2', expectedOutput: '1', actualOutput: '1', status: 'passed' }
        ]
      });
      setIsSubmitting(false);
    }, 1000);
  };

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка задачи...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{task.id}. {task.title}</h1>
          <div className={`mt-1 inline-block px-2 py-1 rounded-md text-sm ${
            task.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {task.difficulty === 'easy' ? 'Лёгкая' :
             task.difficulty === 'medium' ? 'Средняя' :
             'Сложная'}
          </div>
        </div>
        <button 
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          onClick={() => navigate('/tasks')}
        >
          Назад к списку
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Левая панель - описание задачи */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b">
            <div className="flex">
              <button 
                className={`px-4 py-3 ${activeTab === 'description' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('description')}
              >
                Описание
              </button>
              <button 
                className={`px-4 py-3 ${activeTab === 'solutions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('solutions')}
              >
                Отправленные решения
              </button>
              <button 
                className={`px-4 py-3 ${activeTab === 'discussions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('discussions')}
              >
                Обсуждения
              </button>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
            {activeTab === 'description' && (
              <div>
                <div dangerouslySetInnerHTML={{ __html: task.description }} />
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Примеры</h3>
                  {task.examples.map((example, index) => (
                    <div key={index} className="mb-4 bg-gray-50 p-4 rounded-md">
                      <div className="mb-2">
                        <div className="font-medium">Ввод:</div>
                        <pre className="bg-gray-100 p-2 rounded">{example.input}</pre>
                      </div>
                      <div>
                        <div className="font-medium">Вывод:</div>
                        <pre className="bg-gray-100 p-2 rounded">{example.output}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'solutions' && (
              <div className="text-center py-8 text-gray-500">
                У вас пока нет отправленных решений
              </div>
            )}
            
            {activeTab === 'discussions' && (
              <div className="text-center py-8 text-gray-500">
                Обсуждений пока нет
              </div>
            )}
          </div>
        </div>
        
        {/* Правая панель - редактор кода */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="border-b p-3 flex justify-between items-center">
            <div className="flex space-x-2">
              <select 
                className="px-3 py-1 border rounded-md"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button 
                className="px-4 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                onClick={handleRun}
                disabled={isSubmitting}
              >
                Запустить
              </button>
              <button 
                className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                Отправить
              </button>
            </div>
          </div>
          
          <div className="flex-grow">
            <textarea
              className="w-full h-full p-4 font-mono text-sm focus:outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ minHeight: '400px' }}
            />
          </div>
          
          {/* Результаты выполнения */}
          {result && (
            <div className={`p-4 border-t ${
              result.status === 'success' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <h3 className={`font-semibold ${
                result.status === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </h3>
              
              {result.testResults && (
                <div className="mt-2">
                  {result.testResults.map((test) => (
                    <div key={test.id} className="flex items-center mt-1">
                      <span className={`mr-2 ${
                        test.status === 'passed' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {test.status === 'passed' ? '✓' : '✗'}
                      </span>
                      <span>Тест {test.id}: </span>
                      <span className="ml-1 text-gray-600">
                        Вход: <code>{test.input}</code>, 
                        Ожидаемый выход: <code>{test.expectedOutput}</code>, 
                        Полученный выход: <code>{test.actualOutput}</code>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;