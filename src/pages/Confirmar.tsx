import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import wallpaper from "../assets/wallpaper_2.JPEG";
import { colors } from "../theme";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  acompanhantes: string;
  mensagem: string;
 confirmacao: "sim" | "nao" | "talvez";
}

const whatsappNumber = "5546999380201";

const Confirmar = () => {
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    telefone: "",
    acompanhantes: "0",
    mensagem: "",
    confirmacao: "sim",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Criar mensagem para WhatsApp
    const emojiConfirmacao =
      formData.confirmacao === "sim"
        ? "✅"
        : formData.confirmacao === "nao"
        ? "❌"
        : "🤔";
    const textoConfirmacao =
      formData.confirmacao === "sim"
        ? "estarei presente"
        : formData.confirmacao === "nao"
        ? "não poderei comparecer"
        : "ainda não tenho certeza";

    const message = encodeURIComponent(
      `*Confirmação de Presença - Casamento Letícia & Kiury*\n\n` +
        `${emojiConfirmacao} *Confirmação:* ${textoConfirmacao}\n` +
        `👤 *Nome:* ${formData.nome}\n` +
        `📧 *E-mail:* ${formData.email}\n` +
        `📱 *Telefone:* ${formData.telefone}\n` +
        `👥 *Acompanhantes:* ${formData.acompanhantes}\n` +
        (formData.mensagem ? `💬 *Mensagem:* ${formData.mensagem}\n` : "") +
        `\n_Enviado através do site de casamento_ 💒`
    );

    // Redirecionar para WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed left-0 right-0 top-0 bottom-[120px] pointer-events-none overflow-hidden z-0">
        {/* Floating Checkmarks and Hearts */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={`icon-${i}`}
              className="absolute animate-float-icon font-bold"
              style={{
                color: colors.success.light,
                opacity: 0.5,
                left: `${5 + i * 8}%`,
                bottom: `-100px`,
                animationDelay: `${i * 4.5}s`,
                animationDuration: `${16 + Math.random() * 10}s`,
                fontSize: `${24 + Math.random() * 20}px`,
              }}
            >
              {i % 3 === 0 ? "✓" : i % 3 === 1 ? "💒" : "💕"}
            </div>
          ))}
        </div>

        {/* Notebook Lines (subtle) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="rsvpLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.success.dark} stopOpacity="0" />
              <stop offset="5%" stopColor={colors.success.dark} stopOpacity="0.3" />
              <stop offset="95%" stopColor={colors.success.dark} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors.success.dark} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <line
              key={`line-${i}`}
              x1="0"
              y1={`${(i + 1) * 5}%`}
              x2="100%"
              y2={`${(i + 1) * 5}%`}
              stroke="url(#rsvpLine)"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

      {/* Custom animations via style tag */}
      <style>{`
        @keyframes float-icon {
          0% {
            transform: translateY(0) translateX(0) rotate(-10deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-50vh) translateX(20px) rotate(10deg) scale(1.1);
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-120vh) translateX(-20px) rotate(-5deg) scale(0.9);
            opacity: 0;
          }
        }

        .animate-float-icon {
          animation: float-icon linear infinite;
        }
      `}</style>

      <Navbar />

      <main>
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
              Confirmar Presença
            </h1>
          </div>
        </section>

        {/* Textos de introdução */}
        <section className="py-12 md:py-16 px-4 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center relative">
            {/* Alerta pulsante */}
            <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-10">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: colors.success.DEFAULT }}></div>
                <div className="relative text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg" style={{ backgroundColor: colors.success.DEFAULT }}>
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-lg border" style={{
              backgroundColor: `${colors.success.light}20`,
              borderColor: `${colors.success.DEFAULT}40`,
            }}>
              <p className="text-base md:text-lg lg:text-xl mb-3 md:mb-4 tracking-[0.1em] md:tracking-[0.15em] text-gray-800 font-medium">
                Sua presença é nosso maior presente!
              </p>
              <p className="text-sm md:text-lg lg:text-xl text-gray-700 leading-relaxed tracking-[0.1em] md:tracking-[0.15em] font-medium mb-3 md:mb-4">
                Por favor, confirme sua participação até 30 dias antes do
                evento para que possamos organizar tudo com carinho.
              </p>
              <p className="text-xs md:text-base lg:text-lg text-gray-600 leading-relaxed tracking-[0.1em] md:tracking-[0.15em]">
                Preencha o formulário abaixo e você será redirecionado para o
                WhatsApp para enviar sua confirmação.
              </p>
            </div>
          </div>
        </section>

        {/* Informações do Evento */}
        <section className="pb-8 md:pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl p-4 md:p-6 mb-8 md:mb-12 border backdrop-blur-sm" style={{
              backgroundColor: `${colors.success.light}30`,
              borderColor: `${colors.success.DEFAULT}50`,
            }}>
              <h3
                className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  color: colors.success.dark,
                }}
              >
                <span>📅</span> Informações do Evento
              </h3>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 text-white rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: colors.success.DEFAULT }}>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Data</h4>
                    <p className="text-gray-700 text-sm">09 de Janeiro de 2027</p>
                    <p className="text-gray-500 text-xs">Sábado</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 text-white rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: colors.success.DEFAULT }}>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Local</h4>
                    <p className="text-gray-700 text-sm">A confirmar</p>
                    <p className="text-gray-500 text-xs">Pato Branco, PR</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border" style={{ borderColor: `${colors.success.DEFAULT}50` }}>
                <h3
                  className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Formulário de Confirmação
                </h3>

                {submitted && (
                  <div className="mb-6 border px-4 py-3 rounded-lg" style={{
                    backgroundColor: `${colors.success.light}40`,
                    borderColor: colors.success.DEFAULT,
                    color: colors.success.dark,
                  }}>
                    <p className="font-medium">✅ Redirecionando para WhatsApp...</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                  {/* Confirmação */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                      Você poderá comparecer? *
                    </label>
                    <div className="flex gap-4">
                      {[
                        { value: "sim", label: "Sim, estarei lá!", emoji: "✅" },
                        { value: "talvez", label: "Ainda não sei", emoji: "🤔" },
                        { value: "nao", label: "Não poderei ir", emoji: "❌" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex-1 cursor-pointer ${
                            formData.confirmacao === option.value
                              ? "ring-2"
                              : ""
                          }`}
                          style={formData.confirmacao === option.value ? {
                            "--tw-ring-color": colors.success.DEFAULT
                          } as React.CSSProperties : {}}
                        >
                          <input
                            type="radio"
                            name="confirmacao"
                            value={option.value}
                            checked={formData.confirmacao === option.value}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                confirmacao: e.target.value as "sim" | "nao" | "talvez",
                              })
                            }
                            className="sr-only"
                          />
                          <div
                            className={`p-3 md:p-4 rounded-lg border-2 text-center transition-all ${
                              formData.confirmacao === option.value
                                ? "border-opacity-100"
                                : "bg-gray-50 border-gray-200"
                            }`}
                            style={{
                              backgroundColor: formData.confirmacao === option.value
                                ? `${colors.success.light}40`
                                : undefined,
                              borderColor: formData.confirmacao === option.value
                                ? colors.success.DEFAULT
                                : undefined,
                            }}
                          >
                            <span className="text-2xl md:text-3xl block mb-1">
                              {option.emoji}
                            </span>
                            <span className="text-xs md:text-sm font-medium">
                              {option.label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Nome */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all focus:border-opacity-100"
                      style={{'--focus-ring': colors.success.DEFAULT} as React.CSSProperties}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.success.light}40, 0 0 0 4px ${colors.success.DEFAULT}20`
                        e.currentTarget.style.borderColor = colors.success.DEFAULT
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                      placeholder="Seu nome completo"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all focus:border-opacity-100"
                      style={{'--focus-ring': colors.success.DEFAULT} as React.CSSProperties}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.success.light}40, 0 0 0 4px ${colors.success.DEFAULT}20`
                        e.currentTarget.style.borderColor = colors.success.DEFAULT
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                      Telefone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all focus:border-opacity-100"
                      style={{'--focus-ring': colors.success.DEFAULT} as React.CSSProperties}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.success.light}40, 0 0 0 4px ${colors.success.DEFAULT}20`
                        e.currentTarget.style.borderColor = colors.success.DEFAULT
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                      }
                    />
                  </div>

                  {/* Acompanhantes */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                      Número de Acompanhantes (além de você)
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-all focus:border-opacity-100"
                      style={{'--focus-ring': colors.success.DEFAULT} as React.CSSProperties}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${colors.success.light}40, 0 0 0 4px ${colors.success.DEFAULT}20`
                        e.currentTarget.style.borderColor = colors.success.DEFAULT
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = 'none'
                        e.currentTarget.style.borderColor = '#d1d5db'
                      }}
                      value={formData.acompanhantes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          acompanhantes: e.target.value,
                        })
                      }
                    >
                      <option value="0">Nenhum</option>
                      <option value="1">1 Acompanhante</option>
                      <option value="2">2 Acompanhantes</option>
                      <option value="3">3 Acompanhantes</option>
                      <option value="4">4 Acompanhantes</option>
                    </select>
                  </div>

                  {/* Mensagem */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2 text-sm md:text-base">
                      Mensagem (opcional)
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                      rows={3}
                      placeholder="Deixe um recado carinhoso para os noivos..."
                      value={formData.mensagem}
                      onChange={(e) =>
                        setFormData({ ...formData, mensagem: e.target.value })
                      }
                    />
                  </div>

                  {/* Botão Submit */}
                  <button
                    type="submit"
                    className="w-full text-white font-bold py-4 px-6 rounded-lg transition-all text-lg md:text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      backgroundColor: colors.success.DEFAULT,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.success.dark}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.success.DEFAULT}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Enviar Confirmação pelo WhatsApp
                  </button>
                  <p className="text-gray-500 text-xs md:text-sm text-center">
                    Você será redirecionado para o WhatsApp com uma mensagem pronta
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Confirmar;
