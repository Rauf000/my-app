import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  name: string;
  phone: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (data: { name: string; phone: string; email: string; password: string }) => { ok: boolean; error?: string };
  logout: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

const USERS_KEY = 'renthome_users';
const SESSION_KEY = 'renthome_session';

function getStoredUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]'); } catch { return []; }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? 'null'); } catch { return null; }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getSession);

  const login = (email: string, password: string) => {
    const users = getStoredUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { ok: false, error: 'Неверный email или пароль' };
    const { password: _, ...userData } = found;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setUser(userData);
    return { ok: true };
  };

  const register = (data: { name: string; phone: string; email: string; password: string }) => {
    const users = getStoredUsers();
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: 'Этот email уже зарегистрирован' };
    }
    const newUser: StoredUser = { ...data };
    saveStoredUsers([...users, newUser]);
    const { password: _, ...userData } = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setUser(userData);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
}
