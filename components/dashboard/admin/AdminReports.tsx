import React, { useState, useEffect } from 'react';
import { User, ServiceType } from '../../../types/extended';
import extendedApi from '../../../services/extendedApiFixed';

interface AdminReportsProps {
    currentUser: User;
}

const AdminReports: React.FC<AdminReportsProps> = ({ currentUser }) => {
    const [reservationReport, setReservationReport] = useState<any[]>([]);
    const [revenueReport, setRevenueReport] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [reportType, setReportType] = useState<'reservations' | 'revenue'>('reservations');
    const [filters, setFilters] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        agentId: '',
        serviceType: '',
    });

    const loadReport = async () => {
        setLoading(true);
        try {
            if (reportType === 'reservations') {
                const report = await extendedApi.getReservationReport(filters);
                setReservationReport(report);
            } else {
                const report = await extendedApi.getRevenueReport(filters);
                setRevenueReport(report);
            }
        } catch (error) {
            console.error('Error loading report:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, [reportType, filters]);

    const handleExport = () => {
        const data = reportType === 'reservations' ? reservationReport : revenueReport;
        const csvContent = "data:text/csv;charset=utf-8,"
            + Object.keys(data[0] || {}).join(",") + "\n"
            + data.map(row => Object.values(row).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${reportType}_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getServiceTypeLabel = (serviceType: ServiceType) => {
        switch (serviceType) {
            case ServiceType.HOUSING: return 'Logement';
            case ServiceType.HOTEL: return 'Hôtel';
            case ServiceType.RESIDENCE: return 'Résidence';
            default: return serviceType;
        }
    };

    const currentReport = reportType === 'reservations' ? reservationReport : revenueReport;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
                <div className="flex space-x-4">
                    <button
                        onClick={handleExport}
                        disabled={currentReport.length === 0}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300"
                    >
                       Exporter CSV
                    </button>
                </div>
            </div>

            {/* Report Type Selector */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setReportType('reservations')}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            reportType === 'reservations'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Réservations
                    </button>
                    <button
                        onClick={() => setReportType('revenue')}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            reportType === 'revenue'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Revenus
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date début
                        </label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date fin
                        </label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Agent ID
                        </label>
                        <input
                            type="text"
                            value={filters.agentId}
                            onChange={(e) => setFilters(prev => ({ ...prev, agentId: e.target.value }))}
                            placeholder="ID de l'agent..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

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
                </div>

                <div className="mt-4 flex justify-end">
                    <button
                        onClick={loadReport}
                        className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Actualiser
                    </button>
                </div>
            </div>

            {/* Report Data */}
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : currentReport.length === 0 ? (
                    <div className="text-center py-12">
                        <span className="text-4xl mb-4 block"></span>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun résultat
                        </h3>
                        <p className="text-gray-500">
                            Aucun enregistrement trouvé pour les critères sélectionnés.
                        </p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {reportType === 'reservations' ? (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            ID Réservation
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Client
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Propriété
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Dates
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Montant
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Statut
                                        </th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Période
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Service
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Réservations
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Revenus
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Moyenne
                                        </th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentReport.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {reportType === 'reservations' ? (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {row.id || row.reservationId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div>{row.clientName}</div>
                                                <div className="text-gray-500">{row.clientEmail}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div>{row.propertyName}</div>
                                                <div className="text-gray-500">{getServiceTypeLabel(row.serviceType)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <div>{row.startDate}</div>
                                                <div className="text-gray-500">→ {row.endDate}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {Number(row.totalPrice || row.amount).toLocaleString()} XOF
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    row.status === 'Confirmed' || row.status === 'Confirmé'
                                                        ? 'bg-green-100 text-green-800'
                                                        : row.status === 'Cancelled' || row.status === 'Annulé'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {row.period || row.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {getServiceTypeLabel(row.serviceType)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {row.reservations || row.count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {Number(row.revenue || row.amount).toLocaleString()} XOF
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {row.average ? Number(row.average).toLocaleString() + ' XOF' : '-'}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Summary */}
            {currentReport.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{currentReport.length}</p>
                            <p className="text-sm text-gray-600">Total des enregistrements</p>
                        </div>
                        {reportType === 'reservations' && (
                            <>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {reservationReport.filter(r => r.status === 'Confirmed' || r.status === 'Confirmé').length}
                                    </p>
                                    <p className="text-sm text-gray-600">Réservations confirmées</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {reservationReport.reduce((sum, r) => sum + Number(r.totalPrice || r.amount), 0).toLocaleString()} XOF
                                    </p>
                                    <p className="text-sm text-gray-600">Revenus totaux</p>
                                </div>
                            </>
                        )}
                        {reportType === 'revenue' && (
                            <>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-green-600">
                                        {revenueReport.reduce((sum, r) => sum + Number(r.reservations || r.count), 0)}
                                    </p>
                                    <p className="text-sm text-gray-600">Total réservations</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">
                                        {revenueReport.reduce((sum, r) => sum + Number(r.revenue || r.amount), 0).toLocaleString()} XOF
                                    </p>
                                    <p className="text-sm text-gray-600">Revenus totaux</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReports;
