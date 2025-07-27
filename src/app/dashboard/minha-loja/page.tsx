
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { stores as initialStores } from '@/lib/data';
import type { Store } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, MaskedInput } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Upload, Copy, ExternalLink, Store as StoreIcon, Instagram, Youtube } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Icons } from '@/components/icons';

const storeSettingsSchema = z.object({
  name: z.string().min(3, "O nome da loja deve ter pelo menos 3 caracteres."),
  slug: z.string().min(3, "A URL amigável deve ter pelo menos 3 caracteres.").regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífens."),
  description: z.string().max(200, "A descrição pode ter no máximo 200 caracteres.").optional(),
  contactWhatsapp: z.string().min(10, "WhatsApp inválido.").optional(),
  address: z.string().optional(),
  socials: z.object({
      instagram: z.string().optional(),
      tiktok: z.string().optional(),
      youtube: z.string().optional(),
  }).optional(),
  pixKey: z.string().optional(),
  pixAccountName: z.string().optional(),
  pixBankName: z.string().optional(),
  pixAccountNumber: z.string().optional(),
  deliveryOptions: z.array(z.object({
      type: z.enum(['Entrega', 'Retirada']),
      enabled: z.boolean(),
      feeType: z.enum(['fixed', 'variable']).optional(),
      price: z.coerce.number().min(0).optional(),
      details: z.string().optional(),
  }))
});

