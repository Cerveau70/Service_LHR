import { User, Property, Reservation, VisitReservation } from "../types";

const API_BASE_URL = "http://localhost:8080/api";

const api = {
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

  sendMfaCode: async (email: string): Promise<boolean> => {
    const user = await api.login(email);
    return !!user;
  },

  verifyMfaCode: async (email: string, code: string): Promise<User | undefined> => {
    // Ici on simule la vérification, à remplacer par backend réel
    if (code === "123456") return await api.login(email);
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

  updateProperty: async (id: number, data: Partial<Property>): Promise<Property | undefined> => {
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

  deleteProperty: async (id: number): Promise<boolean> => {
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

  cancelReservation: async (id: number): Promise<boolean> => {
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

  cancelVisitReservation: async (id: number): Promise<boolean> => {
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

  // ----- SETTINGS -----
  getSettings: async (): Promise<{ reservationFee: number }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (!res.ok) throw new Error("Get settings failed");
      return await res.json();
    } catch (err) {
      console.error(err);
      return { reservationFee: 0 };
    }
  },
};

export default api;
