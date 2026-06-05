import axios from 'axios';
import { ReportData, FinancialReport } from '@/types/report';

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

export const reportService = {
  async getDashboardData(startDate?: Date, endDate?: Date): Promise<ReportData> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate.toISOString());
      if (endDate) params.append('endDate', endDate.toISOString());

      const response = await apiClient.get<ReportData>(
        `/reports/dashboard?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch dashboard data');
    }
  },

  async getReport(
    type: 'daily' | 'monthly' | 'quarterly' | 'yearly',
    startDate: Date,
    endDate: Date
  ): Promise<FinancialReport> {
    try {
      const response = await apiClient.get<FinancialReport>(
        `/reports/${type}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch report');
    }
  },
};
