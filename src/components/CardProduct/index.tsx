import { Product } from "@/lib/types";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/cartContext";

export default function CardProduct({ id, name, description, price, image, category, stock }: Product) {

    const { addToCart, isInCart } = useCart();
    const inCart = isInCart(id);

    const handleAddToCart = () => {
        addToCart({
            id,
            name,
            price,
            image,
            description,
            category,
            stock
        });
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <img src={image} alt={name} className="w-full h-40 object-cover rounded-lg mb-3" />

            <div className="space-y-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{name}</h3>
                <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                    {category}
                </span>
                <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            </div>

            <div className="flex justify-between items-center mb-3">
                <span className="text-xl font-bold text-gray-900">R$ {price.toFixed(2)}</span>
                <span className="text-sm text-gray-500">
                    {stock > 0 ? `${stock} em estoque` : 'Sem estoque'}
                </span>
            </div>

            <div className="pt-2 mt-2 border-t border-gray-300">
                <Button className="w-full" disabled={stock === 0} onClick={handleAddToCart}>
                    Adicionar ao carrinho <ShoppingCart className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}