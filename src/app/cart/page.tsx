"use client";

import { useRouter } from 'next/navigation';
import { isAuthenticated } from "@/lib/mockAuth";
import { useEffect } from "react";
import Header from "@/components/Header";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCart } from '@/contexts/cartContext';
import CardCart from '@/components/CardCart';

export default function Cart() {
    const router = useRouter();
    const { cartItems, getTotalItems, getTotalPrice } = useCart();

    useEffect(() => {
        const checkAuth = isAuthenticated();
        if (!checkAuth) {
            router.push('/login');
        }
    }, [router]);

    return (
        <>
            <Header />
            <Container>
                <div className="my-6">
                    <Button 
                        variant="ghost" 
                        onClick={() => router.push('/')}
                        className="mb-4 p-0 text-lg h-auto hover:bg-transparent"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </Button>
                    
                    <h1 className="text-3xl font-bold mb-2">SEU CARRINHO</h1>
                    <p className="text-lg text-gray-600">
                        Total ({getTotalItems()} produtos) R$ {getTotalPrice().toFixed(2).replace('.', ',')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {cartItems.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-xl font-semibold mb-2">Seu carrinho está vazio</h3>
                                <p className="text-gray-600 mb-4">
                                    Adicione alguns produtos para começar suas compras
                                </p>
                                <Button onClick={() => router.push('/')}>
                                    Continuar Comprando
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <CardCart key={item.id} id={item.id} quantity={item.quantity} stock={item.stock} image={item.image} name={item.name} description={item.description} category={item.category} price={item.price} />
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>R$ {getTotalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Frete:</span>
                                    <span>R$ 0,00</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                                    <span>Total:</span>
                                    <span>R$ {getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                            <Button onClick={() => router.push('/checkout')} className="w-full" disabled={cartItems.length === 0}>
                                Finalizar Compra
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}