import { useNavigate } from "react-router-dom";
import backgroundMoney from "../assets/backgrounds/background_money.webp";
import backgroundMoneyMobile from "../assets/backgrounds/background_money_mobile.webp";
import { colors } from "../theme";

const PagamentoPendente = () => {
  const navigate = useNavigate();

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
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1
            className="text-3xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: '"Playfair Display", serif' }}
          >
            Pagamento em Análise
          </h1>

          <p className="text-gray-600 mb-6">
            Seu pagamento está sendo processado. Você receberá uma confirmação em breve.
          </p>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              ⏳ O pagamento pode levar até 2 dias úteis para ser confirmado.
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

export default PagamentoPendente;
