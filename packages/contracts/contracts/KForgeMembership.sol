// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title KForgeMembership
 * @dev TRC20 支付接口
 */
interface ITRC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title KForge Global Defense Network - Membership Contract
 * @dev 核心订阅与授权智能合约
 */
contract KForgeMembership {
    address public owner;
    ITRC20 public usdtToken;

    // 订阅计划 (Tiers)
    uint256 public constant PRO_PRICE = 49 * 10**6;        // 49 USDT (TRC20 decimals 6)
    uint256 public constant ENTERPRISE_PRICE = 299 * 10**6; // 299 USDT

    struct Subscription {
        uint256 expiresAt;
        string tier;
        bool isActive;
    }

    mapping(address => Subscription) public members;

    event SubscriptionPurchased(address indexed subscriber, string tier, uint256 amount, uint256 expiresAt);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _usdtTokenAddress) {
        owner = msg.sender;
        usdtToken = ITRC20(_usdtTokenAddress);
    }

    /**
     * @dev 客户通过前端调用此方法，授权并支付 USDT 购买会员
     * @param tier "Pro" 或 "Enterprise"
     */
    function purchaseSubscription(string memory tier) external {
        uint256 price;
        uint256 duration = 30 days; // 包月

        if (keccak256(abi.encodePacked(tier)) == keccak256(abi.encodePacked("Pro"))) {
            price = PRO_PRICE;
        } else if (keccak256(abi.encodePacked(tier)) == keccak256(abi.encodePacked("Enterprise"))) {
            price = ENTERPRISE_PRICE;
        } else {
            revert("Invalid tier");
        }

        // 转移 USDT 到合约地址 (客户需先调用 USDT 的 approve)
        require(usdtToken.transferFrom(msg.sender, address(this), price), "USDT transfer failed");

        // 计算新的过期时间 (如果未过期则续期)
        uint256 newExpiry = block.timestamp + duration;
        if (members[msg.sender].isActive && members[msg.sender].expiresAt > block.timestamp) {
            newExpiry = members[msg.sender].expiresAt + duration;
        }

        members[msg.sender] = Subscription({
            expiresAt: newExpiry,
            tier: tier,
            isActive: true
        });

        // 抛出事件，供后端 Daemon 监听并自动下发 Token
        emit SubscriptionPurchased(msg.sender, tier, price, newExpiry);
    }

    /**
     * @dev 检查钱包地址的会员状态 (供后端双重校验使用)
     */
    function checkMembership(address subscriber) external view returns (bool isActive, string memory tier, uint256 expiresAt) {
        Subscription memory sub = members[subscriber];
        bool active = sub.isActive && sub.expiresAt > block.timestamp;
        return (active, sub.tier, sub.expiresAt);
    }

    /**
     * @dev CEO 提现利润
     */
    function withdrawUSDT() external onlyOwner {
        uint256 balance = usdtToken.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        require(usdtToken.transferFrom(address(this), owner, balance), "Withdrawal failed");
        emit FundsWithdrawn(owner, balance);
    }
}
