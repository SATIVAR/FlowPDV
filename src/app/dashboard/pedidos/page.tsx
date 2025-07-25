
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoreHorizontal, Eye, PlusCircle, Edit, Search } from 'lucide-react';
import { orders as initialOrders } from '@/lib/data';
import type { Order, OrderStatus } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '@/components/ui/input';

export default function PedidosPage() {
    const [orders, setOrders] = useState<Order[]>(() => initialOrders.filter(o => o.storeId === '2'));
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOrders = useMemo(() => {
        if (!searchTerm) return orders;
        return orders.filter(order => 
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.slice(-6).toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [orders, searchTerm]);

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
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex-1">
                <h1 className="font-headline text-4xl font-bold">Pedidos</h1>
                <p className="text-muted-foreground">Gerencie todos os pedidos da sua loja.</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Buscar por cliente ou ID..." 
                        className="pl-10 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
                 <Button asChild>
                    <Link href="/dashboard/pedidos/novo">
                        <PlusCircle className="mr-0 md:mr-2 h-4 w-4" />
                        <span className="hidden md:inline">Novo Pedido</span>
                    </Link>
                </Button>
              </div>
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
                                <TableHead>Pagamento</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-center">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
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
                                    <TableCell>{order.paymentMethod}</TableCell>
                                    <TableCell className="text-right">R$ {order.total.toFixed(2)}</TableCell>
                                    <TableCell className="text-center">
                                        <Dialog onOpenChange={(open) => !open && setSelectedOrder(null)} open={selectedOrder?.id === order.id}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Abrir menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                     <DropdownMenuItem onSelect={() => setSelectedOrder(order)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver Detalhes
                                                      </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/pedidos/editar?id=${order.id}`}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar Pedido
                                                        </Link>
                                                    </DropdownMenuItem>
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
                                                                        <TableCell>{item.quantity}{item.unit !== 'unidade' && ` ${item.unit}`}</TableCell>
                                                                        <TableCell className="text-right">R$ {item.price.toFixed(2)}</TableCell>
                                                                        <TableCell className="text-right">R$ {(item.price * item.quantity).toFixed(2)}</TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-4 border-t">
                                                        <div>
                                                            <span className="text-muted-foreground mr-2">Pagamento:</span>
                                                            <span className="font-semibold">{selectedOrder?.paymentMethod}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground mr-2">Total:</span>
                                                            <span className="font-bold text-lg">R$ {selectedOrder?.total.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {filteredOrders.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <Search className="mx-auto h-12 w-12" />
                            <p className="mt-4">Nenhum pedido encontrado.</p>
                            {searchTerm && (
                                <p className="text-sm">Tente ajustar seus termos de busca.</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
