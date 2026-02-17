import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import wallpaper from "../assets/wallpaper_1.JPEG";

interface Gift {
  id: number;
  emoji: string;
  title: string;
  price: string;
  priceNumber: number;
  gradient: string;
}

interface CartItem extends Gift {
  quantity: number;
}

const gifts: Gift[] = [
  {
    id: 1,
    emoji: "🍽️",
    title: "Jantar Romântico",
    price: "R$ 300,00",
    priceNumber: 300,
    gradient: "from-amber-100 to-amber-200",
  },
  {
    id: 2,
    emoji: "💐",
    title: "Buquê de Flores",
    price: "R$ 150,00",
    priceNumber: 150,
    gradient: "from-pink-100 to-pink-200",
  },
  {
    id: 3,
    emoji: "✈️",
    title: "Lua de Mel",
    price: "R$ 500,00",
    priceNumber: 500,
    gradient: "from-blue-100 to-blue-200",
  },
  {
    id: 4,
    emoji: "🏠",
    title: "Casa Nova",
    price: "R$ 200,00",
    priceNumber: 200,
    gradient: "from-green-100 to-green-200",
  },
  {
    id: 5,
    emoji: "🍷",
    title: "Vinho Especial",
    price: "R$ 100,00",
    priceNumber: 100,
    gradient: "from-purple-100 to-purple-200",
  },
  {
    id: 6,
    emoji: "🛏️",
    title: "Coberta pro Noivo",
    price: "R$ 50,00",
    priceNumber: 50,
    gradient: "from-blue-100 to-indigo-200",
  },
  {
    id: 7,
    emoji: "💍",
    title: "Anel de Noivado",
    price: "R$ 2.000,00",
    priceNumber: 2000,
    gradient: "from-yellow-100 to-yellow-200",
  },
  {
    id: 8,
    emoji: "📸",
    title: "Ensaio de Casamento",
    price: "R$ 400,00",
    priceNumber: 400,
    gradient: "from-rose-100 to-rose-200",
  },
  {
    id: 9,
    emoji: "🎂",
    title: "Bolo de Casamento",
    price: "R$ 250,00",
    priceNumber: 250,
    gradient: "from-orange-100 to-orange-200",
  },
  {
    id: 10,
    emoji: "🧺",
    title: "Cesta de Café",
    price: "R$ 120,00",
    priceNumber: 120,
    gradient: "from-yellow-100 to-amber-200",
  },
  {
    id: 11,
    emoji: "🫧",
    title: "Coberta pra Noiva",
    price: "R$ 0,01",
    priceNumber: 0.01,
    gradient: "from-pink-100 to-fuchsia-200",
  },
  {
    id: 12,
    emoji: "🧹",
    title: "Faxina Mensal",
    price: "R$ 150,00",
    priceNumber: 150,
    gradient: "from-teal-100 to-teal-200",
  },
  {
    id: 13,
    emoji: "🍔",
    title: "Janta do BK",
    price: "R$ 40,00",
    priceNumber: 40,
    gradient: "from-red-100 to-red-200",
  },
  {
    id: 14,
    emoji: "😤",
    title: "Direito de Reclamar",
    price: "R$ 999,00",
    priceNumber: 999,
    gradient: "from-slate-100 to-slate-200",
  },
  {
    id: 15,
    emoji: "🤫",
    title: "Mandar Calar a Boca",
    price: "R$ 1.999,00",
    priceNumber: 1999,
    gradient: "from-zinc-100 to-zinc-200",
  },
];

