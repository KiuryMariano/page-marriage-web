import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import wallpaper from "../assets/wallpaper_2.JPEG";
import { colors } from "../theme";

interface Photo {
  id: number;
  url: string;
  alt: string;
  category: string;
}

const photos: Photo[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop',
    alt: 'Casal feliz',
    category: 'Noivado',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=800&fit=crop',
    alt: 'Momento especial',
    category: 'Noivado',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=800&fit=crop',
    alt: 'Casal apaixonado',
    category: 'Ensaio',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop',
    alt: 'Noivos',
    category: 'Ensaio',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=800&fit=crop',
    alt: 'Amor eterno',
    category: 'Casamento',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=800&fit=crop',
    alt: 'Momento único',
    category: 'Casamento',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    alt: 'Casal juntos',
    category: 'Noivado',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=800&fit=crop',
    alt: 'Felicidade',
    category: 'Ensaio',
  },
];

const categories = ['Todos', 'Noivado', 'Ensaio', 'Casamento'];

const Galeria = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const filteredPhotos = selectedCategory === 'Todos'
    ? photos
    : photos.filter(photo => photo.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col relative bg-white overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed left-0 right-0 top-0 bottom-[120px] pointer-events-none overflow-hidden z-0">
        {/* Floating Hearts */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`heart-${i}`}
              className="absolute animate-float-heart"
              style={{
                color: colors.primary[400],
                opacity: 0.5,
              }}
              style={{
                left: `${5 + i * 7}%`,
                bottom: `-100px`,
                animationDelay: `${i * 4}s`,
                animationDuration: `${18 + Math.random() * 8}s`,
                fontSize: `${20 + Math.random() * 24}px`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>

        {/* Notebook Lines (subtle) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="galleryLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.primary[600]} stopOpacity="0" />
              <stop offset="5%" stopColor={colors.primary[600]} stopOpacity="0.3" />
              <stop offset="95%" stopColor={colors.primary[600]} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colors.primary[600]} stopOpacity="0" />
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

      {/* Custom animations via style tag */}
      <style>{`
        @keyframes float-heart {
          0% {
            transform: translateY(0) translateX(0) rotate(-15deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-50vh) translateX(15px) rotate(15deg) scale(1.2);
          }
          90% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-120vh) translateX(-15px) rotate(-10deg) scale(0.8);
            opacity: 0;
          }
        }

        .animate-float-heart {
          animation: float-heart linear infinite;
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
              Galeria de Fotos
            </h1>
          </div>
        </section>

        {/* Textos de introdução */}
        <section className="py-12 md:py-16 px-4 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center relative">
            {/* Alerta pulsante */}
            <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-10">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: colors.primary[500] }}></div>
                <div className="relative text-white rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg" style={{ backgroundColor: colors.primary[500] }}>
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
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-lg border" style={{
              backgroundColor: `${colors.primary[50]}80`,
              borderColor: `${colors.primary[200]}80`,
            }}>
              <p className="text-base md:text-lg lg:text-xl mb-3 md:mb-4 tracking-[0.1em] md:tracking-[0.15em] text-gray-800 font-medium">
                Nossos momentos mais especiais!
              </p>
              <p className="text-sm md:text-lg lg:text-xl text-gray-700 leading-relaxed tracking-[0.1em] md:tracking-[0.15em] font-medium mb-3 md:mb-4">
                Cada foto conta uma parte da nossa história de amor.
              </p>
              <p className="text-xs md:text-base lg:text-lg text-gray-600 leading-relaxed tracking-[0.1em] md:tracking-[0.15em]">
                Em breve, adicionaremos nossas fotos reais aqui! 📸
              </p>
            </div>
          </div>
        </section>

        {/* Categorias */}
        <section className="pb-8 md:pb-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl p-4 md:p-6 mb-8 md:mb-12 border backdrop-blur-sm relative z-10" style={{
              backgroundColor: `${colors.primary[50]}60`,
              borderColor: `${colors.primary[200]}50`,
            }}>
              <h3
                className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2"
                style={{
                  fontFamily: '"Playfair Display", serif',
                  color: colors.primary[800],
                }}
              >
                <span>📷</span> Filtros
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium transition-all text-sm md:text-base ${
                      selectedCategory === category
                        ? 'text-white shadow-md'
                        : 'bg-white text-gray-700 border'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category
                        ? colors.primary[500]
                        : undefined,
                      borderColor: selectedCategory === category
                        ? colors.primary[500]
                        : colors.primary[200],
                    }}
                    style={{ fontFamily: '"Playfair Display", serif' }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de fotos */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 relative z-10">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer group ${
                    index === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <p className="text-white text-sm md:text-base font-medium">
                        {photo.alt}
                      </p>
                      <p className="text-xs" style={{ color: colors.primary[300] }}>
                        {photo.category}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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

            {/* Empty state */}
            {filteredPhotos.length === 0 && (
              <div className="text-center py-20 relative z-10">
                <p className="text-gray-500 text-lg">Nenhuma foto encontrada nesta categoria.</p>
              </div>
            )}
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
              <p className="text-white text-center mt-4 text-lg">
                {selectedPhoto.alt}
              </p>
              <p className="text-center text-sm" style={{ color: colors.primary[400] }}>
                {selectedPhoto.category}
              </p>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Galeria;
