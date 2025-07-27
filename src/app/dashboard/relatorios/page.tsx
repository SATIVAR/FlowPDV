
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Users, DollarSign, ShoppingBag, ArrowUp, ArrowDown, PieChart as PieChartIcon } from "lucide-react";
import { orders, products, categories, users } from '@/lib/data';
import { Area, AreaChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function RelatoriosPage() {
    // Note: In a real app, this data would be fetched and filtered based on the logged-in user's store.
    // For this mock, we assume all data belongs to store '2'.
    const storeOrders = useMemo(() => orders.filter(o => o.storeId === '2'), []);
    const storeProducts = useMemo(() => products.filter(p => p.storeId === '2'), []);

    const [timeRange, setTimeRange] = useState('7d');

    const {
        totalRevenue,
        totalSales,
        avgTicket,
        newCustomers,
        salesByDay,
        topProducts,
        salesByCategory
    } = useMemo(() => {
        const now = new Date();
        const daysToFilter = timeRange === '7d' ? 7 : 30;
        const startDate = subDays(now, daysToFilter);

        const filteredOrders = storeOrders.filter(o => o.createdAt >= startDate);

        // KPI Calculations
        const revenue = filteredOrders.reduce((acc, order) => acc + order.total, 0);
        const salesCount = filteredOrders.length;
        const average = salesCount > 0 ? revenue / salesCount : 0;
        
        // This is a mock. In a real app, you'd check creation dates.
        const customersCount = new Set(filteredOrders.map(o => o.userId)).size; 

        // Sales by Day (for line chart)
        const dailySales: { [key: string]: number } = {};
        for (let i = 0; i < daysToFilter; i++) {
            const date = subDays(now, i);
            const dateString = format(date, 'dd/MM');
            dailySales[dateString] = 0;
        }

        filteredOrders.forEach(order => {
            const dateString = format(order.createdAt, 'dd/MM');
            if (dailySales.hasOwnProperty(dateString)) {
                dailySales[dateString] += order.total;
            }
        });

        const salesByDayData = Object.entries(dailySales)
            .map(([date, total]) => ({ date, "Receita": total }))
            .reverse();

        // Top Selling Products
        const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
        storeOrders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.id]) {
                    productSales[item.id] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productSales[item.id].quantity += item.quantity;
                productSales[item.id].revenue += item.price * item.quantity;
            });
        });
        
        const topProductsData = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Sales by Category
        const categorySales: { [key: string]: number } = {};
        storeOrders.forEach(order => {
            order.items.forEach(item => {
                const product = storeProducts.find(p => p.id === item.id);
                if (product && product.categoryId) {
                    const categoryName = categories.find(c => c.id === product.categoryId)?.name || 'Sem Categoria';
                    if (!categorySales[categoryName]) {
                        categorySales[categoryName] = 0;
                    }
                    categorySales[categoryName] += item.price * item.quantity;
                }
            });
        });
        
        const salesByCategoryData = Object.entries(categorySales)
            .map(([name, value]) => ({ name, value }))
            .sort((a,b) => b.value - a.value);


        return {
            totalRevenue: revenue,
            totalSales: salesCount,
            avgTicket: average,
            newCustomers: customersCount,
            salesByDay: salesByDayData,
            topProducts: topProductsData,
            salesByCategory: salesByCategoryData
        };

    }, [timeRange, storeOrders, storeProducts]);

    const chartConfig: ChartConfig = {
        Receita: {
            label: 'Receita',
            color: "hsl(var(--chart-1))",
        },
    };
    
     const categoryChartConfig = useMemo(() => {
        const config: ChartConfig = {};
        salesByCategory.forEach((item, index) => {
            config[item.name] = {
                label: item.name,
                color: COLORS[index % COLORS.length]
            }
        });
        return config;
    }, [salesByCategory]);

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-4xl font-bold">Relatórios</h1>
                    <p className="text-muted-foreground">Analise o desempenho da sua loja.</p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Últimos 7 dias</SelectItem>
                        <SelectItem value="30d">Últimos 30 dias</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-headline">R$ {totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">+20.1% em relação ao mês passado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vendas</CardTitle>
                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-headline">{totalSales}</div>
                        <p className="text-xs text-muted-foreground">+10.5% em relação ao mês passado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                        <BarChart className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-headline">R$ {avgTicket.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">-2.1% em relação ao mês passado</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-headline">+{newCustomers}</div>
                        <p className="text-xs text-muted-foreground">no período selecionado</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Visão Geral da Receita</CardTitle>
                        <CardDescription>Receita de vendas dos últimos {timeRange === '7d' ? '7' : '30'} dias.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full p-2">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <AreaChart data={salesByDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-Receita)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--color-Receita)" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <YAxis 
                                    tickFormatter={(value) => `R$${value}`}
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    width={80}
                                    fontSize={12}
                                 />
                                <Tooltip
                                    cursor={false}
                                    content={<ChartTooltipContent
                                        formatter={(value) => `R$ ${typeof value === 'number' ? value.toFixed(2) : '0.00'}`}
                                        indicator="dot"
                                    />}
                                />
                                <Area type="monotone" dataKey="Receita" stroke="var(--color-Receita)" strokeWidth={2} fillOpacity={1} fill="url(#colorReceita)" />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Vendas por Categoria</CardTitle>
                        <CardDescription>Distribuição da receita por categoria de produto.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full flex items-center justify-center p-2">
                         <ChartContainer config={categoryChartConfig} className="aspect-square h-full w-full">
                            <PieChart>
                                <Tooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel indicator="dot" formatter={(value) => `R$ ${typeof value === 'number' ? value.toFixed(2) : '0.00'}`} />}
                                />
                                <Pie
                                    data={salesByCategory}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={60}
                                    paddingAngle={5}
                                    labelLine={false}
                                >
                                    {salesByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                 <Legend content={({ payload }) => {
                                     return (
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-4">
                                            {payload?.map((entry, index) => (
                                                <div key={`item-${index}`} className="flex items-center gap-1.5">
                                                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                    <span className="text-xs text-muted-foreground">{entry.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                     )
                                 }}/>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Produtos Mais Vendidos</CardTitle>
                    <CardDescription>Os 5 produtos que mais geraram receita no período.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead className="text-center">Quantidade Vendida</TableHead>
                                <TableHead className="text-right">Receita Gerada</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topProducts.map(product => (
                                <TableRow key={product.name}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell className="text-center">{product.quantity}</TableCell>
                                    <TableCell className="text-right">R$ {product.revenue.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    );
}

    