
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Store, Users, ShoppingCart, Rocket, Package, Target } from 'lucide-react';
import { stores } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-lg transition-shadow border-0 bg-primary/5 dark:bg-primary/10">
                <CardHeader className="items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Lançamento Rápido</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  <p>Crie e configure sua loja em minutos, sem necessidade de conhecimento técnico. Comece a vender rapidamente.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow border-0 bg-primary/5 dark:bg-primary/10">
                <CardHeader className="items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <Package className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Gestão Simplificada</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  <p>Gerencie seus produtos, estoque e pedidos com uma interface simples e intuitiva, focada no que importa.</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow border-0 bg-primary/5 dark:bg-primary/10">
                <CardHeader className="items-center text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-2">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">Alcance Mais Clientes</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground">
                  <p>Exponha sua marca para uma base de clientes diversificada e aumente a visibilidade dos seus produtos.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section id="partners" className="py-16 md:py-24 bg-primary/5 dark:bg-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Nossos Parceiros</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Conheça algumas das lojas que confiam na nossa plataforma.</p>
            </div>
            <Carousel opts={{ loop: true, align: 'start' }} className="w-full">
              <CarouselContent>
                {stores.map((store) => (
                  <CarouselItem key={store.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden transition-shadow hover:shadow-xl h-full flex flex-col">
                        <CardHeader className="p-0 relative h-48">
                          <Image src={store.coverUrl} alt={`${store.name} cover`} layout="fill" objectFit="cover" data-ai-hint="store cover" />
                          <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                              <Image src={store.logoUrl} alt={`${store.name} logo`} width={64} height={64} className="rounded-full border-4 border-background bg-background" data-ai-hint="store logo" />
                          </div>
                        </CardHeader>
                        <CardContent className="pt-10 flex-grow">
                          <CardTitle className="font-headline text-xl">{store.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{store.address}</p>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full">
                            <Link href={`/store/${store.id}`}>Ver Produtos</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
            </Carousel>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Como Funciona</h2>
              <p className="text-muted-foreground mt-2">Em três passos simples você está pronto para o sucesso.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4 ring-8 ring-primary/10">1</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Crie sua Conta</h3>
                <p className="text-muted-foreground">Cadastre-se como lojista ou cliente de forma rápida e gratuita.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4 ring-8 ring-primary/10">2</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Configure sua Loja</h3>
                <p className="text-muted-foreground">Adicione seus produtos, personalize sua página e defina seus preços.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4 ring-8 ring-primary/10">3</div>
                <h3 className="font-headline text-xl font-semibold mb-2">Comece a Vender!</h3>
                <p className="text-muted-foreground">Alcance milhares de clientes e gerencie seus pedidos com facilidade.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-primary/5 dark:bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-muted-foreground text-lg mb-8">Junte-se à nossa comunidade de vendedores e compradores hoje mesmo.</p>
            <Button asChild size="lg">
              <Link href="/register">Abra sua Loja Agora</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} TenantFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
