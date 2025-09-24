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
  status?: UserStatus;
  agency?: string;
  city?: string;
  phone1?: string;
  phone2?: string;
  address?: string;
  permissions?: Permission[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Property {
  id: string;
  serviceType: ServiceType;
  name: string;
  city: string;
  commune: string;
  address: string;
  price: number;
  visitFee?: number;
  bookingFee?: number;
  available: boolean;
  images: string[];
  agentId: string;
  characteristics: Record<string, string | number>;
  floor?: number;
  roomType?: string;
  capacity?: number;
  amenities?: string[];
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
  status: 'Confirmé' | 'Annulé' | 'En attente';
  agentId: string;
  receiptNumber: string;
  agentContact1?: string;
  agentContact2?: string;
  checkInTime?: string;
  checkOutTime?: string;
  numberOfNights?: number;
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
  status: 'Validé' | 'Remboursé' | 'Expiré';
  agentId: string;
  receiptNumber: string;
  agentContact1?: string;
  agentContact2?: string;
  expiresAt: Date;
  isExpired: boolean;
}
