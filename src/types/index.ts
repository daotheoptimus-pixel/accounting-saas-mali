// User
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

// Client
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Invoice
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  totalAmount: number;
  currency: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Expense
export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  date: Date;
  supplier?: string;
  receipt?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Report
export interface FinancialReport {
  id: string;
  type: 'income' | 'expense' | 'balance';
  startDate: Date;
  endDate: Date;
  data: Record<string, unknown>;
  createdAt: Date;
}
