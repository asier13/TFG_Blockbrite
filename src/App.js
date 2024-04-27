// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './pages/Home';        // Asume que tienes un componente Home.js
import Marketplace from './pages/Marketplace';
import CreateNFT from './pages/CreateNFT';
import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />              
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/create-nft" element={<CreateNFT />} />
          <Route path="/profile" element={<Profile />} />
          {/* Agrega aquí más rutas según sea necesario */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
