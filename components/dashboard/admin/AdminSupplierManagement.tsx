import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from '../../../types/extended';
import extendedApi from '../../../services/extendedApiFixed';

interface AdminSupplierManagementProps {
    currentUser: User;
}

const AdminSupplierManagement: React.FC<AdminSupplierManagementProps> = ({ currentUser }) => {
    const [suppliers, setSuppliers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        city: '',
        status: '',
    });

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        setLoading(true);
        try {
            const fetchedUsers = await extendedApi.getUsers();
            const supplierUsers = fetchedUsers.filter(user => user.role === UserRole.SUPPLIER);
            setSuppliers(supplierUsers);
        } catch (error) {
            console.error('Error loading suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (supplierId: string, newStatus: UserStatus) => {
        try {
            const success = await extendedApi.updateUserStatus(supplierId, newStatus);
            if (success) {
                setSuppliers(suppliers.map(supplier =>
                    supplier.id === supplierId ? { ...supplier, status: newStatus } : supplier
                ));
            }
        } catch (error) {
            console.error('Error updating supplier status:', error);
        }
    };

    const handleDeleteSupplier = async (supplierId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
            try {
                const success = await extendedApi.deleteUser(supplierId);
                if (success) {
                    setSuppliers(suppliers.filter(supplier => supplier.id !== supplierId));
                }
            } catch (error) {
                console.error('Error deleting supplier:', error);
            }
        }
    };

    const filteredSuppliers = suppliers.filter(supplier => {
        if (filters.city && supplier.city !== filters.city) return false;
        if (filters.status && supplier.status !== filters.status) return false;
        return true;
    });

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
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Fournisseurs</h1>
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    + Ajouter un fournisseur
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="text-2xl">🏪</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Fournisseurs</p>
                            <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
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
                                {suppliers.filter(s => s.status === UserStatus.ACTIVE).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <span className="text-2xl">📍</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Villes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {new Set(suppliers.map(s => s.city).filter(Boolean)).size}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            {Array.from(new Set(suppliers.map(s => s.city).filter(Boolean))).map(city => (
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
                            onClick={() => setFilters({ city: '', status: '' })}
                            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </div>

            {/* Suppliers Table */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fournisseur
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Localisation
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
                        {filteredSuppliers.map((supplier) => (
                            <tr key={supplier.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                                                {supplier.name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {supplier.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {supplier.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>{supplier.phone1}</div>
                                    {supplier.phone2 && <div className="text-gray-500">{supplier.phone2}</div>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{supplier.city}</div>
                                    <div className="text-sm text-gray-500">{supplier.address}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={supplier.status}
                                        onChange={(e) => handleStatusChange(supplier.id, e.target.value as UserStatus)}
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-none ${getStatusColor(supplier.status)}`}
                                    >
                                        <option value={UserStatus.ACTIVE}>Actif</option>
                                        <option value={UserStatus.INACTIVE}>Inactif</option>
                                        <option value={UserStatus.SUSPENDED}>Suspendu</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDeleteSupplier(supplier.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredSuppliers.length === 0 && (
                    <div className="text-center py-12">
                        <span className="text-4xl mb-4 block">🏪</span>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun fournisseur trouvé
                        </h3>
                        <p className="text-gray-500">
                            {suppliers.length === 0
                                ? "Aucun fournisseur n'a été ajouté pour le moment."
                                : "Aucun fournisseur ne correspond aux critères de recherche."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSupplierManagement;
