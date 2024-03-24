// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyRentableToken is ERC20 {

    struct Node{
        RentedToken token;
        uint256 next;
        uint256 prev;
    }

    uint256 MAX_NO_NODES = 1000000;
    uint256 MAX_NO_RENTINGS = 1000;

    mapping(address account => Balance) private _balances;
    mapping(uint256 => Node) private nodes;
    uint256 private freeListHead;
    uint256 private _totalSupply;

    struct Balance {
        uint256 tokens;
        uint256 rentedHead;
        uint256 borrowedHead;
        uint256 noRentedTokens;
    }

    struct RentedToken {
        address account;
        uint256 renterOrBorrower;
        uint256 startDate;
        uint256 endDate;
        uint256 amount;
    }


    constructor() ERC20("MyToken", "MT") {
        _mint(msg.sender,1000*10**18);
    }

    function balanceOf(address account) override public view virtual returns (uint256) {
        uint256 result = _balances[account].tokens;
        uint256 borrowedIterator = _balances[account].borrowedHead;
        uint256 rentedIterator = _balances[account].rentedHead;

        while(borrowedIterator != uint256(0)){
            RentedToken memory token = nodes[borrowedIterator].token;
            if(token.startDate <= block.timestamp && token.endDate >= block.timestamp){
                result += token.amount;
            }
            borrowedIterator = nodes[borrowedIterator].next;
        }
         while(rentedIterator != uint256(0)){
            RentedToken memory token = nodes[rentedIterator].token;
            if(token.startDate <= block.timestamp && token.endDate >= block.timestamp){
                result -= token.amount;
            }
            rentedIterator = nodes[rentedIterator].next;
        }

        return result;
    }

    function balanceOfInterval(address account, uint256 startDate, uint256 endDate) public view virtual returns (uint256) {
        uint256 result = _balances[account].tokens;
        uint256 borrowedIterator = _balances[account].borrowedHead;
        uint256 rentedIterator = _balances[account].rentedHead;
        while(borrowedIterator != uint256(0)){
            RentedToken memory token = nodes[borrowedIterator].token;
            if(token.startDate <= startDate && token.endDate >= endDate){
                result += token.amount;
            }
            borrowedIterator = nodes[borrowedIterator].next;
        }
        while(rentedIterator != uint256(0)){
            RentedToken memory token = nodes[rentedIterator].token;
            if ((token.startDate > startDate || token.endDate > startDate) &&
            (token.startDate < endDate  || token.endDate  < endDate) ){
                result -= token.amount;
            }
            rentedIterator = nodes[rentedIterator].next;
        }
        return result;
    }

    function rent(address to, uint256 value, uint256 startDate, uint256 endDate) public virtual returns (bool) {
        address owner = msg.sender;

        if (balanceOfInterval(owner, startDate, endDate) < value)  {
            return false;
        }
        else if(_balances[owner].noRentedTokens == MAX_NO_RENTINGS || _balances[to].noRentedTokens == MAX_NO_RENTINGS){
            return false;
        }
        else{
            uint256 nodeId1;
            uint256 nodeId2;
            if(freeListHead != uint256(0)){
                nodeId1 = getNodeFromFreeList();
            }else{
                nodeId1 = createNewNodeId(owner);
            }
            if(freeListHead != uint256(0)){
                nodeId2 = getNodeFromFreeList();
            }else{
                nodeId2 = createNewNodeId(to);
            }
            uint256 ownerRentedHead = _balances[owner].rentedHead;
            uint256 toBorrowedHead = _balances[to].borrowedHead;

            _balances[owner].rentedHead = nodeId1;
            _balances[to].borrowedHead = nodeId2;

            nodes[nodeId1].next = ownerRentedHead;
            nodes[nodeId2].next = toBorrowedHead;

            nodes[ownerRentedHead].prev = nodeId1;
            nodes[toBorrowedHead].prev = nodeId2;

            nodes[nodeId1].token = RentedToken(to, nodeId2, startDate,endDate,value);
            nodes[nodeId2].token = RentedToken(owner, nodeId1, startDate,endDate,value);

            _balances[owner].noRentedTokens++;
            _balances[to].noRentedTokens++;

            return true;
        }
    }
    function refund() public virtual returns (bool){
        address account = msg.sender;
        bool refunded = false;
        uint256 borrowedIterator = _balances[account].borrowedHead;
        while(borrowedIterator != uint256(0)){
            RentedToken memory token = nodes[borrowedIterator].token;
            if(token.startDate < block.timestamp && token.endDate < block.timestamp){
                // token should be refunded
                refunded = true;
                uint256 prevBorrowedIterator = nodes[borrowedIterator].prev;
                if(prevBorrowedIterator == uint256(0)){
                    // refunded token was the head of the borrowed list
                    uint256 next = nodes[borrowedIterator].next;
                    addNodeToFreeList(borrowedIterator);
                    borrowedIterator = next;
                    _balances[account].borrowedHead = borrowedIterator;
                    nodes[borrowedIterator].prev = uint256(0);
                }else{
                    nodes[prevBorrowedIterator].next = nodes[borrowedIterator].next;
                    nodes[nodes[borrowedIterator].next].prev = prevBorrowedIterator;
                    addNodeToFreeList(borrowedIterator);
                    borrowedIterator = nodes[prevBorrowedIterator].next;

                }
                _balances[account].noRentedTokens--;

                //renter should get refund the token to avoid conflicts
                getRefund(token.renterOrBorrower);
            }else{
                borrowedIterator = nodes[borrowedIterator].next;
            }
            
        }
        return refunded;
    }

    function getRefund() public virtual returns (bool){
        address account = msg.sender;
        bool refunded = false;
        uint256 rentedIterator = _balances[account].rentedHead;
        while(rentedIterator != uint256(0)){
            RentedToken memory token = nodes[rentedIterator].token;
            if(token.startDate < block.timestamp && token.endDate < block.timestamp){
                // token should be refunded
                refunded = true;
                uint256 prevRentedIterator = nodes[rentedIterator].prev;
                if(prevRentedIterator == uint256(0)){
                    // refunded token was the head of the borrowed list
                    uint256 next = nodes[rentedIterator].next;
                    addNodeToFreeList(rentedIterator);
                    rentedIterator = next;
                    _balances[account].rentedHead = rentedIterator;
                    nodes[rentedIterator].prev = uint256(0);
                }else{
                    nodes[prevRentedIterator].next = nodes[rentedIterator].next;
                    nodes[nodes[rentedIterator].next].prev = prevRentedIterator;
                    addNodeToFreeList(rentedIterator);
                    rentedIterator = nodes[prevRentedIterator].next;
                }
                 _balances[account].noRentedTokens--;
                //borrower should refund the token to avoid conflicts
                refund(token.renterOrBorrower);
            }else{
                rentedIterator = nodes[rentedIterator].next;
            }
        }
        return refunded;
    }

    function refund(uint256 nodeId)  virtual internal returns (bool){
        bool refunded = false;
        RentedToken memory token = nodes[nodeId].token;
        address account = token.account;
        if(token.startDate < block.timestamp && token.endDate < block.timestamp){
                // token should be refunded
                refunded = true;
                uint256 prevBorrowedIterator = nodes[nodeId].prev;
                if(prevBorrowedIterator == uint256(0)){
                    // refunded token was the head of the borrowed list
                    uint256 next = nodes[nodeId].next;
                    addNodeToFreeList(nodeId);
                    nodeId = next;
                    _balances[account].borrowedHead = nodeId;
                    nodes[nodeId].prev = uint256(0);
                }else{
                    nodes[prevBorrowedIterator].next = nodes[nodeId].next;
                    addNodeToFreeList(nodeId);
                    nodeId = nodes[prevBorrowedIterator].next;
                }
             _balances[account].noRentedTokens--;
            }
            
        return refunded;
    }

    function getRefund(uint256 nodeId) virtual internal returns (bool){
        
        bool refunded = false;
        RentedToken memory token = nodes[nodeId].token;
        address account = token.account;
             if(token.startDate < block.timestamp && token.endDate < block.timestamp){
                // token should be refunded
                refunded = true;
                uint256 prevRentedIterator = nodes[nodeId].prev;
                if(prevRentedIterator == uint256(0)){
                    // refunded token was the head of the rented list
                    uint256 next = nodes[nodeId].next;
                    addNodeToFreeList(nodeId);
                    nodeId = next;
                    _balances[account].rentedHead = nodeId;
                    nodes[nodeId].prev = uint256(0);
                }else{
                    nodes[prevRentedIterator].next = nodes[nodeId].next;
                    addNodeToFreeList(nodeId);
                    nodeId = nodes[prevRentedIterator].next;
                }
                _balances[account].noRentedTokens--;
            }
        return refunded;
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

    function getNodeFromFreeList() internal returns(uint256 nodeId){
        uint256 next = nodes[freeListHead].next;
        nodes[freeListHead].next = uint256(0);
        nodes[freeListHead].prev = uint256(0);
        nodeId = freeListHead;
        freeListHead = next;
        nodes[freeListHead].prev = uint256(0);
        return nodeId;
    }
    function addNodeToFreeList(uint256 nodeId) internal{
        nodes[nodeId].next = freeListHead;
        nodes[nodeId].prev = uint256(0);
        nodes[freeListHead].prev = nodeId;
        freeListHead = nodeId;
    }

    function createNewNodeId(address owner) internal view returns(uint256){
        require(owner != address(0), "Invalid owner address");
        require(bytes(this.name()).length > 0, "Token name must not be empty");
        require(block.timestamp > 0, "Invalid timestamp");

        return uint256(keccak256(abi.encodePacked(owner, this.name(), block.timestamp)));
    }

}