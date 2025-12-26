// Script para actualizar el ABI del contrato en el frontend
const fs = require('fs');
const path = require('path');

// Leer el ABI del contrato compilado
const contractJsonPath = path.join(__dirname, '../../sc/out/SupplyChain.sol/SupplyChain.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath, 'utf8'));
const abi = contractJson.abi;

// Leer el archivo de configuración actual
const configPath = path.join(__dirname, '../src/contracts/config.ts');
let configContent = fs.readFileSync(configPath, 'utf8');

// Reemplazar el ABI en el archivo de configuración
// El ABI está en formato: abi: [{"abi":[...]}]
// Necesitamos reemplazarlo con el nuevo ABI
const abiString = JSON.stringify(abi, null, 2);

// Buscar y reemplazar el ABI
const abiRegex = /abi:\s*\[.*?\]/s;
const newAbiLine = `abi: ${abiString}`;

if (abiRegex.test(configContent)) {
  configContent = configContent.replace(abiRegex, newAbiLine);
  fs.writeFileSync(configPath, configContent, 'utf8');
  console.log('✅ ABI actualizado exitosamente');
  console.log(`📦 Funciones encontradas: ${abi.filter(item => item.type === 'function').length}`);
  console.log(`🔍 Funciones nuevas:`, abi
    .filter(item => item.type === 'function' && ['registerUserByAdmin', 'getAllUsers', 'isUserRegistered', 'getAllUserTokens', 'getTotalTokens', 'getPendingTransfers', 'getValidTokensCount'].includes(item.name))
    .map(item => item.name)
    .join(', '));
} else {
  console.error('❌ No se pudo encontrar el ABI en el archivo de configuración');
  console.log('El archivo debe tener el formato: abi: [...]');
}

