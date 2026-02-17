import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Story from '../components/Story';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Story />
      <Footer />
    </div>
  );
};

export default Home;
