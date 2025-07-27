
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product, CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { ShoppingCart, X } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
    setOpen(false); 
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border/50 group">
        <DialogTrigger asChild>
            <div className="aspect-video relative overflow-hidden cursor-pointer">
                <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint="product image"
                />
            </div>
        </DialogTrigger>
        <CardHeader className="p-4 flex-grow">
            <DialogTrigger asChild>
                <CardTitle className="font-headline text-lg mb-1 cursor-pointer hover:text-primary">{product.name}</CardTitle>
            </DialogTrigger>
            <CardDescription className="text-sm line-clamp-2 text-muted-foreground">{product.description}</CardDescription>
        </CardHeader>
        <CardFooter className="p-4 flex justify-between items-center mt-auto">
            <p className="text-2xl font-bold font-headline text-primary">
            R$ {product.price.toFixed(2)}
            </p>
            <DialogTrigger asChild>
                <Button size="sm" disabled={product.stock === 0}>
                    {product.stock > 0 ? 'Comprar' : 'Indisponível' }
                </Button>
            </DialogTrigger>
        </CardFooter>
      </Card>

       <DialogContent className="sm:max-w-3xl grid-cols-1 md:grid-cols-2 grid p-0 gap-0 max-h-[90vh]">
          <div className="relative aspect-video md:aspect-auto">
            <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover md:rounded-l-lg"
                data-ai-hint="product image"
             />
          </div>
          <div className="flex flex-col">
            <DialogHeader className="p-6 pb-4 border-b">
                <DialogTitle className="font-headline text-2xl">{product.name}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">{product.description}</DialogDescription>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
               <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Detalhes</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Estoque: <span className="font-semibold">{product.stock} {product.unit}(s)</span></li>
                        <li>Vendido por: <span className="font-semibold">{product.unit}</span></li>
                    </ul>
               </div>
            </div>
            <DialogFooter className="p-6 bg-muted/50 mt-auto border-t">
                 <div className="flex justify-between items-center w-full gap-4">
                    <p className="text-3xl font-bold font-headline text-primary shrink-0">
                        R$ {product.price.toFixed(2)}
                    </p>
                    <Button size="lg" onClick={handleAddToCartClick} disabled={product.stock === 0} className="w-full">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {product.stock > 0 ? 'Adicionar ao carrinho' : 'Indisponível' }
                    </Button>
                 </div>
            </DialogFooter>
          </div>
        </DialogContent>
    </Dialog>
  );
}
