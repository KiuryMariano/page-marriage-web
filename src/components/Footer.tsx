import { useState, useEffect } from "react";

const Footer = () => {
  const [daysRemaining, setDaysRemaining] = useState<number>(0);

  useEffect(() => {
    // Data do casamento - 09 de Janeiro de 2027
    const weddingDate = new Date("2027-01-09");
    const today = new Date();
    const diffTime = weddingDate.getTime() - today.getTime();
    const diffDays = (Math.ceil(diffTime / (1000 * 60 * 60 * 24))-1);
    setDaysRemaining(diffDays > 0 ? diffDays : 0);
  }, []);

  return (
    <footer className="bg-gray-950 border-t border-gray-700 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Lado esquerdo - Desenvolvido pelo noivo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <p className="text-sm text-gray-300 mb-2">
              Desenvolvido pelo noivo
            </p>
            <div className="flex items-center gap-3 mt-3">
              <a
                href="https://kiurymariano.convertesistemas.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Website"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/kiurymariano/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://convertesistemas.com.br/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                title="Converte Sistemas"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Centro - Save the Date e Data */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="font-['Great_Vibes'] text-3xl text-white">
              Save the Date
            </div>
            <div className="text-gray-200 font-['Playfair_Display'] text-lg">
              09 de Janeiro de 2027
            </div>
            <a
              href="https://maps.app.goo.gl/tn28V1PSPrPgwk9c7"
              target="_blank"
              rel="noopener noreferrer"
              className="font-['Playfair_Display'] text-gray-400 hover:text-white transition-colors underline decoration-gray-600 hover:decoration-gray-400 underline-offset-4 text-sm"
            >
              Capitão Leônidas Marques
            </a>
          </div>

          {/* Lado direito - Contador */}
          <div className="flex flex-col items-center md:items-end text-center">
            <div className="bg-gray-900 border border-gray-600 rounded-lg px-6 py-4 shadow-lg">
              <p className="text-gray-400 text-sm mb-1">Faltam</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {daysRemaining}
                </span>
                <span className="text-gray-300 text-lg">dias</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent my-6"></div>

        {/* Copyright */}
        <div className="flex flex-col items-center text-center">
          <p className="text-xs text-gray-500 italic">
            © 2026 - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
