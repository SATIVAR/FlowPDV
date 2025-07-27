
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo } from 'react';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido.' }),
  whatsapp: z.string().min(10, { message: 'Número de WhatsApp inválido.' }),
  password: z.string().min(8, { message: 'A senha deve ter pelo menos 8 caracteres.' }),
  confirmPassword: z.string(),
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

export default function RegisterAdminPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { registerSuperAdmin, user } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      whatsapp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = form.watch('password');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const unmaskedWhatsapp = values.whatsapp.replace(/\D/g, '');
      await registerSuperAdmin(values.email, unmaskedWhatsapp, values.password);
      toast({
        title: 'Sucesso',
        description: 'Conta de Super Admin criada com sucesso. Você já pode fazer o login.',
      });
      router.push('/login');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha no Cadastro',
        description: (error as Error).message,
      });
    }
  };
  
  if (user && user.role === 'Super Admin') {
    return (
       <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="font-headline text-3xl">Super Admin Já Existe</CardTitle>
                   <CardDescription>Já existe uma conta de Super Admin configurada.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="w-full">
                        <Link href="/login">Ir para o Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
  }


  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Cadastro de Super Admin</CardTitle>
          <CardDescription>Crie a conta principal da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@flowpdv.com" {...field} />
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
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
                    <FormLabel>Confirme a Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                   Esta é a conta principal do sistema, com acesso a todas as funcionalidades. Guarde as credenciais em um local seguro.
                </AlertDescription>
              </Alert>
              <Button type="submit" className="w-full !mt-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Criando conta...' : 'Criar Conta Super Admin'}
              </Button>
            </form>
          </Form>
           <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta de lojista?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
