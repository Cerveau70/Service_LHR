import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ClientView from './components/ClientView';
import Login from './components/Login';
import Contact from './components/Contact';
import About from './components/About';
import Dashboard from './components/dashboard/Dashboard';
import { User, ServiceType } from './types';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleLogin = (user: User) => {
        setCurrentUser(user);
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    // Simulate checking for a logged-in user on app start
    useEffect(() => {
        // In a real app, you might check localStorage or a session
    }, []);

    return (
        <HashRouter>
            <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
                <Header currentUser={currentUser} onLogout={handleLogout} />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Navigate to="/logement" replace />} />
                        <Route path="/logement" element={<ClientView serviceType={ServiceType.HOUSING} />} />
                        <Route path="/hotel" element={<ClientView serviceType={ServiceType.HOTEL} />} />
                        <Route path="/residence" element={<ClientView serviceType={ServiceType.RESIDENCE} />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<About />} />

                        <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
                        <Route path="/dashboard/*" element={currentUser ? <Dashboard currentUser={currentUser} /> : <Navigate to="/login" />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </HashRouter>
    );
};

export default App;
