import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appThemes } from "../utils"; // ajusta el path
import { DefaultTheme } from "styled-components/native";
import { baseTheme } from "../utils/themes";

type Theme = DefaultTheme;
type Ctx = {
  themes: Theme;
  themeIndex: number;
  setThemeIndex: (i: number) => void;
};

const ThemeContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = "@theme/index";

export function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [themeIndex, setThemeIndexState] = useState(0);

  // Cargar guardado una sola vez
  useEffect(() => {
    (async () => {
      // AsyncStorage.getItem devuelve string | null
      // se usa para guardar el indice del tema en la memoria del dispositivo
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      const i = Number(saved);
      if (!Number.isNaN(i) && appThemes[i]) setThemeIndexState(i);
    })();
  }, []);

  // Guardar directamente en el setter
  const setThemeIndex = (i: number) => {
    if (!appThemes[i]) return;
    setThemeIndexState(i);
    AsyncStorage.setItem(STORAGE_KEY, String(i)).catch(() => {});
  };

  const value: Ctx = {
    themes: {
      ...baseTheme,
      colors: appThemes[themeIndex],
    },
    themeIndex,
    setThemeIndex,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeContextProvider>");
  return ctx;
}
