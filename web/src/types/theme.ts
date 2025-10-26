export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
  danger: string;
  textPrimary: string;
  textSecondary: string;
}

export interface ThemeColors {
  light: ColorPalette;
  dark: ColorPalette;
}

export interface ThemeConfig {
  mode: "light" | "dark" | "system";
  colors: ThemeColors;
  activePreset: string;
  customColors?: ThemeColors;
}

export interface ThemePreset {
  name: string;
  colors: ThemeColors;
}
