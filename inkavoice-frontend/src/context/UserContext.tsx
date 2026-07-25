import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
  name: string;
  setName: (name: string) => void;
  userId: string; // <-- Agregado
  setUserId: (id: string) => void; // <-- Agregado
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('Nombre de Usuario');
  const [userId, setUserId] = useState<string>('1'); // <-- Agregado (1 por defecto para pruebas)

  return (
    <UserContext.Provider value={{ photoUri, setPhotoUri, name, setName, userId, setUserId }}> {/* <-- Agregados al value */}
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
}