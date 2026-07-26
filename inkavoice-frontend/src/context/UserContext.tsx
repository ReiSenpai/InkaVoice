import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
  name: string;
  setName: (name: string) => void;
  userId: string;
  setUserId: (id: string) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  email: string;
  setEmail: (email: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('Nombre de Usuario');
  const [userId, setUserId] = useState<string>('1'); // 1 por defecto para pruebas
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');

  return (
    <UserContext.Provider value={{ photoUri, setPhotoUri, name, setName, userId, setUserId, token, setToken, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
}