import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Token, TokenStandard } from '../../models/Token';

interface TokenContextType {
    token: Token;
    updateToken: (newToken: Token) => void;
}   

const TokenContext = createContext<TokenContextType | null>(null);

const TokenProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [token, setToken] = useState<Token>({
        address: "",
        name: '',
        symbol: '',
        amount: 0,
        standard: TokenStandard.ERC20,
    });

    const updateToken = (newToken: Token) => {
        setToken(newToken);
    };
    return (
            <TokenContext.Provider value={{token, updateToken}}>
                {children}
            </TokenContext.Provider>
    );
};

export const useToken = () => {
    const context = useContext(TokenContext);
    if (context === undefined) {
        throw new Error('useToken must be used within a TokenProvider');
    }
    return context;
}

export { TokenContext, TokenProvider };