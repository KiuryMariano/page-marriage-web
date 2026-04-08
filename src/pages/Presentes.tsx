import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import wallpaper from "../assets/wallpaper_1.JPEG";
import { colors, gradients } from "../theme";
import { gifts, type Gift } from "../mocks";

interface CartItem extends Gift {
  quantity: number;
}

const formatPrice = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const Presentes = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPresenceModalOpen, setIsPresenceModalOpen] = useState(true);

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
    alert(
      `Total do carrinho: ${formatPrice(cartTotal)}\n\nRedirecionando para pagamento...`,
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed left-0 right-0 top-0 bottom-[120px] pointer-events-none overflow-hidden z-0">
        {/* Floating Money Signs */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`money-${i}`}
              className="absolute animate-float-money font-bold"
              style={{
                left: `${5 + i * 7}%`,
                bottom: `-100px`,
                animationDelay: `${i * 4}s`,
                animationDuration: `${18 + Math.random() * 8}s`,
                fontSize: `${30 + Math.random() * 36}px`,
                fontFamily: "Arial, sans-serif",
                color: colors.primary[500],
                opacity: 0.5,
              }}
            >
              $
            </div>
          ))}
        </div>

        {/* Notebook Lines (subtle) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="notebookLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0" />
              <stop offset="5%" stopColor="#1e3a8a" stopOpacity="0.3" />
              <stop offset="95%" stopColor="#1e3a8a" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <line
              key={`line-${i}`}
              x1="0"
              y1={`${(i + 1) * 5}%`}
              x2="100%"
              y2={`${(i + 1) * 5}%`}
              stroke="url(#notebookLine)"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      {/* Custom animations via style tag */}
      <style>{`
        @keyframes float-money {
          0% {
            transform: translateY(0) translateX(0) rotate(-15deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-50vh) translateX(15px) rotate(15deg) scale(1.2);
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-120vh) translateX(-15px) rotate(-10deg) scale(0.8);
            opacity: 0;
          }
        }

        .animate-float-money {
          animation: float-money linear infinite;
        }
      `}</style>

      <Navbar />

      {/* Modal de Importância da Presença */}
      {isPresenceModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={() => setIsPresenceModalOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-lg w-full p-5 md:p-8 relative transform transition-all">
              {/* Botão de fechar */}
              <button
                onClick={() => setIsPresenceModalOpen(false)}
                className="absolute top-3 right-3 md:top-4 md:right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg
                  className="w-5 h-5 md:w-6 md:h-6"
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

              {/* Conteúdo do modal */}
              <div className="text-center">
                {/* Alerta pulsante */}
                <div className="flex justify-center mb-4 md:mb-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-red-500 text-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-7 h-7 md:w-8 md:h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <h2
                  className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-5"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Um Aviso Importante!
                </h2>

                <div className="space-y-4 text-gray-700 text-center text-base md:text-lg leading-relaxed">
                  <p
                    className="font-bold"
                    style={{ color: colors.primary[600] }}
                  >
                    Sua presença é nosso maior presente!
                  </p>

                  <p className="text-sm md:text-base">
                    Ter você conosco neste dia especial já nos deixa imensamente
                    felizes. É isso que mais{" "}
                    <span className="font-bold" style={{ color: "#1e40af" }}>
                      valorizamos
                    </span>
                    .
                  </p>

                  <p className="text-sm md:text-base">
                    Se você quiser nos presentear, separamos algumas opções
                    digitais especiais abaixo. Qualquer valor será{" "}
                    <span className="font-bold" style={{ color: "#059669" }}>
                      muito bem-vindo
                    </span>
                    !
                  </p>

                  <div className="relative pt-2">
                    <div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1"
                      style={{
                        background: gradients.horizontal.primaryLight,
                      }}
                    ></div>
                    <p className="pt-2 text-sm md:text-base text-gray-600 italic">
                      Graças a Deus já temos nossa casa mobiliada, então o
                      presente digital é a melhor opção para nós.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPresenceModalOpen(false)}
                  className="mt-5 md:mt-6 w-full text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    background: gradients.primary,
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <main>
        {/* Floating Cart Button - ajustado para mobile com navbar inferior */}
        <button
          onClick={() => setIsCartOpen(true)}
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
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsCartOpen(false)}
            />
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
              <div className="p-4 md:p-6 border-b flex items-center justify-between">
                <h2
                  className="text-xl md:text-2xl font-semibold"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Carrinho
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
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
                      <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        <section className="relative min-h-[50vh] md:min-h-[55vh] lg:min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={wallpaper}
              alt="Letícia e Kiury"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-white"></div>
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

        {/* Tutorial Como Funciona */}
        <section className="py-10 md:py-16 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative mb-12 md:mb-16">
              {/* Elemento decorativo superior */}
              <div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 md:w-32 h-1"
                style={{
                  background: gradients.horizontal.primary,
                }}
              ></div>

              <div className="text-center mb-8 md:mb-10">
                <div className="inline-flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-lg text-white"
                    style={{
                      background: gradients.primary,
                    }}
                  >
                    <svg
                      className="w-7 h-7 md:w-8 md:h-8"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  </div>
                  <h3
                    className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    Como Presentear?
                  </h3>
                </div>
                <div
                  className="w-32 md:w-40 h-1 mx-auto"
                  style={{
                    background: gradients.horizontal.primaryLight,
                  }}
                ></div>
              </div>

              <div className="grid md:grid-cols-3 gap-5 md:gap-7">
                <div
                  className="bg-white rounded-xl p-5 md:p-6 shadow-md border-l-4 hover:shadow-xl transition-all hover:-translate-y-1"
                  style={{ borderLeftColor: colors.primary[500] }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg"
                      style={{
                        background: gradients.secondary,
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

                <div
                  className="bg-white rounded-xl p-5 shadow-md border-l-4 hover:shadow-xl transition-all hover:-translate-y-1"
                  style={{ borderLeftColor: "#f59e0b" }}
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

                <div
                  className="bg-white rounded-xl p-5 shadow-md border-l-4 hover:shadow-xl transition-all hover:-translate-y-1"
                  style={{ borderLeftColor: "#f59e0b" }}
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

              {/* Elemento decorativo inferior */}
              <div
                className="absolute -bottom-8 md:-bottom-10 left-1/2 transform -translate-x-1/2 w-24 md:w-32 h-1"
                style={{
                  background: gradients.horizontal.primary,
                }}
              ></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mt-10 md:mt-12">
              {gifts.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col border-l-4 relative z-10 overflow-hidden"
                  style={{ borderLeftColor: colors.primary[500] }}
                >
                  <div className="h-24 sm:h-28 md:h-32 overflow-hidden">
                    <img
                      src={gift.image}
                      alt={gift.title}
                      className="w-full h-full object-cover"
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
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded-full border border-blue-200">
                        <svg
                          className="w-3 h-3 text-blue-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[10px] font-medium text-blue-700">
                          {gift.cotas === 1
                            ? "Cota única"
                            : `${gift.cotas} cotas disponíveis`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <p
                        className="text-base md:text-lg font-bold"
                        style={{ color: colors.primary[600] }}
                      >
                        {formatPrice(gift.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(gift)}
                      className="w-full text-white font-semibold py-2.5 md:py-3 px-4 rounded-lg transition-all hover:shadow-md active:scale-95 text-sm md:text-base flex items-center justify-center gap-2"
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Presentes;
