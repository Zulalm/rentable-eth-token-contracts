// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./RentableERC721.sol";

contract RentableERC721ContractFactory {

    struct RentableTokenContract {
        address contractAddress;
        string name;
        string symbol;
        string standard;
    }

    RentableTokenContract[] private contracts;

    constructor(){}

    function getRentableContracts() public view returns(RentableTokenContract[] memory) {
        return contracts;
    } 


    function createERC721Token(string memory name, string memory symbol) public returns(address){
        RentableERC721 erc721Contract = new RentableERC721(msg.sender,name,symbol);
        address contractAddress = address(erc721Contract);
        contracts.push(RentableTokenContract(contractAddress, name, symbol, "ERC721"));
        return contractAddress;
    } 

}