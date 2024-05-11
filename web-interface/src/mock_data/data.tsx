import { RentedToken, Token, TokenStandard } from "../models/Token";

const mockTokens: Token[] = [
    {
        id: 1,
        name: "Token A",
        symbol: "TKA",
        amount: 1000,
        standard: TokenStandard.ERC20
    },
    {
        id: 2,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC20
    },
    {
        id: 3,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC721
    },
    {
        id: 4,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC20
    },
    {
        id: 5,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC721
    },
    {
        id: 6,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC20
    },
    {
        id: 7,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC721
    },
    {
        id: 8,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC20
    },
    {
        id: 9,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC721
    },
    {
        id: 10,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC20
    },
    {
        id: 11,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC721
    },
    {
        id: 12,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC20
    },
    {
        id: 13,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC721
    },
    {
        id: 14,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC20
    },
    {
        id: 15,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC721
    },
    {
        id: 16,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC20
    },
    {
        id: 17,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC721
    },
    {
        id: 18,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC20
    },
    {
        id: 19,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC721
    },
    {
        id: 20,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC20
    },
    {
        id: 21,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC721
    },
    {
        id: 22,
        name: "Token B",
        symbol: "TKB",
        amount: 500,
        standard: TokenStandard.ERC1155
    },
    {
        id: 23,
        name: "Token C",
        symbol: "TKC",
        amount: 200,
        standard: TokenStandard.ERC1155
    },
    {
        id: 24,
        name: "Token D",
        symbol: "TKD",
        amount: 100,
        standard: TokenStandard.ERC1155
    }
];


export const mockRentedTokens: RentedToken[] = [
    {
        id: 1,
        account: "user123",
        startDate: new Date("2024-05-01"),
        endDate: new Date("2024-05-10"),
        amount: 100,
        tokenId: 1234
    },
    {
        id: 2,
        account: "user456",
        startDate: new Date("2024-05-03"),
        endDate: new Date("2024-05-18"),
        amount: 150,
        tokenId: 5678
    },
    {
        id: 3,
        account: "user789",
        startDate: new Date("2024-05-05"),
        endDate: new Date("2024-05-20"),
        tokenId: 9012
    }
];

export default mockTokens;
