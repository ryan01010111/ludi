import {
  ReactNode, createContext, useContext, useMemo, useState,
} from 'react';

interface User {
  username: string;
}

type Login = (
  userData: { emailAddress: string, password: string }
) => Promise<boolean>;

export interface AuthContext {
  isAuthenticated: boolean;
  user: User | null;
  authUser: () => Promise<void>;
  login: Login;
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
    console.log('AUTH', data);
    setIsAuthenticated(true);
    setUser(data);
  }

  const login: Login = async userData => {
    console.log('userData', userData);
    const res = await fetch('https://jsonplaceholder.typicode.com/users/1');
    if (res.status !== 200) {
      return false;
    }
    const data = await res.json();
    console.log('LOGIN', data);
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
    login,
    logout,
  }), [isAuthenticated, user]);

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
}
