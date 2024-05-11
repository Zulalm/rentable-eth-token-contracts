import { useState } from "react";
import { TokenStandard } from "../../models/Token";
import Footer from "../Generic/Footer";
import Header from "../Generic/Header";

const DeployTokenContract = () => {

    const [tokenStandard,  setTokenStandard]  = useState<TokenStandard>(TokenStandard.ERC20);
    return (   
        <>
            <Header page={"Deploy"} ></Header>
            <div className='page-div'>
            <div className="card" style={{  display: "block", padding: 100   }}>
                <div className="card-title">
                    Deploy New Token Contract
                </div>
                <div className="card-body">
                    <form>
                        <div className="col mb-3">
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <select  className="form-select" id="tokenStandard" name="tokenStandard" required onChange={e=>  {setTokenStandard( e.target.value  === "0"  ? TokenStandard.ERC20:  (e.target.value === "1"  ? TokenStandard.ERC721  :  TokenStandard.ERC1155) )}}>
                                            <option  value={TokenStandard.ERC20}>ERC20</option>
                                            <option value={TokenStandard.ERC721}>ERC721</option>
                                            <option value={TokenStandard.ERC1155}>ERC1155</option>
                                        </select>
                                        <label htmlFor="address" className="form-label">Token Standard</label>
                                    </div>
                                </div>
                            </div>
                            {tokenStandard !== TokenStandard.ERC1155 &&  <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="name" name="name" placeholder="Token Name" required></input>
                                        <label htmlFor="name" className="form-label">Token Name</label>
                                    </div>
                                </div>
                            </div>}
                            {tokenStandard !== TokenStandard.ERC1155 &&  <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="symbol" name="symbol" placeholder="Token Symbol" required></input>
                                        <label htmlFor="symbol" className="form-label">Token Symbol</label>
                                    </div>
                                </div>
                            </div>}
                            {tokenStandard === TokenStandard.ERC20  && <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="supply" name="supply" placeholder="Total Supply" required></input>
                                        <label htmlFor="supply" className="form-label">Total Supply</label>
                                    </div>
                                </div>
                            </div>}
                            {tokenStandard === TokenStandard.ERC1155 &&  <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="uri" name="uri" placeholder="URI" required></input>
                                        <label htmlFor="uri" className="form-label">URI</label>
                                    </div>
                                </div>
                            </div>}
                            <div className="row mb-3">
                                <button type="submit" className="btn btn-primary">Deploy</button>
                            </div>

                        </div>


                    </form>
                </div>
            </div>
            </div>
            <Footer></Footer>
        </>
    );
};
export default DeployTokenContract;