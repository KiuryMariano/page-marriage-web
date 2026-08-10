import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import backgroundMoney from "../assets/backgrounds/background_money.webp";
import backgroundMoneyMobile from "../assets/backgrounds/background_money_mobile.webp";
import { colors } from "../theme";
import { useCartPersist } from "../hooks/useCartPersist";

const PagamentoSucesso = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartPersist();

  useEffect(() => {
    // Limpeza centralizada do carrinho
    clearCart();
  }, [clearCart]);

  return (
    <div className="h-screen flex flex-col relative">
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

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          {/* Ícone de sucesso */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1
            className="text-3xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Pagamento Confirmado!
          </h1>

          <p className="text-gray-600 mb-4">
            Muito obrigado pelo presente! Sua generosidade significa muito para nós.
          </p>

          <div className="bg-purple-50 rounded-lg p-5 mb-6 border-2 border-purple-100">
            <p className="text-purple-800 text-sm leading-relaxed">
              💜 Com carinho e gratidão, você está ajudando a construir nosso futuro juntos.
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-green-800 text-sm">
              🎁 Seu presente foi registrado com sucesso!
            </p>
          </div>

          <button
            onClick={() => navigate("/presentes")}
            className="w-full py-3 px-6 rounded-lg text-white font-semibold"
            style={{ backgroundColor: colors.primary[600] }}
          >
            Voltar para Presentes
          </button>
        </div>
      </main>
    </div>
  );
};

export default PagamentoSucesso;
