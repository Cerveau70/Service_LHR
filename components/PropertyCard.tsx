
import React, { useState } from 'react';
import { Property } from '../types';

interface PropertyCardProps {
    property: Property;
    onBook: (property: Property) => void;
}

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline-block" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);


const PropertyCard: React.FC<PropertyCardProps> = ({ property, onBook }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="relative">
                 <img src={property.images[0]} alt={property.name} className="w-full h-56 object-cover" />
                 <span className={`absolute top-2 right-2 px-3 py-1 text-sm font-bold text-white rounded-full ${property.available ? 'bg-green-500' : 'bg-red-500'}`}>
                    {property.available ? 'Disponible' : 'Indisponible'}
                 </span>
            </div>
            <div className="p-4">
                <h3 className="text-xl font-bold text-accent mb-2">{property.name}</h3>
                <p className="text-gray-600 mb-2">
                    <LocationIcon />
                    {property.commune}, {property.city}
                </p>
                <p className="text-2xl font-extrabold text-primary mb-4">
                    {property.price.toLocaleString('fr-FR')} FCFA
                    <span className="text-sm font-normal text-gray-500"> / {property.serviceType === 'Logement' ? 'mois' : 'nuit'}</span>
                </p>
                <div className="flex justify-between items-center">
                    <button onClick={() => setShowDetails(true)} className="text-primary hover:underline">Voir détails</button>
                    <button onClick={() => onBook(property)} disabled={!property.available} className="px-4 py-2 bg-secondary text-accent font-bold rounded-lg hover:bg-yellow-400 disabled:bg-gray-300 disabled:cursor-not-allowed">
                        Réserver
                    </button>
                </div>
            </div>
            {showDetails && <PropertyDetailsModal property={property} onClose={() => setShowDetails(false)} onBook={onBook} />}
        </div>
    );
};


const PropertyDetailsModal: React.FC<{ property: Property, onClose: () => void, onBook: (property: Property) => void }> = ({ property, onClose, onBook }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-bold text-accent">{property.name}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                    </div>
                     <div className="grid grid-cols-2 gap-2 mb-4">
                        {property.images.map((img, index) => <img key={index} src={img} alt={`${property.name} ${index + 1}`} className="w-full h-40 object-cover rounded-md" />)}
                    </div>
                    <div className="space-y-4">
                        <p><span className="font-bold">Adresse :</span> {property.address}, {property.commune}, {property.city}</p>
                        <p className="text-gray-500"><span className="font-bold text-gray-800">Localisation :</span> [Visible après réservation]</p>
                        <p className="text-3xl font-bold text-primary">{property.price.toLocaleString('fr-FR')} FCFA <span className="text-lg font-normal">/ {property.serviceType === 'Logement' ? 'mois' : 'nuit'}</span></p>
                        {property.visitFee && <p className="text-md text-red-600"><span className="font-bold">Frais de visite :</span> {property.visitFee.toLocaleString('fr-FR')} FCFA</p>}
                        
                        <h4 className="font-bold text-lg mt-4 border-b pb-2">Caractéristiques</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {Object.entries(property.characteristics).map(([key, value]) => (
                                <div key={key}><span className="font-semibold">{key}:</span> {value}</div>
                            ))}
                        </div>
                         <div className="flex justify-end pt-6">
                            <button onClick={() => { onBook(property); onClose(); }} disabled={!property.available} className="px-6 py-3 bg-secondary text-accent font-bold rounded-lg hover:bg-yellow-400 disabled:bg-gray-300">
                                Procéder à la réservation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default PropertyCard;
