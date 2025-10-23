"use client";

import { useState, useEffect } from "react";
import { simulateProcessingSteps, PaymentResult } from "@/lib/paymentSimulator";

interface ProcessingStepProps {
  onNext: (data: any) => void;
  paymentMethod: any;
  orderData: any;
}

export function ProcessingStep({ onNext, paymentMethod, orderData }: ProcessingStepProps) {
  const [currentStatus, setCurrentStatus] = useState('Iniciando processamento...');
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [result, setResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const paymentResult = await simulateProcessingSteps(
          paymentMethod.method,
          (status: string, message: string) => {
            setCurrentStatus(message);
            setProgress(prev => Math.min(prev + 25, 90));
          }
        );

        setResult(paymentResult);
        setProgress(100);
        setCurrentStatus(paymentResult.success ? 'Pagamento aprovado!' : 'Pagamento rejeitado');
        setIsProcessing(false);

        setTimeout(() => {
          onNext({ 
            paymentResult,
            orderData: {
              ...orderData,
              transactionId: paymentResult.transactionId,
              status: paymentResult.status
            }
          });
        }, 2000);

      } catch (error) {
        setResult({
          success: false,
          status: 'failed',
          message: 'Erro interno no processamento',
          transactionId: `ERR_${Date.now()}`,
          processingTime: 0
        });
        setCurrentStatus('Erro no processamento');
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [paymentMethod.method, onNext, orderData]);

  const getStatusIcon = () => {
    if (isProcessing) {
      return (
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      );
    }
    
    if (result?.success) {
      return (
        <div className="rounded-full h-16 w-16 bg-green-500 flex items-center justify-center">
          <span className="text-white text-2xl">✓</span>
        </div>
      );
    }
    
    return (
      <div className="rounded-full h-16 w-16 bg-red-500 flex items-center justify-center">
        <span className="text-white text-2xl">✗</span>
      </div>
    );
  };

  const getStatusColor = () => {
    if (isProcessing) return 'text-blue-600';
    if (result?.success) return 'text-green-600';
    return 'text-red-600';
  };

  const getMethodDisplay = () => {
    switch (paymentMethod.method) {
      case 'pix':
        return 'PIX';
      case 'credit':
      case 'current-card':
        return 'Cartão de Crédito';
      case 'boleto':
        return 'Boleto';
      default:
        return 'Pagamento';
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ⏳ Processando Pagamento
        </h2>
        <p className="text-gray-600">
          Aguarde enquanto processamos seu pagamento via {getMethodDisplay()}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        {getStatusIcon()}
      </div>

      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              result?.success ? 'bg-green-500' : 
              result?.success === false ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{progress}% concluído</p>
      </div>

      <div className="mb-8">
        <p className={`text-lg font-semibold ${getStatusColor()}`}>
          {currentStatus}
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📋 Resumo do Pedido
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Cliente:</span>
            <span className="font-medium">{orderData.customer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium">{orderData.customer.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Itens:</span>
            <span className="font-medium">{orderData.items.length} produto(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span className="font-medium text-green-600">
              R$ {orderData.total.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}

      {result && (
        <div className={`p-4 rounded-lg ${
          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <p className={`font-semibold ${
            result.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {result.message}
          </p>
          {result.transactionId && (
            <p className="text-sm text-gray-600 mt-2">
              ID da transação: {result.transactionId}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
