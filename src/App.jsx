import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Coords from './pages/Coords';
import Relisted from './pages/Relisted';
import RegularStyle from './pages/RegularStyle';
import RelistUploadPage from './pages/RelistUploadPage';
import CoordsUploadPage from './pages/CoordsUploadPage';
import RegularStyleUploadPage from './pages/RegularStyleUploadPage';

import NewStyleGenerator from './pages/NewStyleGenerator';
import StyleLog from './pages/StyleLog';
import CatalogingPage from './pages/CatalogingPage';
import UploadStylesAndGenerateListing from './pages/UploadStylesAndGenerateListing';
import NykaaCoords from './catalog/coords/nykaa/NykaaCoords';
import CoordsManagement from './catalog/coords/CoordsManagement';
import UploadSingleProduct from './pages/UploadSingleProduct';
import UploadComboProduct from './pages/UploadComboProduct';
import BrandConverter from './pages/BrandConverter';
import MappingPage from './pages/MappingPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="mb-14 lg:mb-16 xs:mb-16 xl:mb-16">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/co-ords" element={<Coords />} />
        <Route path="/relisted" element={<Relisted />} />
        <Route path="/styles" element={<RegularStyle />} />
        <Route path="/create-relisted-style" element={<RelistUploadPage />} />
        <Route path="/create-coords" element={<CoordsUploadPage />} />
        <Route path="/create-regular-style" element={<RegularStyleUploadPage />} />
        <Route path="/generate-styles-no" element={<NewStyleGenerator />} />
        <Route path="/style-logs" element={<StyleLog />} />
        <Route path="/catalog-generation/:logId" element={<CatalogingPage />} />
        <Route path="/cataloging" element={<UploadStylesAndGenerateListing />} />
        <Route path="/cataloging/co-ords" element={<CoordsManagement />} />
        <Route path="/create-single-product" element={<UploadSingleProduct />} />
        <Route path="/create-combo-product" element={<UploadComboProduct />} />
        <Route path="/brand_converter" element={<BrandConverter />} />
        <Route path="/mapping" element={<MappingPage />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
};

export default App;
