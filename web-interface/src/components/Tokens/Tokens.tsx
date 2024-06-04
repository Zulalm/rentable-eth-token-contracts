import { useEffect, useState } from "react";
import { Token, TokenStandard } from "../../models/Token";
import Footer from "../Generic/Footer";
import Header from "../Generic/Header";
import SearchToken from "./SearchToken";
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from "../../web3/Web3Context";

const Tokens = () => {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState<string>("ERC20");
    const [tokens, setTokens] = useState<Token[]>([]);

    const { web3, erc1155FactoryContract, erc20FactoryContract, erc721FactoryContract } = useWeb3();
    const onSelectToken = (token: Token) => {
        if(token.standard === TokenStandard.ERC20) {
            navigate(`/tokens/ERC20/${token.address}`);
        } else if (token.standard === TokenStandard.ERC721) {
            navigate(`/tokens/ERC721/${token.address}`);
        } else if (token.standard === TokenStandard.ERC1155) {
            navigate(`/tokens/ERC1155/${token.address}`);
        }
        
    }
    const onSelectERC1155Token = (token: Token) => {
        navigate(`/tokens/${token.address}`);
    }

    useEffect(() => {
        const handleERC20Tokens = async () => {
            const accountList = await window.ethereum.request({ method: 'eth_accounts' });
            const tokens1 = await erc20FactoryContract.methods.getRentableContracts().call();
            const erc20Tokens: Token[] = tokens1.map((token: any) => {
                return {
                    id: token.contractAddress,
                    address: token.contractAddress,
                    name: token.name,
                    symbol: token.symbol,
                    standard: TokenStandard.ERC20,
                }
            });
            setTokens(erc20Tokens);
        }
    
        const handleERC721Tokens = async () => {
            const accountList = await window.ethereum.request({ method: 'eth_accounts' });
            const tokens1 = await erc721FactoryContract.methods.getRentableContracts().call();
            const erc721Tokens: Token[] = tokens1.map((token: any) => {
                return {
                    id: token.contractAddress,
                    address: token.contractAddress,
                    name: token.name,
                    symbol: token.symbol,
                    standard: TokenStandard.ERC721,
                }
            });
            setTokens(erc721Tokens);
        }
    
        const handleERC1155Tokens = async () => {
            const accountList = await window.ethereum.request({ method: 'eth_accounts' });
            const tokens1 = await erc1155FactoryContract.methods.getRentableContracts().call();
            const erc1155Tokens: Token[] = tokens1.map((token: any) => {
                return {
                    id: token.contractAddress,
                    address: token.contractAddress,
                    uri: token.uri,
                    standard: TokenStandard.ERC1155,
                    symbol: "",
                    name: "",
                }
            });
            setTokens(erc1155Tokens);
        }
    
        if (web3) {
            if (currentTab === "ERC20" && erc20FactoryContract) {
                handleERC20Tokens();
            } else if (currentTab === "ERC721"  && erc721FactoryContract) {
                handleERC721Tokens();
            } else if (currentTab === "ERC1155" && erc1155FactoryContract) {
                handleERC1155Tokens();
            }
        }
    }, [currentTab, web3, erc20FactoryContract, erc721FactoryContract, erc1155FactoryContract]);
    

    return (
        <>
            <Header page={"Tokens"} ></Header>
            <div style={{ margin: 10 }}>
                <ul className="nav nav-tabs justify-content-center">
                    <li className="nav-item fs-6 ">
                        <button className={currentTab === "ERC20" ? "nav-link active" : "nav-link"} aria-current="page" onClick={() => {
                            setCurrentTab("ERC20");
                        }}>ERC20</button>
                    </li>
                    <li className="nav-item fs-6">
                        <button className={currentTab === "ERC721" ? "nav-link active" : "nav-link"} aria-current="page" onClick={() => setCurrentTab("ERC721")}>ERC721</button>
                    </li>
                    <li className="nav-item fs-6">
                        <button className={currentTab === "ERC1155" ? "nav-link active" : "nav-link"} aria-current="page" onClick={() => setCurrentTab("ERC1155")}>ERC1155</button>
                    </li>
                </ul>
            </div>
            {currentTab === "ERC20" && <SearchToken tokens={tokens} onSelectToken={onSelectToken} tokenStandard={TokenStandard.ERC20}></SearchToken>}
            {currentTab === "ERC721" && <SearchToken tokens={tokens} onSelectToken={onSelectToken} tokenStandard={TokenStandard.ERC721}></SearchToken>}
            {currentTab === "ERC1155" && <SearchToken tokens={tokens} onSelectToken={onSelectToken}  tokenStandard={TokenStandard.ERC1155}></SearchToken>}

            <Footer></Footer>
        </>
    );
};
export default Tokens;

