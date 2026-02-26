import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowUpRight, ArrowDownLeft, History, LogOut } from 'lucide-react';
import luqeaLogo from '../../assets/imgs/LUQUEA_LOGO.svg';

export const Dashboard: React.FC = () => {
  const { balance, transactions, userEmail, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const recentTransactions = transactions.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F8FA' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img
              src={luqeaLogo}
              alt="Luqea logo"
              className="w-12 h-12 object-contain mix-blend-multiply"
            />
            <div>
              <h1 className="text-2xl" style={{ color: '#111827' }}>My Wallet</h1>
              <p className="text-sm" style={{ color: '#6B7280' }}>{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:shadow-sm"
            style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', color: '#6B7280' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div
            className="lg:col-span-2 rounded-2xl p-8 shadow-sm"
            style={{ background: 'linear-gradient(120deg, #4E07B6 0%, #292DD9 50%, #0552FA 100%)' }}
          >
            <p className="text-white/80 mb-2">Total Balance</p>
            <h2 className="text-5xl text-white mb-8">${balance.toFixed(2)}</h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/topup')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white transition-all hover:shadow-lg"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <ArrowDownLeft className="w-5 h-5" />
                <span>Top Up</span>
              </button>
              <button
                onClick={() => navigate('/send')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl transition-all hover:shadow-lg"
                style={{ backgroundColor: '#FFFFFF', color: '#292DD9' }}
              >
                <ArrowUpRight className="w-5 h-5" />
                <span>Send Money</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-sm flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: '#111827' }}>Quick Actions</h3>
            </div>
            <div className="space-y-3 flex-1">
              <button
                onClick={() => navigate('/history')}
                className="w-full flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-sm"
                style={{ borderColor: '#E5E7EB' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F7F8FA' }}>
                  <History className="w-5 h-5" style={{ color: '#292DD9' }} />
                </div>
                <div className="flex-1 text-left">
                  <p style={{ color: '#111827' }}>Transaction History</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>View all transactions</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-6 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ color: '#111827' }}>Recent Transactions</h3>
            <button
              onClick={() => navigate('/history')}
              className="text-sm transition-all"
              style={{ color: '#292DD9' }}
            >
              View All
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <p className="text-center py-8" style={{ color: '#6B7280' }}>No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ borderColor: '#E5E7EB' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#F7F8FA' }}
                    >
                      {transaction.type === 'send' ? (
                        <ArrowUpRight className="w-5 h-5" style={{ color: '#EF4444' }} />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" style={{ color: '#22C55E' }} />
                      )}
                    </div>
                    <div>
                      <p style={{ color: '#111827' }}>{transaction.description}</p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        {formatDate(transaction.date)}
                        {transaction.recipient && ` • ${transaction.recipient}`}
                        {transaction.sender && ` • ${transaction.sender}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p
                        style={{
                          color: transaction.type === 'send' ? '#EF4444' : '#22C55E'
                        }}
                      >
                        {transaction.type === 'send' ? '-' : '+'}${transaction.amount.toFixed(2)}
                      </p>
                      <div className="flex justify-end mt-1">
                        <span
                          className="text-xs px-2 py-1 rounded-md capitalize"
                          style={{
                            color: getStatusColor(transaction.status),
                            backgroundColor: getStatusBgColor(transaction.status)
                          }}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
