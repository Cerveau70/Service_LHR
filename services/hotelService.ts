import { Property, Reservation, User } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const hotelService = {
  // Manager methods
  getRooms: async (managerId: string): Promise<Property[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotel/rooms?managerId=${managerId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get hotel rooms error:', error);
    }
    return [];
  },

  addRoom: async (room: Omit<Property, 'id'>): Promise<Property | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotel/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Add hotel room error:', error);
    }
    return null;
  },

  updateRoom: async (id: string, room: Partial<Property>): Promise<Property | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotel/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(room),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Update hotel room error:', error);
    }
    return null;
  },

  deleteRoom: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotel/rooms/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Delete hotel room error:', error);
    }
    return false;
  },

  getReservations: async (managerId: string): Promise<Reservation[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotel/reservations?managerId=${managerId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get hotel reservations error:', error);
    }
    return [];
  },

  // Admin methods
  getAllRooms: async (): Promise<Property[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotel/rooms`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get all hotel rooms error:', error);
    }
    return [];
  },

  getAllReservations: async (): Promise<Reservation[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotel/reservations`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get all hotel reservations error:', error);
    }
    return [];
  },

  cancelReservation: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotel/reservations/${id}/cancel`, {
        method: 'PUT',
      });
      return response.ok;
    } catch (error) {
      console.error('Cancel hotel reservation error:', error);
    }
    return false;
  },

  // Client methods
  getAvailableRooms: async (filters: any): Promise<Property[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.commune) params.append('commune', filters.commune);
      if (filters.type) params.append('type', filters.type);
      const response = await fetch(`${API_BASE_URL}/hotel/rooms/available?${params}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get available hotel rooms error:', error);
    }
    return [];
  },

  bookRoom: async (booking: any): Promise<Reservation | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/hotel/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Book hotel room error:', error);
    }
    return null;
  },
};

export default hotelService;
