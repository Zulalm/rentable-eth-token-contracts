const Rent = () => {
    return (
        <>
            <div className="card card-custom">
                <div className="card-title">
                    Rent Tokens
                </div>
                <div className="card-body">
                    <form>
                        <div className="col">
                            <div className="row">
                                <label htmlFor="amount" className="form-label">Amount</label>
                                <input type="text" className="form-control" id="amount" name="amount" />
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label htmlFor="startDate" className="form-label">Start Date</label>
                                    <input type="date" className="form-control" id="startDate" name="startDate" />
                                </div>
                                <div className="col">
                                    <label htmlFor="endDate" className="form-label">End Date</label>
                                    <input type="date" className="form-control" id="endDate" name="endDate" />
                                </div>

                            </div>
                            <div className="row">
                                <label htmlFor="address" className="form-label">Address</label>
                                <input className="form-control" id="address" name="address"></input>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">Rent</button>
                    </form>
                </div>
            </div>

        </>
    );
};
export default Rent;