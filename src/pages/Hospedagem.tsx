import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import wallpaperWebpFull from "../assets/wallpaper_2.webp";
import wallpaperWebpTablet from "../assets/wallpaper_2_tablet.webp";
import wallpaperWebpMobile from "../assets/wallpaper_2_mobile.webp";
import backgroundMoney from "../assets/background_money.webp";
import backgroundMoneyMobile from "../assets/background_money_mobile.webp";
import { colors } from "../theme";

// Importar fotos dos hotéis
import goldenView1 from "../assets/hospedagens/Golden View Hotel 1.jpg";
import goldenView2 from "../assets/hospedagens/Golden View Hotel 2.jpg";
import goldenView3 from "../assets/hospedagens/Golden View Hotel 3.jpg";
import calema1 from "../assets/hospedagens/Hotel Calema 1.jpg";
import calema2 from "../assets/hospedagens/Hotel Calema 2.jpg";
import calema3 from "../assets/hospedagens/Hotel Calema 3.jpg";
import maxiPalace1 from "../assets/hospedagens/Maxi Palace Hotel 1.png";
import maxiPalace2 from "../assets/hospedagens/Maxi Palace Hotel 2.jpg";
import maxiPalace3 from "../assets/hospedagens/Maxi Palace Hotel 3.jpg";
import confortoPlaza1 from "../assets/hospedagens/Conforto Plaza Hotel 1.avif";
import confortoPlaza2 from "../assets/hospedagens/Conforto Plaza Hotel 2.webp";
import confortoPlaza3 from "../assets/hospedagens/Conforto Plaza Hotel 3.avif";

interface Hotel {
  id: string;
  name: string;
  phone: string;
  address: string;
  mapUrl: string;
  images: [string, string, string];
  description?: string;
}

interface Photo {
  src: string;
  hotelName: string;
  index: number;
}

const hotels: Hotel[] = [
  {
    id: "golden-view",
    name: "Golden View Hotel",
    phone: "5545988253495",
    address: "Rod. BR-163, Km 145 - Zona Rural, Capitão Leônidas Marques - PR, CEP 85790-000",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Golden+View+Hotel+Capitão+Leônidas+Marques+PR",
    images: [goldenView1, goldenView2, goldenView3],
    description: "As comodidades incluem serviço de quarto e uma recepção 24 horas, além de Wi-Fi grátis em toda a propriedade. O hotel oferece quartos para famílias."
  },
  {
    id: "calema",
    name: "Hotel Calema",
    phone: "554532861152",
    address: "BR-163, Km 131 (entrada da cidade), Jardim Caçula, Capitão Leônidas Marques - PR, CEP 85790-000",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Calema+Capitão+Leônidas+Marques+PR",
    images: [calema1, calema2, calema3],
    description: "Conta com Wi-Fi grátis e estacionamento privativo grátis. Cada quarto tem mesa de trabalho, TV de tela plana, banheiro privativo, roupa de cama e toalhas."
  },
  {
    id: "maxi-palace",
    name: "Maxi Palace Hotel",
    phone: "5545999043164",
    address: "Avenida Iguaçu, 609 - Centro, Capitão Leônidas Marques - PR, CEP 85790-000",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Maxi+Palace+Hotel+Capitão+Leônidas+Marques+PR",
    images: [maxiPalace1, maxiPalace2, maxiPalace3],
    description: "Oferece jardim e lounge compartilhado. A acomodação conta com serviço de quarto e uma recepção 24 horas. Os quartos têm ar-condicionado e TV de tela plana."
  },
  {
    id: "conforto-plaza",
    name: "Conforto Plaza Hotel",
    phone: "5545999252417",
    address: "Rod. Dep. Arnaldo Faivro Busato Km 139, Capitão Leônidas Marques - PR, CEP 85790-000",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Conforto+Plaza+Hotel+Capitão+Leônidas+Marques+PR",
    images: [confortoPlaza1, confortoPlaza2, confortoPlaza3],
    description: "Inclui serviço de quarto e uma recepção 24 horas, Wi-Fi grátis em toda a propriedade. Lanchonete. Cada quarto tem mesa de trabalho, banheiro privativo com bidê e produtos de banho de cortesia, TV de tela plana e ar-condicionado, e certos quartos também oferecem varanda."
  }
];

// Criar array flat com todas as fotos para navegação
const allPhotos: Photo[] = hotels.flatMap(hotel =>
  hotel.images.map((src, index) => ({
    src,
    hotelName: hotel.name,
    index: index + 1
  }))
);

