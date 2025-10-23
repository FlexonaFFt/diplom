import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import AuthGuard from './components/AuthGuard';
import ProtectedRoute from './components/ProtectedRoute';

// === ленивые импорты админки ===
const AdminLayout       = lazy(() => import('./admin/AdminLayout.jsx'));
const AdminDashboard    = lazy(() => import('./admin/pages/Dashboard.jsx'));
const AdminUsers        = lazy(() => import('./admin/pages/Users.jsx'));
const AdminProblems     = lazy(() => import('./admin/pages/Problems.jsx'));
const AdminProblemSets  = lazy(() => import('./admin/pages/ProblemSets.jsx'));
const AdminSubmissions  = lazy(() => import('./admin/pages/Submissions.jsx'));
const AdminPlagiarism   = lazy(() => import('./admin/pages/Plagiarism.jsx'));
const AdminDatasets     = lazy(() => import('./admin/pages/Datasets.jsx'));
const AdminSettings     = lazy(() => import('./admin/pages/Settings.jsx'));

function Loader() {
  return (
    <div className="min-h-[40vh] grid place-items-center text-gray-600">
      Загрузка админки…
    </div>
  );
}

function Router() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* === admin routes (ленивые) === */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Suspense fallback={<Loader />}>
                  <AdminLayout />
                </Suspense>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="problems" element={<AdminProblems />} />
            <Route path="problem-sets" element={<AdminProblemSets />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="plagiarism" element={<AdminPlagiarism />} />
            <Route path="datasets" element={<AdminDatasets />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}

export default Router;
