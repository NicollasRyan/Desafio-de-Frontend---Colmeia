export interface PaymentResult {
  success: boolean;
  status: 'processing' | 'paid' | 'failed' | 'expired';
  message: string;
  transactionId: string;
  processingTime: number;
}

export const simulatePayment = async (
  method: string, 
  amount: number
): Promise<PaymentResult> => {
  const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Delays diferentes por método
  const delays = {
    'pix': 2000,
    'credit': 3000,
    'debit': 1500,
    'boleto': 1000
  };
  
  const delay = delays[method as keyof typeof delays] || 2000;
  
  // 10% chance de falha
  const shouldFail = Math.random() < 0.1;
  
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          success: false,
          status: 'failed',
          message: 'Falha no processamento do pagamento. Tente novamente.',
          transactionId,
          processingTime: delay
        });
      } else {
        resolve({
          success: true,
          status: 'paid',
          message: 'Pagamento processado com sucesso!',
          transactionId,
          processingTime: delay
        });
      }
    }, delay);
  });
};

export const simulateProcessingSteps = async (
  method: string,
  onStatusUpdate: (status: string, message: string) => void
): Promise<PaymentResult> => {
  const steps = {
    'pix': [
      { status: 'Validando dados...', delay: 500 },
      { status: 'Gerando QR Code...', delay: 800 },
      { status: 'Aguardando pagamento...', delay: 1000 },
      { status: 'Confirmando pagamento...', delay: 700 }
    ],
    'credit': [
      { status: 'Validando cartão...', delay: 800 },
      { status: 'Processando pagamento...', delay: 1200 },
      { status: 'Verificando limite...', delay: 600 },
      { status: 'Finalizando transação...', delay: 400 }
    ],
    'debit': [
      { status: 'Validando cartão...', delay: 600 },
      { status: 'Processando débito...', delay: 800 },
      { status: 'Verificando saldo...', delay: 400 },
      { status: 'Finalizando transação...', delay: 300 }
    ],
    'boleto': [
      { status: 'Gerando boleto...', delay: 400 },
      { status: 'Validando dados...', delay: 300 },
      { status: 'Finalizando...', delay: 300 }
    ]
  };

  const methodSteps = steps[method as keyof typeof steps] || steps.credit;
  
  for (const step of methodSteps) {
    onStatusUpdate('processing', step.status);
    await new Promise(resolve => setTimeout(resolve, step.delay));
  }
  
  return simulatePayment(method, 0);
};
