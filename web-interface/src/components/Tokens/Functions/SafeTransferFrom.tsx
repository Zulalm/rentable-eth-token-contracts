import { TokenStandard } from "../../../models/Token";
interface Props {
    tokenStandard: TokenStandard
}

const Rent: React.FC<Props> = ({ tokenStandard }) => {
    return (
        <>
            <div className="card" style={{ height: 400 , display: "block", padding: 50   }}>
                <div className="card-title">
                    Rent Tokens
                </div>
                <div className="card-body">
                    <form>
                        <div className="col mb-3">
                            {tokenStandard !== TokenStandard.ERC20 && (<div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="tokenId" name="tokenId" placeholder="Token Id" required />
                                        <label className="form-label" htmlFor="tokenId">Token Id</label>
                                    </div>
                                </div>
                            </div>)}
                            {tokenStandard !== TokenStandard.ERC721 && (<div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="amount" name="amount" placeholder="Amount" required />
                                        <label className="form-label" htmlFor="amount">Amount</label>
                                    </div>
                                </div>
                            </div>)}
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="date" className="form-control ml-1" id="startDate" name="startDate" required />
                                        <label htmlFor="startDate" className="form-label">Start Date</label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="date" className="form-control" id="endDate" name="endDate" required />
                                        <label htmlFor="endDate" className="form-label">End Date</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="address" name="address" placeholder="Address" required></input>
                                        <label htmlFor="address" className="form-label">Address</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <button type="submit" className="btn btn-primary">Rent</button>
                            </div>

                        </div>


                    </form>
                </div>
            </div>

        </>
    );
};
export default Rent;