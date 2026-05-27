import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Presentes from './pages/Presentes';
import Galeria from './pages/Galeria';
import Confirmar from './pages/Confirmar';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function App() {
  // Recupera rota do sessionStorage (definido pelo 404.html)
  const storedRedirect = sessionStorage.getItem('redirect');
  const redirectPath = storedRedirect ? storedRedirect.replace(/^\/page-marriage-web/, '') : null;
  if (storedRedirect) {
    sessionStorage.removeItem('redirect');
  }

  // Se houver redirecionamento, mostra um loader ou navega
  if (redirectPath && redirectPath !== '/') {
    return <Navigate to={redirectPath} replace />;
  }

  return (
    <BrowserRouter basename="/page-marriage-web">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/presentes" element={<Presentes />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/confirmar" element={<Confirmar />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
