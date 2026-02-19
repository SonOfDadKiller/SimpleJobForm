import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ApplyPage from './pages/ApplyPage';
import ApplicationsPage from './pages/ApplicationsPage';
import logo from './logo.svg';
import './App.css';

// Protects routes that require login
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading){
    return <div className="page-centered"><p>Loading...</p></div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    if (!isAuthenticated) return null;

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-brand">HireFlow</Link>
            <div className="navbar-actions">
                <button onClick={logout} className="btn btn-ghost btn-sm">Log Out</button>
            </div>
        </nav>
    );
}

function App() {
  return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/apply/:slug" element={<ApplyPage />} />
                    <Route path="/dashboard" element={
                      <PrivateRoute> 
                        <DashboardPage /> 
                      </PrivateRoute>
                    }/>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
