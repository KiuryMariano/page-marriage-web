import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Presentes from './pages/Presentes';
import Galeria from './pages/Galeria';
import Confirmar from './pages/Confirmar';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function App() {
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Recupera rota do sessionStorage (definido pelo 404.html)
    const storedRedirect = sessionStorage.getItem('redirect');
    if (storedRedirect) {
      // Remove o prefixo "/page-marriage-web/" se existir
      const cleanPath = storedRedirect.replace(/^\/page-marriage-web/, '');
      setRedirectPath(cleanPath);
      sessionStorage.removeItem('redirect');
    }
  }, []);

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
