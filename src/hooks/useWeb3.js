import { useState, useEffect } from 'react';
import MyNFTAbi from '../abis/Blockbrite.json';
import contractAddress from '../contractAddress';
const ethers = require('ethers');

const useWeb3 = () => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, MyNFTAbi.abi, web3Signer);

        setProvider(web3Provider);
        setSigner(web3Signer);
        setContract(nftContract);
      } catch (err) {
        console.error('useWeb3: ', err);
        setError('Failed to initialize web3, make sure you have MetaMask!');
      }
    } else {
      setError('Please install MetaMask to use this app.');
    }
  }, []);

  // Función para conectar la cartera de MetaMask
  const connectWallet = async () => {
    try {
      await provider.send('eth_requestAccounts', []);
      const web3Signer = provider.getSigner();
      setSigner(web3Signer);
      setError('');
    } catch (err) {
      console.error('useWeb3 - connectWallet: ', err);
      setError('Failed to connect wallet.');
    }
  };

  return { provider, signer, contract, error, connectWallet };
};

export default useWeb3;
