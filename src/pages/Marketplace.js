import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const Marketplace = () => {
    const [nfts, setNfts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNFTs = async () => {
            setIsLoading(true);
            try {
                // Sustituir con tu lógica de carga de datos, por ejemplo:
                // const response = await fetch('url-to-your-api');
                // const data = await response.json();
                // setNfts(data);

                // Ejemplo temporal, recuerda reemplazarlo con tu lógica de carga de datos real
                setNfts([{ id: 1, title: 'NFT 1', image: 'first_nft.jpeg', description: 'Primer NFT del marketplace' }]);
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchNFTs();
    }, []);

    if (isLoading) return <div>Loading NFTs...</div>;
    if (error) return <div>Error loading NFTs: {error}</div>;

    return (
        <div className="home-container">
      <header className="home-header">
        <Link to="/">Inicio</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/create-nft">Crear NFT</Link>
        {/* Más enlaces si son necesarios */}
      </header>
        <div className="marketplace">
            <h1>Marketplace</h1>
            <div className="nft-list">
                {nfts.map(nft => (
                    <Card key={nft.id} {...nft} />
                ))}
            </div>
        </div>
    </div>
    );
};

export default Marketplace;
