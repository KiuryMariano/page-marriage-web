import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Presentes from './pages/Presentes';
import Galeria from './pages/Galeria';
import Confirmar from './pages/Confirmar';
import HospedagemBeleza from './pages/HospedagemBeleza';
import Convite from './pages/Convite';
import Pagamento from './pages/Pagamento';
import PagamentoSucesso from './pages/PagamentoSucesso';
import PagamentoFalha from './pages/PagamentoFalha';
import PagamentoPendente from './pages/PagamentoPendente';
import Admin from './pages/Admin';
import ScrollToTop from './components/ScrollToTop';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/presentes" element={<Presentes />} />
        <Route path="/galeria" element={<Galeria />} />
        <Route path="/hospedagem-e-beleza" element={<HospedagemBeleza />} />
        <Route path="/confirmar" element={<Confirmar />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/pagamento-sucesso" element={<PagamentoSucesso />} />
        <Route path="/pagamento-falha" element={<PagamentoFalha />} />
        <Route path="/pagamento-pendente" element={<PagamentoPendente />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/convite" element={<Convite />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
