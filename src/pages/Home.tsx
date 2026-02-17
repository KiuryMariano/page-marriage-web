import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import StorySection from '../components/StorySection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
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
