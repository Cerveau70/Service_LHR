import React, { useState, useEffect } from 'react';
import { ServiceType, Property } from '../types';
import { cities, communes, propertyTypes } from '../constants';
import api from '../services/api';
import PropertyCard from './PropertyCard';
import BookingModal from './BookingModal';

interface ClientViewProps {
    serviceType: ServiceType;
}

const ClientView: React.FC<ClientViewProps> = ({ serviceType }) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');
    const [selectedPropertyType, setSelectedPropertyType] = useState('');
    
    const [isBooking, setIsBooking] = useState<Property | null>(null);
    
    useEffect(() => {
        // Reset filters when serviceType changes for better UX
        setSelectedCity('');
        setSelectedCommune('');
        setSelectedPropertyType('');
    }, [serviceType]);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            const filters = {
                serviceType: serviceType,
                city: selectedCity,
                commune: selectedCommune,
                propertyType: selectedPropertyType,
            };
            const data = await api.getProperties(filters);
            setProperties(data);
            setLoading(false);
        };
        fetchProperties();
    }, [serviceType, selectedCity, selectedCommune, selectedPropertyType]);


    const handleBookingSuccess = (data: any) => {
        // Simulate creating visit reservation
        const reservation = {
            ...data,
            propertyId: isBooking!.id,
            propertyName: isBooking!.name,
            bookingDate: new Date().toISOString(),
            visitFee: isBooking!.visitFee || 0,
            status: 'Validated',
            agentId: isBooking!.agentId,
            receiptNumber: `REC-${Date.now()}`,
            agentContact1: 'agent1@example.com',
            agentContact2: 'agent2@example.com',
        };
        console.log('Visit Reservation Created:', reservation);
        // Simulate sending receipt
        console.log('Receipt sent to client and agent');
        alert("Réservation simulée avec succès ! Un e-mail de confirmation a été envoyé.");
        setIsBooking(null);
    };


    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-accent">{`Nos offres de ${serviceType}`}</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select value={selectedCity} onChange={e => { setSelectedCity(e.target.value); setSelectedCommune(''); }} className="p-2 border rounded-md w-full">
                        <option value="">Toutes les villes</option>
                        {cities.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                     <select value={selectedCommune} onChange={e => setSelectedCommune(e.target.value)} className="p-2 border rounded-md w-full" disabled={!selectedCity}>
                        <option value="">Toutes les communes</option>
                        {selectedCity && communes[selectedCity as keyof typeof communes].map(commune => <option key={commune} value={commune}>{commune}</option>)}
                    </select>
                    <select value={selectedPropertyType} onChange={e => setSelectedPropertyType(e.target.value)} className="p-2 border rounded-md w-full">
                        <option value="">Tous les types</option>
                        {propertyTypes[serviceType].map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <p className="text-xl text-gray-600">Chargement des biens...</p>
                </div>
            ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map(property => (
                        <PropertyCard key={property.id} property={property} onBook={() => setIsBooking(property)} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-10">
                    <p className="text-xl text-gray-600">Aucun bien disponible pour les filtres sélectionnés.</p>
                </div>
            )}
             {isBooking && <BookingModal property={isBooking} onClose={() => setIsBooking(null)} onSuccess={(data) => handleBookingSuccess(data)} />}
        </div>
    );
};

export default ClientView;
