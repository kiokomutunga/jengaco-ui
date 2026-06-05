import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// Public pages
import Landing    from './pages/Landing';
import Login      from './pages/Login';
import Register   from './pages/Register';

// Dashboard pages
import DashboardLayout  from './components/layout/DashboardLayout';
import Dashboard        from './pages/dashboard/Dashboard';
import Projects         from './pages/dashboard/Projects';
import ProjectDetail    from './pages/dashboard/ProjectDetail';
import Quotations       from './pages/dashboard/Quotations';
import Payments         from './pages/dashboard/Payments';
import Messages         from './pages/dashboard/Messages';
import Notifications    from './pages/dashboard/Notifications';
import Profile          from './pages/dashboard/Profile';
import Professionals    from './pages/dashboard/Professionals';
import ProfessionalDetail from './pages/dashboard/ProfessionalDetail';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="skeleton" style={{ width:48, height:48, borderRadius:'50%' }} />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index                       element={<Dashboard />} />
            <Route path="projects"             element={<Projects />} />
            <Route path="projects/:id"         element={<ProjectDetail />} />
            <Route path="quotations"           element={<Quotations />} />
            <Route path="payments"             element={<Payments />} />
            <Route path="messages"             element={<Messages />} />
            <Route path="notifications"        element={<Notifications />} />
            <Route path="profile"              element={<Profile />} />
            <Route path="professionals"        element={<Professionals />} />
            <Route path="professionals/:id"    element={<ProfessionalDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
