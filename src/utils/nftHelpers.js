import MyNFTAbi from '../abis/MyNFT.json';
import contractAddress from '../contractAddress';
const ethers = require('ethers');
const etherscan_apikey = process.env.ETHERSCAN_API_KEY;
const ETHERSCAN_API_URL = 'https://api-sepolia.etherscan.io/api';

// Inicializar el contrato en una función para asegurar el uso correcto de async/await
const getContractInstance = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(contractAddress, MyNFTAbi.abi, signer);
};

// Función para obtener los NFTs que una dirección posee
export const getOwnedNFTs = async () => {
    try {
        const url = new URL(`${ETHERSCAN_API_URL}`);
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        url.searchParams.append('module', 'account');
        url.searchParams.append('action', 'tokennfttx');
        url.searchParams.append('address', address);
        url.searchParams.append('startblock', 0);
        url.searchParams.append('endblock', 99999999);
        url.searchParams.append('sort', 'asc');
        url.searchParams.append('apikey', etherscan_apikey);
    
        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== '1') {
          throw new Error(data.result);
        }
    
        const transfers = data.result;
        const ownedNFTs = {};
    
        transfers.forEach(tx => {
          if (tx.to.toLowerCase() === address.toLowerCase() && tx.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
            ownedNFTs[tx.tokenID] = true; // Agrega o confirma la posesión
          }
          if (tx.from.toLowerCase() === address.toLowerCase() && tx.contractAddress.toLowerCase() === contractAddress.toLowerCase()) {
            delete ownedNFTs[tx.tokenID]; // Elimina si la dirección transfirió el NFT
          }
        });
    
        // Convertir los IDs de tokens en una lista y obtener detalles adicionales si es necesario
        const ownedTokenIds = Object.keys(ownedNFTs);
        const detailedNFTs = await Promise.all(ownedTokenIds.map(async tokenId => {
          const tokenURI = await getContractInstance().then(contract => contract.tokenURI(tokenId));
          const metadata = await fetchNFTMetadata(tokenURI);
          return {
            tokenId,
            ...metadata
          };
        }));
    
        return detailedNFTs;
      } catch (error) {
        console.error("Error fetching owned NFTs with Etherscan API:", error);
        return [];
      }
    };
    

// Función para obtener todos los NFTs listados para la venta
export const getNFTsOnSale = async () => {
  try {
    const myNFTContract = await getContractInstance();
    const tokensForSale = await myNFTContract.getTokensForSale();
    const saleNFTs = [];

    for (const tokenId of tokensForSale) {
      const price = await myNFTContract.tokenPrices(tokenId);
      if (!price===0) {
        const tokenURI = await myNFTContract.tokenURI(tokenId);
        const nftMetadata = await fetchNFTMetadata(tokenURI);
        saleNFTs.push({
          tokenId: tokenId.toString(),
          ...nftMetadata,
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
