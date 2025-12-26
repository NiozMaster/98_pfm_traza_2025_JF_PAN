// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {SupplyChain} from "../src/SupplyChain.sol";

contract DeployScript is Script {
    function run() public {
        // Usar la primera cuenta de Anvil (tiene fondos por defecto)
        // Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
        // Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
        uint256 deployerPrivateKey;
        
        // Intentar obtener PRIVATE_KEY del .env, si no existe usar la de Anvil por defecto
        try vm.envUint("PRIVATE_KEY") returns (uint256 key) {
            deployerPrivateKey = key;
        } catch {
            // Usar la clave privada de Anvil por defecto
            deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        }
        
        vm.startBroadcast(deployerPrivateKey);
        SupplyChain supplyChain = new SupplyChain();
        vm.stopBroadcast();
        
        // Log de la dirección del contrato desplegado
        console.log("SupplyChain deployed at:", address(supplyChain));
    }
}
