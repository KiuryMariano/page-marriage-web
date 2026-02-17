import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Historia from './pages/Historia';
import Presentes from './pages/Presentes';
import Galeria from './pages/Galeria';
import Confirmar from './pages/Confirmar';
import './index.css';

function App() {
  return (
    <BrowserRouter basename="/page-marriage-web">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/historia" element={<Historia />} />
        <Route path="/presentes" element={<Presentes />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/confirmar" element={<Confirmar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
