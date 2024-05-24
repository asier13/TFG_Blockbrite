// src/utils/ipfs.js

const pinFileToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const pinataApiKey = process.env.REACT_APP_PINATA_API_KEY;
    const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET_API_KEY;

    let data = new FormData();
    data.append('file', file);
  
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey 
      },
      body: data,
    });
  
    if (!res.ok) {
        const errorBody = await res.text(); 
        throw new Error(`Error al subir el archivo a IPFS: ${res.statusText}. Detalles: ${errorBody}`);
    }
  
    const pinataResponse = await res.json();
    return `https://gateway.pinata.cloud/ipfs/${pinataResponse.IpfsHash}`;
  };
  
  export { pinFileToIPFS };
  