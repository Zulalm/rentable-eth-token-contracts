// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyRentableToken is ERC20 {


    mapping(address account => balance) private _balances;
    uint256 private _totalSupply;

    struct balance {
        uint256 tokens;
        rentedToken[] rented;
        rentedToken[] borrowed;
    }

    struct rentedToken {
        address renterOrBorrower;
        uint256 startDate;
        uint256 endDate;
        uint256 amount;
    }


    constructor() ERC20("MyToken", "MT") {
        _mint(msg.sender,1000*10**18);
    }

    function balanceOf(address account) override public view virtual returns (uint256) {
        uint256 result = _balances[account].tokens;
        for (uint i = 0; i < _balances[account].borrowed.length; i++ ){
            if(_balances[account].borrowed[i].startDate <= block.timestamp && _balances[account].borrowed[i].endDate >= block.timestamp){
                result += _balances[account].borrowed[i].amount;
            }
        }
        for(uint i = 0; i < _balances[account].rented.length; i++ ){
            if (_balances[account].rented[i].startDate <= block.timestamp && _balances[account].rented[i].endDate >= block.timestamp ){
                result -= _balances[account].rented[i].amount;
            }
        }
        return result;
    }

    function balanceOfInterval(address account, uint256 startDate, uint256 endDate) public view virtual returns (uint256) {
        uint256 result = _balances[account].tokens;
        for (uint i = 0; i < _balances[account].borrowed.length; i++ ){
            if(_balances[account].borrowed[i].startDate <= startDate && _balances[account].borrowed[i].endDate >= endDate){
                result += _balances[account].borrowed[i].amount;
            }
        }
        for(uint i = 0; i < _balances[account].rented.length; i++ ){
            if ((_balances[account].rented[i].startDate > startDate || _balances[account].rented[i].endDate > startDate) &&
            (_balances[account].rented[i].startDate < endDate  || _balances[account].rented[i].endDate  < endDate) ){
                result -= _balances[account].rented[i].amount;
            }
        }
        return result;
    }

    function rent(address to, uint256 value, uint256 startDate, uint256 endDate) public virtual returns (bool) {
        address owner = msg.sender;

        if (balanceOfInterval(owner, startDate, endDate) < value)  {
            return false;
        }
        else if (balanceOf(owner) >= value){
            _balances[owner].rented.push(rentedToken(to, startDate,endDate,value));
            _balances[to].borrowed.push(rentedToken(owner, startDate,endDate,value));
            return true;
        }
        else{
            _balances[owner].rented.push(rentedToken(to, startDate,endDate,value));
            _balances[to].borrowed.push(rentedToken(owner, startDate,endDate,value));
            return true;
        }
    }

 function _update(address from, address to, uint256 value) override internal virtual {
        if (from == address(0)) {
            // Overflow check required: The rest of the code assumes that totalSupply never overflows
            _totalSupply += value;
        } else {
            uint256 fromBalance = _balances[from].tokens;
            if (fromBalance < value) {
                revert ERC20InsufficientBalance(from, fromBalance, value);
            }
            unchecked {
                // Overflow not possible: value <= fromBalance <= totalSupply.
                _balances[from].tokens = fromBalance - value;
            }
        }

        if (to == address(0)) {
            unchecked {
                // Overflow not possible: value <= totalSupply or value <= fromBalance <= totalSupply.
                _totalSupply -= value;
            }
        } else {
            unchecked {
                // Overflow not possible: balance + value is at most totalSupply, which we know fits into a uint256.
                _balances[to].tokens += value;
            }
        }

        emit Transfer(from, to, value);
    }


}