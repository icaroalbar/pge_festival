"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

// Definir a interface para o tipo de usuário que será armazenado no contexto
interface User {
  id?: number;
  email?: string;
  setor?: string;
  urlImage?: string | null;
  score?: number;
  lastQuestion?: number;
  primeiroNome?: string;
  ultimoNome?: string;
}

// Definir o tipo do contexto para incluir o usuário e a função setUser
interface UserContextType {
  user: User | null; // O usuário pode ser nulo antes de ser autenticado
  setUser: Dispatch<SetStateAction<User | null>>;
}

// Inicializar o contexto com `undefined` para forçar o uso do Provider
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

// Componente de provedor do usuário
export function UserProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, setUser] = useState<User | null>(null); // Estado para armazenar o usuário

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
