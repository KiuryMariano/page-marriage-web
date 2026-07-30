/**
 * Serviço de API para Presentes
 * Busca dados do banco MySQL via API PHP
 */

export interface GiftApiData {
  id: number;
  nome: string;
  preco: string;
  categoria: string;
  imagem_url: string | null;
  cotas_totais: number;
  cotas_disponiveis: number;
  cotas_vendidas: number;
  status_cotas: "disponivel" | "poucas_cotas" | "esgotado";
}

export interface GiftApiResponse {
  success: boolean;
  data: GiftApiData[];
  total: number;
}

export interface CategoriasApiResponse {
  success: boolean;
  stats: Array<{
    categoria: string;
    total_presentes: number;
    total_cotas_geral: number;
    total_cotas_disponiveis: number;
    total_cotas_vendidas: number;
    preco_medio: string;
  }>;
  categorias: Record<string, string>;
}

/**
 * Busca todos os presentes do banco
 */
export async function fetchGifts(category?: string): Promise<GiftApiResponse> {
  const url = category
    ? `/api/presentes/list.php?categoria=${category}`
    : "/api/presentes/list.php";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erro ao buscar presentes");
  }

  return response.json();
}

/**
 * Busca estatísticas das categorias
 */
export async function fetchCategories(): Promise<CategoriasApiResponse> {
  const response = await fetch("/api/presentes/categorias.php");

  if (!response.ok) {
    throw new Error("Erro ao buscar categorias");
  }

  return response.json();
}

/**
 * Busca status de um presente específico
 */
export async function fetchGiftStatus(id: number): Promise<{ success: boolean; data: GiftApiData }> {
  const response = await fetch(`/api/presentes/status.php?id=${id}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar status do presente");
  }

  return response.json();
}

/**
 * Registra uma venda
 */
export async function createSale(
  items: Array<{ id: number; quantity: number }>,
  paymentMethod: "pix" | "cartao"
): Promise<{ success: boolean; venda_id?: string; total?: number; error?: string }> {
  const response = await fetch("/api/vendas/create.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      itens: items,
      metodo_pagamento: paymentMethod,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao registrar venda");
  }

  return response.json();
}
