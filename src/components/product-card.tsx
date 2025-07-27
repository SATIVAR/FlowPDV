
'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
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
} from '@/components/ui/dialog';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleAddToCart = () => {
    // Mock add to cart logic
    toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao seu carrinho.`,
    })
    setOpen(false); // Close modal on add
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50">
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

       <DialogContent className="sm:max-w-3xl grid-cols-1 md:grid-cols-2 grid p-0">
          <div className="relative aspect-square md:aspect-auto h-64 md:h-full">
            <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover rounded-l-lg"
                data-ai-hint="product image"
             />
          </div>
          <div className="flex flex-col">
            <DialogHeader className="p-6">
                <DialogTitle className="font-headline text-2xl">{product.name}</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">{product.description}</DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto px-6 space-y-4">
               {/* Could add more details here in the future */}
                <p>Estoque: {product.stock} {product.unit}(s)</p>
            </div>
            <DialogFooter className="p-6 bg-muted/50 mt-auto">
                 <div className="flex justify-between items-center w-full">
                    <p className="text-3xl font-bold font-headline text-primary">
                        R$ {product.price.toFixed(2)}
                    </p>
                    <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
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
