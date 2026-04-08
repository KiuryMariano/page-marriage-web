/**
 * Layout planejado para exatamente 42 fotos
 * 8 horizontais (H), 6 verticais (V), 28 normais (N)
 */
export const layoutPattern = [
  'H', 'H',           // 2
  'V', 'N', 'V', 'N', // 4
  'N', 'N', 'N', 'N', // 4
  'H', 'H',           // 2
  'V', 'N', 'V', 'N', // 4
  'N', 'N', 'N', 'N', // 4
  'H', 'H',           // 2
  'V', 'N', 'V', 'N', // 4
  'N', 'N', 'N', 'N', // 4
  'H', 'H',           // 2
  'N', 'N', 'V',      // 3
  'N', 'N', 'N', 'H',  // 4
  'N', 'N', 'N',      // 3
];

/**
 * Trocas manuais de posição [posição1, posição2]
 */
export const trocas = [
  [2, 11],  // troca posição 2 com 11
  [33, 35], // troca posição 33 com 35
  [4, 19],  // troca posição 4 com 19
  [5, 28],  // troca posição 5 com 28
  [9, 15],  // troca posição 9 com 15
  [28, 25], // troca posição 28 com 25
  [30, 33], // troca posição 30 com 33
  [40, 34], // troca posição 40 com 34
  [24, 9],  // troca posição 24 com 9
  [18, 13], // troca posição 18 com 13
  [13, 26], // troca posição 13 com 26
];

/**
 * Trocas cíclicas (3 posições)
 * Exemplo: [14, 13, 18] significa 14 → 13, 13 → 18, 18 → 14
 */
export const trocasCiclicas = [
  [14, 13, 18], // 14 → 13, 13 → 18, 18 → 14
];
