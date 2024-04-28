// src/pages/CreateNFT.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { pinFileToIPFS } from '../utils/ipfs';
import { useMintNFT } from '../hooks/useMintNFT';

const CreateNFT = () => {
  const [nftData, setNftData] = useState([{ name: '', description: '', price: '', image: null }]);
  const { mintMultipleNFTs } = useMintNFT();

  const handleInputChange = (index, e) => {
    const values = [...nftData];
    values[index][e.target.name] = e.target.value;
    setNftData(values);
  };

  const handleImageChange = (index, e) => {
    const values = [...nftData];
    values[index].image = e.target.files[0];
    setNftData(values);
  };

  const handleAddFields = () => {
    const values = [...nftData];
    values.push({ name: '', description: '', price: '', image: null });
    setNftData(values);
  };

  const handleRemoveFields = index => {
    const values = [...nftData];
    values.splice(index, 1);
    setNftData(values);
  };

  const handleMint = async () => {
    for (const nft of nftData) {
      if (!nft.name || !nft.description || !nft.price || !nft.image) {
        alert('Please fill out all fields for each NFT.');
        return;
      }
    }

    try {
      const metadataUrls = [];
      const prices = [];

      for (const nft of nftData) {
        // Subir la imagen a IPFS
        const imageUrl = await pinFileToIPFS(nft.image);

        // Crear metadatos
        const metadata = {
          name: nft.name,
          description: nft.description,
          image: imageUrl,
        };

        // Subir metadatos a IPFS
        const metadataUrl = await pinFileToIPFS(new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        metadataUrls.push(metadataUrl);

        // Guardar los precios
        prices.push(nft.price);
      }

      // Mintear múltiples NFTs
      await mintMultipleNFTs(metadataUrls, prices);
      alert('NFTs minted successfully!');
    } catch (error) {
      console.error('Failed to mint NFTs:', error);
      alert('There was an error minting the NFTs: ' + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="create-nft-page">
      <header className="header">
        <Link to="/">Home</Link>
        <Link to="/marketplace">Marketplace</Link>
      </header>
      <main>
        <h1>Create Multiple NFTs</h1>
        {nftData.map((nft, index) => (
          <div key={index} className="nft-input-group">
            <input
              type="text"
              placeholder="NFT Name"
              name="name"
              value={nft.name}
              onChange={e => handleInputChange(index, e)}
            />
            <textarea
              placeholder="NFT Description"
              name="description"
              value={nft.description}
              onChange={e => handleInputChange(index, e)}
            />
            <input
              type="text"
              placeholder="NFT Price in ETH (0 if not for sale)"
              name="price"
              value={nft.price}
              onChange={e => handleInputChange(index, e)}
            />
            <input
              type="file"
              name="image"
              onChange={e => handleImageChange(index, e)}
            />
            {nftData.length > 1 && (
              <button type="button" onClick={() => handleRemoveFields(index)}>Remove</button>
            )}
          </div>
        ))}
        {nftData.length < 10 && (
          <button type="button" onClick={handleAddFields}>Add More NFTs</button>
        )}
        <button type="button" onClick={handleMint}>Mint NFTs</button>
      </main>
    </div>
  );
};

export default CreateNFT;