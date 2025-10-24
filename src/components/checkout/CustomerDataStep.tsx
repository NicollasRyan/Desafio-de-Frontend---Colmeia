"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/mockAuth";

// Zod schema for customer data validation
const customerDataSchema = z.object({
  name: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string()
    .email("Email inválido")
    .min(1, "Email é obrigatório"),
  phone: z.string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato de telefone inválido"),
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "Formato de CPF inválido"),
  address: z.string()
    .min(5, "Endereço deve ter pelo menos 5 caracteres")
    .max(200, "Endereço deve ter no máximo 200 caracteres"),
  city: z.string()
    .min(2, "Cidade deve ter pelo menos 2 caracteres")
    .max(100, "Cidade deve ter no máximo 100 caracteres"),
  state: z.string()
    .length(2, "Estado deve ter exatamente 2 caracteres")
    .regex(/^[A-Z]{2}$/, "Estado deve conter apenas letras maiúsculas"),
  zipCode: z.string()
    .regex(/^\d{5}-\d{3}$/, "Formato de CEP inválido")
});

type CustomerDataForm = z.infer<typeof customerDataSchema>;

interface CustomerDataStepProps {
  onNext: (data: any) => void;
}

export function CustomerDataStep({ onNext }: CustomerDataStepProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<CustomerDataForm>({
    resolver: zodResolver(customerDataSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setValue('name', currentUser.name);
      setValue('email', currentUser.email);
    }
  }, [setValue]);

  const onSubmit = (data: CustomerDataForm) => {
    onNext({ customerData: data });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setValue('phone', formatted);
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatZipCode(e.target.value);
    setValue('zipCode', formatted);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('state', e.target.value.toUpperCase());
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-700">
              Nome Completo *
            </Label>
            <Input
              type="text"
              {...register('name')}
              className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
              placeholder="João Silva"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Email *
            </Label>
            <Input
              type="email"
              {...register('email')}
              className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="joao@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Telefone *
            </Label>
            <Input
              type="text"
              maxLength={15}
              {...register('phone')}
              onChange={handlePhoneChange}
              className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="(11) 99999-9999"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              CPF *
            </Label>
            <Input
              type="text"
              maxLength={14}
              {...register('cpf')}
              onChange={handleCPFChange}
              className={`mt-1 ${errors.cpf ? 'border-red-500' : ''}`}
              placeholder="000.000.000-00"
            />
            {errors.cpf && (
              <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Label className="text-sm font-medium text-gray-700">
              Endereço *
            </Label>
            <Input
              type="text"
              {...register('address')}
              className={`mt-1 ${errors.address ? 'border-red-500' : ''}`}
              placeholder="Rua das Flores, 123"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Cidade *
            </Label>
            <Input
              type="text"
              {...register('city')}
              className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
              placeholder="São Paulo"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              Estado *
            </Label>
            <Input
              type="text"
              maxLength={2}
              {...register('state')}
              onChange={handleStateChange}
              className={`mt-1 ${errors.state ? 'border-red-500' : ''}`}
              placeholder="SP"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">
              CEP *
            </Label>
            <Input
              type="text"
              maxLength={9}
              {...register('zipCode')}
              onChange={handleZipCodeChange}
              className={`mt-1 ${errors.zipCode ? 'border-red-500' : ''}`}
              placeholder="00000-000"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
            )}
          </div>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r w-full from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processando...' : 'Continuar para Pagamento →'}
          </Button>
        </div>
      </form>
    </div>
  );
}
