// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../Home.css'; 
import logo from '../assets/logo.png'; 
import zeusImage from '../assets/zeus.png';
import wallet from '../assets/wallet.png'; 
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <div className="home">
        <header className="header">
          <img src={logo} alt="Blockbrite Logo" className="logo" />
          <nav className="navigation">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/marketplace" className="nav-link">Marketplace</Link>
            <Link to="/create-nft" className="nav-link">Crear NFT</Link>
            <Link to="/profile"><img src={wallet} alt="wallet Logo" className="wallet"/></Link>
          </nav>
        </header>
        <div className="main-section">
          <div className="main-content">
            <h1>Explore the leading marketplace <br/> for RWA sector and event management</h1>
            <div className="button-group">
              <Link to="/marketplace" className="btn explore">Explore</Link>
              <Link to="/create-nft" className="btn create">Create</Link>
            </div>
          </div>
          <div className="zeus-image">
            <img src={zeusImage} alt="Zeus" />
          </div>
        </div> 
      </div>
      <Footer />
    </>
  );
};

export default Home;