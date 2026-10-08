import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

// Chave igual à usada na prévia do Lovable.
export const THEME_STORAGE_KEY = "mindgames-seasonal-theme";

// Para o tema sazonal já vir ligado para todo mundo, troque para "subtle" ou "halloween".
export const DEFAULT_THEME = "original";

export const themeOptions = [
  { id: "original", label: "Original", icon: "🧠" },
  { id: "subtle", label: "Halloween discreto", icon: "👻" },
  { id: "halloween", label: "Halloween completo", icon: "🎃" },
];

export function isTheme(value) {
  return themeOptions.some((option) => option.id === value);
}

function readStoredTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(saved) ? saved : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback((value) => {
    if (!isTheme(value)) return;

    setThemeState(value);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {
      // Sem localStorage o tema continua valendo até recarregar a página.
    }
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  }

  return context;
}
