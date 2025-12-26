// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/SupplyChain.sol";

contract SupplyChainTest is Test {
    SupplyChain sc;
    address producer = address(0x100);
    address factory = address(0x101);

    function setUp() public {
        sc = new SupplyChain();
    }

    function testUserRegistration() public {
        vm.prank(producer);
        sc.requestUserRole("Producer");

        SupplyChain.User memory user = sc.getUserInfo(producer);
        assertEq(user.userAddress, producer);
        assertEq(uint8(user.status), uint8(SupplyChain.UserStatus.Pending));
    }

    function testAdminApproveUserAndCreateToken() public {
        // register
        vm.prank(producer);
        sc.requestUserRole("Producer");

        // admin (this contract) approves
        sc.changeStatusUser(producer, SupplyChain.UserStatus.Approved);

        // producer creates token
        vm.prank(producer);
        uint256 tokenId = sc.createToken("Wheat", 1000, "{\"origin\":\"farm\"}", 0);

        SupplyChain.Token memory t = sc.getToken(tokenId);
        assertEq(t.creator, producer);
        assertEq(t.totalSupply, 1000);
        uint256 bal = sc.getTokenBalance(tokenId, producer);
        assertEq(bal, 1000);
    }

    function testTransferFlowAccepted() public {
        // set up users
        vm.prank(producer);
        sc.requestUserRole("Producer");
        sc.changeStatusUser(producer, SupplyChain.UserStatus.Approved);

        vm.prank(factory);
        sc.requestUserRole("Factory");
        sc.changeStatusUser(factory, SupplyChain.UserStatus.Approved);

        // producer creates token
        vm.prank(producer);
        uint256 tokenId = sc.createToken("Corn", 500, "{}", 0);

        // producer requests transfer to factory
        vm.prank(producer);
        uint256 transferId = sc.transfer(factory, tokenId, 200);

        // recipient accepts
        vm.prank(factory);
        sc.acceptTransfer(transferId);

        uint256 balProducer = sc.getTokenBalance(tokenId, producer);
        uint256 balFactory = sc.getTokenBalance(tokenId, factory);
        assertEq(balProducer, 300);
        assertEq(balFactory, 200);
    }
}
