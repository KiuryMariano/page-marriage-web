import Navbar from '../components/Navbar';
import wallpaper from '../assets/wallpaper_2.JPEG';

const Historia = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
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
            Nossa História
          </h1>
        </div>
      </section>

      {/* Conteúdo da História */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600 text-lg mb-12">
            Nossa jornada de amor...
          </p>
          <div className="space-y-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💕</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>O Primeiro Encontro</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💍</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2" style={{ fontFamily: '"Playfair Display", serif' }}>O Pedido</h3>
              <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Historia;
