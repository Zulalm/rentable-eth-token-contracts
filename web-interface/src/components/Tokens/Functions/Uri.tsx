import { useState } from "react";

interface Props {
    handleGetURI: (tokenId: string) => Promise<string>;
}

const URI : React.FC<Props> = ({handleGetURI}) => {

    const [uri, setUri] = useState<string>();
    const [showUri, setShowUri] = useState<boolean>(false);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const tokenId = form['tokenId'].value;
        const uri_ = await handleGetURI(tokenId);

        setUri(uri_)
        setShowUri(true)
    }
    return (
        <>
            <div className="card" style={{ height: 450 , display: "block", padding: 50   }}>
                <div className="card-title">
                    URI
                </div>
                <div className="card-body">
                    <form onSubmit={async (e) => {await onSubmit(e)}}>
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
                                <button type="submit" className="btn btn-primary">Get URI</button>
                            </div>

                        </div>


                    </form>
                    {showUri && <div className="alert alert-success" role="alert">
                        <p>Uri: {uri}</p>
                        </div>}
                </div>
            </div>

        </>
    );
};
export default URI;