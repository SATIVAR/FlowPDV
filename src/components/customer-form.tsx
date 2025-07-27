
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input, MaskedInput } from '@/components/ui/input';
import { Textarea } from './ui/textarea';

const customerFormSchema = z.object({
  name: z.string().min(2, { message: "O nome é obrigatório." }),
  whatsapp: z.string().min(10, { message: "Número de WhatsApp inválido." }),
  deliveryAddress: z.string().optional(),
  addressReference: z.string().optional(),
});

export function CustomerForm({ onSave, customer, children }: { onSave: (data: any) => void, customer?: User, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: customer?.name || '',
      whatsapp: customer?.whatsapp || '',
      deliveryAddress: customer?.deliveryAddress || '',
      addressReference: customer?.addressReference || '',
    },
  });

  const onSubmit = (values: z.infer<typeof customerFormSchema>) => {
    onSave({
      ...values,
      whatsapp: values.whatsapp.replace(/\D/g, ''),
    });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{customer ? 'Editar Cliente' : 'Adicionar Cliente'}</DialogTitle>
          <DialogDescription>
             {customer ? 'Edite as informações do seu cliente.' : 'Preencha as informações do novo cliente.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do Cliente" {...field} />
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
                    <MaskedInput mask="(00) 00000-0000" placeholder="+55 (11) 99999-9999" {...field} />
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
            <DialogFooter>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
