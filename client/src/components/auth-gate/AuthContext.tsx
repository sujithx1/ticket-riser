import { createContext, useContext } from "react";

export type User = {
  id: string;
  name: string;
  phone: string;
  role: {
    id: string;
    name: string;
  };
};

export type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
