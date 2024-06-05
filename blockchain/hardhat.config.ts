import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    hederaTestnet: {
      url: "https://testnet.hashio.io/api", // Hypothetical endpoint
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    baseTestnet: {
      url: "https://base-goerli.blockpi.network/v1/rpc/public",
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
