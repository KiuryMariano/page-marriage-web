import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import wallpaper from '../assets/wallpaper_2.JPEG';

const Galeria = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        {/* Hero Section com Wallpaper */}
        <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={wallpaper}
              alt="Letícia e Kiury"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
          </div>
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-5xl md:text-7xl mb-4" style={{ fontFamily: '"Great Vibes", cursive', textShadow: '0 4px 30px rgba(0,0,0,0.8)' }}>
              Galeria
            </h1>
          </div>
        </section>

        {/* Conteúdo da Galeria */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <p className="text-center text-gray-600 text-lg mb-12">
              Nossos momentos especiais
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="aspect-square bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Foto {item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Galeria;
