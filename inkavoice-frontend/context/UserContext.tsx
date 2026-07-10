import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
  name: string;
  setName: (name: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState('Nombre de Usuario');

  return (
    <UserContext.Provider value={{ photoUri, setPhotoUri, name, setName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
}
