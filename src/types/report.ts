// Report types
export interface ReportData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  invoiceCount: number;
  paidInvoices: number;
  pendingInvoices: number;
  averageInvoiceAmount: number;
  topClients: Array<{
    clientId: string;
    clientName: string;
    totalAmount: number;
  }>;
  expenseByCategory: Record<string, number>;
}

export interface FinancialReport {
  id: string;
  type: 'daily' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  data: ReportData;
  createdAt: Date;
}
