// Client types
export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  companyName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientDTO {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  companyName?: string;
}
