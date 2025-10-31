import { DefaultTheme } from "styled-components/native";

// utils/themes.ts
export type AppTheme = {
  name: string;
  background: string;
  onBackground: string;
  primary: string;
  onPrimary: string;
  secondary: string;
  tertiary: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  error: string;
};

export type BaseTheme = {
  spacing: {
    xm: number;
    sm: number;
    md: number;
    lg: number;
  };
  fontSizes: {
    xm: number;
    sm: number;
    md: number;
    lg: number;
  };
  fontWeights: {
    normal: string;
    bold: string;
  };
};

declare module "styled-components/native" {
  export interface DefaultTheme extends BaseTheme {
    colors: AppTheme;
  }
}

export const baseTheme: BaseTheme = {
  spacing: {
    xm: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  fontSizes: {
    xm: 14,
    sm: 16,
    md: 20,
    lg: 24,
  },
  fontWeights: {
    normal: "400",
    bold: "600",
  },
};

/**
 * =============================================================================
 * Guía de uso de colores de tema (para todo el equipo)
 * =============================================================================
 *
 * REGLA DE ORO → Usar SIEMPRE los pares correctos:
 *   - background  ↔ onBackground   // Fondo global de pantallas y su texto
 *   - surface     ↔ onSurface      // Cards/Sheets/List headers y su texto
 *   - surfaceVariant ↔ onSurfaceVariant // Estados “muted”, chips neutros, divisores suaves
 *   - primary     ↔ onPrimary      // Botón primario, selección activa, enlaces
 *   - outline                      // Bordes (inputs, cards). No usar como color de texto
 *   - error                        // Mensajes y bordes de validación negativa
 *   - secondary / tertiary         // Acentos secundarios/terciarios (chips, badges, series 2–3 en gráficos)
 *
 * No cruzar pares (p.ej. texto onSurface sobre background) salvo casos muy puntuales.
 *
 * -----------------------------------------------------------------------------
 * PATRONES RÁPIDOS (copiar/pegar mental)
 * -----------------------------------------------------------------------------
 *
 * // 1) Pantalla (contenedor raíz)
 * <View style={{ backgroundColor: theme.background }}>
 *   <Text style={{ color: theme.onBackground }}>Título o texto principal</Text>
 * </View>
 *
 * // 2) Card / Sheet
 * <View style={{
 *   backgroundColor: theme.surface,
 *   borderColor: theme.outline, borderWidth: 1, borderRadius: 12,
 * }}>
 *   <Text style={{ color: theme.onSurface }}>Contenido</Text>
 * </View>
 *
 * // 3) Botón primario
 * <Pressable style={{ backgroundColor: theme.primary, borderRadius: 10 }}>
 *   <Text style={{ color: theme.onPrimary, fontWeight: "600" }}>Acción</Text>
 * </Pressable>
 *
 * // 4) Enlace (link)
 * <Text style={{ color: theme.primary, fontWeight: "600" }}>Ver más</Text>
 *
 * // 5) Input
 * <View style={{
 *   backgroundColor: theme.surface,
 *   borderColor: theme.outline, borderWidth: 1, borderRadius: 8,
 * }}>
 *   <TextInput
 *     placeholderTextColor={theme.onSurfaceVariant}
 *     style={{ color: theme.onSurface }}
 *   />
 * </View>
 *
 * // 6) Chip / Celda “muted”
 * <View style={{
 *   backgroundColor: theme.surfaceVariant,
 *   borderColor: theme.outline, borderWidth: StyleSheet.hairlineWidth,
 *   borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4,
 * }}>
 *   <Text style={{ color: theme.onSurfaceVariant }}>Etiqueta</Text>
 * </View>
 *
 * // 7) Error
 * <Text style={{ color: theme.error }}>Mensaje de error</Text>
 * // o borde de error en input: borderColor: theme.error

 *
 * -----------------------------------------------------------------------------
 * DO / DON’T
 * -----------------------------------------------------------------------------
 * ✔ DO
 * - Respetar pares X ↔ onX
 * - Usar outline para bordes y divisores
 * - Usar surfaceVariant/onSurfaceVariant para estados “muted”
 * - Usar primary/onPrimary para acciones y selección activa
 *
 * ✖ DON’T
 * - Usar onSurfaceVariant como texto principal (queda lavado)
 * - Usar outline como color de texto
 * - Mezclar onBackground dentro de surface (preferir onSurface)
 * - Usar error como color de énfasis no-crítico
 *

 */

export const appThemes: AppTheme[] = [
  // ============= CLAROS =============
  {
    name: "Light · Tropical Punch",
    background: "#D9C3CF", // más oscuro que antes
    onBackground: "#1B1B1F",
    primary: "#FF3D8D",
    onPrimary: "#FFFFFF",
    secondary: "#FF8A34",
    tertiary: "#00C2B8",
    surface: "#F3E7EE", // claro, pero tintado (contrasta con background)
    onSurface: "#1B1B1F",
    surfaceVariant: "#C7B2BE",
    onSurfaceVariant: "#574752",
    outline: "#A995A2",
    error: "#E53935",
  },

  // 2) Light · Lime Soda (dim+contrast)
  {
    name: "Light · Lime Soda",
    background: "#CFE0C8", // salvia más marcada
    onBackground: "#1B1B1F",
    primary: "#38A700",
    onPrimary: "#FFFFFF",
    secondary: "#6F3FF5",
    tertiary: "#00C4FF",
    surface: "#ECF3E7",
    onSurface: "#1B1B1F",
    surfaceVariant: "#BDD0B4",
    onSurfaceVariant: "#455447",
    outline: "#A7C0A0",
    error: "#E53935",
  },

  // 3) Light · Sunset Sorbet (dim+contrast)
  {
    name: "Light · Sunset Sorbet",
    background: "#DCCABA", // durazno/beige más profundo
    onBackground: "#1B1B1F",
    primary: "#FF6F61",
    onPrimary: "#FFFFFF",
    secondary: "#FFC300",
    tertiary: "#7E57C2",
    surface: "#F1E6DC",
    onSurface: "#1B1B1F",
    surfaceVariant: "#C9B7A8",
    onSurfaceVariant: "#5B5149",
    outline: "#B8A799",
    error: "#E53935",
  },

  // 4) Light · Sky Mint (dim+contrast)
  {
    name: "Light · Sky Mint",
    background: "#C6D6E0", // azul grisáceo más notorio
    onBackground: "#1B1B1F",
    primary: "#00AEEF",
    onPrimary: "#FFFFFF",
    secondary: "#2BD9A3",
    tertiary: "#3451A2",
    surface: "#E8F0F6",
    onSurface: "#1B1B1F",
    surfaceVariant: "#B4C7D4",
    onSurfaceVariant: "#4B5E6E",
    outline: "#9FB5C4",
    error: "#E53935",
  },

  // ============= OSCUROS =============

  // 5) Dark · Neon Noir
  {
    name: "Dark · Neon Noir",
    background: "#0B0C10",
    onBackground: "#E8EAF0",
    primary: "#00E5FF",
    onPrimary: "#001416",
    secondary: "#FF4DFF",
    tertiary: "#D7FF3F",
    surface: "#12141A",
    onSurface: "#E8EAF0",
    surfaceVariant: "#232734",
    onSurfaceVariant: "#B2B8C5",
    outline: "#424B57",
    error: "#FF6B6B",
  },

  // 6) Dark · Cyber Grape
  {
    name: "Dark · Cyber Grape",
    background: "#140E1D",
    onBackground: "#EFE7F7",
    primary: "#B388FF",
    onPrimary: "#2A0046",
    secondary: "#26D7AE",
    tertiary: "#FF77B7",
    surface: "#1B1426",
    onSurface: "#EFE7F7",
    surfaceVariant: "#2B2240",
    onSurfaceVariant: "#C8BDE2",
    outline: "#4B4165",
    error: "#FF6B6B",
  },

  // 7) Dark · Teal Night Drive
  {
    name: "Dark · Teal Night Drive",
    background: "#0F1416",
    onBackground: "#E5EEF0",
    primary: "#00B8A9",
    onPrimary: "#001A18",
    secondary: "#FF9E3D",
    tertiary: "#66D1FF",
    surface: "#151B1E",
    onSurface: "#E5EEF0",
    surfaceVariant: "#223036",
    onSurfaceVariant: "#AEC4CC",
    outline: "#3D5057",
    error: "#FF6B6B",
  },

  // 8) Dark · Crimson Eclipse
  {
    name: "Dark · Crimson Eclipse",
    background: "#141015",
    onBackground: "#EFE7EE",
    primary: "#FF3366",
    onPrimary: "#2B000A",
    secondary: "#FFB74D",
    tertiary: "#A78BFA",
    surface: "#1A161C",
    onSurface: "#EFE7EE",
    surfaceVariant: "#2A2430",
    onSurfaceVariant: "#C4B8D0",
    outline: "#4D4358",
    error: "#FF6B6B",
  },
];

export const themes: DefaultTheme[] = appThemes.map((colors) => ({
  ...baseTheme,
  colors,
}));
