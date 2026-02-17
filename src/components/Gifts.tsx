import { useState } from 'react';

const Gifts = () => {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  const gifts = [
    {
      id: 1,
      name: 'Lua de Mel',
      description: 'Ajude-nos a realizar nosso sonho de uma lua de mel inesquecível',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
      price: 'A partir de R$ 50,00',
      icon: '✈️',
    },
    {
      id: 2,
      name: 'Jantar Romântico',
      description: 'Contribua para um jantar especial durante nossa lua de mel',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop',
      price: 'R$ 200,00',
      icon: '🍷',
    },
    {
      id: 3,
      name: 'Casa Nova',
      description: 'Ajude-nos a mobiliar nosso novo lar',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      price: 'Valor Livre',
      icon: '🏠',
    },
    {
      id: 4,
      name: 'Experiência',
      description: 'Contribua para experiências únicas durante a viagem',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop',
      price: 'A partir de R$ 100,00',
      icon: '🌅',
    },
  ];

  const handleGiftSelect = (giftId: number) => {
    setSelectedGift(giftId === selectedGift ? null : giftId.toString());
  };

  return (
    <section id="gifts" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Lista de Presentes</p>
          <h2 className="font-script text-4xl md:text-5xl text-gray-800">Presentes</h2>
          <div className="w-24 h-1 bg-gold-400 mx-auto mt-4"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Sua presença é nosso maior presente! Mas se você quiser nos presentear,
            separamos algumas opções especiais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gifts.map((gift) => (
            <div
              key={gift.id}
              className={`bg-stone-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                selectedGift === gift.id.toString() ? 'ring-2 ring-gold-500' : ''
              }`}
              onClick={() => handleGiftSelect(gift.id)}
            >
              <div className="relative h-48">
                <img
                  src={gift.image}
                  alt={gift.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                  {gift.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-script text-xl text-gray-800 mb-2">{gift.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{gift.description}</p>
                <p className="text-gold-600 font-semibold">{gift.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Modal */}
        {selectedGift && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 animate-fade-in">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎁</span>
                </div>
                <h3 className="font-script text-2xl text-gray-800 mb-2">
                  Obrigado pelo carinho!
                </h3>
                <p className="text-gray-600 mb-6">
                  Para realizar o pagamento, utilize os dados abaixo:
                </p>

                <div className="bg-stone-50 rounded-xl p-4 mb-6 text-left space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Banco</span>
                    <p className="text-gray-800 font-medium">Banco do Brasil</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Agência</span>
                    <p className="text-gray-800 font-medium">1234-X</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Conta</span>
                    <p className="text-gray-800 font-medium">56789-0</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Pix</span>
                    <p className="text-gray-800 font-medium break-all">email@exemplo.com</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Chave Pix</span>
                    <p className="text-gold-600 font-medium break-all">(55) 46 99999-9999</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setSelectedGift(null)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Fechar
                  </button>
                  <button className="flex-1 px-6 py-3 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors">
                    Copiar Pix
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gifts;
