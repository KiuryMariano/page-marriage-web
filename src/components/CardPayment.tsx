import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import {
  CardPayment as MercadoPagoCardPayment,
  initMercadoPago,
} from "@mercadopago/sdk-react";
import { type Gift } from "../mocks";

interface CardPaymentProps {
  cart: (Gift & { quantity: number })[];
  cartTotal: number;
  onPaymentApproved: (paymentId: string) => void;
  onPaymentPending?: () => void;
}

// Flag de módulo para garantir que initMercadoPago seja chamado apenas uma vez
let mpInitializedGlobal = false;

const CardPaymentComponent = ({
  cart,
  cartTotal,
  onPaymentApproved,
  onPaymentPending,
}: CardPaymentProps) => {
  const [isReady, setIsReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showBrick, setShowBrick] = useState(false);
  const [mpInitError, setMpInitError] = useState<Error | null>(null);
  const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
  const initializationAttempted = useRef(false);
  const isSubmitting = useRef(false);
  const hasRendered = useRef(false);

  useEffect(() => {
    if (hasRendered.current) return;
    hasRendered.current = true;
  }, [cartTotal, cart.length, publicKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBrick(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!publicKey || mpInitializedGlobal || mpInitError) return;

    try {
      initMercadoPago(publicKey, { locale: "pt-BR" });
      mpInitializedGlobal = true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMpInitError(err);
    }
  }, [publicKey, mpInitError]);

  const handleSubmit = useCallback(async (formData: {
    token: string;
    issuer_id: string;
    payment_method_id: string;
    installments: number;
    payer: {
      email?: string;
      identification?: { type?: string; number?: string };
    };
  }) => {
    if (isSubmitting.current) {
      return;
    }

    isSubmitting.current = true;
    setErrorMessage("");

    try {
      const response = await fetch("/api/processCardPayment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, cart }),
      });

      const text = await response.text();
      const result = JSON.parse(text);

      if (!response.ok || result.status !== "approved") {
        if (
          response.ok &&
          (result.status === "pending" || result.status === "in_process" || result.status === "in_mediation")
        ) {
          isSubmitting.current = false;
          onPaymentPending?.();
          return;
        }

        let message = result.message || result.status_detail || "O pagamento não foi aprovado. Verifique os dados e tente novamente.";

        const causeCode = result.cause_code ?? null;
        const statusDetail = result.status_detail;

        if (causeCode === 10113 || message === "excludes_by_rule") {
          message = "Pagamento recusado: O método de pagamento (Mastercard/Visa) não está disponível para testes. Tente usar outro cartão ou entre em contato com o suporte Mercado Pago.";
        } else if (causeCode === 10110 || statusDetail === "invalid_card") {
          message = "Cartão inválido. Verifique os dados e tente novamente.";
        } else if (causeCode === 10109 || statusDetail === "card_declined") {
          message = "Cartão recusado pela operadora. Tente com outro cartão.";
        }

        setErrorMessage(message);
        isSubmitting.current = false;
        return;
      }

      isSubmitting.current = false;
      onPaymentApproved(String(result.id ?? ""));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível processar o pagamento.";
      setErrorMessage(message);
      isSubmitting.current = false;
    }
  }, [cart, onPaymentApproved, onPaymentPending]);

  const handleReady = useCallback(() => {
    if (initializationAttempted.current) {
      return;
    }
    initializationAttempted.current = true;
    setIsReady(true);
  }, []);

  const handleError = useCallback(() => {
    setErrorMessage("Não foi possível carregar o formulário de cartão. Tente recarregar a página.");
  }, []);

  const handleBinChange = useCallback(() => {
    // Sem operação
  }, []);

  const brickInitialization = useMemo(() => ({ amount: cartTotal }), [cartTotal]);
  const brickCustomization = useMemo(() => ({
    paymentMethods: {
      maxInstallments: 10,
      minInstallments: 1,
      defaultInstallments: 1,
      creditCard: {
        enabled: true,
        title: "Cartão de crédito",
        installments: {
          show: true,
          minInstallments: 1,
          maxInstallments: 10,
        },
      },
      debitCard: {
        enabled: false,
      },
    },
    visual: {
      texts: {
        formTitle: "Cartão de crédito",
      },
    },
  }), []);

  const showMinimumAmountWarning = cartTotal < 10;

  if (!publicKey) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Configure a variável <code>VITE_MERCADO_PAGO_PUBLIC_KEY</code> para habilitar o pagamento por cartão.
        </p>
      </div>
    );
  }

  if (mpInitError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Erro ao inicializar o SDK do Mercado Pago: {mpInitError.message}
        </p>
        <p className="text-gray-500 text-sm">Tente recarregar a página.</p>
      </div>
    );
  }

  return (
    <>
      {!isReady && (
        <div className="text-center py-4">
          <p className="text-gray-500 mb-2">Carregando formulário seguro...</p>
          <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {showMinimumAmountWarning && (
        <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-700" role="alert">
          <p className="font-semibold">⚠️ Valor mínimo para testar</p>
          <p>Pagamentos abaixo de R$ 10,00 podem ser recusados pelo Mercado Pago em ambiente de teste.</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          <p className="font-semibold">Erro no pagamento</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {showBrick && (
        <MercadoPagoCardPayment
          initialization={brickInitialization}
          customization={brickCustomization}
          locale="pt-BR"
          onReady={handleReady}
          onError={handleError}
          onBinChange={handleBinChange}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export const CardPayment = memo(CardPaymentComponent, (prevProps, nextProps) => {
  if (prevProps.cartTotal !== nextProps.cartTotal) return false;
  if (prevProps.onPaymentApproved !== nextProps.onPaymentApproved) return false;
  if (prevProps.onPaymentPending !== nextProps.onPaymentPending) return false;
  if (prevProps.cart.length !== nextProps.cart.length) return false;
  for (let i = 0; i < prevProps.cart.length; i++) {
    const p = prevProps.cart[i];
    const n = nextProps.cart[i];
    if (p.id !== n.id || p.quantity !== n.quantity) return false;
  }
  return true;
});
