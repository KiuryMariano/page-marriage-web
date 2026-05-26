import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import wallpaperWebpFull from "../assets/wallpaper_2.webp";
import wallpaperWebpTablet from "../assets/wallpaper_2_tablet.webp";
import wallpaperWebpMobile from "../assets/wallpaper_2_mobile.webp";
import wallpaperJpeg from "../assets/wallpaper_2.JPEG";
import background from "../assets/background.png";
import { colors } from "../theme";

const whatsappNumber = "554599830461";

const Confirmar = () => {
  const [nome, setNome] = useState("");

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      alert("Por favor, digite o nome dos convidados antes de confirmar.");
      return;
    }

    const message = encodeURIComponent(
      `*Confirmação de Presença - Casamento Letícia & Kiury*\n\n` +
        `*Confirmado(s):* ${nome}\n\n` +
        `_Enviado através do site de casamento_`,
    );

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Fixo */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
      </div>

      <Navbar />

      <main>
        {/* Hero Section com Wallpaper */}
        <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900">
            <picture>
              <source
                srcSet={`${wallpaperWebpMobile} 800w, ${wallpaperWebpTablet} 1400w, ${wallpaperWebpFull} 6182w`}
                sizes="100vw"
                type="image/webp"
              />
              <img
                src={wallpaperJpeg}
                alt="Letícia e Kiury"
                srcSet={`${wallpaperWebpMobile} 800w, ${wallpaperWebpTablet} 1400w, ${wallpaperWebpFull} 6182w`}
                sizes="100vw"
                className="w-full h-full object-cover"
                fetchPriority="high"
                loading="eager"
                decoding="sync"
                style={{ minHeight: '100%' }}
              />
            </picture>
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
        <section className="py-8 md:py-12 px-4">
          <div className="max-w-3xl mx-auto">
            {/* Container com borda decorativa */}
            <div className="relative p-8 md:p-12">
              {/* Bordas decorativas nos cantos */}
              <div className="absolute top-0 left-0 w-8 h-8 md:w-12 md:h-12 border-t-4 border-l-4 rounded-tl-lg"
                   style={{ borderColor: colors.success.DEFAULT }}></div>
              <div className="absolute top-0 right-0 w-8 h-8 md:w-12 md:h-12 border-t-4 border-r-4 rounded-tr-lg"
                   style={{ borderColor: colors.success.DEFAULT }}></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 md:w-12 md:h-12 border-b-4 border-l-4 rounded-bl-lg"
                   style={{ borderColor: colors.success.DEFAULT }}></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 md:w-12 md:h-12 border-b-4 border-r-4 rounded-br-lg"
                   style={{ borderColor: colors.success.DEFAULT }}></div>

              {/* Linha decorativa superior */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-300"></div>
                <svg className="w-6 h-6" style={{ color: colors.success.DEFAULT }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-300"></div>
              </div>

              {/* Título principal */}
              <h2
                className="text-3xl md:text-5xl lg:text-6xl text-center mb-8"
                style={{
                  fontFamily: '"Great Vibes", cursive',
                  color: colors.success.dark,
                  lineHeight: 1.3,
                }}
              >
                Sua presença é nosso maior presente!
              </h2>

              {/* Data limite com estilo elegante */}
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="text-center">
                  <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">
                    Confirme até
                  </p>
                  <p
                    className="text-4xl md:text-5xl font-semibold text-gray-800"
                    style={{
                      fontFamily: '"Playfair Display", serif',
                    }}
                  >
                    09/12/2026
                  </p>
                  <p className="text-sm md:text-base text-gray-500 mt-2 italic">
                    1 mês antes do casamento
                  </p>
                </div>
              </div>

              {/* Linha decorativa inferior */}
              <div className="flex items-center justify-center gap-4 mt-8">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-300"></div>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.success.DEFAULT }}></div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-300"></div>
              </div>

              {/* Mensagem final */}
              <p className="text-base md:text-lg text-center text-gray-600 leading-relaxed mt-8 font-light">
                É muito simples! Contamos com sua presença neste dia tão especial.
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
                className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4 flex items-center justify-center gap-2"
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
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 text-white rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colors.success.DEFAULT }}
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
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-lg">Data</h4>
                    <p className="text-gray-700 text-base">
                      09 de Janeiro de 2027
                    </p>
                    <p className="text-gray-500 text-sm">Sábado</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 text-white rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colors.success.DEFAULT }}
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
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-lg">Cerimônia</h4>
                    <p className="text-gray-700 text-base">
                      Paróquia Nossa Senhora da Salete
                    </p>
                    <p className="text-gray-500 text-sm">
                      R. Demetrio Paulo Paini, 103
                    </p>
                    <p className="text-gray-500 text-sm">
                      Cap. Leônidas Marques, PR
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 text-white rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: colors.success.DEFAULT }}
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
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1 text-lg">Festa</h4>
                    <p className="text-gray-700 text-base">
                      Associação dos Quadri
                    </p>
                    <p className="text-gray-500 text-sm">
                      Cap. Leônidas Marques, PR
                    </p>
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
                  className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-800 mb-6 text-center"
                  style={{ fontFamily: '"Great Vibes", cursive' }}
                >
                  Confirme sua Presença
                </h3>

                <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                  {/* Campo Nome dos Convidados */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-3 text-base md:text-lg">
                      Nome(s) do(s) <strong>convidado(s)</strong> *
                    </label>
                    <textarea
                      required
                      rows={3}
                      className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl transition-all focus:border-opacity-100 text-lg resize-none"
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
                      placeholder="Ex: João Silva, Maria Silva (casal) ou Pessoa Solteira"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                    <p className="text-gray-500 text-sm mt-2">
                      Digite o nome de <strong>todos</strong> que estarão presentes
                    </p>
                  </div>

                  {/* Botão de Envio */}
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
                    <strong>Enviar Confirmação</strong> pelo WhatsApp
                  </button>

                  <p className="text-gray-500 text-sm md:text-base text-center">
                    Você será redirecionado para o <strong>WhatsApp</strong> e só precisa <strong>enviar a mensagem</strong>!
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
