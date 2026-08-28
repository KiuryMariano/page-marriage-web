import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import wallpaperWebpFull from "../assets/wallpapers/wallpaper_4.webp";
import wallpaperWebpTablet from "../assets/wallpapers/wallpaper_4_tablet.webp";
import wallpaperWebpMobile from "../assets/wallpapers/wallpaper_4_mobile.webp";
import backgroundMoney from "../assets/backgrounds/background_money.webp";
import backgroundMoneyMobile from "../assets/backgrounds/background_money_mobile.webp";
import { colors, gradients } from "../theme";

// Importar fotos dos hotéis
import goldenView1 from "../assets/hospedagens/Golden View Hotel 1.webp";
import goldenView2 from "../assets/hospedagens/Golden View Hotel 2.webp";
import goldenView3 from "../assets/hospedagens/Golden View Hotel 3.webp";
import calema1 from "../assets/hospedagens/Hotel Calema 1.webp";
import calema2 from "../assets/hospedagens/Hotel Calema 2.webp";
import calema3 from "../assets/hospedagens/Hotel Calema 3.webp";
import maxiPalace1 from "../assets/hospedagens/Maxi Palace Hotel 1.webp";
import maxiPalace2 from "../assets/hospedagens/Maxi Palace Hotel 2.webp";
import maxiPalace3 from "../assets/hospedagens/Maxi Palace Hotel 3.webp";
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
    address: "Rod. BR-163, Km 145",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Golden+View+Hotel+Capitão+Leônidas+Marques+PR",
    images: [goldenView1, goldenView2, goldenView3],
    description: "As comodidades incluem serviço de quarto e uma recepção 24 horas, além de Wi-Fi grátis em toda a propriedade. O hotel oferece quartos para famílias."
  },
  {
    id: "calema",
    name: "Hotel Calema",
    phone: "554532861152",
    address: "BR-163, Km 131 (entrada da cidade)",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Calema+Capitão+Leônidas+Marques+PR",
    images: [calema1, calema2, calema3],
    description: "Conta com Wi-Fi grátis e estacionamento privativo grátis. Cada quarto tem mesa de trabalho, TV de tela plana, banheiro privativo, roupa de cama e toalhas."
  },
  {
    id: "maxi-palace",
    name: "Maxi Palace Hotel",
    phone: "5545999043164",
    address: "Av. Iguaçu, 609 - Centro",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Maxi+Palace+Hotel+Capitão+Leônidas+Marques+PR",
    images: [maxiPalace1, maxiPalace2, maxiPalace3],
    description: "Oferece jardim e lounge compartilhado. A acomodação conta com serviço de quarto e uma recepção 24 horas. Os quartos têm ar-condicionado e TV de tela plana."
  },
  {
    id: "conforto-plaza",
    name: "Conforto Plaza Hotel",
    phone: "5545999252417",
    address: "Rod. Dep. Arnaldo Faivro Busato, Km 139",
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

// ============================================================
// Profissionais de beleza (salões, maquiadoras e unhas)
// phone no formato internacional para o wa.me: 55 + DDD + número
// ============================================================
interface Professional {
  id: string;
  name: string;
  category: ProCategory; // exibida como texto no card — sempre presente
  phone?: string;      // wa.me: 55 + DDD + número
  instagram?: string;  // usuário sem @
  note?: string;       // observação extra exibida no card
}

type ProCategory = "salao" | "maquiagem" | "unhas";

const categoryLabels: Record<ProCategory, string> = {
  salao: "Salão",
  maquiagem: "Maquiagem",
  unhas: "Unhas",
};

type ServiceTab = "todos" | "hospedagens" | "saloes" | "maquiadoras" | "unhas";

const serviceTabs: Array<{ key: ServiceTab; label: string }> = [
  { key: "todos", label: "Todos" },
  { key: "hospedagens", label: "Hospedagens" },
  { key: "saloes", label: "Salões" },
  { key: "maquiadoras", label: "Maquiadoras" },
  { key: "unhas", label: "Unhas" },
];

const hotelWhatsAppMessage = "Olá, gostaria de confirmar a disponibilidade de quartos para o dia 09/01/2027.";
const professionalWhatsAppMessage = "Olá! Vim pelo site do casamento de Letícia & Kiury e gostaria de mais informações sobre seus serviços.";

const saloes: Professional[] = [
  { id: "salao-da-iva", name: "Salão da Iva", category: "salao", phone: "554532861341", instagram: "salaodaiva" },
  { id: "studio-fer-dallpra", name: "Studio Fer Dallpra", category: "salao", phone: "554599366428", instagram: "studio_ferdallpra", note: "Fernanda" },
  { id: "studio-aline-ribas", name: "Studio Aline Ribas", category: "salao", phone: "554599914484", instagram: "studio_alineribas", note: "Aline Ribas" },
  { id: "duo-studio-fiori", name: "Duo Studio Fiori", category: "salao", instagram: "duostudiofiori" },
  { id: "studio-jhulia-mayara", name: "Studio Jhulia Mayara", category: "salao", instagram: "studio.jhuliamayaraa" },
  { id: "maikon", name: "Maikon", category: "salao", phone: "554598527917", instagram: "maikon_spanhol_oliveira" },
];

const maquiadoras: Professional[] = [
  { id: "flavia-martinelli", name: "Flávia Martinelli", category: "maquiagem", phone: "554599989403", instagram: "maquiadora_flavia" },
  { id: "manu-peccin", name: "Manu Peccin", category: "maquiagem", phone: "554599903644", instagram: "emanuellypeccin", note: "Atende no Salão da Iva" },
  { id: "andressa-thome", name: "Andressa Thomé", category: "maquiagem", phone: "554599902595", instagram: "andressathomebeauty" },
  { id: "luiza-knecht", name: "Luiza Knecht", category: "maquiagem", phone: "554598196085", instagram: "dra.luizaknecht" },
  { id: "ticiane", name: "Ticiane", category: "maquiagem", phone: "554598384555", instagram: "ticianetorresdemedeiros" },
  { id: "geh", name: "Geh", category: "maquiagem", phone: "554599408047" },
];

const unhas: Professional[] = [
  { id: "karol-mello", name: "Karol Mello", category: "unhas", phone: "5545988260284", note: "Esmaltação em gel" },
  { id: "gislaine-lembeck", name: "Gislaine Lembeck", category: "unhas", phone: "5545991411273", instagram: "gih.lembeck_unhas" },
  { id: "suellen", name: "Suellen", category: "unhas", phone: "554588323524", instagram: "suh_quadri_nail_designer" },
  { id: "camila-salles", name: "Camila Salles", category: "unhas", phone: "554599914672", instagram: "camila_salles0" },
  { id: "rozangela-uchoa", name: "Rozangela Uchoa", category: "unhas", phone: "554599386351", instagram: "rozangela_uchoa" },
];

const professionalsByTab: Record<Exclude<ServiceTab, "hospedagens" | "todos">, Professional[]> = {
  saloes,
  maquiadoras,
  unhas,
};

const allProfessionals: Professional[] = [...saloes, ...maquiadoras, ...unhas];

const formatPhone = (phone: string) => {
  const ddd = phone.slice(2, 4);
  const rest = phone.slice(4);
  return rest.length === 9
    ? `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`
    : `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
};

const InstagramIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const ProfessionalCard = ({ professional }: { professional: Professional }) => {
  const { phone, instagram, category } = professional;

  return (
    <div
      className="bg-white shadow-lg overflow-hidden border flex flex-col h-full"
      style={{ borderColor: `${colors.success.DEFAULT}30` }}
    >
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3
          className="text-xl md:text-2xl font-semibold mb-2"
          style={{ fontFamily: '"Playfair Display", serif', color: colors.primary[600] }}
        >
          {professional.name}
        </h3>

        <p className="text-xs text-gray-500 italic mb-3">
          {professional.note
            ? `${categoryLabels[category]} — ${professional.note}`
            : categoryLabels[category]}
        </p>

        <div className="space-y-2.5 mb-5 flex-1">
          {phone && (
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 text-white rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.primary[600] }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600">{formatPhone(phone)}</p>
            </div>
          )}

          {instagram && (
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 text-white rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.primary[600] }}
              >
                <InstagramIcon className="w-4 h-4" />
              </div>
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-600 hover:underline break-all"
              >
                @{instagram}
              </a>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          {phone && (
            <button
              onClick={() => {
                const message = encodeURIComponent(professionalWhatsAppMessage);
                window.open(`https://wa.me/${phone}?text=${message}`, "_blank", "noopener,noreferrer");
              }}
              className="flex-1 font-semibold py-2.5 md:py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md text-xs md:text-sm bg-white border-2"
              style={{
                fontFamily: '"Playfair Display", serif',
                color: colors.success.DEFAULT,
                borderColor: "#f3f4f6",
              }}
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: colors.success.DEFAULT }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>
          )}

          {instagram && (
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 font-semibold py-2.5 md:py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md text-xs md:text-sm bg-white border-2"
              style={{
                fontFamily: '"Playfair Display", serif',
                color: "#E1306C",
                borderColor: "#f3f4f6",
              }}
            >
              <InstagramIcon className="w-4 h-4 md:w-5 md:h-5" />
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

interface HotelCardProps {
  hotel: Hotel;
  photoStartIndex: number;
  openLightbox: (photoIndex: number) => void;
  handleWhatsAppClick: (phone: string) => void;
}

const HotelCard = ({ hotel, photoStartIndex, openLightbox, handleWhatsAppClick }: HotelCardProps) => {
  return (
    <div
      className="bg-white shadow-lg overflow-hidden border"
      style={{ borderColor: `${colors.success.DEFAULT}30` }}
    >
      <div className="flex flex-col">
        {/* Fotos - Layout com imagem 1 maior e 2,3 à direita */}
        <div className="grid grid-cols-[2fr_1fr] grid-rows-2 gap-2 p-2 h-[240px] md:h-[220px] lg:h-[240px]">
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
        <div className="p-5 md:p-6 flex flex-col justify-between flex-1">
          <h3
            className="text-xl md:text-2xl font-semibold mb-3"
            style={{
              fontFamily: '"Playfair Display", serif',
              color: colors.primary[600],
            }}
          >
            {hotel.name}
          </h3>

          {hotel.description && (
            <p className="text-sm text-gray-600 mb-4 leading-relaxed text-justify">
              {hotel.description}
            </p>
          )}

          {/* Endereço e Contato */}
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            {/* Endereço */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 text-white rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.primary[600] }}
              >
                <svg
                  className="w-4 h-4"
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
              <p className="text-xs text-gray-600 leading-relaxed">{hotel.address}</p>
            </div>

            {/* Contato */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 text-white rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: colors.primary[600] }}
              >
                <svg
                  className="w-4 h-4"
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
              <p className="text-xs text-gray-600">
                {hotel.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')}
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          {hotel.phone ? (
            <div className="flex gap-3">
              <a
                href={hotel.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 font-semibold py-2.5 md:py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md text-xs md:text-sm bg-white border-2"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  color: colors.primary[600],
                  borderColor: '#f3f4f6',
                }}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: colors.primary[600] }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Localização
              </a>
              <button
                onClick={() => handleWhatsAppClick(hotel.phone)}
                className="flex-1 font-semibold py-2.5 md:py-3 px-3 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] shadow-md text-xs md:text-sm bg-white border-2"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  color: colors.success.DEFAULT,
                  borderColor: '#f3f4f6',
                }}
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color: colors.success.DEFAULT }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </button>
            </div>
          ) : (
            <div className="text-gray-500 text-sm italic mt-4 text-center p-4 bg-gray-100 rounded-lg">
              Contato em breve
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HospedagemBeleza = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<ServiceTab>("todos");

  const handleWhatsAppClick = (phone: string) => {
    if (!phone) {
      alert("Contato do hotel não disponível no momento. Por favor, entre em contato diretamente.");
      return;
    }

    const message = encodeURIComponent(hotelWhatsAppMessage);

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
              srcSet={`${wallpaperWebpMobile} 800w, ${wallpaperWebpTablet} 1400w, ${wallpaperWebpFull} 1707w`}
              sizes="100vw"
              className="w-full h-full object-cover object-[10%_90%] scale-110 origin-[100%_80%]"
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
              Hospedagem & Beleza
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
              Para nosso grande dia, selecionamos hotéis na região e profissionais de beleza de confiança para receber você.
            </p>
            <p className="text-base md:text-lg text-gray-600 italic">
              Entre em contato diretamente para garantir sua reserva ou agendar seu horário.
            </p>
          </div>
        </section>

        {/* Filtros: Todos / Hospedagens / Salões / Maquiadoras / Unhas */}
        <section className="pb-2 md:pb-4 px-4">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2 md:gap-3">
            {serviceTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full border-2 font-semibold text-xs md:text-sm transition-all hover:scale-[1.03] active:scale-[0.97] ${
                  activeTab === tab.key
                    ? "text-white shadow-md border-transparent"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
                style={
                  activeTab === tab.key
                    ? { background: gradients.primary, fontFamily: '"Playfair Display", serif' }
                    : { fontFamily: '"Playfair Display", serif' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Lista por categoria */}
        <section className="pb-4 md:pb-12 px-4">
          {(activeTab === "saloes" || activeTab === "maquiadoras" || activeTab === "unhas") && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {professionalsByTab[activeTab].map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
            </div>
          )}
          {activeTab === "todos" && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {allProfessionals.map((professional) => (
                <ProfessionalCard key={professional.id} professional={professional} />
              ))}
              {hotels.map((hotel, hotelIndex) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  photoStartIndex={hotelIndex * 3}
                  openLightbox={openLightbox}
                  handleWhatsAppClick={handleWhatsAppClick}
                />
              ))}
            </div>
          )}
          {activeTab === "hospedagens" && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {hotels.map((hotel, hotelIndex) => {
              const photoStartIndex = hotelIndex * 3;
              return (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  photoStartIndex={photoStartIndex}
                  openLightbox={openLightbox}
                  handleWhatsAppClick={handleWhatsAppClick}
                />
              );
            })}
          </div>
          )}
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

export default HospedagemBeleza;
