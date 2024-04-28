import React from 'react';
import '../NFTCard.css';

// Asumiendo que tienes una función que maneja la compra en tus hooks o utils
import { useBuyNFT } from '../hooks/useBuyNFT';

const NFTCard_Sale_Market = ({ nft }) => {
  const { buyNFT } = useBuyNFT();

  const handleBuyClick = async () => {
    await buyNFT(nft.tokenId, nft.price); // Asegúrate de pasar el precio correctamente
  };

  return (
    <div className="nft-card">
      <img src={nft.image} alt={nft.name} className="nft-image" />
      <div className="nft-info">
        <h3>{nft.name}</h3>
        <p>{nft.description}</p>
        <p>Price: {nft.price} ETH</p>
        <button onClick={handleBuyClick}>Buy</button>
      </div>
    </div>
  );
};

export default NFTCard_Sale_Market;
