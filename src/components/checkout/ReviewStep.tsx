"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cartContext";

interface ReviewStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
  customerData: any;
  paymentMethod: any;
}

export function ReviewStep({ onNext, onPrev, customerData, paymentMethod }: ReviewStepProps) {
  const { cartItems, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  const handleConfirm = () => {
    onNext({ 
      confirmed: true,
      orderData: {
        customer: customerData,
        payment: paymentMethod,
        items: cartItems,
        total: totalPrice
      }
    });
  };

  const getPaymentMethodDisplay = () => {
    if (!paymentMethod) return 'Não selecionado';
    
    switch (paymentMethod.method) {
      case 'pix':
        return 'PIX - Pagamento instantâneo';
      case 'boleto':
        return 'Boleto - Vencimento em 3 dias';
      case 'current-card':
        return `Cartão terminado em ${paymentMethod.card?.last4}`;
      default:
        if (paymentMethod.method.startsWith('saved-')) {
          const cardId = paymentMethod.method.replace('saved-', '');
          const card = paymentMethod.savedCards.find((c: any) => c.id === cardId);
          return `Cartão salvo terminado em ${card?.last4}`;
        }
        return 'Cartão de crédito';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          📋 Revisão do Pedido
        </h2>
        <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">
          Confira todas as informações antes de finalizar sua compra
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="text-lg sm:text-xl mr-2">👤</span>
            Dados do Comprador
          </h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-gray-600">Nome:</span>
              <span className="font-medium break-words">{customerData?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium break-all">{customerData?.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-gray-600">Telefone:</span>
              <span className="font-medium">{customerData?.phone}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-gray-600">CPF:</span>
              <span className="font-medium">{customerData?.cpf}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-gray-600">Endereço:</span>
              <span className="font-medium break-words">{customerData?.address}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-gray-600">Cidade:</span>
              <span className="font-medium">{customerData?.city}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium">{customerData?.state}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-gray-600">CEP:</span>
              <span className="font-medium">{customerData?.zipCode}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <span className="text-lg sm:text-xl mr-2">💳</span>
            Método de Pagamento
          </h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
              <span className="text-gray-600">Método:</span>
              <span className="font-medium break-words">{getPaymentMethodDisplay()}</span>
            </div>
            {paymentMethod?.card && (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600">Nome no cartão:</span>
                  <span className="font-medium break-words">{paymentMethod.card.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-gray-600">Validade:</span>
                  <span className="font-medium">{paymentMethod.card.expiry}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 bg-gray-50 rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
          <span className="text-lg sm:text-xl mr-2">🛒</span>
          Itens do Pedido
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white rounded-lg border border-gray-200 gap-3 sm:gap-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 break-words">{item.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 break-words">{item.description}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Quantidade: {item.quantity}</p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-semibold text-base sm:text-lg text-green-600">
                  R$ {(item.price * item.quantity).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  R$ {item.price.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} cada
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-6 border border-blue-100">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
          <span className="text-lg sm:text-xl mr-2">💰</span>
          Resumo Financeiro
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">
              R$ {totalPrice.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm">
            <span className="text-gray-600">Frete:</span>
            <span className="font-medium text-green-600">Grátis</span>
          </div>
          <div className="border-t border-gray-300 pt-2 flex justify-between text-base sm:text-lg font-bold">
            <span className="text-gray-800">Total:</span>
            <span className="text-blue-600">
              R$ {totalPrice.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between pt-6 sm:pt-8">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold order-2 sm:order-1"
        >
          ← Voltar
        </Button>
        <Button
          onClick={handleConfirm}
          className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold order-1 sm:order-2"
        >
          <span className="hidden sm:inline">🚀 Confirmar e Finalizar Compra</span>
          <span className="sm:hidden">🚀 Finalizar Compra</span>
        </Button>
      </div>
    </div>
  );
}
