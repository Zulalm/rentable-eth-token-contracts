// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract RentableERC1155 is ERC1155 {

    using Arrays for uint256[];
    using Arrays for address[];

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
        uint256 tokenId;
        address account;
        uint256 renterOrBorrower;
        uint256 startDate;
        uint256 endDate;
        uint256 amount;
    }

    uint256 MAX_NO_NODES = 1000000;
    uint256 MAX_NO_RENTINGS = 1000;


    mapping(uint256 id => mapping(address account => Balance)) private _balances;
    mapping(uint256 => Node) private nodes;
    uint256 private freeListHead;

    constructor(string memory uri) ERC1155(uri) {}

    event Rent(
        address from,
        address to,
        uint256 amount,
        uint256 startDate,
        uint256 endDate,
        uint256 tokenId
    );
    event ReturnBorrowedToken(address account, uint256 amount, uint256 tokenId);
    event ReclaimRentedToken(address account, uint256 amount, uint256 tokenId);

    function balanceOf(
        address account, uint256 tokenId
    ) public view virtual override returns (uint256) {
        uint256 result = _balances[tokenId][account].tokens;
        uint256 borrowedIterator = _balances[tokenId][account].borrowedHead;
        uint256 rentedIterator = _balances[tokenId][account].rentedHead;

        while (borrowedIterator != uint256(0)) {
            RentedToken memory token = nodes[borrowedIterator].token;
            if (
                token.startDate <= block.timestamp &&
                token.endDate >= block.timestamp && token.tokenId == tokenId
            ) {
                result += token.amount;
            }
            borrowedIterator = nodes[borrowedIterator].next;
        }
        while (rentedIterator != uint256(0)) {
            RentedToken memory token = nodes[rentedIterator].token;
            if (
                token.startDate <= block.timestamp &&
                token.endDate >= block.timestamp && token.tokenId == tokenId
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
        uint256 endDate,
        uint256 tokenId
    ) public view virtual returns (uint256) {
        uint256 result = _balances[tokenId][account].tokens;
        uint256 borrowedIterator = _balances[tokenId][account].borrowedHead;
        uint256 rentedIterator = _balances[tokenId][account].rentedHead;
        while (borrowedIterator != uint256(0)) {
            RentedToken memory token = nodes[borrowedIterator].token;
            if (token.startDate <= startDate && token.endDate >= endDate && token.tokenId == tokenId) {
                result += token.amount;
            }
            borrowedIterator = nodes[borrowedIterator].next;
        }
        while (rentedIterator != uint256(0)) {
            RentedToken memory token = nodes[rentedIterator].token;
            if (
                (token.startDate > startDate || token.endDate > startDate) &&
                (token.startDate < endDate || token.endDate < endDate) &&  (token.tokenId == tokenId)
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
        uint256 endDate,
        uint256 tokenId
    ) public virtual returns (bool) {
        require(
            balanceOfInterval(owner, startDate, endDate, tokenId) >= value,
            "Renting amount exceeds the balance"
        );
        require(
            _balances[tokenId][owner].noRentedTokens < MAX_NO_RENTINGS,
            "Maximum number of renting is reached."
        );
        require(
            _balances[tokenId][to].noBorrowedTokens < MAX_NO_RENTINGS,
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
        uint256 ownerRentedHead = _balances[tokenId][owner].rentedHead;
        uint256 toBorrowedHead = _balances[tokenId][to].borrowedHead;

        _balances[tokenId][owner].rentedHead = nodeId1;
        _balances[tokenId][to].borrowedHead = nodeId2;

        nodes[nodeId1].next = ownerRentedHead;
        nodes[nodeId2].next = toBorrowedHead;

        nodes[ownerRentedHead].prev = nodeId1;
        nodes[toBorrowedHead].prev = nodeId2;

        nodes[nodeId1].token = RentedToken(
            nodeId1,
            tokenId,
            to,
            nodeId2,
            startDate,
            endDate,
            value
        );
        nodes[nodeId2].token = RentedToken(
            nodeId2,
            tokenId,
            owner,
            nodeId1,
            startDate,
            endDate,
            value
        );
        unchecked {
            _balances[tokenId][owner].noRentedTokens++;
            _balances[tokenId][to].noBorrowedTokens++;
        }

        emit Rent(owner, to, value, startDate, endDate, tokenId);
        return true;
    }


    function _update(address from, address to, uint256[] memory ids, uint256[] memory values) override internal virtual {
        if (ids.length != values.length) {
            revert ERC1155InvalidArrayLength(ids.length, values.length);
        }

        address operator = _msgSender();

        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids.unsafeMemoryAccess(i);
            uint256 value = values.unsafeMemoryAccess(i);

            if (from != address(0)) {
                uint256 fromBalance = _balances[id][from].tokens;
                if (fromBalance < value) {
                    revert ERC1155InsufficientBalance(from, fromBalance, value, id);
                }
                unchecked {
                    // Overflow not possible: value <= fromBalance
                    _balances[id][from].tokens = fromBalance - value;
                }
            }

            if (to != address(0)) {
                _balances[id][to].tokens += value;
            }
        }

        if (ids.length == 1) {
            uint256 id = ids.unsafeMemoryAccess(0);
            uint256 value = values.unsafeMemoryAccess(0);
            emit TransferSingle(operator, from, to, id, value);
        } else {
            emit TransferBatch(operator, from, to, ids, values);
        }
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
        require(block.timestamp > 0, "Invalid timestamp");

        return
            uint256(
                keccak256(abi.encodePacked(owner, block.timestamp))
            );
    }


}