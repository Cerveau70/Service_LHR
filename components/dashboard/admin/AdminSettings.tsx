import React, { useState, useEffect } from 'react';
import { cities, communes, propertyTypes } from '../../../constants';
import api from '../../../services/api';
import { User } from '../../../types/extended';

interface AdminSettingsProps {
    currentUser: User;
}

const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-xl font-bold text-accent">{title}</h2>
            <button className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-blue-700">Ajouter</button>
        </div>
        <div>{children}</div>
    </div>
);

const AdminSettings: React.FC<AdminSettingsProps> = ({ currentUser }) => {
    const [reservationFee, setReservationFee] = useState<number>(0);

    useEffect(() => {
        const fetchSettings = async () => {
            const settings = await api.getSettings();
            setReservationFee(settings.reservationFee);
        };
        fetchSettings();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Paramètres de la Plateforme</h1>

            <SettingSection title="Villes et Communes">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cities.map(city => (
                        <div key={city} className="border p-4 rounded-md">
                            <h3 className="font-bold text-lg">{city}</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                                {(communes[city as keyof typeof communes] || []).map(commune => <li key={commune}>{commune}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </SettingSection>

            <SettingSection title="Types de biens">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(propertyTypes).map(([service, types]) => (
                        <div key={service} className="border p-4 rounded-md">
                            <h3 className="font-bold text-lg">{service}</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                                {types.map(type => <li key={type}>{type}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </SettingSection>

             <SettingSection title="Frais de Réservation">
                <p>Ici, l'administrateur pourrait définir les frais de réservation de base ou par type de propriété qui seraient utilisés par le système de paiement.</p>
                {/* Example form */}
                <div className="mt-4 flex items-center space-x-4">
                    <label>Frais pour 'Logement':</label>
                    <input type="number" value={reservationFee} onChange={e => setReservationFee(Number(e.target.value))} className="p-2 border rounded-md w-32" />
                    <span>FCFA</span>
                </div>
             </SettingSection>
        </div>
    );
};

export default AdminSettings;
