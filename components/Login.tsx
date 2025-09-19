import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User } from '../types';

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [mfaCode, setMfaCode] = useState('');
    const [step, setStep] = useState<'email' | 'mfa'>('email');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const success = await api.sendMfaCode(email);
        if (success) {
            setStep('mfa');
        } else {
            setError("Aucun utilisateur trouvé avec cet email.");
        }
        setLoading(false);
    };

    const handleMfaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const user = await api.verifyMfaCode(email, mfaCode);
        if (user) {
            onLogin(user);
            navigate('/dashboard');
        } else {
            setError("Code MFA invalide.");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Accès Professionnel
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Connectez-vous à votre tableau de bord
                    </p>
                </div>
                {step === 'email' && (
                    <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">Email</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Email"
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <p className="text-xs text-gray-500 text-center">Un code de vérification (MFA) sera envoyé à votre mobile dans une application réelle.</p>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
                            >
                                {loading ? 'Envoi du code...' : 'Envoyer le code'}
                            </button>
                        </div>
                    </form>
                )}
                {step === 'mfa' && (
                    <form className="mt-8 space-y-6" onSubmit={handleMfaSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="mfa-code" className="sr-only">Code MFA</label>
                                <input
                                    id="mfa-code"
                                    name="mfaCode"
                                    type="text"
                                    required
                                    value={mfaCode}
                                    onChange={(e) => setMfaCode(e.target.value)}
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                                    placeholder="Code MFA"
                                />
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
                            >
                                {loading ? 'Vérification...' : 'Vérifier le code'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
