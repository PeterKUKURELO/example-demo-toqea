import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';

export const SendMoney: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { balance, addTransaction, updateBalance } = useApp();

  const quickAmounts = [25, 50, 100, 250];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleSend = () => {
    const amountValue = parseFloat(amount);
    if (phoneNumber && amountValue > 0 && amountValue <= balance) {
      setShowConfirmModal(true);
    }
  };

  const confirmSend = () => {
    const amountValue = parseFloat(amount);
    addTransaction({
      type: 'send',
      amount: amountValue,
      recipient: phoneNumber,
      status: 'success',
      description: 'Dinero enviado'
    });
    updateBalance(-amountValue);
    setShowConfirmModal(false);
    setShowSuccessModal(true);
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
            <span>Volver al panel</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#292DD9' }}>
              <Send className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl" style={{ color: '#111827' }}>Enviar dinero</h1>
          </div>
        </div>

        <div className="rounded-2xl p-8 shadow-sm mb-6" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center justify-between mb-6 p-4 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
            <span style={{ color: '#6B7280' }}>Saldo disponible</span>
            <span className="text-xl" style={{ color: '#111827' }}>S/ {balance.toFixed(2)}</span>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="recipient" className="block mb-2" style={{ color: '#111827' }}>
                Teléfono del destinatario
              </label>
              <input
                type="tel"
                id="recipient"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 transition-all"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="123-456-7890"
                maxLength={12}
              />
            </div>

            <div>
              <label htmlFor="amount" className="block mb-2" style={{ color: '#111827' }}>
                Monto
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-xl"
                  style={{ color: '#6B7280' }}
                >
                  S/
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
                  max={balance}
                  step="0.01"
                />
              </div>
              <div className="grid grid-cols-4 gap-3 mt-4">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleQuickAmount(value)}
                    disabled={value > balance}
                    className="px-4 py-2 rounded-xl border transition-all hover:shadow-sm disabled:opacity-50"
                    style={{
                      borderColor: amount === value.toString() ? '#292DD9' : '#E5E7EB',
                      backgroundColor: amount === value.toString() ? '#EEF0FF' : '#FFFFFF',
                      color: amount === value.toString() ? '#292DD9' : '#6B7280'
                    }}
                  >
                    S/ {value}
                  </button>
                ))}
              </div>
              {amount && parseFloat(amount) > balance && (
                <p className="text-sm mt-2" style={{ color: '#EF4444' }}>
                  Saldo insuficiente
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={handleSend}
                disabled={!phoneNumber || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance}
                className="w-full py-3 rounded-xl text-white transition-all disabled:opacity-50 hover:shadow-lg"
                style={{ background: 'linear-gradient(90deg, #4E07B6 0%, #292DD9 55%, #0552FA 100%)' }}
              >
                Enviar dinero
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="w-full max-w-md rounded-2xl p-8 shadow-xl" style={{ backgroundColor: '#FFFFFF' }}>
            <h2 className="text-xl mb-4" style={{ color: '#111827' }}>Confirmar transferencia</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between p-4 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
                <span style={{ color: '#6B7280' }}>Destinatario</span>
                <span style={{ color: '#111827' }}>{phoneNumber}</span>
              </div>
              <div className="flex justify-between p-4 rounded-xl" style={{ backgroundColor: '#F7F8FA' }}>
                <span style={{ color: '#6B7280' }}>Monto</span>
                <span className="text-xl" style={{ color: '#111827' }}>S/ {parseFloat(amount).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl border transition-all"
                style={{ borderColor: '#E5E7EB', color: '#6B7280' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmSend}
                className="flex-1 py-3 rounded-xl text-white transition-all"
                style={{ background: 'linear-gradient(90deg, #4E07B6 0%, #292DD9 55%, #0552FA 100%)' }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="w-full max-w-md rounded-2xl p-12 shadow-xl text-center" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0FDF4' }}>
              <CheckCircle className="w-10 h-10" style={{ color: '#22C55E' }} />
            </div>
            <h2 className="text-xl mb-2" style={{ color: '#111827' }}>¡Transferencia exitosa!</h2>
            <p className="mb-6" style={{ color: '#6B7280' }}>
              Se enviaron S/ {parseFloat(amount).toFixed(2)} a {phoneNumber}
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 rounded-xl text-white"
              style={{ background: 'linear-gradient(90deg, #4E07B6 0%, #292DD9 55%, #0552FA 100%)' }}
            >
              Volver al panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
