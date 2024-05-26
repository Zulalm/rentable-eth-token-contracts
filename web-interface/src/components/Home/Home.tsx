import { useEffect, useRef, useState } from "react";
import Footer from "../Generic/Footer";
import Header from "../Generic/Header";
import { useWeb3 } from "../../web3/Web3Context";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const [account, setAccount] = useState<string>('');
    const [contractData, setContractData] = useState<string>('');

    const headerRef = useRef();
    const { web3 } = useWeb3();
    const navigate = useNavigate();


    const [walletConnected, setWalletConnected] = useState<boolean>(false);

    const onSelectTokens = () => {
        navigate(`/tokens`);
    }
    const onSelectDeployTokens = () => {
        navigate(`/tokens`);
    }

    const connectMetamask = () => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: string[]) => {
                if (accounts.length > 0) {
                    setWalletConnected(true)
                    setAccount(accounts[0]);
                }
            });
            //@ts-ignore
            headerRef.current.reloadMenu();
        } else {
            alert('Please download metamask');
        }
    }

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setWalletConnected(true);
                }
            });
        }
    }, [])
    return (

        <>
            <Header page={"Home"} ref={headerRef}></Header>
            <div className="col card" >
                <div className="row mb-3 mt-5">
                    {!walletConnected && <p className="h1">Connect your wallet to start renting!</p>}
                </div>
                <div className="row mb-3">
                    {!walletConnected ? (
                        <button className="btn btn-primary" onClick={(e) => { connectMetamask() }}>Connect Wallet</button>
                    ) : (
                        <div className="col">
                            <p>Wallet Connected!</p>
                            <div className="row mb-3">

                                <button className="btn btn-primary" onClick={(e) => { navigate(`/tokens`); }}>View Tokens</button>
                            </div>
                            <div className="row mb-3">
                                <button className="btn btn-primary" onClick={(e) => { navigate(`/deploy`); }}>Deploy New Contracts</button>
                            </div>
                        </div>

                    )}
                </div>
                <div className="row mb-3">
                    <img
                        style={{ width: 500 }}
                        src="https://img.freepik.com/free-psd/3d-nft-icon-chain_629802-28.jpg?t=st=1716622393~exp=1716625993~hmac=a2d01bf866bce0427469a3e57b55c3e818d3a4f96ac660d97cd89e8e3482906a&w=1480"
                        alt="Connected Illustration"
                        className="connected-img"
                    />
                </div>

            </div>

            <Footer></Footer>
        </>
    );
};
export default Home;