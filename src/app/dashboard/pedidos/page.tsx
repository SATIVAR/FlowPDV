
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";

export default function PedidosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Pedidos</h1>
        <p className="text-muted-foreground">Gerencie todos os pedidos da sua loja.</p>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Pedidos</CardTitle>
          <CardDescription>Visualize e gerencie os pedidos recebidos.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="mx-auto h-12 w-12" />
            <p className="mt-4">A funcionalidade de gerenciamento de pedidos estará disponível em breve.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
