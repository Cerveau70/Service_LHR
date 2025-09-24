export enum ServiceType {
  HOUSING = 'Logement',
  HOTEL = 'Hôtel',
  RESIDENCE = 'Résidence',
}

export enum UserRole {
  CLIENT = 'Client',
  AGENT = 'Agent Immobilier',
  MANAGER = 'Gestionnaire',
  ADMIN = 'Administrateur',
  SUPPLIER = 'Fournisseur',
}

export enum UserStatus {
  ACTIVE = 'Actif',
  INACTIVE = 'Inactif',
  SUSPENDED = 'Suspendu',
}

export enum ReservationStatus {
  CONFIRMED = 'Confirmé',
  CANCELLED = 'Annulé',
  PENDING = 'En attente',
}

export enum VisitStatus {
  VALIDATED = 'Validé',
  REFUNDED = 'Remboursé',
  EXPIRED = 'Expiré',
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: 'properties' | 'users' | 'reservations' | 'reports' | 'settings';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  agency?: string; // For Agent or Manager
  city?: string;
  phone1?: string;
  phone2?: string;
  address?: string;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  serviceType: ServiceType;
  name: string;
  city: string;
  commune: string;
  address: string;
  price: number;
  visitFee?: number; // For Housing
  bookingFee?: number; // For Hotel/Residence
  available: boolean;
  images: string[];
  agentId: string;
  characteristics: Record<string, string | number>;
  // Additional fields for different service types
  floor?: number; // For Housing
  roomType?: string; // For Hotel
  capacity?: number; // For Hotel/Residence
  amenities?: string[]; // For Hotel/Residence
}

export interface Reservation {
  id: string;
  propertyId: string;
  propertyName: string;
  clientName: string;
  clientFirstname: string;
  clientEmail: string;
  clientContact: string;
  clientAddress: string;
  startDate: string;
  endDate: string;
  bookingDate: string;
  totalPrice: number;
  status: ReservationStatus;
  agentId: string;
  receiptNumber: string;
  agentContact1?: string;
  agentContact2?: string;
  // Additional fields for different services
  checkInTime?: string; // For Hotel/Residence
  checkOutTime?: string; // For Hotel/Residence
  numberOfNights?: number; // For Hotel/Residence
}

export interface VisitReservation {
  id: string;
  propertyId: string;
  propertyName: string;
  clientName: string;
  clientFirstname: string;
  clientEmail: string;
  clientContact: string;
  clientAddress: string;
  visitDate: string;
  bookingDate: string;
  visitFee: number;
  status: VisitStatus;
  agentId: string;
  receiptNumber: string;
  agentContact1?: string;
  agentContact2?: string;
  // Expiry tracking
  expiresAt: Date;
  isExpired: boolean;
}

export interface City {
  id: string;
  name: string;
  code: string;
}

export interface Commune {
  id: string;
  name: string;
  cityId: string;
}

export interface PropertyType {
  id: string;
  name: string;
  serviceType: ServiceType;
  description?: string;
}

export interface HotelType {
  id: string;
  name: string;
  stars: number;
  description?: string;
}

export interface Statistics {
  totalProperties: number;
  availableProperties: number;
  totalReservations: number;
  totalRevenue: number;
  propertiesByCity: Record<string, number>;
  reservationsByAgent: Record<string, number>;
  revenueByService: Record<ServiceType, number>;
}

export interface Order {
    id: string;
    clientName: string;
    serviceType: string;
    amount: number;
    status: 'En attente' | 'Confirmé' | 'Livré' | 'Annulé';
    orderDate: string;
    deliveryDate?: string;
}


export interface SystemSettings {
  id: string;
  reservationFee: number;
  visitFee: number;
  currency: string;
  paymentMethods: string[];
  businessHours: {
    start: string;
    end: string;
  };
  refundPolicy: {
    visitRefundHours: number;
    reservationRefundDays: number;
  };

  
}
