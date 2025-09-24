import { User, Property, Reservation, VisitReservation, UserRole, UserStatus, Permission, Statistics, SystemSettings, City, Commune, PropertyType, HotelType, ServiceType } from "../types/extended";

const API_BASE_URL = "http://localhost:8080/api";

interface Order {
    id: string;
    clientName: string;
    serviceType: string;
    amount: number;
    status: 'En attente' | 'Confirmé' | 'Livré' | 'Annulé';
    orderDate: string;
    deliveryDate?: string;
}

const extendedApi = {
  // ----- AUTH -----
  login: async (email: string): Promise<User | undefined> => {
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Login failed");
      return await res.json();
    } catch (err) {
      console.error("Login error:", err);
      return undefined;
    }
  },

  getOrdersForSupplier: async (supplierId: string | number): Promise<Order[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/supplier/${supplierId}`);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
},
updateOrderStatus: async (orderId: string | number, status: 'En attente' | 'Confirmé' | 'Livré' | 'Annulé'): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
},


  signup: async (data: { username: string; email: string; password: string }): Promise<User | undefined> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Signup failed");
      return await res.json();
    } catch (err) {
      console.error("Signup error:", err);
      return undefined;
    }
  },

  sendMfaCode: async (email: string): Promise<boolean> => {
    const user = await extendedApi.login(email);
    return !!user;
  },

  verifyMfaCode: async (email: string, code: string): Promise<User | undefined> => {
    // Ici on simule la vérification, à remplacer par backend réel
    if (code === "123456") return await extendedApi.login(email);
    return undefined;
  },

  // ----- PROPERTIES -----
  getProperties: async (filters: Partial<{ serviceType: string; city: string; commune: string }> = {}): Promise<Property[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.serviceType) params.append("serviceType", filters.serviceType);
      if (filters.city) params.append("city", filters.city);
      if (filters.commune) params.append("commune", filters.commune);
      const res = await fetch(`${API_BASE_URL}/properties?${params}`);
      if (!res.ok) throw new Error("Get properties failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getAgentProperties: async (agentId: string): Promise<Property[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/properties/agent/${agentId}`);
      if (!res.ok) throw new Error("Get agent properties failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  createProperty: async (data: Partial<Property>): Promise<Property | undefined> => {
    try {
      // Ensure required fields are present
      const propertyData = {
        ...data,
        id: data.id || `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        images: data.images || [],
        agentId: data.agentId || 'default_agent', // This should be passed from the component
      };

      const res = await fetch(`${API_BASE_URL}/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(propertyData),
      });
      if (!res.ok) throw new Error("Create property failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return undefined;
    }
  },

  updateProperty: async (id: string, data: Partial<Property>): Promise<Property | undefined> => {
    try {
      const res = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update property failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return undefined;
    }
  },

  deleteProperty: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/properties/${id}`, { method: "DELETE" });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // ----- RESERVATIONS -----
  getAllReservations: async (): Promise<Reservation[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations`);
      if (!res.ok) throw new Error("Get all reservations failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getReservationsForAgent: async (agentId: string): Promise<Reservation[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/agent/${agentId}`);
      if (!res.ok) throw new Error("Get reservations for agent failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  cancelReservation: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/${id}/cancel`, { method: "PUT" });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // ----- VISIT RESERVATIONS -----
  createVisitReservation: async (data: any): Promise<VisitReservation | undefined> => {
    try {
      const res = await fetch(`${API_BASE_URL}/visit-reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Create visit reservation failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return undefined;
    }
  },

  getAllVisitReservations: async (): Promise<VisitReservation[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/visit-reservations`);
      if (!res.ok) throw new Error("Get all visit reservations failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getVisitReservationsForAgent: async (agentId: string): Promise<VisitReservation[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/visit-reservations/agent/${agentId}`);
      if (!res.ok) throw new Error("Get visit reservations for agent failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  cancelVisitReservation: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/visit-reservations/${id}/cancel`, { method: "PUT" });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // ----- USERS -----
  getUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      if (!res.ok) throw new Error("Get users failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  createUser: async (data: Partial<User>): Promise<User | undefined> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Create user failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return undefined;
    }
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User | undefined> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update user failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return undefined;
    }
  },

  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  updateUserStatus: async (id: string, status: UserStatus): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  updateUserRole: async (id: string, role: UserRole, permissions: Permission[]): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, permissions }),
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // ----- STATISTICS -----
  getStatistics: async (): Promise<Statistics> => {
    try {
      const res = await fetch(`${API_BASE_URL}/statistics`);
      if (!res.ok) throw new Error("Get statistics failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return {
        totalProperties: 0,
        availableProperties: 0,
        totalReservations: 0,
        totalRevenue: 0,
        propertiesByCity: {},
        reservationsByAgent: {},
        revenueByService: {
          [ServiceType.HOUSING]: 0,
          [ServiceType.HOTEL]: 0,
          [ServiceType.RESIDENCE]: 0,
        } as Record<ServiceType, number>,
      };
    }
  },

  

  getAgentStatistics: async (agentId: string): Promise<Partial<Statistics>> => {
    try {
      const res = await fetch(`${API_BASE_URL}/statistics/agent/${agentId}`);
      if (!res.ok) throw new Error("Get agent statistics failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return {};
    }
  },

  

  // ----- SETTINGS -----
  getSettings: async (): Promise<SystemSettings> => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (!res.ok) throw new Error("Get settings failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return {
        id: 'default',
        reservationFee: 0,
        visitFee: 0,
        currency: 'XOF',
        paymentMethods: ['Waves', 'Visa'],
        businessHours: { start: '08:00', end: '18:00' },
        refundPolicy: { visitRefundHours: 24, reservationRefundDays: 1 },
      };
    }
  },

  updateSettings: async (settings: Partial<SystemSettings>): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  // ----- LOCATIONS -----
  getCities: async (): Promise<City[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/cities`);
      if (!res.ok) throw new Error("Get cities failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getCommunes: async (cityId?: string): Promise<Commune[]> => {
    try {
      const params = cityId ? `?cityId=${cityId}` : '';
      const res = await fetch(`${API_BASE_URL}/communes${params}`);
      if (!res.ok) throw new Error("Get communes failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  // ----- PROPERTY TYPES -----
  getPropertyTypes: async (serviceType?: string): Promise<PropertyType[]> => {
    try {
      const params = serviceType ? `?serviceType=${serviceType}` : '';
      const res = await fetch(`${API_BASE_URL}/property-types${params}`);
      if (!res.ok) throw new Error("Get property types failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getHotelTypes: async (): Promise<HotelType[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/hotel-types`);
      if (!res.ok) throw new Error("Get hotel types failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  // ----- PERMISSIONS -----
  getPermissions: async (): Promise<Permission[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/permissions`);
      if (!res.ok) throw new Error("Get permissions failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  // ----- REPORTS -----
  getReservationReport: async (filters: {
    startDate?: string;
    endDate?: string;
    agentId?: string;
    serviceType?: string;
  }): Promise<any[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.agentId) params.append("agentId", filters.agentId);
      if (filters.serviceType) params.append("serviceType", filters.serviceType);

      const res = await fetch(`${API_BASE_URL}/reports/reservations?${params}`);
      if (!res.ok) throw new Error("Get reservation report failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  getRevenueReport: async (filters: {
    startDate?: string;
    endDate?: string;
    serviceType?: string;
  }): Promise<any[]> => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.serviceType) params.append("serviceType", filters.serviceType);

      const res = await fetch(`${API_BASE_URL}/reports/revenue?${params}`);
      if (!res.ok) throw new Error("Get revenue report failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },
  deleteReservation: async (id: string | number): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/reservations/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
},

};

export default extendedApi;
