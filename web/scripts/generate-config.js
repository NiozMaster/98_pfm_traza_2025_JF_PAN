// Script para generar el archivo config.ts con el ABI del contrato
const fs = require('fs');
const path = require('path');

// Dirección del contrato - puede ser sobrescrita por variable de entorno
// Valor por defecto para desarrollo local (Anvil)
const DEFAULT_CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || DEFAULT_CONTRACT_ADDRESS;

// Intentar leer el ABI del contrato compilado
const contractJsonPath = path.join(__dirname, '../../sc/out/SupplyChain.sol/SupplyChain.json');
let abi = [];

try {
  if (fs.existsSync(contractJsonPath)) {
    const contractJson = JSON.parse(fs.readFileSync(contractJsonPath, 'utf8'));
    abi = contractJson.abi || [];
    console.log('✅ ABI leído desde el contrato compilado');
  } else {
    console.log('⚠️ No se encontró el contrato compilado, usando ABI hardcodeado');
    // ABI hardcodeado basado en el contrato actual
    abi = getHardcodedABI();
  }
} catch (error) {
  console.error('❌ Error al leer el contrato compilado:', error.message);
  console.log('📝 Usando ABI hardcodeado como fallback');
  abi = getHardcodedABI();
}

// Generar el contenido del archivo config.ts
const configContent = generateConfigFile(abi, CONTRACT_ADDRESS);

// Escribir el archivo
const configPath = path.join(__dirname, '../src/contracts/config.ts');
fs.writeFileSync(configPath, configContent, 'utf8');

console.log('✅ Archivo config.ts generado exitosamente');
console.log(`📦 Total de funciones: ${abi.filter(item => item.type === 'function').length}`);
console.log(`🔍 Total de eventos: ${abi.filter(item => item.type === 'event').length}`);
console.log(`📄 Archivo generado en: ${configPath}`);

