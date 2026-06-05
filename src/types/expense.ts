// Expense types
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
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateExpenseDTO {
  description: string;
  amount: number;
  currency: string;
  category: string;
  date: Date;
  supplier?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {
  status?: Expense['status'];
}

export const EXPENSE_CATEGORIES = [
  'Salaires',
  'Loyer',
  'Utilities',
  'Transport',
  'Fournitures',
  'Marketing',
  'Technologie',
  'Autre',
];
