import React, { useState } from 'react';
import { pinFileToIPFS } from '../utils/ipfs';
import { useMintNFT } from '../hooks/useMintNFT';
import { Link } from 'react-router-dom';

const CreateNFT = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createNFT } = useMintNFT();

  const handleImageUpload = async (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
  };

  const handleMint = async () => {
    if (!file || !name || !description) {
      alert('Please fill out all fields and select an image.');
      return;
    }

    try {
      // Subir imagen
      const imageUrl = await pinFileToIPFS(file);
      
      // Crear metadatos
      const metadata = {
        name,
        description,
        image: imageUrl,
      };

      // Subir metadatos
      const metadataUrl = await pinFileToIPFS(new Blob([JSON.stringify(metadata)], { type: 'application/json' }));

      // Mintear NFT
      await createNFT(metadataUrl);
      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      alert('There was an error minting the NFT.');
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <Link to="/">Inicio</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/create-nft">Crear NFT</Link>
        {/* Más enlaces si son necesarios */}
      </header>
    <div>
      <h1>Create NFT</h1>
      <input type="text" placeholder="NFT Name" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="NFT Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="file" onChange={handleImageUpload} />
      <button onClick={handleMint}>Mint NFT</button>
    </div>
    </div>
  );
};

export default CreateNFT;
