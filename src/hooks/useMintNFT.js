import MyNFTAbi from '../abis/MyNFT.json';
import contractAddress from '../contractAddress';
const ethers = require("ethers")

export const useMintNFT = () => {
  const createNFT = async (metadataURI) => {
    if (!window.ethereum) {
      throw new Error("No Ethereum browser extension detected");
    }

    await window.ethereum.request({ method: 'eth_requestAccounts' }); // solicitar al usuario que conecte su cartera
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner()
    const nftContract = new ethers.Contract(contractAddress, MyNFTAbi.abi, signer);

    try {
        const address = await signer.getAddress();
        const transaction = await nftContract.mintNFT(address, metadataURI);
        await transaction.wait();
        alert('NFT minted successfully. Transaction hash: ' + transaction.hash);
    } catch (error) {
      alert('Failed to mint NFT: ' + error.message);
    }
  };

  return { createNFT };
};

export default useMintNFT;