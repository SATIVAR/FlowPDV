
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from './mode-toggle';

interface PublicHeaderProps {
    storeName: string;
}

export function PublicHeader({ storeName }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="#" className="mr-6 flex items-center space-x-2">
          <span className="font-headline font-bold text-xl">{storeName}</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center justify-end space-x-2">
          <ModeToggle />
            <nav className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register-customer">
                  <span>Cadastre-se</span>
                </Link>
              </Button>
            </nav>
        </div>
      </div>
    </header>
  );
}
