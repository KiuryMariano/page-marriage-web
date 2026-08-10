import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import StorySection from "../components/StorySection";
import Footer from "../components/Footer";
import background from "../assets/backgrounds/background.webp";
import backgroundMobile from "../assets/backgrounds/background_mobile.webp";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Fixo */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat hidden md:block"
        style={{ backgroundImage: `url(${background})` }}
      ></div>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${backgroundMobile})` }}
      >
        <div className="absolute inset-0 bg-white/70"></div>
      </div>

      <Navbar />
      <main>
        <Hero />
        <StorySection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
