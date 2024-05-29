import React from 'react';
import '../NFTCard.css';

const NFTCardSale = React.memo(({ nft, delistNft }) => {
  const handleDelistClick = () => {
    delistNft(nft.tokenId);
  };

  return (
    <div className="nft-card">
      <img src={nft.image} alt={nft.name} className="nft-image" />
      <div className="nft-info">
        <h3>{nft.name}</h3>
        <p>{nft.description}</p>
        <p>Price: {nft.price} ETH</p>
        <button onClick={handleDelistClick}>Delist</button>
      </div>
    </div>
  );
});

export default NFTCardSale;
