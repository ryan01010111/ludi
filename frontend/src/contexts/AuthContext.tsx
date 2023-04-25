import {
  ReactNode, createContext, useContext, useMemo, useState,
} from 'react';

interface User {
  username: string;
}

export type SignUpFunc = (
  userData: {
    emailAddress: string,
    username: string,
    password: string,
    confirmPassword: string
  }
) => Promise<boolean>;

export type LoginFunc = (
  userData: { emailAddress: string, password: string }
) => Promise<boolean>;

export interface AuthContext {
  isAuthenticated: boolean;
  user: User | null;
  authUser: () => Promise<void>;
  signUp: SignUpFunc;
  login: LoginFunc;
  logout: () => Promise<boolean>;
}

const Context = createContext<AuthContext | null>(null);

export function useAuth() {
  return useContext(Context) as AuthContext;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  async function authUser() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (res.status !== 200) {
      return;
    }
    const data = await res.json();
    console.log('AUTH');
    setIsAuthenticated(true);
    setUser(data);
  }

  const signUp: SignUpFunc = async userData => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (res.status !== 200) {
      return false;
    }
    const data = await res.json();
    console.log('SIGN-UP', userData);
    setUser(data);
    setIsAuthenticated(true);
    return true;
  };

  const login: LoginFunc = async userData => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (res.status !== 200) {
      return false;
    }
    const data = await res.json();
    console.log('LOGIN', userData);
    setUser(data);
    setIsAuthenticated(true);
    return true;
  };

  async function logout() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (res.status !== 200) {
      return false;
    }
    console.log('LOGOUT');
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
