import { useEffect, useState } from "react";
import { TokenStandard } from "../../models/Token";
import Footer from "../Generic/Footer";
import Header from "../Generic/Header";
import { useWeb3 } from "../../web3/Web3Context";
import { accounts } from "web3/lib/commonjs/eth.exports";
import { useNavigate } from "react-router-dom";

const DeployTokenContract = () => {

    const [tokenStandard, setTokenStandard] = useState<TokenStandard>(TokenStandard.ERC20);
    const [name, setName] = useState<string>("");
    const [symbol, setSymbol] = useState<string>("");
    const [supply, setSupply] = useState<string>("");
    const [uri, setUri] = useState<string>("");
    const [transactionHash, setTransactionHash] = useState<string>("");
    const [isDeploying, setIsDeploying] = useState<boolean>(false);

    const [showDialog, setShowDialog] = useState<boolean>(false);
    const { erc1155FactoryContract, erc20FactoryContract, erc721FactoryContract, web3 } = useWeb3();

    const navigate = useNavigate();
     
    const deployNewContract = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        

        const accountList = await window.ethereum.request({ method: 'eth_accounts' });
        try{
            if (tokenStandard == TokenStandard.ERC20) {
                const address = await erc20FactoryContract.methods.createERC20Token(name, symbol, supply).send({from: accountList[0]});
                navigate(`/tokens/${(address as unknown as string)}`);

            }
            else if (tokenStandard == TokenStandard.ERC721) {
                await erc721FactoryContract.methods.createERC721Token(name, symbol).send({from: accountList[0]});
    
            } else if (tokenStandard == TokenStandard.ERC1155) {
                const address = await erc1155FactoryContract.methods.createERC1155Token(uri).send({from: accountList[0]});
            }
        }catch(e){
            console.log(e);
        }   
        
        //TODO: get the transaction hash  setShowDialog(true);
        setTokenStandard(TokenStandard.ERC20);
        setName("");
        setSymbol("");
        setSupply("");
        setUri("");
       // TODO: add a info message to show the transaction hash

    }


    return (
        <>
            <Header page={"Deploy"} ></Header>
            <div className='page-div'>
                <div className="card" style={{ display: "block", padding: 100 }}>
                    <div className="card-title">
                        Deploy New Token Contract
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => deployNewContract(e)} >
                            <div className="col mb-3">
                                <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            <select className="form-select" id="tokenStandard" name="tokenStandard" required onChange={e => { setTokenStandard(e.target.value === "0" ? TokenStandard.ERC20 : (e.target.value === "1" ? TokenStandard.ERC721 : TokenStandard.ERC1155)) }}>
                                                <option value={TokenStandard.ERC20}>ERC20</option>
                                                <option value={TokenStandard.ERC721}>ERC721</option>
                                                <option value={TokenStandard.ERC1155}>ERC1155</option>
                                            </select>
                                            <label htmlFor="address" className="form-label">Token Standard</label>
                                        </div>
                                    </div>
                                </div>
                                {tokenStandard !== TokenStandard.ERC1155 && <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="name" name="name" placeholder="Token Name" required onChange={e => {setName(e.target.value) }}></input>
                                            <label htmlFor="name" className="form-label">Token Name</label>
                                        </div>
                                    </div>
                                </div>}
                                {tokenStandard !== TokenStandard.ERC1155 && <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="symbol" name="symbol" placeholder="Token Symbol" required onChange={e => { setSymbol(e.target.value) }}></input>
                                            <label htmlFor="symbol" className="form-label">Token Symbol</label>
                                        </div>
                                    </div>
                                </div>}
                                {tokenStandard === TokenStandard.ERC20 && <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="supply" name="supply" placeholder="Total Supply" required onChange={e => { setSupply(e.target.value) }}></input>
                                            <label htmlFor="supply" className="form-label">Total Supply</label>
                                        </div>
                                    </div>
                                </div>}
                                {tokenStandard === TokenStandard.ERC1155 && <div className="row mb-3">
                                    <div className="col">
                                        <div className="form-floating">
                                            <input type="text" className="form-control" id="uri" name="uri" placeholder="URI" required onChange={e => { setUri(e.target.value) }}></input>
                                            <label htmlFor="uri" className="form-label">URI</label>
                                        </div>
                                    </div>
                                </div>}
                                <div className="row mb-3">
                                    <button type="submit" className="btn btn-primary">Deploy</button>
                                </div>

                            </div>


                        </form>

                        <div hidden={!showDialog}>
                            Transaction Hash = 0x1234567890
                        </div>

                    </div>

                </div>
            </div>
            <Footer></Footer>
        </>
    );
};
export default DeployTokenContract;