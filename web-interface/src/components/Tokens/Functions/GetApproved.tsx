const GetApproved = () => {
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
                                        <input type="text" className="form-control" id="tokenId" name="tokenId" placeholder="Token ID" required></input>
                                        <label htmlFor="tokenId" className="form-label">Token ID</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <button type="submit" className="btn btn-primary">Get Approved</button>
                            </div>

                        </div>


                    </form>
                </div>
            </div>

        </>
    );
};
export default GetApproved;