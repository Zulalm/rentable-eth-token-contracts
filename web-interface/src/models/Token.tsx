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
    uri?: string;
}

export interface RentedToken {
    id: string;
    account: string;
    startDate: Date;
    endDate: Date;
    amount?: number;
    tokenId?: number;
}