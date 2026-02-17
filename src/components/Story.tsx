const Story = () => {
  const timeline = [
    {
      year: '2019',
      title: 'O Primeiro Encontro',
      description: 'Nossos caminhos se cruzaram pela primeira vez. Foi love at first sight.',
      icon: '💫',
    },
    {
      year: '2020',
      title: 'O Primeiro Beijo',
      description: 'O começo de uma linda história de amor que mudaria nossas vidas para sempre.',
      icon: '💕',
    },
    {
      year: '2022',
      title: 'Morando Juntos',
      description: 'Decidimos compartilhar nossa vida e construir nosso lar.',
      icon: '🏠',
    },
    {
      year: '2024',
      title: 'O Pedido',
      description: 'Ele pediu minha mão em casamento, e eu disse SIM! 💍',
      icon: '💍',
    },
    {
      year: '2027',
      title: 'O Casamento',
      description: 'Vamos celebrar nosso amor com todos vocês!',
      icon: '💒',
    },
  ];

  return (
    <section id="story" className="py-20 px-4 bg-stone-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gold-600 uppercase tracking-widest text-sm mb-2">Nossa Jornada</p>
          <h2 className="font-script text-4xl md:text-5xl text-gray-800">Nossa História de Amor</h2>
          <div className="w-24 h-1 bg-gold-400 mx-auto mt-4"></div>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gold-200 hidden md:block"></div>

          {timeline.map((item, index) => (
            <div
              key={index}
              className={`relative flex items-center mb-12 ${
                index % 2 === 0 ? 'md:flex-row-reverse' : ''
              } flex-col md:flex-row`}
            >
              {/* Content */}
              <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-left md:pr-12' : 'md:text-left md:pl-12'} text-center px-4`}>
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <span className="text-gold-600 font-semibold text-sm uppercase tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="font-script text-2xl text-gray-800 mt-2 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center">
                <div className="w-4 h-4 bg-gold-500 rounded-full border-4 border-white shadow"></div>
              </div>

              {/* Empty space for alternating layout */}
              <div className="md:w-1/2 hidden md:block"></div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 text-center">
          <blockquote className="font-script text-2xl md:text-3xl text-gray-700 italic">
            "O amor não se vê com os olhos, mas com o coração."
          </blockquote>
          <p className="text-gold-600 mt-4">- Letícia & Kiury</p>
        </div>
      </div>
    </section>
  );
};

export default Story;
