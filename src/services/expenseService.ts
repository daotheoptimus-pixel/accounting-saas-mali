import axios from 'axios';
import { Expense, CreateExpenseDTO, UpdateExpenseDTO } from '@/types/expense';

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

export const expenseService = {
  async getExpenses(): Promise<Expense[]> {
    try {
      const response = await apiClient.get<Expense[]>('/expenses');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch expenses');
    }
  },

  async getExpense(id: string): Promise<Expense> {
    try {
      const response = await apiClient.get<Expense>(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch expense');
    }
  },

  async createExpense(data: CreateExpenseDTO): Promise<Expense> {
    try {
      const response = await apiClient.post<Expense>('/expenses', data);
      return response.data;
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? (error.response.data.message as string)
          : 'Failed to create expense';
      throw new Error(message);
    }
  },

  async updateExpense(id: string, data: UpdateExpenseDTO): Promise<Expense> {
    try {
      const response = await apiClient.put<Expense>(`/expenses/${id}`, data);
      return response.data;
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? (error.response.data.message as string)
          : 'Failed to update expense';
      throw new Error(message);
    }
  },

  async deleteExpense(id: string): Promise<void> {
    try {
      await apiClient.delete(`/expenses/${id}`);
    } catch (error: unknown) {
      const message =
        axios.isAxiosError(error) && error.response?.data?.message
          ? (error.response.data.message as string)
          : 'Failed to delete expense';
      throw new Error(message);
    }
  },
};
