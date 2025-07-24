import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Store, Users, ShoppingCart, Rocket, Package, Target } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary/5 dark:bg-primary/10 py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight mb-4">
              O marketplace para todos
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Uma plataforma completa para você criar sua loja, gerenciar seus produtos e alcançar mais clientes. Simples, rápido e sem taxas escondidas.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/register">Comece a Vender</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#features">Saiba Mais <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Por que escolher a TenantFlow?</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Oferecemos as melhores ferramentas para lojistas e uma experiência de compra incrível para clientes.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Store className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-headline text-2xl">Para Lojistas</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <Rocket className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <p>Crie sua loja em minutos e comece a vender sem burocracia.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <p>Gerenciamento de produtos e estoque de forma simples e intuitiva.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                    <p>Alcance uma base de clientes diversificada e aumente suas vendas.</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">Para Clientes</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                    <div className="flex items-start gap-3">
                        <ShoppingCart className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                        <p>Encontre produtos únicos de diversas lojas em um só lugar.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <p className="h-5 w-5 mt-1 text-primary flex-shrink-0 font-bold">$</p>
                        <p>Compare preços e encontre as melhores ofertas com facilidade.</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <ArrowRight className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                        <p>Processo de compra seguro e simplificado para uma ótima experiência.</p>
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-primary/5 dark:bg-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Como Funciona</h2>
              <p className="text-muted-foreground mt-2">Em três passos simples você está pronto para o sucesso.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4">1</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Crie sua Conta</h3>
                <p className="text-muted-foreground">Cadastre-se como lojista ou cliente de forma rápida e gratuita.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4">2</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Configure sua Loja</h3>
                <p className="text-muted-foreground">Adicione seus produtos, personalize sua página e defina seus preços.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4">3</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Comece a Vender!</h3>
                <p className="text-muted-foreground">Alcance milhares de clientes e gerencie seus pedidos com facilidade.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-muted-foreground text-lg mb-8">Junte-se à nossa comunidade de vendedores e compradores hoje mesmo.</p>
            <Button asChild size="lg">
              <Link href="/register">Abra sua Loja Agora</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-secondary dark:bg-secondary/20 border-t">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} TenantFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}