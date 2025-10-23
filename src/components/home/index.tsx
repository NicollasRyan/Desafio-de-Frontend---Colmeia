"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Header from "../Header";
import Container from "../Container";
import CardProduct from "../CardProduct";
import { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mockData";
import Footer from "../Footer";
import { ProductLoadingCard } from "../ui/loading-card";

export default function HomeComponent() {

    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setProducts(mockProducts);
            setIsLoading(false);
        }, 1500);
    }, [router]);

    return (
        <>
            <Header />
            <Container>
                <p className="text-2xl font-bold my-8">Explore Nossa Loja</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <ProductLoadingCard key={index} />
                        ))
                    ) : (
                        products.map((product) => (
                            <CardProduct key={product.id} id={product.id} name={product.name} description={product.description} price={product.price} image={product.image} category={product.category} stock={product.stock} />
                        ))
                    )}
                </div>
            </Container>
            <Footer />
        </>
    );
}