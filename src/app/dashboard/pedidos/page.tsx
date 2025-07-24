
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MoreHorizontal, Eye, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { orders as initialOrders, products as initialProducts, users as initialCustomers } from '@/lib/data';
import type { Order, OrderStatus, User, Product, CartItem } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


const orderFormSchema = z.object({
  customerId: z.string({ required_error: "Selecione um cliente." }),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.coerce.number().min(1, "A quantidade deve ser pelo menos 1."),
    price: z.coerce.number(),
  })).min(1, "Adicione pelo menos um produto ao pedido."),
  status: z.enum(['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado']),
});


function OrderForm({ onSave, order, customers, products, children }: { onSave: (data: Omit<Order, 'id' | 'createdAt' | 'total' | 'customerName'> & { customerId: string }) => void, order?: Order, customers: User[], products: Product[], children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof orderFormSchema>>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: order?.userId || '',
      items: order?.items.map(i => ({ productId: i.id, name: i.name, quantity: i.quantity, price: i.price })) || [],
      status: order?.status || 'Pendente',
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });
  
  const [selectedProductId, setSelectedProductId] = useState('');
  
  const total = form.watch('items').reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleAddProduct = () => {
    const product = products.find(p => p.id === selectedProductId);
    if (product) {
      const existingItemIndex = fields.findIndex(item => item.productId === product.id);
      if (existingItemIndex > -1) {
         const currentItem = fields[existingItemIndex];
         update(existingItemIndex, { ...currentItem, quantity: currentItem.quantity + 1 });
      } else {
        append({ productId: product.id, name: product.name, quantity: 1, price: product.price });
      }
       setSelectedProductId('');
    }
  };

  const onSubmit = (values: z.infer<typeof orderFormSchema>) => {
    onSave({
      userId: values.customerId,
      storeId: '2', // Mock storeId
      items: values.items.map(item => {
        const product = products.find(p => p.id === item.productId)!;
        return { ...product, quantity: item.quantity };
      }),
      status: values.status,
      customerId: values.customerId
    });
    setOpen(false);
    form.reset();
  };
  
  return (
     <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{order ? 'Editar Pedido' : 'Novo Pedido'}</DialogTitle>
          <DialogDescription>
            {order ? 'Edite as informações do pedido.' : 'Crie um novo pedido para um cliente.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status do Pedido</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pendente">Pendente</SelectItem>
                          <SelectItem value="Processando">Processando</SelectItem>
                          <SelectItem value="Enviado">Enviado</SelectItem>
                          <SelectItem value="Entregue">Entregue</SelectItem>
                          <SelectItem value="Cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <Card>
              <CardHeader>
                  <h3 className="text-lg font-semibold">Itens do Pedido</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-grow">
                        <Label>Adicionar Produto</Label>
                        <Select onValueChange={setSelectedProductId} value={selectedProductId}>
                          <SelectTrigger>
                              <SelectValue placeholder="Selecione um produto" />
                          </SelectTrigger>
                          <SelectContent>
                              {products.map(p => (
                                  <SelectItem key={p.id} value={p.id} disabled={fields.some(f => f.productId === p.id)}>
                                      {p.name} - R$ {p.price.toFixed(2)}
                                  </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                    </div>
                    <Button type="button" onClick={handleAddProduct} disabled={!selectedProductId}>Adicionar</Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="w-[100px]">Qtd.</TableHead>
                        <TableHead className="w-[120px]" align="right">Subtotal</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((item, index) => (
                        <TableRow key={item.id}>
                           <TableCell className="font-medium">{item.name}</TableCell>
                           <TableCell>
                             <Controller
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                   <Input type="number" {...field} className="h-8"/>
                                )}
                             />
                           </TableCell>
                           <TableCell align="right">R$ {(item.price * item.quantity).toFixed(2)}</TableCell>
                           <TableCell align="center">
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove(index)}>
                                  <Trash2 className="h-4 w-4"/>
                              </Button>
                           </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {fields.length > 0 && (
                     <div className="flex justify-end items-center pt-4 border-t font-semibold">
                       <span className="text-muted-foreground mr-2">Total do Pedido:</span>
                       <span className="text-xl">R$ {total.toFixed(2)}</span>
                     </div>
                  )}

                </div>
                 <FormMessage>{form.formState.errors.items?.message}</FormMessage>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="submit">Salvar Pedido</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default function PedidosPage() {
    const [orders, setOrders] = useState<Order[]>(() => initialOrders.filter(o => o.storeId === '2'));
    const [products, setProducts] = useState<Product[]>(() => initialProducts.filter(p => p.storeId === '2'));
    const [customers, setCustomers] = useState<User[]>(() => initialCustomers.filter(u => u.role === 'Cliente'));
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const handleSaveOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'total' | 'customerName'> & { customerId: string, id?: string }) => {
        const customer = customers.find(c => c.id === orderData.customerId);
        if (!customer) return;

        const total = orderData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        setOrders(prev => {
            if (orderData.id) { // Editing existing order
                return prev.map(o => o.id === orderData.id ? { ...o, ...orderData, customerName: customer.name, total } : o);
            } else { // Creating new order
                 const newOrder: Order = {
                    ...orderData,
                    id: `order-${Date.now()}`,
                    customerName: customer.name,
                    createdAt: new Date(),
                    total,
                };
                return [newOrder, ...prev];
            }
        });
    };

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status } : order
            )
        );
    };

    const getStatusVariant = (status: OrderStatus) => {
        switch (status) {
            case 'Pendente':
                return 'default';
            case 'Processando':
                return 'secondary';
            case 'Enviado':
                return 'outline';
            case 'Entregue':
                return 'default'; // Success variant could be added to Badge component
            case 'Cancelado':
                return 'destructive';
            default:
                return 'default';
        }
    };
    
    const getStatusDotClass = (status: OrderStatus) => {
        switch (status) {
            case 'Pendente':
                return 'bg-yellow-500';
            case 'Processando':
                return 'bg-blue-500';
            case 'Enviado':
                return 'bg-purple-500';
            case 'Entregue':
                return 'bg-green-500';
            case 'Cancelado':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-headline text-4xl font-bold">Pedidos</h1>
                <p className="text-muted-foreground">Gerencie todos os pedidos da sua loja.</p>
              </div>
              <OrderForm onSave={handleSaveOrder} customers={customers} products={products}>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Pedido
                </Button>
              </OrderForm>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Histórico de Pedidos</CardTitle>
                    <CardDescription>Visualize e gerencie os pedidos recebidos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID do Pedido</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.id.slice(-6)}</TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>{format(order.createdAt, "dd 'de' MMM, yyyy", { locale: ptBR })}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${getStatusDotClass(order.status)}`} />
                                            <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">R$ {order.total.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">
                                        <Dialog>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DialogTrigger asChild>
                                                      <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver Detalhes
                                                      </DropdownMenuItem>
                                                    </DialogTrigger>
                                                    <OrderForm onSave={(data) => handleSaveOrder({...data, id: order.id})} order={order} customers={customers} products={products}>
                                                        {/* This feels a bit hacky, but it's one way to trigger the dialog from the dropdown */}
                                                        <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                          <Edit className="mr-2 h-4 w-4" />
                                                          Editar Pedido
                                                        </div>
                                                    </OrderForm>
                                                    <DropdownMenuItem onSelect={() => handleStatusChange(order.id, 'Pendente')}>Marcar como Pendente</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleStatusChange(order.id, 'Processando')}>Marcar como Processando</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleStatusChange(order.id, 'Cancelado')} className="text-destructive">Cancelar Pedido</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                             <DialogContent className="sm:max-w-lg">
                                                <DialogHeader>
                                                    <DialogTitle>Detalhes do Pedido #{selectedOrder?.id.slice(-6)}</DialogTitle>
                                                    <DialogDescription>
                                                        Cliente: {selectedOrder?.customerName} - Data: {selectedOrder ? format(selectedOrder.createdAt, "dd 'de' MMM, yyyy", { locale: ptBR }) : ''}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="mt-4 space-y-4">
                                                    <div>
                                                        <h3 className="font-semibold mb-2">Itens do Pedido</h3>
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Produto</TableHead>
                                                                    <TableHead>Qtd.</TableHead>
                                                                    <TableHead className="text-right">Preço Unit.</TableHead>
                                                                    <TableHead className="text-right">Subtotal</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {selectedOrder?.items.map(item => (
                                                                    <TableRow key={item.id}>
                                                                        <TableCell>{item.name}</TableCell>
                                                                        <TableCell>{item.quantity}</TableCell>
                                                                        <TableCell className="text-right">R$ {item.price.toFixed(2)}</TableCell>
                                                                        <TableCell className="text-right">R$ {(item.price * item.quantity).toFixed(2)}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                    <div className="flex justify-end items-center pt-4 border-t">
                                                          <span className="text-muted-foreground mr-2">Total:</span>
                                                          <span className="font-bold text-lg">R$ {selectedOrder?.total.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

    

    