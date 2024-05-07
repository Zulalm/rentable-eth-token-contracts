// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "./RentableERC20.sol";
// import "./RentableERC1155.sol";
// import "./RentableERC721.sol";

contract RentableContractFactory {

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
        RentableERC20 erc20Contract = new RentableERC20(name,symbol,totalSupply);
        address contractAddress = address(erc20Contract);
        contracts.push(RentableTokenContract(contractAddress, name, symbol, "ERC20"));
        return contractAddress;
    } 

    // function createERC721Token(string memory name, string memory symbol) public returns(address){
    //     RentableERC721 erc721Contract = new RentableERC721(name,symbol);
    //     address contractAddress = address(erc721Contract);
    //     contracts.push(RentableTokenContract(contractAddress, name, symbol, "ERC721"));
    //     return contractAddress;
    // } 

    // function createERC1155Token(string memory uri) public returns(address){
    //     RentableERC1155 erc1155Contract = new RentableERC1155(uri);
    //     address contractAddress = address(erc1155Contract);
    //     contracts.push(RentableTokenContract(contractAddress, "", "", "ERC1155"));
    //     ERC1155uri[contractAddress] = uri;
    //     return contractAddress;
    // }
}