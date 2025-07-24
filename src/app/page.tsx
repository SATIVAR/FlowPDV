
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Rocket, Package, Target } from 'lucide-react';
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
              Sua vitrine no mundo digital
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Crie sua loja, gerencie seus produtos e alcance milhares de clientes. Nós cuidamos da tecnologia, você foca em vender.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/register">Crie sua Loja Grátis</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="#features">Descubra os Benefícios <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">A plataforma ideal para o seu negócio</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Ferramentas poderosas e uma interface intuitiva para impulsionar suas vendas e simplificar sua rotina.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center border-0 bg-transparent shadow-none">
                <CardHeader className="items-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Rocket className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Lançamento em Minutos</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>Configure sua loja de forma rápida e descomplicada. Sem necessidade de conhecimento técnico, comece a vender hoje mesmo.</p>
                </CardContent>
              </Card>
              <Card className="text-center border-0 bg-transparent shadow-none">
                <CardHeader className="items-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Package className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Gestão Completa</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>Controle total sobre seus produtos, estoque e pedidos em um painel de controle centralizado e fácil de usar.</p>
                </CardContent>
              </Card>
              <Card className="text-center border-0 bg-transparent shadow-none">
                <CardHeader className="items-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Target className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl">Visibilidade Ampliada</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p>Exponha sua marca para uma base de clientes diversificada e aumente o alcance dos seus produtos em nosso marketplace.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section id="partners" className="py-16 md:py-24 bg-primary/5 dark:bg-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Nossos Lojistas de Sucesso</h2>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Conheça algumas das lojas que confiam e crescem com a nossa plataforma.</p>
            </div>
            <Carousel opts={{ loop: true, align: 'start' }} className="w-full">
              <CarouselContent>
                {stores.map((store) => (
                  <CarouselItem key={store.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden transition-shadow hover:shadow-xl h-full flex flex-col group">
                        <CardHeader className="p-0 relative h-48">
                          <Image src={store.coverUrl} alt={`${store.name} cover`} layout="fill" objectFit="cover" className="transition-transform duration-500 group-hover:scale-105" data-ai-hint="store cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-0 left-4 transform translate-y-1/2">
                              <Image src={store.logoUrl} alt={`${store.name} logo`} width={64} height={64} className="rounded-full border-4 border-background bg-background transition-transform duration-300 group-hover:scale-110" data-ai-hint="store logo" />
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
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Vender na TenantFlow é Simples</h2>
              <p className="text-muted-foreground mt-2">Em três passos você está pronto para o sucesso.</p>
            </div>
            <div className="relative">
                <div className="absolute top-8 left-0 w-full h-0.5 bg-border hidden md:block" />
                <div className="grid md:grid-cols-3 gap-8 text-center relative">
                    <div className="flex flex-col items-center p-4">
                        <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4 ring-8 ring-background z-10">1</div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Crie sua Conta</h3>
                        <p className="text-muted-foreground">Cadastre-se como lojista gratuitamente e defina as informações básicas do seu negócio.</p>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4 ring-8 ring-background z-10">2</div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Cadastre seus Produtos</h3>
                        <p className="text-muted-foreground">Adicione seus produtos com fotos, descrições e preços de forma intuitiva.</p>
                    </div>
                    <div className="flex flex-col items-center p-4">
                        <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4 ring-8 ring-background z-10">3</div>
                        <h3 className="font-headline text-xl font-semibold mb-2">Comece a Vender!</h3>
                        <p className="text-muted-foreground">Alcance milhares de clientes, gerencie seus pedidos e veja seu negócio crescer.</p>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Pronto para transformar seu negócio?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">Junte-se à nossa comunidade de vendedores de sucesso e comece a construir sua presença online hoje mesmo.</p>
            <Button asChild size="lg" variant="secondary" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/register">Quero Vender Agora</Link>
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
