import { LogOut, ShoppingCart, User } from "lucide-react";
import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { getCurrentUser, mockLogout } from "@/lib/mockAuth";
import { useCart } from "@/contexts/cartContext";
import Link from "next/link";

export default function Header() {
    const router = useRouter();
    const user = getCurrentUser();
    const { getTotalItems, clearCart } = useCart();
    const totalItems = getTotalItems();

    const handleLogout = () => {
        mockLogout();
        clearCart();
        router.push('/login');
    };

    return (
        <header className="bg-gray-100 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-black">🛍️ Checkout Mock</Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/cart')}
                            className="relative p-2 bg-transparent rounded-2xl hover:bg-gray-200"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {totalItems > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-sm py-2.5 px-2.5 rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1 -translate-y-1">
                                    {totalItems > 99 ? '99+' : totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-2 bg-transparent rounded-2xl hover:bg-gray-200">
                                    <User className="w-6 h-6" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>
                                    {user ? user.name : 'Visitante'}
                                </DropdownMenuLabel>
                                <DropdownMenuLabel className="font-normal text-sm text-muted-foreground">
                                    {user?.email}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user ? (
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="cursor-pointer text-red-600"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sair
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem
                                        onClick={() => router.push('/login')}
                                        className="cursor-pointer"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        Fazer Login
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}