import { User, Property, Reservation, VisitReservation, UserRole, UserStatus, Permission, Statistics, SystemSettings, City, Commune, PropertyType, HotelType } from "../types/extended";

const API_BASE_URL = "http://localhost:8080/api";




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

  deleteReservation: async (id: string | number): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/reservations/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
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

  getAgentProperties: async (agentId: string | number): Promise<Property[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/properties/agent/${agentId}`);
      if (!res.ok) throw new Error("Get agent properties failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  createProperty: async (data: Property): Promise<Property | undefined> => {
    try {
      const res = await fetch(`${API_BASE_URL}/properties`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Create property failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return undefined;
    }
  },

  updateProperty: async (id: string | number, data: Partial<Property>): Promise<Property | undefined> => {
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

  deleteProperty: async (id: string | number): Promise<boolean> => {
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

  getReservationsForAgent: async (agentId: string | number): Promise<Reservation[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/agent/${agentId}`);
      if (!res.ok) throw new Error("Get reservations for agent failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  



  cancelReservation: async (id: string | number): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/${id}/cancel`, { method: "PUT" });
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

  updateUser: async (id: string | number, data: Partial<User>): Promise<User | undefined> => {
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

  deleteUser: async (id: string | number): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, { method: "DELETE" });
      return res.ok;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  updateUserStatus: async (id: string | number, status: UserStatus): Promise<boolean> => {
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

  updateUserRole: async (id: string | number, role: UserRole, permissions: Permission[]): Promise<boolean> => {
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

};

export default extendedApi;
