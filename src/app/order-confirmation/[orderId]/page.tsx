'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { orders } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="font-headline text-4xl font-bold">Order Not Found</h1>
        <p className="mt-4 text-muted-foreground">We couldn't find the order you're looking for.</p>
        <Button asChild className="mt-6">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="font-headline text-3xl">Thank You for Your Order!</CardTitle>
          <CardDescription>
            Your order has been placed successfully. Order ID: #{order.id.slice(-6)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2 rounded-md border p-4">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <p>{item.name} <span className="text-muted-foreground">x {item.quantity}</span></p>
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-medium">
                <p>Total</p>
                <p>${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Shipping To</h3>
            <div className="text-sm text-muted-foreground">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
          <div className="text-center pt-4">
            <Button asChild>
                <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
