// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RentableERC20 is ERC20 {
    struct Balance {
        uint256 tokens;
        uint256 rentedHead;
        uint256 borrowedHead;
        uint256 noRentedTokens;
        uint256 noBorrowedTokens;
    }
    struct Node {
        RentedToken token;
        uint256 next;
        uint256 prev;
    }

    struct RentedToken {
        uint256 nodeId;
        address account;
        uint256 renterOrBorrower;
        uint256 startDate;
        uint256 endDate;
        uint256 amount;
    }

    uint256 MAX_NO_NODES = 1000000;
    uint256 MAX_NO_RENTINGS = 1000;

    mapping(address account => Balance) private _balances;
    mapping(uint256 => Node) private nodes;
    uint256 private freeListHead;
    uint256 private _totalSupply;

    constructor(
        address owner,
        string memory name,
        string memory symbol,
        uint256 __totalSupply
    ) ERC20(name, symbol) {
        __mint(owner, __totalSupply);
    }

    event Rent(
        address from,
        address to,
        uint256 amount,
        uint256 startDate,
        uint256 endDate
    );

    event ReturnBorrowedToken(address account, uint256 amount);
    event ReclaimRentedToken(address account, uint256 amount);

    function balanceOf(
        address account
    ) public view virtual override returns (uint256) {
        uint256 result = _balances[account].tokens;
        uint256 borrowedIterator = _balances[account].borrowedHead;
        uint256 rentedIterator = _balances[account].rentedHead;

        while (borrowedIterator != uint256(0)) {
            RentedToken memory token = nodes[borrowedIterator].token;
            if (
                token.startDate <= block.timestamp &&
                token.endDate >= block.timestamp
            ) {
                result += token.amount;
            }
            borrowedIterator = nodes[borrowedIterator].next;
        }
        while (rentedIterator != uint256(0)) {
            RentedToken memory token = nodes[rentedIterator].token;
            if (
                token.startDate <= block.timestamp &&
                token.endDate >= block.timestamp
            ) {
                result -= token.amount;
            }
            rentedIterator = nodes[rentedIterator].next;
        }

        return result;
    }

    function balanceOfInterval(
        address account,
        uint256 startDate,
        uint256 endDate
    ) public view virtual returns (uint256) {
        uint256 result = _balances[account].tokens;
        uint256 borrowedIterator = _balances[account].borrowedHead;
        uint256 rentedIterator = _balances[account].rentedHead;
        while (borrowedIterator != uint256(0)) {
            RentedToken memory token = nodes[borrowedIterator].token;
            if (token.startDate <= startDate && token.endDate >= endDate) {
                result += token.amount;
            }
            borrowedIterator = nodes[borrowedIterator].next;
        }
        while (rentedIterator != uint256(0)) {
            RentedToken memory token = nodes[rentedIterator].token;
            if (
                (token.startDate > startDate || token.endDate > startDate) &&
                (token.startDate < endDate || token.endDate < endDate)
            ) {
                result -= token.amount;
            }
            rentedIterator = nodes[rentedIterator].next;
        }
        return result;
    }

    function rent(
        address owner,
        address to,
        uint256 value,
        uint256 startDate,
        uint256 endDate
    ) public virtual returns (bool) {
        require(
            balanceOfInterval(owner, startDate, endDate) >= value,
            "Renting amount exceeds the balance"
        );
        require(
            _balances[owner].noRentedTokens < MAX_NO_RENTINGS,
            "Maximum number of renting is reached."
        );
        require(
            _balances[to].noBorrowedTokens < MAX_NO_RENTINGS,
            "Maximum number of borrowing is reached."
        );
        uint256 nodeId1;
        uint256 nodeId2;
        if (freeListHead != uint256(0)) {
            nodeId1 = getNodeFromFreeList();
        } else {
            nodeId1 = createNewNodeId(owner);
        }
        if (freeListHead != uint256(0)) {
            nodeId2 = getNodeFromFreeList();
        } else {
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

        nodes[nodeId1].token = RentedToken(
            nodeId1,
            to,
            nodeId2,
            startDate,
            endDate,
            value
        );
        nodes[nodeId2].token = RentedToken(
            nodeId2,
            owner,
            nodeId1,
            startDate,
            endDate,
            value
        );
        unchecked {
            _balances[owner].noRentedTokens++;
            _balances[to].noBorrowedTokens++;
        }

        emit Rent(owner, to, value, startDate, endDate);
        return true;
    }

    function returnBorrowedToken(address account, uint256 nodeId) public virtual {
        RentedToken memory token = nodes[nodeId].token;
        require(
            token.endDate < block.timestamp,
            "Token cannot be returned yet"
        );
        // token should be returned
        uint256 prevBorrowedIterator = nodes[nodeId].prev;
        if (prevBorrowedIterator == uint256(0)) {
            // returned token was the head of the borrowed list
            uint256 next = nodes[nodeId].next;
            addNodeToFreeList(nodeId);
            nodeId = next;
            _balances[account].borrowedHead = nodeId;
            nodes[nodeId].prev = uint256(0);
        } else {
            nodes[prevBorrowedIterator].next = nodes[nodeId].next;
            addNodeToFreeList(nodeId);
            nodeId = nodes[prevBorrowedIterator].next;
        }
        unchecked {
            _balances[account].noBorrowedTokens--;
        }
        emit ReturnBorrowedToken(account, token.amount);
        //renter should  reclaim the token to avoid conflicts

        forceReclaimRentedToken(token.renterOrBorrower, token.account);
    }

    function reclaimRentedToken(address account, uint256 nodeId) public virtual {
        RentedToken memory token = nodes[nodeId].token;
        require(
            token.nodeId == nodeId,
            "Token is not initialized properly"
        );

        string memory message = string(abi.encodePacked("Token cannot be reclaimed yet: ", uintToString(token.endDate), " ", uintToString(block.timestamp)));

        require(
            token.endDate < block.timestamp,
            message
        );
        // token should be returned
        uint256 prevIndex = nodes[nodeId].prev;
        if (prevIndex == uint256(0)) {
            // returned token was the head of the rented list
            uint256 next = nodes[nodeId].next;
            addNodeToFreeList(nodeId);
            nodeId = next;
            _balances[account].rentedHead = nodeId;
            nodes[nodeId].prev = uint256(0);
        } else {
            nodes[prevIndex].next = nodes[nodeId].next;
            addNodeToFreeList(nodeId);
            nodeId = nodes[prevIndex].next;
        }
        unchecked {
            _balances[account].noRentedTokens--;
        }

        emit ReclaimRentedToken(account, token.amount);
        //borrower should return the token to avoid conflicts
        forceReturnBorrowedToken(token.renterOrBorrower, token.account);
    }
    function uintToString(uint256 value) internal pure returns (string memory) {
    // Convert value to string
    if (value == 0) {
        return "0";
    }
    
    uint256 temp = value;
    uint256 digits;
    
    while (temp != 0) {
        digits++;
        temp /= 10;
    }
    
    bytes memory buffer = new bytes(digits);
    
    while (value != 0) {
        digits -= 1;
        buffer[digits] = bytes1(uint8(48 + value % 10));
        value /= 10;
    }
    
    return string(buffer);
}

    function forceReturnBorrowedToken(
        uint256 nodeId,
        address account
    ) internal virtual {
        RentedToken memory token = nodes[nodeId].token;
        if (token.endDate < block.timestamp) {
            // token should be returned
            uint256 prevBorrowedIterator = nodes[nodeId].prev;
            if (prevBorrowedIterator == uint256(0)) {
                // returned token was the head of the borrowed list
                uint256 next = nodes[nodeId].next;
                addNodeToFreeList(nodeId);
                nodeId = next;
                _balances[account].borrowedHead = nodeId;
                nodes[nodeId].prev = uint256(0);
            } else {
                nodes[prevBorrowedIterator].next = nodes[nodeId].next;
                addNodeToFreeList(nodeId);
                nodeId = nodes[prevBorrowedIterator].next;
            }
            unchecked {
                _balances[account].noBorrowedTokens--;
            }
            emit ReturnBorrowedToken(account, token.amount);
        }
    }

    function forceReclaimRentedToken(
        uint256 nodeId,
        address account
    ) internal virtual {
        RentedToken memory token = nodes[nodeId].token;
        if (token.endDate < block.timestamp) {
            // token should be returned
            uint256 prevRentedIterator = nodes[nodeId].prev;
            if (prevRentedIterator == uint256(0)) {
                // returned token was the head of the rented list
                uint256 next = nodes[nodeId].next;
                addNodeToFreeList(nodeId);
                nodeId = next;
                _balances[account].rentedHead = nodeId;
                nodes[nodeId].prev = uint256(0);
            } else {
                nodes[prevRentedIterator].next = nodes[nodeId].next;
                addNodeToFreeList(nodeId);
                nodeId = nodes[prevRentedIterator].next;
            }
            unchecked {
                _balances[account].noRentedTokens--;
            }

            emit ReclaimRentedToken(account, token.amount);
        }
    }

    function __mint(address account, uint256 value) internal {
        if (account == address(0)) {
            revert ERC20InvalidReceiver(address(0));
        }
        _update(address(0), account, value);
    }

    function getRentedTokens(address account) public view returns (RentedToken[] memory) {
        uint256 noNodes = _balances[account].noRentedTokens;
        RentedToken[] memory tokens = new RentedToken[](noNodes);
        uint256 nodeId = _balances[account].rentedHead;

        for (uint256 i = 0; i < noNodes; i++) {
            tokens[i] = RentedToken({
                nodeId: nodes[nodeId].token.nodeId,
                account: nodes[nodeId].token.account,
                renterOrBorrower: nodes[nodeId].token.renterOrBorrower,
                startDate: nodes[nodeId].token.startDate,
                endDate: nodes[nodeId].token.endDate,
                amount: nodes[nodeId].token.amount
            });
            nodeId = nodes[nodeId].next;
        }
        return tokens;
    }

    function getNoRentedTokens(address account) public view returns (uint256) {
        return _balances[account].noRentedTokens;
    }

    function getBorrowedTokens(address account) public view returns (RentedToken[] memory) {
        uint256 noNodes = _balances[account].noBorrowedTokens;
        RentedToken[] memory tokens = new RentedToken[](noNodes);
        uint256 nodeId = _balances[account].borrowedHead;

        for (uint256 i = 0; i < noNodes; i++) {
            tokens[i] = RentedToken({
                nodeId: nodes[nodeId].token.nodeId,
                account: nodes[nodeId].token.account,
                renterOrBorrower: nodes[nodeId].token.renterOrBorrower,
                startDate: nodes[nodeId].token.startDate,
                endDate: nodes[nodeId].token.endDate,
                amount: nodes[nodeId].token.amount
            });
            nodeId = nodes[nodeId].next;
        }
        return tokens;
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
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

    function getNodeFromFreeList() internal returns (uint256 nodeId) {
        uint256 next = nodes[freeListHead].next;
        nodes[freeListHead].next = uint256(0);
        nodes[freeListHead].prev = uint256(0);
        nodeId = freeListHead;
        freeListHead = next;
        nodes[freeListHead].prev = uint256(0);
        return nodeId;
    }

    function addNodeToFreeList(uint256 nodeId) internal {
        nodes[nodeId].next = freeListHead;
        nodes[nodeId].prev = uint256(0);
        nodes[freeListHead].prev = nodeId;
        freeListHead = nodeId;
    }

    function createNewNodeId(address owner) internal view returns (uint256) {
        require(owner != address(0), "Invalid owner address");
        require(bytes(this.name()).length > 0, "Token name must not be empty");
        require(block.timestamp > 0, "Invalid timestamp");

        return
            uint256(
                keccak256(abi.encodePacked(owner, this.name(), block.timestamp))
            );
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
}
