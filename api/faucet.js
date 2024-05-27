const { ethers } = require('ethers');
const dotenv = require('dotenv');
const path = require('path');

// Cargar el archivo .env desde el directorio raíz
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { PRIVATE_KEY, SEPOLIA_RPC_URL } = process.env;

if (!PRIVATE_KEY || !SEPOLIA_RPC_URL) {
  throw new Error('Por favor, revisa las variables de entorno PRIVATE_KEY y SEPOLIA_RPC_URL');
}

const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const faucetRequests = {};

// Endpoint para solicitar ETH
module.exports = async (req, res) => {
  console.log("Solicitud recibida");
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Only POST requests are allowed' });
    return;
  }

  const { address } = req.body;
  console.log("Dirección recibida:", address);

  if (!ethers.isAddress(address)) {
    res.status(400).send({ error: 'Dirección de Ethereum inválida' });
    return;
  }

  const currentTime = Date.now();
  const lastRequestTime = faucetRequests[address];

  if (lastRequestTime && currentTime - lastRequestTime < 24 * 60 * 60 * 1000) {
    res.status(429).send({ error: 'Solo se puede solicitar ETH una vez cada 24 horas' });
    return;
  }

  try {
    console.log("Enviando transacción");
    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.parseEther('0.1')
    });

    await tx.wait();
    faucetRequests[address] = currentTime;
    console.log("Transacción enviada:", tx.hash);
    res.send({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error('Error al enviar ETH:', error);
    res.status(500).send({ error: 'Error al enviar ETH' });
  }
};
