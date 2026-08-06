import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import wallpaperWebpFull from "../assets/wallpaper_2.webp";
import wallpaperWebpTablet from "../assets/wallpaper_2_tablet.webp";
import wallpaperWebpMobile from "../assets/wallpaper_2_mobile.webp";
import backgroundMoney from "../assets/background_money.webp";
import backgroundMoneyMobile from "../assets/background_money_mobile.webp";
import { colors, gradients } from "../theme";
import { type Gift } from "../mocks";
import { useCartPersist } from "../hooks/useCartPersist";
import { useGifts } from "../hooks/useGifts";

const formatPrice = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const capitalize = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const Presentes = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useCartPersist();
  const { gifts, loading, error } = useGifts();

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [cotasFilter, setCotasFilter] = useState<string>("todos");

  // Modal de filtros (mobile)
  const [openFilterModal, setOpenFilterModal] = useState<"categoria" | "cotas" | null>(null);

  // Carrossel de cards
  const [activeCard, setActiveCard] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Detectar scroll do carrossel e atualizar card ativo
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const carouselWidth = carousel.offsetWidth;
      const cardWidth = carouselWidth * 0.85;
      const gap = 20;
      const totalCardWidth = cardWidth + gap;

      // Calcular qual card está mais visível (baseado no centro do container)
      const centerOffset = scrollLeft + (carouselWidth / 2);
      const cardIndex = Math.round((centerOffset - (carouselWidth * 0.075)) / totalCardWidth);

      setActiveCard(Math.min(Math.max(cardIndex, 0), 2));
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para navegar para um card específico
  const scrollToCard = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const carouselWidth = carousel.offsetWidth;
    const cardWidth = carouselWidth * 0.85;
    const gap = 20;
    // Calcular posição para centralizar o card
    const scrollPosition = index * (cardWidth + gap) - (carouselWidth * 0.075);
    carousel.scrollTo({ left: Math.max(0, scrollPosition), behavior: 'smooth' });
  };

  // Função para ir ao card anterior
  const goToPrevious = () => {
    if (activeCard > 0) {
      scrollToCard(activeCard - 1);
    }
  };

  // Função para ir ao próximo card
  const goToNext = () => {
    if (activeCard < 2) {
      scrollToCard(activeCard + 1);
    }
  };

  // Extrair categorias únicas dos presentes
  const categories = useMemo(() => {
    const cats = new Set(gifts.map(g => g.categoria || "Sem categoria").filter(Boolean));
    return ["todos", ...Array.from(cats).sort()];
  }, [gifts]);

  // Aplicar filtros
  const filteredGifts = useMemo(() => {
    let result = gifts.filter(gift => {
      // Filtro por categoria
      if (selectedCategory !== "todos" && gift.categoria !== selectedCategory) {
        return false;
      }
      return true;
    });

    // Filtro e ordenação por cotas
    if (cotasFilter === "mais_cotas") {
      // Ordena do maior para o menor
      result = [...result].sort((a, b) => b.cotas - a.cotas);
    } else if (cotasFilter === "menos_cotas") {
      // Apenas disponíveis, ordena do menor para o maior
      result = [...result].filter(g => g.cotas > 0).sort((a, b) => a.cotas - b.cotas);
    } else if (cotasFilter === "esgotado") {
      // Apenas esgotados
      result = [...result].filter(g => g.cotas === 0);
    }

    return result;
  }, [gifts, selectedCategory, cotasFilter]);

  const addToCart = (gift: Gift) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === gift.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === gift.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prevCart, { ...gift, quantity: 1 }];
    });
  };

  const removeFromCart = (giftId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== giftId));
  };

  const updateQuantity = (giftId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(giftId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === giftId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    navigate("/pagamento");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Fixo */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: `url(${backgroundMoney})` }}
      ></div>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${backgroundMoneyMobile})` }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
      </div>

      <Navbar />

      <main>
        {/* Floating Cart Button - ajustado para mobile com navbar inferior */}
        <button
          onClick={() => setIsCartOpen(true)}
          aria-label={`Abrir carrinho${cartItemCount > 0 ? ` com ${cartItemCount} item(ns)` : ""}`}
          className="fixed bottom-24 md:bottom-6 right-6 z-40 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
          style={{
            background: gradients.primary,
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* Cart Sidebar */}
        {isCartOpen && (
          <>
          <div
            className="fixed inset-0 bg-black/50 z-[70]"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-[90%] md:w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col">
              <div className="p-4 md:p-6 border-b flex items-center justify-between">
                <h2
                  className="text-xl md:text-2xl font-semibold"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Carrinho
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  aria-label="Fechar carrinho"
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <svg
                    className="w-24 h-24 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-lg">Seu carrinho está vazio</p>
                  <p className="text-sm mt-2 flex items-center gap-2">
                    Adicione presentes se quiser!
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/imagens-presentes/sem-imagem.png';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-gray-800 text-sm md:text-base truncate"
                            style={{ fontFamily: '"Playfair Display", serif' }}
                          >
                            {item.title}
                          </h3>
                          <p
                            className="font-bold text-sm md:text-base"
                            style={{ color: colors.primary[600] }}
                          >
                            {formatPrice(item.price)}
                          </p>
                          <div className="flex items-center gap-1 md:gap-2 mt-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-6 h-6 md:w-7 md:h-7 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center font-bold text-sm"
                            >
                              -
                            </button>
                            <span className="w-6 md:w-8 text-center font-medium text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-6 h-6 md:w-7 md:h-7 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center font-bold text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1 md:p-2 shrink-0"
                        >
                          <svg
                            className="w-4 h-4 md:w-5 md:h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 md:p-6 border-t bg-gray-50">
                    <button
                      onClick={clearCart}
                      className="w-full text-gray-500 text-xs md:text-sm py-1.5 hover:text-red-600 transition-colors mb-3 md:mb-4 flex items-center justify-center gap-1.5"
                    >
                      <svg
                        className="w-3.5 h-3.5 md:w-4 md:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Limpar carrinho
                    </button>
                    <div className="flex justify-between items-center mb-3 md:mb-4">
                      <span className="text-base md:text-lg text-gray-600">
                        Total:
                      </span>
                      <span
                        className="text-2xl md:text-3xl font-bold"
                        style={{ color: colors.primary[600] }}
                      >
                        {formatPrice(cartTotal)}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-colors text-base md:text-lg"
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        background: gradients.primary,
                      }}
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* Hero Section com Wallpaper */}
        <section className="relative h-[25vh] md:h-[55vh] lg:h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={wallpaperWebpFull}
              alt="Letícia e Kiury"
              srcSet={`${wallpaperWebpMobile} 800w, ${wallpaperWebpTablet} 1400w, ${wallpaperWebpFull} 6182w`}
              sizes="100vw"
              className="w-full h-full object-cover object-center"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#FDFBF8] via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center text-white px-4 py-12 md:py-16">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl px-4 md:px-8"
              style={{
                fontFamily: '"Great Vibes", cursive',
                textShadow:
                  "0 4px 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.6)",
              }}
            >
              Lista de Presentes
            </h1>
          </div>
        </section>

        {/* Textos de introdução */}
        <section className="py-2 md:py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Container único com borda decorativa envolvendo as duas colunas */}
            <div className="relative p-6 md:p-8">
              {/* Bordas decorativas nos cantos - apenas desktop */}
              <div
                className="hidden md:block absolute top-0 left-0 w-6 h-6 md:w-8 md:h-8 border-t-4 border-l-4 rounded-tl-lg"
                style={{ borderColor: colors.primary[500] }}
              ></div>
              <div
                className="hidden md:block absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 border-t-4 border-r-4 rounded-tr-lg"
                style={{ borderColor: colors.primary[500] }}
              ></div>
              <div
                className="hidden md:block absolute bottom-0 left-0 w-6 h-6 md:w-8 md:h-8 border-b-4 border-l-4 rounded-bl-lg"
                style={{ borderColor: colors.primary[500] }}
              ></div>
              <div
                className="hidden md:block absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 border-b-4 border-r-4 rounded-br-lg"
                style={{ borderColor: colors.primary[500] }}
              ></div>

              {/* Linha decorativa superior */}
              <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-300"></div>
                <svg
                  className="w-6 h-6"
                  style={{ color: colors.primary[500] }}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-300"></div>
              </div>

              {/* Conteúdo em 2 colunas */}
              <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
                {/* Coluna 1: Aviso sobre a presença */}
                <div className="text-center">
                  <h2
                    className="text-2xl md:text-4xl lg:text-5xl mb-4"
                    style={{
                      fontFamily: '"Great Vibes", cursive',
                      color: colors.primary[700],
                      lineHeight: 1.3,
                    }}
                  >
                    Sua presença é nosso maior presente!
                  </h2>
                  <div className="space-y-3 md:space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
                    <p>
                      Ter você conosco neste dia especial já nos deixa
                      imensamente felizes. É isso que mais{" "}
                      <span className="font-bold" style={{ color: "#1e40af" }}>
                        valorizamos
                      </span>
                      .
                    </p>
                    <p>
                      Se você quiser nos presentear, separamos algumas opções
                      digitais especiais abaixo. Qualquer valor será{" "}
                      <span className="font-bold" style={{ color: "#059669" }}>
                        muito bem-vindo
                      </span>
                      !
                    </p>
                    <p className="text-gray-600 italic">
                      Graças a Deus já temos nossa casa mobiliada, então o
                      presente digital é a melhor opção para nós.
                    </p>
                  </div>
                </div>

                {/* Coluna 2: Como Presentear? */}
                <div className="text-center">
                  <h2
                    className="text-2xl md:text-4xl lg:text-5xl mb-4"
                    style={{
                      fontFamily: '"Great Vibes", cursive',
                      color: colors.primary[700],
                      lineHeight: 1.3,
                    }}
                  >
                    Como Presentear?
                  </h2>
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm md:text-base text-center text-gray-600 leading-relaxed font-light">
                      Siga os passos abaixo para nos presentear
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 italic">
                      É simples e rápido!
                    </p>
                  </div>
                </div>
              </div>

              {/* Linha decorativa inferior */}
              <div className="flex items-center justify-center gap-4 mt-6 md:mt-8 mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-300"></div>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.primary[500] }}
                ></div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-300"></div>
              </div>

              {/* Seta animada */}
              <div className="flex justify-center animate-bounce">
                <svg
                  className="w-5 h-5"
                  style={{ color: colors.primary[500] }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Cards de Como Funciona */}
        <section className="pb-8 md:pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Container com carrossel no mobile, grid no desktop */}
            <div
              ref={carouselRef}
              className="flex md:grid md:grid-cols-3 gap-5 md:gap-7 overflow-x-auto overflow-y-visible snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 items-stretch"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <style>{`
                div[ref="${carouselRef}"]::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {/* Card 1 */}
              <div
                className="bg-white rounded-xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all flex-shrink-0 w-[85vw] md:w-auto snap-center self-stretch"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                    }}
                  >
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-base md:text-lg">
                      Escolha os Presentes
                    </h4>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: colors.primary[600] }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>Navegue pelos cards e escolha os itens</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: colors.primary[600] }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>
                      Clique em <strong>"Adicionar"</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: colors.primary[600] }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>Adicione quantos quiser</span>
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div
                className="bg-white rounded-xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all flex-shrink-0 w-[85vw] md:w-auto snap-center self-stretch"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                    }}
                  >
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-base md:text-lg">
                      Revise o Carrinho
                    </h4>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: colors.primary[600] }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>Clique no ícone do carrinho</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: colors.primary[600] }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>Ajuste quantidades ou remova itens</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: colors.primary[600] }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>Confira o total antes de finalizar</span>
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="bg-white rounded-xl p-5 md:p-6 shadow-lg hover:shadow-2xl transition-all flex-shrink-0 w-[85vw] md:w-auto snap-center self-stretch"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
                    }}
                  >
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-base md:text-lg">
                      Finalize o Presente
                    </h4>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: colors.primary[600] }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>
                      Clique em <strong>"Finalizar Compra"</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: colors.primary[600] }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>Escolha o método de pagamento</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: colors.primary[100] }}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        style={{ color: colors.primary[600] }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span>Pronto! Muito obrigado!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Setas de navegação do carrossel - apenas mobile */}
            <div className="flex justify-center items-center gap-6 mt-6 md:hidden">
              {/* Seta Anterior */}
              <button
                onClick={goToPrevious}
                disabled={activeCard === 0}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  activeCard === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                }`}
                aria-label="Anterior"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Indicador de posição */}
              <span className="text-sm font-medium text-gray-600">
                {activeCard + 1} / 3
              </span>

              {/* Seta Próximo */}
              <button
                onClick={goToNext}
                disabled={activeCard === 2}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  activeCard === 2
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                }`}
                aria-label="Próximo"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Filtros */}
        <section className="pb-2 md:pb-3 px-4">
          <div className="max-w-6xl mx-auto mb-3">
            <p className="text-sm text-gray-600 text-center">
              Utilize os filtros abaixo para facilitar sua consulta aos presentes.
            </p>
          </div>
          <div className="max-w-6xl mx-auto flex gap-3 md:gap-4">
            {/* Filtro por Categoria */}
            <div className="relative flex-1">
              <button
                onClick={() => setOpenFilterModal("categoria")}
                className="w-full inline-flex justify-between gap-x-0.5 rounded-xl px-4 py-3 md:px-3 md:py-2 text-sm md:text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 border-0 bg-white text-orange-600"
              >
                <span className="truncate">{selectedCategory === "todos" ? "Categorias" : capitalize(selectedCategory)}</span>
                <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 md:size-5 shrink-0 text-orange-600" />
              </button>
            </div>

            {/* Filtro por Cotas */}
            <div className="relative flex-1">
              <button
                onClick={() => setOpenFilterModal("cotas")}
                className="w-full inline-flex justify-between gap-x-0.5 rounded-xl px-4 py-3 md:px-3 md:py-2 text-sm md:text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 border-0 bg-white text-orange-600"
              >
                <span className="truncate">
                  {cotasFilter === "todos"
                    ? "Cotas"
                    : cotasFilter === "mais_cotas"
                    ? "Mais"
                    : cotasFilter === "menos_cotas"
                    ? "Menos"
                    : "Esgotado"}
                </span>
                <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 md:size-5 shrink-0 text-orange-600" />
              </button>
            </div>
          </div>
        </section>

        {/* Modal - Categoria */}
        {openFilterModal === "categoria" && (
          <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setOpenFilterModal(null)}
            />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xs max-h-[60vh] flex flex-col">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-semibold text-orange-600" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Categorias
                  </h2>
                  <button
                    onClick={() => setOpenFilterModal(null)}
                    className="text-orange-600 hover:text-orange-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500">Selecione uma categoria para filtrar os presentes</p>
              </div>
              <div className="overflow-y-auto p-2 space-y-1">
                <button
                  onClick={() => { setSelectedCategory("todos"); setOpenFilterModal(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === "todos"
                      ? "bg-orange-100 text-orange-700"
                      : "text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  Todas
                </button>
                {categories.slice(1).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setOpenFilterModal(null); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-orange-100 text-orange-700"
                        : "text-orange-600 hover:bg-orange-50"
                    }`}
                  >
                    {capitalize(cat)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal - Cotas */}
        {openFilterModal === "cotas" && (
          <div className="fixed inset-0 z-30 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setOpenFilterModal(null)}
            />
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xs max-h-[60vh] flex flex-col">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-base font-semibold text-orange-600" style={{ fontFamily: '"Playfair Display", serif' }}>
                    Cotas
                  </h2>
                  <button
                    onClick={() => setOpenFilterModal(null)}
                    className="text-orange-600 hover:text-orange-700 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-gray-500">Cotas são a quantidade disponível de cada presente para escolha</p>
              </div>
              <div className="overflow-y-auto p-2 space-y-1">
                <button
                  onClick={() => { setCotasFilter("todos"); setOpenFilterModal(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    cotasFilter === "todos"
                      ? "bg-orange-100 text-orange-700"
                      : "text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => { setCotasFilter("mais_cotas"); setOpenFilterModal(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    cotasFilter === "mais_cotas"
                      ? "bg-orange-100 text-orange-700"
                      : "text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  Mais cotas disponíveis
                </button>
                <button
                  onClick={() => { setCotasFilter("menos_cotas"); setOpenFilterModal(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    cotasFilter === "menos_cotas"
                      ? "bg-orange-100 text-orange-700"
                      : "text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  Menos cotas disponíveis
                </button>
                <button
                  onClick={() => { setCotasFilter("esgotado"); setOpenFilterModal(null); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    cotasFilter === "esgotado"
                      ? "bg-orange-100 text-orange-700"
                      : "text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  Esgotado
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid de Presentes */}
        <section className="pb-8 md:pb-12 px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Carregando presentes...</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 text-blue-600 hover:text-blue-800 underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {/* Sem resultados */}
            {!loading && !error && filteredGifts.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
                <p className="text-yellow-800 text-lg">
                  Nenhum presente encontrado com os filtros selecionados.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("todos");
                    setCotasFilter("todos");
                  }}
                  className="mt-3 text-blue-600 hover:text-blue-800 underline"
                >
                  Limpar filtros
                </button>
              </div>
            )}

            {/* Gifts Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mt-10 md:mt-12">
                {filteredGifts.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col relative z-10 overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden p-3">
                    <img
                      src={gift.image}
                      alt={gift.title}
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        e.currentTarget.src = '/imagens-presentes/sem-imagem.png';
                      }}
                    />
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <h3
                      className="text-base md:text-lg font-semibold text-gray-800 leading-tight mb-2 md:mb-3"
                      style={{
                        fontFamily: '"Playfair Display", serif',
                        fontSize: "1rem",
                        lineHeight: "1.25",
                      }}
                    >
                      {gift.title}
                    </h3>

                    <div className="flex-1"></div>

                    <div className="mb-2 md:mb-3">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${
                          gift.cotas === 0
                            ? "bg-red-50 border-red-200"
                            : gift.cotas <= 2
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-blue-50 border-blue-200"
                        }`}
                      >
                        <svg
                          className={`w-3 h-3 ${
                            gift.cotas === 0
                              ? "text-red-600"
                              : gift.cotas <= 2
                              ? "text-yellow-600"
                              : "text-blue-600"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span
                          className={`text-[10px] font-medium ${
                            gift.cotas === 0
                              ? "text-red-700"
                              : gift.cotas <= 2
                              ? "text-yellow-700"
                              : "text-blue-700"
                          }`}
                        >
                          {gift.cotas === 0
                            ? "Esgotado"
                            : gift.cotas === 1
                            ? "Cota única"
                            : `${gift.cotas} cotas disponíveis`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <p
                        className="text-base md:text-lg font-bold"
                        style={{ color: gradients.primary }}
                      >
                        {formatPrice(gift.price)}
                      </p>
                    </div>

                    {gift.cotas > 0 ? (
                      <button
                        onClick={() => addToCart(gift)}
                        className="w-full text-white font-semibold py-2 px-4 rounded-lg transition-all hover:shadow-md active:scale-95 text-sm md:text-base flex items-center justify-center gap-2"
                        style={{
                          fontFamily: '"Playfair Display", serif',
                          background: gradients.primary,
                        }}
                      >
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                          />
                        </svg>
                        Adicionar
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full text-gray-500 font-semibold py-2.5 md:py-3 px-4 rounded-lg text-sm md:text-base flex items-center justify-center gap-2 bg-gray-100 cursor-not-allowed"
                        style={{
                          fontFamily: '"Playfair Display", serif',
                        }}
                      >
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        PRESENTEADO
                      </button>
                    )}
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Presentes;
