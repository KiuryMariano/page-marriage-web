/**
 * Sistema de Tema do Site de Casamento
 * Letícia & Kiury
 */

import { colors } from './colors';

export { default } from './colors';
export { colors, gradients, componentColors } from './colors';

// Tipos TypeScript para as cores
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export type PrimaryColor = keyof typeof colors.primary;
export type SecondaryColor = keyof typeof colors.secondary;
export type NeutralColor = keyof typeof colors.neutral;
