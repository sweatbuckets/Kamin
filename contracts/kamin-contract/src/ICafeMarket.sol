// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface ICafeMarket {
    function recordOrder(
        address user,
        string calldata menuName,
        uint256 orderId
    ) external;
}