
export type Role = 'Super Admin' | 'Lojista' | 'Cliente';

export interface User {
  id: string;
  name: string;
  email?: string;
  password?: string;
  role: Role;
  avatar?: string;
  whatsapp: string;
  deliveryAddress?: string;
  addressReference?: string;
}

export interface DeliveryOption {
    type: 'Entrega' | 'Retirada';
    enabled: boolean;
    feeType?: 'fixed' | 'variable';
    price?: number;
    details?: string;
}

export interface Store {
    id: string;
    name: string;
    slug: string;
    description?: string;
    contactWhatsapp?: string;
    logoUrl: string;
    coverUrl: string;
    pixQrCodeUrl?: string;
    pixKey?: string;
    pixAccountName?: string;
    pixBankName?: string;
    pixAccountNumber?: string;
    deliveryOptions: DeliveryOption[];
    address?: string;
    socials?: {
        instagram?: string;
        tiktok?: string;
        youtube?: string;
    }
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

export type PaymentStatus = 'Pendente' | 'Pago' | 'Rejeitado';

export interface PaymentMethod {
    id: string;
    name: string;
    description?: string;
}

export interface DeliveryDetails {
    address: string;
    addressReference?: string;
    fee: number;
}

export interface SplitPayment {
    method: string; // The name of the payment method, e.g., 'Pix'
    amount: number;
}

export interface Order {
  id:string;
  userId?: string; // Can be optional for unregistered customers
  storeId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  paymentMethod: string;
  paymentGateway?: string; // For gateway payments
  splitPayments?: SplitPayment[]; // For split payments
  observations?: string;
  isDelivery: boolean;
  deliveryDetails?: DeliveryDetails;
}
