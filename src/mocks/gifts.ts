export interface Gift {
  id: number;
  title: string;
  price: number;
  image?: string;
  cotas: number;
}

export const gifts: Gift[] = [
  {
    id: 1,
    title: "Cota da Festa de Casamento",
    price: 500,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop",
    cotas: 20,
  },
  {
    id: 2,
    title: "Coberta para Noiva (sempre coberta de razão)",
    price: 250,
    image:
      "https://izabellaepatrick.innovationconsultoria.com.br/wp-content/uploads/2025/01/COBERTOR-PARA-A-NOIVA-QUE-ESTA-SEMPRE-COBERTA-DE-RAZAO.jpg",
    cotas: 1,
  },
  {
    id: 3,
    title: "PS5 para o Noivo",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop",
    cotas: 2,
  },
  {
    id: 4,
    title: "Cota do Kit Turbo de padaria",
    price: 300,
    image:
      "https://cdn.awsli.com.br/600x450/2083/2083321/produto/211799502/kit-turbo-apr-dtr6054-vw-golf-gti-mk7-jetta-gli-tiguan-audi-a3-s3-tt-tts-t410000-bpy1mr9z01.png",
    cotas: 10,
  },
  {
    id: 5,
    title: "Geladeira",
    price: 1599,
    image:
      "https://img.freepik.com/fotos-premium/congelador-de-geladeira-inoxidavel-moderno-em-um-banner-de-layout-de-maquete-de-fundo-cinza-renderizacao-em-3d_91497-9238.jpg",
    cotas: 2,
  },
  {
    id: 6,
    title: "Microondas",
    price: 295,
    image:
      "https://st3.depositphotos.com/1010613/32552/i/450/depositphotos_325528816-stock-photo-young-man-preparing-food-microwave.jpg",
    cotas: 1,
  },
  {
    id: 7,
    title: "Cafeteira",
    price: 150,
    image:
      "https://http2.mlstatic.com/D_NQ_NP_642678-MLB80378827965_112024-O.webp",
    cotas: 1,
  },
  {
    id: 8,
    title: "Pipoqueira elétrica",
    price: 50,
    image:
      "https://a-static.mlcdn.com.br/800x600/pipoqueira-eletrica-mondial-popflix-pp-03-1200w/magazineluiza/236682600/a2229c369f3df5b117704f880e75e259.jpg",
    cotas: 1,
  },
  {
    id: 9,
    title: "Chaleira Elétrica",
    price: 60,
    image:
      "https://media.istockphoto.com/id/617354074/pt/foto/electric-kettle-in-hand-on-the-background-of-the-kitchen.jpg?s=612x612&w=0&k=20&c=t8DBFw-KnFwklcYbbP89SRQt_TUKiy12eRlZU4MZAro=",
    cotas: 1,
  },
  {
    id: 10,
    title: "Cota do Vestido da Noiva",
    price: 400,
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&h=300&fit=crop",
    cotas: 10,
  },
  {
    id: 11,
    title: "Corte de Cabelo do Noivo",
    price: 35,
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop",
    cotas: 1,
  },
  {
    id: 12,
    title: "Dia da Noiva",
    price: 200,
    image:
      "https://revista.icasei.com.br/wp-content/uploads/2018/08/dia_da_noiva_5.jpg",
    cotas: 5,
  },
  {
    id: 13,
    title: "Fundo Emergencial para TPM",
    price: 100,
    image:
      "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=300&fit=crop",
    cotas: 10,
  },
  {
    id: 14,
    title: "Vale SPA para 'Paz Pós-Briga'",
    price: 300,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop",
    cotas: 2,
  },
  {
    id: 15,
    title: "Calmante para o Noivo (após ver a conta do casamento)",
    price: 50,
    image:
      "https://www.cannabisesaude.com.br/wp-content/uploads/2025/08/calmantes-que-nao-precisam-de-receita-quais-sao-efeitos-colaterais-do-uso.jpg",
    cotas: 5,
  },
  {
    id: 16,
    title: "Máscaras de Gás (Para trocar as fraldas dos futuros filhos)",
    price: 30,
    image:
      "https://wallpapers.com/images/hd/digital-poster-soldier-full-gas-mask-mpwilvgtw0u2idbx.jpg",
    cotas: 5,
  },
  {
    id: 17,
    title: "Academia (recuperação pós-buffet do casamento)",
    price: 120,
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    cotas: 5,
  },
  {
    id: 18,
    title: "Avental pro Noivo aprender a cozinhar",
    price: 40,
    image:
      "https://images.tcdn.com.br/img/img_prod/890047/conjunto_avental_super_chef_aprendiz_pai_filho_oxford_brasfoot_62529_3_7e127301da104c946cbfb32f58b2576f.jpg",
    cotas: 1,
  },
  {
    id: 19,
    title: "Sal Grosso (espantar mau-olhado)",
    price: 9.99,
    image:
      "https://img.freepik.com/fotos-premium/monte-de-sal-grosso_846485-10503.jpg",
    cotas: 100,
  },
  {
    id: 20,
    title: "Rolo de Macarrão (para quando a Noiva achar necessário)",
    price: 20,
    image:
      "https://st3.depositphotos.com/1004592/35511/i/450/depositphotos_355113480-stock-photo-rolling-pin-studio.jpg",
    cotas: 1,
  },
  {
    id: 21,
    title: "Fogão 6 bocas (para cozinhar os jantares românticos)",
    price: 799,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyBiA2QBhvcM0CD0wnBKPFdu_jisCkbhV38g&s",
    cotas: 1,
  },
  {
    id: 21,
    title: "Jogo completo de panelas",
    price: 395,
    image:
      "https://m.media-amazon.com/images/I/61idC1uINlL._AC_UF894,1000_QL80_.jpg",
    cotas: 1,
  },

  {
    id: 21,
    title: "Jogo completo Colorex",
    price: 650,
    image:
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiBnFnR8aqSvks_7ChxS8DpmbG-kamxd65MEX6myWky7CCCf8IaoG6rHIOwJHfKyyIIpeFpNwylKDLjZR_ACMqP7gNCfOD9hxULCfnvLZLXjiHIV2teqCqQjdGaodeJUq7WDMq8x-87rX2n/s1600/F3EED0B8-E08F-47F4-8EB3-C0F7CBA91323.jpeg",
    cotas: 1,
  },
  {
    id: 21,
    title: "Sanduicheira/Grill Elétrica",
    price: 99,
    image:
      "https://m.media-amazon.com/images/S/aplus-media-library-service-media/687a71ae-d12a-404c-80f0-4a9e6bccc0aa.__CR0,1,970,600_PT0_SX970_V1___.png",
    cotas: 1,
  },
];
