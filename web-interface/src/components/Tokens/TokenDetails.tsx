import { useNavigate, useParams } from 'react-router-dom';
import ERC20Functions from './Functions';
import ERC721Functions from './ERC721Functions';
import ERC1155Functions from './ERC1155Functions';
import Header from '../Generic/Header';
import Footer from '../Generic/Footer';
import { useEffect, useState } from 'react';
import { App, Cash, Bank } from 'react-bootstrap-icons';
import { Grey, PrimaryColorLight, PrimaryColorVibrant } from '../../constants/colors';
import { RentedToken, Token, TokenStandard } from '../../models/Token';
import RentedTokens from './RentedTokens';
import BorrowedTokens from './BorrowedTokens';
import Functions from './Functions';
import { useWeb3 } from '../../web3/Web3Context';

import ERC20ABI from '../../utils/contractABIs/ERC20ABI.json';
import ERC721ABI from '../../utils/contractABIs/ERC721ABI.json';
import ERC1155ABI from '../../utils/contractABIs/ERC1155ABI.json';

const TokenDetails = () => {
    const { address } = useParams();

    const [currentTab, setCurrentTab] = useState<string>("Actions");
    const [initialized, setInitialized] = useState<boolean>(false);
    const [token, setToken] = useState<Token>({
        address: "",
        name: "",
        symbol: "",
        amount: 0,
        standard: TokenStandard.ERC20  
    });
    const [contract, setContract] = useState<any>(undefined);
    const [rentedTokens, setRentedTokens] = useState<RentedToken[]>([]);
    const [borrowedTokens, setBorrowedTokens] = useState<RentedToken[]>([]);
    const [accounts, setAccounts] = useState<string[]>([]);

    const navigate = useNavigate();

    const { web3 } = useWeb3();

    useEffect(() => {
        if (!address) {
            navigate('/tokens');
        }
    }, [address]);

    useEffect(() => {
        const fetchData = async () => {
            const accountList = await window.ethereum.request({ method: 'eth_accounts' });
            console.log(accountList)
            setAccounts(accountList);
            if(token.standard == TokenStandard.ERC20){

            const contract = new web3!.eth.Contract(ERC20ABI, address);
            setContract(contract);
            try {
                const name = await contract.methods.name().call();
                const symbol = await contract.methods.symbol().call();
                const amount = await contract.methods.totalSupply().call();
                    setToken({
                        address: address!,
                        name: name as unknown as string,
                        symbol: symbol as unknown as string,
                        amount: Number(BigInt(amount as unknown as string)),
                        standard: TokenStandard.ERC20,
                    });
                const rentedTokenData = await contract.methods.getRentedTokens(accountList[0]).call({from: accountList[0]});
                const borrowedTokenData = await contract.methods.getBorrowedTokens(accountList[0]).call({from: accountList[0]});
                //@ts-ignore
                const tokens: RentedToken[] = rentedTokenData.map((token: any) => {

                    const endDate = new Date(Number(BigInt(token.endDate)));
                    const startDate = new Date(Number(BigInt(token.startDate)));
                    return {
                        id: token.nodeId,
                        account: token.account,
                        startDate: startDate,
                        endDate: endDate,
                        amount: Number(BigInt(token.amount)),
                    }
                });
                setRentedTokens(tokens);
                //@ts-ignore
                const tokens1: RentedToken[] = borrowedTokenData.map((token: any) => {

                    const endDate = new Date(Number(BigInt(token.endDate)));
                    const startDate = new Date(Number(BigInt(token.startDate)));
                    return {
                        id: token.nodeId,
                        account: token.account,
                        startDate: startDate,
                        endDate: endDate,
                        amount: Number(BigInt(token.amount)),
                    }
                });
                setBorrowedTokens(tokens1);
                console.log(tokens);
            } catch (error) {
                console.error("Error fetching token data:", error);
            }}
            else if(token.standard == TokenStandard.ERC721){
                const contract = new web3!.eth.Contract(ERC721ABI, address);
                setContract(contract);
                try {
                    const name = await contract.methods.name().call();
                    const symbol = await contract.methods.symbol().call();
                    setToken({
                        address: address!,
                        name: name as unknown as string,
                        symbol: symbol as unknown as string,
                        amount: 0,
                        standard: TokenStandard.ERC721,
                    });
                } catch (error) {
                    console.error("Error fetching token data:", error);
                }
            }else if(token.standard == TokenStandard.ERC1155){
                const contract = new web3!.eth.Contract(ERC1155ABI, address);
                setContract(contract);
                try {
                    const uri = await contract.methods.uri().call();
                    setToken({
                        address: address!,
                        name: uri as unknown as string,
                        symbol: "",
                        amount: 0,
                        standard: TokenStandard.ERC1155,
                    });
                } catch (error) {
                    console.error("Error fetching token data:", error);
                }
            }
            setInitialized(true);
        }
        if (address && !initialized && web3) {
            fetchData();
        }
    }, [address, initialized, web3])

    const getSymbolIcon = (symbol: string) => {
        if (!symbol || symbol.trim() === '') {
            return null;
        }
        const firstCharacter = symbol.charAt(0).toUpperCase();

        return <span className="token-symbol">{firstCharacter}</span>;
    };
    return (
        <>
            <Header page={'Tokens'} ></Header>
            {token && (<div className='page-div'>
                <h3 className="card-title" color={PrimaryColorVibrant}>{token!.name}</h3>
                <div className="card" style={{ padding: 5 }}>

                    <div className="hstack gap-5">
                        {getSymbolIcon(token!.symbol)}
                        <div className="vstack gap-0">
                            <div className="p-1">
                                <h5 className='secondary-title'>Symbol</h5>
                            </div>
                            <div className="p-1 token-detail-body">{token!.symbol}</div>
                        </div>
                        <Cash size={30} color={PrimaryColorVibrant} />
                        <div className="vstack gap-0">
                            <div className="p-1">
                                <h5 className='secondary-title'>Standard</h5>
                            </div>
                            <div className="p-1 token-detail-body">{token!.standard == TokenStandard.ERC20 ? "ERC20" : (token!.standard == TokenStandard.ERC721 ? "ERC721" : "ERC1155")}</div>
                        </div>
                        {token!.standard == TokenStandard.ERC20 &&
                            <>
                                <Bank size={30} color={PrimaryColorVibrant}></Bank>
                                <div className="vstack gap-0">
                                    <div className="p-1 ">
                                        <h5 className='secondary-title'> Total Supply </h5>
                                    </div>
                                    <div className="p-1 token-detail-body">{token!.amount}</div>
                                </div>
                            </>}
                    </div>
                </div>

                <div style={{ margin: 10 }}>
                    <ul className="nav nav-tabs justify-content-center">
                        <li className="nav-item fs-6 ">
                            <button className={currentTab === "Actions" ? "nav-link active" : "nav-link"} aria-current="page" onClick={() => setCurrentTab("Actions")}>Actions</button>
                        </li>
                        <li className="nav-item fs-6">
                            <button className={currentTab === "RentedTokens" ? "nav-link active" : "nav-link"} aria-current="page" onClick={() => setCurrentTab("RentedTokens")}>Rented Tokens</button>
                        </li>
                        <li className="nav-item fs-6">
                            <button className={currentTab === "BorrowedTokens" ? "nav-link active" : "nav-link"} aria-current="page" onClick={() => setCurrentTab("BorrowedTokens")}>Borrowed Tokens</button>
                        </li>
                    </ul>
                </div>
                {currentTab === "Actions" && <Functions tokenStandard={token!.standard} contractAddress={token.address}/>}
                {currentTab === "RentedTokens" && <RentedTokens tokens={rentedTokens} />}
                {currentTab === "BorrowedTokens" && <BorrowedTokens tokens={borrowedTokens}/>}
            </div >)}
            <Footer></Footer>
        </>
    );
};

export default TokenDetails;