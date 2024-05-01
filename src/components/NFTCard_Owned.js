import React, { useState } from 'react';

const NFTCard_Owned = React.memo(({ nft, listNftForSale, account }) => {
    const [userPrice, setUserPrice] = useState('');
    const address = (account.address || account).toString().toLowerCase();
    const creator = nft.originalCreator ? nft.originalCreator.toString().toLowerCase() : 'undefined';
    const isOriginalCreator = address === creator;

    const handleListForSaleClick = () => {
        if (isOriginalCreator) {
            listNftForSale(nft.tokenId, nft.price);  // Considerar usar el precio preestablecido si es necesario
        } else {
            listNftForSale(nft.tokenId, userPrice);
        }
    };

    return (
        <div className="nft-card">
            <img src={nft.image} alt={nft.name} className="nft-image" />
            <div className="nft-info">
                <h3>{nft.name}</h3>
                <p>{nft.description}</p>
                {isOriginalCreator && (
                <p>Price: {nft.price} ETH</p>
                )}
                {!isOriginalCreator && (
                    <input
                        type="text"
                        value={userPrice}
                        onChange={e => setUserPrice(e.target.value)}
                        placeholder="Establece tu precio de venta"
                    />
                )}
            </div>
            <div className="button-container">
                <button onClick={handleListForSaleClick}>List</button>
            </div>
        </div>
    );
});

export default NFTCard_Owned;
