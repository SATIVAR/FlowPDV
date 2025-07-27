
'use client';

import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Mock add to cart logic
    toast({
        title: "Produto adicionado!",
        description: `${product.name} foi adicionado ao seu carrinho.`,
    })
  }

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/80 backdrop-blur-sm border-border/50">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          data-ai-hint="product image"
        />
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="font-headline text-lg mb-1">{product.name}</CardTitle>
        <CardDescription className="text-sm line-clamp-2 text-muted-foreground flex-grow">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center mt-auto">
        <p className="text-2xl font-bold font-headline text-primary">
          R$ {product.price.toFixed(2)}
        </p>
        <Button size="sm" onClick={handleAddToCart} disabled={product.stock === 0}>
           {product.stock > 0 ? (
             <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar
             </>
           ) : (
            'Indisponível'
           )}
        </Button>
      </CardFooter>
    </Card>
  );
}
