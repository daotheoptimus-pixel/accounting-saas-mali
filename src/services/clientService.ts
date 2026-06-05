import axios from 'axios';
import { Client, CreateClientDTO } from '@/types/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const clientService = {
  async getClients(): Promise<Client[]> {
    try {
      const response = await apiClient.get<Client[]>('/clients');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch clients');
    }
  },

  async getClient(id: string): Promise<Client> {
    try {
      const response = await apiClient.get<Client>(`/clients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch client');
    }
  },

  async createClient(data: CreateClientDTO): Promise<Client> {
    try {
      const response = await apiClient.post<Client>('/clients', data);
      return response.data;
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? (error.response.data.message as string)
          : 'Failed to create client';
      throw new Error(message);
    }
  },

  async updateClient(id: string, data: Partial<CreateClientDTO>): Promise<Client> {
    try {
      const response = await apiClient.put<Client>(`/clients/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? (error.response.data.message as string)
          : 'Failed to update client';
      throw new Error(message);
    }
  },

  async deleteClient(id: string): Promise<void> {
    try {
      await apiClient.delete(`/clients/${id}`);
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? (error.response.data.message as string)
          : 'Failed to delete client';
      throw new Error(message);
    }
  },
};
