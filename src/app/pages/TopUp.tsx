import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft } from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';
import luqeaLogo from '../../assets/imgs/LUQUEA_LOGO.svg';

export const TopUp: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();
  const { addTransaction, updateBalance } = useApp();

  const quickAmounts = [50, 100, 200, 500];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleContinue = () => {
    if (phoneNumber && amount && parseFloat(amount) > 0) {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentSuccess = () => {
    const amountValue = parseFloat(amount);
    addTransaction({
      type: 'topup',
      amount: amountValue,
      status: 'success',
      description: 'Wallet top up'
    });
    updateBalance(amountValue);
    setShowPaymentModal(false);
    navigate('/dashboard');
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mb-6 transition-all"
            style={{ color: '#6B7280' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <img
              src={luqeaLogo}
              alt="Luqea logo"
              className="w-12 h-12 object-contain mix-blend-multiply"
            />
            <h1 className="text-2xl" style={{ color: '#111827' }}>Top Up Wallet</h1>
          </div>
        </div>

        <div className="rounded-2xl p-8 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="space-y-6">
            <div>
              <label htmlFor="phone" className="block mb-2" style={{ color: '#111827' }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="123-456-7890"
                maxLength={12}
              />
              <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
                Enter your registered phone number
              </p>
            </div>

            <div>
              <label htmlFor="amount" className="block mb-2" style={{ color: '#111827' }}>
                Amount
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xl"
                  style={{ color: '#6B7280' }}
                >
                  $
                </span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all text-xl"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleQuickAmount(value)}
                    className="px-4 py-2 rounded-xl border transition-all hover:shadow-sm"
                    style={{
                      borderColor: amount === value.toString() ? '#292DD9' : '#E5E7EB',
                      backgroundColor: amount === value.toString() ? '#EEF0FF' : '#FFFFFF',
                      color: amount === value.toString() ? '#292DD9' : '#6B7280'
                    }}
                  >
                    ${value}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleContinue}
                disabled={!phoneNumber || !amount || parseFloat(amount) <= 0}
                className="w-full py-3 rounded-xl text-white transition-all disabled:opacity-50 hover:shadow-lg"
                style={{ background: 'linear-gradient(90deg, #4E07B6 0%, #292DD9 55%, #0552FA 100%)' }}
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-6 rounded-2xl" style={{ backgroundColor: '#EEF0FF' }}>
          <p className="text-sm" style={{ color: '#1E3A8A' }}>
            <strong>Note:</strong> You will be redirected to a secure payment gateway to complete your top-up. All transactions are encrypted and secure.
          </p>
        </div>
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={parseFloat(amount) || 0}
        phoneNumber={phoneNumber}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
};
