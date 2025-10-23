"use client";

import Container from "@/components/Container";
import Header from "@/components/Header";
import { StepsIndicator } from "@/components/ui/steps-indicator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isAuthenticated } from "@/lib/mockAuth";
import { CustomerDataStep } from "@/components/checkout/CustomerDataStep";
import { PaymentMethodStep } from "@/components/checkout/PaymentMethodStep";
import { ReviewStep } from "@/components/checkout/ReviewStep";
import { ProcessingStep } from "@/components/checkout/ProcessingStep";
import { ResultStep } from "@/components/checkout/ResultStep";

export default function Checkout() {
    const [currentStep, setCurrentStep] = useState('dados');
    const [checkoutData, setCheckoutData] = useState({
        customerData: null,
        paymentMethod: null,
        reviewData: null,
        orderData: null,
        paymentResult: null
    });

    const router = useRouter();
    useEffect(() => {
        const checkAuth = isAuthenticated();
        if (!checkAuth) {
            router.push('/login');
        }
    }, [router]);

    const steps = [
        {
            id: 'dados',
            title: 'Dados',
            description: 'Informações do comprador',
            status: (currentStep === 'dados' ? 'current' : 
                   ['payment', 'review', 'processing', 'result'].includes(currentStep) ? 'completed' : 'pending') as 'current' | 'completed' | 'pending'
        },
        {
            id: 'payment',
            title: 'Pagamento',
            description: 'Método de pagamento',
            status: (currentStep === 'payment' ? 'current' : 
                   ['review', 'processing', 'result'].includes(currentStep) ? 'completed' : 'pending') as 'current' | 'completed' | 'pending'
        },
        {
            id: 'review',
            title: 'Revisão',
            description: 'Confirmação final',
            status: (currentStep === 'review' ? 'current' : 
                   ['processing', 'result'].includes(currentStep) ? 'completed' : 'pending') as 'current' | 'completed' | 'pending'
        },
        {
            id: 'processing',
            title: 'Processando',
            description: 'Aguardando pagamento',
            status: (currentStep === 'processing' ? 'current' : 
                   currentStep === 'result' ? 'completed' : 'pending') as 'current' | 'completed' | 'pending'
        },
        {
            id: 'result',
            title: 'Resultado',
            description: 'Finalização',
            status: (currentStep === 'result' ? 'current' : 'pending') as 'current' | 'completed' | 'pending'
        }
    ];

    const handleNextStep = (stepData: any) => {
        setCheckoutData(prev => ({ ...prev, ...stepData }));
        
        const stepOrder = ['dados', 'payment', 'review', 'processing', 'result'];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        }
    };

    const handlePrevStep = () => {
        const stepOrder = ['dados', 'payment', 'review', 'processing', 'result'];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(stepOrder[currentIndex - 1]);
        }
    };


    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'dados':
                return <CustomerDataStep onNext={handleNextStep} />;
            case 'payment':
                return <PaymentMethodStep onNext={handleNextStep} onPrev={handlePrevStep} />;
            case 'review':
                return <ReviewStep 
                    onNext={handleNextStep} 
                    onPrev={handlePrevStep}
                    customerData={checkoutData.customerData}
                    paymentMethod={checkoutData.paymentMethod}
                />;
            case 'processing':
                return <ProcessingStep 
                    onNext={handleNextStep}
                    paymentMethod={checkoutData.paymentMethod}
                    orderData={checkoutData.orderData}
                />;
            case 'result':
                return <ResultStep 
                    paymentResult={checkoutData.paymentResult}
                    orderData={checkoutData.orderData}
                />;
            default:
                return <CustomerDataStep onNext={handleNextStep} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Header />
            <Container>
                {currentStep !== 'result' && (
                    <div className="mb-6">
                        <Button
                            variant="ghost"
                            onClick={() => router.push('/cart')}
                            className="my-4 p-0 text-lg h-auto hover:bg-transparent"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar ao carrinho
                        </Button>
                    </div>
                )}

                {currentStep !== 'result' && (
                    <div className="mb-8">
                        <StepsIndicator steps={steps} currentStep={currentStep} />
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    {renderCurrentStep()}
                </div>
            </Container>
        </div>
    );
}
