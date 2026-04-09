export interface Gift {
  id: number;
  title: string;
  price: number;
  image?: string;
  cotas: number;
}

// Import all gift images from assets
import gift1 from "../assets/gifts/1-cota-festa.jpg";
import gift2 from "../assets/gifts/2-coberta-noiva.jpg";
import gift3 from "../assets/gifts/3-ps5-noivo.jpg";
import gift4 from "../assets/gifts/4-kit-turbo.jpg";
import gift5 from "../assets/gifts/5-geladeira.jpg";
import gift6 from "../assets/gifts/6-microondas.jpg";
import gift7 from "../assets/gifts/7-cafeteira.jpg";
import gift8 from "../assets/gifts/8-pipoqueira.jpg";
import gift9 from "../assets/gifts/9-chaleira.jpg";
import gift10 from "../assets/gifts/10-vestido-noiva.jpg";
import gift11 from "../assets/gifts/11-corte-cabelo.jpg";
import gift12 from "../assets/gifts/12-dia-noiva.jpg";
import gift13 from "../assets/gifts/13-fundo-emergencial.jpg";
import gift14 from "../assets/gifts/14-spa.jpg";
import gift15 from "../assets/gifts/15-calmante.jpg";
import gift16 from "../assets/gifts/16-mascaras-gas.jpg";
import gift17 from "../assets/gifts/17-academia.jpg";
import gift18 from "../assets/gifts/18-avental.jpg";
import gift19 from "../assets/gifts/19-sal-grosso.jpg";
import gift20 from "../assets/gifts/20-rolo-macarrao.jpg";
import gift21 from "../assets/gifts/21-fogao.jpg";
import gift22 from "../assets/gifts/22-panelas.jpg";
import gift23 from "../assets/gifts/23-colorex.jpg";
import gift24 from "../assets/gifts/24-sanduicheira.jpg";

const giftImages: Record<number, string> = {
  1: gift1,
  2: gift2,
  3: gift3,
  4: gift4,
  5: gift5,
  6: gift6,
  7: gift7,
  8: gift8,
  9: gift9,
  10: gift10,
  11: gift11,
  12: gift12,
  13: gift13,
  14: gift14,
  15: gift15,
  16: gift16,
  17: gift17,
  18: gift18,
  19: gift19,
  20: gift20,
  21: gift21,
  22: gift22,
  23: gift23,
  24: gift24,
};

export const gifts: Gift[] = [
  {
    id: 1,
    title: "Cota da Festa de Casamento",
    price: 500,
    image: giftImages[1],
    cotas: 20,
  },
  {
    id: 2,
    title: "Coberta para Noiva (sempre coberta de razão)",
    price: 250,
    image: giftImages[2],
    cotas: 1,
  },
  {
    id: 3,
    title: "PS5 para o Noivo",
    price: 1499,
    image: giftImages[3],
    cotas: 2,
  },
  {
    id: 4,
    title: "Cota do Kit Turbo de padaria",
    price: 300,
    image: giftImages[4],
    cotas: 10,
  },
  {
    id: 5,
    title: "Geladeira",
    price: 1599,
    image: giftImages[5],
    cotas: 2,
  },
  {
    id: 6,
    title: "Microondas",
    price: 295,
    image: giftImages[6],
    cotas: 1,
  },
  {
    id: 7,
    title: "Cafeteira",
    price: 150,
    image: giftImages[7],
    cotas: 1,
  },
  {
    id: 8,
    title: "Pipoqueira elétrica",
    price: 50,
    image: giftImages[8],
    cotas: 1,
  },
  {
    id: 9,
    title: "Chaleira Elétrica",
    price: 60,
    image: giftImages[9],
    cotas: 1,
  },
  {
    id: 10,
    title: "Cota do Vestido da Noiva",
    price: 400,
    image: giftImages[10],
    cotas: 10,
  },
  {
    id: 11,
    title: "Corte de Cabelo do Noivo",
    price: 35,
    image: giftImages[11],
    cotas: 1,
  },
  {
    id: 12,
    title: "Dia da Noiva",
    price: 200,
    image: giftImages[12],
    cotas: 5,
  },
  {
    id: 13,
    title: "Fundo Emergencial para TPM",
    price: 100,
    image: giftImages[13],
    cotas: 10,
  },
  {
    id: 14,
    title: "Vale SPA para 'Paz Pós-Briga'",
    price: 300,
    image: giftImages[14],
    cotas: 2,
  },
  {
    id: 15,
    title: "Calmante para o Noivo (após ver a conta do casamento)",
    price: 50,
    image: giftImages[15],
    cotas: 5,
  },
  {
    id: 16,
    title: "Máscaras de Gás (Para trocar as fraldas dos futuros filhos)",
    price: 30,
    image: giftImages[16],
    cotas: 5,
  },
  {
    id: 17,
    title: "Academia (recuperação pós-buffet do casamento)",
    price: 120,
    image: giftImages[17],
    cotas: 5,
  },
  {
    id: 18,
    title: "Avental pro Noivo aprender a cozinhar",
    price: 40,
    image: giftImages[18],
    cotas: 1,
  },
  {
    id: 19,
    title: "Sal Grosso (espantar mau-olhado)",
    price: 9.99,
    image: giftImages[19],
    cotas: 100,
  },
  {
    id: 20,
    title: "Rolo de Macarrão (para quando a Noiva achar necessário)",
    price: 20,
    image: giftImages[20],
    cotas: 1,
  },
  {
    id: 21,
    title: "Fogão 6 bocas (para cozinhar os jantares românticos)",
    price: 799,
    image: giftImages[21],
    cotas: 1,
  },
  {
    id: 22,
    title: "Jogo completo de panelas",
    price: 395,
    image: giftImages[22],
    cotas: 1,
  },
  {
    id: 23,
    title: "Jogo completo Colorex",
    price: 650,
    image: giftImages[23],
    cotas: 1,
  },
  {
    id: 24,
    title: "Sanduicheira/Grill Elétrica",
    price: 99,
    image: giftImages[24],
    cotas: 1,
  },
];
