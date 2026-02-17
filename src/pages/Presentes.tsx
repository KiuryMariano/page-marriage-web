import Navbar from '../components/Navbar';
import wallpaper from '../assets/wallpaper_2.JPEG';

const Presentes = () => {
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
            Lista de Presentes
          </h1>
        </div>
      </section>

      {/* Conteúdo dos Presentes */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-gray-600 text-lg mb-12">
            Sua presença é nosso maior presente! Mas se você quiser nos presentear, aqui estão algumas opções:
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-amber-50 p-8 rounded-lg text-center">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">PIX</h3>
              <p className="text-gray-600">Chave: seu@email.com</p>
            </div>
            <div className="bg-amber-50 p-8 rounded-lg text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Lista de Casamento</h3>
              <p className="text-gray-600">Disponível em lojas parceiras</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Presentes;
