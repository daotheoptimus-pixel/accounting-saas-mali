import { create } from 'zustand';
import { Invoice } from '@/types/invoice';
import { invoiceService } from '@/services/invoiceService';

interface InvoiceStoreState {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<void>;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  removeInvoice: (id: string) => void;
  setInvoices: (invoices: Invoice[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInvoiceStore = create<InvoiceStoreState>((set) => ({
  invoices: [],
  isLoading: false,
  error: null,

  fetchInvoices: async () => {
    set({ isLoading: true, error: null });
    try {
      const invoices = await invoiceService.getInvoices();
      set({ invoices, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch invoices';
      set({ error: message, isLoading: false });
    }
  },

  addInvoice: (invoice: Invoice) => {
    set((state) => ({
      invoices: [...state.invoices, invoice],
    }));
  },

  updateInvoice: (invoice: Invoice) => {
    set((state) => ({
      invoices: state.invoices.map((i) => (i.id === invoice.id ? invoice : i)),
    }));
  },

  removeInvoice: (id: string) => {
    set((state) => ({
      invoices: state.invoices.filter((i) => i.id !== id),
    }));
  },

  setInvoices: (invoices: Invoice[]) => {
    set({ invoices });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
