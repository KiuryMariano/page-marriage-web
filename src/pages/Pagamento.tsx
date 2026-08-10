import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import backgroundMoney from "../assets/background_money.webp";
import backgroundMoneyMobile from "../assets/background_money_mobile.webp";
import pixLogo from "../assets/pix-removebg.png";
import creditCardLogo from "../assets/credit-card.png";
import { colors, gradients } from "../theme";
import { useCartPersist } from "../hooks/useCartPersist";
import { PixPayment } from "../components/PixPayment";
import { CardPayment } from "../components/CardPayment";
import { createSale } from "../services/giftsApi";

const formatPrice = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

type PaymentMethod = "pix" | "card";

const Pagamento = () => {
  const navigate = useNavigate();
  const { cart } = useCartPersist();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPixPayment, setShowPixPayment] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/presentes");
      return;
    }
  }, [cart, navigate]);

  const handleBackToCart = useCallback(() => {
    navigate("/presentes");
  }, [navigate]);

  const handleSelectMethod = useCallback((method: PaymentMethod) => {
    setSelectedMethod(method);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedMethod) return;

    if (selectedMethod === "pix") {
      setShowPixPayment(true);
      return;
    }

    if (selectedMethod === "card") {
      setShowCardPayment(true);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      alert(`Método selecionado: ${selectedMethod}\nTotal: ${formatPrice(cartTotal)}`);
    }, 1000);
  }, [selectedMethod, cartTotal]);

  const handlePixCancel = useCallback(() => {
    setShowPixPayment(false);
  }, []);

  const handlePixConfirmed = useCallback(async () => {
    try {
      // Registrar venda antes de navegar - isso aciona o trigger que decrementa as cotas
      await createSale(cart, "pix");
      navigate("/pagamento-sucesso");
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      alert("Erro ao registrar a venda. Tente novamente ou contate os noivos.");
    }
  }, [cart, navigate]);

  const handleCardCancel = useCallback(() => {
    setShowCardPayment(false);
  }, []);

  const handleCardApproved = useCallback(async () => {
    try {
      // Registrar venda antes de navegar - isso aciona o trigger que decrementa as cotas
      await createSale(cart, "cartao");
      navigate("/pagamento-sucesso");
    } catch (error) {
      console.error("Erro ao registrar venda:", error);
      alert("Erro ao registrar a venda. Tente novamente ou contate os noivos.");
    }
  }, [cart, navigate]);

  const handleCardPending = useCallback(() => {
    navigate("/pagamento-pendente");
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
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

      <main className="flex-1 flex flex-col px-4 md:px-4 py-3 md:py-4 overflow-hidden max-w-full">
        <div className="max-w-5xl mx-auto w-full flex flex-col h-full overflow-x-hidden">
          {/* Header Compacto */}
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <button
              onClick={handleBackToCart}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <h1
              className="text-2xl md:text-3xl lg:text-4xl"
              style={{
                fontFamily: '"Great Vibes", cursive',
                color: colors.primary[700],
                lineHeight: 1,
              }}
            >
              Finalizar Presente
            </h1>
          </div>

          {/* Conteúdo Principal - Layout vertical em mobile, grid em desktop */}
          <div className="flex-1 flex flex-col md:grid md:grid-cols-5 md:grid-rows-[auto_1fr] gap-2 md:gap-4 min-h-0 w-full overflow-x-hidden">

            {/* 1. Forma de Pagamento - Esquerda em cima (col-span-3, row-span-1) */}
            <div className="h-fit md:col-span-3 md:row-span-1 md:flex md:flex-col md:min-h-0">
              <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 h-fit md:flex-1 md:flex md:flex-col overflow-hidden w-full max-w-full">
                <h2
                  className="text-base md:text-lg lg:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2 shrink-0"
                  style={{ fontFamily: '"Playfair Display", serif', color: colors.primary[700] }}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Forma de Pagamento
                </h2>

                <div className="space-y-2 md:space-y-3 md:flex-1 md:overflow-y-auto md:pr-1">
                  {/* PIX */}
                  <button
                    onClick={() => handleSelectMethod("pix")}
                    className={`w-full text-left p-2.5 md:p-4 rounded-xl border-2 transition-all overflow-hidden ${
                      selectedMethod === "pix"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 md:gap-3">
                      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center shrink-0">
                        <img
                          src={pixLogo}
                          alt="PIX"
                          className="w-6 h-6 md:w-10 md:h-10 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate text-sm md:text-base">PIX</h3>
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full inline-block mt-0.5">
                          Benção dos noivos
                        </span>
                        <p className="text-xs text-gray-600 mt-0.5 break-words line-clamp-2">
                          QR Code ou PIX Copia e cola
                        </p>
                      </div>
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center shrink-0">
                        {selectedMethod === "pix" && (
                          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-purple-500" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Cartão de Crédito */}
                  <button
                    onClick={() => handleSelectMethod("card")}
                    className={`w-full text-left p-2.5 md:p-4 rounded-xl border-2 transition-all overflow-hidden ${
                      selectedMethod === "card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 md:gap-3">
                      <div className="w-8 h-8 md:w-12 md:h-12 flex items-center justify-center shrink-0">
                        <img
                          src={creditCardLogo}
                          alt="Cartão de Crédito"
                          className="w-6 h-6 md:w-10 md:h-10 object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 truncate text-sm md:text-base">Cartão de Crédito</h3>
                        <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full inline-block mt-0.5">
                          Para não ficar apertado
                        </span>
                        <p className="text-xs text-gray-600 mt-0.5 break-words line-clamp-2">
                          Em até 10x no cartão
                        </p>
                      </div>
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center shrink-0">
                        {selectedMethod === "card" && (
                          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </div>
                  </button>

                </div>
              </div>
            </div>

            {/* 2. Resumo de Valores e Botão - Direita (col-span-2, row-span-2) */}
            <div className="md:col-span-2 md:row-span-2 bg-white rounded-2xl shadow-lg p-3 md:p-4 h-fit md:flex md:flex-col md:justify-end w-full max-w-full">
              <div className="space-y-1.5 md:space-y-2 mb-2 md:mb-3">
                <div className="flex justify-between text-xs md:text-sm text-gray-600">
                  <span>Itens ({cartItemCount})</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm text-gray-600">
                  <span>Taxa</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <div className="border-t pt-1.5 md:pt-2 flex justify-between items-center">
                  <span className="font-semibold text-gray-800 text-sm md:text-base">Total</span>
                  <span
                    className="text-lg md:text-xl font-bold"
                    style={{ color: colors.primary[600] }}
                  >
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!selectedMethod || isProcessing}
                className="w-full text-white font-bold py-2.5 md:py-3 px-3 md:px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 text-sm md:text-base"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  background: selectedMethod ? gradients.primary : "#9ca3af",
                }}
              >
                {isProcessing ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pagar com {selectedMethod === "pix" ? "PIX" : "Cartão"}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-1.5 md:mt-2">
                Pagamento seguro
              </p>
            </div>

            {/* 3. Itens do Carrinho - Esquerda embaixo (col-span-3, row-span-2) */}
            <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 flex-1 flex flex-col min-h-0 overflow-hidden w-full max-w-full md:col-span-3 md:row-span-2">
              <h3
                className="text-xs md:text-sm font-semibold mb-2 md:mb-3 flex items-center gap-1.5 shrink-0"
                style={{ fontFamily: '"Playfair Display", serif', color: colors.primary[700] }}
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Itens ({cartItemCount})
              </h3>

              <div className="space-y-1 md:space-y-1.5 flex-1 overflow-y-auto min-h-0">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-xs"
                  >
                    <span className="text-gray-700 truncate pr-2">
                      {item.quantity}x {item.title}
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: colors.primary[600] }}
                    >
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal PIX */}
      {showPixPayment && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={handlePixCancel}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative min-h-fit py-8" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handlePixCancel}
                className="absolute top-1 right-1 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
                aria-label="Fechar"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <PixPayment
                valor={cartTotal}
                descricao="Presente Casamento Letícia & Kiury"
                onPaymentConfirmed={handlePixConfirmed}
                onCancel={handlePixCancel}
              />
            </div>
          </div>
        </>
      )}

      {/* Modal Cartão */}
      {showCardPayment && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={handleCardCancel}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div
              className="relative bg-white rounded-2xl shadow-lg w-full max-w-lg flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Fixo */}
              <div className="shrink-0 p-6 pb-4 border-b">
                <h2
                  className="text-2xl font-semibold text-center"
                  style={{ fontFamily: '"Playfair Display", serif', color: colors.primary[700] }}
                >
                  Pagamento com Cartão
                </h2>
                <p className="text-center text-gray-600 text-sm mt-1">
                  Preencha os dados abaixo para concluir o presente
                </p>
              </div>

              {/* Conteúdo com Scroll */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <p className="text-center text-3xl font-bold mb-3" style={{ color: colors.primary[600] }}>
                  {cartTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </p>

                <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800" role="note">
                  <p className="font-semibold mb-0.5">Aviso dos noivos!</p>
                  <p>
                    Parcelas mais longas podem ter juros cobrados pela operadora do cartão.
                    Prometemos que não somos nós cobrando — é só a taxa do processamento!
                    IMPORTANTE: Neste tipo de pagamento somente serão aceitos cartões com crédito. Cartões somente débito irão gerar ERRO NO PAGAMENTO.
                  </p>
                </div>

                <CardPayment
                  cart={cart}
                  cartTotal={cartTotal}
                  onPaymentApproved={handleCardApproved}
                  onPaymentPending={handleCardPending}
                />
              </div>

              {/* Botão Voltar Fixo */}
              <div className="shrink-0 p-4 pt-0 border-t">
                <button
                  onClick={handleCardCancel}
                  className="w-full py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Voltar
                </button>
              </div>

              {/* Botão de fechar no canto */}
              <button
                onClick={handleCardCancel}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Fechar"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Pagamento;
