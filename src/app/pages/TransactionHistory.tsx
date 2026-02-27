import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react';

export const TransactionHistory: React.FC = () => {
  const { transactions } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'pending' | 'failed'>('all');
  const [filterType, setFilterType] = useState<'all' | 'topup' | 'send' | 'receive'>('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return `Hoy, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return `Ayer, ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#22C55E';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'success':
        return '#F0FDF4';
      case 'pending':
        return '#FFFBEB';
      case 'failed':
        return '#FEF2F2';
      default:
        return '#F7F8FA';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success':
        return 'exitosa';
      case 'pending':
        return 'pendiente';
      case 'failed':
        return 'fallida';
      default:
        return status;
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === '' ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recipient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.sender?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesType = filterType === 'all' || transaction.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof transactions>);

  const getGroupDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mb-6 transition-all"
            style={{ color: '#6B7280' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al panel</span>
          </button>
          <h1 className="text-2xl" style={{ color: '#111827' }}>Historial de transacciones</h1>
        </div>

        <div className="rounded-2xl p-6 shadow-sm mb-6" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#6B7280' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border outline-none focus:ring-2"
                style={{ borderColor: '#E5E7EB', color: '#111827' }}
                placeholder="Buscar transacciones..."
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-3 rounded-xl border outline-none focus:ring-2"
                style={{ borderColor: '#E5E7EB', color: '#111827', backgroundColor: '#FFFFFF' }}
              >
                <option value="all">Todos los tipos</option>
                <option value="topup">Recarga</option>
                <option value="send">Enviadas</option>
                <option value="receive">Recibidas</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 rounded-xl border outline-none focus:ring-2"
                style={{ borderColor: '#E5E7EB', color: '#111827', backgroundColor: '#FFFFFF' }}
              >
                <option value="all">Todos los estados</option>
                <option value="success">Exitosas</option>
                <option value="pending">Pendientes</option>
                <option value="failed">Fallidas</option>
              </select>
            </div>
          </div>
        </div>

        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="rounded-2xl p-12 text-center shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
            <p style={{ color: '#6B7280' }}>No se encontraron transacciones</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedTransactions)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
              .map((dateString) => (
                <div key={dateString}>
                  <h3 className="mb-3 px-2" style={{ color: '#6B7280' }}>
                    {getGroupDateLabel(dateString)}
                  </h3>
                  <div className="rounded-2xl p-6 shadow-sm space-y-3" style={{ backgroundColor: '#FFFFFF' }}>
                    {groupedTransactions[dateString].map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-xl border"
                        style={{ borderColor: '#E5E7EB' }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: '#F7F8FA' }}
                          >
                            {transaction.type === 'send' ? (
                              <ArrowUpRight className="w-6 h-6" style={{ color: '#EF4444' }} />
                            ) : (
                              <ArrowDownLeft className="w-6 h-6" style={{ color: '#22C55E' }} />
                            )}
                          </div>
                          <div>
                            <p style={{ color: '#111827' }}>{transaction.description}</p>
                            <p className="text-sm" style={{ color: '#6B7280' }}>
                              {formatDate(transaction.date)}
                            </p>
                            {transaction.recipient && (
                              <p className="text-sm" style={{ color: '#6B7280' }}>
                                Para: {transaction.recipient}
                              </p>
                            )}
                            {transaction.sender && (
                              <p className="text-sm" style={{ color: '#6B7280' }}>
                                De: {transaction.sender}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-xl mb-2"
                            style={{
                              color: transaction.type === 'send' ? '#EF4444' : '#22C55E'
                            }}
                          >
                            {transaction.type === 'send' ? '-' : '+'}S/ {transaction.amount.toFixed(2)}
                          </p>
                          <span
                            className="text-xs px-3 py-1 rounded-lg capitalize"
                            style={{
                              color: getStatusColor(transaction.status),
                              backgroundColor: getStatusBgColor(transaction.status)
                            }}
                          >
                            {getStatusLabel(transaction.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
