import { Property, Reservation, User } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const residenceService = {
  // Manager methods
  getResidences: async (managerId: string): Promise<Property[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/residence/properties?managerId=${managerId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get residence properties error:', error);
    }
    return [];
  },

  addResidence: async (residence: Omit<Property, 'id'>): Promise<Property | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/residence/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(residence),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Add residence property error:', error);
    }
    return null;
  },

  updateResidence: async (id: string, residence: Partial<Property>): Promise<Property | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/residence/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(residence),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Update residence property error:', error);
    }
    return null;
  },

  deleteResidence: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/residence/properties/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Delete residence property error:', error);
    }
    return false;
  },

  getReservations: async (managerId: string): Promise<Reservation[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/residence/reservations?managerId=${managerId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get residence reservations error:', error);
    }
    return [];
  },

  // Admin methods
  getAllResidences: async (): Promise<Property[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/residence/properties`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get all residence properties error:', error);
    }
    return [];
  },

  getAllReservations: async (): Promise<Reservation[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/residence/reservations`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get all residence reservations error:', error);
    }
    return [];
  },

  cancelReservation: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/residence/reservations/${id}/cancel`, {
        method: 'PUT',
      });
      return response.ok;
    } catch (error) {
      console.error('Cancel residence reservation error:', error);
    }
    return false;
  },

  // Client methods
  getAvailableResidences: async (filters: any): Promise<Property[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.commune) params.append('commune', filters.commune);
      if (filters.type) params.append('type', filters.type);
      const response = await fetch(`${API_BASE_URL}/residence/properties/available?${params}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get available residence properties error:', error);
    }
    return [];
  },

  bookResidence: async (booking: any): Promise<Reservation | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/residence/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Book residence property error:', error);
    }
    return null;
  },
};

export default residenceService;
