import { create } from 'zustand';
import { Client } from '@/types/client';
import { clientService } from '@/services/clientService';

interface ClientStoreState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  removeClient: (id: string) => void;
  setClients: (clients: Client[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useClientStore = create<ClientStoreState>((set) => ({
  clients: [],
  isLoading: false,
  error: null,

  fetchClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const clients = await clientService.getClients();
      set({ clients, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch clients';
      set({ error: message, isLoading: false });
    }
  },

  addClient: (client: Client) => {
    set((state) => ({
      clients: [...state.clients, client],
    }));
  },

  updateClient: (client: Client) => {
    set((state) => ({
      clients: state.clients.map((c) => (c.id === client.id ? client : c)),
    }));
  },

  removeClient: (id: string) => {
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    }));
  },

  setClients: (clients: Client[]) => {
    set({ clients });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
