
export type Role = 'Super Admin' | 'Lojista' | 'Cliente';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for OAuth users
  role: Role;
  avatar?: string;
  isOAuth?: boolean;
  whatsapp?: string;
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

export interface Order {
  id:string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  createdAt: Date;
  shippingAddress: {
    street: string;
    city: string;
    zip: string;
    country: string;
  }
}
