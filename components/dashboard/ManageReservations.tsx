import React, { useState, useEffect } from 'react';
import { User, VisitReservation, UserRole } from '../../types';
import api from '../../services/api';

interface ManageReservationsProps {
    currentUser: User;
}

const ManageReservations: React.FC<ManageReservationsProps> = ({ currentUser }) => {
    const [reservations, setReservations] = useState<VisitReservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            const data = currentUser.role === UserRole.ADMIN ? await api.getAllVisitReservations() : await api.getVisitReservationsForAgent(currentUser.id);
            setReservations(data);
            setLoading(false);
        };
        fetchReservations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const filteredReservations = reservations.filter(res => {
        const matchesDate = !dateFilter || res.visitDate.startsWith(dateFilter);
        const matchesStatus = !statusFilter || res.status === statusFilter;
        return matchesDate && matchesStatus;
    });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestion des Réservations de Visite</h1>
                <button onClick={handlePrint} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300">Imprimer</button>
            </div>
            <div className="mb-4 flex gap-4">
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="p-2 border rounded-md" placeholder="Filtrer par date" />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="p-2 border rounded-md">
                    <option value="">Tous les statuts</option>
                    <option value="Validated">Validée</option>
                    <option value="Refunded">Remboursée</option>
                </select>
            </div>
            {loading ? <p>Chargement...</p> : (
                 <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Client</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Propriété</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date de Visite</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReservations.map(res => (
                                <tr key={res.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{res.clientName} {res.clientFirstname}</p>
                                        <p className="text-gray-600 whitespace-no-wrap">{res.clientEmail}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{res.propertyName}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{res.visitDate}</td>
                                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${res.status === 'Validated' ? 'text-green-900' : 'text-red-900'}`}>
                                            <span aria-hidden className={`absolute inset-0 ${res.status === 'Validated' ? 'bg-green-200' : 'bg-red-200'} opacity-50 rounded-full`}></span>
                                            <span className="relative">{res.status === 'Validated' ? 'Validée' : 'Remboursée'}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                        {currentUser.role === UserRole.ADMIN && res.status === 'Validated' && (
                                            <button className="text-red-600 hover:text-red-900">Annuler</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageReservations;
