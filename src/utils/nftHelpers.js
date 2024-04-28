import MyNFTAbi from '../abis/MyNFT.json';
import contractAddress from '../contractAddress';
const ethers = require('ethers');

// Función para obtener los NFTs que una dirección posee
export const getOwnedNFTs = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, MyNFTAbi.abi, signer);
    const account = await signer.getAddress(); // Corrección aquí
    const totalOwned = await contract.balanceOf(account);
    let ownedNFTs = [];

    for (let i = 0; i < totalOwned; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(account, i);
      const isListed = await contract.isListed(tokenId);

      if (!isListed) {
        const tokenURI = await contract.tokenURI(tokenId);
        const metadata = await fetchNFTMetadata(tokenURI);
        ownedNFTs.push({
          tokenId: tokenId.toString(),
          ...metadata,
        });
      }
    }

    return ownedNFTs;
  } catch (error) {
    console.error("Error fetching owned NFTs:", error);
    return [];
  }
};



// Función para obtener todos los NFTs listados para la venta
export const getNFTsOnSale = async (account) => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, MyNFTAbi.abi, signer);
    const tokensForSale = await contract.getTokensForSaleByOwner(account);
    const saleNFTs = [];
    
    for (const tokenId of tokensForSale) {
      const price = await contract.tokenPrices(tokenId);
      const isListed = await contract.isListed(tokenId); 
      if (isListed) { 
        const tokenURI = await contract.tokenURI(tokenId);
        const metadata = await fetchNFTMetadata(tokenURI);
        saleNFTs.push({
          tokenId: tokenId.toString(),
          ...metadata,
          price: ethers.formatEther(price)
        });
      }
    }
    
    return saleNFTs;
  } catch (error) {
    console.error("Error fetching NFTs for sale:", error);
    return [];
  }
};


// Función auxiliar para obtener los metadatos del NFT a partir de su URI
const fetchNFTMetadata = async (tokenURI) => {
  try {
    const response = await fetch(tokenURI);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw error;
  }
};
