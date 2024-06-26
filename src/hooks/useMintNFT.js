// src/hooks/useMintNFT.js
import MyNFTAbi from '../abis/Blockbrite.json';
import contractAddress from '../contractAddress';
const ethers = require('ethers');

export const useMintNFT = () => {
  const mintMultipleNFTs = async (tokenURIs, prices, categories) => {
    if (!window.ethereum) {
      throw new Error('No Ethereum browser extension detected');
    }

    // Solicitar al usuario que conecte su cartera
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const nftContract = new ethers.Contract(contractAddress, MyNFTAbi.abi, signer);

    try {
      // Convertir los precios a Wei
      const pricesInWei = prices.map((price) => ethers.parseEther(price.toString()));

      const transaction = await nftContract.mintMultipleNFTs(signer.getAddress(), tokenURIs, pricesInWei, categories);
      await transaction.wait();
      
      alert('NFTs minted successfully. Transaction hash: ' + transaction.hash);
    } catch (error) {
      console.error('Failed to mint NFTs:', error);
      alert('Failed to mint NFTs: ' + error.message);
    }
  };

  return { mintMultipleNFTs };
};

export default useMintNFT;
