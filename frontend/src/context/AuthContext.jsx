import { createContext, useEffect, useState } from "react";
import { CHAVE_TOKEN, CHAVE_USER } from "../services/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function recuperarUsuario() {
  const usuarioSalvo = localStorage.getItem(CHAVE_USER);

  if (!usuarioSalvo) {
    return null;
  }

  try {
    return JSON.parse(usuarioSalvo);
  } catch {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USER);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(recuperarUsuario);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  function handleAuthExpired() {
    setUser(null);
  }

  window.addEventListener("auth:expired", handleAuthExpired);

  return () => {
    window.removeEventListener("auth:expired", handleAuthExpired);
  };
}, []);

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