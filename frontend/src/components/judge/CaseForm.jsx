import { useMemo, useState } from 'react';
import { judgeService } from '../../services/judgeService';

const emptyTest = () => ({ input_text: '', expected_text: '' });

const CaseForm = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tests, setTests] = useState([emptyTest()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isDisabled = useMemo(() => {
    if (!title.trim() || !description.trim()) {
      return true;
    }
    return tests.some((test) => !test.input_text.trim() || !test.expected_text.trim());
  }, [title, description, tests]);

  const handleTestChange = (index, key, value) => {
    setTests((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleAddTest = () => {
    setTests((prev) => [...prev, emptyTest()]);
  };

  const handleRemoveTest = (index) => {
    setTests((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTests([emptyTest()]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isDisabled) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const createdCase = await judgeService.createCase({
        title: title.trim(),
        description: description.trim(),
        tests: tests.map((test) => ({
          input_text: test.input_text.trim(),
          expected_text: test.expected_text.trim()
        }))
      });
      resetForm();
      onCreated?.(createdCase);
    } catch (err) {
      setError(err.message || 'Не удалось создать кейс');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Создать кейс</h3>
        <p className="text-sm text-gray-500">
          Добавьте описание задачи и тестовые данные для проверки решений.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="block text-sm font-medium text-gray-600">Заголовок</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Сложение чисел"
          />
        </label>

        <label className="space-y-1">
          <span className="block text-sm font-medium text-gray-600">Описание</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Введите описание задачи"
          />
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">Тесты</h4>
          <button
            type="button"
            onClick={handleAddTest}
            className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
          >
            Добавить тест
          </button>
        </div>

        <div className="space-y-3">
          {tests.map((test, index) => (
            <div key={index} className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm font-semibold text-gray-700">Тест #{index + 1}</span>
                {tests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTest(index)}
                    className="text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Удалить
                  </button>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="text-gray-600">Входные данные</span>
                  <textarea
                    value={test.input_text}
                    onChange={(event) => handleTestChange(index, 'input_text', event.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="1 2"
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-gray-600">Ожидаемый вывод</span>
                  <textarea
                    value={test.expected_text}
                    onChange={(event) => handleTestChange(index, 'expected_text', event.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="3"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isDisabled || isSubmitting}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
      >
        {isSubmitting ? 'Сохранение...' : 'Сохранить кейс'}
      </button>
    </form>
  );
};

export default CaseForm;
