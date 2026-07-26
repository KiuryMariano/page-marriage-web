import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import {
  CardPayment as MercadoPagoCardPayment,
  initMercadoPago,
} from "@mercadopago/sdk-react";
import { type Gift } from "../mocks";

interface CardPaymentProps {
  cart: (Gift & { quantity: number })[];
  cartTotal: number;
  onPaymentApproved: () => void;
  onPaymentPending?: () => void;
}

const debugPayment = (stage: string, details: Record<string, unknown> = {}) => {
  if (import.meta.env.DEV) {
    console.log(`%c[CardPayment] ${stage}`, "color: #0066ff; font-weight: bold", details);
  }
};

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
  const [isDebitOnly, setIsDebitOnly] = useState(false);
  const [mpInitError, setMpInitError] = useState<Error | null>(null);
  const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
  const initializationAttempted = useRef(false);
  const isSubmitting = useRef(false);
  const hasRendered = useRef(false);

  // Log apenas na primeira montagem
  useEffect(() => {
    if (hasRendered.current) return;
    hasRendered.current = true;
    debugPayment("🔰 Componente montado (primeira vez)", {
      cartTotal,
      itemCount: cart.length,
      publicKeyConfigured: Boolean(publicKey),
    });
  }, [cartTotal, cart.length, publicKey]);

  // Mostrar Brick após pequeno delay para garantir que DOM está pronto
  useEffect(() => {
    const timer = setTimeout(() => {
      debugPayment("Exibindo Brick após delay");
      setShowBrick(true);
    }, 100);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Inicializar Mercado Pago apenas uma vez (usando flag de módulo + state local)
  useEffect(() => {
    if (!publicKey || mpInitializedGlobal || mpInitError) return;

    debugPayment("Inicializando Mercado Pago SDK", {
      publicKey: publicKey.substring(0, 20) + "...",
    });
    try {
      initMercadoPago(publicKey, { locale: "pt-BR" });
      mpInitializedGlobal = true;
      debugPayment("✅ Mercado Pago SDK inicializado com sucesso");
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      debugPayment("❌ Erro ao inicializar Mercado Pago SDK", { error: err.message });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMpInitError(err);
    }
  }, [publicKey, mpInitError]);

  // Limpar estado ao desmontar
  useEffect(() => {
    debugPayment("useEffect cleanup registrado");
    return () => {
      debugPayment("Componente desmontado");
    };
  }, []);

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
    // Evitar múltiplas submissões simultâneas
    if (isSubmitting.current) {
      debugPayment("⚠️ Submissão já em andamento, ignorando");
      return;
    }

    isSubmitting.current = true;
    debugPayment("=== INÍCIO DO PROCESSAMENTO DO PAGAMENTO ===");
    setErrorMessage("");

    debugPayment("1. Token do cartão recebido do Brick", {
      token: formData.token ? `${formData.token.substring(0, 8)}...` : "N/A",
      tokenLength: formData.token?.length || 0,
      paymentMethod: formData.payment_method_id,
      installments: formData.installments,
      issuerId: formData.issuer_id,
    });

    debugPayment("2. Dados do pagador", {
      email: formData.payer.email || "NÃO INFORMADO",
      identificationType: formData.payer.identification?.type || "N/A",
      identificationNumber: formData.payer.identification?.number
        ? `***${formData.payer.identification.number.slice(-4)}`
        : "NÃO INFORMADO",
    });

    debugPayment("3. Dados do carrinho", {
      itemCount: cart.length,
      cartTotal,
      items: cart.map((i) => ({ title: i.title, price: i.price, qty: i.quantity })),
    });

    try {
      debugPayment("4. Enviando requisição para API", {
        url: "/api/processCardPayment.php",
        method: "POST",
      });

      const startTime = Date.now();
      const response = await fetch("/api/processCardPayment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, cart }),
      });

      const duration = Date.now() - startTime;
      debugPayment("5. Resposta HTTP recebida", {
        httpStatus: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        ok: response.ok,
      });

      const text = await response.text();
      debugPayment("6. Corpo da resposta", {
        rawResponse: text,
        responseLength: text.length,
      });

      const result = JSON.parse(text);

      debugPayment("7. Dados parseados do JSON", {
        paymentId: result.id,
        status: result.status,
        statusDetail: result.status_detail,
        message: result.message,
      });

      if (!response.ok || result.status !== "approved") {
        // Status "pending" / "in_process" → página de pendente
        if (
          response.ok &&
          (result.status === "pending" || result.status === "in_process" || result.status === "in_mediation")
        ) {
          debugPayment("⏳ PAGAMENTO PENDENTE", { status: result.status });
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

        debugPayment(`❌ PAGAMENTO RECUSADO`, {
          httpStatus: response.status,
          mpStatus: result.status,
          mpStatusDetail: statusDetail,
          rawMessage: result.message,
          causeCode,
          userMessage: message,
        });
        setErrorMessage(message);
        isSubmitting.current = false;
        return;
      }

      debugPayment(`✅ PAGAMENTO APROVADO`, {
        paymentId: result.id,
        status: result.status,
        totalDuration: `${duration}ms`,
      });
      isSubmitting.current = false;
      onPaymentApproved();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível processar o pagamento.";
      setErrorMessage(message);
      isSubmitting.current = false;
      debugPayment(`❌ ERRO NO PROCESSAMENTO`, {
        errorMessage: message,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      // NÃO lançar erro - apenas mostrar mensagem
    }
  }, [cart, cartTotal, onPaymentApproved, onPaymentPending]);

  const handleReady = useCallback(() => {
    if (initializationAttempted.current) {
      debugPayment("onReady chamado novamente (ignorando)");
      return;
    }
    initializationAttempted.current = true;

    debugPayment("✅ Card Payment Brick carregado e pronto");
    setIsReady(true);

    debugPayment("Verificando opções de parcelamento disponíveis", {
      maxInstallments: 10,
      amount: cartTotal,
      aVista: "1x",
      parcelamento: "2x a 10x",
    });
  }, [cartTotal]);

  const handleError = useCallback((error: unknown) => {
    debugPayment("❌ Erro no Card Payment Brick", {
      errorType: String((error as { type?: string })?.type ?? "unknown"),
      errorMessage: String((error as { message?: string })?.message ?? "No message"),
      error: String(error),
    });
    setErrorMessage("Não foi possível carregar o formulário de cartão. Tente recarregar a página.");
  }, []);

  const handleBinChange = useCallback(async (bin: string) => {
    debugPayment("BIN do cartão atualizado", { binLength: bin?.length });

    if (!bin || bin.length < 6 || !publicKey) {
      setIsDebitOnly(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mercadopago.com/v1/payment_methods/search?public_key=${encodeURIComponent(publicKey)}&bin=${encodeURIComponent(bin.slice(0, 6))}`
      );
      const data = await response.json();
      const methods = Array.isArray(data) ? data : [data];

      const hasCreditOption = methods.some(
        (m: { payment_type_id?: string }) => m.payment_type_id === "credit_card"
      );

      debugPayment("Tipo do cartão identificado", {
        methodsCount: methods.length,
        types: methods.map((m: { payment_type_id?: string }) => m.payment_type_id),
        hasCreditOption,
      });

      setIsDebitOnly(!hasCreditOption);
    } catch (error) {
      debugPayment("⚠️ Não foi possível verificar o tipo do cartão", {
        error: error instanceof Error ? error.message : String(error),
      });
      setIsDebitOnly(false);
    }
  }, [publicKey]);

  // Memoizar configuração para evitar re-renderizações (chamadas ANTES dos early returns)
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

  // Aviso sobre valor mínimo
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

      {isDebitOnly && (
        <div className="mb-4 rounded-lg bg-red-50 border-2 border-red-300 p-3 text-sm text-red-700" role="alert">
          <p className="font-semibold mb-0.5">Cartão de débito não é aceito aqui</p>
          <p>
            Esta tela é somente para <strong>cartão de crédito</strong>. Se quiser pagar à vista,
            volte e escolha <strong>PIX</strong> na tela anterior.
          </p>
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

// Memoizar componente para evitar re-renderizações desnecessárias
export const CardPayment = memo(CardPaymentComponent, (prevProps, nextProps) => {
  // Re-renderizar se cartTotal, callback, ou conteúdo do carrinho mudar
  if (prevProps.cartTotal !== nextProps.cartTotal) return false;
  if (prevProps.onPaymentApproved !== nextProps.onPaymentApproved) return false;
  if (prevProps.onPaymentPending !== nextProps.onPaymentPending) return false;
  if (prevProps.cart.length !== nextProps.cart.length) return false;
  // Comparação profunda: itens + quantidades (preço é derivado do item)
  for (let i = 0; i < prevProps.cart.length; i++) {
    const p = prevProps.cart[i];
    const n = nextProps.cart[i];
    if (p.id !== n.id || p.quantity !== n.quantity) return false;
  }
  return true;
});
