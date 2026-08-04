import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import backgroundMoney from "../assets/background_money.webp";
import backgroundMoneyMobile from "../assets/background_money_mobile.webp";
import { colors, gradients } from "../theme";
import { useCartPersist } from "../hooks/useCartPersist";
import { PixPayment } from "../components/PixPayment";
import { CardPayment } from "../components/CardPayment";

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
  }, [selectedMethod]);

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

  const handlePixConfirmed = useCallback(() => {
    navigate("/pagamento-sucesso");
  }, [navigate]);

  const handleCardCancel = useCallback(() => {
    setShowCardPayment(false);
  }, []);

  const handleCardApproved = useCallback(() => {
    navigate("/pagamento-sucesso");
  }, [navigate]);

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

      <main className="flex-1 flex flex-col px-4 py-3 md:py-4 overflow-hidden">
        <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
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

          {/* Conteúdo Principal - Layout horizontal em desktop */}
          <div className="flex-1 grid md:grid-cols-5 gap-3 md:gap-4 min-h-0">
            {/* Coluna Esquerda - Métodos de Pagamento */}
            <div className="md:col-span-3 flex flex-col min-h-0">
              {/* Métodos de Pagamento */}
              <div className="bg-white rounded-2xl shadow-lg p-4 flex-1 flex flex-col">
                <h2
                  className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2 shrink-0"
                  style={{ fontFamily: '"Playfair Display", serif', color: colors.primary[700] }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Forma de Pagamento
                </h2>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {/* PIX */}
                  <button
                    onClick={() => handleSelectMethod("pix")}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedMethod === "pix"
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          selectedMethod === "pix" ? "bg-purple-500" : "bg-purple-100"
                        }`}
                      >
                        <svg
                          className={`w-6 h-6 ${selectedMethod === "pix" ? "text-white" : "text-purple-600"}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          <path d="M18.9 9.5c-.3-1.3-1.3-2.3-2.6-2.6-1.1-.2-2.2-.2-3.3 0-1.3.3-2.3 1.3-2.6 2.6-.2 1.1-.2 2.2 0 3.3.3 1.3 1.3 2.3 2.6 2.6 1.1.2 2.2.2 3.3 0 1.3-.3 2.3-1.3 2.6-2.6.2-1.1.2-2.2 0-3.3zm-4.5 2.8c-1.2 0-2.2-1-2.2-2.2s1-2.2 2.2-2.2 2.2 1 2.2 2.2-1 2.2-2.2 2.2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-800">PIX</h3>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Benção dos noivos
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          QR Code ou PIX Copia e cola
                        </p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0">
                        {selectedMethod === "pix" && (
                          <div className="w-3 h-3 rounded-full bg-purple-500" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Cartão de Crédito */}
                  <button
                    onClick={() => handleSelectMethod("card")}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedMethod === "card"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          selectedMethod === "card" ? "bg-blue-500" : "bg-blue-100"
                        }`}
                      >
                        <svg
                          className={`w-6 h-6 ${selectedMethod === "card" ? "text-white" : "text-blue-600"}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-800">Cartão de Crédito</h3>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                            Para não ficar apertado
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Em até 10x no cartão
                        </p>
                      </div>
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0">
                        {selectedMethod === "card" && (
                          <div className="w-3 h-3 rounded-full bg-blue-500" />
                        )}
                      </div>
                    </div>
                  </button>

                </div>
              </div>
            </div>

            {/* Coluna Direita - Resumo */}
            <div className="md:col-span-2 flex flex-col gap-3 md:gap-4 min-h-0">
              {/* Itens do Carrinho - Compacto */}
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <h3
                  className="text-sm font-semibold mb-2 flex items-center gap-1.5"
                  style={{ fontFamily: '"Playfair Display", serif', color: colors.primary[700] }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Itens ({cartItemCount})
                </h3>

                <div className="space-y-1.5 max-h-24 md:max-h-32 overflow-y-auto">
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

              {/* Resumo de Valores e Botão */}
              <div className="bg-white rounded-2xl shadow-lg p-4 flex-1 flex flex-col">
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Itens ({cartItemCount})</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Taxa</span>
                    <span className="text-green-600 font-medium">Grátis</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span
                      className="text-xl font-bold"
                      style={{ color: colors.primary[600] }}
                    >
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  disabled={!selectedMethod || isProcessing}
                  className="w-full text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
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

                <p className="text-xs text-gray-500 text-center mt-2">
                  Pagamento seguro
                </p>
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
