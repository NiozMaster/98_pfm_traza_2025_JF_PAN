// Dirección del contrato - puede ser sobrescrita por variable de entorno
export const CONTRACT_ADDRESS = 
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_CONFIG = {
  address: CONTRACT_ADDRESS,
  abi: [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "acceptTransfer",
    "inputs": [
      {
        "name": "transferId",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "activities",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "activityType",
        "type": "uint8",
        "internalType": "enum SupplyChain.ActivityType"
      },
      {
        "name": "actor",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "relatedId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "description",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "data",
        "type": "bytes",
        "internalType": "bytes"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addressToUserId",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "admin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "changeStatusUser",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "newStatus",
        "type": "uint8",
        "internalType": "enum SupplyChain.UserStatus"
      },
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "createToken",
    "inputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "totalSupply",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "features",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "parentId",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      },
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "getActivitiesByActor",
    "inputs": [
      {
        "name": "actor",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct SupplyChain.Activity[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "activityType",
            "type": "uint8",
            "internalType": "enum SupplyChain.ActivityType"
          },
          {
            "name": "actor",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "relatedId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
        ]
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActivitiesByType",
    "inputs": [
      {
        "name": "activityType",
        "type": "uint8",
        "internalType": "enum SupplyChain.ActivityType"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct SupplyChain.Activity[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "activityType",
            "type": "uint8",
            "internalType": "enum SupplyChain.ActivityType"
          },
          {
            "name": "actor",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "relatedId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
        ]
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getActivity",
    "inputs": [
      {
        "name": "activityId",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct SupplyChain.Activity",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "activityType",
            "type": "uint8",
            "internalType": "enum SupplyChain.ActivityType"
          },
          {
            "name": "actor",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "relatedId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
        ]
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllActivities",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct SupplyChain.Activity[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "activityType",
            "type": "uint8",
            "internalType": "enum SupplyChain.ActivityType"
          },
          {
            "name": "actor",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "relatedId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "description",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "data",
            "type": "bytes",
            "internalType": "bytes"
          },
        ]
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllUserTokens",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAllUsers",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct SupplyChain.User[]",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "userAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "role",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum SupplyChain.UserStatus"
          },
        ]
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPendingTransfers",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getToken",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct SupplyChain.Token",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "creator",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "totalSupply",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "features",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "parentId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "dateCreated",
            "type": "uint256",
            "internalType": "uint256"
          },
        ]
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTokenBalance",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTokensByCreator",
    "inputs": [
      {
        "name": "creatorAddress",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalActivities",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalTokens",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTransfer",
    "inputs": [
      {
        "name": "transferId",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct SupplyChain.Transfer",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "from",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "to",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "tokenId",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "dateCreated",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum SupplyChain.TransferStatus"
          },
        ]
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserInfo",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct SupplyChain.User",
        "components": [
          {
            "name": "id",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "userAddress",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "role",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "status",
            "type": "uint8",
            "internalType": "enum SupplyChain.UserStatus"
          },
        ]
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserTokens",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserTransfers",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getValidTokensCount",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isAdmin",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isUserRegistered",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      },
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "nextActivityId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextTokenId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextTransferId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextUserId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "recordBatchEvent",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "eventType",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "location",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "metadata",
        "type": "string",
        "internalType": "string"
      },
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerUserByAdmin",
    "inputs": [
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "role",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "status",
        "type": "uint8",
        "internalType": "enum SupplyChain.UserStatus"
      },
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "rejectTransfer",
    "inputs": [
      {
        "name": "transferId",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "requestUserRole",
    "inputs": [
      {
        "name": "role",
        "type": "string",
        "internalType": "string"
      },
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "supportsInterface",
    "inputs": [
      {
        "name": "interfaceId",
        "type": "bytes4",
        "internalType": "bytes4"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      },
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      },
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "tokens",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "creator",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "totalSupply",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "features",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "parentId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "dateCreated",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transfer",
    "inputs": [
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transfers",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "from",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "dateCreated",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "status",
        "type": "uint8",
        "internalType": "enum SupplyChain.TransferStatus"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "users",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
    ],
    "outputs": [
      {
        "name": "id",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "userAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "role",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "status",
        "type": "uint8",
        "internalType": "enum SupplyChain.UserStatus"
      },
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ActivityRecorded",
    "inputs": [
      {
        "name": "activityId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "activityType",
        "type": "uint8",
        "indexed": true,
        "internalType": "enum SupplyChain.ActivityType"
      },
      {
        "name": "actor",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TokenCreated",
    "inputs": [
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "creator",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "totalSupply",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TransferAccepted",
    "inputs": [
      {
        "name": "transferId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TransferRejected",
    "inputs": [
      {
        "name": "transferId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TransferRequested",
    "inputs": [
      {
        "name": "transferId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "from",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "to",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "tokenId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserRoleRequested",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "role",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserStatusChanged",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "status",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum SupplyChain.UserStatus"
      },
    ],
    "anonymous": false
  },
]
}
