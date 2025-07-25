
'use client';

import Link from 'next/link';
import { LogOut, User as UserIcon, ArrowRight, Store, ChevronDown, ExternalLink, Settings, Eye, PlusCircle, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from './icons';
import { ModeToggle } from './mode-toggle';
import { stores } from '@/lib/data';
import { useState, useEffect, Fragment } from 'react';

export function Header() {
  const { user, logout, hasRole } = useAuth();
  const [storeSlug, setStoreSlug] = useState<string | null>(null);

  useEffect(() => {
    if (user && hasRole('Lojista')) {
      const userStore = stores.find(s => s.id === '2');
      if (userStore) {
        setStoreSlug(userStore.slug);
      }
    }
  }, [user, hasRole]);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const LojistaNavLinks = ({ isMobile = false }) => {
    const commonLinkClasses = "py-2 md:py-0 px-2 transition-colors hover:text-foreground/80 text-foreground/60 font-medium";

    const renderLink = (href: string, text: string) => {
        const link = <Link href={href} className={commonLinkClasses}>{text}</Link>;
        if (isMobile) {
            return <SheetClose asChild>{link}</SheetClose>
        }
        return link;
    }

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="px-2 text-foreground/60 font-medium transition-colors hover:bg-transparent hover:text-foreground/80 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:text-foreground/80"
            >
              Pedidos
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Link href="/dashboard/pedidos">
                <Eye className="mr-2 h-4 w-4" /> Ver Pedidos
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/pedidos/novo">
                <PlusCircle className="mr-2 h-4 w-4" /> Novo Pedido
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {renderLink("/dashboard/produtos", "Produtos")}
        {renderLink("/dashboard/relatorios", "Relatórios")}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="px-2 text-foreground/60 font-medium transition-colors hover:bg-transparent hover:text-foreground/80 focus-visible:ring-0 focus-visible:ring-offset-0 data-[state=open]:text-foreground/80"
            >
              Minha Loja
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {storeSlug && (
              <DropdownMenuItem asChild>
                <a href={`/loja/${storeSlug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" /> Ver Loja
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <Link href="/dashboard/minha-loja">
                <Settings className="mr-2 h-4 w-4" /> Configurações
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.Logo className="h-10 w-10 text-primary" />
          <span className="font-headline font-bold text-xl">FlowPDV</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm flex-1">
          {user && (
            <Link
              href="/dashboard"
              className="px-2 transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              Dashboard
            </Link>
          )}
          {user && hasRole('Lojista') && <LojistaNavLinks />}
        </nav>
        <div className="flex items-center justify-end space-x-2 flex-1 md:flex-none">
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.whatsapp}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <nav className="hidden md:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="group relative gradient-cta text-primary-foreground border-none transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105">
                <Link href="/register">
                  <span>Cadastro</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </nav>
          )}
           <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Abrir menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="p-4">
                     <SheetClose asChild>
                        <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
                            <Icons.Logo className="h-10 w-10 text-primary" />
                            <span className="font-headline font-bold text-xl">FlowPDV</span>
                        </Link>
                      </SheetClose>
                      <nav className="flex flex-col items-start gap-1 text-lg">
                        {user ? (
                           <>
                             <SheetClose asChild>
                              <Link href="/dashboard" className="py-2 transition-colors hover:text-foreground/80 text-foreground/60 font-medium">Dashboard</Link>
                             </SheetClose>
                             {hasRole('Lojista') && <LojistaNavLinks isMobile={true} />}
                           </>
                        ) : (
                          <div className="flex flex-col gap-2 w-full">
                           <SheetClose asChild>
                            <Link href="/login" className="w-full">
                              <Button variant="outline" className="w-full">Login</Button>
                            </Link>
                           </SheetClose>
                           <SheetClose asChild>
                             <Link href="/register" className="w-full">
                               <Button className="w-full gradient-cta text-primary-foreground">Cadastro</Button>
                             </Link>
                           </SheetClose>
                          </div>
                        )}
                      </nav>
                  </div>
                </SheetContent>
              </Sheet>
           </div>
        </div>
      </div>
    </header>
  );
}
