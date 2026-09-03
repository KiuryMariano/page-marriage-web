const CONVITE_EMBED_URL =
  "https://www.canva.com/design/DAHUFwIS8Sc/xxDNNzSpcUNOWcsglZMyLg/view?embed";

// Proporção do design no Canva (1024 x 4630). Com o iframe nessa proporção,
// o convite aparece em tamanho legível e a rolagem até o fim fica por conta
// da página, em vez do visualizador encolher tudo para caber numa tela.
const RATIO_PERCENT = (4630 / 1024) * 100;

export default function Convite() {
  return (
    <div className="bg-[#fdfbf7]">
      <div
        className="relative mx-auto w-full max-w-[480px] overflow-hidden"
        style={{ paddingTop: `${RATIO_PERCENT}%` }}
      >
        <iframe
          src={CONVITE_EMBED_URL}
          title="Convite de casamento de Kiury e Letícia"
          className="absolute inset-0 h-full w-full border-0"
          allow="fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}
