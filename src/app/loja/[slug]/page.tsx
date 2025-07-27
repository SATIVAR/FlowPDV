
'use client';

import { useState, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { stores as initialStores, products as initialProducts, categories as initialCategories } from '@/lib/data';
import type { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { Button, buttonVariants } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Instagram, Youtube, Search } from 'lucide-react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function LojaPage() {
    const params = useParams();
    const { slug } = params;

    const store = useMemo(() => initialStores.find(s => s.slug === slug), [slug]);
    
    // Filter products and categories based on the current store
    const storeProducts = useMemo(() => initialProducts.filter(p => p.storeId === store?.id), [store]);
    const storeCategories = useMemo(() => {
        const productCategoryIds = new Set(storeProducts.map(p => p.categoryId));
        return [{ id: 'all', name: 'Todos' }, ...initialCategories.filter(c => productCategoryIds.has(c.id))];
    }, [storeProducts]);

    const [activeCategory, setActiveCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    if (!store) {
        return notFound();
    }

    const filteredProducts = storeProducts.filter(product => {
        const matchesCategory = activeCategory === 'all' || product.categoryId === activeCategory;
        const matchesSearch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex flex-col min-h-screen bg-muted/30 dark:bg-background">
           <main className="flex-grow container mx-auto px-4 py-8">
                <div className="relative h-48 md:h-64 w-full rounded-t-xl overflow-hidden">
                    <Image
                        src={store.coverUrl}
                        alt={`${store.name} cover image`}
                        fill
                        className="object-cover"
                        priority
                        data-ai-hint="store cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                </div>
                <Card className="w-full rounded-t-none rounded-b-xl mb-8 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 -mt-16 md:-mt-24 relative z-10 px-4">
                           <div className="flex items-end gap-4">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-background bg-muted relative overflow-hidden shadow-lg shrink-0">
                                    <Image
                                        src={store.logoUrl}
                                        alt={`${store.name} logo`}
                                        fill
                                        className="object-cover"
                                        data-ai-hint="company logo"
                                    />
                                </div>
                                <div className="pb-4">
                                    <h1 className="text-2xl md:text-4xl font-bold font-headline text-white drop-shadow-lg">{store.name}</h1>
                                    <p className="text-sm md:text-base text-gray-200 drop-shadow">{store.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pb-4 self-start md:self-end">
                                <ModeToggle />
                                <Button asChild variant="secondary" size="sm">
                                    <Link href={`/login-cliente?loja=${store.slug}`}>Login</Link>
                                </Button>
                                <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90">
                                    <Link href={`/register-customer?loja=${store.slug}`}>
                                      <span>Cadastre-se</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                     <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Sobre a Loja</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                {store.address && (
                                     <div className="flex items-start gap-3">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                        <p className="text-muted-foreground">{store.address}</p>
                                     </div>
                                )}
                                {store.contactWhatsapp && (
                                     <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <p className="text-muted-foreground">{store.contactWhatsapp}</p>
                                     </div>
                                )}
                            </CardContent>
                        </Card>
                        
                         {(store.socials?.instagram || store.socials?.tiktok || store.socials?.youtube) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Redes Sociais</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-start gap-4">
                                        {store.socials.instagram && (
                                            <a href={`https://instagram.com/${store.socials.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                                <Instagram className="h-6 w-6" />
                                            </a>
                                        )}
                                        {store.socials.tiktok && (
                                             <a href={`https://tiktok.com/${store.socials.tiktok}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                                <Icons.Tiktok className="h-6 w-6" />
                                             </a>
                                        )}
                                         {store.socials.youtube && (
                                             <a href={`https://youtube.com/${store.socials.youtube}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                                <Youtube className="h-6 w-6" />
                                             </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Categorias</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-1">
                                    {storeCategories.map(category => (
                                        <li key={category.id}>
                                            <button 
                                                onClick={() => setActiveCategory(category.id)}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                                    activeCategory === category.id 
                                                        ? "bg-primary/10 text-primary font-semibold" 
                                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                                )}
                                            >
                                                {category.name}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                     </aside>
                     <div className="lg:col-span-3">
                         <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Buscar produtos..." 
                                className="pl-10 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                         </div>

                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 animate-fade-in-up">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 text-muted-foreground bg-muted/50 rounded-lg">
                                <Search className="mx-auto h-10 w-10 mb-4" />
                                <h3 className="font-semibold text-lg text-foreground">Nenhum produto encontrado</h3>
                                <p className="text-sm">Tente ajustar sua busca ou filtro de categoria.</p>
                            </div>
                        )}
                     </div>
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

    