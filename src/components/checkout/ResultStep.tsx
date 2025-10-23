"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cartContext";

interface ResultStepProps {
  paymentResult: any;
  orderData: any;
}

export function ResultStep({ paymentResult, orderData }: ResultStepProps) {
  const router = useRouter();
  const { clearCart } = useCart();

  const handleNewPurchase = () => {
    clearCart();
    router.push('/');
  };

  const isSuccess = paymentResult?.success;

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex justify-center mb-8">
        {isSuccess ? (
          <div className="rounded-full h-24 w-24 bg-green-500 flex items-center justify-center">
            <span className="text-white text-4xl">✓</span>
          </div>
        ) : (
          <div className="rounded-full h-24 w-24 bg-red-500 flex items-center justify-center">
            <span className="text-white text-4xl">✗</span>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${
          isSuccess ? 'text-green-600' : 'text-red-600'
        }`}>
          {isSuccess ? '🎉 Pagamento Aprovado!' : '❌ Pagamento Rejeitado'}
        </h2>
        <p className="text-gray-600 text-lg">
          {isSuccess 
            ? 'Sua compra foi processada com sucesso!' 
            : 'Não foi possível processar seu pagamento.'
          }
        </p>
      </div>

      <div className={`p-6 rounded-lg mb-8 ${
        isSuccess 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <p className={`font-semibold text-lg ${
          isSuccess ? 'text-green-800' : 'text-red-800'
        }`}>
          {paymentResult?.message}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          📋 Detalhes do Pedido
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">ID da Transação:</span>
            <span className="font-medium font-mono text-sm">
              {paymentResult?.transactionId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Cliente:</span>
            <span className="font-medium">{orderData.customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{orderData.customer.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Método de Pagamento:</span>
            <span className="font-medium">
              {orderData.payment.method === 'pix' ? 'PIX' :
               orderData.payment.method === 'boleto' ? 'Boleto' :
               orderData.payment.method === 'credit' ? 'Cartão de Crédito' :
               orderData.payment.method === 'current-card' ? 'Cartão de Crédito' :
               'Cartão de Crédito'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Itens:</span>
            <span className="font-medium">{orderData.items.length} produto(s)</span>
          </div>
          <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-bold">
            <span className="text-gray-800">Total:</span>
            <span className="text-green-600">
              R$ {orderData.total.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
        </div>
      </div>

      {isSuccess ? (
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📧 Próximos Passos
          </h3>
          <p className="text-blue-700 text-sm">
            Você receberá um email de confirmação com os detalhes do seu pedido. 
            O produto será enviado para o endereço informado.
          </p>
        </div>
      ) : (
        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            🔄 O que fazer agora?
          </h3>
          <p className="text-yellow-700 text-sm">
            Verifique os dados do seu cartão ou tente outro método de pagamento. 
            Se o problema persistir, entre em contato conosco.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {isSuccess ? (
          <>
            <Button
              onClick={handleNewPurchase}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 text-lg font-semibold"
            >
              🛒 Fazer Nova Compra
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 text-lg font-semibold"
            >
              🔄 Tentar Novamente
            </Button>
            <Button
              onClick={handleNewPurchase}
              variant="outline"
              className="w-full py-3 text-lg font-semibold"
            >
              🛒 Voltar às Compras
            </Button>
          </>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>
          Em caso de dúvidas, entre em contato conosco através do email: 
          <span className="font-medium text-blue-600"> suporte@loja.com</span>
        </p>
      </div>
    </div>
  );
}
