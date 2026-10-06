import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [mensagem, setMensagem] = useState(null);

  const notificar = useCallback((texto) => {
    setMensagem(texto);

    setTimeout(() => {
      setMensagem(null);
    }, 4000);
  }, []);

  return (
    <NotificationContext.Provider value={{ mensagem, notificar }}>
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotification() {
  return useContext(NotificationContext);
}