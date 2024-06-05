import { TokenStandard } from "../../../models/Token";
interface Props {
    tokenStandard: TokenStandard
    rent: (tokenId: string, amount: string, startDate: string, endDate: string, address: string) => void;
}

const Rent: React.FC<Props> = ({ tokenStandard , rent}) => {

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(tokenStandard === TokenStandard.ERC1155)
        {
            const form = e.currentTarget;
            const tokenId = form['tokenId'].value;
            const amount = form['amount'].value;
            const startDate = form['startDate'].value;
            const endDate = form['endDate'].value;
            const address = form['address'].value;
            rent(tokenId, amount, startDate, endDate, address);
        }else if(tokenStandard === TokenStandard.ERC20){
            const form = e.currentTarget;
            const amount = form['amount'].value;
            const startDate = form['startDate'].value;
            const endDate = form['endDate'].value;
            const address = form['address'].value;
            rent("", amount, startDate, endDate, address);
        }else if(tokenStandard === TokenStandard.ERC721){
            const form = e.currentTarget;
            const tokenId = form['tokenId'].value;
            const startDate = form['startDate'].value;
            const endDate = form['endDate'].value;
            const address = form['address'].value;
            console.log(tokenId, startDate, endDate, address);
            rent(tokenId, "", startDate, endDate, address);
        }


    }
    return (
        <>
            <div className="card" style={{ height: 450 , display: "block", padding: 50   }}>
                <div className="card-title">
                    Rent Tokens
                </div>
                <div className="card-body">
                    <form onSubmit={(e) =>{onSubmit(e)}}>
                        <div className="col mb-3">
                            {tokenStandard !== TokenStandard.ERC20 && (<div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="tokenId" name="tokenId" placeholder="Token Id" required />
                                        <label className="form-label" htmlFor="tokenId">Token ID</label>
                                    </div>
                                </div>
                            </div>)}
                            {tokenStandard !== TokenStandard.ERC721 && (<div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="amount" name="amount" placeholder="Amount" required />
                                        <label className="form-label" htmlFor="amount">Amount</label>
                                    </div>
                                </div>
                            </div>)}
                            <div className="row mb-3">
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
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="address" name="address" placeholder="Address" required></input>
                                        <label htmlFor="address" className="form-label">Address</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <button type="submit" className="btn btn-primary">Rent</button>
                            </div>

                        </div>


                    </form>
                </div>
            </div>

        </>
    );
};
export default Rent;