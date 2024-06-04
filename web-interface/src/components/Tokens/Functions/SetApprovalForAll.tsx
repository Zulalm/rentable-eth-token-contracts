interface Props {
    handleSetApprovalForAll: (operator: string, approval: boolean) => void;
}

const SetApprovalForAll: React.FC<Props> = ({ handleSetApprovalForAll }) => {

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const operator = form['operator'].value;
        const approval = form['approval'].value;
        handleSetApprovalForAll(operator, approval);

    }
    return (
        <>
            <div className="card" style={{ height: 450 , display: "block", padding: 50   }}>
                <div className="card-title">
                    Owner of
                </div>
                <div className="card-body">
                    <form>
                        <div className="col mb-3">
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="operator" name="operator" placeholder="Operator" required></input>
                                        <label htmlFor="operator" className="form-label">Operator Address</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                            <div className="form-floating">
                                        <select  className="form-select" id="approval" name="approval" required>
                                            <option  value="0">False</option>
                                            <option value="1">True</option>
                                        </select>
                                        <label htmlFor="approval" className="form-label">Approval</label>
                                    </div>
                            </div>
                            <div className="row mb-3">
                                <button type="submit" className="btn btn-primary">Set Approval for All</button>
                            </div>

                        </div>


                    </form>
                </div>
            </div>

        </>
    );
};
export default SetApprovalForAll;