"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockRegister } from "@/lib/mockAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registerSchema = z.object({
    name: z.string().min(3, "Mínimo 3 caracteres"),
    email: z.string().min(1, "Email é obrigatório").regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Mínimo 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        
        try {
            const result = await mockRegister(data.name, data.email, data.password);
            if (result.success) {
                setSuccessMessage(result.message);
                setTimeout(() => {
                    router.push("/");
                }, 1500);
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
            <h1 className="text-2xl font-bold text-center text-gray-800">Cadastro</h1>
            <p className="text-muted-foreground mt-2 text-center">
                Crie sua conta
            </p>
            
            {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 text-center">❌ {errorMessage}</p>
                </div>
            )}
            
            {successMessage && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600 text-center">✅ {successMessage}</p>
                </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nome</Label>
                        <Input 
                            {...register("name")} 
                            type="text" 
                            placeholder="João Silva" 
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
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
                            autoCapitalize="off"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                        />
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirmar Senha</Label>
                        <Input 
                            {...register("confirmPassword")} 
                            type="password" 
                            placeholder="******" 
                            autoComplete="off"
                            autoCapitalize="off"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                        />
                        {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full p-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md mt-6 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "🔄 Criando conta..." : "🚀 Criar Conta"}
                </Button>
                
                <p className="text-sm text-center text-gray-500 mt-4">
                    Já tem uma conta? {' '}
                    <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">Fazer login</Link>
                </p>
            </form>
        </div>
    </div>
);
}