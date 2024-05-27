// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import Home from './pages/Home';      
import Marketplace from './pages/Marketplace';
import CreateNFT from './pages/CreateNFT';
import Profile from './pages/Profile';
import Faucet from './pages/Faucet';

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
          <Route path="/faucet" element={<Faucet />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
