
'use client';

import { Suspense, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, MaskedInput } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { stores } from '@/lib/data';
import type { Store } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

const formSchema = z.object({
  whatsapp: z.string().min(1, { message: 'O WhatsApp é obrigatório.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
});

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('loja');
  const store: Store | undefined = useMemo(() => stores.find(s => s.slug === storeSlug), [storeSlug]);

  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whatsapp: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
       const unmaskedWhatsapp = values.whatsapp.replace(/\D/g, '');
      await login(unmaskedWhatsapp, values.password);
      toast({
        title: 'Sucesso',
        description: 'Login efetuado com sucesso.',
      });
      router.push(storeSlug ? `/loja/${storeSlug}` : '/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha no Login',
        description: (error as Error).message,
      });
    }
  };
  
  return (
    <div className="container flex items-center justify-center min-h-screen py-12 bg-muted/30">
        <div className="w-full max-w-md mx-auto space-y-4">
             {store && (
                 <div className="flex flex-col items-center text-center">
                    <Image src={store.logoUrl} alt={store.name} width={80} height={80} className="rounded-full mb-4 border" data-ai-hint="company logo" />
                    <h1 className="font-headline text-2xl font-bold">Acesse sua conta na {store.name}</h1>
                    <p className="text-muted-foreground">Bem-vindo(a) de volta!</p>
                </div>
            )}
            <Card>
                <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="whatsapp"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                            <MaskedInput mask="(00) 00000-0000" placeholder="(11) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>
                    </form>
                </Form>
                 <p className="mt-6 text-center text-sm text-muted-foreground">
                    Não tem uma conta?{' '}
                    <Link href={storeSlug ? `/register-customer?loja=${storeSlug}` : '/register'} className="font-medium text-primary hover:underline">
                    Cadastre-se
                    </Link>
                </p>
                </CardContent>
            </Card>
             <div className="text-center">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={storeSlug ? `/loja/${storeSlug}` : '/'}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para a loja
                    </Link>
                </Button>
            </div>
        </div>
    </div>
  );
}


export default function CustomerLoginPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <CustomerLoginForm />
        </Suspense>
    )
}
