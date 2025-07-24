
'use client';

import Link from 'next/link';
import { LogOut, User as UserIcon, ArrowRight } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from './icons';
import { ModeToggle } from './mode-toggle';

export function Header() {
  const { user, logout, hasRole } = useAuth();

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.Logo className="h-8 w-8 text-primary" />
          <span className="font-headline font-bold text-xl">FlowPDV</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm flex-1">
          {user && (
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium"
            >
              Dashboard
            </Link>
          )}
           {user && hasRole('Lojista') && (
            <>
              <Link href="/dashboard/pedidos" className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium">Pedidos</Link>
              <Link href="/dashboard/produtos" className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium">Produtos</Link>
              <Link href="/dashboard/relatorios" className="transition-colors hover:text-foreground/80 text-foreground/60 font-medium">Relatórios</Link>
            </>
          )}
        </nav>
        <div className="flex items-center justify-end space-x-2">
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
                      {user.email}
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
            <nav className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
}
