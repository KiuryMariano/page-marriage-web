/**
 * Hook personalizado para buscar presentes do banco MySQL
 * Mapeia nome do presente para imagem correta
 */

import { useState, useEffect } from "react";
import { type Gift } from "../mocks";
import { fetchGifts, type GiftApiData } from "../services/giftsApi";

// Importar todas as imagens
import gift1 from "../assets/gifts/1-cota-festa.webp";
import gift2 from "../assets/gifts/2-coberta-noiva.webp";
import gift3 from "../assets/gifts/3-ps5-noivo.webp";
import gift4 from "../assets/gifts/4-kit-turbo.webp";
import gift5 from "../assets/gifts/5-geladeira.webp";
import gift6 from "../assets/gifts/6-microondas.webp";
import gift7 from "../assets/gifts/7-cafeteira.webp";
import gift8 from "../assets/gifts/8-pipoqueira.webp";
import gift9 from "../assets/gifts/9-chaleira.webp";
import gift10 from "../assets/gifts/10-vestido-noiva.webp";
import gift11 from "../assets/gifts/11-corte-cabelo.webp";
import gift12 from "../assets/gifts/12-dia-noiva.webp";
import gift13 from "../assets/gifts/13-fundo-emergencial.webp";
import gift14 from "../assets/gifts/14-spa.webp";
import gift15 from "../assets/gifts/15-calmante.webp";
import gift16 from "../assets/gifts/16-mascaras-gas.webp";
import gift17 from "../assets/gifts/17-academia.webp";
import gift18 from "../assets/gifts/18-avental.webp";
import gift19 from "../assets/gifts/19-sal-grosso.webp";
import gift20 from "../assets/gifts/20-rolo-macarrao.webp";
import gift21 from "../assets/gifts/21-fogao.webp";
import gift22 from "../assets/gifts/22-panelas.webp";
import gift23 from "../assets/gifts/23-colorex.webp";
import gift24 from "../assets/gifts/24-sanduicheira.webp";

// Mapeamento por NOME do presente (não por ID)
const giftsByName: Record<string, string> = {
  'Geladeira': gift5,
  'Microondas': gift6,
  'Cafeteira': gift7,
  'Pipoqueira elétrica': gift8,
  'Chaleira Elétrica': gift9,
  'Fogão 6 bocas (para cozinhar os jantares românticos)': gift21,
  'Sanduicheira/Grill Elétrica': gift24,
  'Coberta para Noiva (sempre coberta de razão)': gift2,
  'PS5 para o Noivo': gift3,
  'Cota da Festa de Casamento': gift1,
  'Sal Grosso (espantar mau-olhado)': gift19,
  'Calmante para o Noivo (após ver a conta do casamento)': gift15,
  'Máscaras de Gás (Para trocar as fraldas dos futuros filhos)': gift16,
  'Cota do Kit Turbo de padaria': gift4,
  'Jogo completo de panelas': gift22,
  'Jogo completo Colorex': gift23,
  'Avental pro Noivo aprender a cozinhar': gift18,
  'Rolo de Macarrão (para quando a Noiva achar necessário)': gift20,
  'Cota do Vestido da Noiva': gift10,
  'Dia da Noiva': gift12,
  "Vale SPA para 'Paz Pós-Briga'": gift14,
  'Fundo Emergencial para TPM': gift13,
  'Corte de Cabelo do Noivo': gift11,
  'Academia (recuperação pós-buffet do casamento)': gift17,
};

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
