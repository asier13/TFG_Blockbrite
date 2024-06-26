import { Link } from 'react-router-dom';
import wallet from '../assets/wallet.png';
import logo from '../assets/logo.png';
import React, { useState } from 'react';
import axios from 'axios';
import useMetaMask from '../hooks/useMetaMask'; 

const Faucet = () => {
  const { account, connectMetaMask, error } = useMetaMask();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const requestEth = async () => {
    if (!account) {
      await connectMetaMask();
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/faucet', { address: account }, { timeout: 20000 });
      setMessage(`ETH enviado exitosamente. Tx Hash: ${response.data.txHash}`);
    } catch (error) {
      setMessage('Donate spare ETH to 0xB555918A95417aa5703367a5B20CD5915E2F43d5');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="faucet">
      <header className="header">
        <img src={logo} alt="Blockbrite Logo" className="logo" />
        <nav className="navigation">
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/marketplace" className="nav-link active">Marketplace</Link>
          <Link to="/create-nft" className="nav-link">Crear NFT</Link>
          <Link to="/faucet" className="nav-link">Faucet</Link>
          <Link to="/profile"><img src={wallet} alt="wallet Logo" className="wallet"/></Link>
        </nav>
      </header>
      <h1>Solicitar ETH de Prueba</h1>
      {account ? (
        <p>Conectado a la cuenta: {account}</p>
      ) : (
        <button onClick={connectMetaMask}>Conectar MetaMask</button>
      )}
      <button onClick={requestEth} disabled={loading}>
        {loading ? 'Solicitando...' : 'Solicitar 0.1 ETH'}
      </button>
      {message && <p>{message}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Faucet;
