import { ethers } from 'ethers'
import { CONTRACT_CONFIG, CONTRACT_ADDRESS } from '../contracts/config'

// ABI completo del contrato SupplyChain con todas las funciones
const SUPPLY_CHAIN_ABI = [
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
    "name": "supportsInterface",
    "inputs": [{"name": "interfaceId", "type": "bytes4", "internalType": "bytes4"}],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint8", "internalType": "uint8"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{"name": "", "type": "string", "internalType": "string"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{"name": "", "type": "string", "internalType": "string"}],
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
  }
] as const

// Extraer el ABI del config (está anidado de forma extraña)
const getABI = () => {
  try {
    // Intentar usar el ABI completo primero
    if (SUPPLY_CHAIN_ABI && Array.isArray(SUPPLY_CHAIN_ABI)) {
      return SUPPLY_CHAIN_ABI
    }
    
    // Fallback al ABI del config
    const abiData = CONTRACT_CONFIG.abi[0] as any
    if (abiData && typeof abiData === 'object') {
      if (abiData.abi && Array.isArray(abiData.abi)) {
        return abiData.abi
      }
      if (Array.isArray(abiData) || (abiData.type && abiData.name)) {
        return CONTRACT_CONFIG.abi
      }
    }
    if (Array.isArray(CONTRACT_CONFIG.abi)) {
      return CONTRACT_CONFIG.abi
    }
    return CONTRACT_CONFIG.abi
  } catch (error) {
    console.error('Error al extraer ABI:', error)
    return CONTRACT_CONFIG.abi
  }
}

// Función para verificar que el contrato existe y está desplegado
export async function verifyContract() {
  try {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask no está disponible')
    }

    const provider = new ethers.BrowserProvider((window as any).ethereum)
    const code = await provider.getCode(CONTRACT_ADDRESS)
    
    if (code === '0x' || code === '0x0') {
      throw new Error(`No hay código en la dirección ${CONTRACT_ADDRESS}. El contrato no está desplegado.`)
    }
    
    console.log('✅ Contrato verificado en:', CONTRACT_ADDRESS)
    return true
  } catch (error: any) {
    console.error('❌ Error al verificar contrato:', error)
    throw error
  }
}

export async function getContract() {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('MetaMask no está disponible')
  }

  // Verificar que el contrato existe antes de crear la instancia
  await verifyContract()

  const provider = new ethers.BrowserProvider((window as any).ethereum)
  const signer = await provider.getSigner()
  const abi = getABI()
  
  // Crear el contrato con opciones que eviten verificaciones automáticas de interfaces
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer)
  
  // Verificar que el contrato tiene funciones básicas
  if (!contract.getToken && !contract.admin) {
    console.warn('⚠️ El contrato puede no tener las funciones esperadas')
  }
  
  return contract
}

export async function getContractReadOnly() {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('MetaMask no está disponible')
  }

  // Verificar que el contrato existe antes de crear la instancia
  await verifyContract()

  const provider = new ethers.BrowserProvider((window as any).ethereum)
  const abi = getABI()
  
  // Crear el contrato con opciones que eviten verificaciones automáticas de interfaces
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)
  
  // Verificar que el contrato tiene funciones básicas
  if (!contract.getToken && !contract.admin) {
    console.warn('⚠️ El contrato puede no tener las funciones esperadas')
  }
  
  return contract
}

