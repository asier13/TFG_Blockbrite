import React, { useState } from 'react';

const NFTCard_Owned = ({ nft, listNftForSale, account }) => {
  const [userPrice, setSalePrice] = useState('');

  const handleListForSaleClick = () => {
    listNftForSale(nft.tokenId, userPrice);
  };

  return (
    <div className="nft-card">
      <img src={nft.image} alt={nft.name} className="nft-image" />
      <div className="nft-info">
        <h3>{nft.name}</h3>
        <p>{nft.description}</p>
        {account !== nft.originalCreator && (
          <input
            type="text"
            value={userPrice}
            onChange={e => setSalePrice(e.target.value)}
            placeholder="Establece tu precio de venta"
          />
        )}
        <button onClick={handleListForSaleClick}>List</button>
      </div>
    </div>
  );
};

export default NFTCard_Owned;