const formatPrice = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const Presentes = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const cartTotal = cart.reduce(
    (total, item) => total + item.priceNumber * item.quantity,
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
              className="absolute text-green-600/70 animate-float-money font-bold"
              style={{
                left: `${5 + i * 7}%`,
                bottom: `-100px`,
                animationDelay: `${i * 4}s`,
                animationDuration: `${18 + Math.random() * 8}s`,
                fontSize: `${30 + Math.random() * 36}px`,
                fontFamily: "Arial, sans-serif",
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
              <stop offset="0%" stopColor="#b45309" stopOpacity="0" />
              <stop offset="5%" stopColor="#b45309" stopOpacity="0.3" />
              <stop offset="95%" stopColor="#b45309" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
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

      <main>
        {/* Floating Cart Button - ajustado para mobile com navbar inferior */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-6 z-40 bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
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
                <p className="text-sm mt-2">
                  Adicione presentes para nos agradar! ❤️
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
                      <div
                        className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center shrink-0`}
                      >
                        <span className="text-xl md:text-2xl">
                          {item.emoji}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-gray-800 text-sm md:text-base truncate"
                          style={{ fontFamily: '"Playfair Display", serif' }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-amber-600 font-bold text-sm md:text-base">
                          {item.price}
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
                  <div className="flex justify-between items-center mb-3 md:mb-4">
                    <span className="text-base md:text-lg text-gray-600">
                      Total:
                    </span>
                    <span className="text-2xl md:text-3xl font-bold text-amber-600">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg transition-colors text-base md:text-lg"
                    style={{ fontFamily: '"Playfair Display", serif' }}
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
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
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
        <div className="relative z-10 text-center text-white px-4">
          <h1
            className="text-4xl md:text-7xl lg:text-8xl px-4"
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
      <section className="py-12 md:py-16 px-4 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative">
          {/* Alerta pulsante */}
          <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-red-500 text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg">
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
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-lg border border-amber-200/50">
            <p className="text-base md:text-lg lg:text-xl mb-3 md:mb-4 tracking-[0.1em] md:tracking-[0.15em] text-gray-800 font-medium">
              Sua presença é nosso maior presente!
            </p>
            <p className="text-sm md:text-lg lg:text-xl text-gray-700 leading-relaxed tracking-[0.1em] md:tracking-[0.15em] font-medium mb-3 md:mb-4">
              Mas se você quiser nos presentear com carinho, separamos algumas
              opções especiais que nos deixariam muito felizes.
            </p>
            <p className="text-xs md:text-base lg:text-lg text-gray-600 leading-relaxed tracking-[0.1em] md:tracking-[0.15em]">
              Graças a Deus já temos nossa casa mobiliada, então o presente
              digital é a melhor coisa para nós.
            </p>
          </div>
        </div>
      </section>

      {/* Tutorial Como Funciona */}
      <section className="pb-8 md:pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-amber-50/60 rounded-2xl p-4 md:p-6 mb-8 md:mb-12 border border-amber-200/50 backdrop-blur-sm">
            <h3
              className="text-lg md:text-xl font-semibold text-amber-800 mb-3 md:mb-4 flex items-center gap-2"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              <span>💡</span> Como funciona?
            </h3>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Escolha os presentes
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Clique em <strong>"Adicionar"</strong> nos cards para
                    colocar os itens no carrinho. Você pode adicionar quantos
                    quiser!
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Revise seu carrinho
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Clique no ícone <strong>🛒</strong> no canto inferior
                    direito. Ajuste as quantidades ou remova itens se precisar.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">
                    Finalize a compra
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Clique em <strong>"Finalizar Compra"</strong> e escolha como
                    quer pagar: PIX, PicPay ou Mercado Pago.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {gifts.map((gift) => (
              <div
                key={gift.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col border border-amber-200/50 relative z-10"
              >
                <div
                  className={`h-24 sm:h-32 bg-gradient-to-br ${gift.gradient} flex items-center justify-center`}
                >
                  <span className="text-4xl sm:text-5xl">{gift.emoji}</span>
                </div>
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <h3
                    className="text-base sm:text-lg font-semibold text-gray-800 mb-2"
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {gift.title}
                  </h3>
                  <p className="text-lg sm:text-xl font-bold text-amber-600 mb-3 sm:mb-4">
                    {gift.price}
                  </p>
                  <div className="mt-auto">
                    <button
                      onClick={() => addToCart(gift)}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center gap-2"
                      style={{ fontFamily: '"Playfair Display", serif' }}
                    >
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
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
