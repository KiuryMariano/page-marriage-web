import { colors } from "../theme";

const StorySection = () => {
  const events = [
    {
      date: "Setembro/24",
      title: "O Começo de Tudo",
      description:
        "Se conheceram pessoalmente na FAG - ele cursando Engenharia de Software, ela Medicina, ambos no 4º período. As conversas começaram no Instagram, ela que seguiu primeiro. O primeiro encontro foi no refeitório do bloco 4, onde conversaram sobre a vida. Com o passar dos dias ficaram mais próximos, e no dia 23 deram o primeiro beijo. De fato nunca foram devagar - sempre souberam o que queriam.",
    },
    {
      date: "Outubro/24",
      title: "Eu Te Amo",
      description:
        "No dia 6 de outubro ele disse que a amava. Poucas semanas depois, no dia 14, ele conheceu os pais dela - um momento muito especial na jornada deles. No dia 27, ela conheceu os pais dele, marcando o início de uma nova fase em suas vidas, onde suas famílias começaram a se unir.",
    },
    {
      date: "Dezembro/24",
      title: "O Pedido de Namoro",
      description:
        'No Palo Santo em Cascavel. Ele organizou tudo um mês antes. Ela achava que era mais um encontro deles. Ele se retirou para "ir ao banheiro", e então o violino começou a tocar. Os amigos dela chegaram entregando rosas, e ele entrou com o buquê e as alianças. Ao som de "Die With A Smile", fez o pedido. E ela disse SIM!',
    },
    {
      date: "Setembro/25",
      title: "Meio Médica",
      description:
        "Dia 27 tiraram as fotos para o meio médico dela. A noiva estava se tornando meio médica, e o noivo não poderia estar mais orgulhoso.",
    },
    {
      date: "Outubro/25",
      title: "Nossa Segunda Corrida",
      description:
        "Dia 19 foram para sua segunda prova de 5km em Capitão. Ela passou muito mal e tiveram que caminhar praticamente a prova toda, mas começaram e finalizaram juntos. Juntos sempre.",
    },
    {
      date: "Dezembro/25",
      title: "Um Ano Juntos",
      description:
        "Completaram seu primeiro ano oficialmente. Relembraram tantos momentos e fizeram fotos para ver a evolução durante os anos, criando suas tradições. Ele a levou no Palo Santo para comemorar, e com uma sobremesa pediu para renovar o contrato para mais um ano. Nas férias, passaram muito tempo juntos: trabalhando em sítio, pescando, secando açude, saindo em roles diferentes e se divertindo. Dia 30 ele comprou o anel de noivado dela.",
    },
    {
      date: "Janeiro/26",
      title: "A Pergunta",
      description:
        'Viajaram para Itapoá, SC - provavelmente a viagem que mais ficará marcada. Na virada do ano, exatamente quando virou para 2026, ele disse no ouvido dela: "Este ano eu vou te pedir em casamento. Pode ser hoje ou daqui a 365 dias, fica com a unha sempre pronta." No nascer do sol do dia 14 de janeiro, ele a pediu em casamento. Uma completa surpresa. Ele organizou um piquenique como ela ama, e mesmo com todos os dias de chuvas e tempestade anteriores, no dia o sol saiu e brilhou muito - tanto quanto ela. E ela disse SIM!',
    },
    {
      date: "Janeiro/26",
      title: "Planejando o Futuro",
      description:
        "Agora como noivos continuaram sua viagem em Itapoá. Retornaram e passaram o restante das férias acadêmicas planejando o casamento, deixando quase tudo encaminhado mesmo com um ano de antecedência. A jornada juntos só está começando.",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <p
            className="uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4"
            style={{ color: colors.primary[600] }}
          >
            Nossa Jornada
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl text-gray-800"
            style={{ fontFamily: '"Great Vibes", cursive' }}
          >
            Nossa História
          </h2>
        </div>

        {/* Events List */}
        <div className="space-y-12 md:space-y-16">
          {events.map((event, index) => (
            <div key={index} className="relative">
              {/* Date */}
              <p
                className="uppercase tracking-widest text-[10px] md:text-xs mb-2"
                style={{ color: colors.primary[600] }}
              >
                {event.date}
              </p>

              {/* Title */}
              <h3
                className="text-2xl md:text-3xl text-gray-800 mb-3 md:mb-4"
                style={{ fontFamily: '"Great Vibes", cursive' }}
              >
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-sm md:text-lg text-justify">
                {event.description}
              </p>

              {/* Divider - except for last item */}
              {index < events.length - 1 && (
                <div className="mt-8 md:mt-12 flex items-center gap-4">
                  <div
                    className="flex-1 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, #fcd34d 50%, transparent 100%)",
                    }}
                  ></div>
                  <span
                    className="text-lg md:text-xl"
                    style={{ color: colors.primary[400] }}
                  >
                    ◆
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, #fcd34d 50%, transparent 100%)",
                    }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Final Quote */}
        <div className="mt-16 md:mt-24 text-center">
          <div
            className="pl-6 md:pl-8 inline-block"
            style={{ borderLeft: "2px solid " + colors.primary[400] }}
          >
            <blockquote
              className="text-xl md:text-2xl lg:text-3xl text-gray-700 leading-relaxed"
              style={{ fontFamily: '"Great Vibes", cursive' }}
            >
              Sempre soubemos o que queríamos e o que éramos um para o outro
            </blockquote>
            <p
              className="uppercase tracking-widest text-[10px] md:text-xs mt-4"
              style={{ color: colors.primary[600] }}
            >
              Letícia & Kiury
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
