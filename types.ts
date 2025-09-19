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
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  agency?: string; // For Agent or Manager
  city?: string;
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
}

export interface Reservation {
  id: string;
  propertyId: string;
  propertyName: string;
  clientName: string;
  clientEmail: string;
  clientContact: string;
  startDate: string;
  endDate: string;
  bookingDate: string;
  totalPrice: number;
  status: 'Confirmed' | 'Cancelled';
  agentId: string;
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
  status: 'Validated' | 'Refunded';
  agentId: string;
  receiptNumber: string;
  agentContact1?: string;
  agentContact2?: string;
}
