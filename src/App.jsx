import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Navbar ,Footer} from './components';
import { UserRegistryPage ,AuditTrailPage, SupplyChainLogicPage, ProductRegistryPage} from './pages/index'

export default function App() {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <Navbar />
        <main className='container flex-grow px-4 py-6 mx-auto'>
          <Routes>
            <Route path='/auditoria' element={<AuditTrailPage />} />
            <Route path='/suministro' element={<SupplyChainLogicPage />} />
            <Route path='/usuario' element={<UserRegistryPage />} />
            <Route path='/producto' element={<ProductRegistryPage />} />
            <Route path='*' element={<UserRegistryPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

