import { useEffect, useMemo, useState } from 'react';
import CaseForm from './CaseForm';
import JudgeEditor from './JudgeEditor';
import Results from './Results';
import { judgeService } from '../../services/judgeService';

const starterCode = `a, b = map(float, input().split())
print(a + b)`;

const sortSubmissions = (items) =>
  [...items].sort((left, right) => {
    const leftDate = left.created_at ? new Date(left.created_at).getTime() : 0;
    const rightDate = right.created_at ? new Date(right.created_at).getTime() : 0;
    if (leftDate !== rightDate) {
      return rightDate - leftDate;
    }
    return (right.id || 0) - (left.id || 0);
  });

const JudgeWorkspace = () => {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [code, setCode] = useState(starterCode);
  const [submissions, setSubmissions] = useState([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);
  const [isLoadingCaseDetails, setIsLoadingCaseDetails] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState(null);

  const latestSubmission = useMemo(() => {
    if (!submissions.length) {
      return null;
    }
    return sortSubmissions(submissions)[0];
  }, [submissions]);

  const loadCases = async () => {
    setIsLoadingCases(true);
    let loadedCases = [];
    try {
      loadedCases = await judgeService.listCases();
      setCases(loadedCases);
      if (loadedCases.length && !selectedCaseId) {
        setSelectedCaseId(loadedCases[0].id);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Не удалось загрузить кейсы' });
    } finally {
      setIsLoadingCases(false);
    }
    return loadedCases;
  };

  const loadCaseDetails = async (caseId) => {
    setIsLoadingCaseDetails(true);
    try {
      const [caseData, submissionsData] = await Promise.all([
        judgeService.getCase(caseId),
        judgeService.listSubmissions(caseId)
      ]);
      setSelectedCase(caseData);
      setSubmissions(submissionsData);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Не удалось загрузить данные кейса' });
      setSelectedCase(null);
      setSubmissions([]);
    } finally {
      setIsLoadingCaseDetails(false);
    }
  };

  useEffect(() => {
    loadCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      loadCaseDetails(selectedCaseId);
    }
  }, [selectedCaseId]);

  const handleCreateCase = async (createdCase) => {
    const updatedCases = await loadCases();
    if (createdCase?.id) {
      setSelectedCaseId(createdCase.id);
    } else if (updatedCases.length && !selectedCaseId) {
      setSelectedCaseId(updatedCases[0].id);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCaseId) {
      setMessage({ type: 'error', text: 'Выберите кейс для отправки решения' });
      return;
    }

    setIsRunning(true);
    setMessage(null);

    try {
      await judgeService.submitSolution({
        case_id: selectedCaseId,
        language: 'python',
        code
      });
      setMessage({ type: 'success', text: 'Решение отправлено на проверку' });
      const updatedSubmissions = await judgeService.listSubmissions(selectedCaseId);
      setSubmissions(updatedSubmissions);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Не удалось отправить решение' });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Контест: проверка решений</h2>
          <p className="text-sm text-gray-500">
            Управляйте тестами и проверяйте пользовательские решения в изолированной песочнице.
          </p>
        </div>
        <button
          type="button"
          onClick={loadCases}
          className="self-start rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-300 hover:text-gray-800"
        >
          Обновить кейсы
        </button>
      </div>

      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Кейсы</h3>
              {isLoadingCases && (
                <span className="text-xs text-gray-500">Загрузка...</span>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <label className="block space-y-1 text-sm">
                <span className="text-gray-600">Выберите кейс</span>
                <select
                  value={selectedCaseId || ''}
                  onChange={(event) => setSelectedCaseId(Number(event.target.value))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  disabled={!cases.length}
                >
                  {!cases.length && <option>Кейсы отсутствуют</option>}
                  {cases.map((item) => (
                    <option key={item.id} value={item.id}>
                      #{item.id}. {item.title}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
                <span className="text-sm font-semibold text-gray-900">
                  {selectedCase ? selectedCase.title : '—'}
                </span>
                {isLoadingCaseDetails ? (
                  <span className="text-xs text-gray-500">Загрузка описания...</span>
                ) : (
                  <p className="whitespace-pre-wrap text-gray-600">
                    {selectedCase?.description || 'Описание отсутствует'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <CaseForm onCreated={handleCreateCase} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Решение</h3>
              {isRunning && <span className="text-xs text-gray-500">Отправка...</span>}
            </div>
            <div className="mt-4 space-y-4">
              <JudgeEditor value={code} onChange={setCode} />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isRunning}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {isRunning ? 'Проверка...' : 'Отправить на проверку'}
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Результаты</h3>
            <div className="mt-4">
              <Results
                rows={latestSubmission?.tests || []}
                totalTime={latestSubmission?.total_time_ms}
                verdict={latestSubmission?.verdict}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgeWorkspace;
