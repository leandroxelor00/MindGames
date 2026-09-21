import { createContext, useState } from "react";
import { CHAVE_TOKEN } from "../services/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function recuperarUsuario() {
  const token = localStorage.getItem(CHAVE_TOKEN);

  if (!token) {
    return null;
  }

  try {
    const partes = token.split(".");
    const payload = JSON.parse(atob(partes[1]));

    return payload;
  } catch {
    localStorage.removeItem(CHAVE_TOKEN);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(recuperarUsuario);
  const [loading, setLoading] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}