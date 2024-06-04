import { useState } from "react";

interface Props {
    handleMint: (tokenId: string) => Promise<string>;
}

const Mint : React.FC<Props> = ({handleMint}) => {

    const [tokenId, setTokenId] = useState<string>();
    const [showTokenId, setShowTokenId] = useState<boolean>(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const to = form['to'].value;
        const tokenId = await handleMint(to);
        setTokenId(tokenId)
        setShowTokenId(true)
    }
    return (
        <>
            <div className="card" style={{ height: 450 , display: "block", padding: 50   }}>
                <div className="card-title">
                    Mint
                </div>
                <div className="card-body">
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="col mb-3">
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="form-floating">
                                        <input type="text" className="form-control" id="to" name="to" placeholder="To" required></input>
                                        <label htmlFor="to" className="form-label">To</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <button type="submit" className="btn btn-primary">Mint</button>
                            </div>

                        </div>


                    </form>
                    {showTokenId && <div className="alert alert-success" role="alert">
                        <p>TokenId: {tokenId}</p>
                        </div>}
                </div>
            </div>

        </>
    );
};
export default Mint;