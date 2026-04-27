import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TransactionDashboard from './components/TransactionDashboard';
import LoginPage from './components/LoginPage';
import OAuthCallback from './components/OAuthCallback';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedHome() {
    const { token } = useAuth();
    if (!token) return <LoginPage />;
    return <TransactionDashboard />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/callback" element={<OAuthCallback />} />
            <Route path="/" element={<ProtectedHome />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div className="relative min-h-screen">
                    <div className="grain-overlay" />
                    <AppRoutes />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
