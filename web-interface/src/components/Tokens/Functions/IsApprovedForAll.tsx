const IsApprovedForAll = () => {
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
                                        <input type="text" className="form-control" id="owner" name="owner" placeholder="Owner Address" required></input>
                                        <label htmlFor="owner" className="form-label">Owner Address</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                            <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="operator" name="operator" placeholder="Operator" required></input>
                                        <label htmlFor="operator" className="form-label">Operator Address</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <button type="submit" className="btn btn-primary">Get Is Approved for All</button>
                            </div>

                        </div>


                    </form>
                </div>
            </div>

        </>
    );
};
export default IsApprovedForAll;