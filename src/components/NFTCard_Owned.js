// Dentro de tu componente NFTCard_Owned
import React, { useState } from 'react';

const NFTCard_Owned = ({ nft, listNftForSale, account }) => {
  const [userPrice, setSalePrice] = useState('');

  const handleListForSaleClick = () => {
    // Si no es el creador original, utiliza el precio introducido por el usuario
    if (!nft.originalCreator) {
      listNftForSale(nft.tokenId, userPrice);
    } else {
      // Si es el creador original, listará al precio de minteo
      listNftForSale(nft.tokenId);
    }
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
          value={userPrice} // Este valor debería ser controlado por el estado del componente
          onChange={e => setSalePrice(e.target.value)} // Deberías crear la función setSalePrice y el estado correspondiente
          placeholder="Establece tu precio de venta"
        />
      )}
      <button onClick={handleListForSaleClick}>
        List
      </button>
      </div>
    </div>
  );
};

export default NFTCard_Owned;
