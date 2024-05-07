import { useState } from "react";
import mockTokens from "../../mock_data/data";
import { Token } from "../../models/Token";
import Footer from "../Generic/Footer";
import Header from "../Generic/Header";
import SearchToken from "./SearchToken";
import { useNavigate } from 'react-router-dom';

const Tokens = () => {
    const navigate = useNavigate();

    const onSelectToken = (token: Token) => {
        navigate(`/tokens/${token.id}`);
    }
    return (
        <>
            <Header page={"Tokens"} ></Header>
            <SearchToken tokens={mockTokens} onSelectToken={onSelectToken} ></SearchToken>

            <Footer></Footer>
        </>
    );
};
export default Tokens;

