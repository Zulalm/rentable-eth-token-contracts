// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./RentableERC1155.sol";

contract RentableERC1155ContractFactory {
    struct RentableERC1155Struct{
        address contractAddress;
        string uri;
    }

    RentableERC1155Struct[] private contracts;

    constructor(){}

    function getRentableContracts() public view returns(RentableERC1155Struct[] memory) {
        return contracts;
    } 
    function createERC1155Token(string memory uri) public returns(address){
        RentableERC1155 erc1155Contract = new RentableERC1155(uri);
        address contractAddress = address(erc1155Contract);
        contracts.push(RentableERC1155Struct(contractAddress,uri));
        return contractAddress;
    }
}