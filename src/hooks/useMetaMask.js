import { useState, useEffect } from 'react';
import useWeb3 from './useWeb3';

const useMetaMask = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const web3 = useWeb3();

  // Manejar el cambio de cuenta
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setError('Please connect to MetaMask.');
    } else {
      setAccount(accounts[0]);
    }
  };

  // Manejar el cambio de red
  const handleChainChanged = () => {
    // Recargar la página para evitar inconsistencias de estado
    window.location.reload();
  };

  // Conectar a MetaMask
  const connectMetaMask = async () => {
    setIsConnecting(true);
    try {
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
    setIsConnecting(false);
  };

  useEffect(() => {
    if (web3) {
      web3.eth.getChainId().then((chainId) => {
        if (chainId.toString() !== '11155111') { // Chain ID para Sepolia
          setError('Please switch to the Sepolia Testnet.');
        } else {
          web3.eth.getAccounts().then(handleAccountsChanged).catch(setError);
        }
      });
    }

    // Escuchar cambios en la cuenta
    window.ethereum?.on('accountsChanged', handleAccountsChanged);

    // Escuchar cambios en la red
    window.ethereum?.on('chainChanged', handleChainChanged);

    return () => {
      // Limpiar listeners al desmontar el componente
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [web3]);

  return { account, error, isConnecting, connectMetaMask };
};

export default useMetaMask;
