// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./ICafeMarket.sol";

contract CafeMarket is ICafeMarket {
    /// @notice Kamin 컨트랙트 주소 (immutable → 가스 절약)
    address public immutable kamin;

    /// @notice 브랜드 이름 (프론트 표시용)
    string public brandName;

    /// @notice Kamin만 호출 가능
    modifier onlyKamin() {
        require(msg.sender == kamin, "only Kamin");
        _;
    }

    /// @param _kamin Kamin 컨트랙트 주소
    /// @param _brandName 브랜드 이름 (Starbucks, Twosome 등)
    constructor(address _kamin, string memory _brandName) {
        require(_kamin != address(0), "invalid kamin");
        kamin = _kamin;
        brandName = _brandName;
    }

    /// @notice 주문 기록 이벤트 (DB/indexer용 핵심)
    event OrderRecorded(
        address indexed user,
        string menuName,
        uint256 indexed orderId,
        uint256 timestamp
    );

    /// @notice Kamin이 호출해서 주문 기록만 남김
    function recordOrder(
        address user,
        string calldata menuName,
        uint256 orderId
    ) external override onlyKamin {
        emit OrderRecorded(user, menuName, orderId, block.timestamp);
    }
}