
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart, Users, DollarSign, ShoppingBag, ArrowUp, ArrowDown, PieChart as PieChartIcon, Calendar, Trophy } from "lucide-react";
import { orders, products, categories, users } from '@/lib/data';
import { Area, AreaChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format, subDays, getMonth, getYear, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, subYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

const generateMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
        const date = subMonths(now, i);
        options.push({
            value: format(date, 'yyyy-MM'),
            label: format(date, "MMMM 'de' yyyy", { locale: ptBR })
        });
    }
    return options;
};

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export default function RelatoriosPage() {
    const storeOrders = useMemo(() => orders.filter(o => o.storeId === '2'), []);
    const storeProducts = useMemo(() => products.filter(p => p.storeId === '2'), []);

    const [timeRange, setTimeRange] = useState('7d');
    const [topProductsFilter, setTopProductsFilter] = useState<'revenue' | 'quantity'>('revenue');
    const monthOptions = useMemo(() => generateMonthOptions(), []);
    const [comparisonPeriod, setComparisonPeriod] = useState(monthOptions[0].value);
    const [monthlyReportPeriod, setMonthlyReportPeriod] = useState(monthOptions[0].value);

    const mainReportData = useMemo(() => {
        const now = new Date();
        const daysToFilter = timeRange === '7d' ? 7 : timeRange === '15d' ? 15 : 30;
        const startDate = subDays(now, daysToFilter);

        const filteredOrders = storeOrders.filter(o => o.createdAt >= startDate);

        const revenue = filteredOrders.reduce((acc, order) => acc + order.total, 0);
        const salesCount = filteredOrders.length;
        const average = salesCount > 0 ? revenue / salesCount : 0;
        const customersCount = new Set(filteredOrders.map(o => o.userId)).size; 

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

        const productSales: { [key: string]: { name: string; quantity: number; revenue: number } } = {};
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.id]) {
                    productSales[item.id] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productSales[item.id].quantity += item.quantity;
                productSales[item.id].revenue += item.price * item.quantity;
            });
        });
        
        const topProductsData = Object.values(productSales)
            .sort((a, b) => topProductsFilter === 'revenue' ? b.revenue - a.revenue : b.quantity - a.quantity)
            .slice(0, 5);

        const categorySales: { [key: string]: number } = {};
        filteredOrders.forEach(order => {
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

        const customerRanking: { [key: string]: { name: string; totalSpent: number; orderCount: number; } } = {};
        filteredOrders.forEach(order => {
            if (order.userId) {
                if (!customerRanking[order.userId]) {
                    const customer = users.find(u => u.id === order.userId);
                    customerRanking[order.userId] = {
                        name: customer?.name || 'Cliente Avulso',
                        totalSpent: 0,
                        orderCount: 0
                    };
                }
                customerRanking[order.userId].totalSpent += order.total;
                customerRanking[order.userId].orderCount += 1;
            }
        });

        const topCustomersData = Object.values(customerRanking)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 5);


        return {
            totalRevenue: revenue,
            totalSales: salesCount,
            avgTicket: average,
            newCustomers: customersCount,
            salesByDay: salesByDayData,
            topProducts: topProductsData,
            salesByCategory: salesByCategoryData,
            topCustomers: topCustomersData
        };

    }, [timeRange, topProductsFilter, storeOrders, storeProducts]);

    const comparisonData = useMemo(() => {
        let currentPeriodRevenue = 0;
        let previousPeriodRevenue = 0;
        let currentLabel = '';
        let previousLabel = '';

        if (comparisonPeriod === 'last_year') {
            const currentYearStart = startOfYear(new Date());
            const currentYearEnd = endOfYear(new Date());
            const previousYearStart = startOfYear(subYears(new Date(), 1));
            const previousYearEnd = endOfYear(subYears(new Date(), 1));

            currentLabel = `Ano de ${getYear(new Date())}`;
            previousLabel = `Ano de ${getYear(previousYearStart)}`;

            storeOrders.forEach(order => {
                if (order.createdAt >= currentYearStart && order.createdAt <= currentYearEnd) {
                    currentPeriodRevenue += order.total;
                }
                if (order.createdAt >= previousYearStart && order.createdAt <= previousYearEnd) {
                    previousPeriodRevenue += order.total;
                }
            });
        } else {
            const [year, month] = comparisonPeriod.split('-').map(Number);
            const currentMonthDate = new Date(year, month - 1);
            
            const currentMonthStart = startOfMonth(currentMonthDate);
            const currentMonthEnd = endOfMonth(currentMonthDate);

            const previousMonthDate = subMonths(currentMonthDate, 1);
            const previousMonthStart = startOfMonth(previousMonthDate);
            const previousMonthEnd = endOfMonth(previousMonthDate);

            currentLabel = format(currentMonthDate, "MMMM 'de' yyyy", { locale: ptBR });
            previousLabel = format(previousMonthDate, "MMMM 'de' yyyy", { locale: ptBR });

            storeOrders.forEach(order => {
                 if (order.createdAt >= currentMonthStart && order.createdAt <= currentMonthEnd) {
                    currentPeriodRevenue += order.total;
                }
                if (order.createdAt >= previousMonthStart && order.createdAt <= previousMonthEnd) {
                    previousPeriodRevenue += order.total;
                }
            });
        }
        
        const difference = currentPeriodRevenue - previousPeriodRevenue;
        const percentageChange = previousPeriodRevenue > 0 ? (difference / previousPeriodRevenue) * 100 : currentPeriodRevenue > 0 ? 100 : 0;
        
        return {
            currentLabel,
            previousLabel,
            currentPeriodRevenue,
            previousPeriodRevenue,
            percentageChange,
        }

    }, [comparisonPeriod, storeOrders]);
    
    const monthlyProductData = useMemo(() => {
        const [year, month] = monthlyReportPeriod.split('-').map(Number);
        const selectedMonthDate = new Date(year, month - 1);
        const monthStart = startOfMonth(selectedMonthDate);
        const monthEnd = endOfMonth(selectedMonthDate);
        
        const monthlyOrders = storeOrders.filter(o => o.createdAt >= monthStart && o.createdAt <= monthEnd);
        
        const productStats: { [key: string]: { name: string; quantity: number; revenue: number; prices: number[] } } = {};

        monthlyOrders.forEach(order => {
            order.items.forEach(item => {
                if (!productStats[item.id]) {
                     productStats[item.id] = { name: item.name, quantity: 0, revenue: 0, prices: [] };
                }
                productStats[item.id].quantity += item.quantity;
                productStats[item.id].revenue += item.price * item.quantity;
                productStats[item.id].prices.push(item.price);
            });
        });

        return Object.values(productStats).map(p => ({
            ...p,
            avgPrice: p.prices.length > 0 ? p.prices.reduce((a, b) => a + b, 0) / p.prices.length : 0,
        })).sort((a, b) => b.revenue - a.revenue);

    }, [monthlyReportPeriod, storeOrders]);


    const chartConfig: ChartConfig = {
        Receita: {
            label: 'Receita',
            color: "hsl(var(--chart-1))",
        },
    };
    
     const categoryChartConfig = useMemo(() => {
        const config: ChartConfig = {};
        mainReportData.salesByCategory.forEach((item, index) => {
            config[item.name] = {
                label: item.name,
                color: COLORS[index % COLORS.length]
            }
        });
        return config;
    }, [mainReportData.salesByCategory]);

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
                        <SelectItem value="15d">Últimos 15 dias</SelectItem>
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
                        <div className="text-3xl font-bold font-headline">R$ {mainReportData.totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">+20.1% em relação ao período anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vendas</CardTitle>
                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-headline">{mainReportData.totalSales}</div>
                        <p className="text-xs text-muted-foreground">+10.5% em relação ao período anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
                        <BarChart className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-headline">R$ {mainReportData.avgTicket.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">-2.1% em relação ao período anterior</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-headline">+{mainReportData.newCustomers}</div>
                        <p className="text-xs text-muted-foreground">no período selecionado</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Visão Geral da Receita</CardTitle>
                        <CardDescription>Receita de vendas dos últimos {timeRange === '7d' ? '7' : timeRange === '15d' ? '15' : '30'} dias.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] w-full p-2">
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <AreaChart data={mainReportData.salesByDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
                                    data={mainReportData.salesByCategory}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    innerRadius={60}
                                    paddingAngle={5}
                                    labelLine={false}
                                >
                                    {mainReportData.salesByCategory.map((entry, index) => (
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
            
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                 <Card className="lg:col-span-3">
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Top 5 Produtos Mais Vendidos</CardTitle>
                            <CardDescription>Produtos com melhor desempenho no período.</CardDescription>
                        </div>
                        <Select value={topProductsFilter} onValueChange={(value) => setTopProductsFilter(value as any)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="revenue">Receita</SelectItem>
                                <SelectItem value="quantity">Quantidade</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produto</TableHead>
                                    <TableHead className="text-center">Quantidade</TableHead>
                                    <TableHead className="text-right">Receita</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mainReportData.topProducts.map(product => (
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
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            Top 5 Clientes
                        </CardTitle>
                        <CardDescription>Clientes que mais compraram no período.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="text-center">Pedidos</TableHead>
                                    <TableHead className="text-right">Total Gasto</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mainReportData.topCustomers.map((customer, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium flex items-center gap-2">
                                             <Avatar className="h-8 w-8">
                                                <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                             </Avatar>
                                            {customer.name}
                                        </TableCell>
                                        <TableCell className="text-center">{customer.orderCount}</TableCell>
                                        <TableCell className="text-right">R$ {customer.totalSpent.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <div>
                            <CardTitle>Desempenho Mensal de Produtos</CardTitle>
                            <CardDescription>Analise o desempenho de todos os produtos vendidos no mês.</CardDescription>
                        </div>
                        <Select value={monthlyReportPeriod} onValueChange={setMonthlyReportPeriod}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Selecione o mês" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Produto</TableHead>
                                    <TableHead>Qtd.</TableHead>
                                    <TableHead>Preço Médio</TableHead>
                                    <TableHead className="text-right">Receita Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {monthlyProductData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">Nenhuma venda neste mês.</TableCell>
                                    </TableRow>
                                ) : (
                                    monthlyProductData.map((product, index) => (
                                        <TableRow key={product.name}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Badge variant={index < 3 ? 'success' : 'default'} className="w-6 h-6 justify-center p-0">{index + 1}</Badge>
                                                {product.name}
                                            </TableCell>
                                            <TableCell>{product.quantity}</TableCell>
                                            <TableCell>R$ {product.avgPrice.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">R$ {product.revenue.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <div>
                        <CardTitle>Análise Comparativa</CardTitle>
                        <CardDescription>Compare o desempenho de diferentes períodos.</CardDescription>
                    </div>
                     <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Selecione o período de comparação" />
                        </SelectTrigger>
                        <SelectContent>
                            {monthOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                            ))}
                            <SelectItem value="last_year">Comparar Ano Passado</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
                    <div className="flex flex-col justify-between space-y-2">
                        <h3 className="text-lg font-medium text-muted-foreground">{comparisonData.currentLabel}</h3>
                        <p className="text-4xl font-bold font-headline">R$ {comparisonData.currentPeriodRevenue.toFixed(2)}</p>
                    </div>
                     <div className="flex flex-col justify-between space-y-2">
                        <h3 className="text-lg font-medium text-muted-foreground">vs. {comparisonData.previousLabel}</h3>
                        <p className="text-4xl font-bold font-headline text-muted-foreground">R$ {comparisonData.previousPeriodRevenue.toFixed(2)}</p>
                    </div>
                    <div className="md:col-span-2 flex items-center justify-center text-center p-4 bg-muted/50 rounded-lg">
                        <p className={cn(
                            "text-xl font-bold flex items-center gap-2",
                            comparisonData.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                            {comparisonData.percentageChange >= 0 ? <ArrowUp className="h-6 w-6" /> : <ArrowDown className="h-6 w-6" />}
                             {comparisonData.percentageChange.toFixed(2)}%
                        </p>
                    </div>
                </CardContent>
            </Card>
            </div>

        </div>
    );
}

    