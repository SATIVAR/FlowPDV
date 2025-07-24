

export type Role = 'Super Admin' | 'Lojista' | 'Cliente';

export interface User {
  id: string;
  name: string;
  password?: string;
  role: Role;
  avatar?: string;
  whatsapp: string;
}

export interface Store {
    id: string;
    name: string;
    address: string;
    logoUrl: string;
    coverUrl: string;
}

export interface Category {
  id: string;
  name: string;
}

export type ProductUnit = 'unidade' | 'kilo' | 'grama';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  storeId: string;
  categoryId?: string;
  unit: ProductUnit;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'Pendente' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';

export interface PaymentMethod {
    id: string;
    name: string;
}

export interface Order {
  id:string;
  userId?: string; // Can be optional for unregistered customers
  storeId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  paymentMethod: string;
}
