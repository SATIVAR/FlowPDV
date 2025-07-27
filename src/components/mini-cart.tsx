
'use client';

import { useState, useMemo, type Dispatch } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import type { CartItem, Store } from '@/lib/types';
import { cn } from '@/lib/utils';

type CartAction = 
    | { type: 'ADD_ITEM'; payload: { product: any; quantity: number } }
    | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
    | { type: 'REMOVE_ITEM'; payload: { productId: string } }
    | { type: 'CLEAR_CART' };

interface MiniCartProps {
    cartItems: CartItem[];
    store: Store;
    dispatch: Dispatch<CartAction>;
    onFinalizeOrder: (cart: CartItem[], total: number, deliveryOption: 'delivery' | 'pickup', observations: string) => void;
}

export function MiniCart({ cartItems, store, dispatch, onFinalizeOrder }: MiniCartProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'pickup'>('pickup');
    const [observations, setObservations] = useState('');
    const [cartStep, setCartStep] = useState<'cart' | 'checkout' | 'success'>('cart');
    
    const deliveryFeeOption = store.deliveryOptions.find(opt => opt.type === 'Entrega' && opt.enabled);
    const pickupOption = store.deliveryOptions.find(opt => opt.type === 'Retirada' && opt.enabled);
    const deliveryFee = deliveryOption && deliveryOption.price ? deliveryOption.price : 0;
    
    const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);
    const total = useMemo(() => subtotal + (deliveryOption === 'delivery' ? deliveryFee : 0), [subtotal, deliveryOption, deliveryFee]);

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    };

    const handleCheckout = () => {
        setCartStep('checkout');
    }
    
    const handleConfirmOrder = () => {
        onFinalizeOrder(cartItems, total, deliveryOption, observations);
        setCartStep('success');
    }
    
    const handleCloseAndReset = () => {
        setIsOpen(false);
        setTimeout(() => {
            setCartStep('cart');
            setObservations('');
            setDeliveryOption('pickup');
        }, 300); // Wait for closing animation
    }

    return (
        <AnimatePresence>
            {/* Cart Bubble */}
            {!isOpen && itemCount > 0 && (
                <motion.div
                    initial={{ scale: 0, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="fixed bottom-6 right-6 z-50"
                >
                    <Button 
                        size="lg" 
                        className="rounded-full w-16 h-16 shadow-lg flex items-center justify-center relative"
                        onClick={() => setIsOpen(true)}
                    >
                        <ShoppingCart className="h-7 w-7" />
                        <Badge variant="destructive" className="absolute -top-1 -right-1 rounded-full px-2.5 py-1 text-sm">
                            {itemCount}
                        </Badge>
                    </Button>
                </motion.div>
            )}

            {/* Cart Modal */}
            {isOpen && (
                 <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 z-50"
                    onClick={handleCloseAndReset}
                />
            )}
            {isOpen && (
                <motion.div
                     initial={{ y: "100%" }}
                     animate={{ y: "0%" }}
                     exit={{ y: "100%" }}
                     transition={{ type: "spring", stiffness: 400, damping: 40 }}
                     className="fixed bottom-0 right-0 z-50 w-full max-w-md h-[90vh] "
                >
                    <Card className="h-full flex flex-col rounded-b-none shadow-2xl">
                        <CardHeader className="flex flex-row items-center justify-between">
                             <AnimatePresence mode="wait">
                                <motion.div
                                    key={cartStep}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1"
                                >
                                    <CardTitle>
                                        {cartStep === 'cart' && 'Seu Carrinho'}
                                        {cartStep === 'checkout' && 'Finalizar Pedido'}
                                        {cartStep === 'success' && 'Pedido Enviado!'}
                                    </CardTitle>
                                     <CardDescription>
                                        {cartStep === 'cart' && `Você tem ${itemCount} item(ns) no carrinho.`}
                                        {cartStep === 'checkout' && `Confirme os detalhes abaixo.`}
                                        {cartStep === 'success' && `Seu pedido foi recebido com sucesso.`}
                                    </CardDescription>
                                </motion.div>
                            </AnimatePresence>
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleCloseAndReset}>
                                <X className="h-5 w-5" />
                            </Button>
                        </CardHeader>
                        
                        <div className="flex-grow overflow-hidden">
                             <AnimatePresence mode="wait">
                                 <motion.div
                                    key={cartStep}
                                    initial={{ opacity: 0, x: -50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 50 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="h-full"
                                >
                                {cartStep === 'cart' && (
                                     <ScrollArea className="h-full px-6">
                                        <div className="space-y-4 pb-6">
                                            {cartItems.map(item => (
                                                <div key={item.id} className="flex items-start gap-4">
                                                    <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint="product image" />
                                                    <div className="flex-1">
                                                        <p className="font-semibold">{item.name}</p>
                                                        <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)}</p>
                                                         <div className="flex items-center gap-2 mt-2">
                                                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="font-bold w-6 text-center">{item.quantity}</span>
                                                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <p className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                                {cartStep === 'checkout' && (
                                     <ScrollArea className="h-full px-6">
                                        <div className="space-y-6">
                                            <div>
                                                <Label className="text-base font-semibold">Resumo do Pedido</Label>
                                                {cartItems.map(item => (
                                                    <div key={item.id} className="flex justify-between items-center text-sm mt-2">
                                                        <p className="text-muted-foreground">{item.quantity}x {item.name}</p>
                                                        <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <RadioGroup defaultValue={deliveryOption} onValueChange={(val: 'delivery' | 'pickup') => setDeliveryOption(val)}>
                                                 <Label className="text-base font-semibold">Opção de Entrega</Label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {pickupOption && (
                                                        <Label className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer", deliveryOption === 'pickup' && 'border-primary')}>
                                                            <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                                                            <p className="font-semibold">Retirar no Local</p>
                                                            <p className="text-xs text-muted-foreground text-center">{pickupOption.details}</p>
                                                        </Label>
                                                    )}
                                                     {deliveryFeeOption && (
                                                        <Label className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer", deliveryOption === 'delivery' && 'border-primary')}>
                                                            <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                                                            <p className="font-semibold">Delivery</p>
                                                             <p className="text-xs text-muted-foreground text-center">{deliveryFeeOption.details}</p>
                                                        </Label>
                                                     )}
                                                </div>
                                            </RadioGroup>
                                            <div>
                                                <Label htmlFor="observations" className="text-base font-semibold">Observações</Label>
                                                <Textarea
                                                    id="observations"
                                                    placeholder="Alguma instrução especial para o seu pedido?"
                                                    value={observations}
                                                    onChange={(e) => setObservations(e.target.value)}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>
                                    </ScrollArea>
                                )}
                                 {cartStep === 'success' && (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                        <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{type: 'spring', delay: 0.2}}>
                                            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold">Obrigado!</h3>
                                        <p className="text-muted-foreground">Seu pedido foi enviado para a loja. Você receberá atualizações em breve.</p>
                                         <Button className="mt-6 w-full" onClick={handleCloseAndReset}>Voltar para a Loja</Button>
                                    </div>
                                )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {cartStep !== 'success' && (
                            <CardFooter className="flex-col items-stretch space-y-4 pt-4 border-t">
                                <div className="flex justify-between font-medium">
                                    <p>Subtotal</p>
                                    <p>R$ {subtotal.toFixed(2)}</p>
                                </div>
                                {deliveryOption === 'delivery' && (
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <p>Taxa de Entrega</p>
                                    <p>R$ {deliveryFee.toFixed(2)}</p>
                                </div>
                                )}
                                <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <p>Total</p>
                                    <p>R$ {total.toFixed(2)}</p>
                                </div>
                                
                                {cartStep === 'cart' ? (
                                    <Button size="lg" onClick={handleCheckout} disabled={itemCount === 0}>
                                        Continuar
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button size="lg" variant="outline" className="flex-1" onClick={() => setCartStep('cart')}>Voltar</Button>
                                        <Button size="lg" className="flex-1" onClick={handleConfirmOrder}>
                                            Finalizar Pedido
                                        </Button>
                                    </div>
                                )}
                            </CardFooter>
                        )}
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

