import { create } from 'zustand';
import { Expense } from '@/types/expense';
import { expenseService } from '@/services/expenseService';

interface ExpenseStoreState {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Expense) => void;
  updateExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  setExpenses: (expenses: Expense[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useExpenseStore = create<ExpenseStoreState>((set) => ({
  expenses: [],
  isLoading: false,
  error: null,

  fetchExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const expenses = await expenseService.getExpenses();
      set({ expenses, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch expenses';
      set({ error: message, isLoading: false });
    }
  },

  addExpense: (expense: Expense) => {
    set((state) => ({
      expenses: [...state.expenses, expense],
    }));
  },

  updateExpense: (expense: Expense) => {
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === expense.id ? expense : e)),
    }));
  },

  removeExpense: (id: string) => {
    set((state) => ({
      expenses: state.expenses.filter((e) => e.id !== id),
    }));
  },

  setExpenses: (expenses: Expense[]) => {
    set({ expenses });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
