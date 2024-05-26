// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./RentableERC20.sol";

contract RentableERC20ContractFactory {

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

    function createERC20Token(string memory name, string memory symbol, uint256 totalSupply) public returns(address){
        RentableERC20 erc20Contract = new RentableERC20(msg.sender, name,symbol,totalSupply);
        address contractAddress = address(erc20Contract);
        contracts.push(RentableTokenContract(contractAddress, name, symbol, "ERC20"));
        return contractAddress;
    } 
}