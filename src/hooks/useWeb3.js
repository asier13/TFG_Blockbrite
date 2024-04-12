import { useEffect, useState } from 'react';
import Web3 from 'web3';

const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);
        } catch (error) {
          setError('User denied account access');
        }
      } else if (window.web3) {
        setWeb3(new Web3(window.web3.currentProvider));
      } else {
        setError('Non-Ethereum browser detected. Consider trying MetaMask!');
      }
      setLoading(false);
    };

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        // Handle case when user logs out of MetaMask
        setError('Please connect to MetaMask.');
      } else {
        // Handle account change
        setWeb3(new Web3(window.ethereum));
      }
    });

    window.ethereum.on('chainChanged', (_chainId) => window.location.reload());

    loadWeb3();
  }, []);

  return { web3, loading, error };
};

export default useWeb3;
