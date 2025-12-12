import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import BrowseTrainings from './pages/employee/BrowseTrainings';
import AdminTrainings from './pages/admin/AdminTrainings';
import CreateTraining from './pages/admin/CreateTraining';
import ManagerDashboard from './components/dashboard/ManagerDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-learning" element={<BrowseTrainings />} />

            {/* Admin Routes */}
            <Route path="/admin/trainings" element={<AdminTrainings />} />
            <Route path="/admin/trainings/new" element={<CreateTraining />} />
            <Route path="/admin/trainings/edit/:id" element={<CreateTraining />} />

            <Route path="/admin/users" element={<div>Admin Users Placeholder</div>} />

            {/* Manager Routes */}
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />

          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
