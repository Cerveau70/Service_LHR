import { Property, Reservation, User } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const housingService = {
  // Agent methods
  getProperties: async (agentId: string): Promise<Property[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/housing/properties?agentId=${agentId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get housing properties error:', error);
    }
    return [];
  },

  addProperty: async (property: Omit<Property, 'id'>): Promise<Property | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/housing/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Add housing property error:', error);
    }
    return null;
  },

  updateProperty: async (id: string, property: Partial<Property>): Promise<Property | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/housing/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(property),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Update housing property error:', error);
    }
    return null;
  },

  deleteProperty: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/housing/properties/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Delete housing property error:', error);
    }
    return false;
  },

  getReservations: async (agentId: string): Promise<Reservation[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/housing/reservations?agentId=${agentId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get housing reservations error:', error);
    }
    return [];
  },

  // Admin methods
  getAllProperties: async (): Promise<Property[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/housing/properties`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get all housing properties error:', error);
    }
    return [];
  },

  getAllReservations: async (): Promise<Reservation[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/housing/reservations`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get all housing reservations error:', error);
    }
    return [];
  },

  cancelReservation: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/housing/reservations/${id}/cancel`, {
        method: 'PUT',
      });
      return response.ok;
    } catch (error) {
      console.error('Cancel housing reservation error:', error);
    }
    return false;
  },

  // Client methods
  getAvailableProperties: async (filters: any): Promise<Property[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.commune) params.append('commune', filters.commune);
      if (filters.type) params.append('type', filters.type);
      const response = await fetch(`${API_BASE_URL}/housing/properties/available?${params}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get available housing properties error:', error);
    }
    return [];
  },

  bookProperty: async (booking: any): Promise<Reservation | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/housing/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Book housing property error:', error);
    }
    return null;
  },
};

export default housingService;
