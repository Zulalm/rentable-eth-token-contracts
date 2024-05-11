import { useNavigate, useParams } from 'react-router-dom';
import mockTokens from '../../mock_data/data';
import ERC20Functions from './Functions';
import ERC721Functions from './ERC721Functions';
import ERC1155Functions from './ERC1155Functions';
import Header from '../Generic/Header';
import Footer from '../Generic/Footer';
import { useEffect, useState } from 'react';
import { App, Cash, Bank } from 'react-bootstrap-icons';
import { Grey, PrimaryColorLight, PrimaryColorVibrant } from '../../constants/colors';
import { Token, TokenStandard } from '../../models/Token';
import RentedTokens from './RentedTokens';
import BorrowedTokens from './BorrowedTokens';
import Functions from './Functions';

const TokenDetails = () => {
    const { id } = useParams();

    const [currentTab, setCurrentTab] = useState<string>("Actions");

    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            navigate('/tokens');
        }
    }, [id]);

    const tokenId = parseInt(id!)
    const token = mockTokens.at(tokenId - 1);

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
            <div className='page-div'>
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
                            <div className="p-1 token-detail-body">{token!.standard ==  TokenStandard.ERC20?  "ERC20": (token!.standard  ==  TokenStandard.ERC721 ? "ERC721" :  "ERC1155")}</div>
                        </div>
                        {token!.standard == TokenStandard.ERC20  && 
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
                {currentTab === "Actions" && <Functions tokenStandard={token!.standard} />}
                {currentTab === "RentedTokens" && <RentedTokens/>}
                {currentTab === "BorrowedTokens" && <BorrowedTokens/>}
            </div >
            <Footer></Footer>
        </>
    );
};

export default TokenDetails;