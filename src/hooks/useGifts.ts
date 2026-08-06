/**
 * Hook personalizado para buscar presentes do banco MySQL
 * Usa imagem_url da API para obter as imagens dos presentes
 */

import { useState, useEffect } from "react";
import { type Gift } from "../mocks";
import { fetchGifts, type GiftApiData } from "../services/giftsApi";

/**
 * Mapeia dados da API para formato Gift do frontend
 * Usa a URL do banco se disponível, fallback para imagem padrão
 */
function mapApiToGift(apiGift: GiftApiData): Gift {
  // Se tem URL da imagem no banco, usa ela
  if (apiGift.imagem_url) {
    return {
      id: apiGift.id,
      title: apiGift.nome,
      price: parseFloat(apiGift.preco),
      image: apiGift.imagem_url,
      cotas: apiGift.cotas_disponiveis,
      categoria: apiGift.categoria,
    };
  }

  // Fallback para imagem padrão no servidor
  return {
    id: apiGift.id,
    title: apiGift.nome,
    price: parseFloat(apiGift.preco),
    image: '/imagens-presentes/sem-imagem.png',
    cotas: apiGift.cotas_disponiveis,
    categoria: apiGift.categoria,
  };
}

export function useGifts(category?: string) {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGifts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchGifts(category);

        if (response.success && response.data) {
          const mappedGifts = response.data.map(mapApiToGift);
          setGifts(mappedGifts);
        } else {
          setError("Erro ao carregar presentes");
        }
      } catch {
        setError("Não foi possível carregar os presentes. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    };

    loadGifts();
  }, [category]);

  const refetch = () => {
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchGifts(category);

        if (response.success && response.data) {
          const mappedGifts = response.data.map(mapApiToGift);
          setGifts(mappedGifts);
        } else {
          setError("Erro ao carregar presentes");
        }
      } catch {
        setError("Não foi possível carregar os presentes. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    })();
  };

  return { gifts, loading, error, refetch };
}
