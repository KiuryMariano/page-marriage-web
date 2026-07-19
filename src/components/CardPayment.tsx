import { useState } from "react";
import { colors } from "../theme";
import { type Gift } from "../mocks";

interface CardPaymentProps {
  cart: (Gift & { quantity: number })[];
  cartTotal: number;
  onCancel: () => void;
}

const formatPrice = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const CardPayment = ({ cart, cartTotal, onCancel }: CardPaymentProps) => {
  const [loading, setLoading] = useState(false);
  const [installments, setInstallments] = useState(1);
  const installmentValue = cartTotal / installments;

  const handlePayWithMercadoPago = async () => {
    try {
      setLoading(true);

      // Chama API PHP
      const payload = {
        itens: cart,
        nome: 'Convidado',
      };

      const response = await fetch('/api/createPreference.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${responseText}`);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('Resposta não é JSON válido');
      }

      if (data.error) {
        alert('Erro ao criar pagamento: ' + data.error);
        setLoading(false);
        return;
      }

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Erro: init_point não encontrado');
        setLoading(false);
      }
    } catch {
      alert('Erro ao processar pagamento. Tente novamente mais tarde.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: '"Playfair Display", serif', color: colors.primary[700] }}
        >
          Pagamento com Cartão
        </h2>
        <p className="text-gray-600">
          Parcelamento sem juros
        </p>
      </div>

      {/* Valor */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-1">Valor total</p>
        <p
          className="text-3xl font-bold"
          style={{ color: colors.primary[600] }}
        >
          {formatPrice(cartTotal)}
        </p>
      </div>

      {/* Parcelas */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Número de parcelas
        </label>
        <select
          value={installments}
          onChange={(e) => setInstallments(Number(e.target.value))}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <option key={num} value={num}>
              {num}x de {formatPrice(installmentValue)} {num === 1 ? '(à vista)' : '(sem juros)'}
            </option>
          ))}
        </select>
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Você será redirecionado para o Mercado Pago
        </p>
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Voltar
        </button>
        <button
          onClick={handlePayWithMercadoPago}
          disabled={loading}
          className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processando...
            </>
          ) : (
            <>
              Pagar Agora
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-400 text-center mt-4">
        Pagamento seguro processado por Mercado Pago
      </p>

      {/* Bandeiras aceitas */}
      <div className="flex justify-center gap-3 mt-4">
        <div className="text-2xl" title="Visa">💳</div>
        <div className="text-2xl" title="Mastercard">💳</div>
        <div className="text-2xl" title="Elo">💳</div>
        <div className="text-2xl" title="Hipercard">💳</div>
        <div className="text-2xl" title="American Express">💳</div>
      </div>
    </div>
  );
};
