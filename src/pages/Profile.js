import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useMetaMask from '../hooks/useMetaMask';
import NFTCardSale from '../components/NFTCardSale';
import NFTCardOwned from '../components/NFTCardOwned';
import { getOwnedNFTs, getNFTsOnSale } from '../utils/nftHelpers';
import MyNFTAbi from '../abis/Blockbrite.json';
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
  const [refreshKey, setRefreshKey] = useState(0);

  const loadNFTs = useCallback(async () => {
    if (account) {
      const owned = await getOwnedNFTs(account);
      const onSale = await getNFTsOnSale(account);

      setOwnedNFTs(owned);
      setSaleNFTs(onSale);
      setRefreshKey(oldKey => oldKey + 1); 
    }
  }, [account]);
  

  const listNftForSale = async (tokenId, userPrice) => {
    try {
      const contract = await getContractInstance();
      const mintingPrice = await contract.tokenPrices(tokenId);
      const originalCreator = await contract.originalCreators(tokenId);
      const accountAddress = account;
      
      userPrice = typeof userPrice === 'string' ? userPrice.trim() : '';
      
      const salePrice = accountAddress === originalCreator ? mintingPrice : 
                        userPrice !== '' ? ethers.parseUnits(userPrice, 'ether') : mintingPrice;
      
      await contract.listNFT(tokenId, salePrice);
      alert('NFT is now for sale!');
      

      const updatedOwned = ownedNFTs.filter(nft => nft.tokenId !== tokenId);
      setOwnedNFTs(updatedOwned);
      
      const newNFT = { ...ownedNFTs.find(nft => nft.tokenId === tokenId), price: ethers.formatUnits(salePrice, 'ether') };
      setSaleNFTs(prevSale => [...prevSale, newNFT]);
      refresh();
    } catch (error) {
      console.error('Error listing NFT for sale:', error);
      alert('There was an error listing your NFT for sale.');
    }
  };
  
  
  const delistNft = async (tokenId) => {
    try {
      const contract = await getContractInstance();
      
      await contract.delistNFT(tokenId);
      
      const originalCreator = await contract.originalCreators(tokenId);
      const mintingPrice = await contract.tokenPrices(tokenId);
      const accountAddress = account;
  
      const resetPrice = accountAddress === originalCreator ? ethers.formatUnits(mintingPrice, 'ether') : null;
  
      const updatedSale = saleNFTs.filter(nft => nft.tokenId !== tokenId);
      setSaleNFTs(updatedSale);
  
      const delistedNFT = saleNFTs.find(nft => nft.tokenId === tokenId);
      if (delistedNFT) {
        const updatedOwned = [...ownedNFTs, { ...delistedNFT, price: resetPrice }];
        setOwnedNFTs(updatedOwned);
      }
      refresh();
      alert('NFT delisted successfully!');
    } catch (error) {
      console.error('Error delisting NFT:', error);
      alert('Failed to delist NFT.');
    }
  };
  


  const refresh = () => setRefreshKey(oldKey => oldKey + 1);

  useEffect(() => {
    loadNFTs();
  }, [loadNFTs, account]);

  return (
    <div className="profile" key={refreshKey}>
      <header className="header">
        <img src={logo} alt="Blockbrite Logo" className="logo" />
        <nav className="navigation">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          <Link to="/create-nft" className="nav-link">Crear NFT</Link>
          <Link to="/faucet" className="nav-link">Faucet</Link>
          <Link to="/profile"><img src={wallet} alt="wallet Logo" className="wallet"/></Link>
        </nav>
      </header>
      <h1>My Profile</h1>
      <section>
        <h2>Owned NFTs</h2>
        <div className="nft-grid">
          {ownedNFTs.map(nft => (
            <NFTCardOwned key={nft.tokenId} nft={nft} listNftForSale={listNftForSale} account={account} />
        ))}
        </div>
      </section>
      <section>
        <h2>NFTs for Sale</h2>
        <div className="nft-grid">
          {saleNFTs.map(nft => (
            <NFTCardSale key={nft.tokenId} nft={nft} delistNft={delistNft} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;