const Hospedagem = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleWhatsAppClick = (phone: string) => {
    if (!phone) {
      alert("Contato do hotel não disponível no momento. Por favor, entre em contato diretamente.");
      return;
    }

    const message = encodeURIComponent(
      `Olá, gostaria de confirmar a disponibilidade de quartos para o dia 09/01/2027.`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const openLightbox = (photoIndex: number) => {
    setCurrentPhotoIndex(photoIndex);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const goToNext = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % allPhotos.length);
  };

  const goToPrevious = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
  };

  // Fechar com ESC e navegar com setas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  // Handlers para touch/swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Swipe para esquerda (próxima)
    if (diff > 50) {
      goToNext();
    }
    // Swipe para direita (anterior)
    else if (diff < -50) {
      goToPrevious();
    }

    setTouchStart(null);
  };

  const currentPhoto = allPhotos[currentPhotoIndex];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Fixo */}
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

      <Navbar />

      <main>
        {/* Hero Section com Wallpaper */}
        <section className="relative h-[25vh] md:h-[55vh] lg:h-[60vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900">
            <img
              src={wallpaperWebpFull}
              alt="Letícia e Kiury"
              srcSet={`${wallpaperWebpMobile} 800w, ${wallpaperWebpTablet} 1400w, ${wallpaperWebpFull} 6182w`}
              sizes="100vw"
              className="w-full h-full object-cover object-center"
              fetchPriority="high"
              loading="eager"
              decoding="sync"
              style={{ minHeight: '100%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#FDFBF8] via-transparent to-transparent"></div>
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
              Hospedagem
            </h1>
          </div>
        </section>

        {/* Introdução */}
        <section className="py-10 md:py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-stone-300"></div>
              <svg className="w-6 h-6" style={{ color: colors.success.DEFAULT }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-stone-300"></div>
            </div>

            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
              Para nossos convidados que vêm de fora, selecionamos alguns hotéis na região para sua hospedagem.
            </p>
            <p className="text-base md:text-lg text-gray-600 italic">
              Entre em contato diretamente com os hotéis para fazer sua reserva.
            </p>
          </div>
        </section>

        {/* Lista de Hotéis */}
        <section className="pb-4 md:pb-12 px-4">
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
            {hotels.map((hotel, hotelIndex) => {
              const photoStartIndex = hotelIndex * 3;
              return (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border flex flex-col md:flex-row"
                  style={{ borderColor: `${colors.success.DEFAULT}30` }}
                >
                  <div className="grid md:grid-cols-2 flex-1">
                    {/* Fotos - Layout com imagem 1 maior e 2,3 à direita */}
                    <div className="grid grid-cols-[2fr_1fr] grid-rows-2 gap-2 p-2 h-[280px] md:h-[350px]">
                      {/* Foto Principal - Imagem 1 (maior, ocupa toda a altura) */}
                      <div
                        className="row-span-2 relative cursor-pointer group overflow-hidden rounded-lg"
                        onClick={() => openLightbox(photoStartIndex)}
                      >
                        <img
                          src={hotel.images[0]}
                          alt={`${hotel.name} - Foto 1`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>

                      {/* Foto 2 */}
                      <div
                        className="relative cursor-pointer group"
                        onClick={() => openLightbox(photoStartIndex + 1)}
                      >
                        <img
                          src={hotel.images[1]}
                          alt={`${hotel.name} - Foto 2`}
                          className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>

                      {/* Foto 3 */}
                      <div
                        className="relative cursor-pointer group"
                        onClick={() => openLightbox(photoStartIndex + 2)}
                      >
                        <img
                          src={hotel.images[2]}
                          alt={`${hotel.name} - Foto 3`}
                          className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-[1.02]"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="p-6 md:p-8 flex flex-col justify-between min-h-[320px] md:min-h-[380px]">
                      <h3
                        className="text-2xl md:text-3xl font-semibold mb-3"
                        style={{
                          fontFamily: '"Playfair Display", serif',
                          color: colors.primary[600],
                        }}
                      >
                        {hotel.name}
                      </h3>

                      {hotel.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed text-justify">
                          {hotel.description}
                        </p>
                      )}

                      {/* Endereço e Contato */}
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        {/* Endereço */}
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 text-white rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: colors.primary[600] }}
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
                          <p className="text-gray-600 text-sm leading-relaxed">{hotel.address}</p>
                        </div>

                        {/* Contato */}
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 text-white rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: colors.primary[600] }}
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
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {hotel.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
                          </p>
                        </div>
                      </div>

                      {/* Botões de Ação - Mobile: lado a lado | Desktop: WhatsApp full width */}
                      {hotel.phone ? (
                        <>
                          {/* Botões lado a lado - Mobile e Desktop */}
                          <div className="flex gap-3">
                            <a
                              href={hotel.mapUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 font-semibold py-3 md:py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm md:text-lg bg-white border-2"
                              style={{
                                fontFamily: '"Playfair Display", serif',
                                color: colors.primary[600],
                                borderColor: '#f3f4f6',
                              }}
                            >
                              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.primary[600] }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Localização
                            </a>
                            <button
                              onClick={() => handleWhatsAppClick(hotel.phone)}
                              className="flex-1 font-semibold py-3 md:py-4 px-4 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm md:text-lg bg-white border-2"
                              style={{
                                fontFamily: '"Playfair Display", serif',
                                color: colors.success.DEFAULT,
                                borderColor: '#f3f4f6',
                              }}
                            >
                              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: colors.success.DEFAULT }}>
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                              </svg>
                              WhatsApp
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-500 text-sm italic mt-4 text-center p-4 bg-gray-100 rounded-lg">
                          Contato em breve
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Nota Final */}
        <section className="py-2 md:py-6 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="p-6 md:p-8 rounded-xl border" style={{
              backgroundColor: `${colors.success.light}20`,
              borderColor: `${colors.success.DEFAULT}30`,
            }}>
              <p className="text-gray-700 leading-relaxed">
                Recomendamos que faça sua reserva com antecedência, especialmente para a data do nosso casamento.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox / Visualizador de Imagens */}
      {lightboxOpen && currentPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Botão Fechar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Fechar"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Seta Anterior */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 md:left-8 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Anterior"
          >
            <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Imagem */}
          <div
            className="max-w-[90vw] max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentPhoto.src}
              alt={`${currentPhoto.hotelName} - Foto ${currentPhoto.index}`}
              className="max-w-full max-h-[85vh] object-contain"
            />
            <p className="text-white text-center mt-3 text-sm md:text-base opacity-80">
              {currentPhoto.hotelName} - Foto {currentPhoto.index}
            </p>
          </div>

          {/* Seta Próximo */}
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 md:right-8 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Próximo"
          >
            <svg className="w-10 h-10 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Hospedagem;
