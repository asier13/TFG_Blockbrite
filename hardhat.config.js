require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { ALCHEMY_API_KEY, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
  hardhat: {
  },
  sepolia: {
    url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`, // Utiliza backticks y ${...} para la variable
    accounts: [PRIVATE_KEY],
  }
},
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      {
        version: "0.8.24",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ],
  }
};

