import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { appThemes } from "../utils"; // ajusta el path
import { DefaultTheme } from "styled-components/native";
import { baseTheme } from "../utils/themes";

type Theme = DefaultTheme;
type Ctx = {
  themes: Theme;
  themeIndex: number;
  setThemeIndex: (i: number) => void;
  clearTheme: () => Promise<void>;
};

const ThemeContext = createContext<Ctx | undefined>(undefined);
const STORAGE_KEY = "@theme/index";

export function ThemeContextProvider({children,}: {children: React.ReactNode;}) {
  // const [themeIndex, setThemeIndexState] = useState(0);
  const [themeIndex, setThemeIndexState] = useState(
  Appearance.getColorScheme() === "dark" ? 4 : 0
);

  useEffect(() => {
  (async () => {
    //📦 Carga tema desde AsyncStorage
    const saved = await AsyncStorage.getItem(STORAGE_KEY);

    // ⚙️ Si hay guardado, lo aplicamos
    if (saved !== null) {
      const i = Number(saved);
      //Verificamos que sea un indice válido
      if (!Number.isNaN(i) && appThemes[i]) {
        console.log("🎨 Cargando tema guardado:", i);
        setThemeIndexState(i);
        return;
      }
    }

    // ⚙️ Si no hay guardado (null), tomamos el tema del sistema
    const scheme = Appearance.getColorScheme();
    const defaultIndex = scheme === "dark" ? 4 : 0;
  
    setThemeIndexState(defaultIndex);
  })();
}, []);

  // Guardar directamente en el setter
  const setThemeIndex = (i: number) => {
    if (!appThemes[i]) return;
    setThemeIndexState(i);
    AsyncStorage.setItem(STORAGE_KEY, String(i)).catch(() => {});
  };

  // Limpia el tema guardado y vuelve al predeterminado segun el sistema
  const clearTheme = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    // Tomamos el esquema actual del sistema en tiempo real
    const scheme = Appearance.getColorScheme();
    const newIndex = scheme === "dark" ? 4 : 0;

    setThemeIndexState(newIndex);
  } catch (error) {
    console.error("Error al limpiar tema:", error);
  }
};

  const value: Ctx = {
    themes: {
      ...baseTheme,
      colors: appThemes[themeIndex],
    },
    themeIndex,
    setThemeIndex,
    clearTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx)
    throw new Error("useTheme debe usarse dentro de <ThemeContextProvider>");
  return ctx;
}
