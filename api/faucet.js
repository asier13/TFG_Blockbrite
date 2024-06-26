// api/faucet.js
const { ethers } = require('ethers');
const dotenv = require('dotenv');
dotenv.config();

const { PRIVATE_KEY, SEPOLIA_RPC_URL } = process.env;

if (!PRIVATE_KEY || !SEPOLIA_RPC_URL) {
  console.error('Por favor, asegúrate de que las variables de entorno PRIVATE_KEY y SEPOLIA_RPC_URL están configuradas correctamente.');
  process.exit(1);
}


const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const faucetRequests = {};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send({ error: 'Only POST requests are allowed' });
    return;
  }

  const { address } = req.body;

  if (!ethers.isAddress(address)) {
    return res.status(400).send({ error: 'Dirección de Ethereum inválida' });
  }

  const currentTime = Date.now();
  const lastRequestTime = faucetRequests[address];

  if (lastRequestTime && currentTime - lastRequestTime < 24 * 60 * 60 * 1000) {
    return res.status(429).send({ error: 'Solo se puede solicitar ETH una vez cada 24 horas' });
  }

  try {
    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.parseEther('0.1') 
    });

    await tx.wait();
    faucetRequests[address] = currentTime; x
    res.send({ success: true, txHash: tx.hash });
  } catch (error) {
    console.error('Error al enviar ETH:', error);
    res.status(500).send({ error: 'Error al enviar ETH' });
  }
};
