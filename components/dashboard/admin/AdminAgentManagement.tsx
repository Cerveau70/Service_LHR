import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../../../types/extended';
import extendedApi from '../../../services/extendedApiFixed';

interface AdminAgentManagementProps {
    currentUser: User;
}

const AdminAgentManagement: React.FC<AdminAgentManagementProps> = ({ currentUser }) => {
    const [agents, setAgents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingAgent, setEditingAgent] = useState<User | null>(null);
    const [filters, setFilters] = useState({
        agency: '',
        city: '',
        status: '',
    });

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        setLoading(true);
        try {
            const fetchedUsers = await extendedApi.getUsers();
            const agentUsers = fetchedUsers.filter(user =>
                user.role === UserRole.AGENT || user.role === UserRole.MANAGER
            );
            setAgents(agentUsers);
        } catch (error) {
            console.error('Error loading agents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (agentId: string, newStatus: UserStatus) => {
        try {
            const success = await extendedApi.updateUserStatus(agentId, newStatus);
            if (success) {
                setAgents(agents.map(agent =>
                    agent.id === agentId ? { ...agent, status: newStatus } : agent
                ));
            }
        } catch (error) {
            console.error('Error updating agent status:', error);
        }
    };

    const handleRoleChange = async (agentId: string, newRole: UserRole) => {
        try {
            const success = await extendedApi.updateUserRole(agentId, newRole, []);
            if (success) {
                setAgents(agents.map(agent =>
                    agent.id === agentId ? { ...agent, role: newRole } : agent
                ));
            }
        } catch (error) {
            console.error('Error updating agent role:', error);
        }
    };

    const handleDeleteAgent = async (agentId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet agent ?')) {
            try {
                const success = await extendedApi.deleteUser(agentId);
                if (success) {
                    setAgents(agents.filter(agent => agent.id !== agentId));
                }
            } catch (error) {
                console.error('Error deleting agent:', error);
            }
        }
    };

    const filteredAgents = agents.filter(agent => {
        if (filters.agency && !agent.agency?.toLowerCase().includes(filters.agency.toLowerCase())) return false;
        if (filters.city && agent.city !== filters.city) return false;
        if (filters.status && agent.status !== filters.status) return false;
        return true;
    });

    const getRoleDisplayName = (role: UserRole) => {
        switch (role) {
            case UserRole.AGENT: return 'Agent Immobilier';
            case UserRole.MANAGER: return 'Gestionnaire';
            default: return role;
        }
    };

    const getStatusColor = (status: UserStatus) => {
        switch (status) {
            case UserStatus.ACTIVE: return 'bg-green-100 text-green-800';
            case UserStatus.INACTIVE: return 'bg-yellow-100 text-yellow-800';
            case UserStatus.SUSPENDED: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Agents</h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    + Ajouter un agent
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Agents</p>
                            <p className="text-2xl font-bold text-gray-900">{agents.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Actifs</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {agents.filter(a => a.status === UserStatus.ACTIVE).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <span className="text-2xl">⏸️</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Inactifs</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {agents.filter(a => a.status === UserStatus.INACTIVE).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <span className="text-2xl">🏢</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Agences</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {new Set(agents.map(a => a.agency).filter(Boolean)).size}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Agence
                        </label>
                        <input
                            type="text"
                            value={filters.agency}
                            onChange={(e) => setFilters(prev => ({ ...prev, agency: e.target.value }))}
                            placeholder="Rechercher par agence..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ville
                        </label>
                        <select
                            value={filters.city}
                            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Toutes</option>
                            {Array.from(new Set(agents.map(a => a.city).filter(Boolean))).map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Tous</option>
                            <option value={UserStatus.ACTIVE}>Actif</option>
                            <option value={UserStatus.INACTIVE}>Inactif</option>
                            <option value={UserStatus.SUSPENDED}>Suspendu</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ agency: '', city: '', status: '' })}
                            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </div>

            {/* Agents Table */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Agent
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Agence
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rôle
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAgents.map((agent) => (
                            <tr key={agent.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                                                {agent.name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {agent.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {agent.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>{agent.phone1}</div>
                                    {agent.phone2 && <div className="text-gray-500">{agent.phone2}</div>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{agent.agency}</div>
                                    <div className="text-sm text-gray-500">{agent.city}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={agent.role}
                                        onChange={(e) => handleRoleChange(agent.id, e.target.value as UserRole)}
                                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <option value={UserRole.AGENT}>Agent Immobilier</option>
                                        <option value={UserRole.MANAGER}>Gestionnaire</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={agent.status}
                                        onChange={(e) => handleStatusChange(agent.id, e.target.value as UserStatus)}
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-none ${getStatusColor(agent.status)}`}
                                    >
                                        <option value={UserStatus.ACTIVE}>Actif</option>
                                        <option value={UserStatus.INACTIVE}>Inactif</option>
                                        <option value={UserStatus.SUSPENDED}>Suspendu</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => setEditingAgent(agent)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAgent(agent.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredAgents.length === 0 && (
                    <div className="text-center py-12">
                        <span className="text-4xl mb-4 block">👥</span>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun agent trouvé
                        </h3>
                        <p className="text-gray-500">
                            {agents.length === 0
                                ? "Aucun agent n'a été ajouté pour le moment."
                                : "Aucun agent ne correspond aux critères de recherche."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAgentManagement;
