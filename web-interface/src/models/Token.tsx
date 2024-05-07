interface Token {
    id: number;
    name: string;
    symbol: string;
    amount: number;
    standard: "ERC20" | "ERC721" | "ERC1155";
}

export type { Token } 