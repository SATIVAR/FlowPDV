
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { products as initialProducts, users as initialCustomers, paymentMethods as initialPaymentMethods, stores } from '@/lib/data';
import type { Product, User, PaymentMethod, ProductUnit, Store } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, Trash2, PlusCircle, Check, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CustomerForm } from '@/components/customer-form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const orderFormSchema = z.object({
  customerType: z.enum(['registered', 'unregistered'], { required_error: "Selecione o tipo de cliente."}),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  paymentMethodId: z.string({ required_error: "Selecione uma forma de pagamento." }),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.coerce.number().min(0.01, "A quantidade deve ser positiva."),
    price: z.coerce.number(),
    unit: z.enum(['unidade', 'kilo', 'grama']),
  })).min(1, "Adicione pelo menos um produto ao pedido."),
  status: z.enum(['Pendente', 'Processando', 'Enviado', 'Entregue', 'Cancelado']),
  paymentStatus: z.enum(['Pendente', 'Pago', 'Rejeitado']),
  observations: z.string().optional(),
  isDelivery: z.boolean().default(false),
  deliveryAddress: z.string().optional(),
  deliveryAddressReference: z.string().optional(),
  deliveryFee: z.coerce.number().optional(),
}).refine(data => {
    if (data.customerType === 'registered') {
        return !!data.customerId;
    }
    if (data.customerType === 'unregistered') {
        return !!data.customerName && data.customerName.length > 1;
    }
    return false;
}, {
    message: "Selecione um cliente cadastrado ou insira o nome de um cliente avulso.",
    path: ["customerId"],
}).refine(data => {
    if (data.isDelivery) {
        return !!data.deliveryAddress && data.deliveryAddress.length > 2;
    }
    return true;
}, {
    message: "O endereço de entrega é obrigatório.",
    path: ["deliveryAddress"],
});

const customProductSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  price: z.coerce.number().min(0.01, "O preço deve ser positivo."),
  quantity: z.coerce.number().min(0.01, "A quantidade deve ser positiva."),
  unit: z.enum(['unidade', 'kilo', 'grama']),
});

const getPaymentMethodIcon = (name: string) => {
    switch(name.toLowerCase()) {
        case 'pix': return <Smartphone className="h-6 w-6 text-primary" />;
        case 'cartão de crédito': return <CreditCard className="h-6 w-6 text-primary" />;
        case 'dinheiro': return <DollarSign className="h-6 w-6 text-primary" />;
        default: return <CreditCard className="h-6 w-6 text-primary" />;
    }
}

