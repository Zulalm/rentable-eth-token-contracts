import { useState } from "react";
import { TokenStandard } from "../../../models/Token";
interface Props {
    tokenStandard: TokenStandard
    transfer: (from: string, to: string, amount: string, tokenId: string) => void;
}

const Transfer: React.FC<Props> = ({ tokenStandard, transfer }) => {

    const [isChecked, setIsChecked] = useState<boolean>(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const to = form['to'].value;
        const amount = form['amount'].value;
        console.log("", to, amount, "");
        transfer("from", to, amount, "tokenId");

    }
    return (
        <>
            <div className="card" style={{ height: 450, display: "block", padding: 50 }}>
                <div className="card-title">
                    Transfer
                </div>
                <div className="card-body">
                    <form onSubmit={(e) => {onSubmit(e)}}>
                        <div className="col mb-3">
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="transferType" name="transferType" value="" checked={isChecked}
                                            onChange={() => setIsChecked(!isChecked)} />
                                        <label className="form-label" htmlFor="transferType">Transfer from another address</label>
                                    </div>
                                </div>
                            </div>
                            {isChecked && (<div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="from" name="from" placeholder="Address" required></input>
                                        <label htmlFor="from" className="form-label">From</label>
                                    </div>
                                </div>
                            </div>)}
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="to" name="to" placeholder="Address" required></input>
                                        <label htmlFor="to" className="form-label">To</label>
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
                            <button type="submit" className="btn btn-primary" >Transfer</button>
                        </div>
                    </form>
                </div>
            </div>

        </>
    );
};
export default Transfer;