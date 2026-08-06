import { useState, useEffect } from "react";
import wallpaperWebpFull from "../assets/wallpaper_2.webp";
import wallpaperWebpTablet from "../assets/wallpaper_2_tablet.webp";
import wallpaperWebpMobile from "../assets/wallpaper_2_mobile.webp";

const weddingDate = new Date("2027-01-09T00:00:00");

const calculateTimeRemaining = () => {
    const now = new Date();
    const difference = weddingDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

const Hero = () => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={wallpaperWebpFull}
          alt="Letícia e Kiury"
          srcSet={`${wallpaperWebpMobile} 800w, ${wallpaperWebpTablet} 1400w, ${wallpaperWebpFull} 6182w`}
          sizes="100vw"
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
          decoding="sync"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-[#FDFBF8] via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 flex flex-col justify-between h-full py-12">
        {/* Top Content */}
        <div className="flex-1 flex flex-col md:justify-center justify-start pt-20 md:pt-0">
          <p
            className="text-sm md:text-xl mb-2 md:mb-4 tracking-[0.3em] uppercase text-white/90 font-medium"
            style={{
              textShadow:
                "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            Estamos Casando
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-9xl mb-6 text-white md:whitespace-nowrap"
            style={{
              fontFamily: '"Great Vibes", cursive',
              textShadow:
                "0 4px 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.6)",
            }}
          >
            <span className="md:hidden grid grid-cols-[1fr_auto_1fr] items-center w-full">
              <span className="text-right pr-2">Kiury</span>
              <span className="text-gold-400 text-center px-0">&</span>
              <span className="text-left pl-2">Letícia</span>
            </span>
            <span className="hidden md:inline">
              Kiury <span className="text-gold-400 mx-2 md:mx-3">&</span> Letícia
            </span>
          </h1>
          <p
            className="text-lg md:text-2xl font-light text-white/95 tracking-wide"
            style={{
              textShadow:
                "0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            09 . 01 . 2027
          </p>
        </div>

        {/* Countdown - Near Bottom */}
        <div className="mb-8 scale-[0.92] md:scale-100">
          <p className="text-xs md:text-sm uppercase tracking-widest mb-5 md:mb-6">
            Save the Date
          </p>
          <div className="flex justify-center gap-3 md:gap-8">
            {[
              { label: "Dias", value: timeRemaining.days },
              { label: "Horas", value: timeRemaining.hours },
              { label: "Minutos", value: timeRemaining.minutes },
              { label: "Segundos", value: timeRemaining.seconds },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 md:p-6 min-w-[58px] md:min-w-[90px]">
                  <span className="block text-xl md:text-4xl font-semibold">
                    {item.value}
                  </span>
                </div>
                <span className="text-[11px] md:text-sm uppercase tracking-wider mt-1 md:mt-2 block">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
