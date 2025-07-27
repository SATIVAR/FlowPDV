
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth-provider';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';
import { usePathname } from 'next/navigation';
import { Inter, Space_Grotesk } from 'next/font/google';

// Metadata is handled dynamically or in server components
// when using 'use client'.

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/loja/') || pathname.startsWith('/login-cliente') || pathname.startsWith('/register-customer');


  return (
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable} h-full`} suppressHydrationWarning>
      <head>
        {/* You can add Head tags here if needed, for example: */}
        <title>FlowPDV - O marketplace para todos</title>
        <meta name="description" content="Uma plataforma completa para você criar sua loja, gerenciar seus produtos e alcançar mais clientes. Simples, rápido e sem taxas escondidas." />
      </head>
      <body className="font-body antialiased h-full">
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-full flex flex-col">
              {!isAuthPage && <Header />}
              <main className="flex-grow">{children}</main>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
