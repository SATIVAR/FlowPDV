
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Rocket, Package, Target } from 'lucide-react';

export default function Home() {
  const partnerLogos = [
    { name: 'Tech Wonders', logo: 'https://placehold.co/150x40' },
    { name: 'Gourmet Delights', logo: 'https://placehold.co/150x40' },
    { name: 'Fashion Forward', logo: 'https://placehold.co/150x40' },
    { name: 'Bookworm\'s Paradise', logo: 'https://placehold.co/150x40' },
    { name: 'Home Comforts', logo: 'https://placehold.co/150x40' },
    { name: 'Vintage Finds', logo: 'https://placehold.co/150x40' },
  ];

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-12 md:pt-40 md:pb-20 text-center gradient-bg">
          <div className="container mx-auto px-4 z-10">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-foreground">
              A plataforma completa para <span className="gradient-text">o seu negócio</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Crie sua loja online, gerencie produtos e expanda suas vendas. Tudo que você precisa para decolar no digital, em um só lugar.
            </p>
            <div className="flex justify-center items-center gap-4">
              <Button asChild size="lg" className="gradient-cta text-primary-foreground border-none hover:opacity-90 transition-opacity">
                <Link href="/register">Quero Vender Agora</Link>
              </Button>
            </div>
          </div>
          <div className="relative mt-12 md:mt-20 px-4">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-full bg-primary/5 rounded-full blur-3xl" />
              <Image 
                src="https://placehold.co/1200x600"
                width={1200}
                height={600}
                alt="Dashboard do Lojista TenantFlow"
                className="rounded-xl shadow-2xl mx-auto relative z-10 opacity-80"
                data-ai-hint="dashboard mockup"
              />
               <Card className="absolute z-20 w-[90%] max-w-sm p-4 right-4 -bottom-8 sm:right-16 sm:-bottom-12 shadow-2xl animate-fade-in-up">
                  <CardContent className="p-0">
                      <p className="font-semibold mb-2 text-sm">✨ Nova venda realizada!</p>
                      <div className="flex items-center gap-3">
                        <Image src="https://placehold.co/40x40" width={40} height={40} alt="Produto" className="rounded-md" data-ai-hint="product image" />
                        <div>
                          <p className="font-medium text-sm">Quantum Coder Keyboard</p>
                          <p className="text-muted-foreground text-xs">Valor: $189.99</p>
                        </div>
                      </div>
                  </CardContent>
              </Card>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-muted-foreground tracking-widest uppercase font-semibold text-sm">
              Lojistas que confiam e crescem com a gente
            </h3>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {partnerLogos.map(partner => (
                <Image
                  key={partner.name}
                  src={partner.logo}
                  alt={partner.name}
                  width={150}
                  height={40}
                  className="mx-auto opacity-60 hover:opacity-100 transition-opacity"
                  data-ai-hint="company logo"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-primary/5 dark:bg-primary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Tudo que você precisa. Sem complicação.</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">
                Oferecemos as ferramentas certas para você focar no que realmente importa: o crescimento da sua loja.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-primary/10">
                <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-bold mb-2">Lançamento Rápido</h3>
                <p className="text-muted-foreground">Sua loja no ar em minutos. Sem burocracia e sem precisar de conhecimentos técnicos. Comece a vender hoje.</p>
              </Card>
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-primary/10">
                <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mb-4">
                  <Package className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-bold mb-2">Gestão Simplificada</h3>
                <p className="text-muted-foreground">Gerencie produtos, estoque e pedidos em um painel de controle intuitivo e poderoso. Tenha total controle do seu negócio.</p>
              </Card>
              <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-primary/10">
                <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit mb-4">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="font-headline text-2xl font-bold mb-2">Alcance Ampliado</h3>
                <p className="text-muted-foreground">Faça parte de um marketplace vibrante. Aumente sua visibilidade e conecte-se com milhares de novos clientes.</p>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Começar a vender é fácil</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto text-lg">Siga estes 3 passos simples para lançar sua loja online.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
                <div className="absolute top-8 left-0 w-full h-px bg-border -z-10 hidden md:block" />
                <div className="absolute top-8 left-0 w-full h-px bg-gradient-to-r from-primary to-accent -z-10 hidden md:block" />
                <div className="text-center flex flex-col items-center p-4">
                  <div className="relative w-16 h-16 rounded-full gradient-cta flex items-center justify-center text-primary-foreground font-bold text-2xl mb-4 shadow-lg ring-4 ring-background">1</div>
                  <h3 className="font-headline text-xl font-bold mb-2">Crie sua Conta</h3>
                  <p className="text-muted-foreground px-4">Cadastre-se e configure as informações essenciais da sua loja.</p>
                </div>
                <div className="text-center flex flex-col items-center p-4">
                  <div className="relative w-16 h-16 rounded-full gradient-cta flex items-center justify-center text-primary-foreground font-bold text-2xl mb-4 shadow-lg ring-4 ring-background">2</div>
                  <h3 className="font-headline text-xl font-bold mb-2">Adicione seus Produtos</h3>
                  <p className="text-muted-foreground px-4">Faça o upload de fotos, descrições e preços dos seus produtos.</p>
                </div>
                <div className="text-center flex flex-col items-center p-4">
                  <div className="relative w-16 h-16 rounded-full gradient-cta flex items-center justify-center text-primary-foreground font-bold text-2xl mb-4 shadow-lg ring-4 ring-background">3</div>
                  <h3 className="font-headline text-xl font-bold mb-2">Comece a Vender</h3>
                  <p className="text-muted-foreground px-4">Gerencie seus pedidos, interaja com clientes e veja seu negócio decolar.</p>
                </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 gradient-bg">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-4">Pronto para transformar seu negócio?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">Junte-se à nossa comunidade de vendedores de sucesso e comece a construir sua presença online hoje mesmo.</p>
            <Button asChild size="lg" className="gradient-cta text-primary-foreground border-none hover:opacity-90 transition-opacity">
              <Link href="/register">Quero Vender Agora <ArrowRight className="ml-2 h-5 w-5" /></Link>
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

    