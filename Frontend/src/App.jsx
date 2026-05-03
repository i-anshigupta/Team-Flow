import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './store/useAuth';
import { useTheme } from './store/useTheme';
import { api } from './lib/axios';

import Layout from './components/Layout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import Dashboard from './features/dashboard/Dashboard';
import Projects from './features/projects/Projects';
import ProjectDetail from './features/projects/ProjectDetail';
import Profile from './features/profile/Profile';
import Landing from './features/landing/Landing';

function App() {
  const { user, setAuth, logout } = useAuth();
  const { initTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initTheme();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('refreshToken');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.post('/auth/refresh', { refreshToken: token });
        const accessToken = data.data.accessToken;

        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setAuth(res.data.data, accessToken);
      } catch (err) {
        localStorage.removeItem('refreshToken');
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} />
          <Route path="/projects/:id" element={user ? <ProjectDetail /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
