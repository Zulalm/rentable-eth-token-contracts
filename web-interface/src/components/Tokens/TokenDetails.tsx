import { useNavigate, useParams } from 'react-router-dom';
import mockTokens from '../../mock_data/data';
import ERC20Functions from './ERC20Functions';
import ERC721Functions from './ERC721Functions';
import ERC1155Functions from './ERC1155Functions';
import Header from '../Generic/Header';
import Footer from '../Generic/Footer';
import { useEffect } from 'react';
import { App, Cash, Bank } from 'react-bootstrap-icons';
import { Grey, PrimaryColorLight, PrimaryColorVibrant } from '../../constants/colors';

const TokenDetails = () => {
    const { id } = useParams();

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
                <div className="card card-custom">

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
                            <div className="p-1 token-detail-body">{token!.standard}</div>
                        </div>
                        <Bank size={30} color={PrimaryColorVibrant}></Bank>
                        <div className="vstack gap-0">
                            <div className="p-1 ">
                                <h5 className='secondary-title'> Amount </h5>
                            </div>
                            <div className="p-1 token-detail-body">{token!.amount}</div>
                        </div>
                    </div>
                </div>

                {token?.standard === 'ERC20' && <ERC20Functions></ERC20Functions>}
                {token?.standard === 'ERC721' && <ERC721Functions></ERC721Functions>}
                {token?.standard === 'ERC1155' && <ERC1155Functions></ERC1155Functions>}
            </div >
            <Footer></Footer>
        </>
    );
};

export default TokenDetails;