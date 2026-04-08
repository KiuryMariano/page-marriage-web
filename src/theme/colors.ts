/**
 * Cores do Sistema de Casamento Letícia & Kiury
 * Baseado em tons de Amarelo/Âmbar (cor principal do site)
 */

export const colors = {
  // Cor Primária - Amarelo/Âmbar
  primary: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Principal
    600: "#d97706", // Escuro - usado para texto/destaques
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Cor Secundária - Azul Navy
  secondary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af", // Navy médio
    900: "#1e3a8a", // Navy escuro - principal
  },

  // Cores Neutras
  neutral: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712", // Gray-950
  },

  // Cores de Ação
  success: {
    light: "#34d399",
    DEFAULT: "#10b981",
    dark: "#059669",
  },
  danger: {
    light: "#f87171",
    DEFAULT: "#ef4444",
    dark: "#dc2626",
  },
  warning: {
    light: "#fbbf24",
    DEFAULT: "#f59e0b",
    dark: "#d97706",
  },
};

// Gradientes pré-definidos
export const gradients = {
  primary: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  primaryLight: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
  secondary: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
  secondaryLight: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  horizontal: {
    primary:
      "linear-gradient(90deg, transparent 0%, #f59e0b 50%, transparent 100%)",
    primaryLight:
      "linear-gradient(90deg, transparent 0%, #fbbf24 50%, transparent 100%)",
  },
};

// Cores por componente
export const componentColors = {
  // Botões
  button: {
    primary: colors.primary[500],
    primaryHover: colors.primary[600],
    secondary: colors.secondary[900],
    secondaryHover: colors.secondary[800],
  },

  // Links
  link: {
    DEFAULT: colors.primary[400],
    hover: colors.primary[300],
  },

  // Texto
  text: {
    primary: colors.neutral[900],
    secondary: colors.neutral[600],
    muted: colors.neutral[500],
    light: colors.neutral[100],
    inverse: colors.neutral[50],
  },

  // Background
  bg: {
    primary: colors.neutral[50],
    secondary: colors.neutral[900],
    accent: colors.primary[100],
  },

  // Border
  border: {
    light: colors.neutral[200],
    DEFAULT: colors.neutral[300],
    dark: colors.neutral[700],
  },

  // Shadows
  shadow: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
};

// Export padrão
export default {
  colors,
  gradients,
  componentColors,
};
