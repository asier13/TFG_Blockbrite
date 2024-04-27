// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../Home.css'; // Asegúrate de que la ruta al archivo CSS es correcta
import logo from '../assets/logo.png'; // Asegúrate de que la ruta al logo es correcta
import zeusImage from '../assets/zeus.png'; // Asegúrate de que la ruta a la imagen de Zeus es correcta
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
      <Footer /> {/* Componente footer al final */}
    </>
  );
};

export default Home;