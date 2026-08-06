/**
 * Tipos para Presentes
 * Dados são carregados do banco MySQL via API
 */

export interface Gift {
  id: number;
  title: string;
  price: number;
  image?: string;
  cotas: number;
  categoria?: string;
}
