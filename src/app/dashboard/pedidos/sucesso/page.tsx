
'use client';

import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, QrCode, Copy } from 'lucide-react';
import { orders, stores } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const orderId = searchParams.get('orderId');
    const paymentMethod = searchParams.get('paymentMethod');

    const { order, store } = useMemo(() => {
        if (!orderId) return { order: null, store: null };
        const foundOrder = orders.find(o => o.id === orderId);
        if (!foundOrder) return { order: null, store: null };
        const foundStore = stores.find(s => s.id === foundOrder.storeId);
        return { order: foundOrder, store: foundStore };
    }, [orderId]);

    if (!orderId || !order || !store) {
        // Redirect if the orderId is missing or invalid
        if (typeof window !== 'undefined') {
            router.push('/dashboard/pedidos');
        }
        return null;
    }
    
    const handleCopyPixInfo = () => {
        if (!order || !store || !store.pixKey) return;
        
        const pixInfoText = `
========================
Nº do pedido: #${order.id.slice(-6)}
========================
Valor: R$ ${order.total.toFixed(2)}
------------------------
Chave PIX: ${store.pixKey}
Dados da conta:
Nome: ${store.pixAccountName || 'Não informado'}
Banco: ${store.pixBankName || 'Não informado'}
Conta: ${store.pixAccountNumber || 'Não informada'}
========================
        `.trim();

        navigator.clipboard.writeText(pixInfoText);
        toast({
            title: "Informações Copiadas!",
            description: "Os dados do Pix foram copiados para a área de transferência.",
        });
    }

    const isPix = paymentMethod === 'pix';

    return (
        <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-8">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Pedido Criado com Sucesso!</CardTitle>
                    <CardDescription>
                        O pedido #{orderId.slice(-6)} foi registrado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {isPix && (
                        <Card className="bg-muted/50 text-left">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <QrCode className="h-5 w-5" />
                                    Pague com Pix
                                </CardTitle>
                                <CardDescription>
                                    Escaneie o QR Code ou copie os dados para pagar.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center justify-center gap-4">
                                <Image
                                    src={store.pixQrCodeUrl || 'https://placehold.co/256x256.png'}
                                    width={256}
                                    height={256}
                                    alt="Mock QR Code"
                                    className="rounded-md"
                                    data-ai-hint="qr code"
                                />
                                {store.pixKey && (
                                     <Button variant="outline" className="w-full" onClick={handleCopyPixInfo}>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copiar Dados do Pix
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button asChild className="w-full">
                            <Link href="/dashboard/pedidos/novo">Criar Novo Pedido</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/pedidos">Ver Todos os Pedidos</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
