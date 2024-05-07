import React from 'react';
import "../../styles/header.css";
interface activePage {
    page: "Home" | "Tokens" | "Deploy";
}

const Header = ({ page }: activePage) => {
    const currentPage = page;
    return (
        <ul className="nav justify-content-center nav-underline navbar-custom ">
            <li className="nav-item fs-6 ">
                <a className={currentPage === "Home" ? "nav-link active" : "nav-link"} aria-current="page" href="/">Home</a>
            </li>
            <li className="nav-item fs-6">
                <a className={currentPage === "Tokens" ? "nav-link active" : "nav-link"} aria-current="page" href="/tokens">Tokens</a>
            </li>
            <li className="nav-item fs-6">
                <a className={currentPage === "Deploy" ? "nav-link active" : "nav-link"} aria-current="page" href="/deploy">Deploy Token Contracts</a>
            </li>
        </ul>
    );
};
export default Header;