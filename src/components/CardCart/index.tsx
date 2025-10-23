import { CartItem } from "@/contexts/cartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/cartContext";



export default function CardCart({ id, stock, image, name, description, category, price, quantity }: CartItem) {
    const { updateQuantity, removeFromCart } = useCart();

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= stock) {
            updateQuantity(id, newQuantity);
        }
    };

    const handleRemove = () => {
        removeFromCart(id);
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 mb-4">

            <div className="flex gap-4">
                <img
                    src={image}
                    alt={name}
                    className="w-20 h-20 object-cover rounded-lg"
                />

                <div className="flex-1">
                    <h3 className="font-semibold text-lg">{name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{description}</p>
                    <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full mb-2">
                        {category}
                    </span>
                    <p className="text-lg font-bold text-green-600">
                        R$ {price.toFixed(2)}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemove}
                            className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(quantity - 1)}
                            disabled={quantity <= 1}
                            className="w-8 h-8 p-0"
                        >
                            <Minus className="w-4 h-4" />
                        </Button>

                        <span className="w-8 text-center font-medium">
                            {quantity}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(quantity + 1)}
                            disabled={quantity >= stock}
                            className="w-8 h-8 p-0"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">restante: {stock - quantity}</p>
                    </div>



                    <div className="text-right">
                        <p className="text-sm text-gray-600">Subtotal:</p>
                        <p className="text-lg font-bold">
                            R$ {(price * quantity).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}