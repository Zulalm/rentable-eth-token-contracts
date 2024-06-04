import { useState } from "react";
import { TokenStandard } from "../../../models/Token";
interface Props {
    tokenStandard: TokenStandard
    handleApprove: (spender: string, amount: string, tokenId: string) => void;
}

const Approve: React.FC<Props> = ({ tokenStandard, handleApprove }) => {
    const[isApproved, setIsApproved] = useState<boolean>(false)

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const form = e.currentTarget;
        if(tokenStandard === TokenStandard.ERC20){
            const spender = form['spender'].value;
            const amount = form['amount'].value;
            handleApprove(spender, amount, "");
        }
        if(tokenStandard === TokenStandard.ERC721){
            const spender = form['spender'].value;
            const tokenId = form['tokenId'].value;
            handleApprove(spender, "", tokenId);
        }
        if(tokenStandard === TokenStandard.ERC1155){
            const spender = form['spender'].value;
            const amount = form['amount'].value;
            const tokenId = form['tokenId'].value;
            handleApprove(spender, amount, tokenId);
        }
        setIsApproved(true);
    }


    return (
        <>
            <div className="card card" style={{ height: 450, display: "block", padding: 50   }}>
                <div className="card-title">
                    Approve
                </div>
                <div className="card-body">
                    <form onSubmit={(e)=> onSubmit(e)}>
                        <div className="col mb-3">
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="spender" name="spender" placeholder="Spender" required></input>
                                        <label htmlFor="spender" className="form-label">Spender</label>
                                    </div>
                                </div>
                            </div>
                            {tokenStandard === TokenStandard.ERC20 && <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="amount" name="amount" placeholder="Amount" required></input>
                                        <label htmlFor="amount" className="form-label">Amount</label>
                                    </div>
                                </div>
                            </div>}
                            {tokenStandard === TokenStandard.ERC721 && <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="tokenId" name="tokenId" placeholder="Token ID" required></input>
                                        <label htmlFor="tokenId" className="form-label">Token ID</label>
                                    </div>
                                </div>
                            </div>}
                        </div>
                        <div className="row mb-3">
                            <button type="submit" className="btn btn-primary">Approve</button>
                            </div>
                    </form>
                    {isApproved && <div className="alert alert-success" role="alert">
                        Approved successfully!
                    </div>}
                </div>
            </div>

        </>
    );
};
export default Approve;