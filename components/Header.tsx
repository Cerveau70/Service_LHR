import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { User, ServiceType } from '../types';

interface HeaderProps {
    currentUser: User | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout();
        navigate('/');
    };

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-primary text-white'
                : 'text-gray-700 hover:bg-gray-100 hover:text-accent'
        }`;


    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Left Side: Logo */}
                    <Link to="/" className="flex flex-col items-center text-2xl font-bold text-primary">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V19a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1h3a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-9-9z"/>
                        </svg>
                        <span className="text-xs lowercase">service lhr</span>
                    </Link>

                    {/* Center: Main Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        <NavLink to="/logement" className={navLinkClass}>
                            {ServiceType.HOUSING}
                        </NavLink>
                        <NavLink to="/hotel" className={navLinkClass}>
                            {ServiceType.HOTEL}
                        </NavLink>
                        <NavLink to="/residence" className={navLinkClass}>
                            {ServiceType.RESIDENCE}
                        </NavLink>
                        <NavLink to="/contact" className={navLinkClass}>
                            Contact
                        </NavLink>
                        <NavLink to="/about" className={navLinkClass}>
                            À propos
                        </NavLink>
                        <NavLink to="/login" className={navLinkClass}>
                            Connexion
                        </NavLink>
                    </nav>

                    {/* Right Side: User Actions */}
                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                <span className="text-sm text-gray-600 hidden lg:block">Bonjour, {currentUser.name}</span>
                                <Link to="/dashboard" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                    Tableau de bord
                                </Link>
                                <button
                                    onClick={handleLogoutClick}
                                    className="px-4 py-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
                                >
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                                Connexion Espace Pro
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
