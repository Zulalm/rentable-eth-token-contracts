// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./RentableERC1155.sol";

contract RentableERC1155ContractFactory {

    struct RentableTokenContract {
        address contractAddress;
        string name;
        string symbol;
        string standard;
    }

    RentableTokenContract[] private contracts;
    mapping(address contractAddress => string uri) private ERC1155uri;

    constructor(){}

    function getRentableContracts() public view returns(RentableTokenContract[] memory) {
        return contracts;
    } 
    function createERC1155Token(string memory uri) public returns(address){
        RentableERC1155 erc1155Contract = new RentableERC1155(uri);
        address contractAddress = address(erc1155Contract);
        contracts.push(RentableTokenContract(contractAddress, "", "", "ERC1155"));
        ERC1155uri[contractAddress] = uri;
        return contractAddress;
    }
}