export default function MinhaLojaPage() {
    // In a real app, you'd fetch this based on the logged-in user's storeId
    const [store, setStore] = useState<Store>(() => initialStores.find(s => s.id === '2')!);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof storeSettingsSchema>>({
        resolver: zodResolver(storeSettingsSchema),
        defaultValues: {
            name: store.name,
            slug: store.slug,
            description: store.description || '',
            contactWhatsapp: store.contactWhatsapp || '',
            address: store.address || '',
            socials: {
                instagram: store.socials?.instagram || '',
                tiktok: store.socials?.tiktok || '',
                youtube: store.socials?.youtube || '',
            },
            pixKey: store.pixKey || '',
            pixAccountName: store.pixAccountName || '',
            pixBankName: store.pixBankName || '',
            pixAccountNumber: store.pixAccountNumber || '',
            deliveryOptions: store.deliveryOptions.map(opt => ({
                ...opt,
                feeType: opt.feeType || 'fixed',
                price: opt.price || 0,
            }))
        },
    });

    const onSubmit = (values: z.infer<typeof storeSettingsSchema>) => {
        // Here you would update the store data in your backend
        setStore(prev => ({
            ...prev,
            ...values,
            contactWhatsapp: values.contactWhatsapp?.replace(/\D/g, '') || '',
        }));
        toast({
            title: "Loja Atualizada!",
            description: "As configurações da sua loja foram salvas com sucesso.",
        });
        console.log("Valores salvos:", values);
    };
    
    const storeUrl = typeof window !== 'undefined' ? `${window.location.origin}/loja/${store.slug}` : '';

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(storeUrl);
        toast({ title: "URL Copiada!", description: "O endereço da sua loja foi copiado." });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                <StoreIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="font-headline text-4xl font-bold">Minha Loja</h1>
                <p className="text-muted-foreground">Configure as informações e a aparência da sua loja.</p>
              </div>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Endereço da sua Loja</CardTitle>
                    <CardDescription>Este é o link que você compartilhará com seus clientes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input value={storeUrl} readOnly className="bg-muted" />
                        <Button onClick={handleCopyUrl} variant="outline" className="w-full sm:w-auto">
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar
                        </Button>
                         <Button asChild className="w-full sm:w-auto">
                           <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visitar Loja
                           </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Gerais</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome da Loja</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Sua Loja Incrível" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>URL Amigável (slug)</FormLabel>
                                             <FormControl>
                                                <div className="relative">
                                                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                        .../loja/
                                                     </span>
                                                    <Input placeholder="sua-loja" {...field} className="pl-16" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descrição Curta</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Descreva o que sua loja vende em poucas palavras." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Endereço</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Rua Exemplo, 123, Bairro, Cidade - Estado" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="contactWhatsapp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>WhatsApp de Contato</FormLabel>
                                        <FormControl>
                                            <MaskedInput mask="(00) 00000-0000" placeholder="(11) 99999-9999" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <div className="space-y-2 pt-4 border-t">
                                <FormLabel>Redes Sociais (opcional)</FormLabel>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="socials.instagram"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                     <div className="relative">
                                                        <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="@seu-instagram" {...field} className="pl-9" />
                                                     </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="socials.tiktok"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                     <div className="relative">
                                                        <Icons.Tiktok className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="@seu-tiktok" {...field} className="pl-9" />
                                                     </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="socials.youtube"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                     <div className="relative">
                                                        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="/seu-canal" {...field} className="pl-9" />
                                                     </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                             </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                             <CardTitle>Identidade Visual</CardTitle>
                             <CardDescription>Faça o upload do logo e da imagem de capa da sua loja.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <Label>Logo da Loja</Label>
                                <div className="flex items-center gap-4">
                                    <Image src={store.logoUrl} alt="Logo" width={80} height={80} className="rounded-lg border bg-muted" data-ai-hint="company logo" />
                                    <Button type="button" variant="outline" onClick={() => alert('Funcionalidade de upload em breve!')}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Trocar Logo
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">Recomendado: 256x256 pixels.</p>
                            </div>
                             <div className="space-y-2">
                                <Label>Imagem de Capa</Label>
                                <div className="flex items-center gap-4">
                                    <Image src={store.coverUrl} alt="Capa" width={160} height={90} className="rounded-lg border aspect-video object-cover bg-muted" data-ai-hint="store cover" />
                                    <Button type="button" variant="outline" onClick={() => alert('Funcionalidade de upload em breve!')}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Trocar Capa
                                    </Button>
                                </div>
                                 <p className="text-xs text-muted-foreground">Recomendado: 1200x400 pixels.</p>
                            </div>
                             <div className="space-y-2">
                                <Label>QR Code Chave Pix</Label>
                                <div className="flex items-center gap-4">
                                    <Image src={store.pixQrCodeUrl || 'https://placehold.co/256x256.png'} alt="QR Code Pix" width={80} height={80} className="rounded-lg border bg-muted" data-ai-hint="pix qr code" />
                                    <Button type="button" variant="outline" onClick={() => alert('Funcionalidade de upload em breve!')}>
                                        <Upload className="mr-2 h-4 w-4" />
                                        Trocar QR Code
                                    </Button>
                                </div>
                                 <p className="text-xs text-muted-foreground">Recomendado: 256x256 pixels.</p>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Opções de Pagamento</CardTitle>
                            <CardDescription>Configure suas informações de Pix para receber pagamentos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField
                                control={form.control}
                                name="pixKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chave Pix</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CPF, CNPJ, e-mail, celular ou chave aleatória" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="pixAccountName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome da Conta</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nome completo do titular" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pixBankName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome do Banco</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Banco do Brasil" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pixAccountNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número da Conta</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: 12345-6" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Opções de Entrega</CardTitle>
                            <CardDescription>Configure como seus clientes podem receber os produtos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                           {form.getValues('deliveryOptions').map((option, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-4">
                                     <FormField
                                        control={form.control}
                                        name={`deliveryOptions.${index}.enabled`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between">
                                                <div className="space-y-0.5">
                                                    <FormLabel className="text-base">
                                                        {option.type === 'Entrega' ? 'Delivery (Entrega em domicílio)' : 'Retirada no Local'}
                                                    </FormLabel>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    {form.watch(`deliveryOptions.${index}.enabled`) && (
                                         <div className="space-y-4 pt-4 border-t">
                                            {option.type === 'Entrega' && (
                                                <div className="space-y-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`deliveryOptions.${index}.feeType`}
                                                        render={({ field }) => (
                                                            <FormItem className="space-y-3">
                                                              <FormLabel>Tipo de Taxa de Entrega</FormLabel>
                                                              <FormControl>
                                                                <RadioGroup
                                                                  onValueChange={field.onChange}
                                                                  defaultValue={field.value}
                                                                  className="flex flex-col sm:flex-row gap-4"
                                                                >
                                                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                      <RadioGroupItem value="fixed" />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                      Taxa Fixa
                                                                    </FormLabel>
                                                                  </FormItem>
                                                                  <FormItem className="flex items-center space-x-3 space-y-0">
                                                                    <FormControl>
                                                                      <RadioGroupItem value="variable" />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                      Variável / A combinar
                                                                    </FormLabel>
                                                                  </FormItem>
                                                                </RadioGroup>
                                                              </FormControl>
                                                              <FormMessage />
                                                            </FormItem>
                                                          )}
                                                    />

                                                    {form.watch(`deliveryOptions.${index}.feeType`) === 'fixed' && (
                                                        <FormField
                                                            control={form.control}
                                                            name={`deliveryOptions.${index}.price`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Valor da Taxa Fixa (R$)</FormLabel>
                                                                    <FormControl>
                                                                        <Input type="number" placeholder="7.00" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                             <FormField
                                                control={form.control}
                                                name={`deliveryOptions.${index}.details`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Informações Adicionais</FormLabel>
                                                        <FormControl>
                                                            <Textarea 
                                                                placeholder={option.type === 'Entrega' ? 'Ex: Entregas de seg à sex, das 14h às 18h. Bairros atendidos...' : 'Ex: Rua Exemplo, 123. Retiradas das 9h às 17h.'}
                                                                {...field} 
                                                             />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                         </div>
                                    )}
                                </div>
                           ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

    