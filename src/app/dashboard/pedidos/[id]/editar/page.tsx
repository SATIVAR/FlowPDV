
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { products as initialProducts, users as initialCustomers, paymentMethods as initialPaymentMethods, orders as initialOrders } from '@/lib/data';
import type { Product, User, PaymentMethod, ProductUnit, Order } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const orderFormSchema = z.object({
  customerId: z.string({ required_error: "Selecione um cliente." }),
  paymentMethodId: z.string({ required_error: "Selecione uma forma de pagamento." }),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.coerce.number().min(0.01, "A quantidade deve ser positiva."),
    price: z.coerce.number(),
    unit: z.enum(['unidade', 'kilo', 'grama']),
  })).min(1, "Adicione pelo menos um produto ao pedido."),
  status: z.enum(['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado']),
});

const customProductSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  price: z.coerce.number().min(0.01, "O preço deve ser positivo."),
  quantity: z.coerce.number().min(0.01, "A quantidade deve ser positiva."),
  unit: z.enum(['unidade', 'kilo', 'grama']),
});

export default function EditOrderPage() {
    const router = useRouter();
    const params = useParams();
    const { id: orderId } = params;
    const { toast } = useToast();

    const [order, setOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<Product[]>(() => initialProducts.filter(p => p.storeId === '2'));
    const [customers, setCustomers] = useState<User[]>(() => initialCustomers.filter(u => u.role === 'Cliente'));
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => initialPaymentMethods);

    const form = useForm<z.infer<typeof orderFormSchema>>({
        resolver: zodResolver(orderFormSchema),
    });

    useEffect(() => {
        const foundOrder = initialOrders.find(o => o.id === orderId);
        if (foundOrder) {
            setOrder(foundOrder);
            form.reset({
                customerId: foundOrder.userId,
                paymentMethodId: paymentMethods.find(pm => pm.name === foundOrder.paymentMethod)?.id || '',
                status: foundOrder.status,
                items: foundOrder.items.map(item => ({
                    productId: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    unit: item.unit,
                })),
            });
        }
    }, [orderId, form, paymentMethods]);

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "items",
    });
    
    const [selectedProductId, setSelectedProductId] = useState('');
    const [customProduct, setCustomProduct] = useState<z.infer<typeof customProductSchema>>({ name: '', price: 0, quantity: 1, unit: 'unidade' });
    const [customProductErrors, setCustomProductErrors] = useState<any>({});
    
    const total = form.watch('items').reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleAddPredefinedProduct = () => {
        const product = products.find(p => p.id === selectedProductId);
        if (product) {
        const existingItemIndex = fields.findIndex(item => item.productId === product.id);
        if (existingItemIndex > -1) {
            const currentItem = fields[existingItemIndex];
            update(existingItemIndex, { ...currentItem, quantity: currentItem.quantity + 1 });
        } else {
            append({ productId: product.id, name: product.name, quantity: 1, price: product.price, unit: product.unit });
        }
        setSelectedProductId('');
        }
    };

    const handleAddCustomProduct = () => {
        const result = customProductSchema.safeParse(customProduct);
        if (result.success) {
            append({
                productId: `custom-${Date.now()}`,
                name: customProduct.name,
                quantity: customProduct.quantity,
                price: customProduct.price,
                unit: customProduct.unit,
            });
            setCustomProduct({ name: '', price: 0, quantity: 1, unit: 'unidade' });
            setCustomProductErrors({});
        } else {
            setCustomProductErrors(result.error.flatten().fieldErrors);
        }
    }

    const handleCustomProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomProduct(prev => ({...prev, [name]: value}));
    }

    const onSubmit = (values: z.infer<typeof orderFormSchema>) => {
        // Here you would typically send the data to your API to update the order
        console.log("Updated Order Submitted:", values);
        toast({
            title: "Pedido Atualizado!",
            description: "O pedido foi atualizado com sucesso.",
        });
        router.push('/dashboard/pedidos');
    };
    
    if (!order) {
        return (
             <div className="container mx-auto px-4 py-8 text-center">
                <p>Carregando pedido...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
             <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                   <Link href="/dashboard/pedidos">
                    <ChevronLeft className="h-4 w-4" />
                   </Link>
                </Button>
                <div>
                    <h1 className="font-headline text-3xl font-bold">Editar Pedido #{order.id.slice(-6)}</h1>
                    <p className="text-muted-foreground">Atualize as informações do pedido.</p>
                </div>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
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
                                name="paymentMethodId"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Forma de Pagamento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {paymentMethods.map(pm => <SelectItem key={pm.id} value={pm.id}>{pm.name}</SelectItem>)}
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Adicionar Produtos</CardTitle>
                        </CardHeader>
                         <CardContent>
                             <Tabs defaultValue="pre-cadastrado">
                                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-4">
                                    <TabsTrigger value="pre-cadastrado">Selecionar Produto</TabsTrigger>
                                    <TabsTrigger value="avulso">Produto Avulso</TabsTrigger>
                                </TabsList>
                                <TabsContent value="pre-cadastrado" className="pt-4">
                                    <div className="space-y-2">
                                        <Label>Produto Pré-cadastrado</Label>
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
                                    <Button type="button" onClick={handleAddPredefinedProduct} disabled={!selectedProductId} className="w-full mt-4">Adicionar</Button>
                                </TabsContent>
                                <TabsContent value="avulso" className="pt-4">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="custom-name">Nome do Produto</Label>
                                        <Input id="custom-name" name="name" value={customProduct.name} onChange={handleCustomProductChange} placeholder="Ex: Coca-cola 2L" />
                                        {customProductErrors.name && <p className="text-sm font-medium text-destructive">{customProductErrors.name}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="custom-price">Preço (R$)</Label>
                                            <Input id="custom-price" name="price" type="number" step="0.01" value={customProduct.price} onChange={handleCustomProductChange} placeholder="10.50" />
                                            {customProductErrors.price && <p className="text-sm font-medium text-destructive">{customProductErrors.price}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="custom-quantity">Quantidade</Label>
                                            <Input id="custom-quantity" name="quantity" type="number" value={customProduct.quantity} onChange={handleCustomProductChange} placeholder="1" />
                                            {customProductErrors.quantity && <p className="text-sm font-medium text-destructive">{customProductErrors.quantity}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                            <Label htmlFor="custom-unit">Unidade</Label>
                                            <Select name="unit" onValueChange={(value: ProductUnit) => setCustomProduct(prev => ({...prev, unit: value}))} defaultValue={customProduct.unit}>
                                                <SelectTrigger id="custom-unit">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unidade">Unidade</SelectItem>
                                                    <SelectItem value="kilo">Kilo (kg)</SelectItem>
                                                    <SelectItem value="grama">Grama (g)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {customProductErrors.unit && <p className="text-sm font-medium text-destructive">{customProductErrors.unit}</p>}
                                    </div>
                                        <Button type="button" className="w-full" onClick={handleAddCustomProduct}>Adicionar Produto Avulso</Button>
                                </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Itens do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="h-full">
                            {fields.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-10">Nenhum produto adicionado.</p>
                            ) : (
                                <div className="overflow-x-auto">
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
                                                            <Input type="number" {...field} className="h-8 w-20" />
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">R$ {(item.price * item.quantity).toFixed(2)}</TableCell>
                                                <TableCell align="center">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => remove(index)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </div>
                            )}
                        </CardContent>
                        {fields.length > 0 && (
                           <CardFooter className="flex justify-end items-center pt-4 border-t font-semibold">
                                <span className="text-muted-foreground mr-2">Total do Pedido:</span>
                                <span className="text-xl">R$ {total.toFixed(2)}</span>
                           </CardFooter>
                        )}
                    </Card>
                    <FormMessage>{form.formState.errors.items?.message || form.formState.errors.items?.root?.message}</FormMessage>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>Salvar Alterações</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
