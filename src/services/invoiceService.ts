import axios from 'axios';
import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '@/types/invoice';

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

export const invoiceService = {
  async getInvoices(): Promise<Invoice[]> {
    try {
      const response = await apiClient.get<Invoice[]>('/invoices');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch invoices');
    }
  },

  async getInvoice(id: string): Promise<Invoice> {
    try {
      const response = await apiClient.get<Invoice>(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch invoice');
    }
  },

  async createInvoice(data: CreateInvoiceDTO): Promise<Invoice> {
    try {
      const response = await apiClient.post<Invoice>('/invoices', data);
      return response.data;
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? (error.response.data.message as string)
          : 'Failed to create invoice';
      throw new Error(message);
    }
  },

  async updateInvoice(id: string, data: UpdateInvoiceDTO): Promise<Invoice> {
    try {
      const response = await apiClient.put<Invoice>(`/invoices/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? (error.response.data.message as string)
          : 'Failed to update invoice';
      throw new Error(message);
    }
  },

  async deleteInvoice(id: string): Promise<void> {
    try {
      await apiClient.delete(`/invoices/${id}`);
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? (error.response.data.message as string)
          : 'Failed to delete invoice';
      throw new Error(message);
    }
  },

  async generatePDF(id: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/invoices/${id}/pdf`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to generate PDF');
    }
  },
};
