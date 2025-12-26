// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SupplyChain {
    enum UserStatus { Pending, Approved, Rejected, Canceled }
    enum TransferStatus { Pending, Accepted, Rejected }

    struct Token {
        uint256 id;
        address creator;
        string name;
        uint256 totalSupply;
        string features;
        uint256 parentId;
        uint256 dateCreated;
    }

    struct Transfer {
        uint256 id;
        address from;
        address to;
        uint256 tokenId;
        uint256 dateCreated;
        uint256 amount;
        TransferStatus status;
    }

    struct User {
        uint256 id;
        address userAddress;
        string role;
        UserStatus status;
    }

    address public admin;

    uint256 public nextTokenId = 1;
    uint256 public nextTransferId = 1;
    uint256 public nextUserId = 1;

    mapping(uint256 => Token) public tokens;
    mapping(uint256 => Transfer) public transfers;
    mapping(uint256 => User) public users;
    mapping(address => uint256) public addressToUserId;
    mapping(uint256 => mapping(address => uint256)) private balances;

    event TokenCreated(uint256 indexed tokenId, address indexed creator, string name, uint256 totalSupply);
    event TransferRequested(uint256 indexed transferId, address indexed from, address indexed to, uint256 tokenId, uint256 amount);
    event TransferAccepted(uint256 indexed transferId);
    event TransferRejected(uint256 indexed transferId);
    event UserRoleRequested(address indexed user, string role);
    event UserStatusChanged(address indexed user, UserStatus status);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function requestUserRole(string memory role) public {
        require(addressToUserId[msg.sender] == 0, "User already requested");

        uint256 id = nextUserId++;
        users[id] = User({id: id, userAddress: msg.sender, role: role, status: UserStatus.Pending});
        addressToUserId[msg.sender] = id;

        emit UserRoleRequested(msg.sender, role);
    }

    function changeStatusUser(address userAddress, UserStatus newStatus) public onlyAdmin {
        uint256 id = addressToUserId[userAddress];
        require(id != 0, "User not found");

        users[id].status = newStatus;
        emit UserStatusChanged(userAddress, newStatus);
    }

    // Función para que el admin registre directamente un usuario (incluyendo otros admins)
    function registerUserByAdmin(
        address userAddress, 
        string memory role, 
        UserStatus status
    ) public onlyAdmin {
        require(userAddress != address(0), "Invalid address");
        require(addressToUserId[userAddress] == 0, "User already registered");

        uint256 id = nextUserId++;
        users[id] = User({
            id: id,
            userAddress: userAddress,
            role: role,
            status: status
        });
        addressToUserId[userAddress] = id;

        emit UserRoleRequested(userAddress, role);
        if (status != UserStatus.Pending) {
            emit UserStatusChanged(userAddress, status);
        }
    }

    function getUserInfo(address userAddress) public view returns (User memory) {
        uint256 id = addressToUserId[userAddress];
        require(id != 0, "User not found");
        return users[id];
    }

    function isAdmin(address userAddress) public view returns (bool) {
        return userAddress == admin;
    }

    function createToken(string memory name, uint256 totalSupply, string memory features, uint256 parentId) public returns (uint256) {
        uint256 uid = addressToUserId[msg.sender];
        require(uid != 0, "User not registered");
        require(users[uid].status == UserStatus.Approved, "User not approved");

        uint256 tokenId = nextTokenId++;
        tokens[tokenId] = Token({
            id: tokenId,
            creator: msg.sender,
            name: name,
            totalSupply: totalSupply,
            features: features,
            parentId: parentId,
            dateCreated: block.timestamp
        });

        balances[tokenId][msg.sender] = totalSupply;

        emit TokenCreated(tokenId, msg.sender, name, totalSupply);
        return tokenId;
    }

    function getToken(uint256 tokenId) public view returns (Token memory) {
        require(tokens[tokenId].id != 0, "Token not found");
        return tokens[tokenId];
    }

    function getTokenBalance(uint256 tokenId, address userAddress) public view returns (uint256) {
        return balances[tokenId][userAddress];
    }

    function transfer(address to, uint256 tokenId, uint256 amount) public returns (uint256) {
        require(to != msg.sender, "Cannot transfer to self");
        require(tokens[tokenId].id != 0, "Token not found");
        require(amount > 0, "Amount must be > 0");

        uint256 senderBalance = balances[tokenId][msg.sender];
        require(senderBalance >= amount, "Insufficient balance");

        uint256 tid = nextTransferId++;
        transfers[tid] = Transfer({
            id: tid,
            from: msg.sender,
            to: to,
            tokenId: tokenId,
            dateCreated: block.timestamp,
            amount: amount,
            status: TransferStatus.Pending
        });

        // reserve tokens until acceptance
        balances[tokenId][msg.sender] = senderBalance - amount;

        emit TransferRequested(tid, msg.sender, to, tokenId, amount);
        return tid;
    }

    function acceptTransfer(uint256 transferId) public {
        Transfer storage t = transfers[transferId];
        require(t.id != 0, "Transfer not found");
        require(t.to == msg.sender, "Only recipient can accept");
        require(t.status == TransferStatus.Pending, "Transfer not pending");

        balances[t.tokenId][t.to] += t.amount;
        t.status = TransferStatus.Accepted;

        emit TransferAccepted(transferId);
    }

    function rejectTransfer(uint256 transferId) public {
        Transfer storage t = transfers[transferId];
        require(t.id != 0, "Transfer not found");
        require(t.to == msg.sender, "Only recipient can reject");
        require(t.status == TransferStatus.Pending, "Transfer not pending");

        // return reserved amount to sender
        balances[t.tokenId][t.from] += t.amount;
        t.status = TransferStatus.Rejected;

        emit TransferRejected(transferId);
    }

    function getTransfer(uint256 transferId) public view returns (Transfer memory) {
        require(transfers[transferId].id != 0, "Transfer not found");
        return transfers[transferId];
    }

    function getUserTokens(address userAddress) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextTokenId; i++) {
            if (balances[i][userAddress] > 0) count++;
        }

        uint256[] memory list = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i < nextTokenId; i++) {
            if (balances[i][userAddress] > 0) {
                list[idx++] = i;
            }
        }
        return list;
    }

    function getUserTransfers(address userAddress) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextTransferId; i++) {
            if (transfers[i].from == userAddress || transfers[i].to == userAddress) count++;
        }

        uint256[] memory list = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i < nextTransferId; i++) {
            if (transfers[i].from == userAddress || transfers[i].to == userAddress) {
                list[idx++] = i;
            }
        }
        return list;
    }
}
