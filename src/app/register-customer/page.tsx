
'use client';

import { Suspense } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';

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
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { stores } from '@/lib/data';
import type { Store } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';


const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  whatsapp: z.string().min(10, { message: 'Número de WhatsApp inválido.' }),
  password: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' }),
  confirmPassword: z.string(),
  deliveryAddress: z.string().optional(),
  addressReference: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ['confirmPassword'],
});

const PasswordStrengthIndicator = ({ password }: { password?: string }) => {
    const strength = useMemo(() => {
        if (!password) return { score: 0, label: '', color: 'bg-transparent' };
        
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        switch (score) {
            case 1: return { score: 25, label: 'Fraca', color: 'bg-red-500' };
            case 2: return { score: 50, label: 'Média', color: 'bg-yellow-500' };
            case 3: return { score: 75, label: 'Forte', color: 'bg-blue-500' };
            case 4: return { score: 100, label: 'Muito Forte', color: 'bg-green-500' };
            default: return { score: 0, label: '', color: 'bg-transparent' };
        }
    }, [password]);

    if (!password) return null;

    return (
        <div className="space-y-1">
            <Progress value={strength.score} className={`h-2 ${strength.color}`} />
            <p className="text-xs text-muted-foreground">{strength.label}</p>
        </div>
    );
};


function RegisterCustomerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const storeSlug = searchParams.get('loja');
  const store: Store | undefined = useMemo(() => stores.find(s => s.slug === storeSlug), [storeSlug]);

  const { toast } = useToast();
  const { registerCustomer, login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      password: '',
      confirmPassword: '',
      deliveryAddress: '',
      addressReference: '',
    },
  });

  const watchedPassword = form.watch('password');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const unmaskedWhatsapp = values.whatsapp.replace(/\D/g, '');
      await registerCustomer(values.name, unmaskedWhatsapp, values.password, values.deliveryAddress, values.addressReference);
      await login(unmaskedWhatsapp, values.password);

      toast({
        title: 'Sucesso!',
        description: 'Sua conta foi criada com sucesso e você já está conectado.',
      });
      router.push(storeSlug ? `/loja/${storeSlug}` : '/'); 
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha no Cadastro',
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
                    <h1 className="font-headline text-2xl font-bold">Crie sua conta na {store.name}</h1>
                    <p className="text-muted-foreground">É rápido e fácil. Comece a comprar agora mesmo!</p>
                </div>
            )}
            <Card>
                <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Seu Nome Completo</FormLabel>
                            <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
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
                        name="deliveryAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Endereço de Entrega (Opcional)</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Rua, Número, Bairro, Cidade" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="addressReference"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ponto de Referência (Opcional)</FormLabel>
                                <FormControl>
                                <Input placeholder="Ex: Próximo ao mercado X" {...field} />
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
                            <FormLabel>Crie uma Senha</FormLabel>
                            <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                            <PasswordStrengthIndicator password={watchedPassword} />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Repita a Senha</FormLabel>
                            <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    
                    <Button type="submit" className="w-full !mt-6" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Criando conta...' : 'Criar Minha Conta'}
                    </Button>
                    </form>
                </Form>
                 <p className="mt-6 text-center text-sm text-muted-foreground">
                    Já tem uma conta?{' '}
                    <Link href={storeSlug ? `/login-cliente?loja=${storeSlug}` : '/login'} className="font-medium text-primary hover:underline">
                    Entrar
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

export default function RegisterCustomerPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <RegisterCustomerForm />
        </Suspense>
    )
}
