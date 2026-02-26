import React, { createContext, useContext, useState, useEffect } from 'react';
import usersData from '../../data/users.json';

export interface Transaction {
  id: string;
  type: 'topup' | 'send' | 'receive';
  amount: number;
  recipient?: string;
  sender?: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
  description: string;
}

interface AppContextType {
  isAuthenticated: boolean;
  userEmail: string;
  balance: number;
  transactions: Transaction[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateBalance: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'receive',
    amount: 150.00,
    sender: '+1 234-567-8901',
    date: new Date(2026, 1, 25, 14, 30).toISOString(),
    status: 'success',
    description: 'Payment received'
  },
  {
    id: '2',
    type: 'send',
    amount: 45.50,
    recipient: '+1 234-567-8902',
    date: new Date(2026, 1, 24, 10, 15).toISOString(),
    status: 'success',
    description: 'Money sent'
  },
  {
    id: '3',
    type: 'topup',
    amount: 200.00,
    date: new Date(2026, 1, 23, 16, 45).toISOString(),
    status: 'success',
    description: 'Wallet top up'
  },
  {
    id: '4',
    type: 'send',
    amount: 75.00,
    recipient: '+1 234-567-8903',
    date: new Date(2026, 1, 22, 9, 20).toISOString(),
    status: 'pending',
    description: 'Money sent'
  },
  {
    id: '5',
    type: 'topup',
    amount: 100.00,
    date: new Date(2026, 1, 20, 12, 0).toISOString(),
    status: 'failed',
    description: 'Wallet top up'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [balance, setBalance] = useState(2547.89);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedEmail = localStorage.getItem('userEmail');
    if (savedAuth === 'true' && savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
    }
  }, []);

  const login = (email: string, password: string) => {
    const validUser = usersData.find(
      (user) => user.email.toLowerCase() === email.toLowerCase().trim() && user.password === password
    );

    if (!validUser) {
      return false;
    }

    setIsAuthenticated(true);
    setUserEmail(validUser.email);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', validUser.email);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        balance,
        transactions,
        login,
        logout,
        addTransaction,
        updateBalance
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
