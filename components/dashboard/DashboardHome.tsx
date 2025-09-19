
import React, { useEffect, useState } from 'react';
import { User, UserRole, Property, Reservation } from '../../types';
import api from '../../services/api';

interface DashboardHomeProps {
    currentUser: User;
}

const StatsCard: React.FC<{ title: string; value: string | number, color: string }> = ({ title, value, color }) => (
    <div className={`p-6 rounded-lg shadow-lg text-white ${color}`}>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
);


const DashboardHome: React.FC<DashboardHomeProps> = ({ currentUser }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            if(currentUser.role === UserRole.ADMIN) {
                setProperties(await api.getAllProperties());
                setReservations(await api.getAllReservations());
            } else {
                setProperties(await api.getAgentProperties(currentUser.id));
                setReservations(await api.getReservationsForAgent(currentUser.id));
            }
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const availableProperties = properties.filter(p => p.available).length;
    const unavailableProperties = properties.filter(p => !p.available).length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Tableau de bord de {currentUser.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard title="Biens Disponibles" value={availableProperties} color="bg-green-500" />
                <StatsCard title="Biens Indisponibles" value={unavailableProperties} color="bg-yellow-500" />
                <StatsCard title="Réservations Totales" value={reservations.length} color="bg-blue-500" />
                {currentUser.role === UserRole.ADMIN && (
                  <StatsCard title="Agents & Gérants" value={4} color="bg-indigo-500" />
                )}
            </div>
            <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Aperçu rapide</h2>
                <p>Bienvenue sur votre espace de gestion. Utilisez le menu de gauche pour naviguer entre les différentes sections.</p>
            </div>
        </div>
    );
};

export default DashboardHome;
