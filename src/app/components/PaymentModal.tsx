import React, { useState } from 'react';
import { X, CreditCard, Building2, Smartphone, CheckCircle, XCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  phoneNumber: string;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  phoneNumber,
  onSuccess
}) => {
  const [paymentState, setPaymentState] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank' | 'digital'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');

  if (!isOpen) return null;

  const handlePayment = () => {
    setPaymentState('processing');
    
    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        setPaymentState('success');
        setTimeout(() => {
          onSuccess();
          resetModal();
        }, 2000);
      } else {
        setPaymentState('error');
      }
    }, 2000);
  };

  const resetModal = () => {
    setPaymentState('form');
    setSelectedMethod('card');
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setCardName('');
    onClose();
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="w-full max-w-md rounded-2xl shadow-xl" style={{ backgroundColor: '#FFFFFF' }}>
        {paymentState === 'form' && (
          <>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
              <h2 style={{ color: '#111827' }}>Complete Payment</h2>
              <button
                onClick={resetModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ backgroundColor: '#F7F8FA' }}
              >
                <X className="w-4 h-4" style={{ color: '#6B7280' }} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
                <p className="text-sm mb-1" style={{ color: '#6B7280' }}>Amount to pay</p>
                <p className="text-3xl" style={{ color: '#111827' }}>${amount.toFixed(2)}</p>
                <p className="text-sm mt-1" style={{ color: '#6B7280' }}>To: {phoneNumber}</p>
              </div>

              <div className="mb-6">
                <p className="mb-3" style={{ color: '#111827' }}>Payment Method</p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedMethod('card')}
                    className="p-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: selectedMethod === 'card' ? '#6C4CF1' : '#E5E7EB',
                      backgroundColor: selectedMethod === 'card' ? '#F5F3FF' : '#FFFFFF'
                    }}
                  >
                    <CreditCard className="w-6 h-6 mx-auto mb-2" style={{ color: selectedMethod === 'card' ? '#6C4CF1' : '#6B7280' }} />
                    <p className="text-xs" style={{ color: selectedMethod === 'card' ? '#6C4CF1' : '#6B7280' }}>Card</p>
                  </button>
                  <button
                    onClick={() => setSelectedMethod('bank')}
                    className="p-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: selectedMethod === 'bank' ? '#6C4CF1' : '#E5E7EB',
                      backgroundColor: selectedMethod === 'bank' ? '#F5F3FF' : '#FFFFFF'
                    }}
                  >
                    <Building2 className="w-6 h-6 mx-auto mb-2" style={{ color: selectedMethod === 'bank' ? '#6C4CF1' : '#6B7280' }} />
                    <p className="text-xs" style={{ color: selectedMethod === 'bank' ? '#6C4CF1' : '#6B7280' }}>Bank</p>
                  </button>
                  <button
                    onClick={() => setSelectedMethod('digital')}
                    className="p-4 rounded-xl border-2 transition-all"
                    style={{
                      borderColor: selectedMethod === 'digital' ? '#6C4CF1' : '#E5E7EB',
                      backgroundColor: selectedMethod === 'digital' ? '#F5F3FF' : '#FFFFFF'
                    }}
                  >
                    <Smartphone className="w-6 h-6 mx-auto mb-2" style={{ color: selectedMethod === 'digital' ? '#6C4CF1' : '#6B7280' }} />
                    <p className="text-xs" style={{ color: selectedMethod === 'digital' ? '#6C4CF1' : '#6B7280' }}>Digital</p>
                  </button>
                </div>
              </div>

              {selectedMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: '#6B7280' }}>Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value.slice(0, 19)))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2"
                      style={{ borderColor: '#E5E7EB' }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm" style={{ color: '#6B7280' }}>Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value.slice(0, 5)))}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2"
                        style={{ borderColor: '#E5E7EB' }}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm" style={{ color: '#6B7280' }}>CVV</label>
                      <input
                        type="text"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        placeholder="123"
                        className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2"
                        style={{ borderColor: '#E5E7EB' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm" style={{ color: '#6B7280' }}>Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2"
                      style={{ borderColor: '#E5E7EB' }}
                    />
                  </div>
                </div>
              )}

              {selectedMethod !== 'card' && (
                <div className="mb-6 p-6 rounded-xl text-center" style={{ backgroundColor: '#F7F8FA' }}>
                  <p style={{ color: '#6B7280' }}>
                    {selectedMethod === 'bank' ? 'Bank transfer details will be provided' : 'Digital wallet integration coming soon'}
                  </p>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={selectedMethod === 'card' && (!cardNumber || !cardExpiry || !cardCVV || !cardName)}
                className="w-full py-3 rounded-xl text-white transition-all disabled:opacity-50"
                style={{ backgroundColor: '#6C4CF1' }}
              >
                Pay ${amount.toFixed(2)}
              </button>
            </div>
          </>
        )}

        {paymentState === 'processing' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full animate-spin border-4 border-t-transparent" style={{ borderColor: '#6C4CF1' }}></div>
            <h3 className="mb-2" style={{ color: '#111827' }}>Processing Payment</h3>
            <p style={{ color: '#6B7280' }}>Please wait...</p>
          </div>
        )}

        {paymentState === 'success' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
              <CheckCircle className="w-10 h-10" style={{ color: '#22C55E' }} />
            </div>
            <h3 className="mb-2" style={{ color: '#111827' }}>Payment Successful!</h3>
            <p style={{ color: '#6B7280' }}>Your wallet has been topped up</p>
          </div>
        )}

        {paymentState === 'error' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEF2F2' }}>
              <XCircle className="w-10 h-10" style={{ color: '#EF4444' }} />
            </div>
            <h3 className="mb-2" style={{ color: '#111827' }}>Payment Failed</h3>
            <p className="mb-6" style={{ color: '#6B7280' }}>Please try again or use a different payment method</p>
            <button
              onClick={() => setPaymentState('form')}
              className="px-6 py-3 rounded-xl text-white"
              style={{ backgroundColor: '#6C4CF1' }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
