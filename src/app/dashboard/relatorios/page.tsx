
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export default function RelatoriosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
       <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Analise o desempenho da sua loja.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Análise de Desempenho</CardTitle>
          <CardDescription>Acesse relatórios detalhados sobre vendas, clientes e produtos.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="text-center py-12 text-muted-foreground">
            <BarChart className="mx-auto h-12 w-12" />
            <p className="mt-4">Relatórios detalhados e gráficos de desempenho estarão disponíveis aqui em breve.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
