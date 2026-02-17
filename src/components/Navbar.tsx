import { useState } from 'react';
import { Link } from 'react-router-dom';
import iniciais from '../assets/iniciais_white.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Início', path: '/' },
    { name: 'Presentes', path: '/presentes' },
    { name: 'Galeria', path: '/galeria' },
    { name: 'Confirmar Presença', path: '/confirmar' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative">
          {/* Logo - Link para Home */}
          <Link to="/" className="flex-shrink-0">
            <img src={iniciais} alt="L & K" className="h-14 w-auto" />
          </Link>

          {/* Desktop Menu - Centralizado */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-white hover:text-amber-300 transition-colors duration-300 text-sm font-medium drop-shadow-md uppercase tracking-[0.2em]"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-amber-300 focus:outline-none drop-shadow-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/70 backdrop-blur-md border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-2 text-white hover:text-amber-300 rounded-md text-base font-medium uppercase tracking-[0.2em]"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
