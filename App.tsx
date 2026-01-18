import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { AddWord } from './pages/AddWord';
import { RevisionMode } from './pages/RevisionMode';
import { AllWords } from './pages/AllWords';
import { Reports } from './pages/Reports';
import { Profile } from './pages/Profile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-indigo-50 dark:bg-slate-900 text-indigo-500">Loading...</div>;
  
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/add" element={
            <ProtectedRoute>
              <Layout><AddWord /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/revise/:id" element={
            <ProtectedRoute>
              <Layout><RevisionMode /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/library" element={
            <ProtectedRoute>
              <Layout><AllWords /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout><Reports /></Layout>
            </ProtectedRoute>
          } />

           <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={<Navigate to="/profile" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;