// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/Kamin.sol";
import "../src/CafeMarket.sol";

contract DeployHollys is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address kaminAddress = vm.envAddress("KAMIN_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        Kamin kamin = Kamin(kaminAddress);
        CafeMarket hollys = new CafeMarket(address(kamin), "Hollys");

        console.log("HollysMarket:", address(hollys));

        kamin.setMarket(address(hollys), true);
        console.log("Hollys market registered");

        vm.stopBroadcast();
    }
}
