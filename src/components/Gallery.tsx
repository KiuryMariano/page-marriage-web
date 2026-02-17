const Gallery = () => {
  const photos = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop',
      alt: 'Casal feliz',
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=800&fit=crop',
      alt: 'Momento especial',
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=800&fit=crop',
      alt: 'Casal apaixonado',
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop',
      alt: 'Noivos',
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=800&fit=crop',
      alt: 'Amor eterno',
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&h=800&fit=crop',
      alt: 'Momento único',
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
      alt: 'Casal juntos',
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=800&fit=crop',
      alt: 'Felicidade',
    },
  ];

  return (
    <section id="gallery" className="py-20 px-4 bg-stone-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Nossos Momentos</p>
          <h2 className="font-script text-4xl md:text-5xl text-gray-800">Galeria</h2>
          <div className="w-24 h-1 bg-gold-400 mx-auto mt-4"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            Alguns registros especiais da nossa história de amor
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-lg cursor-pointer group ${
                index === 0 ? 'col-span-2 row-span-2' : ''
              }`}
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
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

        {/* Coming Soon Note */}
        <div className="mt-12 text-center">
          <p className="text-gold-600 italic">
            Em breve, adicionaremos nossas fotos reais aqui! 📸
          </p>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
