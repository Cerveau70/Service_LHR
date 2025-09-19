
import React, { useState, useEffect } from 'react';
import { User, Property } from '../../types';
import api from '../../services/api';

interface ManagePropertiesProps {
    currentUser: User;
}

const ManageProperties: React.FC<ManagePropertiesProps> = ({ currentUser }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            const data = await api.getAgentProperties(currentUser.id);
            setProperties(data);
            setLoading(false);
        };
        fetchProperties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestion des Biens</h1>
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-blue-700">Ajouter un bien</button>
            </div>
            {loading ? <p>Chargement...</p> : (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom du bien</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Prix</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {properties.map(prop => (
                                <tr key={prop.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{prop.name}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{prop.serviceType}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{prop.price.toLocaleString('fr-FR')} FCFA</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${prop.available ? 'text-green-900' : 'text-red-900'}`}>
                                            <span aria-hidden className={`absolute inset-0 ${prop.available ? 'bg-green-200' : 'bg-red-200'} opacity-50 rounded-full`}></span>
                                            <span className="relative">{prop.available ? 'Disponible' : 'Indisponible'}</span>
                                        </span>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Modifier</button>
                                        <button className="text-red-600 hover:text-red-900">Supprimer</button>
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

export default ManageProperties;
