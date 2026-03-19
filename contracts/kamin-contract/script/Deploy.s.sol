// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/Kamin.sol";
import "../src/CafeMarket.sol";

contract Deploy is Script {
    function run() external {
        // 1. 환경변수에서 private key 읽기
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // 2. signer (지금은 deployer = signer로 사용)
        address trustedSigner = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        // 3. Kamin 배포
        Kamin kamin = new Kamin(trustedSigner);
        console.log("Kamin deployed:", address(kamin));

        // 4. CafeMarket 여러 개 생성 (핵심)
        CafeMarket starbucks = new CafeMarket(address(kamin), "Starbucks");
        console.log("StarbucksMarket:", address(starbucks));

        CafeMarket twosome = new CafeMarket(address(kamin), "Twosome");
        console.log("TwosomeMarket:", address(twosome));

        CafeMarket mega = new CafeMarket(address(kamin), "Mega");
        console.log("MegaMarket:", address(mega));

        // 5. Kamin에 whitelist 등록
        kamin.setMarket(address(starbucks), true);
        kamin.setMarket(address(twosome), true);
        kamin.setMarket(address(mega), true);

        console.log("Markets registered");

        vm.stopBroadcast();
    }
}