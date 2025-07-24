
import type { User, Product, Order, Store } from './types';

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

export const stores: Store[] = [
  {
    id: 'store-1',
    name: 'Tech Wonders',
    address: '123 Innovation Drive, Silicon Valley',
    logoUrl: 'https://placehold.co/128x128',
    coverUrl: 'https://placehold.co/600x400'
  },
  {
    id: 'store-2',
    name: 'Gourmet Delights',
    address: '456 Culinary Lane, Foodie Town',
    logoUrl: 'https://placehold.co/128x128',
    coverUrl: 'https://placehold.co/600x400'
  },
  {
    id: 'store-3',
    name: 'Fashion Forward',
    address: '789 Style Avenue, Trend City',
    logoUrl: 'https://placehold.co/128x128',
    coverUrl: 'https://placehold.co/600x400'
  },
  {
    id: 'store-4',
    name: 'Bookworm\'s Paradise',
    address: '101 Knowledge St, Readington',
    logoUrl: 'https://placehold.co/128x128',
    coverUrl: 'https://placehold.co/600x400'
  },
  {
    id: 'store-5',
    name: 'Home Comforts',
    address: '212 Cozy Corner, Relaxville',
    logoUrl: 'https://placehold.co/128x128',
    coverUrl: 'https://placehold.co/600x400'
  },
  {
    id: 'store-6',
    name: 'Vintage Finds',
    address: '333 Retro Row, Old Town',
    logoUrl: 'https://placehold.co/128x128',
    coverUrl: 'https://placehold.co/600x400'
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
    storeId: 'store-1'
  },
  {
    id: 'prod2',
    name: 'Hyper-Threaded Mouse',
    description: 'Clicks so fast, it registers in the past.',
    price: 79.50,
    imageUrl: 'https://placehold.co/400x400',
    stock: 120,
    storeId: 'store-1'
  },
  {
    id: 'prod3',
    name: 'Artisanal Cheese Board',
    description: 'A fine selection of imported and local cheeses.',
    price: 42.00,
    imageUrl: 'https://placehold.co/400x400',
    stock: 200,
    storeId: 'store-2'
  },
  {
    id: 'prod4',
    name: 'Organic Sourdough',
    description: 'Freshly baked with a crispy crust and soft crumb.',
    price: 8.50,
    imageUrl: 'https://placehold.co/400x400',
    stock: 15,
    storeId: 'store-2'
  },
  {
    id: 'prod5',
    name: 'Silk Scarf',
    description: 'A beautifully printed 100% silk scarf.',
    price: 65.75,
    imageUrl: 'https://placehold.co/400x400',
    stock: 75,
    storeId: 'store-3'
  },
  {
    id: 'prod6',
    name: 'Leather Tote Bag',
    description: 'A timeless classic for your everyday needs.',
    price: 249.99,
    imageUrl: 'https://placehold.co/400x400',
    stock: 30,
    storeId: 'store-3'
  },
];

export const orders: Order[] = [];
