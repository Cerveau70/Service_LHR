import React, { useState, useEffect } from 'react';
import { Statistics, ServiceType, User } from '../../../types/extended';
import extendedApi from '../../../services/extendedApiFixed';

interface AdminStatisticsProps {
    currentUser: User;
}

const AdminStatisticsFixed: React.FC<AdminStatisticsProps> = ({ currentUser }) => {
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
        endDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        loadStatistics();
    }, [dateRange]);

    const loadStatistics = async () => {
        setLoading(true);
        try {
            const stats = await extendedApi.getStatistics();
            setStatistics(stats);
        } catch (error) {
            console.error('Error loading statistics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!statistics) {
        return (
            <div className="text-center py-12">
                <span className="text-4xl mb-4 block">📊</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Erreur de chargement
                </h3>
                <p className="text-gray-500">
                    Impossible de charger les statistiques.
                </p>
            </div>
        );
    }

    const maxPropertiesByCity = Math.max(...Object.values(statistics.propertiesByCity).map(v => Number(v)));
    const maxReservationsByAgent = Math.max(...Object.values(statistics.reservationsByAgent).map(v => Number(v)));

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
                <div className="flex space-x-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date début
                        </label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date fin
                        </label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Main Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <span className="text-2xl">🏢</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Biens</p>
                            <p className="text-3xl font-bold text-gray-900">{statistics.totalProperties}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Disponibles</p>
                            <p className="text-3xl font-bold text-gray-900">{statistics.availableProperties}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <span className="text-2xl">📅</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Réservations</p>
                            <p className="text-3xl font-bold text-gray-900">{statistics.totalReservations}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Revenus</p>
                            <p className="text-3xl font-bold text-gray-900">{statistics.totalRevenue.toLocaleString()} XOF</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Service Type Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Service</h3>
                    <div className="space-y-4">
                        {Object.entries(statistics.revenueByService).map(([serviceType, revenue]) => (
                            <div key={serviceType} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="text-lg mr-3">
                                        {serviceType === ServiceType.HOUSING ? '🏠' :
                                         serviceType === ServiceType.HOTEL ? '🏨' : '🏢'}
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {serviceType === ServiceType.HOUSING ? 'Logement' :
                                         serviceType === ServiceType.HOTEL ? 'Hôtel' : 'Résidence'}
                                    </span>
                                </div>
                                <span className="text-lg font-bold text-primary">
                                    {Number(revenue).toLocaleString()} XOF
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Biens par Ville</h3>
                    <div className="space-y-4">
                        {Object.entries(statistics.propertiesByCity)
                            .sort(([,a], [,b]) => Number(b) - Number(a))
                            .slice(0, 10)
                            .map(([city, count]) => (
                            <div key={city} className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">{city}</span>
                                <div className="flex items-center">
                                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{
                                                width: `${maxPropertiesByCity > 0 ? (Number(count) / maxPropertiesByCity) * 100 : 0}%`
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-bold text-gray-600">{Number(count)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Agents */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Agents par Réservations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(statistics.reservationsByAgent)
                        .sort(([,a], [,b]) => Number(b) - Number(a))
                        .slice(0, 9)
                        .map(([agentId, count], index) => (
                        <div key={agentId} className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Agent {agentId}</p>
                                <p className="text-sm text-gray-500">{Number(count)} réservations</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-2xl mr-3">📊</span>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Rapport Détaillé</p>
                            <p className="text-sm text-gray-500">Exporter les statistiques</p>
                        </div>
                    </button>

                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-2xl mr-3">📈</span>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Analyse Tendances</p>
                            <p className="text-sm text-gray-500">Voir l'évolution</p>
                        </div>
                    </button>

                    <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="text-2xl mr-3">⚙️</span>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">Configuration</p>
                            <p className="text-sm text-gray-500">Paramètres des rapports</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminStatisticsFixed;
