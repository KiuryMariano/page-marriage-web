import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { colors } from "../theme";

interface PixPaymentProps {
  valor: number;
  descricao: string;
  onPaymentConfirmed: (txid: string) => void;
  onCancel: () => void;
}

const formatPrice = (value: number) => {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const PixPayment = ({ valor, descricao, onPaymentConfirmed, onCancel }: PixPaymentProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [brCode, setBrCode] = useState<string>("");
  const [txid, setTxid] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>("waiting");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const verificationDelay = 10;
  const verificationInterval = 4;
  const maxPollingMs = 30 * 60 * 1000;

  // Refs para evitar problemas com StrictMode
  const pixCreatedRef = useRef(false);
  const pollingInitializedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onPaymentConfirmedRef = useRef(onPaymentConfirmed);
  const isMountedRef = useRef(true);

  useEffect(() => {
    onPaymentConfirmedRef.current = onPaymentConfirmed;
  }, [onPaymentConfirmed]);

  // Criar cobrança PIX
  useEffect(() => {
    // Evitar múltiplas criações devido ao StrictMode
    if (pixCreatedRef.current) {
      return;
    }
    pixCreatedRef.current = true;

    const createPix = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/createPix.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            valor: valor * 100,
            descricao,
            nome: 'Convidado',
          }),
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
          throw new Error(data.error);
        }

        setBrCode(data.brCode);
        setTxid(data.txid);

        const qr = await QRCode.toDataURL(data.brCode);
        setQrCodeUrl(qr);
      } catch (err) {
        setErrorMessage(
          err instanceof Error
            ? `Não foi possível gerar o PIX: ${err.message}`
            : "Não foi possível gerar o PIX. Tente novamente em alguns segundos."
        );
      } finally {
        setLoading(false);
      }
    };

    createPix();
  }, [valor, descricao]);

  // Copiar código com fallback para input+execCommand
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(brCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      return;
    } catch {
      // Fallback: selecionar input e usar execCommand (compatibilidade HTTP / browsers antigos)
    }

    try {
      const input = document.createElement("textarea");
      input.value = brCode;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.focus();
      input.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(input);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    } catch {
      // Não há muito o que fazer; usuário pode copiar manualmente do input visível
    }
  };

  // Verificar pagamento (polling)
  useEffect(() => {
    if (!txid) return;

    // Evitar reinicialização do polling
    if (pollingInitializedRef.current) {
      return;
    }
    pollingInitializedRef.current = true;

    const pollingStartedAt = Date.now();

    const checkStatus = async () => {
      if (!isMountedRef.current) return;

      // Verificar tempo máximo de polling antes de tudo
      if (Date.now() - pollingStartedAt > maxPollingMs) {
        if (!isMountedRef.current) return;
        setPaymentStatus("timeout");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      try {
        if (isMountedRef.current) setIsChecking(true);

        const response = await fetch(`/api/checkPix.php?txid=${txid}`);
        if (!response.ok) return;
        const data = await response.json();

        if (!isMountedRef.current) return;

        if (data.paid) {
          setPaymentStatus("confirmed");
          onPaymentConfirmedRef.current(txid);

          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (intervalRef.current) clearInterval(intervalRef.current);
        }
      } catch {
        // Erro de rede silencioso (próximo tick tenta de novo)
      } finally {
        if (isMountedRef.current) setIsChecking(false);
      }
    };

    // Iniciar polling
    // Primeira verificação após o delay configurado (tempo para o usuário pagar)
    timeoutRef.current = setTimeout(() => {
      checkStatus();

      // Só após a primeira verificação, começar o intervalo configurado
      intervalRef.current = setInterval(checkStatus, verificationInterval * 1000);
    }, verificationDelay * 1000);

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [txid, maxPollingMs]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      {paymentStatus !== "confirmed" && (
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: '"Playfair Display", serif', color: colors.primary[700] }}
          >
            Pagamento via PIX
          </h2>
          <p className="text-gray-600">
            Escaneie o QR Code ou copie o código
          </p>
        </div>
      )}

      {errorMessage ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Não foi possível gerar o PIX</h3>
          <p className="text-gray-600 text-sm mb-6 break-words">{errorMessage}</p>
          <button
            onClick={onCancel}
            className="w-full py-3 px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
          >
            Voltar
          </button>
        </div>
      ) : paymentStatus === "timeout" ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Tempo esgotado</h3>
          <p className="text-gray-600 text-sm mb-6">
            O tempo de verificação automática expirou. Se você já pagou, recarregue a página para confirmar. Caso contrário, feche e gere um novo PIX.
          </p>
          <button
            onClick={onCancel}
            className="w-full py-3 px-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Gerando QR Code...</p>
        </div>
      ) : paymentStatus === "confirmed" ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-600 mb-8">Pagamento Confirmado!</h3>

          <div className="bg-purple-50 rounded-xl p-6 mb-8 border-2 border-purple-100 max-w-sm">
            <p className="text-purple-800 text-base leading-relaxed">
              Com carinho e gratidão agradeçemos, você está ajudando a construir nosso futuro juntos.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Valor */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">Valor presenteado</p>
            <p
              className="text-3xl font-bold"
              style={{ color: colors.primary[600] }}
            >
              {formatPrice(valor)}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-xl shadow-inner">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR Code PIX"
                  className="w-48 h-48"
                />
              )}
            </div>
          </div>

          {/* Copia e Cola */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2 text-center">
              ou use o Pix Copia e Cola:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={brCode}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm font-mono truncate"
              />
              <button
                onClick={copyToClipboard}
                className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copiado!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Status do pagamento */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className={`w-2 h-2 rounded-full ${isChecking ? 'bg-yellow-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
              <span>
                {isChecking ? 'Verificando pagamento...' : 'Aguardando pagamento...'}
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Voltar
            </button>
          </div>
        </>
      )}
    </div>
  );
};
