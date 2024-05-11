import { useState } from "react";
import { TokenStandard } from "../../../models/Token";
interface Props {
    tokenStandard: TokenStandard
}

const Approve: React.FC<Props> = ({ tokenStandard }) => {
    return (
        <>
            <div className="card card" style={{ height: 400, display: "block", padding: 50   }}>
                <div className="card-title">
                    Approve
                </div>
                <div className="card-body">
                    <form>
                        <div className="col mb-3">
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="spender" name="spender" placeholder="Spender" required></input>
                                        <label htmlFor="spender" className="form-label">Spender</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="amount" name="amount" placeholder="Amount" required></input>
                                        <label htmlFor="amount" className="form-label">Amount</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <button type="submit" className="btn btn-primary">Approve</button>
                            </div>
                    </form>
                </div>
            </div>

        </>
    );
};
export default Approve;