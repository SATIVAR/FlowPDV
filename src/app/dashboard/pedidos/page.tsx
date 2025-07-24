
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MoreHorizontal, Eye, PlusCircle, Edit } from 'lucide-react';
import { orders as initialOrders } from '@/lib/data';
import type { Order, OrderStatus } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PedidosPage() {
    const [orders, setOrders] = useState<Order[]>(() => initialOrders.filter(o => o.storeId === '2'));
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
              <Button asChild>
                <Link href="/dashboard/pedidos/novo">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Pedido
                </Link>
              </Button>
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
                                    <TableCell>{order.paymentMethod}</TableCell>
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
                                                     <DropdownMenuItem onSelect={() => setSelectedOrder(order)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver Detalhes
                                                      </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/pedidos/${order.id}/editar`}>
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
                </CardContent>
            </Card>
        </div>
    );
}
