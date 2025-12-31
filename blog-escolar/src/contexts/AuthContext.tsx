import React from "react";
import { createContext } from "react";
import { useState } from "react";

// 1. Define o formato dos dados do contexto
type AuthContextType = {
  user: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

// 2. Cria o contexto com valor inicial "undefined"
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Provider que vai envolver a aplicação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  // Função de login (por enquanto só simula)
  const login = async (username: string, /*password: string*/) => {
    //lembrar de validar senha
    // Aqui depois vai chamar a API
    setUser(username); // Simula login bem-sucedido
  };

  // Função de logout
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;