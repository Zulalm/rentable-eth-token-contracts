import { useState } from "react";

const SafeTransferFrom = () => {
    const [isChecked, setIsChecked] = useState<boolean>(false);
    return (
        <>
            <div className="card" style={{ height: 450 , display: "block", padding: 50   }}>
                <div className="card-title">
                Safe Transfer From
                </div>
                <div className="card-body">
                    <form>
                        <div className="col mb-3">
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="transferType" name="transferType" value="" checked={isChecked}
                                            onChange={() => setIsChecked(!isChecked)} />
                                        <label className="form-label" htmlFor="transferType">Safe Transfer with Data</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="from" name="from" placeholder="From" required></input>
                                        <label htmlFor="from" className="form-label">From</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="to" name="to" placeholder="To" required></input>
                                        <label htmlFor="to" className="form-label">To</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="tokenId" name="tokenId" placeholder="Token ID" required></input>
                                        <label htmlFor="tokenId" className="form-label">Token ID</label>
                                    </div>
                                </div>
                            </div>
                            {isChecked && <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="data" name="data" placeholder="Data" required></input>
                                        <label htmlFor="data" className="form-label">Data</label>
                                    </div>
                                </div>
                            </div>}
                            <div className="row mb-3">
                                <button type="submit" className="btn btn-primary">Safe Transfer</button>
                            </div>

                        </div>


                    </form>
                </div>
            </div>

        </>
    );
};
export default SafeTransferFrom;