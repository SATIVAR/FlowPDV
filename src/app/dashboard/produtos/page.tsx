
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export default function ProdutosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Produtos</h1>
        <p className="text-muted-foreground">Gerencie o catálogo de produtos da sua loja.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Produtos</CardTitle>
          <CardDescription>Adicione, edite e remova produtos do seu catálogo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Package className="mx-auto h-12 w-12" />
            <p className="mt-4">A funcionalidade completa de gerenciamento de produtos que você viu no dashboard estará aqui em breve.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
