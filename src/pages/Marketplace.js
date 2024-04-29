// Marketplace.js
import React, { useState, useEffect } from 'react';
import NFTCard from '../components/NFTCard_Sale_Market';
import { getAllNFTsOnSale } from '../utils/nftHelpers';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component'; // Asegúrate de haber instalado   
import wallet from '../assets/wallet.png';
import logo from '../assets/logo.png';
import "../Marketplace.css";

const Marketplace = () => {
  const [nftsForSale, setNftsForSale] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNFTs = async () => {
      const nfts = await getAllNFTsOnSale();
      setNftsForSale(nfts);
    };

    fetchNFTs();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredNFTs = searchTerm
    ? nftsForSale.filter(nft => nft.name.toLowerCase().includes(searchTerm))
    : nftsForSale;

  return (
    <div className="marketplace">
      <header className="header">
        <img src={logo} alt="Blockbrite Logo" className="logo" />
        <nav className="navigation">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/marketplace" className="nav-link active">Marketplace</Link>
          <Link to="/create-nft" className="nav-link">Crear NFT</Link>
          <Link to="/profile"><img src={wallet} alt="wallet Logo" className="wallet"/></Link>
        </nav>
      </header>
      <input className="searchbar" type="text" placeholder="Search NFTs..." onChange={handleSearch} />
      <InfiniteScroll
        dataLength={filteredNFTs.length}
        
      >
        <div className="nft-grid">
          {filteredNFTs.map(nft => (
            <NFTCard key={nft.tokenId} nft={nft} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Marketplace;
