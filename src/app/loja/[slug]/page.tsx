
'use client';

import { useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { stores as initialStores, products as initialProducts, categories as initialCategories } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { PublicHeader } from '@/components/public-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, Info } from 'lucide-react';

export default function LojaPage() {
    const params = useParams();
    const { slug } = params;

    const store = useMemo(() => initialStores.find(s => s.slug === slug), [slug]);
    
    // Filter products and categories based on the current store
    const storeProducts = useMemo(() => initialProducts.filter(p => p.storeId === store?.id), [store]);
    const storeCategories = useMemo(() => {
        const productCategoryIds = new Set(storeProducts.map(p => p.categoryId));
        return initialCategories.filter(c => productCategoryIds.has(c.id));
    }, [storeProducts]);

    const [activeTab, setActiveTab] = useState('all');
    
    if (!store) {
        return notFound();
    }

    const filteredProducts = storeProducts.filter(product => {
        if (activeTab === 'all') return true;
        return product.categoryId === activeTab;
    });

    return (
        <div className="flex flex-col min-h-screen bg-muted/20 dark:bg-muted/50">
           <PublicHeader storeName={store.name} />
           <main className="flex-grow">
                <div className="relative">
                    <div className="h-48 md:h-64 lg:h-80 w-full relative">
                        <Image
                            src={store.coverUrl}
                            alt={`${store.name} cover image`}
                            fill
                            className="object-cover"
                            priority
                            data-ai-hint="store cover"
                        />
                         <div className="absolute inset-0 bg-black/30" />
                    </div>
                    <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-10">
                        <div className="flex items-end gap-4">
                            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-background bg-muted relative overflow-hidden shadow-lg">
                                <Image
                                    src={store.logoUrl}
                                    alt={`${store.name} logo`}
                                    fill
                                    className="object-cover"
                                    data-ai-hint="company logo"
                                />
                            </div>
                            <div className="pb-4">
                                <h1 className="text-2xl md:text-4xl font-bold font-headline text-background/90 drop-shadow-md">{store.name}</h1>
                                <p className="text-sm md:text-base text-background/80 drop-shadow">{store.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                     <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                            <TabsTrigger value="all">Todos</TabsTrigger>
                            {storeCategories.map(category => (
                                <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>

                    {filteredProducts.length > 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>Nenhum produto encontrado nesta categoria.</p>
                        </div>
                    )}
                   
                </div>
           </main>
            <footer className="bg-background border-t mt-auto">
                <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
                    <p>&copy; {new Date().getFullYear()} {store.name}. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
