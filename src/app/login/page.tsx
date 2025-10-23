"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockLogin } from "@/lib/mockAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const loginSchema = z.object({
    email: z.string().min(1, "Email é obrigatório").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        setErrorMessage("");
        
        try {
            const result = await mockLogin(data.email, data.password);
            if (result.success) {
                router.push("/");
            } else {
                setErrorMessage(result.message);
            }
        } catch (error) {
            setErrorMessage("Erro interno. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
                <p className="text-muted-foreground mt-2 text-center">
                    Entre com suas credenciais
                </p>
                
                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600 text-center">❌ {errorMessage}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                            <Input 
                                {...register("email")} 
                                type="email" 
                                placeholder="email@example.com" 
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                            />
                            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Senha</Label>
                            <Input 
                                {...register("password")} 
                                type="password" 
                                placeholder="******" 
                                autoComplete="off"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                            />
                            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                        </div>
                    </div>
                    
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-md mt-6 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "🔄 Entrando..." : "🚀 Entrar"}
                    </Button>
                    
                    <p className="text-sm text-center text-gray-500 mt-4">
                        Não tem uma conta? {' '}
                        <Link href="/register" className="text-blue-500 hover:text-blue-600 font-medium">Criar conta</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}