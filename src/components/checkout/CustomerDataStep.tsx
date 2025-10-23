"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/mockAuth";

interface CustomerDataStepProps {
  onNext: (data: any) => void;
}

export function CustomerDataStep({ onNext }: CustomerDataStepProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email
      }));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ customerData: formData });
  };

  const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '');
    return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const v = value.replace(/\D/g, '');
    return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const formatZipCode = (value: string) => {
    const v = value.replace(/\D/g, '');
    return v.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📋 Dados do Comprador
        </h2>
        <p className="text-gray-600">
          Preencha suas informações para continuar com a compra
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome Completo *
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1"
              placeholder="João Silva"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1"
              placeholder="joao@email.com"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Telefone *
            </Label>
            <Input
              id="phone"
              type="text"
              required
              maxLength={15}
              value={formData.phone}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setFormData(prev => ({ ...prev, phone: formatted }));
              }}
              className="mt-1"
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
              CPF *
            </Label>
            <Input
              id="cpf"
              type="text"
              required
              maxLength={14}
              value={formData.cpf}
              onChange={(e) => {
                const formatted = formatCPF(e.target.value);
                setFormData(prev => ({ ...prev, cpf: formatted }));
              }}
              className="mt-1"
              placeholder="000.000.000-00"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Endereço *
            </Label>
            <Input
              id="address"
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="mt-1"
              placeholder="Rua das Flores, 123"
            />
          </div>

          <div>
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              Cidade *
            </Label>
            <Input
              id="city"
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              className="mt-1"
              placeholder="São Paulo"
            />
          </div>

          <div>
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              Estado *
            </Label>
            <Input
              id="state"
              type="text"
              required
              maxLength={2}
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value.toUpperCase() }))}
              className="mt-1"
              placeholder="SP"
            />
          </div>

          <div>
            <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
              CEP *
            </Label>
            <Input
              id="zipCode"
              type="text"
              required
              maxLength={9}
              value={formData.zipCode}
              onChange={(e) => {
                const formatted = formatZipCode(e.target.value);
                setFormData(prev => ({ ...prev, zipCode: formatted }));
              }}
              className="mt-1"
              placeholder="00000-000"
            />
          </div>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            className="bg-gradient-to-r w-full from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
          >
            Continuar para Pagamento →
          </Button>
        </div>
      </form>
    </div>
  );
}
