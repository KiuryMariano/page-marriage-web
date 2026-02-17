import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import wallpaper from '../assets/wallpaper_2.JPEG';

const Confirmar = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    acompanhantes: '0',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('RSVP:', formData);
    alert('Confirmação enviada com sucesso!');
  };

  return (
    <div className="min-h-screen flex flex-col">
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
            Confirmar Presença
          </h1>
        </div>
      </section>

      {/* Conteúdo do RSVP */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-600 text-lg mb-12">
            Por favor, confirme sua presença até 30 dias antes do evento
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Nome Completo</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">E-mail</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Telefone</label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Número de Acompanhantes</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={formData.acompanhantes}
                onChange={(e) => setFormData({ ...formData, acompanhantes: e.target.value })}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-amber-600 text-white py-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Confirmar Presença
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Confirmar;
