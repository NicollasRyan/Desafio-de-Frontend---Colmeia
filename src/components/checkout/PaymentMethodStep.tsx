"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/mockAuth";

interface PaymentMethodStepProps {
  onNext: (data: any) => void;
  onPrev: () => void;
}

export function PaymentMethodStep({ onNext, onPrev }: PaymentMethodStepProps) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [openAddCreditCard, setOpenAddCreditCard] = useState(false);
  const [savedCards, setSavedCards] = useState<any[]>([]);
  const [currentCard, setCurrentCard] = useState<any>(null);
  const [saveCard, setSaveCard] = useState(true);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'warning';
    message: string;
    show: boolean;
  }>({ type: 'success', message: '', show: false });

  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const userCardsKey = `savedCards_${currentUser.id}`;
      const saved = localStorage.getItem(userCardsKey);
      if (saved) {
        setSavedCards(JSON.parse(saved));
      }
    }
  }, []);

  const handleSubmit = () => {
    if (!selectedMethod) {
      showNotification('warning', 'Por favor, selecione um método de pagamento');
      return;
    }

    const isCardPayment = selectedMethod.includes('card') || 
                         selectedMethod.includes('saved-') || 
                         selectedMethod === 'credit';

    if (isCardPayment) {
      if (!currentCard && !savedCards.some(card => selectedMethod === `saved-${card.id}`)) {
        showNotification('warning', 'Por favor, adicione um cartão de crédito');
        return;
      }
    }

    onNext({ 
      paymentMethod: {
        method: selectedMethod,
        card: currentCard,
        savedCards: savedCards
      }
    });
  };

  const handleAddCard = (cardData: any) => {
    if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
      showNotification('error', 'Por favor, preencha todos os campos');
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      ...cardData,
      last4: cardData.number.slice(-4)
    };

    setCurrentCard(newCard);
    setOpenAddCreditCard(false);

    if (saveCard) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        const updatedCards = [...savedCards, newCard];
        setSavedCards(updatedCards);
        const userCardsKey = `savedCards_${currentUser.id}`;
        localStorage.setItem(userCardsKey, JSON.stringify(updatedCards));
        showNotification('success', 'Cartão adicionado e salvo com sucesso!');
      }
    } else {
      showNotification('success', 'Cartão adicionado com sucesso!');
    }
  };

  const handleCloseDialog = (open: boolean) => {
    setOpenAddCreditCard(open);
    if (!open) {
      setSaveCard(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          💳 Método de Pagamento
        </h2>
        <p className="text-gray-600">
          Escolha como deseja pagar sua compra
        </p>
      </div>

      {notification.show && (
        <div className="mb-6">
          <Alert className={`${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            {notification.type === 'success' && <CheckCircle className="h-4 w-4" />}
            {notification.type === 'error' && <XCircle className="h-4 w-4" />}
            {notification.type === 'warning' && <AlertCircle className="h-4 w-4" />}
            <AlertDescription className="ml-2">
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <RadioGroup
        value={selectedMethod}
        onValueChange={setSelectedMethod}
        className="space-y-4 mb-8"
      >
        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
          <RadioGroupItem value="pix" />
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💳</span>
            <div>
              <label className="text-lg font-medium text-gray-700 cursor-pointer">PIX</label>
              <p className="text-sm text-gray-500">Pagamento instantâneo</p>
            </div>
          </div>
        </div>

        {currentCard && !savedCards.some(savedCard => savedCard.last4 === currentCard.last4) && (
          <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
            <RadioGroupItem value="current-card" />
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💳</span>
              <div>
                <label className="text-lg font-medium text-gray-700 cursor-pointer">
                  Cartão terminado em {currentCard.last4}
                </label>
                <p className="text-sm text-gray-500">Cartão atual</p>
              </div>
            </div>
          </div>
        )}

        {savedCards.map(card => (
          <div key={card.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
            <RadioGroupItem value={`saved-${card.id}`} />
            <div className="flex items-center space-x-3">
              <span className="text-2xl">💳</span>
              <div>
                <label className="text-lg font-medium text-gray-700 cursor-pointer">
                  Cartão terminado em {card.last4}
                </label>
                <p className="text-sm text-gray-500">Cartão salvo</p>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
          <RadioGroupItem value="credit" onClick={() => setOpenAddCreditCard(true)} />
          <div className="flex items-center space-x-3">
            <span className="text-2xl">➕</span>
            <div>
              <label className="text-lg font-medium text-gray-700 cursor-pointer">
                Adicionar Cartão de Crédito
              </label>
              <p className="text-sm text-gray-500">Novo cartão</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer">
          <RadioGroupItem value="boleto" />
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🧾</span>
            <div>
              <label className="text-lg font-medium text-gray-700 cursor-pointer">Boleto</label>
              <p className="text-sm text-gray-500">Vencimento em 3 dias</p>
            </div>
          </div>
        </div>
      </RadioGroup>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrev}
          className="px-8 py-3 text-lg font-semibold"
        >
          ← Voltar
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 text-lg font-semibold"
        >
          Continuar para Revisão →
        </Button>
      </div>

      <AddCreditCardDialog 
        open={openAddCreditCard}
        onOpenChange={handleCloseDialog}
        onAddCard={handleAddCard}
        saveCard={saveCard}
        setSaveCard={setSaveCard}
      />
    </div>
  );
}

function AddCreditCardDialog({ open, onOpenChange, onAddCard, saveCard, setSaveCard }: any) {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ').substring(0, 19);
    } else {
      return v.substring(0, 16);
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 3);
  };

  const handleSubmit = () => {
    onAddCard(cardData);
    setCardData({ number: '', expiry: '', cvv: '', name: '' });
    setSaveCard(true);
  };

  const handleClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setCardData({ number: '', expiry: '', cvv: '', name: '' });
      setSaveCard(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-screen-md lg:max-w-screen-lg sm:max-w-[425px] xs:max-w-screen-xs">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="text-3xl mr-3">💳</span>
            Adicionar Cartão de Crédito
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <label className="text-base font-semibold text-gray-700 mb-2 block">Número do Cartão</label>
            <input
              type="text"
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
              value={cardData.number}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                setCardData({ ...cardData, number: formatted });
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-base font-semibold text-gray-700 mb-2 block">Validade</label>
              <input
                type="text"
                placeholder="MM/AA"
                maxLength={5}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
                value={cardData.expiry}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value);
                  setCardData({ ...cardData, expiry: formatted });
                }}
              />
            </div>
            <div>
              <label className="text-base font-semibold text-gray-700 mb-2 block">CVV</label>
              <input
                type="text"
                placeholder="123"
                maxLength={3}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
                value={cardData.cvv}
                onChange={(e) => {
                  const formatted = formatCVV(e.target.value);
                  setCardData({ ...cardData, cvv: formatted });
                }}
              />
            </div>
          </div>
          <div>
            <label className="text-base font-semibold text-gray-700 mb-2 block">Nome no Cartão</label>
            <input
              type="text"
              placeholder="Nome como está no cartão"
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
              value={cardData.name}
              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="w-5 h-5 text-blue-600 border-2 border-blue-300 rounded focus:ring-blue-500"
            />
            <label className="text-base font-medium text-gray-700 cursor-pointer">
              💾 Salvar cartão para futuras compras
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              onClick={() => handleClose(false)}
              variant="outline"
              className="flex-1 py-3 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all"
            >
              ❌ Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 py-3 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              ✅ Adicionar Cartão
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
