import { useState } from "react";
import { TokenStandard } from "../../../models/Token";
interface Props {
    tokenStandard: TokenStandard
    balance: (address: string, startDate: string, endDate: string) => void;
}

const BalanceOf: React.FC<Props> = ({ tokenStandard, balance }) => {

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (isChecked) {
            const address = form['address'].value;
            const startDate = form['startDate'].value;
            const endDate = form['endDate'].value;
            balance(address, startDate, endDate);
        } else {
            const address = form['address'].value;
            balance(address, "", "");
        }


    }

    const [isChecked, setIsChecked] = useState<boolean>(false);
    return (
        <>
            <div className="card card" style={{ height: 450, display: "block", padding: 50 }}>
                <div className="card-title">
                    Balance
                </div>
                <div className="card-body">
                    <form onSubmit={(e) => { onSubmit(e) }}>
                        <div className="col mb-3">
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" id="balanceType" name="balanceType" value="" checked={isChecked}
                                            onChange={() => setIsChecked(!isChecked)} />
                                        <label className="form-label" htmlFor="balanceType">Balance of Interval</label>
                                    </div>
                                </div>
                            </div>
                            {isChecked && (<div className="row mb-3">
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
                            </div>)}
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="address" name="address" placeholder="Address" required></input>
                                        <label htmlFor="address" className="form-label">Address</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <button type="submit" className="btn btn-primary">Get Balance</button>
                        </div>
                    </form>
                </div>
            </div>

        </>
    );
};
export default BalanceOf;