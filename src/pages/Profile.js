import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useMetaMask from '../hooks/useMetaMask';
import NFTCard_Sale from '../components/NFTCard_Sale';
import NFTCard_Owned from '../components/NFTCard_Owned';
import { getOwnedNFTs, getNFTsOnSale } from '../utils/nftHelpers';
import MyNFTAbi from '../abis/MyNFT.json';
import contractAddress from '../contractAddress';
import wallet from '../assets/wallet.png';
import logo from '../assets/logo.png';
import '../Profile.css';
const ethers = require('ethers');

const getContractInstance = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, MyNFTAbi.abi, signer);
};

const Profile = () => {
  const { account } = useMetaMask();
  const [ownedNFTs, setOwnedNFTs] = useState([]);
  const [saleNFTs, setSaleNFTs] = useState([]);

  const loadNFTs = useCallback(async () => {
    if (account) {
      try {
        const owned = await getOwnedNFTs(account);
        const onSale = await getNFTsOnSale(account);
        setOwnedNFTs(owned);
        setSaleNFTs(onSale);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      }
    }
  }, [account]);

  const listNftForSale = async (tokenId, userPrice) => {
    try {
      const contract = await getContractInstance();
      const mintingPrice = await contract.tokenPrices(tokenId);
      const originalCreator = await contract.originalCreators(tokenId);
      const accountAddress = account; 

      const salePrice = accountAddress === originalCreator ? mintingPrice : ethers.parseUnits(userPrice, 'ether');

      await contract.listNFT(tokenId, salePrice);
      alert('NFT is now for sale!');

      // Actualiza directamente los estados sin recargar todos los NFTs
      const updatedOwned = ownedNFTs.filter(nft => nft.tokenId !== tokenId);
      setOwnedNFTs(updatedOwned);

      const newNFT = { ...ownedNFTs.find(nft => nft.tokenId === tokenId), price: ethers.formatUnits(salePrice, 'ether') };
      setSaleNFTs(prevSale => [...prevSale, newNFT]);

    } catch (error) {
      console.error('Error listing NFT for sale:', error);
      alert('There was an error listing your NFT for sale.');
    }
  };

  useEffect(() => {
    loadNFTs();
  }, [loadNFTs, account]);

  return (
    <div className="profile">
      <header className="header">
        <img src={logo} alt="Blockbrite Logo" className="logo" />
        <nav className="navigation">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          <Link to="/create-nft" className="nav-link">Crear NFT</Link>
          <Link to="/profile"><img src={wallet} alt="wallet Logo" className="wallet"/></Link>
        </nav>
      </header>
      <h1>My Profile</h1>
      <section>
        <h2>Owned NFTs</h2>
        <div className="nft-grid">
          {ownedNFTs.map(nft => (
            <NFTCard_Owned key={nft.tokenId} nft={nft} listNftForSale={listNftForSale} account={account} />
          ))}
        </div>
      </section>
      <section>
        <h2>NFTs for Sale</h2>
        <div className="nft-grid">
          {saleNFTs.map(nft => (
            <NFTCard_Sale key={nft.tokenId} nft={nft} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;
