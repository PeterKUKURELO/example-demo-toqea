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
  userName: string;
  userRole: string;
  balance: number;
  transactions: Transaction[];
  login: (email: string, password: string) => boolean;
  registerUser: (name: string, email: string, password: string) => { ok: boolean; message?: string };
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
    description: 'Pago recibido'
  },
  {
    id: '2',
    type: 'send',
    amount: 45.50,
    recipient: '+1 234-567-8902',
    date: new Date(2026, 1, 24, 10, 15).toISOString(),
    status: 'success',
    description: 'Dinero enviado'
  },
  {
    id: '3',
    type: 'topup',
    amount: 200.00,
    date: new Date(2026, 1, 23, 16, 45).toISOString(),
    status: 'success',
    description: 'Recarga Pay-me'
  },
  {
    id: '4',
    type: 'send',
    amount: 75.00,
    recipient: '+1 234-567-8903',
    date: new Date(2026, 1, 22, 9, 20).toISOString(),
    status: 'pending',
    description: 'Dinero enviado'
  },
  {
    id: '5',
    type: 'topup',
    amount: 100.00,
    date: new Date(2026, 1, 20, 12, 0).toISOString(),
    status: 'failed',
    description: 'Recarga Pay-me'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [balance, setBalance] = useState(2547.89);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const getStoredUsers = () => {
    try {
      const stored = localStorage.getItem('registeredUsers');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedEmail = localStorage.getItem('userEmail');
    const savedName = localStorage.getItem('userName');
    const savedRole = localStorage.getItem('userRole');
    if (savedAuth === 'true' && savedEmail) {
      setIsAuthenticated(true);
      setUserEmail(savedEmail);
      const normalizedEmail = savedEmail.toLowerCase().trim();
      const storedUsers = getStoredUsers();
      const matchedUser = [...usersData, ...storedUsers].find(
        (user) => user.email.toLowerCase() === normalizedEmail
      );
      const resolvedName = matchedUser
        ? `${matchedUser.firstName || ''} ${matchedUser.lastName || ''}`.trim()
        : savedName || '';
      const resolvedRole = matchedUser?.role || savedRole || '';

      setUserName(resolvedName);
      setUserRole(resolvedRole);
      if (resolvedName) localStorage.setItem('userName', resolvedName);
      if (resolvedRole) localStorage.setItem('userRole', resolvedRole);
    }
  }, []);

  const login = (email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const storedUsers = getStoredUsers();
    const validUser = [...usersData, ...storedUsers].find(
      (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
    );

    if (!validUser) {
      return false;
    }

    setIsAuthenticated(true);
    setUserEmail(validUser.email);
    setUserName(`${validUser.firstName || ''} ${validUser.lastName || ''}`.trim());
    setUserRole(validUser.role || '');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', validUser.email);
    localStorage.setItem(
      'userName',
      `${validUser.firstName || ''} ${validUser.lastName || ''}`.trim()
    );
    localStorage.setItem('userRole', validUser.role || '');
    return true;
  };

  const registerUser = (name: string, email: string, password: string) => {
    const normalizedEmail = email.toLowerCase().trim();
    const storedUsers = getStoredUsers();
    const existingUser = [...usersData, ...storedUsers].find(
      (user) => user.email.toLowerCase() === normalizedEmail
    );

    if (existingUser) {
      return { ok: false, message: 'El correo ya está registrado.' };
    }

    const trimmedName = name.trim();
    const [firstName = '', ...rest] = trimmedName.split(' ').filter(Boolean);
    const lastName = rest.join(' ');
    const newUser = {
      firstName,
      lastName,
      role: 'user',
      email: normalizedEmail,
      password
    };
    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    setIsAuthenticated(true);
    setUserEmail(newUser.email);
    setUserName(`${newUser.firstName} ${newUser.lastName}`.trim());
    setUserRole(newUser.role);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', newUser.email);
    localStorage.setItem('userName', `${newUser.firstName} ${newUser.lastName}`.trim());
    localStorage.setItem('userRole', newUser.role);
    return { ok: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    setUserName('');
    setUserRole('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
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
        userName,
        userRole,
        balance,
        transactions,
        login,
        registerUser,
        logout,
        addTransaction,
        updateBalance
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
