// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";

import "./ICafeMarket.sol";

contract Kamin is ERC20, Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address public trustedSigner;

    mapping(address => bool) public validMarkets;
    mapping(uint256 => bool) public usedOrderIds;

    event OrderConfirmed(
        address indexed user,
        address indexed market,
        string menuName,
        uint256 indexed orderId,
        uint256 rewardAmount
    );

    constructor(address _trustedSigner)
        ERC20("Kamin Token", "KAMIN")
        Ownable(msg.sender)
    {
        trustedSigner = _trustedSigner;
    }

    function setMarket(address market, bool isValid) external onlyOwner {
        validMarkets[market] = isValid;
    }

    function confirmOrder(
        address market,
        string calldata menuName,
        uint256 orderId,
        uint256 rewardAmount,
        bytes calldata signature
    ) external {
        require(validMarkets[market], "invalid market");
        require(!usedOrderIds[orderId], "already used");

        bytes32 hash = keccak256(
            abi.encodePacked(
                msg.sender,
                market,
                menuName,
                orderId,
                rewardAmount,
                block.chainid
            )
        );

        address signer = hash.toEthSignedMessageHash().recover(signature);
        require(signer == trustedSigner, "invalid sig");

        usedOrderIds[orderId] = true;

        ICafeMarket(market).recordOrder(msg.sender, menuName, orderId);

        _mint(msg.sender, rewardAmount);

        emit OrderConfirmed(msg.sender, market, menuName, orderId, rewardAmount);
    }
}
