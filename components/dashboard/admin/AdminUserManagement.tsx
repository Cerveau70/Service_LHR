import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { User, UserRole } from '../../../types';

const AdminUserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const fetchedUsers = await api.getUsers();
            setUsers(fetchedUsers.filter(u => u.role !== UserRole.ADMIN));
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700">Ajouter un utilisateur</button>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rôle</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Agence/Hôtel</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.name}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.role}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.agency}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Modifier</button>
                                    <button className="text-red-600 hover:text-red-900">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUserManagement;
