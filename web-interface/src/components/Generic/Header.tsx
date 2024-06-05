import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import "../../styles/header.css";
import { useWeb3 } from '../../web3/Web3Context';
interface activePage {
    page: "Home" | "Tokens" | "Deploy";
}

const Header = forwardRef(({ page }: activePage, ref: any) => {
    const currentPage = page;

    const [walletConnected, setWalletConnected] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        reloadMenu() {
            setWalletConnected(true);
        }
    }));

    useEffect(() => {
        if(window.ethereum){
            window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
                if(accounts.length > 0){
                    setWalletConnected(true);
                }});
        }
    }, [])

    return (
        <ul className="nav justify-content-center nav-underline navbar-custom ">
            <li className="nav-item fs-6 ">
                <a className={currentPage === "Home" ? "nav-link active" : "nav-link"} aria-current="page" href="#/">Home</a>
            </li>
            <li className="nav-item fs-6">
                <a className={currentPage === "Tokens" ? "nav-link active" : "nav-link"} aria-current="page" href="#/tokens">Tokens</a>
            </li>
            {walletConnected && <li className="nav-item fs-6">
                <a className={currentPage === "Deploy" ? "nav-link active" : "nav-link"} aria-current="page" href="#/deploy">Deploy Token Contracts</a>
            </li>}
            
        </ul>
    );
});
export default Header;