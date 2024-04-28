import MyNFTAbi from '../abis/MyNFT.json';
import contractAddress from '../contractAddress';
const ethers = require('ethers');

export const useBuyNFT = () => {
  const buyNFT = async (tokenId, price) => {
    if (!window.ethereum) {
      throw new Error('Ethereum wallet is not connected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, MyNFTAbi.abi, signer);

    try {
      const transaction = await contract.buyNFT(tokenId, { value: ethers.parseEther(price) });
      await transaction.wait();
      alert('NFT bought successfully!');
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed: ' + error.message);
    }
  };

  return { buyNFT };
};
