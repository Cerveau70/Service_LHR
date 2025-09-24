import React, { useState, useEffect } from 'react';
import { Property, ServiceType, User } from '../../../types/extended';
import extendedApi from '../../../services/extendedApiFixed';
import { FaBuilding, FaHotel, FaHome } from "react-icons/fa";

interface AdminPropertyManagementProps {
    currentUser: User;
}

const AdminPropertyManagement: React.FC<AdminPropertyManagementProps> = ({ currentUser }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        serviceType: '',
        city: '',
        available: '',
    });

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        setLoading(true);
        try {
            const fetchedProperties = await extendedApi.getProperties();
            setProperties(fetchedProperties);
        } catch (error) {
            console.error('Error loading properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProperty = async (propertyId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
            try {
                const success = await extendedApi.deleteProperty(propertyId);
                if (success) {
                    setProperties(properties.filter(p => p.id !== propertyId));
                }
            } catch (error) {
                console.error('Error deleting property:', error);
            }
        }
    };

    const handleToggleAvailability = async (property: Property) => {
        try {
            const updatedProperty = await extendedApi.updateProperty(property.id, {
                available: !property.available
            });
            if (updatedProperty) {
                setProperties(properties.map(p =>
                    p.id === property.id ? updatedProperty : p
                ));
            }
        } catch (error) {
            console.error('Error updating property availability:', error);
        }
    };

    const filteredProperties = properties.filter(property => {
        if (filters.serviceType && property.serviceType !== filters.serviceType) return false;
        if (filters.city && property.city !== filters.city) return false;
        if (filters.available !== '' && property.available !== (filters.available === 'true')) return false;
        return true;
    });

    const getServiceTypeLabel = (serviceType: ServiceType) => {
        switch (serviceType) {
            case ServiceType.HOUSING: return 'Logement';
            case ServiceType.HOTEL: return 'Hôtel';
            case ServiceType.RESIDENCE: return 'Résidence';
            default: return serviceType;
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
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Biens</h1>
                <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    + Ajouter un bien
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <span className="text-2xl"></span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Biens</p>
                            <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <span className="text-2xl"></span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Disponibles</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {properties.filter(p => p.available).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <span className="text-2xl"></span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Indisponibles</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {properties.filter(p => !p.available).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <span className="text-2xl"></span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Hôtels</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {properties.filter(p => p.serviceType === ServiceType.HOTEL).length}
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
                            Type de service
                        </label>
                        <select
                            value={filters.serviceType}
                            onChange={(e) => setFilters(prev => ({ ...prev, serviceType: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Tous</option>
                            <option value={ServiceType.HOUSING}>Logement</option>
                            <option value={ServiceType.HOTEL}>Hôtel</option>
                            <option value={ServiceType.RESIDENCE}>Résidence</option>
                        </select>
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
                            {Array.from(new Set(properties.map(p => p.city))).map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Disponibilité
                        </label>
                        <select
                            value={filters.available}
                            onChange={(e) => setFilters(prev => ({ ...prev, available: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Tous</option>
                            <option value="true">Disponible</option>
                            <option value="false">Indisponible</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ serviceType: '', city: '', available: '' })}
                            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Réinitialiser
                        </button>
                    </div>
                </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Propriété
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Localisation
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Prix
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
                        {filteredProperties.map((property) => (
                            <tr key={property.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                                <span className="text-lg">
                                                    {property.serviceType === ServiceType.HOUSING ? '' :
                                                     property.serviceType === ServiceType.HOTEL ? '' : ''}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {property.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {property.id}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {getServiceTypeLabel(property.serviceType)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>{property.city}</div>
                                    <div className="text-gray-500">{property.commune}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {property.price.toLocaleString()} XOF
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleToggleAvailability(property)}
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                            property.available
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {property.available ? 'Disponible' : 'Indisponible'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProperty(property.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredProperties.length === 0 && (
                    <div className="text-center py-12">
                        <span className="text-4xl mb-4 block">🏢</span>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucune propriété trouvée
                        </h3>
                        <p className="text-gray-500">
                            {properties.length === 0
                                ? "Aucune propriété n'a été ajoutée pour le moment."
                                : "Aucune propriété ne correspond aux critères de recherche."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPropertyManagement;
