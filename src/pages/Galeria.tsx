import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import wallpaper from "../assets/wallpaper_2.JPEG";
import { colors } from "../theme";
import { layoutPattern } from "../mocks";

interface Photo {
  id: number;
  url: string;
  alt: string;
  date: string;
}

// Importando todas as fotos da galeria
const photoImports = import.meta.glob(
  "../assets/galery/*.{JPEG,jpeg,JPG,jpg,PNG,png}",
  { eager: true },
) as Record<string, { default: string }>;

// Função para extrair data do nome do arquivo e formatar
const extractDateFromFilename = (filename: string): string => {
  const match = filename.match(/(\d{1,2}-\d{1,2}-\d{2,4})/);
  if (match) {
    const [day, month, year] = match[1].split("-");
    return `${day}/${month}/${year.length === 2 ? "20" + year : year}`;
  }
  return "";
};

// Criar array de fotos com datas extraídas dos nomes e configuração de layout
interface PhotoWithLayout extends Photo {
  position?: number;
  colSpan?: number;
  rowSpan?: number;
}

const createPhotosArray = (): PhotoWithLayout[] => {
  const photos: PhotoWithLayout[] = [];
  let id = 1;

  // Separar fotos por tipo
  const horizontalPhotos: PhotoWithLayout[] = [];
  const normalPhotos: PhotoWithLayout[] = [];

  for (const [path, module] of Object.entries(photoImports)) {
    const filename = path.split("/").pop() || "";
    const date = extractDateFromFilename(filename);
    const isHorizontal = filename.startsWith("h-");

    const photo: PhotoWithLayout = {
      id: id++,
      url: module.default,
      alt: "Letícia e Kiury",
      date: date,
      colSpan: 1,
      rowSpan: 1,
    };

    if (isHorizontal) {
      photo.colSpan = 2;
      horizontalPhotos.push(photo);
    } else {
      normalPhotos.push(photo);
    }
  }

  // Ordenar por data (mais recentes primeiro)
  [...horizontalPhotos, ...normalPhotos].forEach((photo) => {
    if (photo.date) {
      photo.date = photo.date;
    }
  });

  horizontalPhotos.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    return (
      new Date(yearB, monthB - 1, dayB).getTime() -
      new Date(yearA, monthA - 1, dayA).getTime()
    );
  });

  normalPhotos.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
    return (
      new Date(yearB, monthB - 1, dayB).getTime() -
      new Date(yearA, monthA - 1, dayA).getTime()
    );
  });

  let hIndex = 0;
  let nIndex = 0;
  let position = 1;

  layoutPattern.forEach((type) => {
    let photo: PhotoWithLayout | undefined;

    if (type === "H") {
      // Usar foto horizontal se disponível, senão usar normal
      if (hIndex < horizontalPhotos.length) {
        photo = { ...horizontalPhotos[hIndex++] };
      } else if (nIndex < normalPhotos.length) {
        photo = { ...normalPhotos[nIndex++], colSpan: 2 };
      }
      if (photo) {
        photo.colSpan = 2;
        photo.rowSpan = 1;
      }
    } else if (type === "V") {
      if (nIndex < normalPhotos.length) {
        photo = { ...normalPhotos[nIndex++] };
        photo.colSpan = 1;
        photo.rowSpan = 2;
      }
    } else {
      if (nIndex < normalPhotos.length) {
        photo = normalPhotos[nIndex++];
        photo.colSpan = 1;
        photo.rowSpan = 1;
      }
    }

    if (photo) {
      photo.position = position++;
      photos.push(photo);
    }
  });

  // Reordenar o array pela posição
  photos.sort((a, b) => (a.position || 0) - (b.position || 0));

  return photos;
};

const photos = createPhotosArray();

const Galeria = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed left-0 right-0 top-0 bottom-[120px] pointer-events-none overflow-hidden z-0">
        {/* Notebook Lines (subtle) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="galleryLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                stopColor={colors.primary[600]}
                stopOpacity="0"
              />
              <stop
                offset="5%"
                stopColor={colors.primary[600]}
                stopOpacity="0.3"
              />
              <stop
                offset="95%"
                stopColor={colors.primary[600]}
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor={colors.primary[600]}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>
          {[...Array(20)].map((_, i) => (
            <line
              key={`line-${i}`}
              x1="0"
              y1={`${(i + 1) * 5}%`}
              x2="100%"
              y2={`${(i + 1) * 5}%`}
              stroke="url(#galleryLine)"
              strokeWidth="0.5"
            />
          ))}
        </svg>
      </div>

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
              Galeria de Fotos
            </h1>
          </div>
        </section>

        {/* Textos de introdução */}
        <section className="py-8 md:py-10 px-4 relative overflow-hidden">
          <div className="max-w-4xl mx-auto">
            {/* Card de destaque */}
            <div
              className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl border-l-8 relative overflow-hidden"
              style={{ borderLeftColor: colors.primary[500] }}
            >
              {/* Background decorativo */}
              <div className="absolute top-0 right-0 w-32 md:w-40 h-32 md:h-40 opacity-5">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  style={{ color: colors.primary[600] }}
                >
                  <path fill="currentColor" d="M50 0 L100 50 L50 100 L0 50 Z" />
                </svg>
              </div>

              <div className="relative z-10 text-center">
                <p
                  className="text-lg md:text-xl lg:text-2xl text-gray-800 leading-relaxed font-medium mb-3"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Bem-vindos à nossa galeria de momentos!
                </p>
                <p
                  className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed mb-4"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  Role para ver nossas fotos
                </p>

                {/* Seta animada para baixo */}
                <div className="flex justify-center animate-bounce">
                  <svg
                    className="w-6 h-6 md:w-7 md:h-7"
                    style={{ color: colors.primary[500] }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Galeria de fotos */}
        <section className="pb-8 md:pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Grid de fotos - Mosaico organizado */}
            <div className="grid grid-cols-4 gap-1 md:gap-2 lg:gap-3 auto-rows-[100px] md:auto-rows-[280px] lg:auto-rows-[325px] relative z-10">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={`
                    relative overflow-hidden rounded-lg md:rounded-xl shadow-lg cursor-pointer group
                    ${photo.colSpan === 2 ? "col-span-2" : "col-span-1"}
                    ${photo.rowSpan === 2 ? "row-span-2" : "row-span-1"}
                  `}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Data no canto inferior */}
                  {photo.date && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 md:p-2">
                      <p className="text-white text-[8px] md:text-xs font-medium">
                        {photo.date}
                      </p>
                    </div>
                  )}

                  {/* Overlay ao passar o mouse */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Modal de foto ampliada */}
      {selectedPhoto && (
        <>
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
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
            </button>
            <div className="max-w-4xl max-h-[90vh]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.alt}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                {selectedPhoto.date && (
                  <p className="text-white text-lg">{selectedPhoto.date}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Galeria;
