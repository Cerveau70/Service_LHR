import React, { useState } from 'react';
import { Property } from '../types';

interface BookingModalProps {
    property: Property;
    onClose: () => void;
    onSuccess: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ property, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        firstname: '',
        email: '',
        contact: '',
        address: '',
        visitDate: '',
    });

    const isHousing = property.serviceType === 'Logement';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would integrate with a payment gateway (Wave, Visa)
        // For now, we simulate success
        console.log("Booking data:", { propertyId: property.id, ...formData });
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full">
                <div className="p-6">
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <h3 className="text-xl font-bold text-accent">Réservation pour : {property.name}</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="name" placeholder="Nom" required onChange={handleInputChange} className="p-2 border rounded-md w-full" />
                            <input type="text" name="firstname" placeholder="Prénom(s)" required onChange={handleInputChange} className="p-2 border rounded-md w-full" />
                        </div>
                        <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} className="p-2 border rounded-md w-full" />
                        <input type="tel" name="contact" placeholder="Contact" required onChange={handleInputChange} className="p-2 border rounded-md w-full" />
                        <input type="text" name="address" placeholder="Adresse" required onChange={handleInputChange} className="p-2 border rounded-md w-full" />

                        {isHousing && (
                            <div>
                                <label className="text-sm font-medium text-gray-700">Date de visite</label>
                                <input type="date" name="visitDate" required onChange={handleInputChange} className="p-2 border rounded-md w-full" />
                            </div>
                        )}

                        <div className="pt-4 text-right">
                             <button type="submit" className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-blue-700">
                                Payer les frais {isHousing ? `(${property.visitFee?.toLocaleString('fr-FR')} FCFA)` : ''}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
