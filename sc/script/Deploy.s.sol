// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/SupplyChain.sol";

contract DeployScript is Script {
    function run() public {
        vm.startBroadcast();
        new SupplyChain();
        vm.stopBroadcast();
    }
}
