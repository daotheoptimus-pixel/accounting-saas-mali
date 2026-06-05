// Invoice types
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  totalAmount: number;
  currency: string;
  notes?: string;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInvoiceDTO {
  clientId: string;
  date: Date;
  dueDate: Date;
  items: Omit<InvoiceItem, 'id' | 'total'>[];
  currency: string;
  notes?: string;
}

export interface UpdateInvoiceDTO extends Partial<CreateInvoiceDTO> {
  status?: Invoice['status'];
}
