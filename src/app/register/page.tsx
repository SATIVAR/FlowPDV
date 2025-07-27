
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';


const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
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


export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = form.watch('password');

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const unmaskedWhatsapp = values.whatsapp.replace(/\D/g, '');
      await register(values.name, unmaskedWhatsapp, values.password);
      toast({
        title: 'Sucesso',
        description: 'Conta de lojista criada com sucesso. Você já pode fazer o login.',
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Falha no Cadastro',
        description: (error as Error).message,
      });
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Crie sua Conta de Lojista</CardTitle>
          <CardDescription>Junte-se à FlowPDV hoje para começar a vender.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Loja ou Lojista</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua Loja Incrível" {...field} />
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
                    <FormLabel>Repita a Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Você está criando uma conta de <strong>Lojista</strong>. Com ela, você poderá cadastrar seus produtos e gerenciar sua loja na FlowPDV.
                </AlertDescription>
              </Alert>
              <Button type="submit" className="w-full !mt-6" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Criando conta...' : 'Criar Conta de Lojista'}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
