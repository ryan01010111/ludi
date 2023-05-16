import {
  ReactNode, createContext, useContext, useMemo, useRef, useState,
} from 'react';

interface User {
  username: string;
}

export interface AuthContext {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  authUser: () => Promise<void>;
  signUp: (
    userData: {
      emailAddress: string;
      username: string;
      password: string;
    }
  ) => Promise<boolean>;
  confirmSignUp: (token: string) => Promise<boolean>;
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
  const authLoading = useRef(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  async function authUser() {
    if (authLoading.current) return;
    authLoading.current = true;

    const res = await fetch('/api/auth/refresh');
    if (res.status !== 200) {
      return;
    }

    const data = await res.json();
    setIsAuthenticated(true);
    setUser(data.user);
    setAccessToken(data.accessToken);
    authLoading.current = false;
  }

  const signUp: AuthContext['signUp'] = async userData => {
    const res = await fetch('/api/auth/register', genReqConfig('POST', userData));
    if (res.status !== 200) {
      return false;
    }

    return true;
  };

  const confirmSignUp: AuthContext['confirmSignUp'] = async token => {
    const res = await fetch('/api/auth/confirm-registration', genReqConfig('POST', { token }));
    if (res.status !== 200) {
      return false;
    }

    return true;
  };

  const login: AuthContext['login'] = async userData => {
    const res = await fetch('/api/auth/login', genReqConfig('POST', userData));
    if (res.status !== 200) {
      return false;
    }

    const data = await res.json();
    setIsAuthenticated(true);
    setUser(data.user);
    setAccessToken(data.accessToken);
    return true;
  };

  async function logout() {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.status !== 200) {
      return false;
    }

    setUser(null);
    setIsAuthenticated(false);
    setAccessToken(null);
    return true;
  }

  const context = useMemo(() => ({
    isAuthenticated,
    user,
    accessToken,
    authUser,
    signUp,
    confirmSignUp,
    login,
    logout,
  }), [isAuthenticated, user, accessToken]);

  return (
    <Context.Provider value={context}>
      {children}
    </Context.Provider>
  );
}