function getHardcodedABI() {
  // ABI completo basado en el contrato SupplyChain.sol actual
  return [
    {
      "type": "constructor",
      "inputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "acceptTransfer",
      "inputs": [{"name": "transferId", "type": "uint256", "internalType": "uint256"}],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "addressToUserId",
      "inputs": [{"name": "", "type": "address", "internalType": "address"}],
      "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "admin",
      "inputs": [],
      "outputs": [{"name": "", "type": "address", "internalType": "address"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "changeStatusUser",
      "inputs": [
        {"name": "userAddress", "type": "address", "internalType": "address"},
        {"name": "newStatus", "type": "uint8", "internalType": "enum SupplyChain.UserStatus"}
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "createToken",
      "inputs": [
        {"name": "name", "type": "string", "internalType": "string"},
        {"name": "totalSupply", "type": "uint256", "internalType": "uint256"},
        {"name": "features", "type": "string", "internalType": "string"},
        {"name": "parentId", "type": "uint256", "internalType": "uint256"}
      ],
      "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "decimals",
      "inputs": [],
      "outputs": [{"name": "", "type": "uint8", "internalType": "uint8"}],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "getAllUserTokens",
      "inputs": [{"name": "userAddress", "type": "address", "internalType": "address"}],
      "outputs": [{"name": "", "type": "uint256[]", "internalType": "uint256[]"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getAllUsers",
      "inputs": [],
      "outputs": [{
        "components": [
          {"name": "id", "type": "uint256", "internalType": "uint256"},
          {"name": "userAddress", "type": "address", "internalType": "address"},
          {"name": "role", "type": "string", "internalType": "string"},
          {"name": "status", "type": "uint8", "internalType": "enum SupplyChain.UserStatus"}
        ],
        "name": "",
        "type": "tuple[]",
        "internalType": "struct SupplyChain.User[]"
      }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getPendingTransfers",
      "inputs": [{"name": "userAddress", "type": "address", "internalType": "address"}],
      "outputs": [{"name": "", "type": "uint256[]", "internalType": "uint256[]"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getToken",
      "inputs": [{"name": "tokenId", "type": "uint256", "internalType": "uint256"}],
      "outputs": [{
        "components": [
          {"name": "id", "type": "uint256", "internalType": "uint256"},
          {"name": "creator", "type": "address", "internalType": "address"},
          {"name": "name", "type": "string", "internalType": "string"},
          {"name": "totalSupply", "type": "uint256", "internalType": "uint256"},
          {"name": "features", "type": "string", "internalType": "string"},
          {"name": "parentId", "type": "uint256", "internalType": "uint256"},
          {"name": "dateCreated", "type": "uint256", "internalType": "uint256"}
        ],
        "name": "",
        "type": "tuple",
        "internalType": "struct SupplyChain.Token"
      }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTokenBalance",
      "inputs": [
        {"name": "tokenId", "type": "uint256", "internalType": "uint256"},
        {"name": "userAddress", "type": "address", "internalType": "address"}
      ],
      "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTokensByCreator",
      "inputs": [{"name": "creatorAddress", "type": "address", "internalType": "address"}],
      "outputs": [{"name": "", "type": "uint256[]", "internalType": "uint256[]"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTotalTokens",
      "inputs": [],
      "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getTransfer",
      "inputs": [{"name": "transferId", "type": "uint256", "internalType": "uint256"}],
      "outputs": [{
        "components": [
          {"name": "id", "type": "uint256", "internalType": "uint256"},
          {"name": "from", "type": "address", "internalType": "address"},
          {"name": "to", "type": "address", "internalType": "address"},
          {"name": "tokenId", "type": "uint256", "internalType": "uint256"},
          {"name": "dateCreated", "type": "uint256", "internalType": "uint256"},
          {"name": "amount", "type": "uint256", "internalType": "uint256"},
          {"name": "status", "type": "uint8", "internalType": "enum SupplyChain.TransferStatus"}
        ],
        "name": "",
        "type": "tuple",
        "internalType": "struct SupplyChain.Transfer"
      }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getUserInfo",
      "inputs": [{"name": "userAddress", "type": "address", "internalType": "address"}],
      "outputs": [{
        "components": [
          {"name": "id", "type": "uint256", "internalType": "uint256"},
          {"name": "userAddress", "type": "address", "internalType": "address"},
          {"name": "role", "type": "string", "internalType": "string"},
          {"name": "status", "type": "uint8", "internalType": "enum SupplyChain.UserStatus"}
        ],
        "name": "",
        "type": "tuple",
        "internalType": "struct SupplyChain.User"
      }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getUserTokens",
      "inputs": [{"name": "userAddress", "type": "address", "internalType": "address"}],
      "outputs": [{"name": "", "type": "uint256[]", "internalType": "uint256[]"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getUserTransfers",
      "inputs": [{"name": "userAddress", "type": "address", "internalType": "address"}],
      "outputs": [{"name": "", "type": "uint256[]", "internalType": "uint256[]"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "getValidTokensCount",
      "inputs": [],
      "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isAdmin",
      "inputs": [{"name": "userAddress", "type": "address", "internalType": "address"}],
      "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "isUserRegistered",
      "inputs": [{"name": "userAddress", "type": "address", "internalType": "address"}],
      "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "name",
      "inputs": [],
      "outputs": [{"name": "", "type": "string", "internalType": "string"}],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "nextTokenId",
      "inputs": [],
      "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "nextTransferId",
      "inputs": [],
      "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "nextUserId",
      "inputs": [],
      "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "registerUserByAdmin",
      "inputs": [
        {"name": "userAddress", "type": "address", "internalType": "address"},
        {"name": "role", "type": "string", "internalType": "string"},
        {"name": "status", "type": "uint8", "internalType": "enum SupplyChain.UserStatus"}
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "rejectTransfer",
      "inputs": [{"name": "transferId", "type": "uint256", "internalType": "uint256"}],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "requestUserRole",
      "inputs": [{"name": "role", "type": "string", "internalType": "string"}],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "inputs": [{"name": "interfaceId", "type": "bytes4", "internalType": "bytes4"}],
      "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "symbol",
      "inputs": [],
      "outputs": [{"name": "", "type": "string", "internalType": "string"}],
      "stateMutability": "pure"
    },
    {
      "type": "function",
      "name": "tokens",
      "inputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "outputs": [{
        "components": [
          {"name": "id", "type": "uint256", "internalType": "uint256"},
          {"name": "creator", "type": "address", "internalType": "address"},
          {"name": "name", "type": "string", "internalType": "string"},
          {"name": "totalSupply", "type": "uint256", "internalType": "uint256"},
          {"name": "features", "type": "string", "internalType": "string"},
          {"name": "parentId", "type": "uint256", "internalType": "uint256"},
          {"name": "dateCreated", "type": "uint256", "internalType": "uint256"}
        ],
        "name": "",
        "type": "tuple",
        "internalType": "struct SupplyChain.Token"
      }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "totalSupply",
      "inputs": [],
      "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "transfer",
      "inputs": [
        {"name": "to", "type": "address", "internalType": "address"},
        {"name": "tokenId", "type": "uint256", "internalType": "uint256"},
        {"name": "amount", "type": "uint256", "internalType": "uint256"}
      ],
      "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "transfers",
      "inputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "outputs": [{
        "components": [
          {"name": "id", "type": "uint256", "internalType": "uint256"},
          {"name": "from", "type": "address", "internalType": "address"},
          {"name": "to", "type": "address", "internalType": "address"},
          {"name": "tokenId", "type": "uint256", "internalType": "uint256"},
          {"name": "dateCreated", "type": "uint256", "internalType": "uint256"},
          {"name": "amount", "type": "uint256", "internalType": "uint256"},
          {"name": "status", "type": "uint8", "internalType": "enum SupplyChain.TransferStatus"}
        ],
        "name": "",
        "type": "tuple",
        "internalType": "struct SupplyChain.Transfer"
      }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "users",
      "inputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
      "outputs": [{
        "components": [
          {"name": "id", "type": "uint256", "internalType": "uint256"},
          {"name": "userAddress", "type": "address", "internalType": "address"},
          {"name": "role", "type": "string", "internalType": "string"},
          {"name": "status", "type": "uint8", "internalType": "enum SupplyChain.UserStatus"}
        ],
        "name": "",
        "type": "tuple",
        "internalType": "struct SupplyChain.User"
      }],
      "stateMutability": "view"
    },
    {
      "type": "event",
      "name": "TokenCreated",
      "inputs": [
        {"name": "tokenId", "type": "uint256", "indexed": true, "internalType": "uint256"},
        {"name": "creator", "type": "address", "indexed": true, "internalType": "address"},
        {"name": "name", "type": "string", "indexed": false, "internalType": "string"},
        {"name": "totalSupply", "type": "uint256", "indexed": false, "internalType": "uint256"}
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "TransferAccepted",
      "inputs": [
        {"name": "transferId", "type": "uint256", "indexed": true, "internalType": "uint256"}
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "TransferRejected",
      "inputs": [
        {"name": "transferId", "type": "uint256", "indexed": true, "internalType": "uint256"}
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "TransferRequested",
      "inputs": [
        {"name": "transferId", "type": "uint256", "indexed": true, "internalType": "uint256"},
        {"name": "from", "type": "address", "indexed": true, "internalType": "address"},
        {"name": "to", "type": "address", "indexed": true, "internalType": "address"},
        {"name": "tokenId", "type": "uint256", "indexed": false, "internalType": "uint256"},
        {"name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256"}
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "UserRoleRequested",
      "inputs": [
        {"name": "user", "type": "address", "indexed": true, "internalType": "address"},
        {"name": "role", "type": "string", "indexed": false, "internalType": "string"}
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "UserStatusChanged",
      "inputs": [
        {"name": "user", "type": "address", "indexed": true, "internalType": "address"},
        {"name": "status", "type": "uint8", "indexed": false, "internalType": "enum SupplyChain.UserStatus"}
      ],
      "anonymous": false
    }
  ];
}

function generateConfigFile(abi, address) {
  // Formatear el ABI con indentación correcta
  const abiString = JSON.stringify(abi, null, 2)
    .split('\n')
    .map((line, index, array) => {
      // Agregar comas después de cada elemento excepto el último
      const trimmed = line.trim();
      if (index < array.length - 1 && trimmed !== ']' && trimmed !== '[') {
        if (trimmed.endsWith('}') || trimmed.endsWith(']')) {
          return line + ',';
        }
      }
      return line;
    })
    .join('\n');

  return `// Dirección del contrato - puede ser sobrescrita por variable de entorno
export const CONTRACT_ADDRESS = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) ||
  "${address}";

export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS,
  abi: ${abiString}
}
`;
}