export default function NewOrderPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [store, setStore] = useState<Store>(() => stores.find(s => s.id === '2')!);
    const [products, setProducts] = useState<Product[]>(() => initialProducts.filter(p => p.storeId === '2'));
    const [customers, setCustomers] = useState<User[]>(() => initialCustomers.filter(u => u.role === 'Cliente'));
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => initialPaymentMethods);

    const deliveryOption = store.deliveryOptions.find(opt => opt.type === 'Entrega' && opt.enabled);
    const fixedFee = deliveryOption?.feeType === 'fixed' ? deliveryOption.price : undefined;

    const form = useForm<z.infer<typeof orderFormSchema>>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            customerType: 'registered',
            items: [],
            status: 'Pendente',
            paymentStatus: 'Pendente',
            observations: '',
            isDelivery: false,
            deliveryFee: fixedFee || 0,
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "items",
    });
    
    const [selectedProductId, setSelectedProductId] = useState('');
    const [customProduct, setCustomProduct] = useState<z.infer<typeof customProductSchema>>({ name: '', price: 0, quantity: 1, unit: 'unidade' });
    const [customProductErrors, setCustomProductErrors] = useState<any>({});
    
    const itemsTotal = form.watch('items').reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = form.watch('isDelivery') ? form.watch('deliveryFee') || 0 : 0;
    const total = itemsTotal + deliveryFee;

    const customerType = form.watch('customerType');
    const isDelivery = form.watch('isDelivery');

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
    
    const handleSaveCustomer = (customerData: User) => {
        const newCustomer = {
            ...customerData,
            id: `user-${Date.now()}`,
            role: 'Cliente' as const,
            avatar: 'https://placehold.co/100x100',
        };
        setCustomers(prev => [newCustomer, ...prev]);
        form.setValue('customerId', newCustomer.id);
        form.setValue('customerType', 'registered');
        toast({ title: 'Cliente adicionado!', description: 'O novo cliente foi salvo com sucesso.'})
    };

    const handleCustomProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomProduct(prev => ({...prev, [name]: value}));
    }

    const onSubmit = (values: z.infer<typeof orderFormSchema>) => {
        // Here you would typically send the data to your API
        console.log("New Order Submitted:", values);
        toast({
            title: "Pedido Criado!",
            description: "O novo pedido foi salvo com sucesso.",
        });
        router.push('/dashboard/pedidos');
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
             <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" size="icon" asChild>
                   <Link href="/dashboard/pedidos">
                    <ChevronLeft className="h-4 w-4" />
                   </Link>
                </Button>
                <div>
                    <h1 className="font-headline text-3xl font-bold">Novo Pedido</h1>
                    <p className="text-muted-foreground">Crie um novo pedido para um cliente.</p>
                </div>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Pedido</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="customerType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Cliente</FormLabel>
                                            <FormControl>
                                                <Tabs 
                                                    value={field.value} 
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        form.setValue('customerId', undefined);
                                                        form.setValue('customerName', undefined);
                                                    }}
                                                    className="w-full"
                                                >
                                                    <TabsList className="grid w-full grid-cols-2">
                                                        <TabsTrigger value="registered">Cliente Cadastrado</TabsTrigger>
                                                        <TabsTrigger value="unregistered">Cliente Avulso</TabsTrigger>
                                                    </TabsList>
                                                </Tabs>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {customerType === 'registered' ? (
                                    <div className="flex items-end gap-2">
                                        <FormField
                                            control={form.control}
                                            name="customerId"
                                            render={({ field }) => (
                                            <FormItem className="flex-grow">
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
                                            </FormItem>
                                            )}
                                        />
                                        <CustomerForm onSave={handleSaveCustomer}>
                                            <Button type="button" variant="outline" size="icon">
                                                <PlusCircle className="h-4 w-4"/>
                                            </Button>
                                        </CustomerForm>
                                    </div>
                                ) : (
                                     <FormField
                                        control={form.control}
                                        name="customerName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome do Cliente Avulso</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Digite o nome do cliente" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                                <FormMessage>{form.formState.errors.customerId?.message}</FormMessage>

                            </div>
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
                             <FormField
                                control={form.control}
                                name="paymentStatus"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Status do Pagamento</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um status" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                        <SelectItem value="Pendente">Pendente</SelectItem>
                                        <SelectItem value="Pago">Pago</SelectItem>
                                        <SelectItem value="Rejeitado">Rejeitado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <div className="md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="paymentMethodId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Forma de Pagamento</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                                >
                                                    {paymentMethods.map((pm) => (
                                                        <FormItem key={pm.id} className="flex-1">
                                                            <FormControl>
                                                                <RadioGroupItem value={pm.id} id={pm.id} className="peer sr-only" />
                                                            </FormControl>
                                                            <Label
                                                                htmlFor={pm.id}
                                                                className="flex items-start gap-4 rounded-md border-2 border-muted bg-popover p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                                            >
                                                                {getPaymentMethodIcon(pm.name)}
                                                                <div className="flex-1 text-left">
                                                                    <p className="font-semibold">{pm.name}</p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Clique para selecionar
                                                                    </p>
                                                                </div>
                                                            </Label>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="observations"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Observações</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Ex: Deixar na portaria, troco para R$50, etc." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {deliveryOption && (
                        <Card>
                             <CardHeader>
                                <CardTitle>Entrega</CardTitle>
                                <CardDescription>Configure os detalhes da entrega para este pedido.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="isDelivery"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Enviar por delivery?
                                            </FormLabel>
                                            <FormDescription>
                                                Ative se este pedido precisar ser entregue ao cliente.
                                            </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                {isDelivery && (
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="deliveryAddress"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Endereço de Entrega</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Rua, Número, Bairro, Cidade" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="deliveryAddressReference"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Ponto de Referência</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: Próximo ao mercado X" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={form.control}
                                            name="deliveryFee"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Taxa de Entrega (R$)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" step="0.01" placeholder="7.00" {...field} disabled={deliveryOption.feeType === 'fixed'} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

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
                           <CardFooter className="flex-col items-end gap-2 pt-4 border-t">
                                <div className="flex justify-between w-full max-w-[250px]">
                                     <span className="text-muted-foreground">Subtotal:</span>
                                     <span>R$ {itemsTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-full max-w-[250px]">
                                     <span className="text-muted-foreground">Taxa de Entrega:</span>
                                     <span>R$ {deliveryFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-full max-w-[250px] font-bold text-lg">
                                     <span className="text-muted-foreground">Total:</span>
                                     <span>R$ {total.toFixed(2)}</span>
                                </div>
                           </CardFooter>
                        )}
                    </Card>
                    <FormMessage>{form.formState.errors.items?.message || form.formState.errors.items?.root?.message}</FormMessage>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>Salvar Pedido</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

    

    
