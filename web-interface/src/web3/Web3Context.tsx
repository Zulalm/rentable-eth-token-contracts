import Web3 from 'web3';
import { AbiItem } from 'web3-utils';

import ERC20FactoryABI from '../utils/contractABIs/ERC20FactoryABI.json';
import ERC721FactoryABI from '../utils/contractABIs/ERC721FactoryABI.json';
import ERC1155FactoryABI from '../utils/contractABIs/ERC1155FactoryABI.json';
import { ERC20_FACTORY_CONTRACT_ADDRESS, ERC1155_FACTORY_CONTRACT_ADDRESS, ERC721_FACTORY_CONTRACT_ADDRESS } from '../utils/contractAddresses';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';


interface Web3ContextInterface {
    web3: Web3 | null;
    erc20FactoryContract: any;
    erc721FactoryContract: any;
    erc1155FactoryContract: any;
    accountList: string[];
}

const Web3Context = createContext<Web3ContextInterface | undefined>(undefined);

export const Web3Provider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [erc20FactoryContract, setERC20Factory] = useState<any>(null);
  const [erc721FactoryContract, setERC721Factory] = useState<any>(null);
  const [erc1155FactoryContract, setERC1155Factory] = useState<any>(null);
  const [accountList, setAccountList] = useState<string[]>([]);

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      const erc20FactoryInstance = new web3.eth.Contract(ERC20FactoryABI as AbiItem[], ERC20_FACTORY_CONTRACT_ADDRESS);
      const erc721FactoryInstance = new web3.eth.Contract(ERC721FactoryABI as AbiItem[], ERC721_FACTORY_CONTRACT_ADDRESS);
      const erc1155FactoryInstance = new web3.eth.Contract(ERC1155FactoryABI as AbiItem[], ERC1155_FACTORY_CONTRACT_ADDRESS);
        setWeb3(web3);
        setERC1155Factory(erc1155FactoryInstance);
        setERC20Factory(erc20FactoryInstance);
        setERC721Factory(erc721FactoryInstance);
    } else {
      alert('Please download metamask');
    }
  }, [])



  return (
    <Web3Context.Provider value={{ web3, erc20FactoryContract, erc721FactoryContract, erc1155FactoryContract, accountList}}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (context === undefined) {
      throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
  };