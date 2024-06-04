import { useState } from "react";
interface Props {
    handleAllowance: (owner: string, spender: string) => void;
}

const Allowance: React.FC<Props> = ({handleAllowance }) => {

    const [allowed, setAllowed] = useState<boolean>(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const owner = form['owner'].value;
        const spender = form['spender'].value;
        handleAllowance(owner, spender);
        setAllowed(true);
    }   
    return (
        <>
            <div className="card card" style={{ height: 450, display: "block", padding: 50 }}>
                <div className="card-title">
                    Allowance
                </div>
                <div className="card-body">
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="col mb-3">
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="owner" name="owner" placeholder="Owner" required></input>
                                        <label htmlFor="owner" className="form-label">Owner</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="spender" name="spender" placeholder="Spender" required></input>
                                        <label htmlFor="spender" className="form-label">Spender</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <button type="submit" className="btn btn-primary">Allow</button>
                        </div>
                    </form>
                    {allowed && <div className="alert alert-success" role="alert">
                        Allowance granted successfully!
                    </div>}
                </div>
            </div>

        </>
    );
};
export default Allowance;