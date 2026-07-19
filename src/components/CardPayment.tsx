import { useState } from "react";
import {
  CardPayment as MercadoPagoCardPayment,
  initMercadoPago,
} from "@mercadopago/sdk-react";
import { colors } from "../theme";
import { type Gift } from "../mocks";

interface CardPaymentProps {
  cart: (Gift & { quantity: number })[];
  cartTotal: number;
  onCancel: () => void;
  onPaymentApproved: () => void;
}

const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

if (publicKey) {
  initMercadoPago(publicKey, { locale: "pt-BR" });
}

const debugPayment = (stage: string, details: Record<string, unknown> = {}) => {
  console.info(`[CardPayment] ${stage}`, details);
};

export const CardPayment = ({
  cart,
  cartTotal,
  onCancel,
  onPaymentApproved,
}: CardPaymentProps) => {
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (formData: {
    token: string;
    issuer_id: string;
    payment_method_id: string;
    installments: number;
    payer: {
      email?: string;
      identification?: { type?: string; number?: string };
    };
  }) => {
    setErrorMessage("");
    debugPayment("Token do cartão recebido do Brick", {
      paymentMethod: formData.payment_method_id,
      installments: formData.installments,
      hasPayerEmail: Boolean(formData.payer.email),
    });

    try {
      debugPayment("Enviando pagamento para a API local", {
        itemCount: cart.length,
        cartTotal,
      });

      const response = await fetch("/api/processCardPayment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, cart }),
      });
      const result = await response.json();

      debugPayment("Resposta do processamento recebida", {
        httpStatus: response.status,
        paymentStatus: result.status,
        statusDetail: result.status_detail,
        paymentId: result.id,
      });

      if (!response.ok || result.status !== "approved") {
        const message = result.message || "O pagamento não foi aprovado. Verifique os dados e tente novamente.";
        setErrorMessage(message);
        throw new Error(message);
      }

      debugPayment("Pagamento aprovado", { paymentId: result.id });
      onPaymentApproved();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível processar o pagamento.";
      setErrorMessage(message);
      debugPayment("Falha no processamento do pagamento", { message });
      throw error;
    }
  };

  if (!publicKey) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-3" style={{ color: colors.primary[700] }}>
          Pagamento com Cartão
        </h2>
        <p className="text-red-600">
          Configure a variável <code>VITE_MERCADO_PAGO_PUBLIC_KEY</code> para habilitar o pagamento por cartão.
        </p>
        <button onClick={onCancel} className="mt-6 w-full py-3 rounded-lg border-2 border-gray-300">
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2
          className="text-2xl font-semibold mb-2"
          style={{ fontFamily: '"Playfair Display", serif', color: colors.primary[700] }}
        >
          Pagamento com Cartão
        </h2>
        <p className="text-gray-600">Preencha os dados abaixo para concluir o presente.</p>
      </div>

      <p className="text-center text-3xl font-bold mb-6" style={{ color: colors.primary[600] }}>
        {cartTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>

      {!isReady && <p className="text-center text-gray-500 mb-4">Carregando formulário seguro...</p>}

      {errorMessage && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      )}

      <MercadoPagoCardPayment
        initialization={{ amount: cartTotal }}
        customization={{
          paymentMethods: {
            maxInstallments: 12,
          },
        }}
        locale="pt-BR"
        onReady={() => {
          setIsReady(true);
          debugPayment("Card Payment Brick carregado");
        }}
        onError={(error) => {
          setErrorMessage("Não foi possível carregar o formulário de cartão.");
          debugPayment("Erro no Card Payment Brick", { errorType: String(error.type) });
        }}
        onSubmit={handleSubmit}
      />

      <button
        onClick={onCancel}
        className="mt-4 w-full py-3 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
      >
        Voltar
      </button>
    </div>
  );
};
