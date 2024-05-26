export enum TokenStandard {
    ERC20,
    ERC721,
    ERC1155,
}

export interface Token {
    address: string;
    name: string;
    symbol: string;
    amount: number;
    standard: TokenStandard;
}

export interface RentedToken {
    id: number;
    account: string;
    startDate: Date;
    endDate: Date;
    amount?: number;
    tokenId?: number;
}