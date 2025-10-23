
"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import Header from "../components/Header";
import Container from "../components/Container";
import CardProduct from "../components/CardProduct";
import { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mockData";
import Footer from "../components/Footer";
import { ProductLoadingCard } from "../components/ui/loading-card";

export default function Home() {
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
        <div className="text-2xl my-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            🛒 Nossos Produtos
          </h2>
          <p className="text-gray-500 text-lg">
            Descubra nossa seleção especial de produtos
          </p>
        </div>
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