import {
  ReactNode, createContext, useContext, useMemo, useState,
} from 'react';

interface User {
  username: string;
}

export interface AuthContext {
  isAuthenticated: boolean;
  user: User | null;
  authUser: () => Promise<void>;
  signUp: (
    userData: {
      emailAddress: string;
      username: string;
      password: string;
    }
  ) => Promise<boolean>;
  login: (
    userData: { emailAddress: string, password: string }
  ) => Promise<boolean>;
  logout: () => Promise<boolean>;
}

const Context = createContext<AuthContext | null>(null);

export function useAuth() {
  return useContext(Context) as AuthContext;
}

interface AuthProviderProps {
  children: ReactNode;
}

function genReqConfig(method: string, data: any) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  async function authUser() {
    console.log('AUTH');
    const res = await fetch('/api/auth');
    if (res.status !== 200) {
      return;
    }
    const data = await res.json();
    setIsAuthenticated(true);
    setUser(data);
  }

  const signUp: AuthContext['signUp'] = async userData => {
    const res = await fetch('/api/auth/register', genReqConfig('POST', userData));
    if (res.status !== 200) {
      return false;
    }

    return true;
  };

  const login: AuthContext['login'] = async userData => {
    const config = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    };
    const res = await fetch('/api/auth/login', config);
    if (res.status !== 200) {
      return false;
    }

    const data = await res.json();
    setUser(data);
    setIsAuthenticated(true);
    return true;
  };

  async function logout() {
    const res = await fetch('/api/auth/logout');
    if (res.status !== 200) {
      return false;
    }

    setUser(null);
    setIsAuthenticated(false);
    return true;
  }

  const context = useMemo(() => ({
    isAuthenticated,
    user,
    authUser,
    signUp,
    login,
    logout,
  }), [isAuthenticated, user]);

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
}
