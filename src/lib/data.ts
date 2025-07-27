
import type { User, Product, Order, Store, Category, PaymentMethod } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    whatsapp: '85988776655',
    password: 'adminsenha',
    role: 'Super Admin',
    avatar: 'https://placehold.co/100x100'
  },
  {
    id: '2',
    name: 'Loja da Esquina',
    whatsapp: '11988887777',
    password: 'password123',
    role: 'Lojista',
    avatar: 'https://placehold.co/100x100'
  },
  {
    id: '3',
    name: 'Cliente Fiel',
    whatsapp: '11999998888',
    password: 'password123',
    role: 'Cliente',
    avatar: 'https://placehold.co/100x100',
  },
  {
    id: '4',
    name: 'Ana Costa',
    whatsapp: '21987654321',
    password: 'password123',
    role: 'Cliente',
    avatar: 'https://placehold.co/100x100',
  },
  {
    id: '5',
    name: 'Carlos Silva',
    whatsapp: '31912345678',
    password: 'password123',
    role: 'Cliente',
    avatar: 'https://placehold.co/100x100',
  },
];

export const stores: Store[] = [
  {
    id: '1',
    name: 'Tech Wonders',
    slug: 'tech-wonders',
    logoUrl: 'https://placehold.co/128x128',
    coverUrl: 'https://placehold.co/600x400',
    deliveryOptions: [
        { type: 'Entrega', enabled: true, feeType: 'fixed', price: 10, details: 'Entrega em toda a cidade.' },
        { type: 'Retirada', enabled: false }
    ]
  },
  {
    id: '2',
    name: 'Loja da Esquina',
    slug: 'loja-da-esquina',
    description: 'Sua loja de conveniência favorita, agora online! Peça e receba em casa.',
    contactWhatsapp: '11988887777',
    logoUrl: 'https://placehold.co/128x128',
    coverUrl: 'https://placehold.co/600x400',
    pixKey: '11988887777',
    pixQrCodeUrl: 'https://placehold.co/256x256.png',
    deliveryOptions: [
        { type: 'Entrega', enabled: true, feeType: 'variable', price: 5, details: 'Entregamos em um raio de 5km.' },
        { type: 'Retirada', enabled: true, details: 'Retire na loja em até 30 minutos.' }
    ]
  },
];

export const categories: Category[] = [
  { id: 'cat-1', name: 'Eletrônicos' },
  { id: 'cat-2', name: 'Alimentos' },
  { id: 'cat-3', name: 'Moda' },
];

export const paymentMethods: PaymentMethod[] = [
    { id: 'pm-1', name: 'Pix' },
    { id: 'pm-2', name: 'Cartão de Crédito' },
    { id: 'pm-3', name: 'Dinheiro' },
]

export const predefinedPaymentMethods: PaymentMethod[] = [
  { id: 'dinheiro', name: 'Dinheiro', description: "Receba pagamentos em espécie." },
  { id: 'pix', name: 'Pix', description: "Receba transferências instantâneas." },
  { id: 'cartao_credito', name: 'Cartão de Crédito', description: "Aceite as principais bandeiras." },
  { id: 'cartao_debito', name: 'Cartão de Débito', description: "Venda com mais agilidade." },
  { id: 'gateway', name: 'Gateway de Pagamento', description: "Integre com seu provedor." },
  { id: 'dividido', name: 'Pagamento Dividido', description: "Permita dividir a conta." },
];

export const products: Product[] = [
  {
    id: 'prod1',
    name: 'Quantum Coder Keyboard',
    description: 'A mechanical keyboard that types in multiple dimensions.',
    price: 189.99,
    imageUrl: 'https://placehold.co/400x400',
    stock: 50,
    storeId: '2', // Changed to Lojista's store
    categoryId: 'cat-1',
    unit: 'unidade'
  },
  {
    id: 'prod2',
    name: 'Hyper-Threaded Mouse',
    description: 'Clicks so fast, it registers in the past.',
    price: 79.50,
    imageUrl: 'https://placehold.co/400x400',
    stock: 120,
    storeId: '2', // Changed to Lojista's store
    categoryId: 'cat-1',
    unit: 'unidade'
  },
  {
    id: 'prod3',
    name: 'Artisanal Cheese Board',
    description: 'A fine selection of imported and local cheeses.',
    price: 42.00,
    imageUrl: 'https://placehold.co/400x400',
    stock: 200,
    storeId: '2',
    categoryId: 'cat-2',
    unit: 'kilo'
  },
  {
    id: 'prod4',
    name: 'Organic Sourdough',
    description: 'Freshly baked with a crispy crust and soft crumb.',
    price: 8.50,
    imageUrl: 'https://placehold.co/400x400',
    stock: 15,
    storeId: '2',
    categoryId: 'cat-2',
    unit: 'grama'
  },
  {
    id: 'prod5',
    name: 'Silk Scarf',
    description: 'A beautifully printed 100% silk scarf.',
    price: 65.75,
    imageUrl: 'https://placehold.co/400x400',
    stock: 75,
    storeId: '2', // Changed to Lojista's store
    categoryId: 'cat-3',
    unit: 'unidade'
  },
  {
    id: 'prod6',
    name: 'Leather Tote Bag',
    description: 'A timeless classic for your everyday needs.',
    price: 249.99,
    imageUrl: 'https://placehold.co/400x400',
    stock: 30,
    storeId: '2', // Changed to Lojista's store
    categoryId: 'cat-3',
    unit: 'unidade'
  },
];

export const orders: Order[] = [
    {
        id: 'order-1',
        storeId: '2',
        userId: '3',
        customerName: 'Cliente Fiel',
        items: [
            {...products[0], quantity: 1},
            {...products[2], quantity: 2},
        ],
        total: products[0].price + (products[2].price * 2),
        status: 'Pendente',
        paymentStatus: 'Pendente',
        createdAt: new Date(2023, 10, 28),
        paymentMethod: 'Pix',
        observations: 'Deixar na portaria com o João.',
        isDelivery: true,
        deliveryDetails: {
            address: 'Rua das Flores, 123, Apto 45',
            fee: 5.00
        }
    },
    {
        id: 'order-2',
        storeId: '2',
        userId: '4',
        customerName: 'Ana Costa',
        items: [
            {...products[4], quantity: 1},
        ],
        total: products[4].price,
        status: 'Enviado',
        paymentStatus: 'Pago',
        createdAt: new Date(2023, 10, 25),
        paymentMethod: 'Cartão de Crédito',
        isDelivery: false
    },
    {
        id: 'order-3',
        storeId: '2',
        userId: '5',
        customerName: 'Carlos Silva',
        items: [
            {...products[3], quantity: 5},
            {...products[5], quantity: 1},
        ],
        total: (products[3].price * 5) + products[5].price,
        status: 'Entregue',
        paymentStatus: 'Pago',
        createdAt: new Date(2023, 10, 20),
        paymentMethod: 'Dinheiro',
        observations: 'Presente de aniversário, por favor embrulhar com cuidado.',
        isDelivery: false
    },
    {
        id: 'order-4',
        storeId: '2',
        userId: '3',
        customerName: 'Cliente Fiel',
        items: [
            {...products[1], quantity: 2},
        ],
        total: products[1].price * 2,
        status: 'Cancelado',
        paymentStatus: 'Rejeitado',
        createdAt: new Date(2023, 10, 15),
        paymentMethod: 'Pix',
        isDelivery: false,
    }
];
