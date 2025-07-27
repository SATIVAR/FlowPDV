
'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, QrCode } from 'lucide-react';

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const paymentMethod = searchParams.get('paymentMethod');

    if (!orderId) {
        // Redirect if the orderId is missing
        if (typeof window !== 'undefined') {
            router.push('/dashboard/pedidos');
        }
        return null;
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
                                    Escaneie o QR Code abaixo com o app do seu banco para pagar.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center">
                                <Image
                                    src="https://placehold.co/256x256.png"
                                    width={256}
                                    height={256}
                                    alt="Mock QR Code"
                                    className="rounded-md"
                                    data-ai-hint="qr code"
                                />
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

    