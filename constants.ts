
import { ServiceType } from './types';

export const serviceTypes = [ServiceType.HOUSING, ServiceType.HOTEL, ServiceType.RESIDENCE];

export const propertyTypes = {
    [ServiceType.HOUSING]: ['Maison', 'Appartement', 'Studio', 'Magasin'],
    [ServiceType.HOTEL]: ['1 Étoile', '2 Étoiles', '3 Étoiles', '4 Étoiles', '5 Étoiles'],
    [ServiceType.RESIDENCE]: ['Maison', 'Appartement', 'Studio', 'Villa'],
};

export const cities = ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro'];
export const communes = {
    Abidjan: ['Cocody', 'Plateau', 'Treichville', 'Marcory', 'Yopougon'],
    Yamoussoukro: ['Centre-ville', '220 Logements', 'Morofé'],
    Bouaké: ['Commerce', 'Air France', 'Koko'],
    'San-Pédro': ['Cité', 'Port', 'Lac'],
};
