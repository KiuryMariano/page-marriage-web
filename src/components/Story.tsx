import Navbar from './Navbar';
import Footer from './Footer';

const Story = () => {
  const events = [
    {
      date: 'Setembro/24',
      title: 'O Começo de Tudo',
      description: 'Nos conhecemos pessoalmente na FAC - eu cursando Engenharia de Software, ela Medicina, ambos no 4º período. As conversas começaram no Instagram, ela que seguiu primeiro. Nosso primeiro encontro foi no refeitório do bloco 4, onde conversamos sobre a vida. Com o passar dos dias ficamos mais próximos, e no dia 23 demos nosso primeiro beijo. De fato nunca fomos devagar - sempre soubemos o que queríamos.',
    },
    {
      date: 'Outubro/24',
      title: 'Eu Te Amo',
      description: 'No dia 6 de outubro disse que a amava. Poucas semanas depois, no dia 14, conheci seus pais - um momento muito especial na nossa jornada. No dia 27, ela conheceu meus pais, marcando o início de uma nova fase em nossas vidas, onde nossas famílias começaram a se unir.',
    },
    {
      date: 'Dezembro/24',
      title: 'O Pedido de Namoro',
      description: 'No Palo Santo em Cascavel. Organizei tudo um mês antes. Ela achava que era mais um encontro nosso. Me retirei para "ir ao banheiro", e então o violino começou a tocar. Seus amigos chegaram entregando rosas, e eu entrei com o buquê e as alianças. Ao som de "Die With A Smile", fiz o pedido. E ela disse SIM!',
    },
    {
      date: 'Setembro/25',
      title: 'Meio Médica',
      description: 'Dia 27 tiramos as fotos para o seu meio médico. Minha gata estava se tornando meio médica, e eu não poderia estar mais orgulhoso.',
    },
    {
      date: 'Outubro/25',
      title: 'Nossa Segunda Corrida',
      description: 'Dia 19 fomos para nossa segunda prova de 5km em Capitão. Você passou muito mal e tivemos que caminhar praticamente a prova toda, mas começamos e finalizamos juntos. Juntos sempre.',
    },
    {
      date: 'Dezembro/25',
      title: 'Um Ano Juntos',
      description: 'Completamos nosso primeiro ano oficialmente. Relembramos tantos momentos e fizemos fotos para ver nossa evolução durante os anos, criando nossas tradições. Te levei no Palo Santo para comemorar, e com uma sobremesa pedi para renovar o contrato para mais um ano comigo. Nas férias, passamos muito tempo juntos: trabalhando em sítio, pescando, secando açude, saindo em roles diferentes e nos divertindo. Dia 30 comprei seu anel de noivado.',
    },
    {
      date: 'Janeiro/26',
      title: 'A Pergunta',
      description: 'Viajamos para Itapoá, SC - provavelmente a viagem que mais ficará marcada. Na virada do ano, exatamente quando virou para 2026, disse no seu ouvido: "Este ano eu vou te pedir em casamento. Pode ser hoje ou daqui a 365 dias, fica com a unha sempre pronta." No nascer do sol do dia 14 de janeiro, te pedi em casamento. Uma completa surpresa. Organizei um piquenique como você ama, e mesmo com todos os dias de chuvas e tempestade anteriores, no dia o sol saiu e brilhou muito - tanto quanto você. E você disse SIM!',
    },
    {
      date: 'Janeiro/26',
      title: 'Planejando o Futuro',
      description: 'Agora como noivos continuamos nossa viagem em Itapoá. Retornamos e passamos o restante de nossas férias acadêmicas planejando o casamento, deixando quase tudo encaminhado mesmo com um ano de antecedência. Nossa jornada juntos só está começando.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <section className="py-24 px-4 bg-stone-50">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-20">
              <p className="text-amber-600 uppercase tracking-[0.3em] text-xs mb-4">Nossa Jornada</p>
              <h2 className="text-6xl md:text-7xl text-gray-800" style={{ fontFamily: '"Great Vibes", cursive' }}>
                Nossa História
              </h2>
            </div>

            {/* Events List */}
            <div className="space-y-16">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="relative"
                >
                  {/* Date */}
                  <p className="text-amber-600 uppercase tracking-widest text-xs mb-2">
                    {event.date}
                  </p>

                  {/* Title */}
                  <h3 className="text-3xl text-gray-800 mb-4" style={{ fontFamily: '"Great Vibes", cursive' }}>
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {event.description}
                  </p>

                  {/* Divider - except for last item */}
                  {index < events.length - 1 && (
                    <div className="mt-12 flex items-center gap-4">
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                      <span className="text-amber-400 text-xl">◆</span>
                      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Final Quote */}
            <div className="mt-24 text-center">
              <div className="border-l-2 border-amber-400 pl-8 inline-block">
                <blockquote className="text-2xl md:text-3xl text-gray-700 leading-relaxed" style={{ fontFamily: '"Great Vibes", cursive' }}>
                  Sempre soubemos o que queríamos e o que éramos um para o outro
                </blockquote>
                <p className="text-amber-600 uppercase tracking-widest text-xs mt-4">
                  Letícia & Kiury
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Story;
