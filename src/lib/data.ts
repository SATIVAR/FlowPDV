import type { User, Product, Order } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'admin@tenantflow.com',
    password: 'password123',
    role: 'Super Admin',
    avatar: 'https://placehold.co/100x100'
  },
  {
    id: '2',
    name: 'Loja da Esquina',
    email: 'lojista@tenantflow.com',
    password: 'password123',
    role: 'Lojista',
    avatar: 'https://placehold.co/100x100'
  },
  {
    id: '3',
    name: 'Cliente Fiel',
    email: 'cliente@tenantflow.com',
    password: 'password123',
    role: 'Cliente',
    avatar: 'https://placehold.co/100x100'
  },
  {
    id: '4',
    name: 'Google User',
    email: 'google.user@gmail.com',
    role: 'Cliente',
    avatar: 'https://placehold.co/100x100',
    isOAuth: true,
  }
];

export const products: Product[] = [
  {
    id: 'prod1',
    name: 'Quantum Coder Keyboard',
    description: 'A mechanical keyboard that types in multiple dimensions.',
    price: 189.99,
    imageUrl: 'https://placehold.co/400x400',
    stock: 50,
    storeId: '2'
  },
  {
    id: 'prod2',
    name: 'Hyper-Threaded Mouse',
    description: 'Clicks so fast, it registers in the past.',
    price: 79.50,
    imageUrl: 'https://placehold.co/400x400',
    stock: 120,
    storeId: '2'
  },
  {
    id: 'prod3',
    name: 'Sentient Coffee Mug',
    description: 'Keeps your coffee hot and your secrets safe.',
    price: 42.00,
    imageUrl: 'https://placehold.co/400x400',
    stock: 200,
    storeId: '2'
  },
  {
    id: 'prod4',
    name: 'Singularity Screen',
    description: 'A 32-inch 8K monitor that displays the future.',
    price: 1299.99,
    imageUrl: 'https://placehold.co/400x400',
    stock: 15,
    storeId: '2'
  },
  {
    id: 'prod5',
    name: 'Recursive Desk Lamp',
    description: 'A lamp that is lit by a smaller version of itself.',
    price: 65.75,
    imageUrl: 'https://placehold.co/400x400',
    stock: 75,
    storeId: '2'
  },
  {
    id: 'prod6',
    name: 'Null-Pointer Pen',
    description: 'A pen that writes in invisible, memory-safe ink.',
    price: 24.99,
    imageUrl: 'https://placehold.co/400x400',
    stock: 300,
    storeId: '2'
  },
];

export const orders: Order[] = [];
