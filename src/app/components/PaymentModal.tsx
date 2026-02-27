import React, { useEffect, useMemo, useState } from 'react';
import { X, CreditCard, Landmark, Smartphone, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './payme-flex.css';
import paymeLogo from '../../assets/imgs/logo-payme.png';

declare global {
  interface Window {
    FlexPaymentForms?: any;
  }
}

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
  const { userEmail, userName } = useApp();
  type PaymentStatus = 'idle' | 'processing' | 'approved' | 'declined';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const containerId = 'payme-flex-root';
  type PaymentMethod = 'CARD' | 'YAPE' | 'PAGOEFECTIVO';
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const [firstName, lastName] = useMemo(() => {
    const parts = userName.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return ['Cliente', ''];
    return [parts[0], parts.slice(1).join(' ')];
  }, [userName]);

  const buildPayload = () => {
    const amountInCents = Math.round(amount * 100).toString();
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    const merchantOperation = `${Date.now()}`.slice(-12);
    const merchantCode = import.meta.env.VITE_PAYME_MERCHANT_CODE || '';
    const email = userEmail || 'cliente@demo.com';

    return {
      action: 'authorize',
      channel: 'ecommerce',
      merchant_code: merchantCode,
      merchant_operation_number: merchantOperation,
      payment_details: {
        amount: amountInCents,
        currency: '604',
        billing: {
          first_name: firstName,
          last_name: lastName || ' ',
          email,
          phone: {
            country_code: '+51',
            subscriber: cleanedPhone || '000000000'
          },
          location: {
            line_1: 'Av. San Borja Norte 1743',
            line_2: '',
            city: 'Lima',
            state: 'Lima',
            country: 'PE'
          }
        },
        customer: {
          first_name: firstName,
          last_name: lastName || ' ',
          email,
          phone: {
            country_code: '+51',
            subscriber: cleanedPhone || '000000000'
          },
          location: {
            line_1: 'Av. San Borja Norte 1743',
            line_2: '',
            city: 'Lima',
            state: 'Lima',
            country: 'PE'
          }
        }
      }
    };
  };

  const fetchNonce = async () => {
    const apiVersion = import.meta.env.VITE_PAYME_API_VERSION || '1709847567';
    const audience = import.meta.env.VITE_PAYME_AUDIENCE || 'https://api.preprod.alignet.io/';
    const authBase = import.meta.env.VITE_PAYME_AUTH_URL || 'https://auth.preprod.alignet.io';

    const clientId = import.meta.env.VITE_PAYME_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_PAYME_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      throw new Error('Faltan credenciales de Pay-me en el frontend.');
    }

    const tokenRes = await fetch(`${authBase}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ALG-API-VERSION': apiVersion
      },
      body: JSON.stringify({
        action: 'authorize',
        grant_type: 'client_credentials',
        audience,
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'create:token post:charges get:charges delete:charges'
      })
    });

    if (!tokenRes.ok) {
      throw new Error('No se pudo obtener el access token.');
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData?.access_token;
    if (!accessToken) {
      throw new Error('Respuesta inválida del access token.');
    }

    const nonceRes = await fetch(`${authBase}/nonce`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ALG-API-VERSION': apiVersion,
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        action: 'create.nonce',
        audience,
        client_id: clientId,
        scope: 'post:charges'
      })
    });

    if (!nonceRes.ok) {
      throw new Error('No se pudo obtener el nonce.');
    }

    const nonceData = await nonceRes.json();
    if (!nonceData?.nonce) {
      throw new Error('Respuesta inválida del nonce.');
    }

    return nonceData.nonce as string;
  };

  const initFlex = async (method: PaymentMethod) => {
    setError('');
    setStatusMessage('');
    setPaymentStatus('processing');
    setIsLoading(true);

    try {
      if (!window.FlexPaymentForms) {
        throw new Error('La librería de Pay-me Flex no está cargada.');
      }

      const nonce = await fetchNonce();
      const payload = buildPayload();
      if (!payload.merchant_code) {
        throw new Error('Falta configurar el merchant_code de Pay-me.');
      }

      const container = document.querySelector(`#${containerId}`);
      if (!container) {
        throw new Error('No se encontró el contenedor de Pay-me.');
      }

      const paymentForm = new window.FlexPaymentForms({
        nonce,
        payload,
        settings: {
          show_close_button: false,
          display_result_screen: false
        },
        display_settings: {
          methods: [method]
        }
      });

      paymentForm.init(
        container,
        (response: any) => {
          const statusCode =
            response?.authorization?.meta?.status?.code ||
            response?.meta?.status?.code ||
            response?.status?.code;
          const approved = statusCode === '00' || statusCode === '000';

          if (approved) {
            setPaymentStatus('approved');
            setStatusMessage('Pago aprobado correctamente. Puedes finalizar la transacción.');
          } else {
            setPaymentStatus('declined');
            setStatusMessage('El pago no fue aprobado. Intenta nuevamente.');
          }
        },
        (tracking: any) => {
          console.log('Pay-me tracking', tracking);
        },
        (err: any) => {
          console.error('Pay-me error', err);
          setError('Ocurrió un error al procesar el pago.');
          setPaymentStatus('declined');
          setStatusMessage('Ocurrió un error al procesar el pago. Intenta nuevamente.');
        }
      );
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error al inicializar Pay-me.');
      setPaymentStatus('declined');
      setStatusMessage(err?.message || 'Ocurrió un error al inicializar Pay-me.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !selectedMethod) return;
    const container = document.querySelector(`#${containerId}`);
    if (container) {
      container.innerHTML = '';
    }
    setPaymentStatus('idle');
    setStatusMessage('');
    setError('');
    initFlex(selectedMethod);
    return () => {
      const cleanup = document.querySelector(`#${containerId}`);
      if (cleanup) cleanup.innerHTML = '';
    };
  }, [isOpen, selectedMethod, amount, phoneNumber, userEmail]);

  useEffect(() => {
    if (isOpen) return;
    setSelectedMethod(null);
    setError('');
    setIsLoading(false);
    setPaymentStatus('idle');
    setStatusMessage('');
  }, [isOpen]);

  if (!isOpen) return null;

  const resetStatus = () => {
    setPaymentStatus('idle');
    setStatusMessage('');
    setError('');
  };

  const retryPayment = () => {
    if (!selectedMethod) return;
    const container = document.querySelector(`#${containerId}`);
    if (container) {
      container.innerHTML = '';
    }
    resetStatus();
    initFlex(selectedMethod);
  };

  const showOverlay = paymentStatus === 'approved' || paymentStatus === 'declined';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
        <div className={`max-h-[92vh] overflow-y-auto ${showOverlay ? 'opacity-0 pointer-events-none' : ''}`}>
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#E5E7EB' }}>
            <div className="flex items-center gap-3">
              <img src={paymeLogo} alt="Pay-me" className="h-6 w-auto" />
              <div>
                <h2 style={{ color: '#111827' }}>Pasarela Pay-me</h2>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Monto a pagar: <strong>S/ {amount.toFixed(2)}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ backgroundColor: '#F7F8FA' }}
              >
                <X className="w-4 h-4" style={{ color: '#6B7280' }} />
              </button>
            </div>
          </div>

          <div className="p-6">
          {!selectedMethod && (
            <div className="mb-6 space-y-3">
              <p className="text-sm font-medium" style={{ color: '#111827' }}>
                Elige un metodo de pago
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('CARD')}
                  className="w-full p-4 border rounded-xl text-left transition-all hover:shadow-sm"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FF' }}>
                      <CreditCard className="w-5 h-5" style={{ color: '#1E3A8A' }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: '#111827' }}>Tarjeta</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>Credito o debito</p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('PAGOEFECTIVO')}
                  className="w-full p-4 border rounded-xl text-left transition-all hover:shadow-sm"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#ECFDF5' }}>
                      <Landmark className="w-5 h-5" style={{ color: '#047857' }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: '#111827' }}>Pago Efectivo</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>Banca movil o agentes</p>
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMethod('YAPE')}
                  className="w-full p-4 border rounded-xl text-left transition-all hover:shadow-sm"
                  style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5F3FF' }}>
                      <Smartphone className="w-5 h-5" style={{ color: '#6D28D9' }} />
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: '#111827' }}>Yape</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>Pago con celular</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {selectedMethod && (
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Metodo seleccionado: <strong style={{ color: '#111827' }}>{selectedMethod}</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedMethod(null);
                  setError('');
                  setPaymentStatus('idle');
                  setStatusMessage('');
                }}
                className="text-sm underline"
                style={{ color: '#6B7280' }}
              >
                Cambiar metodo
              </button>
            </div>
          )}

          {isLoading && (
            <div className="mb-4 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#F7F8FA', color: '#6B7280' }}>
              Cargando formulario de pago...
            </div>
          )}

          {error && paymentStatus === 'idle' && (
            <div className="mb-4 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C' }}>
              {error}
            </div>
          )}

          {selectedMethod && (
            <section className={`flex-center${showOverlay ? ' invisible' : ''}`}>
              <div className="card">
                <div id={containerId} />
              </div>
            </section>
          )}
          </div>
        </div>

        {showOverlay && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6 sm:p-10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
            <div
              className="w-full max-w-md text-center rounded-2xl p-8 sm:p-10"
              style={{ backgroundColor: '#FFFFFF', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.12)' }}
            >
              <div className="mx-auto mb-4 h-20 w-20 rounded-full flex items-center justify-center" style={{ backgroundColor: paymentStatus === 'approved' ? '#ECFDF5' : '#FEF2F2' }}>
                {paymentStatus === 'approved' ? (
                  <CheckCircle2 className="h-12 w-12" style={{ color: '#059669' }} />
                ) : (
                  <XCircle className="h-12 w-12" style={{ color: '#DC2626' }} />
                )}
              </div>
              <h3 className="text-xl font-semibold" style={{ color: '#111827' }}>
                {paymentStatus === 'approved' ? 'Pago aprobado' : 'Pago denegado'}
              </h3>
              <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
                {statusMessage || (paymentStatus === 'approved' ? 'Tu pago se procesó correctamente.' : 'Tu pago no pudo ser procesado.')}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                {paymentStatus === 'approved' ? (
                  <button
                    type="button"
                    onClick={() => {
                      onSuccess();
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-lg text-white font-medium"
                    style={{ backgroundColor: '#059669' }}
                  >
                    Finalizar
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={retryPayment}
                      className="px-5 py-2.5 rounded-lg text-white font-medium"
                      style={{ backgroundColor: '#DC2626' }}
                    >
                      Intentar nuevamente
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMethod(null);
                        resetStatus();
                      }}
                      className="px-5 py-2.5 rounded-lg border font-medium"
                      style={{ borderColor: '#E5E7EB', color: '#374151', backgroundColor: '#FFFFFF' }}
                    >
                      Cambiar método
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
