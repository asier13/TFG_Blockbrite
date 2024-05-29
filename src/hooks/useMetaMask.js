import { useState, useEffect } from 'react';
const ethers = require('ethers');

const useMetaMask = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectMetaMask = async () => {
    setIsConnecting(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      setAccount(await signer.getAddress());
      
      setError(null);
    } catch (err) {
      setError('Failed to connect to MetaMask: ' + err.message);
    }
    setIsConnecting(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);

      provider.getNetwork().then((network) => {
        if (network.chainId !== 11155111) {
          setError('Please switch to the Sepolia Testnet.');
        }
      });

      provider.listAccounts().then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }).catch(setError);

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });

      window.ethereum.on('chainChanged', (_chainId) => window.location.reload());
    }

    return () => {
      window.ethereum.removeListener('accountsChanged', connectMetaMask);
      window.ethereum.removeListener('chainChanged', (_chainId) => window.location.reload());
    };
  }, []);

  return { account, error, isConnecting, connectMetaMask };
};

export default useMetaMask;
