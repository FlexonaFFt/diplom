import { authService } from './authService';

const API_BASE_URL = (import.meta.env.VITE_JUDGE_API_BASE || 'http://localhost:8000/api/kontest/judge').replace(/\/$/, '');

const buildUrl = (path, params) => {
  let url = `${API_BASE_URL}${path}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value);
      }
    });
    const query = searchParams.toString();
    if (query) {
      url += `?${query}`;
    }
  }

  return url;
};

const request = async (path, options = {}, attempt = 0) => {
  const {
    method = 'GET',
    body = undefined,
    requireAuth = false,
    params = undefined
  } = options;

  const headers = {};

  if (requireAuth) {
    Object.assign(headers, authService.getAuthHeaders());
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  const fetchOptions = {
    method,
    headers
  };

  if (body !== undefined && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
    if (!fetchOptions.headers['Content-Type']) {
      fetchOptions.headers['Content-Type'] = 'application/json';
    }
  }

  const url = buildUrl(path, params);
  const response = await fetch(url, fetchOptions);

  if (response.status === 401 && requireAuth && attempt === 0) {
    await authService.refreshAccessToken();
    return request(path, options, attempt + 1);
  }

  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = text;
  }

  if (!response.ok) {
    const message = data?.detail || data?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
};

export const judgeService = {
  createCase: (payload) => request('/cases', { method: 'POST', body: payload, requireAuth: true }),
  listCases: () => request('/cases'),
  getCase: (id) => request(`/cases/${id}`),
  submitSolution: (payload) => request('/submit', { method: 'POST', body: payload, requireAuth: true }),
  getSubmission: (id) => request(`/submissions/${id}`, { requireAuth: true }),
  listSubmissions: (caseId) =>
    request('/submissions', {
      requireAuth: true,
      params: caseId ? { case_id: caseId } : undefined
    })
};
