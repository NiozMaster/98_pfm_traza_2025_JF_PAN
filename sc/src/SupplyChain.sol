// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Interfaz ERC165 para verificación de interfaces
interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

contract SupplyChain is IERC165 {
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

    // Estructura para almacenar actividades/historial
    enum ActivityType {
        TokenCreated,
        TransferRequested,
        TransferAccepted,
        TransferRejected,
        UserRoleRequested,
        UserStatusChanged,
        UserRegisteredByAdmin,
        BatchEvent
    }

    struct Activity {
        uint256 id;
        ActivityType activityType;
        address actor;          // Usuario que realizó la acción
        uint256 timestamp;
        uint256 relatedId;      // ID relacionado (tokenId, transferId, userId, etc.)
        string description;     // Descripción legible de la actividad
        bytes data;             // Datos adicionales en formato JSON (opcional)
    }

    address public admin;

    uint256 public nextTokenId = 1;
    uint256 public nextTransferId = 1;
    uint256 public nextUserId = 1;
    uint256 public nextActivityId = 1;

    mapping(uint256 => Token) public tokens;
    mapping(uint256 => Transfer) public transfers;
    mapping(uint256 => User) public users;
    mapping(address => uint256) public addressToUserId;
    mapping(uint256 => mapping(address => uint256)) private balances;
    mapping(uint256 => Activity) public activities;  // Almacenamiento de actividades

    event TokenCreated(uint256 indexed tokenId, address indexed creator, string name, uint256 totalSupply);
    event TransferRequested(uint256 indexed transferId, address indexed from, address indexed to, uint256 tokenId, uint256 amount);
    event TransferAccepted(uint256 indexed transferId);
    event TransferRejected(uint256 indexed transferId);
    event UserRoleRequested(address indexed user, string role);
    event UserStatusChanged(address indexed user, UserStatus status);
    event ActivityRecorded(uint256 indexed activityId, ActivityType indexed activityType, address indexed actor, uint256 timestamp);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        _onlyAdmin();
        _;
    }

    function _onlyAdmin() internal view {
        require(msg.sender == admin, "Only admin");
    }

    // Función interna para registrar actividades
    function _recordActivity(
        ActivityType activityType,
        address actor,
        uint256 relatedId,
        string memory description
    ) internal {
        uint256 activityId = nextActivityId++;
        activities[activityId] = Activity({
            id: activityId,
            activityType: activityType,
            actor: actor,
            timestamp: block.timestamp,
            relatedId: relatedId,
            description: description,
            data: bytes("")
        });
        emit ActivityRecorded(activityId, activityType, actor, block.timestamp);
    }

    function requestUserRole(string memory role) public {
        require(addressToUserId[msg.sender] == 0, "User already requested");

        uint256 id = nextUserId++;
        users[id] = User({id: id, userAddress: msg.sender, role: role, status: UserStatus.Pending});
        addressToUserId[msg.sender] = id;

        emit UserRoleRequested(msg.sender, role);
        
        // Registrar actividad
        _recordActivity(ActivityType.UserRoleRequested, msg.sender, id, role);
    }

    function changeStatusUser(address userAddress, UserStatus newStatus) public onlyAdmin {
        uint256 id = addressToUserId[userAddress];
        require(id != 0, "User not found");

        users[id].status = newStatus;
        emit UserStatusChanged(userAddress, newStatus);
        
        // Registrar actividad (usar número de estado en lugar de texto para ahorrar espacio)
        string memory statusNum = _uint2str(uint256(newStatus));
        _recordActivity(ActivityType.UserStatusChanged, msg.sender, id, statusNum);
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
        
        // Registrar actividad (usar formato compacto)
        string memory statusNum = _uint2str(uint256(status));
        string memory desc = string(abi.encodePacked(role, ":", statusNum));
        _recordActivity(ActivityType.UserRegisteredByAdmin, msg.sender, id, desc);
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
        
        // Registrar actividad (descripción simplificada para ahorrar gas)
        _recordActivity(ActivityType.TokenCreated, msg.sender, tokenId, name);
        
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
        
        // Registrar actividad
        _recordActivity(ActivityType.TransferRequested, msg.sender, tid, "");
        
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
        
        // Registrar actividad
        _recordActivity(ActivityType.TransferAccepted, msg.sender, transferId, "");
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
        
        // Registrar actividad
        _recordActivity(ActivityType.TransferRejected, msg.sender, transferId, "");
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

    // Nueva función para obtener tokens creados por un usuario
    function getTokensByCreator(address creatorAddress) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextTokenId; i++) {
            if (tokens[i].id != 0 && tokens[i].creator == creatorAddress) {
                count++;
            }
        }

        uint256[] memory list = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i < nextTokenId; i++) {
            if (tokens[i].id != 0 && tokens[i].creator == creatorAddress) {
                list[idx++] = i;
            }
        }
        return list;
    }

    // Función para obtener todos los tokens de un usuario (con balance O creados por él)
    function getAllUserTokens(address userAddress) public view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Contar tokens: con balance O creados por el usuario
        for (uint256 i = 1; i < nextTokenId; i++) {
            if (tokens[i].id != 0) {
                if (balances[i][userAddress] > 0 || tokens[i].creator == userAddress) {
                    count++;
                }
            }
        }

        uint256[] memory list = new uint256[](count);
        uint256 idx = 0;
        
        // Agregar tokens que cumplan la condición
        for (uint256 i = 1; i < nextTokenId; i++) {
            if (tokens[i].id != 0) {
                if (balances[i][userAddress] > 0 || tokens[i].creator == userAddress) {
                    list[idx++] = i;
                }
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

    // Función para obtener el total de tokens (lotes) creados
    function getTotalTokens() public view returns (uint256) {
        // nextTokenId es el siguiente ID disponible, así que el total es nextTokenId - 1
        return nextTokenId > 1 ? nextTokenId - 1 : 0;
    }

    // Función para obtener transfers pendientes de un usuario
    function getPendingTransfers(address userAddress) public view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i < nextTransferId; i++) {
            if (transfers[i].status == TransferStatus.Pending && 
                (transfers[i].from == userAddress || transfers[i].to == userAddress)) {
                count++;
            }
        }

        uint256[] memory list = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i < nextTransferId; i++) {
            if (transfers[i].status == TransferStatus.Pending && 
                (transfers[i].from == userAddress || transfers[i].to == userAddress)) {
                list[idx++] = i;
            }
        }
        return list;
    }

    // Función para contar tokens válidos (simplificada: usa getTotalTokens)
    function getValidTokensCount() public view returns (uint256) {
        return getTotalTokens();
    }

    // Función para obtener todos los usuarios registrados
    function getAllUsers() public view returns (User[] memory) {
        uint256 count = 0;
        // Contar usuarios válidos
        for (uint256 i = 1; i < nextUserId; i++) {
            if (users[i].id != 0) {
                count++;
            }
        }

        User[] memory userList = new User[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i < nextUserId; i++) {
            if (users[i].id != 0) {
                userList[idx++] = users[i];
            }
        }
        return userList;
    }

    // Función para verificar si un usuario está registrado
    function isUserRegistered(address userAddress) public view returns (bool) {
        return addressToUserId[userAddress] != 0;
    }

    // Implementación de ERC165 para evitar errores cuando ethers.js verifica interfaces
    function supportsInterface(bytes4 interfaceId) public pure override returns (bool) {
        // Retornar false para todas las interfaces excepto ERC165
        // Esto evita que ethers.js falle al verificar interfaces no soportadas
        return interfaceId == type(IERC165).interfaceId;
    }

    // Funciones stub para evitar errores cuando ethers.js intenta detectar automáticamente
    // el tipo de contrato (ERC20, ERC721, etc.)
    // Estas funciones retornan valores por defecto o revertirán de forma controlada
    
    // ERC20 decimals() - ethers.js puede llamar esto para detectar tokens ERC20
    // Retornamos 18 (estándar) pero el contrato no es un token ERC20
    function decimals() public pure returns (uint8) {
        return 18;
    }
    
    // ERC20 symbol() - ethers.js puede llamar esto
    function symbol() public pure returns (string memory) {
        return "SC";
    }
    
    // ERC20 name() - ethers.js puede llamar esto
    function name() public pure returns (string memory) {
        return "SupplyChain";
    }
    
    // ERC20 totalSupply() - ethers.js puede llamar esto
    // Retornamos 0 ya que no es un token ERC20 estándar
    function totalSupply() public view returns (uint256) {
        return 0;
    }
    
    // ERC20 balanceOf(address) - ethers.js puede llamar esto para detectar tokens ERC20
    // Retornamos 0 ya que no es un token ERC20 estándar
    function balanceOf(address) public pure returns (uint256) {
        return 0;
    }

    // Funciones para obtener actividades/historial

    // Obtener una actividad específica
    function getActivity(uint256 activityId) public view returns (Activity memory) {
        require(activities[activityId].id != 0, "Activity not found");
        return activities[activityId];
    }

    // Obtener todas las actividades (útil para consultar el historial completo)
    // Optimizado: solo retorna hasta 1000 actividades más recientes para evitar problemas de gas
    function getAllActivities() public view returns (Activity[] memory) {
        uint256 total = nextActivityId > 1 ? nextActivityId - 1 : 0;
        uint256 maxReturn = total > 1000 ? 1000 : total;
        uint256 start = total > maxReturn ? total - maxReturn + 1 : 1;
        
        Activity[] memory activityList = new Activity[](maxReturn);
        uint256 idx = 0;
        
        for (uint256 i = start; i < nextActivityId; i++) {
            activityList[idx++] = activities[i];
        }
        
        return activityList;
    }

    // Obtener actividades por tipo (optimizado: límite de 500 resultados)
    function getActivitiesByType(ActivityType activityType) public view returns (Activity[] memory) {
        uint256 maxResults = 500;
        Activity[] memory temp = new Activity[](maxResults);
        uint256 count = 0;
        
        // Iterar desde el final para obtener las más recientes
        uint256 start = nextActivityId > maxResults ? nextActivityId - maxResults : 1;
        for (uint256 i = start; i < nextActivityId && count < maxResults; i++) {
            if (activities[i].activityType == activityType) {
                temp[count++] = activities[i];
            }
        }
        
        // Crear array del tamaño correcto
        Activity[] memory result = new Activity[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }
        return result;
    }

    // Obtener actividades por actor (optimizado: límite de 500 resultados)
    function getActivitiesByActor(address actor) public view returns (Activity[] memory) {
        uint256 maxResults = 500;
        Activity[] memory temp = new Activity[](maxResults);
        uint256 count = 0;
        
        // Iterar desde el final para obtener las más recientes
        uint256 start = nextActivityId > maxResults ? nextActivityId - maxResults : 1;
        for (uint256 i = start; i < nextActivityId && count < maxResults; i++) {
            if (activities[i].actor == actor) {
                temp[count++] = activities[i];
            }
        }
        
        // Crear array del tamaño correcto
        Activity[] memory result = new Activity[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }
        return result;
    }

    // Obtener el total de actividades registradas
    function getTotalActivities() public view returns (uint256) {
        return nextActivityId > 1 ? nextActivityId - 1 : 0;
    }

    // Función pública para registrar eventos de lote (ej: Cosecha, Secado, Transporte, etc.)
    function recordBatchEvent(
        uint256 tokenId,
        string memory eventType,
        string memory location,
        string memory metadata
    ) public {
        require(tokens[tokenId].id != 0, "Token not found");
        uint256 uid = addressToUserId[msg.sender];
        require(uid != 0, "User not registered");
        require(users[uid].status == UserStatus.Approved, "User not approved");
        
        // Crear descripción combinando tipo de evento y ubicación
        string memory description = string(abi.encodePacked(eventType, " - ", location));
        if (bytes(metadata).length > 0) {
            description = string(abi.encodePacked(description, " | ", metadata));
        }
        
        // Registrar como actividad BatchEvent
        _recordActivity(ActivityType.BatchEvent, msg.sender, tokenId, description);
    }

    // Función auxiliar simplificada para convertir uint256 a string
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
        uint256 temp = _i;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (_i != 0) {
            digits -= 1;
            // casting to 'uint8' is safe because (_i % 10) is always 0-9, and 48 + (0-9) = 48-57, which fits in uint8
            // forge-lint: disable-next-line(unsafe-typecast)
            buffer[digits] = bytes1(uint8(48 + uint256(_i % 10)));
            _i /= 10;
        }
        return string(buffer);
    }
}
