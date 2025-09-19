import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { User, UserRole } from '../../types';
import DashboardHome from './DashboardHome';
import ManageProperties from './ManageProperties';
import ManageReservations from './ManageReservations';
import AdminUserManagement from './admin/AdminUserManagement';
import AdminSettings from './admin/AdminSettings';

interface DashboardProps {
    currentUser: User;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser }) => {
    const location = useLocation();

    const navLinks = [
        { path: '', label: 'Accueil', roles: [UserRole.ADMIN, UserRole.AGENT, UserRole.MANAGER] },
        { path: 'properties', label: 'Mes Biens', roles: [UserRole.AGENT, UserRole.MANAGER] },
        { path: 'reservations', label: 'Réservations', roles: [UserRole.ADMIN, UserRole.AGENT, UserRole.MANAGER] },
        { path: 'users', label: 'Utilisateurs', roles: [UserRole.ADMIN] },
        { path: 'settings', label: 'Paramètres', roles: [UserRole.ADMIN] },
    ];

    const getLinkClass = (path: string) => {
      const currentPath = location.pathname.replace('/dashboard', '').replace('/', '');
      return currentPath === path ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200';
    }

    return (
        <div className="flex">
            <aside className="w-64 bg-white shadow-md h-screen p-4">
                <nav className="space-y-2">
                    {navLinks.filter(link => link.roles.includes(currentUser.role)).map(link => (
                        <Link
                            key={link.path}
                            to={`/dashboard/${link.path}`}
                            className={`block px-4 py-2 rounded-md font-medium ${getLinkClass(link.path)}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-8">
                <Routes>
                    <Route path="/" element={<DashboardHome currentUser={currentUser} />} />
                    <Route path="/properties" element={<ManageProperties currentUser={currentUser} />} />
                    <Route path="/reservations" element={<ManageReservations currentUser={currentUser} />} />
                    {currentUser.role === UserRole.ADMIN && (
                      <>
                        <Route path="/users" element={<AdminUserManagement />} />
                        <Route path="/settings" element={<AdminSettings />} />
                      </>
                    )}
                </Routes>
            </main>
        </div>
    );
};

export default Dashboard;