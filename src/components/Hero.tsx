import { useState, useEffect } from 'react';
import wallpaper from '../assets/wallpaper_2.JPEG';

const Hero = () => {
  const weddingDate = new Date('2027-01-09T00:00:00');

  const calculateTimeRemaining = () => {
    const now = new Date();
    const difference = weddingDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={wallpaper}
          alt="Letícia e Kiury"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-[95%] to-white"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 flex flex-col justify-between h-full py-12">
        {/* Top Content */}
        <div className="flex-1 flex flex-col md:justify-center justify-start pt-20 md:pt-0">
          <p className="text-lg md:text-xl mb-4 tracking-[0.3em] uppercase text-white/90 font-medium" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}>Estamos Casando</p>
          <h1 className="text-4xl md:text-7xl lg:text-9xl mb-6 text-white whitespace-nowrap" style={{ fontFamily: '"Great Vibes", cursive', textShadow: '0 4px 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.6)' }}>
            Letícia <span className="text-gold-400 mx-2 md:mx-3">&</span> Kiury
          </h1>
          <p className="text-xl md:text-2xl font-light text-white/95 tracking-wide" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)' }}>09 . 01 . 2027</p>
        </div>

        {/* Countdown - Near Bottom */}
        <div className="mb-8 md:scale-[0.7]">
          <p className="text-sm uppercase tracking-widest mb-6">Save the Date</p>
          <div className="flex justify-center gap-4 md:gap-8">
            {[
              {label: 'Dias', value: timeRemaining.days },
              {label: 'Horas', value: timeRemaining.hours },
              {label: 'Minutos', value: timeRemaining.minutes },
              {label: 'Segundos', value: timeRemaining.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[90px]">
                  <span className="block text-2xl md:text-4xl font-semibold">{item.value}</span>
                </div>
                <span className="text-xs md:text-sm uppercase tracking-wider mt-2 block">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
