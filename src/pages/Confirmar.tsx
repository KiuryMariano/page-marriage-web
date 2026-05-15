import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import wallpaper from "../assets/wallpaper_2.JPEG";
import { colors } from "../theme";

const whatsappNumber = "554599830461";

const Confirmar = () => {
  const [nome, setNome] = useState("");
  const [confirmacao, setConfirmacao] = useState<"sim" | "nao">("sim");

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      alert("Por favor, digite seu nome antes de confirmar.");
      return;
    }

    const textoConfirmacao =
      confirmacao === "sim"
        ? "ESTAREI PRESENTE"
        : "NÃO PODEREI COMPARECER";

    const message = encodeURIComponent(
      `*Confirmação de Presença - Casamento Letícia & Kiury*\n\n` +
        `*Confirmação:* ${textoConfirmacao}\n` +
        `*Nome:* ${nome}\n` +
        `\n_Enviado através do site de casamento_`,
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
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
        <section className="py-16 md:py-20 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Alerta pulsante */}
            <div className="absolute -top-3 -right-3 md:-top-4 md:right-4 z-10">
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-75"
                  style={{ backgroundColor: colors.success.DEFAULT }}
                ></div>
                <div
                  className="relative text-white rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: colors.success.DEFAULT }}
                >
                  <svg
                    className="w-6 h-6 md:w-7 md:h-7"
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

            {/* Card principal */}
            <div
              className="backdrop-blur-sm rounded-3xl p-8 md:p-14 shadow-2xl border-2 relative overflow-hidden"
              style={{
                backgroundColor: `${colors.success.light}15`,
                borderColor: `${colors.success.DEFAULT}30`,
              }}
            >
              {/* Título principal */}
              <h2
                className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  color: colors.success.dark,
                  lineHeight: 1.2,
                }}
              >
                Sua presença é nosso maior presente!
              </h2>

              {/* Data limite destacada */}
              <div
                className="inline-block px-6 py-3 md:px-8 md:py-4 rounded-xl mb-6 md:mb-8 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors.success.light}40, ${colors.success.DEFAULT}20)`,
                  border: `2px solid ${colors.success.DEFAULT}`,
                }}
              >
                <p className="text-sm md:text-base text-gray-700 font-medium mb-1">
                  Confirme até:
                </p>
                <p
                  className="text-xl md:text-3xl font-bold tracking-wider"
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    color: colors.success.dark,
                  }}
                >
                  09/12/2026
                </p>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  (1 mês antes do casamento)
                </p>
              </div>

              {/* Como confirmar */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                <div
                  className="p-4 md:p-6 rounded-xl border-2 backdrop-blur-sm transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: `${colors.success.light}30`,
                    borderColor: `${colors.success.DEFAULT}40`,
                  }}
                >
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
                    style={{ backgroundColor: colors.success.DEFAULT }}
                  >
                    <svg
                      className="w-6 h-6 md:w-7 md:h-7"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3
                    className="text-lg md:text-xl font-semibold mb-2"
                    style={{ color: colors.success.dark }}
                  >
                    Opção 1: Site
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Preencha seu nome e clique em um dos botões abaixo
                  </p>
                </div>

                <div
                  className="p-4 md:p-6 rounded-xl border-2 backdrop-blur-sm transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: `${colors.success.light}30`,
                    borderColor: `${colors.success.DEFAULT}40`,
                  }}
                >
                  <div
                    className="w-12 h-12 md:w-14 md:h-14 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg"
                    style={{ backgroundColor: colors.success.DEFAULT }}
                  >
                    <svg
                      className="w-6 h-6 md:w-7 md:h-7"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <h3
                    className="text-lg md:text-xl font-semibold mb-2"
                    style={{ color: colors.success.dark }}
                  >
                    Opção 2: WhatsApp
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    Entre em contato diretamente: (45) 9983-0461
                  </p>
                </div>
              </div>

              {/* Mensagem final */}
              <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed font-medium">
                Escolha a forma que preferir! O importante é que possamos
                contar com sua presença neste dia tão especial.
              </p>
            </div>
          </div>
        </section>

        {/* Informações do Evento */}
        <section className="pb-8 md:pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div
              className="rounded-2xl p-4 md:p-6 mb-8 md:mb-12 border backdrop-blur-sm"
              style={{
                backgroundColor: `${colors.success.light}30`,
                borderColor: `${colors.success.DEFAULT}50`,
              }}
            >
              <h3
                className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  color: colors.success.dark,
                }}
              >
                <svg
                  className="w-6 h-6"
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
                Informações do Evento
              </h3>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 text-white rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colors.success.DEFAULT }}
                  >
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
                    <p className="text-gray-700 text-sm">
                      09 de Janeiro de 2027
                    </p>
                    <p className="text-gray-500 text-xs">Sábado</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 text-white rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colors.success.DEFAULT }}
                  >
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

            {/* Formulário Simplificado */}
            <div className="max-w-2xl mx-auto relative z-10">
              <div
                className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border"
                style={{ borderColor: `${colors.success.DEFAULT}50` }}
              >
                <h3
                  className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Confirme sua Presença
                </h3>

                <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                  {/* Campo Nome */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-3 text-base md:text-lg">
                      Seu Nome *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl transition-all focus:border-opacity-100 text-lg"
                      style={
                        {
                          "--focus-ring": colors.success.DEFAULT,
                        } as React.CSSProperties
                      }
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.success.light}40, 0 0 0 6px ${colors.success.DEFAULT}20`;
                        e.currentTarget.style.borderColor =
                          colors.success.DEFAULT;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "#d1d5db";
                      }}
                      placeholder="Digite seu nome completo"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>

                  {/* Opção de Confirmação */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-3 text-base md:text-lg">
                      Você poderá comparecer? *
                    </label>
                    <div className="flex gap-4">
                      {[
                        {
                          value: "sim" as const,
                          label: "Estarei lá",
                          icon: (
                            <svg
                              className="w-8 h-8"
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
                          ),
                        },
                        {
                          value: "nao" as const,
                          label: "Não poderei comparecer",
                          icon: (
                            <svg
                              className="w-8 h-8"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          ),
                        },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex-1 cursor-pointer ${
                            confirmacao === option.value ? "ring-2" : ""
                          }`}
                          style={
                            confirmacao === option.value
                              ? ({
                                  "--tw-ring-color": colors.success.DEFAULT,
                                } as React.CSSProperties)
                              : {}
                          }
                        >
                          <input
                            type="radio"
                            name="confirmacao"
                            value={option.value}
                            checked={confirmacao === option.value}
                            onChange={(e) =>
                              setConfirmacao(
                                e.target.value as "sim" | "nao"
                              )
                            }
                            className="sr-only"
                          />
                          <div
                            className={`p-4 md:p-6 rounded-xl border-2 text-center transition-all ${
                              confirmacao === option.value
                                ? "border-opacity-100"
                                : "bg-gray-50 border-gray-200"
                            }`}
                            style={{
                              backgroundColor:
                                confirmacao === option.value
                                  ? `${colors.success.light}40`
                                  : undefined,
                              borderColor:
                                confirmacao === option.value
                                  ? colors.success.DEFAULT
                                  : undefined,
                            }}
                          >
                            <div className="flex justify-center mb-2">
                              {option.icon}
                            </div>
                            <span className="text-sm md:text-base font-semibold">
                              {option.label}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Botão Único de Envio */}
                  <button
                    type="submit"
                    className="w-full text-white font-bold py-5 md:py-6 px-6 rounded-xl transition-all text-lg md:text-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                      backgroundColor: colors.success.DEFAULT,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.success.dark)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        colors.success.DEFAULT)
                    }
                  >
                    <svg
                      className="w-7 h-7"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Enviar Confirmação pelo WhatsApp
                  </button>

                  <p className="text-gray-500 text-sm md:text-base text-center">
                    Você será redirecionado para o WhatsApp com sua confirmação
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
